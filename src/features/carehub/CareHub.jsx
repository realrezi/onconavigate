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
            Empowering patients and families with clear, supportive treatment guidance while providing clinicians with instant bedside calculators.
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

        {/* Category selector */}
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

        {/* Active guide card */}
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

          {/* Interactive Question Builder */}
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
// Bedside Clinical Calculators
// ──────────────────────────────────────────────────────────────
function ClinicalCalculatorsSection() {
  // BSA State
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(70);  // kg

  // Cockcroft-Gault & Calvert AUC State
  const [age, setAge] = useState(60);
  const [scr, setScr] = useState(1.0); // mg/dL
  const [isFemale, setIsFemale] = useState(false);
  const [targetAuc, setTargetAuc] = useState(5); // AUC 5

  // Inflammatory NLR State
  const [anc, setAnc] = useState(4.2); // x10^9/L
  const [alc, setAlc] = useState(1.4); // x10^9/L

  // Mosteller BSA: sqrt((height * weight) / 3600)
  const bsa = Math.sqrt((height * weight) / 3600).toFixed(2);

  // Cockcroft-Gault CrCl = ((140 - age) * weight) / (72 * scr) * (isFemale ? 0.85 : 1.0)
  const rawCrCl = ((140 - age) * weight) / (72 * (scr || 1));
  const crCl = (rawCrCl * (isFemale ? 0.85 : 1.0)).toFixed(1);

  // Calvert Formula: Dose (mg) = Target AUC * (CrCl + 25)
  // Max CrCl for Calvert is capped at 125 mL/min per FDA guidance
  const cappedCrCl = Math.min(Number(crCl), 125);
  const carboplatinDose = Math.round(targetAuc * (cappedCrCl + 25));

  // NLR = ANC / ALC
  const nlr = (anc / (alc || 1)).toFixed(2);

  return (
    <div className="calculators-wrap animate-fade-in">
      <div className="calc-intro">
        <Sparkles size={16} className="calc-icon" />
        <p>Instant bedside clinical formulas for chemotherapy dosing, renal clearance, and systemic inflammatory risk scoring.</p>
      </div>

      <div className="calc-grid">
        {/* 1. Body Surface Area (BSA) */}
        <div className="calc-card">
          <h4 className="calc-card-title">
            <Calculator size={16} /> Body Surface Area (Mosteller)
          </h4>
          <p className="calc-card-desc">Standard formula for calculating chemotherapy dosage per m².</p>

          <div className="calc-inputs">
            <div className="calc-field">
              <label>Height (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min="50" max="230" />
            </div>
            <div className="calc-field">
              <label>Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} min="30" max="200" />
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
            <div className="calc-field">
              <label>Serum Cr (mg/dL)</label>
              <input type="number" step="0.1" value={scr} onChange={e => setScr(Number(e.target.value))} min="0.3" max="10" />
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
              <span className="result-val">{crCl} mL/min</span>
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
            <div className="calc-field">
              <label>Absolute Neutrophils (ANC, x10⁹/L)</label>
              <input type="number" step="0.1" value={anc} onChange={e => setAnc(Number(e.target.value))} min="0.1" />
            </div>
            <div className="calc-field">
              <label>Absolute Lymphocytes (ALC, x10⁹/L)</label>
              <input type="number" step="0.1" value={alc} onChange={e => setAlc(Number(e.target.value))} min="0.1" />
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
