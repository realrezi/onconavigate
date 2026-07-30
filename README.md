# OncoNavigate & TrialMatch 🧬❤️

> **Evidence-Based Oncology Clinical Decision Support & Real-Time Trial Matcher**  
> Deployed Live at **[https://onconavigate.vercel.app](https://onconavigate.vercel.app)**

---

## 📖 Overview

**OncoNavigate & TrialMatch** is an open-source, mobile-responsive web application designed to support oncologists, healthcare professionals, patients, and medical researchers. 

It synthesizes complex clinical practice guidelines (**NCCN** and **ESMO**) into interactive decision pathways across 8 major cancer domains, queries **ClinicalTrials.gov API v2** in real-time for recruiting clinical studies, and provides a compassionate **Care & Clinical Hub** equipped with bedside calculators and plain-language patient care guides.

---

## 🌟 Key Features

### 1. Guided Clinical Pathway Navigator (8 Major Cancer Domains)
Interactive stepper wizard mapping patient stage, histology, and molecular biomarkers to evidence-backed regimens and landmark Phase 3 trial evidence:
* **Prostate Cancer**: mHSPC (*ARASENS* triplet therapy: ADT + Darolutamide + Docetaxel) & mCRPC (*Enzalutamide, Abiraterone, 177Lu-PSMA-617, Cabazitaxel, Olaparib* for BRCA1/2/ATM).
* **Esophageal Cancer**: ESCC (*CHECKMATE-648: Nivolumab + Chemo; KEYNOTE-590: Pembrolizumab*) vs. EAC (*KEYNOTE-811: Trastuzumab + Pembrolizumab* if HER2+).
* **Gastric / GEJ Cancer**: HER2+ (*KEYNOTE-811*), Claudin 18.2+ (*SPOTLIGHT / GLOW: Zolbetuximab + mFOLFOX6*), PD-L1 CPS ≥5 (*CHECKMATE-649*).
* **Colorectal Cancer**: MSI-H (*KEYNOTE-177*), BRAF V600E (*BEACON*), RAS WT (*PARADIGM* left-sided anti-EGFR vs right-sided anti-VEGF).
* **Non-Small Cell Lung Cancer (NSCLC)**: EGFR exon 19/L858R (*FLAURA & FLAURA2: Osimertinib*), ALK Rearranged (*CROWN: Lorlatinib / Alectinib*), KRAS G12C (*Sotorasib*), PD-L1 TPS ≥50% (*KEYNOTE-024*).
* **Breast Cancer**: HER2 Positive (*CLEOPATRA 1L THP; DESTINY-Breast03 2L T-DXd*), HR+/HER2- (*CDK4/6 Inhibitors + Endocrine Therapy; SOLAR-1 Alpelisib*), Triple-Negative TNBC (*KEYNOTE-355 & ASCENT*).
* **Pancreatic Cancer**: Metastatic PDAC (*NAPOLI-3: NALIRIFOX* or FOLFIRINOX) & BRCA1/2 Mutated (*POLO: Olaparib Maintenance*).
* **Bladder / Urothelial Carcinoma**: Metastatic 1L (*EV-302 / KEYNOTE-A39: Enfortumab Vedotin + Pembrolizumab*) & FGFR2/3 (*Erdafitinib*).

### 2. Real-Time ClinicalTrials.gov API Integration
* Direct REST API v2 client with 5-minute in-memory caching, 500ms request debouncing, and rate-limit auto-retries.
* Real-time Phase (`PHASE1`, `PHASE2`, `PHASE3`) and geographic country filtering.

### 3. Care & Clinical Hub
* **Patient & Family Care Companion**: Plain-language treatment explanations (Chemotherapy, Immunotherapy, Targeted, Radioligand), symptom management guides (Nausea, Fatigue, Neuropathy, irAEs), and an interactive **Doctor Consultation Question Checklist Builder**.
* **Bedside Clinical Calculators**:
  * **BSA (Mosteller)**: $\text{BSA} = \sqrt{\frac{\text{height (cm)} \times \text{weight (kg)}}{3600}}$
  * **Cockcroft-Gault CrCl & Carboplatin Calvert AUC**: $\text{Carboplatin Dose (mg)} = \text{Target AUC} \times (\text{CrCl} + 25)$
  * **Neutrophil-to-Lymphocyte Ratio (NLR)**: Systemic inflammatory risk scoring.

### 4. Heartwarming & Reassuring Aesthetic
* Designed with a warm cream/espresso palette (#fdfbf7 background, #d96b52 warm coral, #2a9d8f healing sage) to create a comforting, human-centered experience.
* Fully responsive layout (sticky 2-panel view on desktop, single-column wizard on mobile devices).

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8
* **State Management**: React Context (`useReducer` finite state machine for wizard)
* **Async Server State**: TanStack Query (React Query v5)
* **Icons & UI**: Lucide React
* **Styling**: Vanilla CSS Custom Properties (Design Tokens & Keyframe Animations)
* **Testing**: Vitest (100% test coverage on clinical rule engine)
* **Deployment**: Vercel Global CDN

---

## 📁 Repository Structure

```
build-an-app/
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer
│   │   ├── shared/         # DisclaimerModal (FDA CDS Compliant)
│   │   └── ui/             # SkeletonCard, ErrorState
│   ├── context/            # PatientProfileContext (useReducer FSM)
│   ├── engine/             # pathwayRules.js (Pure JS rule engine + Vitest tests)
│   ├── features/
│   │   ├── carehub/        # CareHub.jsx (Patient Companion & Bedside Calculators)
│   │   ├── pathway/        # PathwayNavigator.jsx (4-Step Wizard)
│   │   ├── regimen/        # RegimenRecommender.jsx (Evidence & Guidelines)
│   │   └── trials/         # TrialMatcher.jsx (ClinicalTrials.gov v2 Client)
│   ├── services/           # clinicalTrialsApi.js (API client + caching)
│   ├── styles/             # reset.css, tokens.css, animations.css
│   ├── App.jsx
│   └── main.jsx
├── .licenses/              # Data use acknowledgment log
├── index.html
├── vite.config.js
└── package.json
```

---

## 💻 Getting Started Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/realrezi/onconavigate.git
   cd onconavigate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Unit Tests**:
   ```bash
   npm run test
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🛡️ Medical & Regulatory Disclaimer

This software is a **Non-Device Clinical Decision Support (CDS)** tool intended exclusively for educational, research, and decision-support use by licensed healthcare professionals. It complies with Section 520(o)(1)(E) of the FD&C Act. All recommendations are derived from published clinical trial data and guidelines and must be independently verified by the treating clinician. This software is not intended for use in medical emergencies.

---

## 👤 Author

**Dr. Ahmadreza Shirdel, MD**  
Medical Doctor & Computational Researcher  
* GitHub: [@realrezi](https://github.com/realrezi)
* LinkedIn: [ahmadreza-shirdel-md](https://linkedin.com/in/ahmadreza-shirdel-md-99bbaa193)
* Google Scholar: [Ahmadreza Shirdel](https://scholar.google.com/citations?user=yyL8hhIAAAAJ)
