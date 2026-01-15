/**
 * Problem List Templates for Assessment Section
 * Common problems that PTs document in their assessments
 */

export interface ProblemTemplate {
  value: string;
  label: string;
  category?: string;
}

// Problem templates organized by category
export const problemTemplatesByCategory = {
  'functional-limitations': [
    { value: 'decreased-participation-adls', label: "Decreased participation in ADL's" },
    { value: 'decreased-tolerance-adls', label: "Decreased tolerance in doing ADL's" },
    { value: 'pain-limits-functional', label: 'Pain limits functional activities' },
    { value: 'decreased-ability-ambulate-community', label: 'Decreased ability to ambulate in the community' },
    { value: 'decreased-ability-negotiate-stairs', label: 'Decreased ability to negotiate stairs' },
    { value: 'decreased-ability-transfer', label: 'Decreased ability to transfer' },
    { value: 'decreased-ability-sit-to-stand', label: 'Decreased ability to sit to stand' },
    { value: 'decreased-ability-reach-overhead', label: 'Decreased ability to reach overhead' },
    { value: 'decreased-ability-lift-carry', label: 'Decreased ability to lift and carry' },
  ],
  'gait-mobility': [
    { value: 'gait-impairment', label: 'Gait Impairment' },
    { value: 'decreased-gait-speed', label: 'Decreased gait speed' },
    { value: 'antalgic-gait', label: 'Antalgic gait' },
    { value: 'decreased-endurance-ambulation', label: 'Decreased endurance with ambulation' },
    { value: 'requires-assistive-device', label: 'Requires assistive device for ambulation' },
    { value: 'decreased-balance-ambulation', label: 'Decreased balance during ambulation' },
    { value: 'fall-risk', label: 'Fall risk' },
  ],
  'balance': [
    { value: 'decreased-balance-even-surfaces', label: 'Decreased balance on even surfaces' },
    { value: 'decreased-balance-uneven-surfaces', label: 'Decreased balance on uneven surfaces' },
    { value: 'decreased-static-balance', label: 'Decreased static balance' },
    { value: 'decreased-dynamic-balance', label: 'Decreased dynamic balance' },
    { value: 'decreased-single-leg-balance', label: 'Decreased single leg balance' },
  ],
  'range-of-motion': [
    { value: 'decreased-rom-preventing-functional', label: 'Decreased ROM preventing full functional activity' },
    { value: 'decreased-rom-joint', label: 'Decreased range of motion' },
    { value: 'rom-restrictions', label: 'Range of motion restrictions' },
    { value: 'flexibility-restricting-movement', label: 'Flexibility restricting normal movement patterns' },
    { value: 'joint-stiffness', label: 'Joint stiffness' },
  ],
  'strength': [
    { value: 'decreased-strength-limiting-functional', label: 'Decreased strength limiting functional activities' },
    { value: 'muscle-weakness', label: 'Muscle weakness' },
    { value: 'decreased-muscle-endurance', label: 'Decreased muscle endurance' },
    { value: 'decreased-core-strength', label: 'Decreased core strength' },
  ],
  'pain': [
    { value: 'pain-limits-functional', label: 'Pain limits functional activities' },
    { value: 'pain-with-movement', label: 'Pain with movement' },
    { value: 'pain-with-weight-bearing', label: 'Pain with weight bearing' },
    { value: 'chronic-pain', label: 'Chronic pain' },
    { value: 'acute-pain', label: 'Acute pain' },
  ],
  'movement-dysfunction': [
    { value: 'movement-restrictions-joint-dysfunction', label: 'Movement restrictions causing joint and muscle dysfunction' },
    { value: 'altered-movement-patterns', label: 'Altered movement patterns' },
    { value: 'compensatory-movements', label: 'Compensatory movements' },
    { value: 'muscle-imbalance', label: 'Muscle imbalance' },
    { value: 'postural-dysfunction', label: 'Postural dysfunction' },
  ],
  'neurological': [
    { value: 'decreased-sensation', label: 'Decreased sensation' },
    { value: 'altered-reflexes', label: 'Altered reflexes' },
    { value: 'decreased-coordination', label: 'Decreased coordination' },
    { value: 'impaired-proprioception', label: 'Impaired proprioception' },
  ],
  'edema-swelling': [
    { value: 'edema', label: 'Edema' },
    { value: 'swelling', label: 'Swelling' },
    { value: 'inflammation', label: 'Inflammation' },
  ],
  'other': [
    { value: 'decreased-tolerance-activity', label: 'Decreased tolerance to activity' },
    { value: 'decreased-work-capacity', label: 'Decreased work capacity' },
    { value: 'decreased-sports-performance', label: 'Decreased sports performance' },
    { value: 'risk-reinjury', label: 'Risk of reinjury' },
  ],
};

// Get all problems as a flat array
export const getAllProblems = (): ProblemTemplate[] => {
  const allProblems: ProblemTemplate[] = [
    { value: '', label: 'Select problem...' },
  ];
  
  Object.values(problemTemplatesByCategory).forEach(categoryProblems => {
    allProblems.push(...categoryProblems);
  });
  
  return allProblems;
};

// Get problems by category
export const getProblemsByCategory = (category: string): ProblemTemplate[] => {
  return problemTemplatesByCategory[category as keyof typeof problemTemplatesByCategory] || [];
};





