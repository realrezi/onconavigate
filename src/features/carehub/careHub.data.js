/**
 * Care & Clinical Hub Data
 * Plain-language treatment guides, side-effect management protocols,
 * questions for doctor checklist, and clinical calculator formulas.
 */

export const treatmentGuides = [
  {
    id: 'guide-chemo',
    category: 'Chemotherapy',
    title: 'Understanding Systemic Chemotherapy',
    summary: 'How cytotoxic medications work to target rapidly dividing cancer cells throughout the body.',
    howItWorks: 'Chemotherapy medications (such as 5-FU, Oxaliplatin, Irinotecan, and Docetaxel) disrupt cancer cell replication. They are typically administered in cycles (e.g. every 2 or 3 weeks) to allow healthy cells time to recover between doses.',
    whatToExpect: 'Treatment is usually given via IV infusion in an outpatient clinic. Your oncology team will provide premedications (such as anti-nausea medications) before each infusion to keep you comfortable.',
    keyQuestions: [
      'What is the goal of this chemotherapy regimen (curative or palliative/control)?',
      'How many cycles are planned, and how often will I receive infusions?',
      'What premedications will I receive to prevent nausea or allergic reactions?',
      'Which side effects should prompt me to call the clinic right away?'
    ]
  },
  {
    id: 'guide-immuno',
    category: 'Immunotherapy',
    title: 'Understanding Immune Checkpoint Inhibitors',
    summary: 'Empowering your body’s own immune system to recognize and attack cancer cells.',
    howItWorks: 'Cancer cells sometimes use specific proteins (like PD-1 or PD-L1) to shield themselves from immune detection. Immunotherapy drugs (like Pembrolizumab and Nivolumab) unmask the cancer cells so your immune system can recognize and destroy them.',
    whatToExpect: 'Immunotherapy is given via IV infusion, typically every 2 to 6 weeks. It is generally well-tolerated, but because it activates the immune system, it can occasionally cause inflammation in healthy organs (immune-related side effects).',
    keyQuestions: [
      'Has my tumor been tested for biomarkers like PD-L1 CPS or MSI-H/dMMR?',
      'What symptoms of immune inflammation (such as skin rash, diarrhea, or cough) should I watch for?',
      'How long will I continue immunotherapy if my scans remain stable?',
      'Can I take over-the-counter medications while on immunotherapy?'
    ]
  },
  {
    id: 'guide-targeted',
    category: 'Targeted Therapy',
    title: 'Understanding Precision Targeted Therapies',
    summary: 'Medications engineered to strike specific molecular mutations driving cancer growth.',
    howItWorks: 'Targeted therapies focus on specific genetic alterations (such as HER2, BRAF V600E, EGFR, or Claudin 18.2). By blocking these specific signals, they inhibit tumor growth while sparing non-mutated healthy tissue.',
    whatToExpect: 'Depending on the medication, targeted agents may be oral daily pills (like Encorafenib or Enzalutamide) or IV antibody infusions (like Trastuzumab, Cetuximab, or Zolbetuximab). Regular blood tests or scans monitor treatment response.',
    keyQuestions: [
      'Which specific genetic mutation or marker does this targeted drug address?',
      'Should I take this medication with food or on an empty stomach?',
      'What side effects (such as skin changes or fatigue) are expected, and how can we manage them?',
      'How will we evaluate if the targeted therapy is working?'
    ]
  },
  {
    id: 'guide-radioligand',
    category: 'Radioligand & Hormone Therapy',
    title: 'Understanding Advanced Hormone & Radioligand Care',
    summary: 'Targeted hormonal blockades and radiopharmaceutical therapies for hormone-sensitive cancers.',
    howItWorks: 'Hormone therapies (like ADT, Abiraterone, Apalutamide, Enzalutamide) deprive prostate cancer cells of testosterone signals. Radioligand therapy (like Lutetium-177 PSMA-617) delivers targeted radiation directly to PSMA-expressing tumor cells.',
    whatToExpect: 'Hormone therapies are given via periodic subcutaneous injections or daily oral tablets. Radioligand infusions are performed in specialized nuclear medicine facilities.',
    keyQuestions: [
      'How will we monitor hormone levels (such as PSA or serum testosterone)?',
      'What lifestyle changes or supplements can help maintain bone health during hormone therapy?',
      'Is PSMA PET scan testing indicated for radioligand therapy evaluation?',
      'What precautions should I take following radiopharmaceutical treatment?'
    ]
  }
];

export const sideEffectGuides = [
  {
    id: 'se-nausea',
    symptom: 'Nausea & Appetite Changes',
    frequency: 'Common with Chemotherapy',
    managementTips: [
      'Eat small, frequent meals (5–6 light meals daily) rather than 3 large meals.',
      'Sip clear fluids, ginger tea, or electrolyte drinks throughout the day to stay hydrated.',
      'Take anti-nausea medications exactly as prescribed by your oncologist, even on days you feel well.',
      'Avoid greasy, fried, or strongly spiced foods if smells trigger nausea.'
    ],
    whenToCall: 'Call the clinic if you are unable to keep fluids down for more than 24 hours or experience persistent vomiting.'
  },
  {
    id: 'se-fatigue',
    symptom: 'Cancer-Related Fatigue',
    frequency: 'Common across All Therapies',
    managementTips: [
      'Balance activity with short, scheduled rest periods (20–30 minute naps).',
      'Engage in light, regular physical activity like daily 15-minute walks as tolerated.',
      'Prioritize essential tasks and accept support from family and friends.',
      'Maintain a consistent sleep schedule and stay well-hydrated.'
    ],
    whenToCall: 'Inform your team if fatigue is sudden, severe, or accompanied by dizziness or shortness of breath.'
  },
  {
    id: 'se-neuropathy',
    symptom: 'Peripheral Neuropathy (Tingling in Hands/Feet)',
    frequency: 'Associated with Oxaliplatin & Taxanes',
    managementTips: [
      'Avoid exposure to cold temperatures or cold drinks during and immediately after oxaliplatin infusions.',
      'Wear warm gloves and warm socks in cooler weather.',
      'Use caution with hot water (check bath temperature with your elbow) to prevent thermal injuries.',
      'Keep walkways clear and wear comfortable, supportive shoes to prevent trips.'
    ],
    whenToCall: 'Notify your oncologist if tingling interferes with buttoning clothes, typing, or walking balance.'
  },
  {
    id: 'se-irae',
    symptom: 'Immune-Related Side Effects (Rash, Diarrhea, Cough)',
    frequency: 'Associated with Immunotherapy (PD-1 / PD-L1)',
    managementTips: [
      'Report any new skin rash, frequent loose stools, or unexplained persistent cough early.',
      'Do not take anti-diarrheal medications without first consulting your oncology care team.',
      'Keep skin hydrated with mild, fragrance-free moisturizing lotions.',
      'Immune side effects respond very well when identified early and managed promptly.'
    ],
    whenToCall: 'Contact your oncology team immediately if you experience more than 3–4 loose bowel movements in a day, severe abdominal pain, or shortness of breath.'
  }
];
