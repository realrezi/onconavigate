import React from 'react';
import './SkeletonCard.css';

export function SkeletonTrialCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-line skeleton w-24 h-4 mb-2" />
      <div className="skeleton-line skeleton w-full h-5 mb-1" />
      <div className="skeleton-line skeleton w-3/4 h-5 mb-4" />
      <div className="skeleton-tags">
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
      </div>
      <div className="skeleton-line skeleton w-full h-3 mt-4" />
      <div className="skeleton-line skeleton w-5/6 h-3 mt-2" />
    </div>
  );
}

export function SkeletonRegimenCard() {
  return (
    <div className="skeleton-card skeleton-regimen" aria-hidden="true">
      <div className="skeleton skeleton-regimen-icon" />
      <div className="skeleton-regimen-content">
        <div className="skeleton-line skeleton w-2/3 h-5 mb-2" />
        <div className="skeleton-line skeleton w-full h-3 mb-1" />
        <div className="skeleton-line skeleton w-4/5 h-3" />
      </div>
    </div>
  );
}
