import React from 'react';
import { Heart, Code, Globe, GraduationCap } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-disclaimer-bar">
          <Heart size={15} className="footer-disclaimer-icon" />
          <span>
            <strong>Clinical Decision Support Disclaimer:</strong> Designed for licensed healthcare professionals to support evidence-based treatment decisions. All clinical recommendations require independent clinical judgment and validation. Not for direct patient emergency use.
          </span>
        </div>

        <div className="footer-bottom">
          <div className="footer-brand">
            <span>OncoNavigate &amp; TrialMatch</span>
            <span className="footer-copy">© 2026 Dr. Ahmadreza Shirdel, MD</span>
          </div>

          <div className="footer-socials">
            <a href="https://github.com/realrezi" target="_blank" rel="noreferrer" className="footer-icon-link" aria-label="GitHub">
              <Code size={14} /> GitHub
            </a>
            <a href="https://linkedin.com/in/ahmadreza-shirdel-md-99bbaa193" target="_blank" rel="noreferrer" className="footer-icon-link" aria-label="LinkedIn">
              <Globe size={14} /> LinkedIn
            </a>
            <a href="https://scholar.google.com/citations?user=yyL8hhIAAAAJ" target="_blank" rel="noreferrer" className="footer-icon-link" aria-label="Google Scholar">
              <GraduationCap size={14} /> Google Scholar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
