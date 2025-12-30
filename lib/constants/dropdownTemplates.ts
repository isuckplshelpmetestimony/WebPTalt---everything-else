/**
 * Dropdown template options organized by body region and category
 * Used for Objective section tables (AROM, PROM, Muscle Testing, Special Tests, etc.)
 */

// ROM Motion Options by Body Region
export const romMotionsByRegion = {
  'general': [
    { value: 'general-spine', label: 'General Spine' },
  ],
  'c-spine': [
    { value: 'cervical-flexion', label: 'Cervical Flexion' },
    { value: 'cervical-extension', label: 'Cervical Extension' },
    { value: 'cervical-rotation', label: 'Cervical Rotation' },
    { value: 'cervical-side-bend', label: 'Cervical Side Bend' },
    { value: 'cervical-lateral-flexion', label: 'Cervical Lateral Flexion' },
  ],
  't-spine': [
    { value: 'thoracic-flexion', label: 'Thoracic Flexion' },
    { value: 'thoracic-extension', label: 'Thoracic Extension' },
    { value: 'thoracic-rotation', label: 'Thoracic Rotation' },
    { value: 'thoracic-side-bend', label: 'Thoracic Side Bend' },
  ],
  'l-spine': [
    { value: 'lumbar-flexion', label: 'Lumbar Flexion' },
    { value: 'lumbar-extension', label: 'Lumbar Extension' },
    { value: 'lumbar-rotation', label: 'Lumbar Rotation' },
    { value: 'lumbar-side-bend', label: 'Lumbar Side Bend' },
  ],
  'shoulder': [
    { value: 'shoulder-flexion', label: 'Shoulder Flexion' },
    { value: 'shoulder-extension', label: 'Shoulder Extension' },
    { value: 'shoulder-abduction', label: 'Shoulder Abduction' },
    { value: 'shoulder-adduction', label: 'Shoulder Adduction' },
    { value: 'shoulder-internal-rotation', label: 'Shoulder Internal Rotation' },
    { value: 'shoulder-external-rotation', label: 'Shoulder External Rotation' },
    { value: 'shoulder-horizontal-abduction', label: 'Shoulder Horizontal Abduction' },
    { value: 'shoulder-horizontal-adduction', label: 'Shoulder Horizontal Adduction' },
  ],
  'elbow': [
    { value: 'elbow-flexion', label: 'Elbow Flexion' },
    { value: 'elbow-extension', label: 'Elbow Extension' },
  ],
  'wrist': [
    { value: 'wrist-flexion', label: 'Wrist Flexion' },
    { value: 'wrist-extension', label: 'Wrist Extension' },
    { value: 'wrist-radial-deviation', label: 'Wrist Radial Deviation' },
    { value: 'wrist-ulnar-deviation', label: 'Wrist Ulnar Deviation' },
  ],
  'hand': [
    { value: 'finger-mcp-flexion', label: 'Finger MCP Flexion' },
    { value: 'finger-mcp-extension', label: 'Finger MCP Extension' },
    { value: 'finger-pip-flexion', label: 'Finger PIP Flexion' },
    { value: 'finger-pip-extension', label: 'Finger PIP Extension' },
    { value: 'finger-dip-flexion', label: 'Finger DIP Flexion' },
    { value: 'finger-dip-extension', label: 'Finger DIP Extension' },
    { value: 'thumb-flexion', label: 'Thumb Flexion' },
    { value: 'thumb-extension', label: 'Thumb Extension' },
    { value: 'thumb-abduction', label: 'Thumb Abduction' },
    { value: 'thumb-opposition', label: 'Thumb Opposition' },
  ],
  'hip': [
    { value: 'hip-flexion', label: 'Hip Flexion' },
    { value: 'hip-extension', label: 'Hip Extension' },
    { value: 'hip-abduction', label: 'Hip Abduction' },
    { value: 'hip-adduction', label: 'Hip Adduction' },
    { value: 'hip-internal-rotation', label: 'Hip Internal Rotation' },
    { value: 'hip-external-rotation', label: 'Hip External Rotation' },
  ],
  'knee': [
    { value: 'knee-flexion', label: 'Knee Flexion' },
    { value: 'knee-extension', label: 'Knee Extension' },
  ],
  'ankle': [
    { value: 'ankle-dorsiflexion', label: 'Ankle Dorsiflexion' },
    { value: 'ankle-plantarflexion', label: 'Ankle Plantarflexion' },
    { value: 'ankle-inversion', label: 'Ankle Inversion' },
    { value: 'ankle-eversion', label: 'Ankle Eversion' },
  ],
};

// Forearm motions (shared between elbow/wrist)
export const forearmMotions = [
  { value: 'forearm-pronation', label: 'Forearm Pronation' },
  { value: 'forearm-supination', label: 'Forearm Supination' },
];

// Muscle Testing Options by Body Region
export const musclesByRegion = {
  'c-spine': [
    { value: 'upper-trapezius', label: 'Upper Trapezius' },
    { value: 'middle-trapezius', label: 'Middle Trapezius' },
    { value: 'lower-trapezius', label: 'Lower Trapezius' },
    { value: 'levator-scapulae', label: 'Levator Scapulae' },
    { value: 'scalenes', label: 'Scalenes' },
  ],
  'shoulder': [
    { value: 'deltoid-anterior', label: 'Deltoid (Anterior)' },
    { value: 'deltoid-middle', label: 'Deltoid (Middle)' },
    { value: 'deltoid-posterior', label: 'Deltoid (Posterior)' },
    { value: 'supraspinatus', label: 'Supraspinatus' },
    { value: 'infraspinatus', label: 'Infraspinatus' },
    { value: 'teres-minor', label: 'Teres Minor' },
    { value: 'subscapularis', label: 'Subscapularis' },
    { value: 'latissimus-dorsi', label: 'Latissimus Dorsi' },
    { value: 'pectoralis-major', label: 'Pectoralis Major' },
    { value: 'serratus-anterior', label: 'Serratus Anterior' },
    { value: 'rhomboids', label: 'Rhomboids' },
  ],
  'elbow': [
    { value: 'biceps-brachii', label: 'Biceps Brachii' },
    { value: 'brachialis', label: 'Brachialis' },
    { value: 'triceps-brachii', label: 'Triceps Brachii' },
    { value: 'brachioradialis', label: 'Brachioradialis' },
  ],
  'wrist': [
    { value: 'wrist-flexors', label: 'Wrist Flexors' },
    { value: 'wrist-extensors', label: 'Wrist Extensors' },
    { value: 'flexor-carpi-radialis', label: 'Flexor Carpi Radialis' },
    { value: 'flexor-carpi-ulnaris', label: 'Flexor Carpi Ulnaris' },
    { value: 'extensor-carpi-radialis', label: 'Extensor Carpi Radialis' },
    { value: 'extensor-carpi-ulnaris', label: 'Extensor Carpi Ulnaris' },
  ],
  'hand': [
    { value: 'finger-flexors', label: 'Finger Flexors' },
    { value: 'finger-extensors', label: 'Finger Extensors' },
    { value: 'thumb-opponens', label: 'Thumb Opponens' },
    { value: 'thumb-abductors', label: 'Thumb Abductors' },
    { value: 'interossei', label: 'Interossei' },
    { value: 'lumbricals', label: 'Lumbricals' },
  ],
  'hip': [
    { value: 'hip-flexors', label: 'Hip Flexors' },
    { value: 'hip-extensors', label: 'Hip Extensors' },
    { value: 'hip-abductors', label: 'Hip Abductors' },
    { value: 'hip-adductors', label: 'Hip Adductors' },
    { value: 'gluteus-maximus', label: 'Gluteus Maximus' },
    { value: 'gluteus-medius', label: 'Gluteus Medius' },
    { value: 'gluteus-minimus', label: 'Gluteus Minimus' },
    { value: 'tensor-fasciae-latae', label: 'Tensor Fasciae Latae' },
    { value: 'piriformis', label: 'Piriformis' },
  ],
  'knee': [
    { value: 'quadriceps', label: 'Quadriceps' },
    { value: 'hamstrings', label: 'Hamstrings' },
    { value: 'rectus-femoris', label: 'Rectus Femoris' },
    { value: 'vastus-lateralis', label: 'Vastus Lateralis' },
    { value: 'vastus-medialis', label: 'Vastus Medialis' },
    { value: 'biceps-femoris', label: 'Biceps Femoris' },
    { value: 'semitendinosus', label: 'Semitendinosus' },
    { value: 'semimembranosus', label: 'Semimembranosus' },
  ],
  'ankle': [
    { value: 'gastrocnemius', label: 'Gastrocnemius' },
    { value: 'soleus', label: 'Soleus' },
    { value: 'tibialis-anterior', label: 'Tibialis Anterior' },
    { value: 'tibialis-posterior', label: 'Tibialis Posterior' },
    { value: 'peroneals', label: 'Peroneals' },
    { value: 'peroneus-longus', label: 'Peroneus Longus' },
    { value: 'peroneus-brevis', label: 'Peroneus Brevis' },
    { value: 'extensor-hallucis-longus', label: 'Extensor Hallucis Longus' },
    { value: 'flexor-hallucis-longus', label: 'Flexor Hallucis Longus' },
  ],
  'core': [
    { value: 'abdominals', label: 'Abdominals' },
    { value: 'rectus-abdominis', label: 'Rectus Abdominis' },
    { value: 'obliques', label: 'Obliques' },
    { value: 'erector-spinae', label: 'Erector Spinae' },
    { value: 'multifidus', label: 'Multifidus' },
    { value: 'transverse-abdominis', label: 'Transverse Abdominis' },
  ],
};

// Special Tests by Body Region
export const specialTestsByRegion = {
  'c-spine': [
    { value: 'spurling', label: "Spurling's Test" },
    { value: 'distraction-test', label: 'Distraction Test' },
    { value: 'valsalva', label: "Valsalva's Test" },
    { value: 'jackson-compression', label: 'Jackson Compression Test' },
    { value: 'shoulder-abduction', label: 'Shoulder Abduction Test' },
  ],
  't-spine': [
    { value: 'thoracic-compression', label: 'Thoracic Compression Test' },
    { value: 'slump-test', label: 'Slump Test' },
  ],
  'l-spine': [
    { value: 'straight-leg-raise', label: 'Straight Leg Raise (SLR)' },
    { value: 'slump-test', label: 'Slump Test' },
    { value: 'femoral-nerve-tension', label: 'Femoral Nerve Tension Test' },
    { value: 'prone-knee-bend', label: 'Prone Knee Bend Test' },
    { value: 'well-leg-raising', label: 'Well Leg Raising Test' },
  ],
  'shoulder': [
    { value: 'neer-impingement', label: "Neer's Impingement Test" },
    { value: 'hawkins-kennedy', label: "Hawkins-Kennedy Test" },
    { value: 'empty-can', label: 'Empty Can Test' },
    { value: 'speed-test', label: "Speed's Test" },
    { value: 'yergason', label: "Yergason's Test" },
    { value: 'apprehension-test', label: 'Apprehension Test' },
    { value: 'relocation-test', label: 'Relocation Test' },
    { value: 'sulcus-sign', label: 'Sulcus Sign' },
    { value: 'cross-body-adduction', label: 'Cross Body Adduction Test' },
  ],
  'elbow': [
    { value: 'cozen-test', label: "Cozen's Test" },
    { value: 'mill-test', label: "Mill's Test" },
    { value: 'varus-stress-elbow', label: 'Varus Stress Test (Elbow)' },
    { value: 'valgus-stress-elbow', label: 'Valgus Stress Test (Elbow)' },
    { value: 'tinel-elbow', label: "Tinel's Sign (Elbow)" },
  ],
  'wrist': [
    { value: 'finkelstein', label: "Finkelstein's Test" },
    { value: 'phalen', label: "Phalen's Test" },
    { value: 'reverse-phalen', label: 'Reverse Phalen Test' },
    { value: 'tinel-wrist', label: "Tinel's Sign (Wrist)" },
    { value: 'watson-test', label: "Watson's Test" },
  ],
  'hand': [
    { value: 'froment-sign', label: "Froment's Sign" },
    { value: 'allen-test', label: "Allen's Test" },
    { value: 'bunnell-test', label: "Bunnell's Test" },
  ],
  'hip': [
    { value: 'thomas-test', label: "Thomas' Test" },
    { value: 'ober-test', label: "Ober's Test" },
    { value: 'fabere', label: 'FABERE Test' },
    { value: 'trendelenburg', label: 'Trendelenburg Test' },
    { value: 'patrick-test', label: "Patrick's Test" },
    { value: 'log-roll-test', label: 'Log Roll Test' },
    { value: 'impingement-test', label: 'Hip Impingement Test' },
  ],
  'knee': [
    { value: 'lachman', label: "Lachman's Test" },
    { value: 'anterior-drawer', label: 'Anterior Drawer Test' },
    { value: 'posterior-drawer', label: 'Posterior Drawer Test' },
    { value: 'mcmurray', label: "McMurray's Test" },
    { value: 'thessaly', label: "Thessaly's Test" },
    { value: 'valgus-stress', label: 'Valgus Stress Test' },
    { value: 'varus-stress', label: 'Varus Stress Test' },
    { value: 'pivot-shift', label: 'Pivot Shift Test' },
    { value: 'apprehension-patella', label: 'Apprehension Test (Patella)' },
  ],
  'ankle': [
    { value: 'anterior-drawer-ankle', label: 'Anterior Drawer (Ankle)' },
    { value: 'talar-tilt', label: 'Talar Tilt Test' },
    { value: 'thompson', label: "Thompson's Test" },
    { value: 'squeeze-test', label: 'Squeeze Test' },
    { value: 'external-rotation-test', label: 'External Rotation Test' },
  ],
};

// Functional Mobility Tests
export const functionalMobilityTests = [
  { value: 'hand-dynamometer', label: 'Hand Dynamometer' },
  { value: 'pinch-strength', label: 'Pinch Strength' },
  { value: 'grip-strength', label: 'Grip Strength' },
  { value: 'palpation', label: 'Palpation' },
  { value: 'gait-analysis', label: 'Gait Analysis' },
  { value: 'balance-test', label: 'Balance Test' },
  { value: 'functional-reach', label: 'Functional Reach Test' },
  { value: 'timed-up-and-go', label: 'Timed Up and Go (TUG)' },
  { value: 'sit-to-stand', label: 'Sit to Stand' },
  { value: 'step-test', label: 'Step Test' },
];

// Get all ROM motions as a flat array
export const getAllROMMotions = () => {
  const allMotions: { value: string; label: string }[] = [
    { value: '', label: 'Select motion...' },
  ];
  
  Object.values(romMotionsByRegion).forEach(regionMotions => {
    allMotions.push(...regionMotions);
  });
  
  allMotions.push(...forearmMotions);
  
  return allMotions;
};

// Get all muscles as a flat array
export const getAllMuscles = () => {
  const allMuscles: { value: string; label: string }[] = [
    { value: '', label: 'Select muscle...' },
  ];
  
  Object.values(musclesByRegion).forEach(regionMuscles => {
    allMuscles.push(...regionMuscles);
  });
  
  return allMuscles;
};

// Get all special tests as a flat array
export const getAllSpecialTests = () => {
  const allTests: { value: string; label: string }[] = [
    { value: '', label: 'Select test...' },
  ];
  
  Object.values(specialTestsByRegion).forEach(regionTests => {
    allTests.push(...regionTests);
  });
  
  return allTests;
};



