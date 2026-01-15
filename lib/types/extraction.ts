/**
 * TypeScript types for extracted data from AI transcription
 */

// Current Condition Section
export interface ExtractedCurrentCondition {
  chiefComplaint?: string;
  onsetDate?: string;
  typeOfInjury?: string;
  specificInjury?: string;
  additionalInjuryDetails?: string;
  surgeryDate?: string;
  surgeryType?: string;
  occupation?: string;
  treatmentsRelated?: string[];
}

// Depression Screening
export interface ExtractedDepression {
  hasBipolarDisorder?: 'yes' | 'no';
  screeningPerformed?: 'yes' | 'no';
  screeningQuestion1?: string; // PHQ-2 Question 1 response: 'not-at-all' | 'several-days' | 'more-than-half' | 'nearly-every-day'
  screeningQuestion2?: string; // PHQ-2 Question 2 response: 'not-at-all' | 'several-days' | 'more-than-half' | 'nearly-every-day'
  screeningResults?: 'positive' | 'negative';
  screeningToolDescription?: string;
  followUpPlan?: string[];
}

// Social Drivers of Health
export interface ExtractedSocialDrivers {
  is18OrGreater?: boolean;
  notDocumented?: boolean;
  screeningPerformed?: 'yes' | 'no';
  foodInsecurity1?: 'yes' | 'no';
  foodInsecurity2?: 'yes' | 'no';
  housing?: 'stable' | 'unstable' | 'homeless';
  transportation?: 'yes' | 'no';
  utilities?: 'yes' | 'no';
  safety?: 'never' | 'rarely' | 'sometimes' | 'often';
  screeningToolUsed?: string;
  results?: 'positive' | 'negative';
  comments?: string;
}

// Elder Maltreatment
export interface ExtractedElderMaltreatment {
  screeningPerformed?: 'yes' | 'no';
  abuseQuestion1?: 'yes' | 'no'; // Verbal abuse: "Has anyone close to you called you names or put you down?"
  abuseQuestion2?: 'yes' | 'no'; // Forced activities: "Has anyone forced you to do things you didn't want to do?"
  abuseQuestion3?: 'yes' | 'no'; // Taken belongings: "Has anyone taken things that belong to you without your OK?"
  abuseQuestion4?: 'yes' | 'no'; // Physical harm: "Has anyone hit, slapped, kicked, or pushed you?"
  abuseQuestion5?: 'yes' | 'no'; // Prevented care: "Has anyone prevented you from getting food, clothes, medication, glasses, hearing aids, or medical care, or from being with people you wanted to be with?"
  screeningResults?: 'positive' | 'negative';
  toolDescription?: string;
  followUpPlanDocumented?: 'yes' | 'no';
}

// Falls Screening
export interface ExtractedFalls {
  hasFallsHistory?: 'yes' | 'no';
  fallDetails?: string;
}

// BMI Screening
export interface ExtractedBMI {
  height?: string;
  weight?: string;
  bmi?: number | null;
}

// Urinary Incontinence
export interface ExtractedUrinaryIncontinence {
  screeningPerformed?: 'yes' | 'no';
  incontinenceQuestion1?: 'yes' | 'no'; // Leakage with cough/sneeze/laugh/exercise
  incontinenceQuestion2?: 'yes' | 'no'; // Strong sudden urge to urinate
  incontinenceQuestion3?: string; // Daytime frequency (e.g., "6 or 7 times", "6-7")
  incontinenceQuestion4?: string; // Nighttime frequency (e.g., "1-2 times", "once, maybe twice")
  screeningResults?: 'positive' | 'negative';
  assessmentNotes?: string;
}

// Dementia Screening
export interface ExtractedDementia {
  assessmentPerformed?: 'yes' | 'no';
  memoryQuestion1?: 'yes' | 'no'; // Trouble remembering things like appointments or recent events
  memoryQuestion2?: 'yes' | 'no'; // Difficulty finding the right words when speaking
  orientationQuestion1?: string; // What is today's date?
  orientationQuestion2?: string; // Where are we right now?
  functionQuestion?: 'yes' | 'no'; // Changes in ability to manage daily tasks
  assessmentResults?: 'positive' | 'negative';
  supportPlan?: string;
  notes?: string;
}

// Diabetes Screening
export interface ExtractedDiabetes {
  hasDiabetes?: 'yes' | 'no';
  diabetesType?: string;
  medications?: string;
  complications?: string;
}

// Pain History
export interface ExtractedPainHistory {
  painAreas?: Array<{
    area: string;
    current: string;
    best: string;
    worst: string;
  }>;
  painDescriptions?: Array<{
    area: string;
    activityTime: string;
    symptoms: string;
    description: string;
  }>;
  comments?: string;
}

// Functional Status
export interface ExtractedFunctionalStatus {
  activities?: Array<{
    activity: string;
    difficulty: string;
    assistance: string;
  }>;
  restrictions?: string;
  lastDateWorked?: string;
  comments?: string;
}

// Medical History
export interface ExtractedMedicalHistory {
  surgeryHistory?: Array<{
    date: string;
    type: string;
    outcome: string;
  }>;
  medicalConditions?: Array<{
    condition: string;
    system: string;
  }>;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    routeOfAdministration: string;
  }>;
}

// Observation
export interface ExtractedObservation {
  observation?: string;
}

// AROM
export interface ExtractedAROM {
  arom?: Array<{
    motion: string;
    right: string;
    left: string;
    units: string;
    rightGrossStrength?: string;
    leftGrossStrength?: string;
    comments?: string;
  }>;
}

// PROM
export interface ExtractedPROM {
  prom?: Array<{
    motion: string;
    right: string;
    left: string;
    units: string;
    rightGrossStrength?: string;
    leftGrossStrength?: string;
    comments?: string;
  }>;
}

// Girth
export interface ExtractedGirth {
  girth?: Array<{
    measurement: string;
    right: string;
    left: string;
    units: string;
    comments?: string;
  }>;
}

// Muscle Testing
export interface ExtractedMuscleTesting {
  muscleTesting?: Array<{
    muscle: string;
    rightGrade?: string;
    leftGrade?: string;
    comments?: string;
  }>;
}

// Special Tests
export interface ExtractedSpecialTests {
  specialTests?: Array<{
    testName: string;
    rightResult?: string;
    leftResult?: string;
    comments?: string;
  }>;
}

// Myotomes
export interface ExtractedMyotomes {
  myotomes?: Array<{
    myotome: string;
    rightGrade?: string;
    leftGrade?: string;
    comments?: string;
  }>;
}

// Dermatomes
export interface ExtractedDermatomes {
  dermatomes?: Array<{
    dermatome: string;
    rightSensation?: string;
    leftSensation?: string;
    comments?: string;
  }>;
}

// Reflexes
export interface ExtractedReflexes {
  reflexes?: Array<{
    reflexName: string;
    rightResult?: string;
    leftResult?: string;
    comments?: string;
  }>;
}

// Functional Testing
export interface ExtractedFunctionalTesting {
  functionalTesting?: string;
}

// Current Functional Limitations
export interface ExtractedCurrentFunctionalLimitations {
  currentFunctionalLimitations?: string;
}

// Union type for all extracted sections
export interface ExtractedDataBySection {
  'current-condition'?: ExtractedCurrentCondition;
  'depression'?: ExtractedDepression;
  'social-drivers'?: ExtractedSocialDrivers;
  'elder-maltreatment'?: ExtractedElderMaltreatment;
  'falls'?: ExtractedFalls;
  'bmi'?: ExtractedBMI;
  'urinary-incontinence'?: ExtractedUrinaryIncontinence;
  'dementia'?: ExtractedDementia;
  'diabetes'?: ExtractedDiabetes;
  'pain-history'?: ExtractedPainHistory;
  'functional-status'?: ExtractedFunctionalStatus;
  'medical-history'?: ExtractedMedicalHistory;
  'observation'?: ExtractedObservation;
  'arom'?: ExtractedAROM;
  'prom'?: ExtractedPROM;
  'girth'?: ExtractedGirth;
  'muscle-testing'?: ExtractedMuscleTesting;
  'special-tests'?: ExtractedSpecialTests;
  'myotomes'?: ExtractedMyotomes;
  'dermatomes'?: ExtractedDermatomes;
  'reflexes'?: ExtractedReflexes;
  'functional-testing'?: ExtractedFunctionalTesting;
  'current-functional-limitations'?: ExtractedCurrentFunctionalLimitations;
}



