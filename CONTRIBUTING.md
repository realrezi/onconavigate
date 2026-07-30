# Contributing to OncoNavigate & TrialMatch 🧬

Thank you for your interest in contributing to **OncoNavigate & TrialMatch**! We welcome contributions from oncologists, medical researchers, software developers, and UX designers.

---

## 🔬 Guideline & Rule Engine Contributions

If you wish to update or add clinical treatment pathways:
1. Ensure all proposed rules are grounded in peer-reviewed Phase 3 RCT data, NCCN, or ESMO clinical practice guidelines.
2. Update `src/engine/pathwayRules.js` with pure JavaScript logic (no React dependencies).
3. Add comprehensive unit test coverage in `src/engine/pathwayRules.test.js` using Vitest.

---

## 💻 Development Workflow

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/onconavigate.git
   cd onconavigate
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server & Tests**:
   ```bash
   npm run dev
   npm run test
   ```

4. **Submit a Pull Request**:
   Ensure all tests pass (`npm run test`) and the production build completes (`npm run build`) before opening a PR.

---

## 🛡️ Medical Accuracy Review

All pull requests modifying clinical recommendations or biomarker parameters undergo review for scientific accuracy prior to merging into `main`.
