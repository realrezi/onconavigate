import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientProfileProvider, usePatientProfile } from './context/PatientProfileContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DisclaimerModal from './components/shared/DisclaimerModal';
import PathwayNavigator from './features/pathway/PathwayNavigator';
import RegimenRecommender from './features/regimen/RegimenRecommender';
import TrialMatcher from './features/trials/TrialMatcher';
import CareHub from './features/carehub/CareHub';
import { Sparkles, ChevronRight, Sliders } from 'lucide-react';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  const [activeTab, setActiveTab] = useState('navigator');

  return (
    <QueryClientProvider client={queryClient}>
      <PatientProfileProvider>
        <div className="app-shell">
          <DisclaimerModal />
          <Header activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="app-main" role="main">
            {activeTab === 'navigator' && <NavigatorMainView />}
            {activeTab === 'carehub' && (
              <div className="app-content-full animate-fade-in">
                <CareHub />
              </div>
            )}
          </main>

          <Footer />
        </div>
      </PatientProfileProvider>
    </QueryClientProvider>
  );
}

// ──────────────────────────────────────────────────────────────
// Navigator View with Mobile Native Tab Switcher & Sticky Action Bar
// ──────────────────────────────────────────────────────────────
function NavigatorMainView() {
  const { profile } = usePatientProfile();
  const [mobileTab, setMobileTab] = useState('wizard'); // 'wizard' | 'results'
  const isProfileComplete = Boolean(profile.cancerType && profile.stage);

  return (
    <div className="navigator-view-container animate-fade-in">
      {/* Mobile-Only Segmented View Switcher */}
      <div className="mobile-view-switcher" role="tablist" aria-label="Mobile view switcher">
        <button
          className={`mobile-switch-btn ${mobileTab === 'wizard' ? 'active' : ''}`}
          onClick={() => setMobileTab('wizard')}
          role="tab"
          aria-selected={mobileTab === 'wizard'}
        >
          <Sliders size={14} /> 1. Patient Profile
        </button>

        <button
          className={`mobile-switch-btn ${mobileTab === 'results' ? 'active' : ''}`}
          onClick={() => setMobileTab('results')}
          role="tab"
          aria-selected={mobileTab === 'results'}
        >
          <Sparkles size={14} /> 2. Pathways &amp; Trials
          {isProfileComplete && <span className="mobile-tab-dot" />}
        </button>
      </div>

      {/* Responsive Grid / Mobile Active View */}
      <div className="app-content-grid">
        {/* Panel 1: Stepper Wizard */}
        <div className={`app-panel app-panel-left ${mobileTab === 'wizard' ? 'mobile-show' : 'mobile-hide'}`}>
          <PathwayNavigator />
          
          {isProfileComplete && (
            <div className="mobile-wizard-done-hint">
              <p>✅ Profile set for {profile.cancerType.toUpperCase()} ({profile.stage})</p>
              <button className="mobile-go-results-btn" onClick={() => setMobileTab('results')}>
                View Recommendations &amp; Trials <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Panel 2: Regimen Recommendations + Clinical Trials */}
        <div className={`app-panel app-panel-right ${mobileTab === 'results' ? 'mobile-show' : 'mobile-hide'}`}>
          {/* Mobile Back-to-Wizard button */}
          <div className="mobile-back-to-wizard">
            <button className="mobile-back-btn" onClick={() => setMobileTab('wizard')}>
              ← Edit Patient Profile ({profile.cancerType ? profile.cancerType.toUpperCase() : 'Not Set'})
            </button>
          </div>

          <RegimenRecommender />
          <TrialMatcher />
        </div>
      </div>
    </div>
  );
}
