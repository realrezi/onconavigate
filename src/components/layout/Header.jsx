import React from 'react';
import { Heart, Activity, Globe, GraduationCap, Code } from 'lucide-react';
import './Header.css';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="header-logo">
            <Heart size={20} className="header-logo-icon" />
          </div>
          <div>
            <span className="header-name">OncoNavigate</span>
            <span className="header-tagline">
              <Activity size={10} />
              &amp; TrialMatch
            </span>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          {[
            { id: 'navigator', label: 'Pathway Navigator' },
            { id: 'carehub', label: 'Care & Clinical Hub' },
          ].map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`header-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Author Credential Badge (Visible on First Load) */}
        <div className="header-author-badge" title="Platform Author & Medical Researcher">
          <span className="header-author-dot" />
          <span className="header-author-name">Dr. Ahmadreza Shirdel, MD</span>
          <div className="header-author-links">
            <a href="https://linkedin.com/in/ahmadreza-shirdel-md-99bbaa193" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
              <Globe size={13} />
            </a>
            <a href="https://scholar.google.com/citations?user=yyL8hhIAAAAJ" target="_blank" rel="noreferrer" aria-label="Google Scholar Profile">
              <GraduationCap size={13} />
            </a>
            <a href="https://github.com/realrezi" target="_blank" rel="noreferrer" aria-label="GitHub Profile">
              <Code size={13} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
