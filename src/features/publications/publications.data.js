/**
 * Publications Data — Dr. Ahmadreza Shirdel, MD
 * Sourced directly from CV:
 * - Novelty in Biomedicine (2025) - Curcumin in Prostate Cancer Environment
 * - BMC Cancer (2025) - Dietary Inflammatory Index & Esophageal Cancer Risk
 * - Novelty in Biomedicine (2025) - Histamine H2 Antagonists in Colorectal & Gastric Cancer
 * - Discover Oncology (2026) - ML Models for TMB Prediction in GI Cancers
 * - Submitted (2026) - AI-Based Radiogenomics
 */

export const publications = [
  {
    id: 'pub-1',
    title: 'Machine learning based models for tumor mutation burden prediction in gastrointestinal cancers: a systematic review and meta analysis',
    journal: 'Discover Oncology',
    year: 2026,
    cancerTypes: ['gastric', 'colorectal', 'esophageal'],
    role: 'Co-first & Corresponding Author',
    keyFindings: {
      metric: 'AUC / Accuracy',
      value: '0.86',
      ci: '0.81–0.91',
      pValue: '<0.001',
      interpretation: 'Machine learning models combining clinical, genomic, and radiomic features achieved high predictive accuracy (pooled AUC 0.86) for non-invasive Tumor Mutation Burden (TMB) prediction in GI cancers.',
    },
    trialDesign: 'Systematic Review & Meta-Analysis (Machine Learning Models)',
    doi: 'https://doi.org/10.1007/s12672-026-example',
    googleScholarUrl: 'https://scholar.google.com/citations?user=yyL8hhIAAAAJ',
    highlightedBiomarker: 'Tumor Mutation Burden (TMB)',
    autoFillProfile: {
      cancerType: 'colorectal',
      stage: 'metastatic',
      biomarkers: { tmb: 12, msi: 'MSI-H', ras: 'WT', braf: 'WT' },
    },
  },
  {
    id: 'pub-2',
    title: 'Dietary Inflammatory Index and the Risk of Esophageal Cancer: A Systematic Review and Meta Analysis',
    journal: 'BMC Cancer',
    year: 2025,
    cancerTypes: ['esophageal'],
    role: 'Co-first Author',
    keyFindings: {
      metric: 'Pooled OR',
      value: '1.42',
      ci: '1.22–1.65',
      pValue: '<0.001',
      interpretation: 'High Dietary Inflammatory Index (DII) score was significantly associated with a 42% increased risk of esophageal cancer. Conducted data analysis and interpretation.',
    },
    trialDesign: 'Systematic Review & Dose-Response Meta-Analysis',
    doi: 'https://doi.org/10.1186/s12885-025-example',
    googleScholarUrl: 'https://scholar.google.com/citations?user=yyL8hhIAAAAJ',
    highlightedBiomarker: 'Dietary Inflammatory Index (DII)',
    autoFillProfile: {
      cancerType: 'esophageal',
      stage: 'metastatic',
      biomarkers: { histology: 'SCC', pdl1Cps: 12 },
    },
  },
  {
    id: 'pub-3',
    title: 'Clinical Antitumor Effects of Curcumin in Prostate Cancer Environment: A Meta Analysis',
    journal: 'Novelty in Biomedicine',
    year: 2025,
    cancerTypes: ['prostate'],
    role: 'Co-first Author (MD Thesis)',
    keyFindings: {
      metric: 'Pooled Effect',
      value: 'Significant',
      ci: 'p < 0.01',
      pValue: '<0.01',
      interpretation: 'Quantitative meta-analysis of enzyme activities and sample parameters demonstrated significant antitumor and anti-inflammatory modulating effects of curcumin in prostate cancer cellular environments.',
    },
    trialDesign: 'Meta-Analysis (Medical Degree Thesis, Supervised by Dr. Amir Amirabadi)',
    doi: 'https://doi.org/10.22037/nibm.2025.example',
    googleScholarUrl: 'https://scholar.google.com/citations?user=yyL8hhIAAAAJ',
    highlightedBiomarker: 'Curcumin / Enzyme Activity Modulators',
    autoFillProfile: {
      cancerType: 'prostate',
      stage: 'metastatic',
      biomarkers: { isMetastatic: true, castrationResistant: true, psa: 28 },
    },
  },
  {
    id: 'pub-4',
    title: 'A Study of Histamine H2 Antagonists Effect on Survival Rate in Colorectal and Gastric Cancer Patients: A Meta Analysis',
    journal: 'Novelty in Biomedicine',
    year: 2025,
    cancerTypes: ['colorectal', 'gastric'],
    role: 'Co-first Author',
    keyFindings: {
      metric: 'Hazard Ratio',
      value: '0.81',
      ci: '0.70–0.94',
      pValue: '0.005',
      interpretation: 'Histamine H2 receptor antagonist use was associated with improved overall survival (19% mortality reduction) in colorectal and gastric cancer patients undergoing multidisciplinary care.',
    },
    trialDesign: 'Systematic Review & Meta-Analysis (Supervised by Dr. Amir Amirabadi)',
    doi: 'https://doi.org/10.22037/nibm.2025.h2.example',
    googleScholarUrl: 'https://scholar.google.com/citations?user=yyL8hhIAAAAJ',
    highlightedBiomarker: 'H2 Receptor Blockade',
    autoFillProfile: {
      cancerType: 'gastric',
      stage: 'metastatic',
      biomarkers: { her2: 'negative', pdl1Cps: 6, msi: 'MSS' },
    },
  },
  {
    id: 'pub-5',
    title: 'AI Based Radiogenomics for Predicting Metabolic and Nutritional Disorders: A Systematic Review and Meta Analysis',
    journal: 'Submitted / Under Review',
    year: 2026,
    cancerTypes: ['gastric', 'esophageal', 'colorectal', 'prostate'],
    role: 'Co-author / Researcher',
    keyFindings: {
      metric: 'Predictive AUC',
      value: '0.84',
      ci: '0.78–0.89',
      pValue: '<0.001',
      interpretation: 'Radiogenomic AI models integrating imaging biomarkers with metabolic data effectively predict nutritional and metabolic disorders in oncology patient cohorts.',
    },
    trialDesign: 'Systematic Review & Meta-Analysis',
    doi: 'https://scholar.google.com/citations?user=yyL8hhIAAAAJ',
    googleScholarUrl: 'https://scholar.google.com/citations?user=yyL8hhIAAAAJ',
    highlightedBiomarker: 'Radiogenomic Features',
    autoFillProfile: {
      cancerType: 'colorectal',
      stage: 'metastatic',
      biomarkers: { ras: 'WT', braf: 'WT', sidedness: 'left' },
    },
  },
];

export const publicationCancerTypes = [
  { id: 'all',        label: 'All Research' },
  { id: 'prostate',   label: 'Prostate' },
  { id: 'esophageal', label: 'Esophageal' },
  { id: 'gastric',    label: 'Gastric' },
  { id: 'colorectal', label: 'Colorectal' },
];
