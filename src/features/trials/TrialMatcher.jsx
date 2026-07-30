import React, { useState, useEffect, useMemo } from 'react';
import { usePatientProfile } from '../../context/PatientProfileContext';
import { getRecommendations } from '../../engine/pathwayRules';
import { searchTrials } from '../../services/clinicalTrialsApi';
import { SkeletonTrialCard } from '../../components/ui/SkeletonCard';
import ErrorState from '../../components/ui/ErrorState';
import { Sparkles, ExternalLink, MapPin, Building, Calendar, Filter, Heart } from 'lucide-react';
import './TrialMatcher.css';

export default function TrialMatcher() {
  const { profile } = usePatientProfile();
  const [trials, setTrials] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [phaseFilter, setPhaseFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const searchTerms = useMemo(() => {
    if (!profile.cancerType || !profile.stage) return [];
    const rec = getRecommendations(profile);
    return rec.trialSearchTerms || [profile.cancerType];
  }, [profile]);

  useEffect(() => {
    if (searchTerms.length === 0) {
      setTrials([]);
      setTotalCount(0);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchTrials({
      terms: searchTerms,
      phase: phaseFilter || undefined,
      country: countryFilter || undefined,
      limit: 10,
      signal: controller.signal,
    })
      .then(res => {
        setTrials(res.trials);
        setTotalCount(res.totalCount);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to fetch clinical trials.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [searchTerms, phaseFilter, countryFilter]);

  if (!profile.cancerType || !profile.stage) {
    return null;
  }

  return (
    <div className="trial-matcher animate-fade-in-up">
      {/* Header */}
      <div className="trial-header">
        <div className="trial-title-wrap">
          <div className="trial-badge">
            <Heart size={14} className="heart-icon" /> Expanding Options &amp; Hope
          </div>
          <h3 className="trial-title">
            Recruiting Clinical Trials ({loading ? '...' : totalCount})
          </h3>
          <p className="trial-subtitle">
            Real-time search against ClinicalTrials.gov for active recruiting clinical studies.
          </p>
        </div>

        {/* Filters */}
        <div className="trial-filters">
          <div className="trial-filter-item">
            <Filter size={13} />
            <select
              id="filter-phase"
              value={phaseFilter}
              onChange={e => setPhaseFilter(e.target.value)}
              className="trial-select"
            >
              <option value="">All Phases</option>
              <option value="PHASE3">Phase 3</option>
              <option value="PHASE2">Phase 2</option>
              <option value="PHASE1">Phase 1</option>
            </select>
          </div>

          <div className="trial-filter-item">
            <MapPin size={13} />
            <input
              id="filter-country"
              type="text"
              placeholder="Country (e.g. United States)"
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="trial-input"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="trial-list-skeleton">
          <SkeletonTrialCard />
          <SkeletonTrialCard />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={() => {
            setLoading(true);
            setError(null);
            searchTrials({ terms: searchTerms, limit: 10 })
              .then(res => {
                setTrials(res.trials);
                setTotalCount(res.totalCount);
                setLoading(false);
              })
              .catch(err => {
                setError(err.message);
                setLoading(false);
              });
          }}
        />
      )}

      {/* Empty */}
      {!loading && !error && trials.length === 0 && (
        <div className="trial-empty">
          <p>No recruiting trials currently match this search filter. Try clearing location or phase filters.</p>
        </div>
      )}

      {/* Trial List */}
      {!loading && !error && trials.length > 0 && (
        <div className="trial-list">
          {trials.map((trial, index) => (
            <div
              key={trial.nctId || index}
              className="trial-card animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="trial-card-header">
                <span className="trial-nct">{trial.nctId}</span>
                <span className="trial-phase-badge">{trial.phase}</span>
                <span className="trial-status-badge">Recruiting</span>
              </div>

              <h4 className="trial-card-title">{trial.title}</h4>

              {trial.summary && (
                <p className="trial-summary">
                  {trial.summary.length > 200
                    ? `${trial.summary.substring(0, 200)}...`
                    : trial.summary}
                </p>
              )}

              <div className="trial-meta">
                {trial.sponsor && (
                  <div className="trial-meta-item">
                    <Building size={12} />
                    <span>{trial.sponsor}</span>
                  </div>
                )}
                {trial.countries.length > 0 && (
                  <div className="trial-meta-item">
                    <MapPin size={12} />
                    <span>{trial.countries.join(', ')}</span>
                  </div>
                )}
                {trial.startDate && (
                  <div className="trial-meta-item">
                    <Calendar size={12} />
                    <span>Started: {trial.startDate}</span>
                  </div>
                )}
              </div>

              <a
                href={trial.url}
                target="_blank"
                rel="noreferrer"
                className="trial-link"
              >
                View Details on ClinicalTrials.gov <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
