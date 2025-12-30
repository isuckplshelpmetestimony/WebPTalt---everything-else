'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { DocumentEditorHeader } from '@/components/documents/DocumentEditorHeader';
import { SubjectiveSection } from '@/components/documents/SubjectiveSection';
import { ObjectiveSection } from '@/components/documents/ObjectiveSection';
import { ROMEntry } from '@/components/documents/tables/ROMTable';
import { GirthEntry } from '@/components/documents/tables/GirthTable';
import { MuscleTestingEntry } from '@/components/documents/tables/MuscleTestingTable';
import { SpecialTestEntry } from '@/components/documents/tables/SpecialTestsTable';
import { MyotomeEntry } from '@/components/documents/tables/MyotomesTable';
import { DermatomeEntry } from '@/components/documents/tables/DermatomesTable';
import { ReflexEntry } from '@/components/documents/tables/ReflexesTable';
import { AssessmentSection } from '@/components/documents/AssessmentSection';
import { Problem } from '@/components/documents/ProblemList';
import { GoalsSection } from '@/components/documents/GoalsSection';
import { PlanSection } from '@/components/documents/PlanSection';
import dynamic from 'next/dynamic';
import { CommonPhrasesLibrary } from '@/components/documents/CommonPhrasesLibrary';

const BillingSection = dynamic(
  () => import('@/components/documents/BillingSection').then(mod => ({ default: mod.BillingSection })),
  { ssr: false }
);
import { DocumentNavigator } from '@/components/documents/DocumentNavigator';
import { MedicalHistorySection, SurgeryEntry, MedicalCondition, Medication } from '@/components/documents/MedicalHistorySection';
import { PainHistorySection, PainArea, PainDescription } from '@/components/documents/PainHistorySection';
import { FunctionalStatusSection, FunctionalActivity } from '@/components/documents/FunctionalStatusSection';
import { DepressionScreening, DepressionScreeningData } from '@/components/documents/screenings/DepressionScreening';
import { SocialDriversScreening, SocialDriversScreeningData } from '@/components/documents/screenings/SocialDriversScreening';
import { ElderMaltreatmentScreening, ElderMaltreatmentScreeningData } from '@/components/documents/screenings/ElderMaltreatmentScreening';
import { FallsScreening, FallsScreeningData } from '@/components/documents/screenings/FallsScreening';
import { BMIScreening, BMIScreeningData } from '@/components/documents/screenings/BMIScreening';
import { UrinaryIncontinenceScreening, UrinaryIncontinenceScreeningData } from '@/components/documents/screenings/UrinaryIncontinenceScreening';
import { DementiaScreening, DementiaScreeningData } from '@/components/documents/screenings/DementiaScreening';
import { DiabetesScreening, DiabetesScreeningData } from '@/components/documents/screenings/DiabetesScreening';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { DocumentType } from '@/lib/types/document';
import { Patient, Case } from '@/lib/types/patient';
import { FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock patient data - replace with actual API calls
const getMockPatient = (patientId: string): Patient => {
  const patients: Record<string, Patient> = {
    '1': {
      id: '1',
      name: 'ROBERT D MCMULLEN JR',
      dob: new Date('1980-05-15'),
      gender: 'Male',
      phone: '(555) 123-4567',
      email: 'robert.mcmullen@example.com',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
      cases: [
        {
          id: '1',
          name: '[WC] 12/15/2025: LUMBAR',
          createdDate: new Date('2025-12-15'),
          visitsRemaining: 0,
          expirationDate: new Date('2025-12-19'),
          authorizationStatus: 'expiring',
        },
      ],
      insurance: {
        id: '1',
        name: 'NYSIF STATE INS FUND',
        policyNumber: 'BC123456789',
        groupNumber: 'GRP001',
      },
      diagnosis: 'Radiculopathy, lumbar region',
      diagnosisCode: 'M54.16',
      patientType: 'workers-comp',
      arrivalRate: 100.0,
    },
    '2': {
      id: '2',
      name: 'MIGUEL A PEREZ',
      dob: new Date('1975-08-22'),
      gender: 'Male',
      phone: '(555) 234-5678',
      email: 'miguel.perez@example.com',
      address: {
        street: '456 Oak Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10002',
      },
      cases: [
        {
          id: '2',
          name: '[WC] 11/20/2025: CERVICAL',
          createdDate: new Date('2025-11-20'),
          visitsRemaining: 3,
          expirationDate: new Date('2026-05-20'),
          authorizationStatus: 'active',
        },
      ],
      insurance: {
        id: '2',
        name: 'NYSIF STATE INS FUND',
        policyNumber: 'BC234567890',
        groupNumber: 'GRP002',
      },
      diagnosis: 'Cervical strain',
      diagnosisCode: 'M54.2',
      patientType: 'workers-comp',
      arrivalRate: 95.0,
    },
    '3': {
      id: '3',
      name: 'SANCHEZ, REBECCA',
      dob: new Date('1990-03-10'),
      gender: 'Female',
      phone: '(555) 345-6789',
      email: 'rebecca.sanchez@example.com',
      address: {
        street: '789 Elm Street',
        city: 'New York',
        state: 'NY',
        zip: '10003',
      },
      cases: [
        {
          id: '3',
          name: '[WC] 10/15/2025: SHOULDER',
          createdDate: new Date('2025-10-15'),
          visitsRemaining: 8,
          expirationDate: new Date('2026-04-15'),
          authorizationStatus: 'active',
        },
      ],
      insurance: {
        id: '3',
        name: 'NYSIF STATE INS FUND',
        policyNumber: 'BC345678901',
        groupNumber: 'GRP003',
      },
      diagnosis: 'Rotator cuff tear',
      diagnosisCode: 'M75.1',
      patientType: 'workers-comp',
      arrivalRate: 98.0,
    },
    '4': {
      id: '4',
      name: 'MEJIA, SEGUNDO',
      dob: new Date('1985-11-05'),
      gender: 'Male',
      phone: '(555) 456-7890',
      email: 'segundo.mejia@example.com',
      address: {
        street: '321 Pine Street',
        city: 'New York',
        state: 'NY',
        zip: '10004',
      },
      cases: [
        {
          id: '4',
          name: '[WC] 09/30/2025: KNEE',
          createdDate: new Date('2025-09-30'),
          visitsRemaining: 10,
          expirationDate: new Date('2026-03-30'),
          authorizationStatus: 'active',
        },
      ],
      insurance: {
        id: '4',
        name: 'NYSIF STATE INS FUND',
        policyNumber: 'BC456789012',
        groupNumber: 'GRP004',
      },
      diagnosis: 'Knee osteoarthritis',
      diagnosisCode: 'M17.11',
      patientType: 'workers-comp',
      arrivalRate: 92.0,
    },
    '5': {
      id: '5',
      name: 'JOHN DOE',
      dob: new Date('1980-05-15'),
      gender: 'Male',
      phone: '(555) 567-8901',
      email: 'john.doe@example.com',
      address: {
        street: '654 Maple Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10005',
      },
      cases: [
        {
          id: '5',
          name: '[WC] 08/15/2025: LUMBAR',
          createdDate: new Date('2025-08-15'),
          visitsRemaining: 5,
          expirationDate: new Date('2026-02-15'),
          authorizationStatus: 'active',
        },
      ],
      insurance: {
        id: '5',
        name: 'NYSIF STATE INS FUND',
        policyNumber: 'BC567890123',
        groupNumber: 'GRP005',
      },
      diagnosis: 'Lower back pain',
      diagnosisCode: 'M54.5',
      patientType: 'workers-comp',
      arrivalRate: 90.0,
    },
    '6': {
      id: '6',
      name: 'JANE SMITH',
      dob: new Date('1975-08-22'),
      gender: 'Female',
      phone: '(555) 678-9012',
      email: 'jane.smith@example.com',
      address: {
        street: '987 Cedar Street',
        city: 'New York',
        state: 'NY',
        zip: '10006',
      },
      cases: [
        {
          id: '6',
          name: '[WC] 07/20/2025: SHOULDER',
          createdDate: new Date('2025-07-20'),
          visitsRemaining: 12,
          expirationDate: new Date('2026-01-20'),
          authorizationStatus: 'active',
        },
      ],
      insurance: {
        id: '6',
        name: 'NYSIF STATE INS FUND',
        policyNumber: 'BC678901234',
        groupNumber: 'GRP006',
      },
      diagnosis: 'Shoulder impingement',
      diagnosisCode: 'M75.4',
      patientType: 'workers-comp',
      arrivalRate: 97.0,
    },
  };
  
  return patients[patientId] || patients['1']; // Default to first patient if not found
};

interface Treatment {
  id: string;
  status: 'performed' | 'not-performed';
  cptCode: string;
  description: string;
  settings?: string;
  totalMinutes: number;
  isHEP: boolean;
  justification?: string;
}

export default function NewDocumentTypePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const documentType = decodeURIComponent(params.type as string) as DocumentType;
  
  // Get patient ID from query params
  const patientId = searchParams.get('patient') || '1';
  const mockPatient = getMockPatient(patientId);
  
  // Format document type for display (remove "PT " prefix if present)
  const displayType = documentType.replace(/^PT\s+/, '');
  
  // Only show full editor for PT Daily Note or PT Initial Evaluation
  // Normalize the document type by trimming and handling potential encoding issues
  const normalizedType = documentType.trim();
  const isDailyNote = normalizedType === 'PT Daily Note';
  const isInitialEvaluation = normalizedType === 'PT Initial Evaluation' || normalizedType.includes('Initial Evaluation');
  
  // Determine if billing should be shown
  const showBilling = normalizedType === 'PT Daily Note' || 
                      normalizedType === 'PT Initial Evaluation' || 
                      normalizedType === 'PT Progress with Billing';

  const [entryDate, setEntryDate] = useState(new Date());
  const [timeIn, setTimeIn] = useState<string>('');
  const [timeOut, setTimeOut] = useState<string>('');
  const [vitals, setVitals] = useState<{ bloodPressure?: string; heartRate?: number; oxygenSaturation?: number }>({});
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [onsetDate, setOnsetDate] = useState<string | Date>('');
  const [typeOfInjury, setTypeOfInjury] = useState('');
  const [specificInjury, setSpecificInjury] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [occupation, setOccupation] = useState('');
  const [treatmentsRelated, setTreatmentsRelated] = useState<Array<{ id: string; text: string }>>([]);
  
  // Mock previous documents for copying
  const previousDocuments = [
    {
      id: 'prev-1',
      type: 'PT Daily Note',
      date: new Date('2025-12-20'),
      // Subjective fields
      chiefComplaint: 'Patient reports feeling better today. Pain is 2/10. Able to perform exercises with less difficulty.',
      onsetDate: 'Chronic pain that flared up 1 month ago',
      typeOfInjury: 'chronic',
      specificInjury: 'strain',
      occupation: 'Construction worker',
      // Goals
      goals: [
        { id: 'g1', text: 'Improve lumbar ROM to within functional limits', type: 'short-term' as const },
        { id: 'g2', text: 'Reduce pain to 2/10 or less', type: 'short-term' as const },
        { id: 'g3', text: 'Return to work without restrictions', type: 'long-term' as const },
      ],
      // Assessment fields
      assessmentEntries: [
        { id: 'a1', text: 'Patient showing good progress with physical therapy intervention. Pain management effective.' },
        { id: 'a2', text: 'Strength and ROM improving as expected.' },
      ],
      overallAssessment: 'Patient progressing well. Continue current plan.',
      // Plan fields
      treatmentFrequency: '3x/week for first 2 weeks, then 2x/week',
      treatmentDuration: '4 weeks total',
      treatmentPlan: 'Continue current treatment plan: 3x/week for 2 weeks, then 2x/week. Continue therapeutic exercise (97110), manual therapy (97140), and neuromuscular re-education (97112).',
    },
    {
      id: 'prev-2',
      type: 'PT Initial Evaluation',
      date: new Date('2025-12-15'),
      // Subjective fields
      chiefComplaint: 'Patient presents with acute lower back pain following work-related injury. Pain started 2 weeks ago after lifting heavy object. Pain is constant, 7/10, radiating to right leg. Aggravated by sitting and bending.',
      onsetDate: '2 weeks ago after lifting heavy object',
      typeOfInjury: 'acute',
      specificInjury: 'strain',
      surgeryDate: '2022-01-15',
      surgeryType: 'Lumbar fusion',
      occupation: 'Construction worker',
      // Goals
      goals: [
        { id: 'g1', text: 'Reduce pain from 7/10 to 3/10 within 4 weeks', type: 'short-term' as const },
        { id: 'g2', text: 'Improve functional mobility for ADLs', type: 'short-term' as const },
        { id: 'g3', text: 'Return to full work duties', type: 'long-term' as const },
        { id: 'g4', text: 'Prevent chronicity of condition', type: 'long-term' as const },
      ],
      // Assessment fields
      assessmentEntries: [
        { id: 'a1', text: 'Lumbar radiculopathy, likely L5-S1. Patient requires physical therapy intervention to address pain, improve function, and prevent chronicity.' },
      ],
      overallAssessment: 'Initial evaluation complete. Patient requires comprehensive PT intervention.',
      // Plan fields
      treatmentFrequency: '3x/week for 4 weeks',
      treatmentDuration: '6 weeks total',
      treatmentPlan: 'Initial treatment plan: 3x/week for 4 weeks. Focus on pain management, core strengthening, and functional mobility. Billing codes: 97110 (Therapeutic Exercise), 97140 (Manual Therapy), 97112 (Neuromuscular Re-education).',
    },
  ];
  const [observation, setObservation] = useState('');
  const [rangeOfMotion, setRangeOfMotion] = useState('');
  const [muscleTesting, setMuscleTesting] = useState('');
  const [specialTests, setSpecialTests] = useState('');
  const [neurologicalTesting, setNeurologicalTesting] = useState('');
  const [functionalTesting, setFunctionalTesting] = useState('');
  const [currentFunctionalLimitations, setCurrentFunctionalLimitations] = useState('');
  const [objectiveTreatments, setObjectiveTreatments] = useState<Treatment[]>([]);
  
  // New structured table entries
  const [aromEntries, setAROMEntries] = useState<ROMEntry[]>([]);
  const [promEntries, setPROMEntries] = useState<ROMEntry[]>([]);
  const [girthEntries, setGirthEntries] = useState<GirthEntry[]>([]);
  const [muscleTestingEntries, setMuscleTestingEntries] = useState<MuscleTestingEntry[]>([]);
  const [specialTestEntries, setSpecialTestEntries] = useState<SpecialTestEntry[]>([]);
  const [myotomeEntries, setMyotomeEntries] = useState<MyotomeEntry[]>([]);
  const [dermatomeEntries, setDermatomeEntries] = useState<DermatomeEntry[]>([]);
  const [reflexEntries, setReflexEntries] = useState<ReflexEntry[]>([]);
  const [assessmentEntries, setAssessmentEntries] = useState<Array<{ id: string; text: string }>>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemComments, setProblemComments] = useState('');
  const [goals, setGoals] = useState<Array<{ id: string; text: string; type?: 'short-term' | 'long-term' }>>([]);
  const [comments, setComments] = useState('');
  const [potentialToReachGoals, setPotentialToReachGoals] = useState('');
  const [overallAssessment, setOverallAssessment] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [recommendPT, setRecommendPT] = useState(false);
  const [otherRecommendations, setOtherRecommendations] = useState<Array<{ id: string; text: string; frequency?: string; duration?: string }>>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [billingCharges, setBillingCharges] = useState<Array<{ code: string; description: string; units: number; time: number }>>([]);
  const [isPhrasesOpen, setIsPhrasesOpen] = useState(false);
  const [activeTextAreaId, setActiveTextAreaId] = useState<string | null>(null);

  // PT Initial Evaluation specific state
  const [depressionScreening, setDepressionScreening] = useState<DepressionScreeningData>({});
  const [socialDriversScreening, setSocialDriversScreening] = useState<SocialDriversScreeningData>({});
  const [elderMaltreatmentScreening, setElderMaltreatmentScreening] = useState<ElderMaltreatmentScreeningData>({});
  const [fallsScreening, setFallsScreening] = useState<FallsScreeningData>({});
  const [bmiScreening, setBmiScreening] = useState<BMIScreeningData>({});
  const [urinaryIncontinenceScreening, setUrinaryIncontinenceScreening] = useState<UrinaryIncontinenceScreeningData>({});
  const [dementiaScreening, setDementiaScreening] = useState<DementiaScreeningData>({});
  const [diabetesScreening, setDiabetesScreening] = useState<DiabetesScreeningData>({});
  const [surgeryHistory, setSurgeryHistory] = useState<SurgeryEntry[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [painAreas, setPainAreas] = useState<PainArea[]>([]);
  const [painDescriptions, setPainDescriptions] = useState<PainDescription[]>([]);
  const [painHistoryComments, setPainHistoryComments] = useState('');
  const [functionalActivities, setFunctionalActivities] = useState<FunctionalActivity[]>([]);
  const [functionalRestrictions, setFunctionalRestrictions] = useState('');
  const [lastDateWorked, setLastDateWorked] = useState('');
  const [functionalComments, setFunctionalComments] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>('current-condition');

  // Listen for textarea focus events
  React.useEffect(() => {
    const handleSetActiveTextArea = (e: CustomEvent) => {
      setActiveTextAreaId(e.detail);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('setActiveTextArea' as any, handleSetActiveTextArea as EventListener);
      return () => {
        window.removeEventListener('setActiveTextArea' as any, handleSetActiveTextArea as EventListener);
      };
    }
  }, []);

  const activeCase = mockPatient.cases[0];

  const handleInsertPhrase = (phrase: string) => {
    if (activeTextAreaId) {
      const textarea = document.getElementById(activeTextAreaId) as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;
        const newValue = currentValue.substring(0, start) + phrase + currentValue.substring(end);
        
        // Update the appropriate state based on textarea ID
        if (activeTextAreaId === 'chief-complaint') {
          setChiefComplaint(newValue);
        } else if (activeTextAreaId === 'treatment-plan') {
          setTreatmentPlan(newValue);
        } else if (activeTextAreaId === 'observation') {
          setObservation(newValue);
        } else if (activeTextAreaId === 'comments') {
          setComments(newValue);
        } else if (activeTextAreaId === 'range-of-motion') {
          setRangeOfMotion(newValue);
        } else if (activeTextAreaId === 'muscle-testing') {
          setMuscleTesting(newValue);
        } else if (activeTextAreaId === 'special-tests') {
          setSpecialTests(newValue);
        } else if (activeTextAreaId === 'neurological-testing') {
          setNeurologicalTesting(newValue);
        } else if (activeTextAreaId === 'functional-testing') {
          setFunctionalTesting(newValue);
        }
        
        // Set cursor position after inserted text
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + phrase.length, start + phrase.length);
        }, 0);
      }
    }
  };

  const handleCreateGoal = (text: string) => {
    const newGoal = {
      id: Date.now().toString(),
      text: text || 'New goal',
      type: 'short-term' as const,
    };
    setGoals([...goals, newGoal]);
    // Navigate to Goals section or show notification
    setActiveSection('goals');
  };

  const handleCopyToColumn = (text: string, target: 'plan' | 'goals') => {
    if (target === 'plan') {
      // Copy to treatment plan
      setTreatmentPlan(treatmentPlan + (treatmentPlan ? '\n\n' : '') + text);
      setActiveSection('plan');
    } else if (target === 'goals') {
      // Create a goal from the text
      handleCreateGoal(text);
    }
  };

  const handleSave = () => {
    // Calculate billing totals
    const totalUnits = billingCharges.reduce((sum, charge) => sum + charge.units, 0);
    const totalTime = billingCharges.reduce((sum, charge) => sum + charge.time, 0);

    // Save document logic
    const documentData = {
      documentType,
      entryDate,
      timeIn,
      timeOut,
      vitals,
      chiefComplaint,
      // Billing data
      billing: billingCharges.length > 0 ? {
        codes: billingCharges,
        totalUnits,
        totalTime,
      } : undefined,
      // ... other fields
    };
    
    console.log('Saving document...', documentData);
    // TODO: Implement actual save API call
    // Navigate back or show success message
  };

  return (
    <div className="min-h-screen bg-cairos-bg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Patients', href: '/patients' },
          { label: mockPatient.name, href: `/patients/${mockPatient.id}` },
          { label: displayType }
        ]} />

        {isDailyNote ? (
          <>
            {/* Context Header */}
            <DocumentEditorHeader
              patient={mockPatient}
              activeCase={activeCase}
              entryDate={entryDate}
              timeIn={timeIn}
              timeOut={timeOut}
              onDateChange={setEntryDate}
              onTimeInChange={setTimeIn}
              onTimeOutChange={setTimeOut}
              vitals={vitals}
              onVitalsChange={setVitals}
            />

            {/* SOAP Sections */}
            <div className="space-y-4">
              <SubjectiveSection
                chiefComplaint={chiefComplaint}
                onsetDate={onsetDate}
                typeOfInjury={typeOfInjury}
                specificInjury={specificInjury}
                surgeryDate={surgeryDate}
                surgeryType={surgeryType}
                occupation={occupation}
                treatmentsRelated={treatmentsRelated}
                previousDocuments={previousDocuments}
                onChiefComplaintChange={setChiefComplaint}
                onOnsetDateChange={setOnsetDate}
                onTypeOfInjuryChange={setTypeOfInjury}
                onSpecificInjuryChange={setSpecificInjury}
                onSurgeryDateChange={setSurgeryDate}
                onSurgeryTypeChange={setSurgeryType}
                onOccupationChange={setOccupation}
                onTreatmentsRelatedChange={setTreatmentsRelated}
                onCreateGoal={handleCreateGoal}
              />

              <ObjectiveSection
                observation={observation}
                rangeOfMotion={rangeOfMotion}
                muscleTesting={muscleTesting}
                specialTests={specialTests}
                neurologicalTesting={neurologicalTesting}
                functionalTesting={functionalTesting}
                currentFunctionalLimitations={currentFunctionalLimitations}
                objectiveTreatments={objectiveTreatments}
                onObservationChange={setObservation}
                onRangeOfMotionChange={setRangeOfMotion}
                onMuscleTestingChange={setMuscleTesting}
                onSpecialTestsChange={setSpecialTests}
                onNeurologicalTestingChange={setNeurologicalTesting}
                onFunctionalTestingChange={setFunctionalTesting}
                onCurrentFunctionalLimitationsChange={setCurrentFunctionalLimitations}
                onObjectiveTreatmentsChange={setObjectiveTreatments}
                // Structured table entries
                aromEntries={aromEntries}
                promEntries={promEntries}
                girthEntries={girthEntries}
                muscleTestingEntries={muscleTestingEntries}
                specialTestEntries={specialTestEntries}
                myotomeEntries={myotomeEntries}
                dermatomeEntries={dermatomeEntries}
                reflexEntries={reflexEntries}
                onAROMEntriesChange={setAROMEntries}
                onPROMEntriesChange={setPROMEntries}
                onGirthEntriesChange={setGirthEntries}
                onMuscleTestingEntriesChange={setMuscleTestingEntries}
                onSpecialTestEntriesChange={setSpecialTestEntries}
                onMyotomeEntriesChange={setMyotomeEntries}
                onDermatomeEntriesChange={setDermatomeEntries}
                onReflexEntriesChange={setReflexEntries}
              />

              <GoalsSection
                goals={goals}
                onGoalsChange={setGoals}
                isVisible={true}
                previousDocuments={previousDocuments}
              />

              <AssessmentSection
                assessmentEntries={assessmentEntries}
                problems={problems}
                comments={comments}
                problemComments={problemComments}
                potentialToReachGoals={potentialToReachGoals}
                overallAssessment={overallAssessment}
                previousDocuments={previousDocuments}
                onAssessmentEntriesChange={setAssessmentEntries}
                onProblemsChange={setProblems}
                onCommentsChange={setComments}
                onProblemCommentsChange={setProblemComments}
                onPotentialToReachGoalsChange={setPotentialToReachGoals}
                onOverallAssessmentChange={setOverallAssessment}
                onCreateGoal={handleCreateGoal}
                onCopyToColumn={handleCopyToColumn}
              />

          <PlanSection
            treatmentPlan={treatmentPlan}
            frequency={frequency}
            duration={duration}
            recommendPT={recommendPT}
            otherRecommendations={otherRecommendations}
            goals={goals}
            assessmentEntries={assessmentEntries}
            objectiveTreatments={objectiveTreatments}
            currentFunctionalLimitations={currentFunctionalLimitations}
            previousDocuments={previousDocuments}
            onTreatmentPlanChange={setTreatmentPlan}
            onFrequencyChange={setFrequency}
            onDurationChange={setDuration}
            onRecommendPTChange={setRecommendPT}
            onOtherRecommendationsChange={setOtherRecommendations}
          />

              {showBilling && (
                <BillingSection
                  objectiveTreatments={objectiveTreatments}
                  renderingProvider={mockPatient.name} // TODO: Get actual provider from document/case
                  primaryDiagnosis={mockPatient.diagnosis || 'N/A'}
                  placeOfService="11"
                  typeOfService="01"
                  timeIn={timeIn}
                  timeOut={timeOut}
                  onChargesChange={setBillingCharges}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-cairos-border">
              <Button
                variant="cancel"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsPhrasesOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  Common Phrases
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  Save Document
                </Button>
              </div>
            </div>
          </>
        ) : isInitialEvaluation ? (
          <div className="flex">
            {/* Document Navigator Sidebar */}
            <DocumentNavigator
              patient={mockPatient}
              activeCase={activeCase}
              entryDate={entryDate}
              timeIn={timeIn}
              timeOut={timeOut}
              vitals={vitals}
              subjectiveSections={[
                { id: 'current-condition', label: 'Current Condition', completed: !!chiefComplaint },
                { id: 'depression', label: 'Depression', completed: !!depressionScreening.screeningPerformed },
                { id: 'social-drivers', label: 'Social Drivers of Health', completed: !!socialDriversScreening.screeningPerformed },
                { id: 'elder-maltreatment', label: 'Elder Maltreatment', completed: !!elderMaltreatmentScreening.screeningPerformed },
                { id: 'falls', label: 'Falls', completed: !!fallsScreening.hasFallsHistory },
                { id: 'bmi', label: 'BMI', completed: !!(bmiScreening.height && bmiScreening.weight) },
                { id: 'urinary-incontinence', label: 'Urinary Incontinence', completed: !!urinaryIncontinenceScreening.screeningPerformed },
                { id: 'dementia', label: 'Dementia Assessment & Support', completed: !!dementiaScreening.assessmentPerformed },
                { id: 'diabetes', label: 'Diabetes', completed: !!diabetesScreening.hasDiabetes },
                { id: 'pain-history', label: 'Pain History', completed: painAreas.length > 0 || painDescriptions.length > 0 },
                { id: 'functional-status', label: 'Functional Status', completed: functionalActivities.length > 0 },
                { id: 'medical-history', label: 'Medical History', completed: surgeryHistory.length > 0 || medicalConditions.length > 0 || medications.length > 0 },
              ]}
              objectiveSections={[
                { id: 'observation', label: 'Observation', completed: !!observation || aromEntries.length > 0 || promEntries.length > 0 },
                { id: 'goals', label: 'Goals', completed: goals.length > 0 },
                { id: 'assessment', label: 'Assessment', completed: assessmentEntries.length > 0 },
                { id: 'plan', label: 'Plan', completed: !!treatmentPlan },
              ]}
              billingCompleted={billingCharges.length > 0}
              onSectionClick={(sectionId) => {
                setActiveSection(sectionId);
              }}
              onVitalsChange={setVitals}
              onTimeInChange={setTimeIn}
              onTimeOutChange={setTimeOut}
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <DocumentEditorHeader
                  patient={mockPatient}
                  activeCase={activeCase}
                  entryDate={entryDate}
                  timeIn={timeIn}
                  timeOut={timeOut}
                  onDateChange={setEntryDate}
                  onTimeInChange={setTimeIn}
                  onTimeOutChange={setTimeOut}
                  vitals={vitals}
                  onVitalsChange={setVitals}
                  stickyTop="top-0"
                />

                <div className="mt-6">
                  {activeSection === 'current-condition' && (
                    <SubjectiveSection
                      chiefComplaint={chiefComplaint}
                      onsetDate={onsetDate}
                      typeOfInjury={typeOfInjury}
                      specificInjury={specificInjury}
                      surgeryDate={surgeryDate}
                      surgeryType={surgeryType}
                      occupation={occupation}
                      treatmentsRelated={treatmentsRelated}
                      previousDocuments={previousDocuments}
                      documentType={isInitialEvaluation ? 'PT Initial Evaluation' : isDailyNote ? 'PT Daily Note' : undefined}
                      onChiefComplaintChange={setChiefComplaint}
                      onOnsetDateChange={setOnsetDate}
                      onTypeOfInjuryChange={setTypeOfInjury}
                      onSpecificInjuryChange={setSpecificInjury}
                      onSurgeryDateChange={setSurgeryDate}
                      onSurgeryTypeChange={setSurgeryType}
                      onOccupationChange={setOccupation}
                      onTreatmentsRelatedChange={setTreatmentsRelated}
                      onCreateGoal={handleCreateGoal}
                    />
                  )}

                  {activeSection === 'depression' && (
                    <DepressionScreening
                      data={depressionScreening}
                      onChange={setDepressionScreening}
                    />
                  )}

                  {activeSection === 'social-drivers' && (
                    <SocialDriversScreening
                      data={socialDriversScreening}
                      onChange={setSocialDriversScreening}
                    />
                  )}

                  {activeSection === 'elder-maltreatment' && (
                    <ElderMaltreatmentScreening
                      data={elderMaltreatmentScreening}
                      onChange={setElderMaltreatmentScreening}
                    />
                  )}

                  {activeSection === 'falls' && (
                    <FallsScreening
                      data={fallsScreening}
                      onChange={setFallsScreening}
                    />
                  )}

                  {activeSection === 'bmi' && (
                    <BMIScreening
                      data={bmiScreening}
                      onChange={setBmiScreening}
                    />
                  )}

                  {activeSection === 'urinary-incontinence' && (
                    <UrinaryIncontinenceScreening
                      data={urinaryIncontinenceScreening}
                      onChange={setUrinaryIncontinenceScreening}
                    />
                  )}

                  {activeSection === 'dementia' && (
                    <DementiaScreening
                      data={dementiaScreening}
                      onChange={setDementiaScreening}
                    />
                  )}

                  {activeSection === 'diabetes' && (
                    <DiabetesScreening
                      data={diabetesScreening}
                      onChange={setDiabetesScreening}
                    />
                  )}

                  {activeSection === 'pain-history' && (
                    <PainHistorySection
                      painAreas={painAreas}
                      painDescriptions={painDescriptions}
                      comments={painHistoryComments}
                      onPainAreasChange={setPainAreas}
                      onPainDescriptionsChange={setPainDescriptions}
                      onCommentsChange={setPainHistoryComments}
                    />
                  )}

                  {activeSection === 'functional-status' && (
                    <FunctionalStatusSection
                      activities={functionalActivities}
                      restrictions={functionalRestrictions}
                      lastDateWorked={lastDateWorked}
                      comments={functionalComments}
                      onActivitiesChange={setFunctionalActivities}
                      onRestrictionsChange={setFunctionalRestrictions}
                      onLastDateWorkedChange={setLastDateWorked}
                      onCommentsChange={setFunctionalComments}
                    />
                  )}

                  {activeSection === 'medical-history' && (
                    <MedicalHistorySection
                      surgeryHistory={surgeryHistory}
                      medicalConditions={medicalConditions}
                      medications={medications}
                      onSurgeryHistoryChange={setSurgeryHistory}
                      onMedicalConditionsChange={setMedicalConditions}
                      onMedicationsChange={setMedications}
                    />
                  )}

                  {activeSection === 'objective' && (
                    <ObjectiveSection
                      observation={observation}
                      rangeOfMotion={rangeOfMotion}
                      muscleTesting={muscleTesting}
                      specialTests={specialTests}
                      neurologicalTesting={neurologicalTesting}
                      functionalTesting={functionalTesting}
                      currentFunctionalLimitations={currentFunctionalLimitations}
                      objectiveTreatments={objectiveTreatments}
                      onObservationChange={setObservation}
                      onRangeOfMotionChange={setRangeOfMotion}
                      onMuscleTestingChange={setMuscleTesting}
                      onSpecialTestsChange={setSpecialTests}
                      onNeurologicalTestingChange={setNeurologicalTesting}
                      onFunctionalTestingChange={setFunctionalTesting}
                      onCurrentFunctionalLimitationsChange={setCurrentFunctionalLimitations}
                      onObjectiveTreatmentsChange={setObjectiveTreatments}
                      // New structured table entries
                      aromEntries={aromEntries}
                      promEntries={promEntries}
                      girthEntries={girthEntries}
                      muscleTestingEntries={muscleTestingEntries}
                      specialTestEntries={specialTestEntries}
                      myotomeEntries={myotomeEntries}
                      dermatomeEntries={dermatomeEntries}
                      reflexEntries={reflexEntries}
                      onAROMEntriesChange={setAROMEntries}
                      onPROMEntriesChange={setPROMEntries}
                      onGirthEntriesChange={setGirthEntries}
                      onMuscleTestingEntriesChange={setMuscleTestingEntries}
                      onSpecialTestEntriesChange={setSpecialTestEntries}
                      onMyotomeEntriesChange={setMyotomeEntries}
                      onDermatomeEntriesChange={setDermatomeEntries}
                      onReflexEntriesChange={setReflexEntries}
                    />
                  )}

                  {activeSection === 'goals' && (
                    <GoalsSection
                      goals={goals}
                      onGoalsChange={setGoals}
                      isVisible={true}
                      previousDocuments={previousDocuments}
                    />
                  )}

                  {activeSection === 'assessment' && (
                    <AssessmentSection
                      assessmentEntries={assessmentEntries}
                      problems={problems}
                      comments={comments}
                      problemComments={problemComments}
                      potentialToReachGoals={potentialToReachGoals}
                      overallAssessment={overallAssessment}
                      previousDocuments={previousDocuments}
                      onAssessmentEntriesChange={setAssessmentEntries}
                      onProblemsChange={setProblems}
                      onCommentsChange={setComments}
                      onProblemCommentsChange={setProblemComments}
                      onPotentialToReachGoalsChange={setPotentialToReachGoals}
                      onOverallAssessmentChange={setOverallAssessment}
                      onCreateGoal={handleCreateGoal}
                      onCopyToColumn={handleCopyToColumn}
                    />
                  )}

                  {activeSection === 'plan' && (
                    <PlanSection
                      treatmentPlan={treatmentPlan}
                      frequency={frequency}
                      duration={duration}
                      recommendPT={recommendPT}
                      otherRecommendations={otherRecommendations}
                      goals={goals}
                      assessmentEntries={assessmentEntries}
                      objectiveTreatments={objectiveTreatments}
                      currentFunctionalLimitations={currentFunctionalLimitations}
                      previousDocuments={previousDocuments}
                      onTreatmentPlanChange={setTreatmentPlan}
                      onFrequencyChange={setFrequency}
                      onDurationChange={setDuration}
                      onRecommendPTChange={setRecommendPT}
                      onOtherRecommendationsChange={setOtherRecommendations}
                    />
                  )}

                  {activeSection === 'observation' && (
                    <ObjectiveSection
                      observation={observation}
                      rangeOfMotion={rangeOfMotion}
                      muscleTesting={muscleTesting}
                      specialTests={specialTests}
                      neurologicalTesting={neurologicalTesting}
                      functionalTesting={functionalTesting}
                      currentFunctionalLimitations={currentFunctionalLimitations}
                      objectiveTreatments={objectiveTreatments}
                      onObservationChange={setObservation}
                      onRangeOfMotionChange={setRangeOfMotion}
                      onMuscleTestingChange={setMuscleTesting}
                      onSpecialTestsChange={setSpecialTests}
                      onNeurologicalTestingChange={setNeurologicalTesting}
                      onFunctionalTestingChange={setFunctionalTesting}
                      onCurrentFunctionalLimitationsChange={setCurrentFunctionalLimitations}
                      onObjectiveTreatmentsChange={setObjectiveTreatments}
                      // New structured table entries
                      aromEntries={aromEntries}
                      promEntries={promEntries}
                      girthEntries={girthEntries}
                      muscleTestingEntries={muscleTestingEntries}
                      specialTestEntries={specialTestEntries}
                      myotomeEntries={myotomeEntries}
                      dermatomeEntries={dermatomeEntries}
                      reflexEntries={reflexEntries}
                      onAROMEntriesChange={setAROMEntries}
                      onPROMEntriesChange={setPROMEntries}
                      onGirthEntriesChange={setGirthEntries}
                      onMuscleTestingEntriesChange={setMuscleTestingEntries}
                      onSpecialTestEntriesChange={setSpecialTestEntries}
                      onMyotomeEntriesChange={setMyotomeEntries}
                      onDermatomeEntriesChange={setDermatomeEntries}
                      onReflexEntriesChange={setReflexEntries}
                    />
                  )}

                  {activeSection === 'billing' && showBilling && (
                    <BillingSection
                      objectiveTreatments={objectiveTreatments}
                      renderingProvider={mockPatient.name} // TODO: Get actual provider from document/case
                      primaryDiagnosis={mockPatient.diagnosis || 'N/A'}
                      placeOfService="11"
                      typeOfService="01"
                      timeIn={timeIn}
                      timeOut={timeOut}
                      onChargesChange={setBillingCharges}
                    />
                  )}

                  {!activeSection && (
                    <div className="text-center py-12">
                      <p className="text-body text-gray-600">Select a section from the sidebar to begin editing.</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-cairos-border">
                  <Button
                    variant="cancel"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsPhrasesOpen(true)}
                      className="flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Common Phrases
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      className="flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      Save Document
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-h2 mb-2 text-gray-900">Create {displayType}</h1>
            <p className="text-body text-gray-600 mb-6">
              Document editor for {documentType} will be implemented here.
            </p>
            <Button
              variant="cancel"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        )}
      </div>

      {/* Common Phrases Library */}
      <CommonPhrasesLibrary
        isOpen={isPhrasesOpen}
        onClose={() => setIsPhrasesOpen(false)}
        onInsertPhrase={handleInsertPhrase}
      />
    </div>
  );
}
