/**
 * ClinicalTrials.gov API v2 — Service Client
 * Handles: request construction, debouncing, retry, and minimal caching.
 */

const BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';
const FIELDS = [
  'NCTId',
  'BriefTitle',
  'OverallStatus',
  'Phase',
  'BriefSummary',
  'EligibilityCriteria',
  'LocationCountry',
  'LeadSponsorName',
  'StartDate',
  'CompletionDate',
  'StdAge',
].join(',');

// Simple in-memory cache — keyed by query string, 5-minute TTL
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Sleep helper for retry backoff
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search clinical trials by terms + optional filters.
 * @param {Object} params
 * @param {string[]} params.terms         - Search terms (condition / intervention)
 * @param {'RECRUITING'|'COMPLETED'|string} [params.status]
 * @param {string} [params.phase]
 * @param {string} [params.country]
 * @param {number} [params.limit]
 * @param {AbortSignal} [params.signal]   - AbortController signal for cancellation
 * @returns {Promise<{ trials: Trial[], totalCount: number }>}
 */
export async function searchTrials({
  terms = [],
  status = 'RECRUITING',
  phase,
  country,
  limit = 10,
  signal,
} = {}) {
  const query = terms.join(' ');
  const cacheKey = JSON.stringify({ query, status, phase, country, limit });

  // Return cached result if fresh
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    'query.cond': query,
    'filter.overallStatus': status,
    fields: FIELDS,
    pageSize: String(Math.min(limit, 20)),
    countTotal: 'true',
    format: 'json',
  });

  if (phase) params.set('filter.advanced', `AREA[Phase]${phase}`);
  if (country) params.set('filter.advanced', `${params.get('filter.advanced') ? params.get('filter.advanced') + ' AND ' : ''}AREA[LocationCountry]${country}`);

  const url = `${BASE_URL}?${params.toString()}`;

  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await sleep(2000); // Retry delay

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal,
      });

      if (response.status === 429) {
        if (attempt === 0) continue; // Retry once on rate limit
        throw new Error('ClinicalTrials.gov rate limit reached. Please wait a moment and try again.');
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      const result = {
        trials: (json.studies || []).map(formatTrial),
        totalCount: json.totalCount || 0,
      };

      setCache(cacheKey, result);
      return result;
    } catch (err) {
      if (err.name === 'AbortError') throw err; // Don't retry aborted requests
      lastError = err;
    }
  }

  throw lastError;
}

/**
 * Normalize the raw API study object into a flat, UI-friendly shape.
 * @param {Object} study - Raw study from ClinicalTrials.gov API v2
 * @returns {Trial}
 */
function formatTrial(study) {
  const p = study.protocolSection || {};
  const id = p.identificationModule || {};
  const status = p.statusModule || {};
  const desc = p.descriptionModule || {};
  const design = p.designModule || {};
  const eligibility = p.eligibilityModule || {};
  const contacts = p.contactsLocationsModule || {};
  const sponsor = p.sponsorCollaboratorsModule || {};

  // Extract country list from locations
  const countries = (contacts.locations || [])
    .map(loc => loc.country)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i) // unique
    .slice(0, 5);

  return {
    nctId: id.nctId || '',
    title: id.briefTitle || 'Untitled Study',
    status: status.overallStatus || 'UNKNOWN',
    phase: (design.phases || []).join(', ') || 'N/A',
    summary: desc.briefSummary || '',
    eligibility: eligibility.eligibilityCriteria || '',
    ageGroups: eligibility.stdAges || [],
    countries,
    sponsor: sponsor.leadSponsor?.name || '',
    startDate: status.startDateStruct?.date || '',
    completionDate: status.completionDateStruct?.date || '',
    url: `https://clinicaltrials.gov/study/${id.nctId}`,
  };
}
