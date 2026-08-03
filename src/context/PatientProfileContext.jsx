/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer } from 'react';

// ── Initial State ──────────────────────────────────────────────
const initialProfile = {
  cancerType: null,
  stage: null,
  biomarkers: {},
  priorTherapies: [],
};

// ── Reducer ────────────────────────────────────────────────────
function profileReducer(state, action) {
  switch (action.type) {
    case 'SET_CANCER_TYPE':
      // Resetting downstream when cancer type changes
      return { ...initialProfile, cancerType: action.payload };
    case 'SET_STAGE':
      return { ...state, stage: action.payload };
    case 'SET_BIOMARKER':
      return { ...state, biomarkers: { ...state.biomarkers, [action.key]: action.payload } };
    case 'TOGGLE_PRIOR_THERAPY': {
      const has = state.priorTherapies.includes(action.payload);
      return {
        ...state,
        priorTherapies: has
          ? state.priorTherapies.filter(t => t !== action.payload)
          : [...state.priorTherapies, action.payload],
      };
    }
    case 'AUTO_FILL':
      // Used when a publication card auto-fills the navigator
      return { ...initialProfile, ...action.payload };
    case 'RESET':
      return { ...initialProfile };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────
const PatientProfileContext = createContext(null);

export function PatientProfileProvider({ children }) {
  const [profile, dispatch] = useReducer(profileReducer, initialProfile);

  return (
    <PatientProfileContext.Provider value={{ profile, dispatch }}>
      {children}
    </PatientProfileContext.Provider>
  );
}

export function usePatientProfile() {
  const ctx = useContext(PatientProfileContext);
  if (!ctx) throw new Error('usePatientProfile must be used within PatientProfileProvider');
  return ctx;
}
