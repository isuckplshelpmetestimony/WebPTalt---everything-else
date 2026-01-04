export interface Prompt {
  id: string;
  question: string;
  field?: string; // Maps to data field
  followUp?: string[]; // Optional follow-up questions
}

export interface SectionPrompts {
  sectionId: string;
  sectionTitle: string;
  prompts: Prompt[];
}

export const subjectivePrompts: SectionPrompts[] = [
  {
    sectionId: 'current-condition',
    sectionTitle: 'Current Condition',
    prompts: [
      {
        id: 'chief-complaint',
        question: "What brings you in today? Can you describe your current condition?",
        field: 'chiefComplaint',
      },
      {
        id: 'onset-date',
        question: "When did the symptoms start? Can you give me a specific date or approximate timeframe?",
        field: 'onsetDate',
      },
      {
        id: 'type-of-injury',
        question: "Was this an acute injury, chronic condition, or post-surgical?",
        field: 'typeOfInjury',
        followUp: [
          "If acute: When exactly did the injury occur?",
          "If chronic: How long have you been dealing with this?",
          "If post-surgical: When was the surgery?",
        ],
      },
      {
        id: 'specific-injury',
        question: "What specific type of injury occurred? Was it a strain, sprain, fracture, or dislocation?",
        field: 'specificInjury',
      },
      {
        id: 'surgery',
        question: "Have you had any surgeries related to this condition? If so, when and what type?",
        field: 'surgeryDate',
        followUp: [
          "What was the date of the surgery?",
          "What type of surgery was performed?",
        ],
      },
      {
        id: 'occupation',
        question: "What is your occupation?",
        field: 'occupation',
      },
      {
        id: 'treatments',
        question: "What treatments have you tried for this condition? Have you seen other healthcare providers?",
        field: 'treatmentsRelated',
      },
    ],
  },
  {
    sectionId: 'depression',
    sectionTitle: 'Depression Screening',
    prompts: [
      {
        id: 'bipolar',
        question: "Do you have a pre-existing diagnosis for bipolar disorder?",
        field: 'hasBipolarDisorder',
      },
      {
        id: 'screening-performed',
        question: "I'd like to screen you for depression. Is that okay?",
        field: 'screeningPerformed',
      },
      {
        id: 'screening-results',
        question: "Based on the screening, what were the results? Was it positive or negative?",
        field: 'screeningResults',
      },
      {
        id: 'screening-tool',
        question: "What screening tool did we use? Or if the patient was ineligible, what was the reason?",
        field: 'screeningToolDescription',
      },
      {
        id: 'follow-up',
        question: "What's our follow-up plan? Do we need to do a suicide risk assessment, make a referral, or consider pharmacological interventions?",
        field: 'followUpPlan',
      },
    ],
  },
  {
    sectionId: 'social-drivers',
    sectionTitle: 'Social Drivers of Health',
    prompts: [
      {
        id: 'age-check',
        question: "Are you 18 years of age or greater?",
        field: 'is18OrGreater',
      },
      {
        id: 'screening-performed',
        question: "I'd like to screen you for food insecurity, housing instability, transportation needs, utility difficulties, and interpersonal safety. Is that okay?",
        field: 'screeningPerformed',
      },
      {
        id: 'screening-tool',
        question: "What screening tool did we use?",
        field: 'screeningToolUsed',
      },
      {
        id: 'results',
        question: "What were the screening results? Positive or negative?",
        field: 'results',
      },
      {
        id: 'comments',
        question: "Any additional comments about the social drivers screening?",
        field: 'comments',
      },
    ],
  },
  {
    sectionId: 'elder-maltreatment',
    sectionTitle: 'Elder Maltreatment',
    prompts: [
      {
        id: 'screening-performed',
        question: "I'd like to screen you for elder maltreatment. Is that okay?",
        field: 'screeningPerformed',
      },
      {
        id: 'screening-tool',
        question: "What screening tool did we use?",
        field: 'screeningToolUsed',
      },
      {
        id: 'results',
        question: "What were the screening results?",
        field: 'results',
      },
      {
        id: 'comments',
        question: "Any additional comments or concerns?",
        field: 'comments',
      },
    ],
  },
  {
    sectionId: 'falls',
    sectionTitle: 'Falls',
    prompts: [
      {
        id: 'falls-history',
        question: "Have you had any falls in the past year?",
        field: 'hasFallsHistory',
      },
      {
        id: 'fall-details',
        question: "Can you tell me about the fall? When did it happen? What were the circumstances?",
        field: 'fallDetails',
      },
    ],
  },
  {
    sectionId: 'bmi',
    sectionTitle: 'BMI',
    prompts: [
      {
        id: 'height',
        question: "What is your height?",
        field: 'height',
      },
      {
        id: 'weight',
        question: "What is your current weight?",
        field: 'weight',
      },
      {
        id: 'bmi',
        question: "Based on your height and weight, your BMI is [calculated value]. Does that sound right?",
        field: 'bmi',
      },
    ],
  },
  {
    sectionId: 'urinary-incontinence',
    sectionTitle: 'Urinary Incontinence',
    prompts: [
      {
        id: 'screening-performed',
        question: "I'd like to screen you for urinary incontinence. Is that okay?",
        field: 'screeningPerformed',
      },
      {
        id: 'screening-tool',
        question: "What screening tool did we use?",
        field: 'screeningToolUsed',
      },
      {
        id: 'results',
        question: "What were the screening results?",
        field: 'results',
      },
      {
        id: 'comments',
        question: "Any additional comments?",
        field: 'comments',
      },
    ],
  },
  {
    sectionId: 'dementia',
    sectionTitle: 'Dementia Assessment & Support',
    prompts: [
      {
        id: 'assessment-performed',
        question: "I'd like to perform a dementia assessment. Is that okay?",
        field: 'assessmentPerformed',
      },
      {
        id: 'assessment-tool',
        question: "What assessment tool did we use?",
        field: 'assessmentTool',
      },
      {
        id: 'assessment-results',
        question: "What were the assessment results?",
        field: 'assessmentResults',
      },
    ],
  },
  {
    sectionId: 'diabetes',
    sectionTitle: 'Diabetes',
    prompts: [
      {
        id: 'has-diabetes',
        question: "Do you have diabetes?",
        field: 'hasDiabetes',
      },
      {
        id: 'diabetes-type',
        question: "If yes, what type of diabetes? Type 1 or Type 2?",
        field: 'diabetesType',
      },
      {
        id: 'medications',
        question: "What medications are you taking for diabetes?",
        field: 'medications',
      },
      {
        id: 'complications',
        question: "Have you experienced any complications related to diabetes?",
        field: 'complications',
      },
    ],
  },
  {
    sectionId: 'pain-history',
    sectionTitle: 'Pain History',
    prompts: [
      {
        id: 'pain-location',
        question: "Where is the pain located?",
        field: 'area',
      },
      {
        id: 'current-pain',
        question: "On a scale of 1-10, what's your current pain level?",
        field: 'current',
      },
      {
        id: 'best-pain',
        question: "What's the best your pain has been?",
        field: 'best',
      },
      {
        id: 'worst-pain',
        question: "What's the worst your pain has been?",
        field: 'worst',
      },
      {
        id: 'activity-time',
        question: "What activities or times make the pain worse?",
        field: 'activityTime',
      },
      {
        id: 'pain-description',
        question: "How would you describe the pain? Is it aching, dull, sharp, burning, stabbing, or something else?",
        field: 'description',
      },
      {
        id: 'pain-comments',
        question: "Any additional comments about your pain?",
        field: 'comments',
      },
    ],
  },
  {
    sectionId: 'functional-status',
    sectionTitle: 'Functional Status',
    prompts: [
      {
        id: 'functional-activities',
        question: "What activities are you having difficulty with? Can you describe your functional limitations?",
        field: 'activities',
      },
      {
        id: 'functional-restrictions',
        question: "Are there any specific restrictions on your activities?",
        field: 'restrictions',
      },
      {
        id: 'last-date-worked',
        question: "When was the last date you worked?",
        field: 'lastDateWorked',
      },
      {
        id: 'functional-comments',
        question: "Any additional comments about your functional status?",
        field: 'comments',
      },
    ],
  },
  {
    sectionId: 'medical-history',
    sectionTitle: 'Medical History',
    prompts: [
      {
        id: 'surgery-history',
        question: "Have you had any surgeries in the past? If so, when and what type?",
        field: 'surgeryHistory',
      },
      {
        id: 'medical-conditions',
        question: "Do you have any medical conditions? High blood pressure, heart disease, diabetes, etc.?",
        field: 'medicalConditions',
      },
      {
        id: 'medications',
        question: "What medications are you currently taking? Include dosage if you know it.",
        field: 'medications',
      },
    ],
  },
];

