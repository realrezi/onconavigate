import React from 'react';
import { Heart, Activity } from 'lucide-react';
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

        {/* Badge */}
        <div className="header-badge">
          <span className="header-badge-dot" />
          Empowering Clinical Decisions
        </div>
      </div>
    </header>
  );
}
