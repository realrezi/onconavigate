import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientProfileProvider } from './context/PatientProfileContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DisclaimerModal from './components/shared/DisclaimerModal';
import PathwayNavigator from './features/pathway/PathwayNavigator';
import RegimenRecommender from './features/regimen/RegimenRecommender';
import TrialMatcher from './features/trials/TrialMatcher';
import CareHub from './features/carehub/CareHub';
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
            {activeTab === 'navigator' && (
              <div className="app-content-grid animate-fade-in">
                {/* Left Panel: Stepper Wizard */}
                <div className="app-panel app-panel-left">
                  <PathwayNavigator />
                </div>

                {/* Right Panel: Regimens + Trials */}
                <div className="app-panel app-panel-right">
                  <RegimenRecommender />
                  <TrialMatcher />
                </div>
              </div>
            )}

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
