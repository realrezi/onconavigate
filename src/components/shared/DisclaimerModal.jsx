import React, { useState, useEffect } from 'react';
import { HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
            <HeartHandshake size={22} className="disclaimer-icon" />
          </div>
          <h2 id="disclaimer-title" className="disclaimer-title">
            Clinical Guidance &amp; Compassionate Care
          </h2>
          <p className="disclaimer-subtitle">
            Welcome to <strong>OncoNavigate &amp; TrialMatch</strong> — evidence-based decision support pathways &amp; clinical trial matching for oncology teams.
          </p>
        </div>

        <div className="disclaimer-body">
          <ul className="disclaimer-list">
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Clinical Decision Support Only:</strong> Synthesizes guidelines to assist care teams. Does not replace clinical judgment or diagnosis.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Independent Verification:</strong> Pathways are curated from NCCN &amp; ESMO guidelines and require clinician verification.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Professional Use:</strong> Designed for licensed healthcare professionals; does not constitute a doctor-patient relationship.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Not for Emergency Use:</strong> For medical emergencies, please contact local emergency medical services immediately.
              </div>
            </li>
            <li className="disclaimer-item">
              <div className="disclaimer-item-content">
                <strong>Data Sources:</strong> Real-time trial matching sourced from <a href="https://clinicaltrials.gov" target="_blank" rel="noreferrer">ClinicalTrials.gov</a>. See <a href="https://clinicaltrials.gov/about-site/terms-conditions" target="_blank" rel="noreferrer">Terms &amp; Conditions</a>.
              </div>
            </li>
          </ul>

          <div className="disclaimer-fda-note">
            <CheckCircle2 size={15} className="fda-icon" />
            <div>
              <strong>FDA Non-Device CDS Compliance:</strong> Designed per FDA Clinical Decision Support Guidance (FD&amp;C Act §520(o)(1)(E)). All clinical recommendations and underlying rationale remain fully transparent.
            </div>
          </div>
        </div>

        <div className="disclaimer-footer">
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
    </div>
  );
}
