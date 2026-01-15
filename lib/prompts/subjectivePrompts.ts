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
        id: 'screening-question-1',
        question: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
        field: 'screeningPerformed',
      },
      {
        id: 'screening-question-2',
        question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        field: 'screeningPerformed',
      },
      {
        id: 'screening-results',
        question: "Based on the screening, what were the results? Was it positive or negative?",
        field: 'screeningResults',
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
        id: 'food-insecurity-1',
        question: "Within the past 12 months, you worried that your food would run out before you got money to buy more. Is that true for you?",
        field: 'screeningPerformed',
      },
      {
        id: 'food-insecurity-2',
        question: "Within the past 12 months, the food you bought just didn't last and you didn't have money to get more. Is that true for you?",
        field: 'screeningPerformed',
      },
      {
        id: 'housing',
        question: "What is your living situation today? Do you have stable housing?",
        field: 'screeningPerformed',
      },
      {
        id: 'transportation',
        question: "In the past 12 months, has lack of transportation kept you from medical appointments, meetings, work, or from getting things needed for daily living?",
        field: 'screeningPerformed',
      },
      {
        id: 'utilities',
        question: "In the past 12 months, has the electric, gas, oil, or water company threatened to shut off services in your home?",
        field: 'screeningPerformed',
      },
      {
        id: 'safety',
        question: "How often does anyone, including family and friends, physically hurt you?",
        field: 'screeningPerformed',
      },
    ],
  },
  {
    sectionId: 'elder-maltreatment',
    sectionTitle: 'Elder Maltreatment',
    prompts: [
      {
        id: 'abuse-1',
        question: "Has anyone close to you called you names or put you down?",
        field: 'screeningPerformed',
      },
      {
        id: 'abuse-2',
        question: "Has anyone forced you to do things you didn't want to do?",
        field: 'screeningPerformed',
      },
      {
        id: 'abuse-3',
        question: "Has anyone taken things that belong to you without your OK?",
        field: 'screeningPerformed',
      },
      {
        id: 'abuse-4',
        question: "Has anyone hit, slapped, kicked, or pushed you?",
        field: 'screeningPerformed',
      },
      {
        id: 'abuse-5',
        question: "Has anyone prevented you from getting food, clothes, medication, glasses, hearing aids, or medical care, or from being with people you wanted to be with?",
        field: 'screeningPerformed',
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
        id: 'incontinence-1',
        question: "Do you ever leak urine when you cough, sneeze, laugh, or exercise?",
        field: 'screeningPerformed',
      },
      {
        id: 'incontinence-2',
        question: "Do you have a strong, sudden urge to urinate that is difficult to control?",
        field: 'screeningPerformed',
      },
      {
        id: 'incontinence-3',
        question: "How many times do you urinate during the day?",
        field: 'screeningPerformed',
      },
      {
        id: 'incontinence-4',
        question: "How many times do you get up at night to urinate?",
        field: 'screeningPerformed',
      },
    ],
  },
  {
    sectionId: 'dementia',
    sectionTitle: 'Dementia Assessment & Support',
    prompts: [
      {
        id: 'memory-1',
        question: "Do you have trouble remembering things, like appointments or recent events?",
        field: 'assessmentPerformed',
      },
      {
        id: 'memory-2',
        question: "Do you have difficulty finding the right words when speaking?",
        field: 'assessmentPerformed',
      },
      {
        id: 'orientation-1',
        question: "What is today's date?",
        field: 'assessmentPerformed',
      },
      {
        id: 'orientation-2',
        question: "Where are we right now?",
        field: 'assessmentPerformed',
      },
      {
        id: 'function',
        question: "Have you noticed any changes in your ability to manage daily tasks like cooking, managing finances, or taking medications?",
        field: 'assessmentPerformed',
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



