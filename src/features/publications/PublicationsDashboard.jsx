import React, { useState } from 'react';
import { publications, publicationCancerTypes } from './publications.data';
import { usePatientProfile } from '../../context/PatientProfileContext';
import { BookOpen, ExternalLink, Heart, UserCheck, TrendingUp, Compass } from 'lucide-react';
import './PublicationsDashboard.css';

export default function PublicationsDashboard({ onNavigateToPathway }) {
  const [selectedCancer, setSelectedCancer] = useState('all');
  const { dispatch } = usePatientProfile();

  const filteredPubs = publications.filter(pub => {
    if (selectedCancer === 'all') return true;
    return pub.cancerTypes.includes(selectedCancer);
  });

  function handleAutoFill(pub) {
    if (pub.autoFillProfile) {
      dispatch({ type: 'AUTO_FILL', payload: pub.autoFillProfile });
      if (onNavigateToPathway) onNavigateToPathway();
    }
  }

  return (
    <div className="pub-dashboard animate-fade-in-up">
      {/* Header */}
      <div className="pub-header">
        <div className="pub-header-info">
          <div className="pub-badge">
            <Heart size={14} className="heart-icon" /> Computational Oncology &amp; Research
          </div>
          <h2 className="pub-title">Research Publications &amp; Meta-Analyses</h2>
          <p className="pub-subtitle">
            Scientific studies authored by <strong>Dr. Ahmadreza Shirdel, MD</strong> — bridging clinical medicine, machine learning models, and quantitative systematic reviews.
          </p>
        </div>

        {/* Filters */}
        <div className="pub-filter-bar" role="tablist" aria-label="Filter publications by cancer type">
          {publicationCancerTypes.map(ct => (
            <button
              key={ct.id}
              id={`pub-filter-${ct.id}`}
              className={`pub-filter-chip ${selectedCancer === ct.id ? 'active' : ''}`}
              onClick={() => setSelectedCancer(ct.id)}
              role="tab"
              aria-selected={selectedCancer === ct.id}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="pub-grid">
        {filteredPubs.map((pub, idx) => (
          <div
            key={pub.id}
            className="pub-card animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="pub-card-top">
              <div className="pub-journal-tag">
                <BookOpen size={13} />
                <span>{pub.journal} ({pub.year})</span>
              </div>
              <div className="pub-role-tag">
                <UserCheck size={13} />
                <span>{pub.role}</span>
              </div>
            </div>

            <h3 className="pub-card-title">{pub.title}</h3>

            <div className="pub-design">
              <span>{pub.trialDesign}</span>
            </div>

            {/* Key Findings Box */}
            <div className="pub-findings">
              <div className="pub-findings-header">
                <TrendingUp size={14} /> Key Quantitative Findings
              </div>
              {pub.keyFindings.value !== null && (
                <div className="pub-stat-row">
                  <span className="pub-stat-label">{pub.keyFindings.metric}:</span>
                  <span className="pub-stat-val">{pub.keyFindings.value}</span>
                  {pub.keyFindings.ci && (
                    <span className="pub-stat-ci">(95% CI: {pub.keyFindings.ci})</span>
                  )}
                  {pub.keyFindings.pValue && (
                    <span className="pub-stat-p">p {pub.keyFindings.pValue}</span>
                  )}
                </div>
              )}
              <p className="pub-findings-desc">{pub.keyFindings.interpretation}</p>
            </div>

            <div className="pub-card-footer">
              <button
                className="pub-autofill-btn"
                onClick={() => handleAutoFill(pub)}
                title="Load patient criteria from this paper into the Pathway Navigator"
              >
                <Compass size={14} /> Test in Pathway Navigator
              </button>

              <a
                href={pub.doi}
                target="_blank"
                rel="noreferrer"
                className="pub-link"
              >
                DOI <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
