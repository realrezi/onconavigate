import { describe, it, expect } from 'vitest';
import { getRecommendations } from './pathwayRules';

describe('Prostate Cancer Rules', () => {
  it('mHSPC → recommends ADT + Darolutamide + Docetaxel triplet (ARASENS)', () => {
    const result = getRecommendations({
      cancerType: 'prostate',
      stage: 'metastatic',
      biomarkers: { isMetastatic: true, castrationResistant: false },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('ARASENS'))).toBe(true);
  });

  it('mCRPC with HRR mutation → recommends Olaparib (PROfound)', () => {
    const result = getRecommendations({
      cancerType: 'prostate',
      stage: 'metastatic',
      biomarkers: { castrationResistant: true, hrrMutation: 'BRCA2' },
      priorTherapies: ['AR_inhibitor'],
    });
    expect(result.regimens.some(r => r.name.includes('Olaparib'))).toBe(true);
  });
});

describe('Esophageal Cancer Rules', () => {
  it('Metastatic ESCC → recommends CHECKMATE-648 Nivolumab regimen', () => {
    const result = getRecommendations({
      cancerType: 'esophageal',
      stage: 'IV',
      biomarkers: { histology: 'SCC', pdl1Cps: 5 },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('CHECKMATE-648'))).toBe(true);
  });
});

describe('Gastric Cancer Rules', () => {
  it('Claudin 18.2 positive → recommends Zolbetuximab (SPOTLIGHT / GLOW)', () => {
    const result = getRecommendations({
      cancerType: 'gastric',
      stage: 'metastatic',
      biomarkers: { cldn18: 'positive', her2: 'negative' },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.name.includes('Zolbetuximab'))).toBe(true);
  });
});

describe('Colorectal Cancer Rules', () => {
  it('RAS WT left-sided CRC → recommends anti-EGFR (PARADIGM trial)', () => {
    const result = getRecommendations({
      cancerType: 'colorectal',
      stage: 'metastatic',
      biomarkers: { ras: 'WT', braf: 'WT', sidedness: 'left', msi: 'MSS' },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('PARADIGM'))).toBe(true);
  });
});

describe('NSCLC Lung Cancer Rules (NEW)', () => {
  it('EGFR Exon 19 del → recommends Osimertinib (FLAURA/FLAURA2)', () => {
    const result = getRecommendations({
      cancerType: 'lung',
      stage: 'metastatic',
      biomarkers: { egfr: 'exon19' },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.name.includes('Osimertinib'))).toBe(true);
  });

  it('ALK Rearranged → recommends Alectinib / Lorlatinib (CROWN)', () => {
    const result = getRecommendations({
      cancerType: 'lung',
      stage: 'metastatic',
      biomarkers: { alk: 'positive' },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('CROWN'))).toBe(true);
  });
});

describe('Breast Cancer Rules (NEW)', () => {
  it('HER2 Positive → recommends CLEOPATRA 1L & T-DXd 2L', () => {
    const result = getRecommendations({
      cancerType: 'breast',
      stage: 'metastatic',
      biomarkers: { her2: 'positive', hrStatus: 'negative' },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('CLEOPATRA'))).toBe(true);
    expect(result.regimens.some(r => r.name.includes('Trastuzumab Deruxtecan'))).toBe(true);
  });

  it('HR+/HER2- → recommends CDK4/6 Inhibitor + Endocrine Therapy', () => {
    const result = getRecommendations({
      cancerType: 'breast',
      stage: 'metastatic',
      biomarkers: { hrStatus: 'positive', her2: 'negative' },
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.name.includes('CDK4/6'))).toBe(true);
  });
});

describe('Pancreatic Cancer Rules (NEW)', () => {
  it('Metastatic PDAC → recommends NALIRIFOX (NAPOLI-3)', () => {
    const result = getRecommendations({
      cancerType: 'pancreatic',
      stage: 'metastatic',
      biomarkers: {},
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('NAPOLI-3'))).toBe(true);
  });
});

describe('Bladder Cancer Rules (NEW)', () => {
  it('Metastatic Urothelial → recommends EV + Pembro (EV-302 landmark)', () => {
    const result = getRecommendations({
      cancerType: 'bladder',
      stage: 'metastatic',
      biomarkers: {},
      priorTherapies: [],
    });
    expect(result.regimens.some(r => r.evidence.includes('EV-302'))).toBe(true);
  });
});
