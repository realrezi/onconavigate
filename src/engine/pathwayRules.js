/**
 * Clinical Pathway Rule Engine — Expanded (8 Major Cancer Domains)
 * Pure JavaScript — evidence-based oncology decision logic grounded in NCCN/ESMO guidelines.
 *
 * Supported domains:
 * 1. Prostate Cancer (mHSPC, mCRPC, HRR mutations, Lu-177 PSMA)
 * 2. Esophageal Cancer (ESCC, EAC, HER2+, PD-L1 CPS, CHECKMATE-648, KEYNOTE-590)
 * 3. Gastric Cancer (HER2+, Claudin 18.2 / Zolbetuximab, KEYNOTE-811, CHECKMATE-649)
 * 4. Colorectal Cancer (MSI-H, BRAF V600E, RAS WT + Sidedness per PARADIGM, BEACON)
 * 5. Non-Small Cell Lung Cancer (NSCLC) (EGFR Osimertinib, ALK Alectinib/Lorlatinib, KRAS G12C, PD-L1 TPS)
 * 6. Breast Cancer (HR+/HER2- CDK4/6, HER2+ CLEOPATRA/T-DXd, TNBC KEYNOTE-355/ASCENT)
 * 7. Pancreatic Cancer (NAPOLI-3 NALIRIFOX, FOLFIRINOX, POLO Olaparib maintenance)
 * 8. Bladder / Urothelial Cancer (EV-302 Enfortumab Vedotin + Pembrolizumab, JAVELIN Avelumab, FGFR Erdafitinib)
 */

export function getRecommendations(profile) {
  const { cancerType, stage, biomarkers = {}, priorTherapies = [] } = profile;

  switch (cancerType) {
    case 'prostate':
      return prostateRules(stage, biomarkers, priorTherapies);
    case 'esophageal':
      return esophagealRules(stage, biomarkers, priorTherapies);
    case 'gastric':
      return gastricRules(stage, biomarkers, priorTherapies);
    case 'colorectal':
      return colorectalRules(stage, biomarkers, priorTherapies);
    case 'lung':
      return lungRules(stage, biomarkers, priorTherapies);
    case 'breast':
      return breastRules(stage, biomarkers, priorTherapies);
    case 'pancreatic':
      return pancreaticRules(stage, biomarkers, priorTherapies);
    case 'bladder':
      return bladderRules(stage, biomarkers, priorTherapies);
    default:
      return {
        regimens: [],
        trialSearchTerms: [cancerType || 'oncology'],
        pathwayDescription: 'Unknown cancer type',
        warnings: ['Please select a supported cancer domain to generate clinical pathway recommendations.'],
      };
  }
}

// ──────────────────────────────────────────────────────────────
// 1. PROSTATE CANCER
// ──────────────────────────────────────────────────────────────
function prostateRules(stage, biomarkers, priorTherapies) {
  const { castrationResistant, hrrMutation, msi } = biomarkers;
  const isMetastatic = stage === 'metastatic' || biomarkers.isMetastatic;
  const hadAR = priorTherapies.includes('AR_inhibitor');
  const hadDocetaxel = priorTherapies.includes('docetaxel');
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['prostate cancer'];

  if (!castrationResistant) {
    if (isMetastatic) {
      trialSearchTerms = ['metastatic hormone sensitive prostate cancer', 'mHSPC'];
      regimens.push({
        name: 'ADT + Darolutamide + Docetaxel (Triplet Therapy)',
        class: 'Androgen Deprivation + AR Inhibitor + Chemotherapy',
        evidence: 'ARASENS trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'ARASENS demonstrated a 32.5% reduction in risk of death with triplet therapy (ADT + Darolutamide + Docetaxel) in mHSPC.',
        line: 'first',
      });
      regimens.push({
        name: 'ADT + Enzalutamide or Apalutamide',
        class: 'Androgen Deprivation + 2nd Gen AR Inhibitor',
        evidence: 'ARCHES / TITAN / ENZAMET trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'Doubles rPFS and significantly extends overall survival vs. ADT alone across high- and low-volume mHSPC.',
        line: 'first',
      });
      regimens.push({
        name: 'ADT + Abiraterone + Prednisone',
        class: 'Androgen Deprivation + CYP17 Inhibitor',
        evidence: 'LATITUDE / STAMPEDE trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'Preferred option for high-risk mHSPC demonstrating 38% overall survival improvement.',
        line: 'first',
      });
    } else {
      const hadSurgery = priorTherapies.includes('surgery');
      const hadRadiation = priorTherapies.includes('radiation');
      const hadHormonal = priorTherapies.includes('hormonal_therapy');
      
      if (hadSurgery && hadRadiation) {
        regimens.push({
          name: 'Surveillance / Intermittent ADT (if PSA rising)',
          class: 'Observation / Systemic',
          evidence: 'NCCN Guidelines',
          evidenceLevel: 'Standard of Care',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
          rationale: 'Active local curative therapies exhausted.',
          line: 'surveillance',
        });
      } else if (hadSurgery) {
        regimens.push({
          name: 'Salvage Radiation Therapy (SRT) +/- ADT',
          class: 'Radiotherapy',
          evidence: 'RADICALS / RAVES trials',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
          rationale: 'Standard of care for biochemical recurrence following radical prostatectomy.',
          line: 'second',
        });
        warnings.push('Prior Surgery: Prostatectomy omitted. Recommending Salvage Radiation.');
      } else if (hadRadiation) {
        regimens.push({
          name: 'Salvage ADT or Surveillance',
          class: 'Androgen Deprivation',
          evidence: 'NCCN Guidelines',
          evidenceLevel: 'Standard of Care',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
          rationale: 'Standard approach for recurrence after definitive radiation therapy.',
          line: 'second',
        });
        warnings.push('Prior Radiation: EBRT omitted. Recommending Salvage ADT.');
      } else {
        if (hadHormonal) {
          warnings.push('Prior Hormonal Therapy: Assuming neoadjuvant ADT. Proceeding with definitive local therapy.');
        }
        regimens.push({
          name: 'Radical Prostatectomy (+/- Pelvic Lymph Node Dissection)',
          class: 'Surgical Oncology',
          evidence: 'NCCN Guidelines',
          evidenceLevel: 'Standard of Care',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
          rationale: 'Primary definitive therapy for localized prostate cancer with curative intent.',
          line: 'first',
        });
        regimens.push({
          name: 'External Beam Radiation (EBRT) + ADT (18–36 months)',
          class: 'Radiotherapy + Androgen Deprivation',
          evidence: 'RTOG 9413 / EORTC 22863 trials',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
          rationale: 'Standard of care alternative to surgery for intermediate- to high-risk localized prostate cancer.',
          line: 'first',
        });
      }
      trialSearchTerms = ['localized prostate cancer radiation ADT'];
    }
  } else {
    trialSearchTerms = ['metastatic castration resistant prostate cancer', 'mCRPC'];

    if (!hadAR) {
      regimens.push({
        name: 'Enzalutamide or Abiraterone + Prednisone',
        class: '2nd Gen AR Inhibitor / CYP17 Inhibitor',
        evidence: 'PREVAIL / COU-AA-302 trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'Preferred first-line therapy for chemo-naive mCRPC improving overall survival and quality of life.',
        line: 'first',
      });
    }

    if (hadAR && !hadDocetaxel) {
      regimens.push({
        name: 'Docetaxel + Prednisone',
        class: 'Taxane Chemotherapy',
        evidence: 'TAX327 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'Standard chemotherapy following progression on AR-targeted therapy.',
        line: 'second',
      });
    }

    if (hadAR && hadDocetaxel) {
      regimens.push({
        name: 'Lutetium-177 PSMA-617 (177Lu-PSMA-617)',
        class: 'Targeted Radioligand Therapy',
        evidence: 'VISION trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'VISION: Statistically significant OS improvement in PSMA PET-positive mCRPC post-AR inhibitor & post-taxane.',
        line: 'second',
      });
      regimens.push({
        name: 'Cabazitaxel + Prednisone',
        class: '2nd Gen Taxane Chemotherapy',
        evidence: 'CARD / TROPIC trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'CARD trial demonstrated superiority of Cabazitaxel over second AR inhibitor post-Docetaxel.',
        line: 'second',
      });
    }

    if (hrrMutation) {
      regimens.push({
        name: 'Olaparib or Rucaparib',
        class: 'PARP Inhibitor',
        evidence: 'PROfound / TRITON3 trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459',
        rationale: 'PROfound: Olaparib significantly prolonged OS in mCRPC with BRCA1, BRCA2, or ATM mutations.',
        line: 'second',
      });
      warnings.push(`HRR Mutation (${hrrMutation}): PARP inhibitor (Olaparib) is FDA-approved and strongly indicated.`);
    }

    if (msi === 'MSI-H') {
      regimens.push({
        name: 'Pembrolizumab',
        class: 'PD-1 Checkpoint Inhibitor',
        evidence: 'KEYNOTE-158 (FDA Tumor-Agnostic)',
        evidenceLevel: 'Phase 2 (FDA Approved)',
        guidelineUrl: 'https://www.fda.gov',
        rationale: 'FDA tumor-agnostic approval for MSI-H/dMMR solid tumors.',
        line: 'any',
      });
      warnings.push('MSI-H detected: Pembrolizumab monotherapy is FDA-approved tumor-agnostically.');
    }
  }

  return { regimens, trialSearchTerms, pathwayDescription: castrationResistant ? 'Metastatic Castration-Resistant Prostate Cancer (mCRPC)' : 'Hormone-Sensitive Prostate Cancer (HSPC)', warnings };
}

// ──────────────────────────────────────────────────────────────
// 2. ESOPHAGEAL CANCER
// ──────────────────────────────────────────────────────────────
function esophagealRules(stage, biomarkers, priorTherapies) {
  const { histology, pdl1Cps, her2, msi } = biomarkers;
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['esophageal cancer'];

  if (priorTherapies.length > 0) {
    warnings.push('Prior therapies detected. Check for progression and adjust line of therapy accordingly.');
  }

  if (stage === 'IV' || stage === 'metastatic') {
    if (msi === 'MSI-H') {
      regimens.push({
        name: 'Pembrolizumab or Nivolumab',
        class: 'PD-1 Checkpoint Inhibitor',
        evidence: 'FDA Tumor-Agnostic / CheckMate & Keynote trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org',
        rationale: 'MSI-H solid tumors are highly responsive to PD-1 blockade.',
        line: 'first',
      });
      warnings.push('MSI-H detected: PD-1 blockade is highly recommended.');
    }
    if (histology === 'SCC') {
      trialSearchTerms = ['esophageal squamous cell carcinoma metastatic'];
      regimens.push({
        name: 'Nivolumab + Fluoropyrimidine/Cisplatin (or Nivolumab + Ipilimumab)',
        class: 'PD-1 Inhibitor + Chemotherapy / Dual Checkpoint Blockade',
        evidence: 'CHECKMATE-648 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.esmo.org',
        rationale: 'CHECKMATE-648: Nivolumab + chemo significantly prolonged OS vs. chemo alone in 1L advanced ESCC.',
        line: 'first',
      });

      if (pdl1Cps >= 10) {
        regimens.push({
          name: 'Pembrolizumab + Cisplatin / 5-FU',
          class: 'PD-1 Inhibitor + Chemotherapy',
          evidence: 'KEYNOTE-590 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1433',
          rationale: `KEYNOTE-590: Pembrolizumab + chemo provided superior OS in ESCC with PD-L1 CPS ≥10 (HR 0.57).`,
          line: 'first',
        });
      }
    } else {
      trialSearchTerms = ['esophageal adenocarcinoma metastatic GEJ'];
      if (her2 === 'positive') {
        regimens.push({
          name: 'Trastuzumab + Pembrolizumab + Platinum/Fluoropyrimidine',
          class: 'HER2 Targeted + PD-1 Inhibitor + Chemotherapy',
          evidence: 'KEYNOTE-811 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
          rationale: 'KEYNOTE-811: FDA-approved 1L therapy for HER2+ GEJ adenocarcinoma, delivering 74% ORR.',
          line: 'first',
        });
        warnings.push('HER2 Positive: Trastuzumab + Pembrolizumab + chemo is standard first-line.');
      } else if (pdl1Cps >= 5) {
        regimens.push({
          name: 'Nivolumab + FOLFOX or XELOX',
          class: 'PD-1 Inhibitor + Chemotherapy',
          evidence: 'CHECKMATE-649 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1433',
          rationale: `CHECKMATE-649: Nivolumab + chemo demonstrated superior OS in HER2- EAC with CPS ≥5 (HR 0.71).`,
          line: 'first',
        });
      } else {
        regimens.push({
          name: 'FOLFOX or XELOX (Oxaliplatin + Fluoropyrimidine)',
          class: 'Platinum-based Chemotherapy',
          evidence: 'Multiple Phase 3 RCTs',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1433',
          rationale: 'Standard chemotherapy backbone for HER2- negative, low PD-L1 CPS esophageal adenocarcinoma.',
          line: 'first',
        });
      }
    }
  } else {
      const hadSurgery = priorTherapies.includes('surgery');
      const hadRadiation = priorTherapies.includes('radiation');
      const hadChemo = priorTherapies.includes('chemotherapy');
      
      if (hadSurgery && hadChemo) {
        regimens.push({
          name: 'Adjuvant Nivolumab (if residual disease) or Surveillance',
          class: 'PD-1 Checkpoint Inhibitor / Observation',
          evidence: 'CHECKMATE-577 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.esmo.org',
          rationale: 'CHECKMATE-577: Adjuvant nivolumab doubled disease-free survival in patients with residual disease post-neoadjuvant CRT.',
          line: 'adjuvant',
        });
        warnings.push('Prior Surgery & Chemo: Curative resection complete. Recommending Adjuvant Nivolumab or Surveillance.');
      } else if (hadSurgery) {
        regimens.push({
          name: 'Adjuvant Nivolumab',
          class: 'PD-1 Checkpoint Inhibitor',
          evidence: 'CHECKMATE-577 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.esmo.org',
          rationale: 'CHECKMATE-577: Adjuvant nivolumab doubled disease-free survival.',
          line: 'adjuvant',
        });
        warnings.push('Prior Surgery: Esophagectomy omitted. Recommending Adjuvant Nivolumab.');
      } else if (hadRadiation || hadChemo) {
        regimens.push({
          name: 'Esophagectomy',
          class: 'Surgical Oncology',
          evidence: 'Standard of Care',
          evidenceLevel: 'Consensus',
          guidelineUrl: 'https://www.esmo.org',
          rationale: 'Surgery follows neoadjuvant chemoradiation in resectable candidates.',
          line: 'consolidation',
        });
        warnings.push('Prior Systemic/Radiation: Neoadjuvant assumed complete. Recommending Esophagectomy.');
      } else {
        regimens.push({
          name: 'Neoadjuvant Chemoradiation → Esophagectomy',
          class: 'Multimodality Therapy',
          evidence: 'CROSS trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.esmo.org',
          rationale: 'CROSS: Preoperative chemoradiotherapy improved overall survival (49.4 vs 24.0 months) compared to surgery alone.',
          line: 'first',
        });
        regimens.push({
          name: 'Neoadjuvant FLOT (4 cycles pre-, 4 cycles post-surgery) + Esophagectomy',
          class: 'Perioperative Triplet Chemotherapy + Surgery',
          evidence: 'FLOT4 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.esmo.org',
          rationale: 'FLOT4: Superior overall survival (50 vs 37 months) compared to ECF/ECX in resectable adenocarcinoma.',
          line: 'first',
        });
      }
      trialSearchTerms = ['resectable esophageal cancer neoadjuvant FLOT'];
    }

  return { regimens, trialSearchTerms, pathwayDescription: `${histology === 'SCC' ? 'Squamous Cell Carcinoma' : 'Adenocarcinoma'} of Esophagus / GEJ — ${stage}`, warnings };
}

// ──────────────────────────────────────────────────────────────
// 3. GASTRIC CANCER
// ──────────────────────────────────────────────────────────────
function gastricRules(stage, biomarkers, priorTherapies) {
  const { her2, cldn18, pdl1Cps, msi } = biomarkers;
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['gastric cancer metastatic'];

  if (stage === 'IV' || stage === 'metastatic') {
    if (her2 === 'positive') {
      regimens.push({
        name: 'Trastuzumab + Pembrolizumab + Fluoropyrimidine/Platinum',
        class: 'HER2 Targeted + Immunotherapy + Chemotherapy',
        evidence: 'KEYNOTE-811 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'KEYNOTE-811: FDA-approved first-line regimen for HER2+ gastric/GEJ adenocarcinoma.',
        line: 'first',
      });
      warnings.push('HER2 Positive: Trastuzumab-based chemo-immunotherapy is standard first-line.');
    } else if (cldn18 === 'positive') {
      regimens.push({
        name: 'Zolbetuximab + mFOLFOX6 or CAPOX',
        class: 'Claudin 18.2 Targeted Antibody + Chemotherapy',
        evidence: 'SPOTLIGHT & GLOW trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'SPOTLIGHT/GLOW: Zolbetuximab + chemo significantly prolonged PFS and OS in CLDN18.2+, HER2- gastric cancer.',
        line: 'first',
      });
      warnings.push('Claudin 18.2 Positive: Zolbetuximab + chemo is a landmark target-specific 1L option (SPOTLIGHT/GLOW).');
    } else if (msi === 'MSI-H') {
      regimens.push({
        name: 'Pembrolizumab + Chemotherapy',
        class: 'PD-1 Checkpoint Inhibitor',
        evidence: 'KEYNOTE-062 / KEYNOTE-158',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'MSI-H gastric cancer shows profound response rates to PD-1 blockade.',
        line: 'first',
      });
    } else if (pdl1Cps >= 5) {
      regimens.push({
        name: 'Nivolumab + FOLFOX or XELOX',
        class: 'PD-1 Inhibitor + Chemotherapy',
        evidence: 'CHECKMATE-649 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: `CHECKMATE-649: Nivolumab + chemo improved OS (HR 0.71) in HER2- gastric cancer with PD-L1 CPS ≥5.`,
        line: 'first',
      });
    } else {
      regimens.push({
        name: 'FOLFOX or XELOX',
        class: 'Platinum-based Chemotherapy',
        evidence: 'Multiple Phase 3 RCTs',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'Standard 1L chemotherapy backbone for HER2-, CLDN18.2-, low CPS gastric adenocarcinoma.',
        line: 'first',
      });
    }
  } else {
    const hadSurgery = priorTherapies.includes('surgery');
    const hadChemo = priorTherapies.includes('chemotherapy');
    
    if (hadSurgery && hadChemo) {
      regimens.push({
        name: 'Surveillance / Observation',
        class: 'Observation',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'Patient has completed both surgery and perioperative chemotherapy.',
        line: 'surveillance',
      });
      warnings.push('Curative therapies completed. Recommend surveillance.');
    } else if (hadChemo && !hadSurgery) {
      regimens.push({
        name: 'Surgical Resection (Gastrectomy + D2 Lymphadenectomy)',
        class: 'Surgical Oncology',
        evidence: 'FLOT4 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'Proceed to surgery following neoadjuvant chemotherapy (e.g., FLOT).',
        line: 'consolidation',
      });
      warnings.push('Prior Chemotherapy: Assuming neoadjuvant completion. Proceeding to surgery.');
    } else if (hadSurgery && !hadChemo) {
      regimens.push({
        name: 'Adjuvant Capecitabine + Oxaliplatin (CAPOX)',
        class: 'Platinum-based Adjuvant Chemotherapy',
        evidence: 'CLASSIC trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'CLASSIC: Adjuvant CAPOX improves 5-year DFS compared to surgery alone.',
        line: 'adjuvant',
      });
      warnings.push('Prior Surgery: Gastrectomy omitted. Recommending Adjuvant Chemotherapy.');
    } else {
      regimens.push({
        name: 'Surgical Resection (Gastrectomy + D2 Lymphadenectomy)',
        class: 'Surgical Oncology',
        evidence: 'NCCN / ESMO Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'Primary curative intent therapy for localized gastric cancer.',
        line: 'first',
      });
      regimens.push({
        name: 'Perioperative FLOT (4 cycles pre-, 4 cycles post-surgery)',
        class: 'Perioperative Triplet Chemotherapy',
        evidence: 'FLOT4 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1444',
        rationale: 'FLOT4: Standard perioperative regimen improving survival in resectable gastric adenocarcinoma.',
        line: 'first',
      });
    }
  }

  return { regimens, trialSearchTerms, pathwayDescription: `Gastric / GEJ Adenocarcinoma — ${stage}`, warnings };
}

// ──────────────────────────────────────────────────────────────
// 4. COLORECTAL CANCER
// ──────────────────────────────────────────────────────────────
function colorectalRules(stage, biomarkers, priorTherapies) {
  const { ras, braf, msi, sidedness } = biomarkers;
  const hadOxaliplatin = priorTherapies.includes('oxaliplatin');
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['colorectal cancer metastatic'];

  if (stage === 'IV' || stage === 'metastatic') {
    if (msi === 'MSI-H') {
      regimens.push({
        name: 'Pembrolizumab (Monotherapy)',
        class: 'PD-1 Checkpoint Inhibitor',
        evidence: 'KEYNOTE-177 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'KEYNOTE-177: Pembrolizumab vs chemo as 1L in MSI-H mCRC doubled PFS (16.5 vs 8.2 mos; HR 0.60). FDA approved 1L.',
        line: 'first',
      });
      warnings.push('MSI-H / dMMR: Pembrolizumab monotherapy is FDA-approved first-line standard of care.');
    } else if (braf === 'V600E') {
      regimens.push({
        name: 'Encorafenib + Cetuximab',
        class: 'BRAF + EGFR Inhibitor Combination',
        evidence: 'BEACON CRC trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'BEACON CRC: Encorafenib + Cetuximab significantly improved OS vs. chemo in BRAF V600E mCRC (HR 0.61). FDA approved.',
        line: 'second',
      });
      regimens.push({
        name: 'FOLFOXIRI + Bevacizumab',
        class: 'Triplet Chemotherapy + VEGF Inhibitor',
        evidence: 'TRIBE trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Aggressive 1L triplet chemotherapy regimen preferred for BRAF V600E mutated mCRC.',
        line: 'first',
      });
      warnings.push('BRAF V600E: Poor prognostic marker. Dual targeted therapy (BEACON) preferred post-first-line.');
    } else if (ras === 'WT') {
      if (sidedness === 'left') {
        regimens.push({
          name: 'FOLFOX or FOLFIRI + Panitumumab or Cetuximab',
          class: 'Chemotherapy + EGFR Inhibitor',
          evidence: 'PARADIGM / CRYSTAL / PRIME trials',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
          rationale: 'PARADIGM trial confirmed significant overall survival superiority of anti-EGFR vs anti-VEGF in left-sided RAS WT mCRC.',
          line: 'first',
        });
      } else {
        regimens.push({
          name: 'FOLFOX or FOLFIRI + Bevacizumab',
          class: 'Chemotherapy + VEGF Inhibitor',
          evidence: 'PARADIGM / CALGB 80405 trials',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
          rationale: 'Right-sided RAS WT tumors derive limited benefit from anti-EGFR; Bevacizumab-based chemotherapy is preferred.',
          line: 'first',
        });
        warnings.push('Right-sided primary tumor: Anti-EGFR therapy has minimal efficacy on right-sided primaries. Bevacizumab preferred.');
      }
    } else {
      regimens.push({
        name: 'FOLFOX or FOLFIRI + Bevacizumab',
        class: 'Chemotherapy + VEGF Inhibitor',
        evidence: 'NO16966 / VELOUR trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'RAS mutant mCRC: Anti-EGFR agents (Cetuximab/Panitumumab) are contraindicated. Bevacizumab is standard.',
        line: 'first',
      });
      warnings.push('RAS Mutant (KRAS/NRAS): Anti-EGFR therapy is contraindicated. Bevacizumab + chemotherapy is standard.');
    }

    if (hadOxaliplatin) {
      regimens.push({
        name: 'FOLFIRI + Ramucirumab or Aflibercept',
        class: 'Irinotecan-based + Anti-Angiogenic Agent',
        evidence: 'RAISE / VELOUR trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Second-line standard following oxaliplatin failure.',
        line: 'second',
      });
    }
  } else {
    const hadSurgery = priorTherapies.includes('surgery');
    const hadChemo = priorTherapies.includes('chemotherapy');

    if (hadSurgery && hadChemo) {
      regimens.push({
        name: 'Surveillance / Observation',
        class: 'Observation',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Active curative therapy completed. Monitor for recurrence.',
        line: 'surveillance',
      });
    } else if (hadChemo && !hadSurgery) {
      regimens.push({
        name: 'Surgical Resection (Colectomy / Proctectomy)',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Primary definitive curative therapy following neoadjuvant treatment.',
        line: 'consolidation',
      });
      warnings.push('Prior Chemotherapy: Assuming neoadjuvant therapy complete. Proceed to Surgery.');
    } else if (hadSurgery && !hadChemo) {
      regimens.push({
        name: 'Adjuvant FOLFOX or CAPOX',
        class: 'Platinum-based Adjuvant Chemotherapy',
        evidence: 'MOSAIC / IDEA trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Standard 3-6 month adjuvant therapy for high-risk Stage II and Stage III colon cancer.',
        line: 'adjuvant',
      });
      warnings.push('Prior Surgery: Primary resection omitted. Recommending Adjuvant Chemotherapy.');
    } else {
      regimens.push({
        name: 'Surgical Resection (Colectomy / Proctectomy)',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Primary definitive curative therapy for localized disease.',
        line: 'first',
      });
      regimens.push({
        name: 'Adjuvant FOLFOX or CAPOX',
        class: 'Platinum-based Adjuvant Chemotherapy',
        evidence: 'MOSAIC / IDEA trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1496',
        rationale: 'Standard 3-6 month adjuvant therapy for high-risk Stage II and Stage III colon cancer.',
        line: 'first',
      });
    }
  }

  return { regimens, trialSearchTerms, pathwayDescription: `Colorectal Cancer (CRC) — Stage ${stage}, RAS ${ras || 'WT'}, BRAF ${braf || 'WT'}`, warnings };
}

// ──────────────────────────────────────────────────────────────
// 5. NON-SMALL CELL LUNG CANCER (NSCLC) — NEW
// ──────────────────────────────────────────────────────────────
function lungRules(stage, biomarkers, priorTherapies) {
  const { egfr, alk, krasG12c, pdl1Tps } = biomarkers;
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['non-small cell lung cancer NSCLC'];

  if (stage === 'IV' || stage === 'metastatic') {
    if (egfr === 'exon19' || egfr === 'L858R') {
      trialSearchTerms = ['EGFR mutated NSCLC osimertinib'];
      regimens.push({
        name: 'Osimertinib (± Platinum Chemotherapy)',
        class: '3rd Gen EGFR Tyrosine Kinase Inhibitor',
        evidence: 'FLAURA & FLAURA2 trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'FLAURA: Osimertinib significantly improved OS (38.6 mos) with superior CNS efficacy vs 1st gen TKIs. FLAURA2 showed further PFS benefit with chemo addition.',
        line: 'first',
      });
      warnings.push(`EGFR Mutated (${egfr}): 3rd-generation TKI (Osimertinib) is standard of care 1L therapy regardless of PD-L1 status.`);
    } else if (alk === 'positive') {
      trialSearchTerms = ['ALK positive NSCLC alectinib lorlatinib'];
      regimens.push({
        name: 'Alectinib, Lorlatinib, or Brigatinib',
        class: '2nd/3rd Gen ALK Tyrosine Kinase Inhibitor',
        evidence: 'CROWN & ALEX trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'CROWN: Lorlatinib demonstrated unprecedented 5-year progression-free survival in treatment-naïve ALK+ NSCLC.',
        line: 'first',
      });
      warnings.push('ALK Rearranged: Next-generation ALK TKI (Alectinib or Lorlatinib) preferred 1L over Crizotinib.');
    } else if (krasG12c === 'positive') {
      regimens.push({
        name: 'Sotorasib or Adagrasib',
        class: 'KRAS G12C Inhibitor',
        evidence: 'CodeBreaK100 & KRYSTAL-1 trials',
        evidenceLevel: 'Phase 2/3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'FDA-approved targeted option following progression on first-line chemo-immunotherapy.',
        line: 'second',
      });
    } else if (pdl1Tps >= 50) {
      regimens.push({
        name: 'Pembrolizumab Monotherapy (or Cemiplimab)',
        class: 'PD-1 Checkpoint Inhibitor',
        evidence: 'KEYNOTE-024 & EMPOWER-Lung 1',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'KEYNOTE-024: Pembrolizumab monotherapy superior to chemo in driver-negative NSCLC with PD-L1 TPS ≥50%.',
        line: 'first',
      });
    } else {
      regimens.push({
        name: 'Pembrolizumab + Carboplatin + Pemetrexed (or Paclitaxel)',
        class: 'PD-1 Inhibitor + Platinum Chemotherapy Doublet',
        evidence: 'KEYNOTE-189 (Non-Squamous) / KEYNOTE-407 (Squamous)',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'KEYNOTE-189/407: Doubled overall survival across all PD-L1 TPS levels in driver-negative metastatic NSCLC.',
        line: 'first',
      });
    }
  } else {
    // Stage I-III
    const hadSurgery = priorTherapies.includes('surgery');
    const hadRadiation = priorTherapies.includes('radiation');
    const hadChemo = priorTherapies.includes('chemotherapy');

    if (hadSurgery && hadChemo) {
      if (biomarkers.egfr && biomarkers.egfr !== 'negative') {
        regimens.push({
          name: 'Adjuvant Osimertinib',
          class: 'EGFR Tyrosine Kinase Inhibitor',
          evidence: 'ADAURA trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
          rationale: 'ADAURA: Unprecedented disease-free survival benefit in resected EGFR-mutated NSCLC post-chemo.',
          line: 'adjuvant',
        });
      } else {
        regimens.push({
          name: 'Surveillance / Observation',
          class: 'Observation',
          evidence: 'NCCN Guidelines',
          evidenceLevel: 'Standard of Care',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
          rationale: 'Patient has completed both surgery and adjuvant chemotherapy.',
          line: 'surveillance',
        });
      }
    } else if (hadChemo && !hadSurgery) {
      regimens.push({
        name: 'Surgical Resection (Lobectomy / Pneumonectomy + Mediastinal LN Dissection)',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'Primary curative intent therapy following neoadjuvant chemo-immunotherapy.',
        line: 'consolidation',
      });
      warnings.push('Prior Chemotherapy: Neoadjuvant complete. Recommending Surgery.');
    } else if (hadSurgery && !hadChemo) {
      regimens.push({
        name: 'Adjuvant Platinum-based Chemotherapy +/- Immunotherapy',
        class: 'Adjuvant Chemo-Immunotherapy',
        evidence: 'IMpower010 / KEYNOTE-091 trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'Standard of care for resected stage IB-IIIA NSCLC.',
        line: 'adjuvant',
      });
      warnings.push('Prior Surgery: Resection omitted. Recommending Adjuvant Chemotherapy +/- Immunotherapy.');
      if (biomarkers.egfr && biomarkers.egfr !== 'negative') {
        regimens.push({
          name: 'Adjuvant Osimertinib',
          class: 'EGFR Tyrosine Kinase Inhibitor',
          evidence: 'ADAURA trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
          rationale: 'ADAURA: Unprecedented disease-free survival benefit in resected EGFR-mutated NSCLC.',
          line: 'adjuvant',
        });
      }
    } else if (hadRadiation) {
      regimens.push({
        name: 'Durvalumab Consolidation',
        class: 'PD-L1 Checkpoint Inhibitor',
        evidence: 'PACIFIC trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'PACIFIC: Standard of care consolidation after definitive chemoradiation in unresectable Stage III NSCLC.',
        line: 'consolidation',
      });
      warnings.push('Prior Radiation: Definitive chemoradiation omitted. Recommending PACIFIC regimen.');
    } else {
      regimens.push({
        name: 'Surgical Resection (Lobectomy / Pneumonectomy + Mediastinal LN Dissection)',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'Primary curative intent therapy for early-stage (I-II) resectable NSCLC.',
        line: 'first',
      });
      regimens.push({
        name: 'Neoadjuvant Nivolumab + Platinum Chemotherapy',
        class: 'Perioperative Immunotherapy + Chemotherapy',
        evidence: 'CHECKMATE-816 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.esmo.org',
        rationale: 'CHECKMATE-816: Significantly increased pathological complete response (24% vs 2.2%) in resectable NSCLC.',
        line: 'first',
      });
      regimens.push({
        name: 'Definitive Chemoradiation + Durvalumab Consolidation',
        class: 'Chemoradiotherapy + PD-L1 Checkpoint Inhibitor',
        evidence: 'PACIFIC trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
        rationale: 'PACIFIC: Standard of care for unresectable Stage III NSCLC, improving overall survival significantly.',
        line: 'first',
      });
    }
    trialSearchTerms = ['resectable NSCLC neoadjuvant nivolumab'];
  }

  return { regimens, trialSearchTerms, pathwayDescription: `Metastatic Non-Small Cell Lung Cancer (NSCLC) — ${stage}`, warnings };
}

// ──────────────────────────────────────────────────────────────
// 6. BREAST CANCER — NEW
// ──────────────────────────────────────────────────────────────
function breastRules(stage, biomarkers, priorTherapies) {
  const { hrStatus, her2, pik3ca, msi } = biomarkers;
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['metastatic breast cancer'];

  if (msi === 'MSI-H') {
    warnings.push('MSI-H detected: Pembrolizumab is FDA-approved tumor-agnostically for MSI-H/dMMR solid tumors.');
  }

  if (stage === 'IV' || stage === 'metastatic') {
    if (her2 === 'positive') {
      trialSearchTerms = ['HER2 positive breast cancer trastuzumab pertuzumab'];
      regimens.push({
        name: 'Trastuzumab + Pertuzumab + Docetaxel/Paclitaxel',
        class: 'Dual HER2 Blockade + Taxane Chemotherapy',
        evidence: 'CLEOPATRA trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'CLEOPATRA: Dual HER2 blockade (THP) established landmark 57.1 month overall survival in 1L HER2+ metastatic breast cancer.',
        line: 'first',
      });
      regimens.push({
        name: 'Trastuzumab Deruxtecan (T-DXd)',
        class: 'HER2-Targeted Antibody-Drug Conjugate (ADC)',
        evidence: 'DESTINY-Breast03 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'DESTINY-Breast03: T-DXd demonstrated revolutionary PFS improvement (HR 0.28) vs T-DM1 in 2L HER2+ MBC.',
        line: 'second',
      });
      warnings.push('HER2 Positive: Dual HER2 blockade (CLEOPATRA) is standard 1L; T-DXd is preferred 2L.');
    } else if (hrStatus === 'positive') {
      // HR+ / HER2-
      trialSearchTerms = ['HR positive HER2 negative breast cancer CDK4/6 inhibitor'];
      regimens.push({
        name: 'CDK4/6 Inhibitor (Ribociclib, Abemaciclib, or Palbociclib) + Aromatase Inhibitor / Fulvestrant',
        class: 'CDK4/6 Inhibitor + Endocrine Therapy',
        evidence: 'MONALEESA-2/7 / MONARCH-3 / PALOMA-2',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'MONALEESA/MONARCH: CDK4/6 inhibitors + endocrine therapy significantly improve overall survival and PFS in 1L HR+/HER2- MBC.',
        line: 'first',
      });
      if (pik3ca === 'positive') {
        regimens.push({
          name: 'Alpelisib + Fulvestrant',
          class: 'PI3Kα Inhibitor + Endocrine Therapy',
          evidence: 'SOLAR-1 trial',
          evidenceLevel: 'Phase 3 RCT',
          guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
          rationale: 'SOLAR-1: Alpelisib doubled PFS in PIK3CA-mutated HR+/HER2- MBC post-endocrine therapy.',
          line: 'second',
        });
        warnings.push('PIK3CA Mutation: Alpelisib + Fulvestrant is indicated post-CDK4/6 progression.');
      }
    } else {
      // Triple-Negative Breast Cancer (TNBC)
      trialSearchTerms = ['triple negative breast cancer TNBC sacituzumab'];
      regimens.push({
        name: 'Pembrolizumab + Chemotherapy (Paclitaxel / Carboplatin)',
        class: 'PD-1 Inhibitor + Chemotherapy',
        evidence: 'KEYNOTE-355 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'KEYNOTE-355: Pembrolizumab + chemo significantly extended OS in PD-L1 positive (CPS ≥10) metastatic TNBC.',
        line: 'first',
      });
      regimens.push({
        name: 'Sacituzumab Govitecan',
        class: 'Trop-2 Targeted Antibody-Drug Conjugate (ADC)',
        evidence: 'ASCENT trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'ASCENT: Sacituzumab Govitecan significantly improved OS (12.1 vs 6.7 mos; HR 0.48) in pretreated metastatic TNBC.',
        line: 'second',
      });
      warnings.push('Triple-Negative (TNBC): Check PD-L1 CPS for 1L Pembrolizumab; Sacituzumab Govitecan preferred 2L+.');
    }
  } else {
    // Early / Localized Breast Cancer (Stage I-III)
    regimens.push({
      name: 'Surgical Resection (Lumpectomy + Radiation OR Total Mastectomy)',
      class: 'Surgical Oncology',
      evidence: 'NSABP B-06 trial',
      evidenceLevel: 'Phase 3 RCT',
      guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
      rationale: 'Primary curative local therapy. Breast-conserving surgery with radiation is equivalent in survival to mastectomy.',
      line: 'first',
    });

    if (her2 === 'positive') {
      regimens.push({
        name: 'TCHP (Docetaxel + Carboplatin + Trastuzumab + Pertuzumab)',
        class: 'Neo/Adjuvant HER2-Targeted + Chemotherapy',
        evidence: 'TRYPHAENA / APHINITY trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'Standard neoadjuvant regimen for stage II-III HER2-positive breast cancer to achieve pathologic complete response.',
        line: 'first',
      });
    } else if (hrStatus === 'positive') {
      regimens.push({
        name: 'Adjuvant Aromatase Inhibitor (e.g., Anastrozole / Letrozole)',
        class: 'Endocrine Therapy (Adjuvant)',
        evidence: 'ATAC / BIG 1-98 trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'Standard adjuvant treatment for 5-10 years for postmenopausal women with HR-positive localized breast cancer.',
        line: 'first',
      });
    } else {
      // TNBC
      regimens.push({
        name: 'Neoadjuvant Pembrolizumab + Paclitaxel/Carboplatin → Doxorubicin/Cyclophosphamide',
        class: 'PD-1 Checkpoint Inhibitor + Platinum Doublet Chemotherapy',
        evidence: 'KEYNOTE-522 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419',
        rationale: 'KEYNOTE-522: Standard of care for early-stage TNBC, significantly improving pathologic complete response (pCR) and event-free survival (EFS).',
        line: 'first',
      });
    }
  }

  const description = (stage === 'IV' || stage === 'metastatic')
    ? `Metastatic Breast Cancer (${hrStatus === 'positive' ? 'HR+' : 'HR-'}, ${her2 === 'positive' ? 'HER2+' : 'HER2-'})`
    : `Localized Breast Cancer (${hrStatus === 'positive' ? 'HR+' : 'HR-'}, ${her2 === 'positive' ? 'HER2+' : 'HER2-'}) — ${stage}`;

  return { regimens, trialSearchTerms, pathwayDescription: description, warnings };
}

// ──────────────────────────────────────────────────────────────
// 7. PANCREATIC CANCER — NEW
// ──────────────────────────────────────────────────────────────
function pancreaticRules(stage, biomarkers, priorTherapies) {
  const { brcaMutation, msi } = biomarkers;
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['metastatic pancreatic cancer adenocarcinoma'];

  if (msi === 'MSI-H') {
    regimens.push({
      name: 'Pembrolizumab (Monotherapy)',
      class: 'PD-1 Checkpoint Inhibitor',
      evidence: 'KEYNOTE-158',
      evidenceLevel: 'Phase 2 (FDA Approved)',
      guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
      rationale: 'FDA tumor-agnostic approval for MSI-H/dMMR solid tumors.',
      line: 'any',
    });
    warnings.push('MSI-H detected: Pembrolizumab is FDA-approved for MSI-H pancreatic cancer.');
  }

  if (stage === 'IV' || stage === 'metastatic') {
    regimens.push({
      name: 'NALIRIFOX (Nal-IRI + 5-FU + Leucovorin + Oxaliplatin) or FOLFIRINOX',
      class: 'Liposomal Triplet Chemotherapy',
      evidence: 'NAPOLI-3 / PRODIGE 4 trials',
      evidenceLevel: 'Phase 3 RCT',
      guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
      rationale: 'NAPOLI-3: NALIRIFOX demonstrated superior overall survival vs Gemcitabine + Nab-Paclitaxel in 1L metastatic pancreatic ductal adenocarcinoma.',
      line: 'first',
    });
    regimens.push({
      name: 'Gemcitabine + Nab-Paclitaxel',
      class: 'Gemcitabine Doublet Chemotherapy',
      evidence: 'MPACT trial',
      evidenceLevel: 'Phase 3 RCT',
      guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
      rationale: 'Standard alternative 1L option for patients with moderate performance status.',
      line: 'first',
    });

    if (brcaMutation) {
      regimens.push({
        name: 'Olaparib (Maintenance Monotherapy)',
        class: 'PARP Inhibitor Maintenance',
        evidence: 'POLO trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
        rationale: 'POLO: Olaparib maintenance doubled PFS (7.4 vs 3.8 mos) in germline BRCA1/2-mutated mPDAC following platinum response.',
        line: 'second',
      });
      warnings.push('Germline BRCA1/2 Mutation: Olaparib maintenance is FDA-approved post-platinum chemo response (POLO).');
    }
  } else {
    const hadSurgery = priorTherapies.includes('surgery');
    const hadChemo = priorTherapies.includes('chemotherapy');

    if (hadSurgery && hadChemo) {
      regimens.push({
        name: 'Surveillance / Observation',
        class: 'Observation',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
        rationale: 'Patient has completed both surgery and adjuvant/neoadjuvant chemotherapy.',
        line: 'surveillance',
      });
    } else if (hadChemo && !hadSurgery) {
      regimens.push({
        name: 'Surgical Resection (Pancreaticoduodenectomy / Distal Pancreatectomy)',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
        rationale: 'Primary curative intent therapy following neoadjuvant chemotherapy.',
        line: 'consolidation',
      });
      warnings.push('Prior Chemotherapy: Neoadjuvant complete. Recommending Surgery.');
    } else if (hadSurgery && !hadChemo) {
      regimens.push({
        name: 'Adjuvant mFOLFIRINOX',
        class: 'Systemic Triplet Chemotherapy',
        evidence: 'PRODIGE 24 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
        rationale: 'PRODIGE 24: Superior survival vs gemcitabine as adjuvant therapy in resected pancreatic cancer.',
        line: 'adjuvant',
      });
      warnings.push('Prior Surgery: Resection omitted. Recommending Adjuvant mFOLFIRINOX.');
    } else {
      regimens.push({
        name: 'Surgical Resection (Pancreaticoduodenectomy / Distal Pancreatectomy)',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
        rationale: 'Primary curative intent therapy for upfront resectable pancreatic cancer.',
        line: 'first',
      });
      regimens.push({
        name: 'Neoadjuvant FOLFIRINOX or Modified FOLFIRINOX',
        class: 'Systemic Triplet Chemotherapy',
        evidence: 'PREOPANC & PRODIGE trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1455',
        rationale: 'Preferred approach for borderline resectable pancreatic ductal adenocarcinoma to enable R0 resection.',
        line: 'first',
      });
    }
  }

  return { regimens, trialSearchTerms, pathwayDescription: `Pancreatic Ductal Adenocarcinoma (PDAC) — ${stage}`, warnings };
}

// ──────────────────────────────────────────────────────────────
// 8. BLADDER / UROTHELIAL CANCER — NEW
// ──────────────────────────────────────────────────────────────
function bladderRules(stage, biomarkers, priorTherapies) {
  const { fgfrMutation, pdl1Cps } = biomarkers;
  const HadPlatinum = priorTherapies.includes('platinum');
  const regimens = [];
  const warnings = [];
  let trialSearchTerms = ['metastatic urothelial bladder cancer'];

  if (stage === 'IV' || stage === 'metastatic') {
    if (HadPlatinum) {
      warnings.push('Prior Platinum Exposure: Enfortumab Vedotin + Pembrolizumab remains standard 1L if platinum was given neoadjuvant/adjuvant >12 months ago.');
    }
    if (pdl1Cps >= 10) {
      warnings.push('PD-L1 CPS >= 10: Pembrolizumab monotherapy is an alternative option for cisplatin-ineligible patients.');
    }

    regimens.push({
      name: 'Enfortumab Vedotin + Pembrolizumab (EV + Pembro)',
      class: 'Nectin-4 Directed ADC + PD-1 Checkpoint Inhibitor',
      evidence: 'EV-302 / KEYNOTE-A39 trial',
      evidenceLevel: 'Phase 3 RCT',
      guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
      rationale: 'EV-302: Landmark trial nearly doubled overall survival (31.5 vs 16.1 mos; HR 0.47) vs platinum chemo in 1L metastatic urothelial cancer. FDA approved standard.',
      line: 'first',
    });
    regimens.push({
      name: 'Gemcitabine + Cisplatin/Carboplatin → Avelumab Maintenance',
      class: 'Platinum Doublet + Maintenance Immunotherapy',
      evidence: 'JAVELIN Bladder 100 trial',
      evidenceLevel: 'Phase 3 RCT',
      guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
      rationale: 'JAVELIN Bladder 100: Avelumab maintenance significantly extended OS in patients achieving response/stable disease on 1L platinum chemo.',
      line: 'first',
    });

    if (fgfrMutation) {
      regimens.push({
        name: 'Erdafitinib',
        class: 'FGFR1-4 Tyrosine Kinase Inhibitor',
        evidence: 'THOR trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
        rationale: 'THOR: Erdafitinib significantly prolonged OS vs chemotherapy in pretreated FGFR2/3-altered mUC.',
        line: 'second',
      });
      warnings.push('FGFR2/3 Alteration: Erdafitinib is FDA-approved targeted option post-platinum/immunotherapy.');
    }
  } else {
    const hadSurgery = priorTherapies.includes('surgery');
    const hadChemo = priorTherapies.includes('chemotherapy');

    if (hadSurgery && hadChemo) {
      regimens.push({
        name: 'Adjuvant Nivolumab (if high risk) OR Surveillance',
        class: 'Immunotherapy / Observation',
        evidence: 'CheckMate 274',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
        rationale: 'Nivolumab is indicated post-cystectomy if high risk of recurrence.',
        line: 'adjuvant',
      });
    } else if (hadChemo && !hadSurgery) {
      regimens.push({
        name: 'Radical Cystectomy',
        class: 'Surgical Oncology',
        evidence: 'SWOG S0219 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
        rationale: 'Proceed to surgery following neoadjuvant cisplatin-based chemotherapy.',
        line: 'consolidation',
      });
      warnings.push('Prior Chemotherapy: Neoadjuvant complete. Recommending Cystectomy.');
    } else if (hadSurgery && !hadChemo) {
      regimens.push({
        name: 'Intravesical BCG or Adjuvant Nivolumab',
        class: 'Immunotherapy',
        evidence: 'CheckMate 274 / SWOG trials',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
        rationale: 'BCG for NMIBC; Nivolumab for high-risk MIBC post-cystectomy.',
        line: 'adjuvant',
      });
      warnings.push('Prior Surgery: Resection omitted. Recommending Adjuvant therapies.');
    } else {
      regimens.push({
        name: 'Transurethral Resection of Bladder Tumor (TURBT) +/- Intravesical Therapy',
        class: 'Surgical Oncology',
        evidence: 'NCCN Guidelines',
        evidenceLevel: 'Standard of Care',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
        rationale: 'Primary curative treatment for non-muscle invasive bladder cancer (NMIBC).',
        line: 'first',
      });
      regimens.push({
        name: 'Neoadjuvant Gemcitabine + Cisplatin (followed by Cystectomy)',
        class: 'Platinum-based Doublet Chemotherapy',
        evidence: 'SWOG S0219 trial',
        evidenceLevel: 'Phase 3 RCT',
        guidelineUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1466',
        rationale: 'SWOG S0219: Neoadjuvant cisplatin-based chemotherapy improves overall survival by 16% in muscle-invasive bladder cancer.',
        line: 'first',
      });
      trialSearchTerms = ['muscle invasive bladder cancer neoadjuvant'];
    }
  }

  const description = (stage === 'IV' || stage === 'metastatic')
    ? `Metastatic Urothelial / Bladder Carcinoma`
    : `Localized Urothelial / Bladder Carcinoma — ${stage}`;

  return { regimens, trialSearchTerms, pathwayDescription: description, warnings };
}

export const CANCER_TYPES = [
  { id: 'prostate',    label: 'Prostate Cancer',         color: 'var(--color-prostate)' },
  { id: 'esophageal',  label: 'Esophageal Cancer',        color: 'var(--color-esophageal)' },
  { id: 'gastric',     label: 'Gastric / GEJ Cancer',     color: 'var(--color-gastric)' },
  { id: 'colorectal',  label: 'Colorectal Cancer',        color: 'var(--color-colorectal)' },
  { id: 'lung',        label: 'Non-Small Cell Lung (NSCLC)', color: 'var(--color-info)' },
  { id: 'breast',      label: 'Breast Cancer',            color: '#e056fd' },
  { id: 'pancreatic',  label: 'Pancreatic Cancer',        color: '#e76f51' },
  { id: 'bladder',     label: 'Bladder / Urothelial',     color: '#2a9d8f' },
];
