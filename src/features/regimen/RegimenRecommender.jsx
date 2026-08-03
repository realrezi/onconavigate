import React, { useMemo } from 'react';
import { usePatientProfile } from '../../context/PatientProfileContext';
import { getRecommendations } from '../../engine/pathwayRules';
import { Compass, BookOpen, ExternalLink, AlertCircle, HeartHandshake } from 'lucide-react';
import './RegimenRecommender.css';

const LINE_LABEL = { first: 'First-Line Therapy', second: 'Second-Line / Subsequent', any: 'Biomarker Directed' };
const LINE_COLOR = { first: 'var(--color-sage)', second: 'var(--color-accent)', any: 'var(--color-prostate)' };

export default function RegimenRecommender() {
  const { profile } = usePatientProfile();

  const result = useMemo(() => {
    if (!profile.cancerType || !profile.stage) return null;
    return getRecommendations(profile);
  }, [profile]);

  if (!result) {
    return (
      <div className="regimen-empty animate-fade-in">
        <Compass size={40} className="regimen-empty-icon" />
        <h3>Awaiting Clinical Profile</h3>
        <p>Complete the patient profile steps on the left to generate tailored decision pathways and trial options.</p>
      </div>
    );
  }

  return (
    <div className="regimen-wrap animate-fade-in-up">
      {/* Warm Header */}
      <div className="regimen-header">
        <div className="regimen-pathway-badge">
          <HeartHandshake size={14} /> Evidence-Based Treatment Pathways
        </div>
        <h3 className="regimen-pathway-title">{result.pathwayDescription}</h3>
        <p className="regimen-pathway-note">
          Carefully synthesized from current NCCN and ESMO practice guidelines to empower informed clinical decision-making.
        </p>
      </div>

      {/* Clinical Warnings / Guidance */}
      {result.warnings.length > 0 && (
        <div className="regimen-warnings">
          {result.warnings.map((w, i) => (
            <div key={i} className="regimen-warning animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <AlertCircle size={15} className="warning-icon" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Regimens */}
      {result.regimens.length === 0 ? (
        <div className="regimen-no-match">
          <p>No automatic matching pathway found for this specific clinical configuration. Please consult the full guideline documentation.</p>
          <a href="https://www.nccn.org/guidelines/category_1" target="_blank" rel="noreferrer" className="regimen-guideline-link">
            <ExternalLink size={14} /> Open NCCN Guidelines Index
          </a>
        </div>
      ) : (
        <div className="regimen-list">
          {result.regimens.map((r, i) => (
            <div
              key={i}
              className="regimen-card animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, '--line-color': LINE_COLOR[r.line] }}
            >
              <div className="regimen-card-top">
                <div className="regimen-info">
                  <div className="regimen-line-badge" style={{ background: `color-mix(in srgb, ${LINE_COLOR[r.line]} 12%, transparent)`, borderColor: `color-mix(in srgb, ${LINE_COLOR[r.line]} 30%, transparent)`, color: LINE_COLOR[r.line] }}>
                    {LINE_LABEL[r.line]}
                  </div>
                  <h4 className="regimen-name">{r.name}</h4>
                  <span className="regimen-class">{r.class}</span>
                </div>
              </div>

              <p className="regimen-rationale">{r.rationale}</p>

              <div className="regimen-footer-row">
                <div className="regimen-evidence">
                  <BookOpen size={13} />
                  <span>{r.evidence}</span>
                  <span className="regimen-evidence-level">{r.evidenceLevel}</span>
                </div>

                <a
                  href={r.guidelineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="regimen-guideline-link"
                >
                  <ExternalLink size={12} />
                  Guidelines
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
