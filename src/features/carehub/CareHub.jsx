import React, { useState } from 'react';
import { treatmentGuides, sideEffectGuides } from './careHub.data';
import { Heart, Calculator, BookOpen, ShieldAlert, CheckSquare, Copy, Check, Sparkles, Activity } from 'lucide-react';
import './CareHub.css';

export default function CareHub() {
  const [subTab, setSubTab] = useState('patient'); // 'patient' | 'calculators'

  return (
    <div className="care-hub animate-fade-in-up">
      {/* Header */}
      <div className="care-header">
        <div className="care-header-info">
          <div className="care-badge">
            <Heart size={14} className="heart-icon" /> Supportive Care &amp; Clinical Tools
          </div>
          <h2 className="care-title">Care Companion &amp; Clinical Toolkit</h2>
          <p className="care-subtitle">
            Empowering patients and families with clear, supportive treatment guidance while providing clinicians with instant bedside calculators and international unit conversions.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="care-subtab-bar" role="tablist" aria-label="Sub-tabs">
          <button
            id="subtab-patient"
            className={`care-subtab-btn ${subTab === 'patient' ? 'active' : ''}`}
            onClick={() => setSubTab('patient')}
            role="tab"
            aria-selected={subTab === 'patient'}
          >
            <Heart size={15} /> Patient &amp; Family Care Guide
          </button>
          <button
            id="subtab-calculators"
            className={`care-subtab-btn ${subTab === 'calculators' ? 'active' : ''}`}
            onClick={() => setSubTab('calculators')}
            role="tab"
            aria-selected={subTab === 'calculators'}
          >
            <Calculator size={15} /> Bedside Clinical Calculators
          </button>
        </div>
      </div>

      {/* Content */}
      {subTab === 'patient' && <PatientCareSection />}
      {subTab === 'calculators' && <ClinicalCalculatorsSection />}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Patient & Family Care Companion
// ──────────────────────────────────────────────────────────────
function PatientCareSection() {
  const [activeGuide, setActiveGuide] = useState(treatmentGuides[0].id);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [copied, setCopied] = useState(false);

  const guide = treatmentGuides.find(g => g.id === activeGuide) || treatmentGuides[0];

  function toggleQuestion(q) {
    setSelectedQuestions(prev =>
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    );
  }

  function copyQuestionList() {
    if (selectedQuestions.length === 0) return;
    const text = `Questions for My Oncology Appointment:\n\n${selectedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="patient-care-wrap animate-fade-in">
      {/* Treatment Guides */}
      <section className="care-section">
        <h3 className="section-title">
          <BookOpen size={18} /> Understanding Your Treatment
        </h3>
        <p className="section-desc">
          Clear, reassuring explanations of oncology treatment categories and what to expect during care.
        </p>

        <div className="guide-pills">
          {treatmentGuides.map(g => (
            <button
              key={g.id}
              className={`guide-pill ${activeGuide === g.id ? 'active' : ''}`}
              onClick={() => setActiveGuide(g.id)}
            >
              {g.category}
            </button>
          ))}
        </div>

        <div className="guide-card animate-fade-in-up" key={guide.id}>
          <h4 className="guide-card-title">{guide.title}</h4>
          <p className="guide-summary">{guide.summary}</p>

          <div className="guide-grid">
            <div className="guide-box">
              <h5>How It Works</h5>
              <p>{guide.howItWorks}</p>
            </div>
            <div className="guide-box">
              <h5>What to Expect</h5>
              <p>{guide.whatToExpect}</p>
            </div>
          </div>

          <div className="question-builder">
            <div className="qb-header">
              <CheckSquare size={16} /> Suggested Questions to Ask Your Doctor
            </div>
            <p className="qb-desc">Select questions below to add them to your personalized appointment checklist:</p>

            <div className="qb-list">
              {guide.keyQuestions.map((q, idx) => {
                const checked = selectedQuestions.includes(q);
                return (
                  <button
                    key={idx}
                    className={`qb-item ${checked ? 'checked' : ''}`}
                    onClick={() => toggleQuestion(q)}
                  >
                    <div className="qb-checkbox">
                      {checked && <Check size={12} />}
                    </div>
                    <span>{q}</span>
                  </button>
                );
              })}
            </div>

            {selectedQuestions.length > 0 && (
              <div className="qb-action-bar">
                <span className="qb-count">{selectedQuestions.length} question(s) selected</span>
                <button className="copy-btn" onClick={copyQuestionList}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Question Checklist'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Symptom & Side Effect Navigator */}
      <section className="care-section">
        <h3 className="section-title">
          <ShieldAlert size={18} /> Symptom &amp; Side-Effect Companion
        </h3>
        <p className="section-desc">
          Practical wellness tips for managing common treatment side effects at home, along with clear safety guidelines.
        </p>

        <div className="side-effect-grid">
          {sideEffectGuides.map(se => (
            <div key={se.id} className="se-card">
              <div className="se-header">
                <h4 className="se-title">{se.symptom}</h4>
                <span className="se-badge">{se.frequency}</span>
              </div>

              <ul className="se-tips">
                {se.managementTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>

              <div className="se-alert">
                <strong>When to Call:</strong> {se.whenToCall}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Bedside Clinical Calculators with International Unit Converters
// ──────────────────────────────────────────────────────────────
function ClinicalCalculatorsSection() {
  // Height & Weight Units
  const [heightVal, setHeightVal] = useState(170);
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' | 'in'

  const [weightVal, setWeightVal] = useState(70);
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' | 'lbs'

  // Creatinine Units
  const [age, setAge] = useState(60);
  const [scrVal, setScrVal] = useState(1.0);
  const [scrUnit, setScrUnit] = useState('mg/dL'); // 'mg/dL' | 'umol/L'
  const [isFemale, setIsFemale] = useState(false);
  const [targetAuc, setTargetAuc] = useState(5);

  // Inflammatory Cell Count Units
  const [ancVal, setAncVal] = useState(4.2);
  const [alcVal, setAlcVal] = useState(1.4);
  const [cellUnit, setCellUnit] = useState('x10^9/L'); // 'x10^9/L' | '/uL'

  // ── Standardized Internal Values (Metric: cm, kg, mg/dL, x10^9/L) ──
  const heightCm = heightUnit === 'in' ? heightVal * 2.54 : heightVal;
  const weightKg = weightUnit === 'lbs' ? weightVal / 2.20462 : weightVal;
  const scrMgDl = scrUnit === 'umol/L' ? scrVal / 88.4 : scrVal;

  const ancStd = cellUnit === '/uL' ? ancVal / 1000 : ancVal;
  const alcStd = cellUnit === '/uL' ? alcVal / 1000 : alcVal;

  // 1. Mosteller BSA Formula: sqrt((heightCm * weightKg) / 3600)
  const bsa = heightCm > 0 && weightKg > 0 ? Math.sqrt((heightCm * weightKg) / 3600).toFixed(2) : '0.00';

  // 2. Cockcroft-Gault CrCl = ((140 - age) * weightKg) / (72 * scrMgDl) * (isFemale ? 0.85 : 1.0)
  const rawCrCl = scrMgDl > 0 ? ((140 - age) * weightKg) / (72 * scrMgDl) : 0;
  const crClVal = (rawCrCl * (isFemale ? 0.85 : 1.0)).toFixed(1);

  // Calvert Formula: Dose (mg) = Target AUC * (CrCl + 25)
  // Max CrCl for Calvert is capped at 125 mL/min per FDA/NCCN guidance
  const cappedCrCl = Math.min(Math.max(Number(crClVal), 0), 125);
  const carboplatinDose = Math.round(targetAuc * (cappedCrCl + 25));

  // 3. Neutrophil-to-Lymphocyte Ratio (NLR)
  const nlr = alcStd > 0 ? (ancStd / alcStd).toFixed(2) : '0.00';

  return (
    <div className="calculators-wrap animate-fade-in">
      <div className="calc-intro">
        <Sparkles size={16} className="calc-icon" />
        <p>Bedside clinical formulas with seamless switching between Metric (kg, cm, μmol/L) and US Conventional (lbs, in, mg/dL) units.</p>
      </div>

      <div className="calc-grid">
        {/* 1. Body Surface Area (BSA) */}
        <div className="calc-card">
          <h4 className="calc-card-title">
            <Calculator size={16} /> Body Surface Area (Mosteller)
          </h4>
          <p className="calc-card-desc">Standard formula for calculating chemotherapy dosage per m².</p>

          <div className="calc-inputs">
            {/* Height Field */}
            <div className="calc-field">
              <div className="field-label-row">
                <label>Height</label>
                <select className="unit-toggle" value={heightUnit} onChange={e => setHeightUnit(e.target.value)}>
                  <option value="cm">cm (Metric)</option>
                  <option value="in">inches (US)</option>
                </select>
              </div>
              <input type="number" value={heightVal} onChange={e => setHeightVal(Number(e.target.value))} min="1" />
              {heightUnit === 'in' && <span className="unit-subtext">≈ {(heightVal * 2.54).toFixed(1)} cm</span>}
            </div>

            {/* Weight Field */}
            <div className="calc-field">
              <div className="field-label-row">
                <label>Weight</label>
                <select className="unit-toggle" value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                  <option value="kg">kg (Metric)</option>
                  <option value="lbs">lbs (US)</option>
                </select>
              </div>
              <input type="number" value={weightVal} onChange={e => setWeightVal(Number(e.target.value))} min="1" />
              {weightUnit === 'lbs' && <span className="unit-subtext">≈ {(weightVal / 2.20462).toFixed(1)} kg</span>}
            </div>
          </div>

          <div className="calc-result-box">
            <span className="result-label">Calculated BSA:</span>
            <span className="result-val">{bsa} m²</span>
          </div>
        </div>

        {/* 2. Cockcroft-Gault & Carboplatin Calvert AUC */}
        <div className="calc-card">
          <h4 className="calc-card-title">
            <Activity size={16} /> Creatinine Clearance &amp; Carboplatin Dose
          </h4>
          <p className="calc-card-desc">Cockcroft-Gault CrCl and Calvert AUC dosing equation.</p>

          <div className="calc-inputs">
            <div className="calc-field">
              <label>Age (years)</label>
              <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} min="18" max="100" />
            </div>

            {/* Serum Creatinine Field */}
            <div className="calc-field">
              <div className="field-label-row">
                <label>Serum Cr</label>
                <select className="unit-toggle" value={scrUnit} onChange={e => setScrUnit(e.target.value)}>
                  <option value="mg/dL">mg/dL (US)</option>
                  <option value="umol/L">μmol/L (SI Metric)</option>
                </select>
              </div>
              <input type="number" step="0.1" value={scrVal} onChange={e => setScrVal(Number(e.target.value))} min="0.1" />
              {scrUnit === 'umol/L' && <span className="unit-subtext">≈ {(scrVal / 88.4).toFixed(2)} mg/dL</span>}
            </div>

            <div className="calc-field">
              <label>Sex</label>
              <select value={isFemale ? 'female' : 'male'} onChange={e => setIsFemale(e.target.value === 'female')}>
                <option value="male">Male</option>
                <option value="female">Female (x0.85)</option>
              </select>
            </div>

            <div className="calc-field">
              <label>Target Carboplatin AUC</label>
              <select value={targetAuc} onChange={e => setTargetAuc(Number(e.target.value))}>
                <option value={4}>AUC 4</option>
                <option value={5}>AUC 5</option>
                <option value={6}>AUC 6</option>
              </select>
            </div>
          </div>

          <div className="calc-result-box flex-col">
            <div className="result-row">
              <span className="result-label">Est. CrCl:</span>
              <span className="result-val">{crClVal} mL/min</span>
            </div>
            <div className="result-row">
              <span className="result-label">Carboplatin Dose (Calvert):</span>
              <span className="result-val highlight">{carboplatinDose} mg</span>
            </div>
          </div>
        </div>

        {/* 3. Neutrophil-to-Lymphocyte Ratio (NLR) */}
        <div className="calc-card">
          <h4 className="calc-card-title">
            <Activity size={16} /> Neutrophil-to-Lymphocyte Ratio (NLR)
          </h4>
          <p className="calc-card-desc">Systemic inflammatory biomarker used in prognostic oncology scoring.</p>

          <div className="calc-inputs">
            <div className="calc-field span-2">
              <div className="field-label-row">
                <label>Cell Count Unit</label>
                <select className="unit-toggle" value={cellUnit} onChange={e => setCellUnit(e.target.value)}>
                  <option value="x10^9/L">x10⁹/L or G/L (SI Metric)</option>
                  <option value="/uL">/μL (cells/mcL - US)</option>
                </select>
              </div>
            </div>

            <div className="calc-field">
              <label>Neutrophils ({cellUnit})</label>
              <input type="number" step="0.1" value={ancVal} onChange={e => setAncVal(Number(e.target.value))} min="0.1" />
            </div>

            <div className="calc-field">
              <label>Lymphocytes ({cellUnit})</label>
              <input type="number" step="0.1" value={alcVal} onChange={e => setAlcVal(Number(e.target.value))} min="0.1" />
            </div>
          </div>

          <div className="calc-result-box">
            <div className="result-row">
              <span className="result-label">NLR Score:</span>
              <span className="result-val">{nlr}</span>
              <span className={`nlr-badge ${Number(nlr) >= 3.0 ? 'high' : 'normal'}`}>
                {Number(nlr) >= 3.0 ? 'High (≥ 3.0)' : 'Normal (< 3.0)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
