import { SectionPrompts } from './subjectivePrompts';

export const objectivePrompts: SectionPrompts[] = [
  {
    sectionId: 'observation',
    sectionTitle: 'Observation',
    prompts: [
      {
        id: 'posture',
        question: "Describe the patient's posture. Any deviations or abnormalities noted?",
        field: 'observation',
      },
      {
        id: 'gait',
        question: "Describe the patient's gait pattern. Any limping, asymmetry, or difficulty with walking?",
        field: 'observation',
      },
      {
        id: 'palpation',
        question: "What did you find on palpation? Any areas of tenderness, swelling, or muscle tension?",
        field: 'observation',
      },
      {
        id: 'general-observation',
        question: "Any other general observations about the patient's presentation, movement patterns, or physical findings?",
        field: 'observation',
      },
    ],
  },
  {
    sectionId: 'arom',
    sectionTitle: 'Active Range of Motion (AROM)',
    prompts: [
      {
        id: 'arom-measurements',
        question: "Let's assess active range of motion. What measurements did you find? Document each motion tested and the degrees measured.",
        field: 'arom',
      },
    ],
  },
  {
    sectionId: 'prom',
    sectionTitle: 'Passive Range of Motion (PROM)',
    prompts: [
      {
        id: 'prom-measurements',
        question: "What were the passive range of motion findings? Document each motion tested and the degrees measured.",
        field: 'prom',
      },
    ],
  },
  {
    sectionId: 'girth',
    sectionTitle: 'Girth Measurements',
    prompts: [
      {
        id: 'girth-measurements',
        question: "Did you take any girth or circumference measurements? What locations did you measure and what were the values?",
        field: 'girth',
      },
    ],
  },
  {
    sectionId: 'muscle-testing',
    sectionTitle: 'Muscle Testing',
    prompts: [
      {
        id: 'muscle-testing-results',
        question: "What were the manual muscle testing results? Which muscles did you test and what were the strength grades?",
        field: 'muscleTesting',
      },
    ],
  },
  {
    sectionId: 'special-tests',
    sectionTitle: 'Special Tests',
    prompts: [
      {
        id: 'special-tests-results',
        question: "What special tests did you perform? What were the test names and results?",
        field: 'specialTests',
      },
    ],
  },
  {
    sectionId: 'myotomes',
    sectionTitle: 'Myotomes',
    prompts: [
      {
        id: 'myotome-testing',
        question: "Let's test myotomes. What were the findings for each myotome level tested?",
        field: 'myotomes',
      },
    ],
  },
  {
    sectionId: 'dermatomes',
    sectionTitle: 'Dermatomes',
    prompts: [
      {
        id: 'dermatome-testing',
        question: "What were the dermatome testing results? Which dermatome levels did you test and what were the sensation findings?",
        field: 'dermatomes',
      },
    ],
  },
  {
    sectionId: 'reflexes',
    sectionTitle: 'Reflexes',
    prompts: [
      {
        id: 'reflex-testing',
        question: "What were the deep tendon reflex findings? Which reflexes did you test and what were the results?",
        field: 'reflexes',
      },
    ],
  },
  {
    sectionId: 'functional-testing',
    sectionTitle: 'Functional Testing',
    prompts: [
      {
        id: 'functional-assessments',
        question: "What functional assessments did you perform? LEFS, DASH, Sit-to-Stand, or others?",
        field: 'functionalTesting',
      },
      {
        id: 'scores',
        question: "What were the scores or results from these functional tests?",
        field: 'functionalTesting',
      },
      {
        id: 'performance',
        question: "How did the patient perform on these functional tests?",
        field: 'functionalTesting',
      },
    ],
  },
  {
    sectionId: 'current-functional-limitations',
    sectionTitle: 'Current Functional Limitations',
    prompts: [
      {
        id: 'limitations',
        question: "What are the patient's current functional limitations? What activities are they unable to do or having difficulty with?",
        field: 'currentFunctionalLimitations',
      },
      {
        id: 'impact',
        question: "How do these limitations impact the patient's daily activities, work, or quality of life?",
        field: 'currentFunctionalLimitations',
      },
    ],
  },
];

