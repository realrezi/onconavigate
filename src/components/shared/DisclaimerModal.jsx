import React, { useState, useEffect } from 'react';
import { HeartHandshake, ShieldCheck } from 'lucide-react';
import './DisclaimerModal.css';

export default function DisclaimerModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem('disclaimer_accepted');
    if (!accepted) setVisible(true);
  }, []);

  function handleAccept() {
    sessionStorage.setItem('disclaimer_accepted', 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="disclaimer-overlay" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <div className="disclaimer-modal animate-scale-in">
        <div className="disclaimer-header">
          <div className="disclaimer-icon-wrap">
            <HeartHandshake size={32} className="disclaimer-icon" />
          </div>
          <h2 id="disclaimer-title" className="disclaimer-title">
            Clinical Guidance &amp; Compassionate Care
          </h2>
          <p className="disclaimer-subtitle">
            Welcome to <strong>OncoNavigate &amp; TrialMatch</strong> — designed to support clinicians and researchers with evidence-based oncology decision pathways and recruiting trial matching.
          </p>
        </div>

        <div className="disclaimer-body">
          <ul className="disclaimer-list">
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Decision Support Only:</strong> This application provides evidence-based clinical information for guidance. It does not replace professional medical judgment, diagnosis, or personalized treatment planning.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Independent Verification:</strong> All treatment pathways are synthesized from NCCN and ESMO clinical guidelines and must be independently verified by the treating clinical team.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>No Doctor-Patient Relationship:</strong> Using this software does not establish a physician-patient relationship and is intended for healthcare professional use.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Not for Emergency Use:</strong> If a patient is experiencing a medical emergency, please contact local emergency services immediately.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Data Sources:</strong> Trial data is retrieved directly from <a href="https://clinicaltrials.gov" target="_blank" rel="noreferrer">ClinicalTrials.gov</a>. Please review their <a href="https://clinicaltrials.gov/about-site/terms-conditions" target="_blank" rel="noreferrer">Terms &amp; Conditions</a>.
              </div>
            </li>
          </ul>

          <div className="disclaimer-fda-note">
            <strong>FDA CDS Compliance:</strong> Designed per FDA Non-Device CDS software guidance (FD&amp;C Act §520(o)(1)(E)). All clinical logic and guideline sources are transparent and independently reviewable.
          </div>
        </div>

        <button
          id="disclaimer-accept-btn"
          className="disclaimer-accept-btn"
          onClick={handleAccept}
          autoFocus
        >
          <ShieldCheck size={18} />
          I Acknowledge &amp; Enter Workspace
        </button>

        <p className="disclaimer-footer-text">
          This acknowledgment will remain active for your current browser session.
        </p>
      </div>
    </div>
  );
}
