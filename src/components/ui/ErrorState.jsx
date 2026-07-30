import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state animate-fade-in" role="alert">
      <AlertTriangle size={32} className="error-icon" />
      <h3 className="error-title">Unable to Load Data</h3>
      <p className="error-message">
        {message || 'ClinicalTrials.gov is temporarily unavailable. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
