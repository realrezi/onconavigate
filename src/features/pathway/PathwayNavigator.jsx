import React, { useState } from 'react';
import { usePatientProfile } from '../../context/PatientProfileContext';
import { CANCER_TYPES } from '../../engine/pathwayRules';
import { ChevronRight, RotateCcw, Check, Heart, HelpCircle } from 'lucide-react';
import './PathwayNavigator.css';

const STEPS = ['CANCER_TYPE', 'STAGE', 'BIOMARKERS', 'PRIOR_THERAPY'];

const STAGE_OPTIONS = {
  prostate:   ['I–II (Localized)', 'III (Locally Advanced)', 'Metastatic'],
  esophageal: ['I–II (Resectable)', 'III (Locally Advanced)', 'Metastatic'],
  gastric:    ['I–II (Resectable)', 'III (Locally Advanced)', 'Metastatic'],
  colorectal: ['I–II (Early)', 'III (Lymph Node Positive)', 'Metastatic'],
  lung:       ['I–II (Early Resectable)', 'III (Locally Advanced)', 'Metastatic (Stage IV)'],
  breast:     ['I–II (Early Stage)', 'III (Locally Advanced)', 'Metastatic (Stage IV)'],
  pancreatic: ['Resectable', 'Borderline / Locally Advanced', 'Metastatic'],
  bladder:    ['Non-Muscle Invasive (NMIBC)', 'Muscle Invasive (MIBC)', 'Metastatic Urothelial'],
};

const PRIOR_THERAPY_OPTIONS = {
  prostate:   ['surgery', 'radiation', 'AR_inhibitor', 'docetaxel', 'cabazitaxel'],
  esophageal: ['surgery', 'radiation', 'platinum', 'fluorouracil', 'immunotherapy'],
  gastric:    ['surgery', 'radiation', 'platinum', 'fluorouracil', 'trastuzumab', 'immunotherapy'],
  colorectal: ['surgery', 'radiation', 'oxaliplatin', 'irinotecan', 'bevacizumab', 'cetuximab'],
  lung:       ['surgery', 'radiation', 'osimertinib', 'alectinib', 'chemotherapy', 'immunotherapy'],
  breast:     ['surgery', 'radiation', 'cdk46_inhibitor', 'endocrine_therapy', 'trastuzumab', 'chemotherapy'],
  pancreatic: ['surgery', 'radiation', 'folfirinox', 'gemcitabine_nabpaclitaxel', 'platinum'],
  bladder:    ['surgery', 'radiation', 'enfortumab_pembrolizumab', 'platinum', 'avelumab'],
};

export default function PathwayNavigator() {
  const { profile, dispatch } = usePatientProfile();
  const [currentStep, setCurrentStep] = useState(0);

  function handleReset() {
    dispatch({ type: 'RESET' });
    setCurrentStep(0);
  }

  function goNext() {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  }
  function goBack() {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }

  return (
    <div className="navigator">
      {/* Header */}
      <div className="navigator-header">
        <div className="navigator-badge">
          <Heart size={14} className="heart-icon" /> Guided Clinical Pathway
        </div>
        <h2 className="navigator-title">Patient Profile Navigator</h2>
        <p className="navigator-subtitle">
          Select clinical parameters to build tailored, evidence-backed decision pathways.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="navigator-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={STEPS.length}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`progress-step ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}
            onClick={() => i < currentStep && setCurrentStep(i)}
            aria-label={`Step ${i + 1}`}
          >
            {i < currentStep ? <Check size={14} /> : i + 1}
          </div>
        ))}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Step Content */}
      <div className="navigator-step animate-fade-in-up" key={currentStep}>
        {currentStep === 0 && <StepCancerType profile={profile} dispatch={dispatch} onNext={goNext} />}
        {currentStep === 1 && <StepStage profile={profile} dispatch={dispatch} onNext={goNext} />}
        {currentStep === 2 && <StepBiomarkers profile={profile} dispatch={dispatch} onNext={goNext} />}
        {currentStep === 3 && <StepPriorTherapy profile={profile} dispatch={dispatch} />}
      </div>

      {/* Navigation Buttons */}
      <div className="navigator-actions">
        {currentStep > 0 && (
          <button className="nav-btn nav-btn-secondary" onClick={goBack}>
            Back
          </button>
        )}
        <button className="nav-btn nav-btn-ghost reset-btn" onClick={handleReset}>
          <RotateCcw size={14} /> Reset
        </button>
        {currentStep < STEPS.length - 1 && (
          <button
            className="nav-btn nav-btn-primary"
            onClick={goNext}
            disabled={currentStep === 0 && !profile.cancerType}
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function StepCancerType({ profile, dispatch, onNext }) {
  const getAnatomyImage = (id) => {
    const map = {
      prostate: 'prostate',
      esophageal: 'esophagus',
      gastric: 'stomach',
      colorectal: 'colon',
      lung: 'lungs',
      breast: 'breast',
      pancreatic: 'pancreas',
      bladder: 'bladder'
    };
    return `/assets/anatomy/${map[id]}.png`;
  };

  return (
    <div className="step-wrap">
      <h3 className="step-title">1. Select Cancer Domain</h3>
      <p className="step-desc">Choose from 8 major oncology clinical domains:</p>
      <div className="cancer-type-grid">
        {CANCER_TYPES.map(ct => (
          <button
            key={ct.id}
            id={`cancer-type-${ct.id}`}
            className={`cancer-type-card ${profile.cancerType === ct.id ? 'selected' : ''}`}
            style={{ '--ct-color': ct.color }}
            onClick={() => dispatch({ type: 'SET_CANCER_TYPE', payload: ct.id })}
          >
            <img src={getAnatomyImage(ct.id)} alt={`${ct.label} anatomy`} className="ct-image" />
            <div className="ct-label-wrap">
              <div className="ct-dot" />
              <span className="ct-label">{ct.label}</span>
              {profile.cancerType === ct.id && <Check size={18} className="ct-check" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepStage({ profile, dispatch, onNext }) {
  const options = STAGE_OPTIONS[profile.cancerType] || [];
  return (
    <div className="step-wrap">
      <h3 className="step-title">2. Disease Stage</h3>
      <p className="step-desc">Select the disease extent to route appropriate systemic options.</p>
      <div className="option-list">
        {options.map(opt => {
          const isMetastatic = opt.toLowerCase().includes('metastatic');
          const stageVal = isMetastatic ? 'metastatic' : opt.includes('III') ? 'III' : 'I-II';
          return (
            <button
              key={opt}
              id={`stage-${stageVal}`}
              className={`option-btn ${profile.stage === stageVal ? 'selected' : ''}`}
              onClick={() => dispatch({ type: 'SET_STAGE', payload: stageVal })}
            >
              <span className="option-label">{opt}</span>
              {profile.stage === stageVal && <Check size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBiomarkers({ profile, dispatch, onNext }) {
  const ct = profile.cancerType;
  const bm = profile.biomarkers;
  const set = (key, val) => dispatch({ type: 'SET_BIOMARKER', key, payload: val });

  const [psaUnit, setPsaUnit] = useState('ng/mL');
  const [activeHelp, setActiveHelp] = useState(null);

  const BIOMARKER_HELPS = {
    msi: {
      title: 'MSI / dMMR Status',
      text: 'Microsatellite Instability (MSI) and Mismatch Repair (dMMR) status test if cells are unable to repair mistakes made during DNA replication. High instability (MSI-H or dMMR) leads to a high number of mutations, making the tumor highly visible to the immune system. Patients with MSI-H/dMMR tumors derive profound benefits from immunotherapy (checkpoint inhibitors like Pembrolizumab).'
    },
    tmb: {
      title: 'Tumor Mutation Burden (TMB)',
      text: 'Tumor Mutational Burden (TMB) measures the quantity of genetic mutations per million base pairs inside the cancer cell\'s DNA. A high TMB (typically ≥10 mutations/Mb) creates unique proteins on the cell surface, making the tumor a strong candidate for PD-1/PD-L1 immunotherapy (like Pembrolizumab).'
    },
    crpc: {
      title: 'Castration Status (HSPC vs CRPC)',
      text: 'Distinguishes between Hormone-Sensitive Prostate Cancer (HSPC, responds to androgen suppression) and Castration-Resistant Prostate Cancer (CRPC, continues to grow despite testosterone suppression). Castration resistance is defined by disease progression when serum testosterone is suppressed to castrate levels (<50 ng/dL) by medical or surgical therapies.'
    },
    hrr: {
      title: 'HRR Mutation (BRCA1/2, ATM)',
      text: 'Homologous Recombination Repair (HRR) gene mutations affect genes (such as BRCA1, BRCA2, or ATM) responsible for repairing double-stranded DNA breaks. Presence of these mutations makes the tumor highly sensitive to PARP inhibitors (like Olaparib), which block alternative DNA repair pathways and trigger selective cancer cell death.'
    },
    psa: {
      title: 'PSA Level (Prostate-Specific Antigen)',
      text: 'Prostate-Specific Antigen (PSA) is a protein produced by cells of the prostate gland. Elevated PSA blood levels are used in clinical oncology to screen, monitor disease progression, evaluate response to hormone therapy, and check for cancer recurrence.'
    },
    histology: {
      title: 'Histology (Squamous vs Adenocarcinoma)',
      text: 'Esophageal cancer histology classifies the tumor cells under a microscope. Squamous Cell Carcinoma (ESCC) arises from the flat lining of the upper esophagus, whereas Adenocarcinoma (EAC) arises from glandular cells near the stomach (GEJ). They have different chemotherapy protocols and targeted drug indications.'
    },
    pdl1: {
      title: 'PD-L1 CPS Score',
      text: 'PD-L1 Combined Positive Score (CPS) evaluates the proportion of PD-L1-expressing cells (tumor cells, lymphocytes, and macrophages) relative to the total number of tumor cells. In esophageal and gastric cancers, a high CPS score (≥5 or ≥10) indicates that the patient is eligible for PD-1 immunotherapy (like Nivolumab or Pembrolizumab).'
    },
    her2: {
      title: 'HER2 Status',
      text: 'Human Epidermal Growth Factor Receptor 2 (HER2) is a growth-promoting protein. Overexpression (HER2-positive) drives aggressive cell division, but acts as a specific therapeutic target. HER2-positive tumors are treated with anti-HER2 monoclonal antibodies (Trastuzumab, Pertuzumab) or targeted antibody-drug conjugates (T-DXd).'
    },
    cldn18: {
      title: 'Claudin 18.2 (CLDN18.2)',
      text: 'Claudin 18.2 is a cell-surface tight junction protein that is frequently overexpressed in gastric and gastroesophageal junction (GEJ) cancers. A positive CLDN18.2 status makes the tumor highly eligible for treatment with Zolbetuximab, a targeted monoclonal antibody that binds directly to this protein.'
    },
    ras: {
      title: 'RAS Status (KRAS/NRAS)',
      text: 'RAS genes (KRAS and NRAS) regulate downstream growth signals. If mutated, the growth pathway remains active regardless of external signals, making anti-EGFR targeted drugs (Cetuximab/Panitumumab) ineffective. RAS wild-type (WT) tumors are eligible for anti-EGFR therapies, whereas mutant tumors receive anti-VEGF therapy (Bevacizumab).'
    },
    braf: {
      title: 'BRAF Status',
      text: 'BRAF is a protein kinase in the cell signaling pathway. The BRAF V600E mutation occurs in about 8-10% of metastatic colorectal cancers, representing a poor prognosis. It makes the tumor responsive to aggressive first-line chemotherapy (FOLFOXIRI) or targeted combination therapies (Encorafenib + Cetuximab) in second-line.'
    },
    sidedness: {
      title: 'Primary Tumor Sidedness',
      text: 'Colorectal primary tumor sidedness dictates treatment response. Left-sided colon tumors (splenic flexure to rectum) derive a significant overall survival benefit from anti-EGFR therapy (Panitumumab/Cetuximab) combined with chemotherapy. Right-sided tumors (cecum to transverse colon) are less responsive and prefer Bevacizumab.'
    },
    egfr: {
      title: 'EGFR Mutation',
      text: 'Epidermal Growth Factor Receptor (EGFR) mutations (most commonly Exon 19 deletion or Exon 21 L858R) drive uncontrolled cell division in NSCLC lung cancer. They render the tumor highly sensitive to first-line EGFR tyrosine kinase inhibitors (TKIs), specifically the standard 3rd-generation drug Osimertinib.'
    },
    alk: {
      title: 'ALK Rearrangement',
      text: 'Anaplastic Lymphoma Kinase (ALK) gene rearrangements create an abnormal fusion protein (EML4-ALK) that drives lung cancer. ALK-positive lung cancers are treated with oral ALK inhibitors (like Lorlatinib, Alectinib, or Brigatinib) which achieve exceptional disease control and progression-free survival.'
    },
    pdl1Tps: {
      title: 'PD-L1 TPS Score',
      text: 'Tumor Proportion Score (TPS) measures the percentage of viable tumor cells displaying partial or complete PD-L1 membrane staining. In advanced NSCLC without driver mutations (like EGFR or ALK), a high TPS score (≥50%) allows for the use of first-line Pembrolizumab monotherapy, avoiding standard chemotherapy.'
    },
    kras: {
      title: 'KRAS G12C Status',
      text: 'KRAS G12C is a specific mutation in the KRAS gene. Historically difficult to target, advanced NSCLC harboring this mutation can now be treated in the second-line setting with direct KRAS G12C inhibitors (Sotorasib or Adagrasib) following standard chemo-immunotherapy.'
    },
    hr: {
      title: 'Hormone Receptor Status (ER/PR)',
      text: 'Hormone Receptor (HR) status evaluates if breast cancer cells have estrogen receptors (ER) or progesterone receptors (PR). HR-positive tumors are stimulated to grow by hormones, making them targets for endocrine therapies (like Aromatase Inhibitors or Fulvestrant) combined with CDK4/6 inhibitors.'
    },
    pik3ca: {
      title: 'PIK3CA Mutation',
      text: 'PIK3CA mutations occur in about 40% of HR+ breast cancers and drive resistance to endocrine therapy. Finding a PIK3CA mutation qualifies the patient for targeted therapy using the PI3K-alpha inhibitor Alpelisib combined with Fulvestrant after progression on primary hormone blockade.'
    },
    brca: {
      title: 'Germline BRCA1/2 Mutation',
      text: 'Inherited BRCA1 or BRCA2 mutations impair the cells\' homologous recombination DNA repair mechanism. In metastatic pancreatic cancer, patients with germline BRCA mutations who have achieved stable disease on platinum chemotherapy are candidates for maintenance therapy with the PARP inhibitor Olaparib.'
    },
    fgfr: {
      title: 'FGFR2/3 Alteration',
      text: 'Fibroblast Growth Factor Receptor (FGFR) alterations (mutations or fusions) drive tumor proliferation. In advanced bladder/urothelial carcinoma, patients carrying FGFR2 or FGFR3 alterations are eligible for targeted second-line therapy with the oral FGFR inhibitor Erdafitinib.'
    }
  };

  return (
    <div className="step-wrap">
      <h3 className="step-title">3. Molecular &amp; Tissue Biomarkers</h3>
      <p className="step-desc">Specify biomarker findings to unlock targeted and immunotherapy pathways.</p>
      <div className="biomarker-grid">

        {/* Universal */}
        <BiomarkerSelect label="MSI / dMMR Status" id="bm-msi"
          value={bm.msi || ''}
          onChange={v => set('msi', v)}
          options={[{ value: 'MSI-H', label: 'MSI-H / dMMR' }, { value: 'MSS', label: 'MSS / pMMR' }, { value: 'unknown', label: 'Not Tested' }]}
          onHelp={() => setActiveHelp(BIOMARKER_HELPS.msi)}
        />
        <BiomarkerNumber label="Tumor Mutation Burden" id="bm-tmb"
          value={bm.tmb || ''}
          onChange={v => set('tmb', Number(v))}
          placeholder="e.g. 12"
          unitLabel="mut/Mb"
          hint="≥10 mut/Mb = TMB-High"
          onHelp={() => setActiveHelp(BIOMARKER_HELPS.tmb)}
        />

        {/* Prostate */}
        {ct === 'prostate' && <>
          <BiomarkerToggle label="Castration Status" id="bm-crpc"
            value={bm.castrationResistant}
            onChange={v => { set('castrationResistant', v); set('isMetastatic', profile.stage === 'metastatic'); }}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.crpc)}
          />
          <BiomarkerSelect label="HRR Mutation (BRCA1/2, ATM)" id="bm-hrr"
            value={bm.hrrMutation || ''}
            onChange={v => set('hrrMutation', v)}
            options={[{ value: 'BRCA2', label: 'BRCA2 Mutated' }, { value: 'BRCA1', label: 'BRCA1 Mutated' }, { value: 'ATM', label: 'ATM Mutated' }, { value: 'none', label: 'Negative / Wild-type' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.hrr)}
          />
          <BiomarkerNumber
            label="PSA Level"
            id="bm-psa"
            value={bm.psa || ''}
            onChange={v => set('psa', Number(v))}
            placeholder="e.g. 45"
            unitLabel={psaUnit}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.psa)}
            unitSelect={
              <select className="unit-toggle" value={psaUnit} onChange={e => setPsaUnit(e.target.value)}>
                <option value="ng/mL">ng/mL</option>
                <option value="ug/L">μg/L (SI Metric)</option>
              </select>
            }
          />
        </>}

        {/* Esophageal */}
        {ct === 'esophageal' && <>
          <BiomarkerSelect label="Histology" id="bm-histology"
            value={bm.histology || ''}
            onChange={v => set('histology', v)}
            options={[{ value: 'SCC', label: 'Squamous Cell Carcinoma (ESCC)' }, { value: 'EAC', label: 'Adenocarcinoma (EAC / GEJ)' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.histology)}
          />
          <BiomarkerNumber label="PD-L1 CPS Score" id="bm-pdl1" value={bm.pdl1Cps || ''} onChange={v => set('pdl1Cps', Number(v))} placeholder="e.g. 10" unitLabel="CPS point score" hint="CPS ≥10 = High Immunotherapy Benefit" onHelp={() => setActiveHelp(BIOMARKER_HELPS.pdl1)} />
          <BiomarkerSelect label="HER2 Status" id="bm-her2"
            value={bm.her2 || ''}
            onChange={v => set('her2', v)}
            options={[{ value: 'positive', label: 'HER2 Positive (IHC 3+ / FISH+)' }, { value: 'negative', label: 'HER2 Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.her2)}
          />
        </>}

        {/* Gastric */}
        {ct === 'gastric' && <>
          <BiomarkerSelect label="HER2 Status" id="bm-her2-g"
            value={bm.her2 || ''}
            onChange={v => set('her2', v)}
            options={[{ value: 'positive', label: 'HER2 Positive (KEYNOTE-811)' }, { value: 'negative', label: 'HER2 Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.her2)}
          />
          <BiomarkerSelect label="Claudin 18.2 (CLDN18.2)" id="bm-cldn18"
            value={bm.cldn18 || ''}
            onChange={v => set('cldn18', v)}
            options={[{ value: 'positive', label: 'Positive (Zolbetuximab Eligible)' }, { value: 'negative', label: 'Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.cldn18)}
          />
          <BiomarkerNumber label="PD-L1 CPS Score" id="bm-pdl1-g" value={bm.pdl1Cps || ''} onChange={v => set('pdl1Cps', Number(v))} placeholder="e.g. 5" unitLabel="CPS point score" hint="CPS ≥5 = Nivolumab Benefit" onHelp={() => setActiveHelp(BIOMARKER_HELPS.pdl1)} />
        </>}

        {/* Colorectal */}
        {ct === 'colorectal' && <>
          <BiomarkerSelect label="RAS Status (KRAS/NRAS)" id="bm-ras"
            value={bm.ras || ''}
            onChange={v => set('ras', v)}
            options={[{ value: 'WT', label: 'RAS Wild-Type (Anti-EGFR Eligible)' }, { value: 'Mutant', label: 'RAS Mutant (Bevacizumab Preferred)' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.ras)}
          />
          <BiomarkerSelect label="BRAF Status" id="bm-braf"
            value={bm.braf || ''}
            onChange={v => set('braf', v)}
            options={[{ value: 'WT', label: 'BRAF Wild-Type' }, { value: 'V600E', label: 'BRAF V600E Mutant (BEACON Trial)' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.braf)}
          />
          <BiomarkerSelect label="Primary Tumor Sidedness" id="bm-sidedness"
            value={bm.sidedness || ''}
            onChange={v => set('sidedness', v)}
            options={[{ value: 'left', label: 'Left-Sided (Splenic flexure to rectum)' }, { value: 'right', label: 'Right-Sided (Cecum to transverse colon)' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.sidedness)}
          />
        </>}

        {/* NSCLC Lung */}
        {ct === 'lung' && <>
          <BiomarkerSelect label="EGFR Mutation" id="bm-egfr"
            value={bm.egfr || ''}
            onChange={v => set('egfr', v)}
            options={[{ value: 'exon19', label: 'Exon 19 Deletion (Osimertinib 1L)' }, { value: 'L858R', label: 'Exon 21 L858R' }, { value: 'WT', label: 'Wild-Type / Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.egfr)}
          />
          <BiomarkerSelect label="ALK Rearrangement" id="bm-alk"
            value={bm.alk || ''}
            onChange={v => set('alk', v)}
            options={[{ value: 'positive', label: 'ALK Positive (Alectinib / Lorlatinib)' }, { value: 'negative', label: 'Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.alk)}
          />
          <BiomarkerNumber label="PD-L1 TPS Score" id="bm-pdl1-tps" value={bm.pdl1Tps || ''} onChange={v => set('pdl1Tps', Number(v))} placeholder="e.g. 60" unitLabel="TPS %" hint="TPS ≥50% = Monotherapy Immunotherapy" onHelp={() => setActiveHelp(BIOMARKER_HELPS.pdl1Tps)} />
          <BiomarkerSelect label="KRAS G12C Status" id="bm-kras"
            value={bm.krasG12c || ''}
            onChange={v => set('krasG12c', v)}
            options={[{ value: 'positive', label: 'KRAS G12C Mutated (Sotorasib)' }, { value: 'negative', label: 'Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.kras)}
          />
        </>}

        {/* Breast */}
        {ct === 'breast' && <>
          <BiomarkerSelect label="Hormone Receptor (HR)" id="bm-hr"
            value={bm.hrStatus || ''}
            onChange={v => set('hrStatus', v)}
            options={[{ value: 'positive', label: 'HR Positive (ER+ / PR+)' }, { value: 'negative', label: 'HR Negative (TNBC candidate)' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.hr)}
          />
          <BiomarkerSelect label="HER2 Status" id="bm-her2-b"
            value={bm.her2 || ''}
            onChange={v => set('her2', v)}
            options={[{ value: 'positive', label: 'HER2 Positive (CLEOPATRA / T-DXd)' }, { value: 'negative', label: 'HER2 Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.her2)}
          />
          <BiomarkerSelect label="PIK3CA Mutation" id="bm-pik3ca"
            value={bm.pik3ca || ''}
            onChange={v => set('pik3ca', v)}
            options={[{ value: 'positive', label: 'PIK3CA Mutated (Alpelisib)' }, { value: 'negative', label: 'Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.pik3ca)}
          />
        </>}

        {/* Pancreatic */}
        {ct === 'pancreatic' && <>
          <BiomarkerSelect label="Germline BRCA1/2 Mutation" id="bm-brca"
            value={bm.brcaMutation || ''}
            onChange={v => set('brcaMutation', v)}
            options={[{ value: 'positive', label: 'BRCA1/2 Mutated (Olaparib POLO)' }, { value: 'negative', label: 'Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.brca)}
          />
        </>}

        {/* Bladder */}
        {ct === 'bladder' && <>
          <BiomarkerSelect label="FGFR2/3 Alteration" id="bm-fgfr"
            value={bm.fgfrMutation || ''}
            onChange={v => set('fgfrMutation', v)}
            options={[{ value: 'positive', label: 'FGFR2/3 Altered (Erdafitinib)' }, { value: 'negative', label: 'Negative' }]}
            onHelp={() => setActiveHelp(BIOMARKER_HELPS.fgfr)}
          />
          <BiomarkerNumber label="PD-L1 CPS Score" id="bm-pdl1-b" value={bm.pdl1Cps || ''} onChange={v => set('pdl1Cps', Number(v))} placeholder="e.g. 10" unitLabel="CPS point score" onHelp={() => setActiveHelp(BIOMARKER_HELPS.pdl1)} />
        </>}
      </div>

      {/* Interactive Medical Explanation Modal */}
      {activeHelp && (
        <div className="bm-help-modal-overlay" onClick={() => setActiveHelp(null)}>
          <div className="bm-help-modal" onClick={e => e.stopPropagation()}>
            <div className="bm-help-modal-header">
              <h4 className="bm-help-modal-title">{activeHelp.title}</h4>
              <button type="button" className="bm-help-modal-close" onClick={() => setActiveHelp(null)} aria-label="Close dialog">
                &times;
              </button>
            </div>
            <div className="bm-help-modal-body">
              <p>{activeHelp.text}</p>
            </div>
            <div className="bm-help-modal-footer">
              <button type="button" className="bm-help-modal-btn" onClick={() => setActiveHelp(null)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="nav-btn nav-btn-primary" onClick={onNext}>
          Continue to Prior Therapy
        </button>
      </div>
    </div>
  );
}

function StepPriorTherapy({ profile, dispatch }) {
  const options = PRIOR_THERAPY_OPTIONS[profile.cancerType] || [];
  return (
    <div className="step-wrap">
      <h3 className="step-title">4. Prior Therapy Exposure</h3>
      <p className="step-desc">Select prior systemic treatments to filter next-line regimens.</p>
      <div className="therapy-grid">
        {options.map(therapy => {
          const selected = profile.priorTherapies.includes(therapy);
          return (
            <button
              key={therapy}
              id={`therapy-${therapy}`}
              className={`therapy-chip ${selected ? 'selected' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_PRIOR_THERAPY', payload: therapy })}
              aria-pressed={selected}
            >
              {selected && <Check size={14} />}
              {therapy.replace(/_/g, ' ')}
            </button>
          );
        })}
      </div>
      {profile.priorTherapies.length === 0 && (
        <p className="therapy-none-hint">💡 If treatment-naïve, leave unselected for 1st line recommendations.</p>
      )}
    </div>
  );
}

function BiomarkerSelect({ label, id, value, onChange, options, onHelp }) {
  return (
    <div className="bm-field">
      <div className="field-label-row">
        <div className="bm-label-group">
          <label htmlFor={id} className="bm-label">{label}</label>
          {onHelp && (
            <button type="button" onClick={onHelp} className="bm-info-btn" title="Learn more about this biomarker">
              <HelpCircle size={15} />
            </button>
          )}
        </div>
      </div>
      <select id={id} className="bm-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function BiomarkerNumber({ label, id, value, onChange, placeholder, hint, unitLabel, unitSelect, onHelp }) {
  return (
    <div className="bm-field">
      <div className="field-label-row">
        <div className="bm-label-group">
          <label htmlFor={id} className="bm-label">{label}</label>
          {onHelp && (
            <button type="button" onClick={onHelp} className="bm-info-btn" title="Learn more about this biomarker">
              <HelpCircle size={15} />
            </button>
          )}
        </div>
        {unitSelect}
      </div>
      <div className="bm-input-wrap">
        <input
          id={id}
          type="number"
          className="bm-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min="0"
        />
        {unitLabel && !unitSelect && <span className="input-unit-tag">{unitLabel}</span>}
      </div>
      {hint && <span className="bm-hint">{hint}</span>}
    </div>
  );
}

function BiomarkerToggle({ label, id, value, onChange, onHelp }) {
  return (
    <div className="bm-field bm-toggle-field">
      <div className="field-label-row" style={{ marginBottom: 'var(--space-1)' }}>
        <div className="bm-label-group">
          <label className="bm-label">{label}</label>
          {onHelp && (
            <button type="button" onClick={onHelp} className="bm-info-btn" title="Learn more about this status">
              <HelpCircle size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="bm-toggle-wrap">
        {[{ val: false, lbl: 'Hormone Sensitive (HSPC)' }, { val: true, lbl: 'Castration Resistant (CRPC)' }].map(opt => (
          <button
            key={String(opt.val)}
            id={`${id}-${opt.val}`}
            className={`bm-toggle-btn ${value === opt.val ? 'selected' : ''}`}
            onClick={() => onChange(opt.val)}
          >
            {opt.lbl}
          </button>
        ))}
      </div>
    </div>
  );
}
