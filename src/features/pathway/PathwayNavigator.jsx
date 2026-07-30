import React, { useState } from 'react';
import { usePatientProfile } from '../../context/PatientProfileContext';
import { CANCER_TYPES } from '../../engine/pathwayRules';
import { ChevronRight, RotateCcw, Check, Heart } from 'lucide-react';
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
  prostate:   ['AR_inhibitor', 'docetaxel', 'cabazitaxel', 'radiation'],
  esophageal: ['platinum', 'fluorouracil', 'immunotherapy', 'surgery'],
  gastric:    ['platinum', 'fluorouracil', 'trastuzumab', 'immunotherapy'],
  colorectal: ['oxaliplatin', 'irinotecan', 'bevacizumab', 'cetuximab'],
  lung:       ['osimertinib', 'alectinib', 'chemotherapy', 'immunotherapy'],
  breast:     ['cdk46_inhibitor', 'endocrine_therapy', 'trastuzumab', 'chemotherapy'],
  pancreatic: ['folfirinox', 'gemcitabine_nabpaclitaxel', 'platinum'],
  bladder:    ['enfortumab_pembrolizumab', 'platinum', 'avelumab'],
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
            onClick={() => { dispatch({ type: 'SET_CANCER_TYPE', payload: ct.id }); onNext(); }}
          >
            <div className="ct-dot" />
            <span className="ct-label">{ct.label}</span>
            {profile.cancerType === ct.id && <Check size={16} className="ct-check" />}
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
              onClick={() => { dispatch({ type: 'SET_STAGE', payload: stageVal }); onNext(); }}
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

function StepBiomarkers({ profile, dispatch }) {
  const ct = profile.cancerType;
  const bm = profile.biomarkers;
  const set = (key, val) => dispatch({ type: 'SET_BIOMARKER', key, payload: val });

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
        />
        <BiomarkerNumber label="Tumor Mutation Burden (mut/Mb)" id="bm-tmb"
          value={bm.tmb || ''}
          onChange={v => set('tmb', Number(v))}
          placeholder="e.g. 12"
          hint="≥10 = TMB-High"
        />

        {/* Prostate */}
        {ct === 'prostate' && <>
          <BiomarkerToggle label="Castration Status" id="bm-crpc"
            value={bm.castrationResistant}
            onChange={v => { set('castrationResistant', v); set('isMetastatic', profile.stage === 'metastatic'); }}
          />
          <BiomarkerSelect label="HRR Mutation (BRCA1/2, ATM)" id="bm-hrr"
            value={bm.hrrMutation || ''}
            onChange={v => set('hrrMutation', v)}
            options={[{ value: 'BRCA2', label: 'BRCA2 Mutated' }, { value: 'BRCA1', label: 'BRCA1 Mutated' }, { value: 'ATM', label: 'ATM Mutated' }, { value: 'none', label: 'Negative / Wild-type' }]}
          />
          <BiomarkerNumber label="PSA Level (ng/mL)" id="bm-psa" value={bm.psa || ''} onChange={v => set('psa', Number(v))} placeholder="e.g. 45" />
        </>}

        {/* Esophageal */}
        {ct === 'esophageal' && <>
          <BiomarkerSelect label="Histology" id="bm-histology"
            value={bm.histology || ''}
            onChange={v => set('histology', v)}
            options={[{ value: 'SCC', label: 'Squamous Cell Carcinoma (ESCC)' }, { value: 'EAC', label: 'Adenocarcinoma (EAC / GEJ)' }]}
          />
          <BiomarkerNumber label="PD-L1 CPS Score" id="bm-pdl1" value={bm.pdl1Cps || ''} onChange={v => set('pdl1Cps', Number(v))} placeholder="e.g. 10" hint="CPS ≥10 = High Immunotherapy Benefit" />
          <BiomarkerSelect label="HER2 Status" id="bm-her2"
            value={bm.her2 || ''}
            onChange={v => set('her2', v)}
            options={[{ value: 'positive', label: 'HER2 Positive (IHC 3+ / FISH+)' }, { value: 'negative', label: 'HER2 Negative' }]}
          />
        </>}

        {/* Gastric */}
        {ct === 'gastric' && <>
          <BiomarkerSelect label="HER2 Status" id="bm-her2-g"
            value={bm.her2 || ''}
            onChange={v => set('her2', v)}
            options={[{ value: 'positive', label: 'HER2 Positive (KEYNOTE-811)' }, { value: 'negative', label: 'HER2 Negative' }]}
          />
          <BiomarkerSelect label="Claudin 18.2 (CLDN18.2)" id="bm-cldn18"
            value={bm.cldn18 || ''}
            onChange={v => set('cldn18', v)}
            options={[{ value: 'positive', label: 'Positive (Zolbetuximab Eligible)' }, { value: 'negative', label: 'Negative' }]}
          />
          <BiomarkerNumber label="PD-L1 CPS Score" id="bm-pdl1-g" value={bm.pdl1Cps || ''} onChange={v => set('pdl1Cps', Number(v))} placeholder="e.g. 5" hint="CPS ≥5 = Nivolumab Benefit" />
        </>}

        {/* Colorectal */}
        {ct === 'colorectal' && <>
          <BiomarkerSelect label="RAS Status (KRAS/NRAS)" id="bm-ras"
            value={bm.ras || ''}
            onChange={v => set('ras', v)}
            options={[{ value: 'WT', label: 'RAS Wild-Type (Anti-EGFR Eligible)' }, { value: 'Mutant', label: 'RAS Mutant (Bevacizumab Preferred)' }]}
          />
          <BiomarkerSelect label="BRAF Status" id="bm-braf"
            value={bm.braf || ''}
            onChange={v => set('braf', v)}
            options={[{ value: 'WT', label: 'BRAF Wild-Type' }, { value: 'V600E', label: 'BRAF V600E Mutant (BEACON Trial)' }]}
          />
          <BiomarkerSelect label="Primary Tumor Sidedness" id="bm-sidedness"
            value={bm.sidedness || ''}
            onChange={v => set('sidedness', v)}
            options={[{ value: 'left', label: 'Left-Sided (Splenic flexure to rectum)' }, { value: 'right', label: 'Right-Sided (Cecum to transverse colon)' }]}
          />
        </>}

        {/* NSCLC Lung */}
        {ct === 'lung' && <>
          <BiomarkerSelect label="EGFR Mutation" id="bm-egfr"
            value={bm.egfr || ''}
            onChange={v => set('egfr', v)}
            options={[{ value: 'exon19', label: 'Exon 19 Deletion (Osimertinib 1L)' }, { value: 'L858R', label: 'Exon 21 L858R' }, { value: 'WT', label: 'Wild-Type / Negative' }]}
          />
          <BiomarkerSelect label="ALK Rearrangement" id="bm-alk"
            value={bm.alk || ''}
            onChange={v => set('alk', v)}
            options={[{ value: 'positive', label: 'ALK Positive (Alectinib / Lorlatinib)' }, { value: 'negative', label: 'Negative' }]}
          />
          <BiomarkerNumber label="PD-L1 TPS (%)" id="bm-pdl1-tps" value={bm.pdl1Tps || ''} onChange={v => set('pdl1Tps', Number(v))} placeholder="e.g. 60" hint="TPS ≥50% = Monotherapy Immunotherapy" />
          <BiomarkerSelect label="KRAS G12C Status" id="bm-kras"
            value={bm.krasG12c || ''}
            onChange={v => set('krasG12c', v)}
            options={[{ value: 'positive', label: 'KRAS G12C Mutated (Sotorasib)' }, { value: 'negative', label: 'Negative' }]}
          />
        </>}

        {/* Breast */}
        {ct === 'breast' && <>
          <BiomarkerSelect label="Hormone Receptor (HR)" id="bm-hr"
            value={bm.hrStatus || ''}
            onChange={v => set('hrStatus', v)}
            options={[{ value: 'positive', label: 'HR Positive (ER+ / PR+)' }, { value: 'negative', label: 'HR Negative (TNBC candidate)' }]}
          />
          <BiomarkerSelect label="HER2 Status" id="bm-her2-b"
            value={bm.her2 || ''}
            onChange={v => set('her2', v)}
            options={[{ value: 'positive', label: 'HER2 Positive (CLEOPATRA / T-DXd)' }, { value: 'negative', label: 'HER2 Negative' }]}
          />
          <BiomarkerSelect label="PIK3CA Mutation" id="bm-pik3ca"
            value={bm.pik3ca || ''}
            onChange={v => set('pik3ca', v)}
            options={[{ value: 'positive', label: 'PIK3CA Mutated (Alpelisib)' }, { value: 'negative', label: 'Negative' }]}
          />
        </>}

        {/* Pancreatic */}
        {ct === 'pancreatic' && <>
          <BiomarkerSelect label="Germline BRCA1/2 Mutation" id="bm-brca"
            value={bm.brcaMutation || ''}
            onChange={v => set('brcaMutation', v)}
            options={[{ value: 'positive', label: 'BRCA1/2 Mutated (Olaparib POLO)' }, { value: 'negative', label: 'Negative' }]}
          />
        </>}

        {/* Bladder */}
        {ct === 'bladder' && <>
          <BiomarkerSelect label="FGFR2/3 Alteration" id="bm-fgfr"
            value={bm.fgfrMutation || ''}
            onChange={v => set('fgfrMutation', v)}
            options={[{ value: 'positive', label: 'FGFR2/3 Altered (Erdafitinib)' }, { value: 'negative', label: 'Negative' }]}
          />
          <BiomarkerNumber label="PD-L1 CPS Score" id="bm-pdl1-b" value={bm.pdl1Cps || ''} onChange={v => set('pdl1Cps', Number(v))} placeholder="e.g. 10" />
        </>}
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

function BiomarkerSelect({ label, id, value, onChange, options }) {
  return (
    <div className="bm-field">
      <label htmlFor={id} className="bm-label">{label}</label>
      <select id={id} className="bm-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function BiomarkerNumber({ label, id, value, onChange, placeholder, hint }) {
  return (
    <div className="bm-field">
      <label htmlFor={id} className="bm-label">{label}</label>
      {hint && <span className="bm-hint">{hint}</span>}
      <input
        id={id}
        type="number"
        className="bm-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min="0"
      />
    </div>
  );
}

function BiomarkerToggle({ label, id, value, onChange }) {
  return (
    <div className="bm-field bm-toggle-field">
      <label className="bm-label">{label}</label>
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
