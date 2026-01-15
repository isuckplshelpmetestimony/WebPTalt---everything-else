/**
 * Utility functions to map extracted JSON data to form state
 */

import {
  ExtractedCurrentCondition,
  ExtractedDepression,
  ExtractedSocialDrivers,
  ExtractedElderMaltreatment,
  ExtractedFalls,
  ExtractedBMI,
  ExtractedUrinaryIncontinence,
  ExtractedDementia,
  ExtractedDiabetes,
  ExtractedPainHistory,
  ExtractedFunctionalStatus,
  ExtractedMedicalHistory,
  ExtractedObservation,
  ExtractedAROM,
  ExtractedPROM,
  ExtractedGirth,
  ExtractedMuscleTesting,
  ExtractedSpecialTests,
  ExtractedMyotomes,
  ExtractedDermatomes,
  ExtractedReflexes,
  ExtractedFunctionalTesting,
  ExtractedCurrentFunctionalLimitations,
  ExtractedDataBySection,
} from '@/lib/types/extraction';
import { DepressionScreeningData } from '@/components/documents/screenings/DepressionScreening';
import { SocialDriversScreeningData } from '@/components/documents/screenings/SocialDriversScreening';
import { ElderMaltreatmentScreeningData } from '@/components/documents/screenings/ElderMaltreatmentScreening';
import { FallsScreeningData } from '@/components/documents/screenings/FallsScreening';
import { BMIScreeningData } from '@/components/documents/screenings/BMIScreening';
import { UrinaryIncontinenceScreeningData } from '@/components/documents/screenings/UrinaryIncontinenceScreening';
import { DementiaScreeningData } from '@/components/documents/screenings/DementiaScreening';
import { DiabetesScreeningData } from '@/components/documents/screenings/DiabetesScreening';
import { PainArea, PainDescription } from '@/components/documents/PainHistorySection';
import { FunctionalActivity } from '@/components/documents/FunctionalStatusSection';
import { SurgeryEntry, MedicalCondition, Medication } from '@/components/documents/MedicalHistorySection';
import { ROMEntry } from '@/components/documents/tables/ROMTable';
import { GirthEntry } from '@/components/documents/tables/GirthTable';
import { MuscleTestingEntry } from '@/components/documents/tables/MuscleTestingTable';
import { SpecialTestEntry } from '@/components/documents/tables/SpecialTestsTable';
import { MyotomeEntry } from '@/components/documents/tables/MyotomesTable';
import { DermatomeEntry } from '@/components/documents/tables/DermatomesTable';
import { ReflexEntry } from '@/components/documents/tables/ReflexesTable';

/**
 * Map extracted current condition data to form state
 */
export function mapToCurrentCondition(
  extracted: ExtractedCurrentCondition,
  setters: {
    setChiefComplaint: (value: string) => void;
    setOnsetDate: (value: string | Date) => void;
    setTypeOfInjury: (value: string) => void;
    setSpecificInjury: (value: string) => void;
    setAdditionalInjuryDetails: (value: string) => void;
    setSurgeryDate: (value: string) => void;
    setSurgeryType: (value: string) => void;
    setOccupation: (value: string) => void;
    setTreatmentsRelated: (value: Array<{ id: string; text: string }>) => void;
  }
) {
  if (extracted.chiefComplaint) setters.setChiefComplaint(extracted.chiefComplaint);
  if (extracted.onsetDate) setters.setOnsetDate(extracted.onsetDate);
  if (extracted.typeOfInjury) setters.setTypeOfInjury(extracted.typeOfInjury);
  if (extracted.specificInjury) setters.setSpecificInjury(extracted.specificInjury);
  if (extracted.additionalInjuryDetails) setters.setAdditionalInjuryDetails(extracted.additionalInjuryDetails);
  if (extracted.surgeryDate) setters.setSurgeryDate(extracted.surgeryDate);
  if (extracted.surgeryType) setters.setSurgeryType(extracted.surgeryType);
  if (extracted.occupation) setters.setOccupation(extracted.occupation);
  if (extracted.treatmentsRelated && extracted.treatmentsRelated.length > 0) {
    setters.setTreatmentsRelated(
      extracted.treatmentsRelated.map((text, idx) => ({ id: `treatment-${idx}`, text }))
    );
  }
}

/**
 * Map extracted depression screening data
 */
export function mapToDepression(
  extracted: ExtractedDepression,
  setDepressionScreening: (value: DepressionScreeningData) => void,
  current: DepressionScreeningData
) {
  const updated: DepressionScreeningData = { ...current };
  if (extracted.hasBipolarDisorder) updated.hasBipolarDisorder = extracted.hasBipolarDisorder;
  if (extracted.screeningPerformed) updated.screeningPerformed = extracted.screeningPerformed;
  if (extracted.screeningQuestion1) updated.screeningQuestion1 = extracted.screeningQuestion1;
  if (extracted.screeningQuestion2) updated.screeningQuestion2 = extracted.screeningQuestion2;
  if (extracted.screeningResults) updated.screeningResults = extracted.screeningResults;
  if (extracted.screeningToolDescription) updated.screeningToolDescription = extracted.screeningToolDescription;
  if (extracted.followUpPlan) updated.followUpPlan = extracted.followUpPlan;
  setDepressionScreening(updated);
}

/**
 * Map extracted social drivers data
 */
export function mapToSocialDrivers(
  extracted: ExtractedSocialDrivers,
  setSocialDriversScreening: (value: SocialDriversScreeningData) => void,
  current: SocialDriversScreeningData
) {
  const updated: SocialDriversScreeningData = { ...current };
  if (extracted.is18OrGreater !== undefined) updated.is18OrGreater = extracted.is18OrGreater;
  if (extracted.notDocumented !== undefined) updated.notDocumented = extracted.notDocumented;
  if (extracted.screeningPerformed) updated.screeningPerformed = extracted.screeningPerformed;
  if (extracted.foodInsecurity1) updated.foodInsecurity1 = extracted.foodInsecurity1;
  if (extracted.foodInsecurity2) updated.foodInsecurity2 = extracted.foodInsecurity2;
  if (extracted.housing) updated.housing = extracted.housing;
  if (extracted.transportation) updated.transportation = extracted.transportation;
  if (extracted.utilities) updated.utilities = extracted.utilities;
  if (extracted.safety) updated.safety = extracted.safety;
  if (extracted.screeningToolUsed) updated.screeningToolUsed = extracted.screeningToolUsed;
  if (extracted.results) updated.results = extracted.results;
  if (extracted.comments) updated.comments = extracted.comments;
  setSocialDriversScreening(updated);
}

/**
 * Map extracted elder maltreatment data
 */
export function mapToElderMaltreatment(
  extracted: ExtractedElderMaltreatment,
  setElderMaltreatmentScreening: (value: ElderMaltreatmentScreeningData) => void,
  current: ElderMaltreatmentScreeningData
) {
  const updated: ElderMaltreatmentScreeningData = { ...current };
  if (extracted.screeningPerformed) updated.screeningPerformed = extracted.screeningPerformed;
  if (extracted.abuseQuestion1) updated.abuseQuestion1 = extracted.abuseQuestion1;
  if (extracted.abuseQuestion2) updated.abuseQuestion2 = extracted.abuseQuestion2;
  if (extracted.abuseQuestion3) updated.abuseQuestion3 = extracted.abuseQuestion3;
  if (extracted.abuseQuestion4) updated.abuseQuestion4 = extracted.abuseQuestion4;
  if (extracted.abuseQuestion5) updated.abuseQuestion5 = extracted.abuseQuestion5;
  if (extracted.screeningResults) updated.screeningResults = extracted.screeningResults;
  if (extracted.toolDescription) updated.toolDescription = extracted.toolDescription;
  if (extracted.followUpPlanDocumented) updated.followUpPlanDocumented = extracted.followUpPlanDocumented;
  setElderMaltreatmentScreening(updated);
}

/**
 * Map extracted falls data
 */
export function mapToFalls(
  extracted: ExtractedFalls,
  setFallsScreening: (value: FallsScreeningData) => void,
  current: FallsScreeningData
) {
  const updated: FallsScreeningData = { ...current };
  if (extracted.hasFallsHistory) updated.hasFallsHistory = extracted.hasFallsHistory;
  if (extracted.fallDetails) updated.additionalNotes = extracted.fallDetails;
  setFallsScreening(updated);
}

/**
 * Map extracted BMI data
 */
export function mapToBMI(
  extracted: ExtractedBMI,
  setBmiScreening: (value: BMIScreeningData) => void,
  current: BMIScreeningData
) {
  const updated: BMIScreeningData = { ...current };
  if (extracted.height) {
    const heightNum = parseFloat(extracted.height);
    if (!isNaN(heightNum)) updated.height = heightNum;
  }
  if (extracted.weight) {
    const weightNum = parseFloat(extracted.weight);
    if (!isNaN(weightNum)) updated.weight = weightNum;
  }
  setBmiScreening(updated);
}

/**
 * Map extracted urinary incontinence data
 */
export function mapToUrinaryIncontinence(
  extracted: ExtractedUrinaryIncontinence,
  setUrinaryIncontinenceScreening: (value: UrinaryIncontinenceScreeningData) => void,
  current: UrinaryIncontinenceScreeningData
) {
  const updated: UrinaryIncontinenceScreeningData = { ...current };
  if (extracted.screeningPerformed) updated.screeningPerformed = extracted.screeningPerformed;
  if (extracted.incontinenceQuestion1) updated.incontinenceQuestion1 = extracted.incontinenceQuestion1;
  if (extracted.incontinenceQuestion2) updated.incontinenceQuestion2 = extracted.incontinenceQuestion2;
  if (extracted.incontinenceQuestion3) updated.incontinenceQuestion3 = extracted.incontinenceQuestion3;
  if (extracted.incontinenceQuestion4) updated.incontinenceQuestion4 = extracted.incontinenceQuestion4;
  if (extracted.screeningResults) updated.screeningResults = extracted.screeningResults;
  if (extracted.assessmentNotes) updated.assessmentNotes = extracted.assessmentNotes;
  setUrinaryIncontinenceScreening(updated);
}

/**
 * Map extracted dementia data
 */
export function mapToDementia(
  extracted: ExtractedDementia,
  setDementiaScreening: (value: DementiaScreeningData) => void,
  current: DementiaScreeningData
) {
  const updated: DementiaScreeningData = { ...current };
  if (extracted.assessmentPerformed) updated.assessmentPerformed = extracted.assessmentPerformed;
  if (extracted.memoryQuestion1) updated.memoryQuestion1 = extracted.memoryQuestion1;
  if (extracted.memoryQuestion2) updated.memoryQuestion2 = extracted.memoryQuestion2;
  if (extracted.orientationQuestion1) updated.orientationQuestion1 = extracted.orientationQuestion1;
  if (extracted.orientationQuestion2) updated.orientationQuestion2 = extracted.orientationQuestion2;
  if (extracted.functionQuestion) updated.functionQuestion = extracted.functionQuestion;
  if (extracted.assessmentResults) updated.assessmentResults = extracted.assessmentResults;
  if (extracted.supportPlan) updated.supportPlan = extracted.supportPlan;
  if (extracted.notes) updated.notes = extracted.notes;
  setDementiaScreening(updated);
}

/**
 * Map extracted diabetes data
 */
export function mapToDiabetes(
  extracted: ExtractedDiabetes,
  setDiabetesScreening: (value: DiabetesScreeningData) => void,
  current: DiabetesScreeningData
) {
  const updated: DiabetesScreeningData = { ...current };
  if (extracted.hasDiabetes) updated.hasDiabetes = extracted.hasDiabetes;
  if (extracted.diabetesType) {
    // Map to union type
    const type = extracted.diabetesType.toLowerCase();
    if (type.includes('type 1') || type.includes('type1')) {
      updated.diabetesType = 'type1';
    } else if (type.includes('type 2') || type.includes('type2')) {
      updated.diabetesType = 'type2';
    } else if (type.includes('gestational')) {
      updated.diabetesType = 'gestational';
    } else if (type.includes('prediabetes') || type.includes('pre-diabetes')) {
      updated.diabetesType = 'prediabetes';
    }
  }
  if (extracted.medications) updated.medications = extracted.medications;
  if (extracted.complications) updated.notes = extracted.complications;
  setDiabetesScreening(updated);
}

/**
 * Map extracted pain history data
 */
export function mapToPainHistory(
  extracted: ExtractedPainHistory,
  setters: {
    setPainAreas: (value: PainArea[]) => void;
    setPainDescriptions: (value: PainDescription[]) => void;
    setPainHistoryComments: (value: string) => void;
  }
) {
  if (extracted.painAreas && extracted.painAreas.length > 0) {
    setters.setPainAreas(
      extracted.painAreas
        .filter((area) => area !== null && area !== undefined)
        .map((area, idx) => ({
          id: `pain-area-${idx}`,
          area: area.area || '',
          current: area.current || '',
          best: area.best || '',
          worst: area.worst || '',
        }))
    );
  }
  if (extracted.painDescriptions && extracted.painDescriptions.length > 0) {
    setters.setPainDescriptions(
      extracted.painDescriptions
        .filter((desc) => desc !== null && desc !== undefined)
        .map((desc, idx) => ({
          id: `pain-desc-${idx}`,
          area: desc.area || '',
          activityTime: desc.activityTime || '',
          symptoms: desc.symptoms || '',
          description: desc.description || '',
        }))
    );
  }
  if (extracted.comments) setters.setPainHistoryComments(extracted.comments);
}

/**
 * Map extracted functional status data
 */
export function mapToFunctionalStatus(
  extracted: ExtractedFunctionalStatus,
  setters: {
    setFunctionalActivities: (value: FunctionalActivity[]) => void;
    setFunctionalRestrictions: (value: string) => void;
    setLastDateWorked: (value: string) => void;
    setFunctionalComments: (value: string) => void;
  }
) {
  if (extracted.activities && extracted.activities.length > 0) {
    setters.setFunctionalActivities(
      extracted.activities
        .filter((activity) => activity !== null && activity !== undefined)
        .map((activity, idx) => ({
          id: `activity-${idx}`,
          functionalActivity: activity.activity || '',
          status: activity.difficulty || '',
          assistance: activity.assistance || '',
          patientGoal: false,
          level: 'Current',
        }))
    );
  }
  if (extracted.restrictions) setters.setFunctionalRestrictions(extracted.restrictions);
  if (extracted.lastDateWorked) setters.setLastDateWorked(extracted.lastDateWorked);
  if (extracted.comments) setters.setFunctionalComments(extracted.comments);
}

/**
 * Map extracted medical history data
 */
export function mapToMedicalHistory(
  extracted: ExtractedMedicalHistory,
  setters: {
    setSurgeryHistory: (value: SurgeryEntry[]) => void;
    setMedicalConditions: (value: MedicalCondition[]) => void;
    setMedications: (value: Medication[]) => void;
  }
) {
  if (extracted.surgeryHistory && extracted.surgeryHistory.length > 0) {
    setters.setSurgeryHistory(
      extracted.surgeryHistory
        .filter((surgery) => surgery !== null && surgery !== undefined)
        .map((surgery, idx) => ({
          id: `surgery-${idx}`,
          surgery: surgery.type || '',
          date: surgery.date || '',
          outcome: surgery.outcome || '',
          status: '',
        }))
    );
  }
  if (extracted.medicalConditions && extracted.medicalConditions.length > 0) {
    setters.setMedicalConditions(
      extracted.medicalConditions
        .filter((condition) => condition !== null && condition !== undefined)
        .map((condition, idx) => ({
          id: `condition-${idx}`,
          medicalCondition: condition.condition || '',
          onset: '',
          currentStatus: '',
          precaution: '',
          contraindication: '',
        }))
    );
  }
  if (extracted.medications && extracted.medications.length > 0) {
    setters.setMedications(
      extracted.medications
        .filter((med) => med !== null && med !== undefined)
        .map((med, idx) => ({
          id: `medication-${idx}`,
          medication: med.name || '',
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          routeOfAdministration: med.routeOfAdministration || '',
        }))
    );
  }
}

/**
 * Map extracted observation data
 */
export function mapToObservation(
  extracted: ExtractedObservation,
  setObservation: (value: string) => void
) {
  if (extracted.observation) {
    setObservation(extracted.observation);
  }
}

/**
 * Map extracted AROM data
 */
export function mapToAROM(
  extracted: ExtractedAROM,
  setAROMEntries: (value: ROMEntry[]) => void
) {
  if (extracted.arom && extracted.arom.length > 0) {
    setAROMEntries(
      extracted.arom
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `arom-${idx}`,
          motion: entry.motion || '',
          right: entry.right || '',
          left: entry.left || '',
          units: entry.units || 'degrees',
          rightGrossStrength: entry.rightGrossStrength || undefined,
          leftGrossStrength: entry.leftGrossStrength || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted PROM data
 */
export function mapToPROM(
  extracted: ExtractedPROM,
  setPROMEntries: (value: ROMEntry[]) => void
) {
  if (extracted.prom && extracted.prom.length > 0) {
    setPROMEntries(
      extracted.prom
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `prom-${idx}`,
          motion: entry.motion || '',
          right: entry.right || '',
          left: entry.left || '',
          units: entry.units || 'degrees',
          rightGrossStrength: entry.rightGrossStrength || undefined,
          leftGrossStrength: entry.leftGrossStrength || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted Girth data
 */
export function mapToGirth(
  extracted: ExtractedGirth,
  setGirthEntries: (value: GirthEntry[]) => void
) {
  if (extracted.girth && extracted.girth.length > 0) {
    setGirthEntries(
      extracted.girth
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `girth-${idx}`,
          measurement: entry.measurement || '',
          right: entry.right || '',
          left: entry.left || '',
          units: entry.units || 'inches',
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted Muscle Testing data
 */
export function mapToMuscleTesting(
  extracted: ExtractedMuscleTesting,
  setMuscleTestingEntries: (value: MuscleTestingEntry[]) => void
) {
  if (extracted.muscleTesting && extracted.muscleTesting.length > 0) {
    setMuscleTestingEntries(
      extracted.muscleTesting
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `muscle-${idx}`,
          muscle: entry.muscle || '',
          rightGrade: entry.rightGrade || undefined,
          leftGrade: entry.leftGrade || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted Special Tests data
 */
export function mapToSpecialTests(
  extracted: ExtractedSpecialTests,
  setSpecialTestEntries: (value: SpecialTestEntry[]) => void
) {
  if (extracted.specialTests && extracted.specialTests.length > 0) {
    setSpecialTestEntries(
      extracted.specialTests
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `special-${idx}`,
          testName: entry.testName || '',
          rightResult: entry.rightResult || undefined,
          leftResult: entry.leftResult || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted Myotomes data
 */
export function mapToMyotomes(
  extracted: ExtractedMyotomes,
  setMyotomeEntries: (value: MyotomeEntry[]) => void
) {
  if (extracted.myotomes && extracted.myotomes.length > 0) {
    setMyotomeEntries(
      extracted.myotomes
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `myotome-${idx}`,
          myotome: entry.myotome || '',
          rightGrade: entry.rightGrade || undefined,
          leftGrade: entry.leftGrade || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted Dermatomes data
 */
export function mapToDermatomes(
  extracted: ExtractedDermatomes,
  setDermatomeEntries: (value: DermatomeEntry[]) => void
) {
  if (extracted.dermatomes && extracted.dermatomes.length > 0) {
    setDermatomeEntries(
      extracted.dermatomes
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `dermatome-${idx}`,
          dermatome: entry.dermatome || '',
          rightSensation: entry.rightSensation || undefined,
          leftSensation: entry.leftSensation || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted Reflexes data
 */
export function mapToReflexes(
  extracted: ExtractedReflexes,
  setReflexEntries: (value: ReflexEntry[]) => void
) {
  if (extracted.reflexes && extracted.reflexes.length > 0) {
    setReflexEntries(
      extracted.reflexes
        .filter((entry) => entry !== null && entry !== undefined)
        .map((entry, idx) => ({
          id: `reflex-${idx}`,
          reflexName: entry.reflexName || '',
          rightResult: entry.rightResult || undefined,
          leftResult: entry.leftResult || undefined,
          comments: entry.comments || undefined,
        }))
    );
  }
}

/**
 * Map extracted functional testing data
 */
export function mapToFunctionalTesting(
  extracted: ExtractedFunctionalTesting,
  setFunctionalTesting: (value: string) => void
) {
  if (extracted.functionalTesting) {
    setFunctionalTesting(extracted.functionalTesting);
  }
}

/**
 * Map extracted current functional limitations data
 */
export function mapToCurrentFunctionalLimitations(
  extracted: ExtractedCurrentFunctionalLimitations,
  setCurrentFunctionalLimitations: (value: string) => void
) {
  if (extracted.currentFunctionalLimitations) {
    setCurrentFunctionalLimitations(extracted.currentFunctionalLimitations);
  }
}

/**
 * Apply all extracted data to form state
 */
export function applyExtractedDataForSections(
  extractedDataBySection: ExtractedDataBySection,
  setters: {
    // Current Condition
    setChiefComplaint: (value: string) => void;
    setOnsetDate: (value: string | Date) => void;
    setTypeOfInjury: (value: string) => void;
    setSpecificInjury: (value: string) => void;
    setAdditionalInjuryDetails: (value: string) => void;
    setSurgeryDate: (value: string) => void;
    setSurgeryType: (value: string) => void;
    setOccupation: (value: string) => void;
    setTreatmentsRelated: (value: Array<{ id: string; text: string }>) => void;
    // Screenings
    setDepressionScreening: (value: DepressionScreeningData) => void;
    setSocialDriversScreening: (value: SocialDriversScreeningData) => void;
    setElderMaltreatmentScreening: (value: ElderMaltreatmentScreeningData) => void;
    setFallsScreening: (value: FallsScreeningData) => void;
    setBmiScreening: (value: BMIScreeningData) => void;
    setUrinaryIncontinenceScreening: (value: UrinaryIncontinenceScreeningData) => void;
    setDementiaScreening: (value: DementiaScreeningData) => void;
    setDiabetesScreening: (value: DiabetesScreeningData) => void;
    // Pain History
    setPainAreas: (value: PainArea[]) => void;
    setPainDescriptions: (value: PainDescription[]) => void;
    setPainHistoryComments: (value: string) => void;
    // Functional Status
    setFunctionalActivities: (value: FunctionalActivity[]) => void;
    setFunctionalRestrictions: (value: string) => void;
    setLastDateWorked: (value: string) => void;
    setFunctionalComments: (value: string) => void;
    // Medical History
    setSurgeryHistory: (value: SurgeryEntry[]) => void;
    setMedicalConditions: (value: MedicalCondition[]) => void;
    setMedications: (value: Medication[]) => void;
    // Objective sections
    setObservation?: (value: string) => void;
    setAROMEntries?: (value: ROMEntry[]) => void;
    setPROMEntries?: (value: ROMEntry[]) => void;
    setGirthEntries?: (value: GirthEntry[]) => void;
    setMuscleTestingEntries?: (value: MuscleTestingEntry[]) => void;
    setSpecialTestEntries?: (value: SpecialTestEntry[]) => void;
    setMyotomeEntries?: (value: MyotomeEntry[]) => void;
    setDermatomeEntries?: (value: DermatomeEntry[]) => void;
    setReflexEntries?: (value: ReflexEntry[]) => void;
    setFunctionalTesting?: (value: string) => void;
    setCurrentFunctionalLimitations?: (value: string) => void;
  },
  currentState: {
    depressionScreening: DepressionScreeningData;
    socialDriversScreening: SocialDriversScreeningData;
    elderMaltreatmentScreening: ElderMaltreatmentScreeningData;
    fallsScreening: FallsScreeningData;
    bmiScreening: BMIScreeningData;
    urinaryIncontinenceScreening: UrinaryIncontinenceScreeningData;
    dementiaScreening: DementiaScreeningData;
    diabetesScreening: DiabetesScreeningData;
  }
) {
  // Current Condition
  if (extractedDataBySection['current-condition']) {
    mapToCurrentCondition(extractedDataBySection['current-condition'], {
      setChiefComplaint: setters.setChiefComplaint,
      setOnsetDate: setters.setOnsetDate,
      setTypeOfInjury: setters.setTypeOfInjury,
      setSpecificInjury: setters.setSpecificInjury,
      setAdditionalInjuryDetails: setters.setAdditionalInjuryDetails,
      setSurgeryDate: setters.setSurgeryDate,
      setSurgeryType: setters.setSurgeryType,
      setOccupation: setters.setOccupation,
      setTreatmentsRelated: setters.setTreatmentsRelated,
    });
  }

  // Depression
  if (extractedDataBySection.depression) {
    mapToDepression(
      extractedDataBySection.depression,
      setters.setDepressionScreening,
      currentState.depressionScreening
    );
  }

  // Social Drivers
  if (extractedDataBySection['social-drivers']) {
    mapToSocialDrivers(
      extractedDataBySection['social-drivers'],
      setters.setSocialDriversScreening,
      currentState.socialDriversScreening
    );
  }

  // Elder Maltreatment
  if (extractedDataBySection['elder-maltreatment']) {
    mapToElderMaltreatment(
      extractedDataBySection['elder-maltreatment'],
      setters.setElderMaltreatmentScreening,
      currentState.elderMaltreatmentScreening
    );
  }

  // Falls
  if (extractedDataBySection.falls) {
    mapToFalls(extractedDataBySection.falls, setters.setFallsScreening, currentState.fallsScreening);
  }

  // BMI
  if (extractedDataBySection.bmi) {
    mapToBMI(extractedDataBySection.bmi, setters.setBmiScreening, currentState.bmiScreening);
  }

  // Urinary Incontinence
  if (extractedDataBySection['urinary-incontinence']) {
    mapToUrinaryIncontinence(
      extractedDataBySection['urinary-incontinence'],
      setters.setUrinaryIncontinenceScreening,
      currentState.urinaryIncontinenceScreening
    );
  }

  // Dementia
  if (extractedDataBySection.dementia) {
    mapToDementia(
      extractedDataBySection.dementia,
      setters.setDementiaScreening,
      currentState.dementiaScreening
    );
  }

  // Diabetes
  if (extractedDataBySection.diabetes) {
    mapToDiabetes(
      extractedDataBySection.diabetes,
      setters.setDiabetesScreening,
      currentState.diabetesScreening
    );
  }

  // Pain History
  if (extractedDataBySection['pain-history']) {
    mapToPainHistory(extractedDataBySection['pain-history'], {
      setPainAreas: setters.setPainAreas,
      setPainDescriptions: setters.setPainDescriptions,
      setPainHistoryComments: setters.setPainHistoryComments,
    });
  }

  // Functional Status
  if (extractedDataBySection['functional-status']) {
    mapToFunctionalStatus(extractedDataBySection['functional-status'], {
      setFunctionalActivities: setters.setFunctionalActivities,
      setFunctionalRestrictions: setters.setFunctionalRestrictions,
      setLastDateWorked: setters.setLastDateWorked,
      setFunctionalComments: setters.setFunctionalComments,
    });
  }

  // Medical History
  if (extractedDataBySection['medical-history']) {
    mapToMedicalHistory(extractedDataBySection['medical-history'], {
      setSurgeryHistory: setters.setSurgeryHistory,
      setMedicalConditions: setters.setMedicalConditions,
      setMedications: setters.setMedications,
    });
  }

  // Observation
  if (extractedDataBySection.observation && setters.setObservation) {
    mapToObservation(extractedDataBySection.observation, setters.setObservation);
  }

  // AROM
  if (extractedDataBySection.arom && setters.setAROMEntries) {
    mapToAROM(extractedDataBySection.arom, setters.setAROMEntries);
  }

  // PROM
  if (extractedDataBySection.prom && setters.setPROMEntries) {
    mapToPROM(extractedDataBySection.prom, setters.setPROMEntries);
  }

  // Girth
  if (extractedDataBySection.girth && setters.setGirthEntries) {
    mapToGirth(extractedDataBySection.girth, setters.setGirthEntries);
  }

  // Muscle Testing
  if (extractedDataBySection['muscle-testing'] && setters.setMuscleTestingEntries) {
    mapToMuscleTesting(extractedDataBySection['muscle-testing'], setters.setMuscleTestingEntries);
  }

  // Special Tests
  if (extractedDataBySection['special-tests'] && setters.setSpecialTestEntries) {
    mapToSpecialTests(extractedDataBySection['special-tests'], setters.setSpecialTestEntries);
  }

  // Myotomes
  if (extractedDataBySection.myotomes && setters.setMyotomeEntries) {
    mapToMyotomes(extractedDataBySection.myotomes, setters.setMyotomeEntries);
  }

  // Dermatomes
  if (extractedDataBySection.dermatomes && setters.setDermatomeEntries) {
    mapToDermatomes(extractedDataBySection.dermatomes, setters.setDermatomeEntries);
  }

  // Reflexes
  if (extractedDataBySection.reflexes && setters.setReflexEntries) {
    mapToReflexes(extractedDataBySection.reflexes, setters.setReflexEntries);
  }

  // Functional Testing
  if (extractedDataBySection['functional-testing'] && setters.setFunctionalTesting) {
    mapToFunctionalTesting(extractedDataBySection['functional-testing'], setters.setFunctionalTesting);
  }

  // Current Functional Limitations
  if (extractedDataBySection['current-functional-limitations'] && setters.setCurrentFunctionalLimitations) {
    mapToCurrentFunctionalLimitations(extractedDataBySection['current-functional-limitations'], setters.setCurrentFunctionalLimitations);
  }
}

