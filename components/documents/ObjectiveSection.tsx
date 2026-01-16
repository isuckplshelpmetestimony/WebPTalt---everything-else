'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp, CheckCircle2, Mic } from 'lucide-react';
import { TreatmentsTable } from './TreatmentsTable';
import { ROMTable, ROMEntry } from './tables/ROMTable';
import { MuscleTestingTable, MuscleTestingEntry } from './tables/MuscleTestingTable';
import { SpecialTestsTable, SpecialTestEntry } from './tables/SpecialTestsTable';
import { GirthTable, GirthEntry } from './tables/GirthTable';
import { MyotomesTable, MyotomeEntry } from './tables/MyotomesTable';
import { DermatomesTable, DermatomeEntry } from './tables/DermatomesTable';
import { ReflexesTable, ReflexEntry } from './tables/ReflexesTable';

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

interface ObjectiveSectionProps {
  observation: string;
  rangeOfMotion: string;
  muscleTesting: string;
  specialTests: string;
  neurologicalTesting: string;
  functionalTesting: string;
  currentFunctionalLimitations?: string;
  objectiveTreatments?: Treatment[];
  patientResponseToTreatment?: string;
  documentType?: 'PT Daily Note' | 'PT Initial Evaluation' | string;
  onObservationChange: (value: string) => void;
  onRangeOfMotionChange: (value: string) => void;
  onMuscleTestingChange: (value: string) => void;
  onSpecialTestsChange: (value: string) => void;
  onNeurologicalTestingChange: (value: string) => void;
  onFunctionalTestingChange: (value: string) => void;
  onCurrentFunctionalLimitationsChange?: (value: string) => void;
  onObjectiveTreatmentsChange?: (treatments: Treatment[]) => void;
  onPatientResponseToTreatmentChange?: (value: string) => void;
  // New structured data props
  aromEntries?: ROMEntry[];
  promEntries?: ROMEntry[];
  girthEntries?: GirthEntry[];
  muscleTestingEntries?: MuscleTestingEntry[];
  specialTestEntries?: SpecialTestEntry[];
  myotomeEntries?: MyotomeEntry[];
  dermatomeEntries?: DermatomeEntry[];
  reflexEntries?: ReflexEntry[];
  onAROMEntriesChange?: (entries: ROMEntry[]) => void;
  onPROMEntriesChange?: (entries: ROMEntry[]) => void;
  onGirthEntriesChange?: (entries: GirthEntry[]) => void;
  onMuscleTestingEntriesChange?: (entries: MuscleTestingEntry[]) => void;
  onSpecialTestEntriesChange?: (entries: SpecialTestEntry[]) => void;
  onMyotomeEntriesChange?: (entries: MyotomeEntry[]) => void;
  onDermatomeEntriesChange?: (entries: DermatomeEntry[]) => void;
  onReflexEntriesChange?: (entries: ReflexEntry[]) => void;
  // Mic recording props for subsections
  observationMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  aromMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  promMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  girthMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  muscleTestingMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  specialTestsMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  myotomesMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  dermatomesMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  reflexesMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  functionalTestingMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  currentFunctionalLimitationsMicProps?: {
    isRecording: boolean;
    isProcessing: boolean;
    isMicModeEnabled: boolean;
    onMicClick: () => void;
  };
  // Mic mode prompts for subsections
  observationMicPrompts?: React.ReactNode;
  aromMicPrompts?: React.ReactNode;
  promMicPrompts?: React.ReactNode;
  girthMicPrompts?: React.ReactNode;
  muscleTestingMicPrompts?: React.ReactNode;
  specialTestsMicPrompts?: React.ReactNode;
  myotomesMicPrompts?: React.ReactNode;
  dermatomesMicPrompts?: React.ReactNode;
  reflexesMicPrompts?: React.ReactNode;
  functionalTestingMicPrompts?: React.ReactNode;
  currentFunctionalLimitationsMicPrompts?: React.ReactNode;
}

export const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({
  observation,
  rangeOfMotion,
  muscleTesting,
  specialTests,
  neurologicalTesting,
  functionalTesting,
  currentFunctionalLimitations,
  objectiveTreatments = [],
  patientResponseToTreatment,
  documentType,
  onObservationChange,
  onRangeOfMotionChange,
  onMuscleTestingChange,
  onSpecialTestsChange,
  onNeurologicalTestingChange,
  onFunctionalTestingChange,
  onCurrentFunctionalLimitationsChange,
  onObjectiveTreatmentsChange,
  onPatientResponseToTreatmentChange,
  // New structured data
  aromEntries = [],
  promEntries = [],
  girthEntries = [],
  muscleTestingEntries = [],
  specialTestEntries = [],
  myotomeEntries = [],
  dermatomeEntries = [],
  reflexEntries = [],
  onAROMEntriesChange,
  onPROMEntriesChange,
  onGirthEntriesChange,
  onMuscleTestingEntriesChange,
  onSpecialTestEntriesChange,
  onMyotomeEntriesChange,
  onDermatomeEntriesChange,
  onReflexEntriesChange,
  // Mic props
  observationMicProps,
  aromMicProps,
  promMicProps,
  girthMicProps,
  muscleTestingMicProps,
  specialTestsMicProps,
  myotomesMicProps,
  dermatomesMicProps,
  reflexesMicProps,
  functionalTestingMicProps,
  currentFunctionalLimitationsMicProps,
  // Mic prompts
  observationMicPrompts,
  aromMicPrompts,
  promMicPrompts,
  girthMicPrompts,
  muscleTestingMicPrompts,
  specialTestsMicPrompts,
  myotomesMicPrompts,
  dermatomesMicPrompts,
  reflexesMicPrompts,
  functionalTestingMicPrompts,
  currentFunctionalLimitationsMicPrompts,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [neurologicalExpanded, setNeurologicalExpanded] = useState(true);
  
  const isDailyNote = documentType === 'PT Daily Note';
  
  const isComplete = observation.trim().length > 0 || 
    aromEntries.length > 0 || 
    promEntries.length > 0 || 
    objectiveTreatments.length > 0;

  const handleAddTreatment = () => {
    if (!onObjectiveTreatmentsChange) return;
    const newTreatment: Treatment = {
      id: Date.now().toString(),
      status: 'performed',
      cptCode: '97110',
      description: '',
      totalMinutes: 15,
      isHEP: false,
      justification: '',
    };
    onObjectiveTreatmentsChange([...objectiveTreatments, newTreatment]);
  };

  const handleUpdateTreatment = (id: string, updates: Partial<Treatment>) => {
    if (!onObjectiveTreatmentsChange) return;
    onObjectiveTreatmentsChange(
      objectiveTreatments.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const handleDeleteTreatment = (id: string) => {
    if (!onObjectiveTreatmentsChange) return;
    onObjectiveTreatmentsChange(objectiveTreatments.filter(t => t.id !== id));
  };

  // AROM handlers
  const handleAddAROM = () => {
    if (!onAROMEntriesChange) return;
    const newEntry: ROMEntry = {
      id: Date.now().toString(),
      motion: '',
      right: '',
      left: '',
      units: 'degrees',
    };
    onAROMEntriesChange([...aromEntries, newEntry]);
  };

  const handleUpdateAROM = (id: string, updates: Partial<ROMEntry>) => {
    if (!onAROMEntriesChange) return;
    onAROMEntriesChange(aromEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteAROM = (id: string) => {
    if (!onAROMEntriesChange) return;
    onAROMEntriesChange(aromEntries.filter(e => e.id !== id));
  };

  const handleCopyAROMToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = aromEntries.find(e => e.id === id);
    if (!entry || !onAROMEntriesChange) return;
    const updates: Partial<ROMEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.left = entry.right;
      updates.leftGrossStrength = entry.rightGrossStrength;
    } else {
      updates.right = entry.left;
      updates.rightGrossStrength = entry.leftGrossStrength;
    }
    handleUpdateAROM(id, updates);
  };

  // PROM handlers
  const handleAddPROM = () => {
    if (!onPROMEntriesChange) return;
    const newEntry: ROMEntry = {
      id: Date.now().toString(),
      motion: '',
      right: '',
      left: '',
      units: 'degrees',
    };
    onPROMEntriesChange([...promEntries, newEntry]);
  };

  const handleUpdatePROM = (id: string, updates: Partial<ROMEntry>) => {
    if (!onPROMEntriesChange) return;
    onPROMEntriesChange(promEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeletePROM = (id: string) => {
    if (!onPROMEntriesChange) return;
    onPROMEntriesChange(promEntries.filter(e => e.id !== id));
  };

  const handleCopyPROMToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = promEntries.find(e => e.id === id);
    if (!entry || !onPROMEntriesChange) return;
    const updates: Partial<ROMEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.left = entry.right;
      updates.leftGrossStrength = entry.rightGrossStrength;
    } else {
      updates.right = entry.left;
      updates.rightGrossStrength = entry.leftGrossStrength;
    }
    handleUpdatePROM(id, updates);
  };

  // Girth handlers
  const handleAddGirth = () => {
    if (!onGirthEntriesChange) return;
    const newEntry: GirthEntry = {
      id: Date.now().toString(),
      measurement: '',
      left: '',
      right: '',
      units: 'inches',
    };
    onGirthEntriesChange([...girthEntries, newEntry]);
  };

  const handleUpdateGirth = (id: string, updates: Partial<GirthEntry>) => {
    if (!onGirthEntriesChange) return;
    onGirthEntriesChange(girthEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteGirth = (id: string) => {
    if (!onGirthEntriesChange) return;
    onGirthEntriesChange(girthEntries.filter(e => e.id !== id));
  };

  const handleCopyGirthToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = girthEntries.find(e => e.id === id);
    if (!entry || !onGirthEntriesChange) return;
    const updates: Partial<GirthEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.left = entry.right;
    } else {
      updates.right = entry.left;
    }
    handleUpdateGirth(id, updates);
  };

  // Muscle Testing handlers
  const handleAddMuscleTesting = () => {
    if (!onMuscleTestingEntriesChange) return;
    const newEntry: MuscleTestingEntry = {
      id: Date.now().toString(),
      muscle: '',
    };
    onMuscleTestingEntriesChange([...muscleTestingEntries, newEntry]);
  };

  const handleUpdateMuscleTesting = (id: string, updates: Partial<MuscleTestingEntry>) => {
    if (!onMuscleTestingEntriesChange) return;
    onMuscleTestingEntriesChange(muscleTestingEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteMuscleTesting = (id: string) => {
    if (!onMuscleTestingEntriesChange) return;
    onMuscleTestingEntriesChange(muscleTestingEntries.filter(e => e.id !== id));
  };

  const handleCopyMuscleTestingToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = muscleTestingEntries.find(e => e.id === id);
    if (!entry || !onMuscleTestingEntriesChange) return;
    const updates: Partial<MuscleTestingEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.leftGrade = entry.rightGrade;
    } else {
      updates.rightGrade = entry.leftGrade;
    }
    handleUpdateMuscleTesting(id, updates);
  };

  // Special Tests handlers
  const handleAddSpecialTest = () => {
    if (!onSpecialTestEntriesChange) return;
    const newEntry: SpecialTestEntry = {
      id: Date.now().toString(),
      testName: '',
    };
    onSpecialTestEntriesChange([...specialTestEntries, newEntry]);
  };

  const handleUpdateSpecialTest = (id: string, updates: Partial<SpecialTestEntry>) => {
    if (!onSpecialTestEntriesChange) return;
    onSpecialTestEntriesChange(specialTestEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteSpecialTest = (id: string) => {
    if (!onSpecialTestEntriesChange) return;
    onSpecialTestEntriesChange(specialTestEntries.filter(e => e.id !== id));
  };

  const handleCopySpecialTestToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = specialTestEntries.find(e => e.id === id);
    if (!entry || !onSpecialTestEntriesChange) return;
    const updates: Partial<SpecialTestEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.leftResult = entry.rightResult;
    } else {
      updates.rightResult = entry.leftResult;
    }
    handleUpdateSpecialTest(id, updates);
  };

  // Myotomes handlers
  const handleAddMyotome = () => {
    if (!onMyotomeEntriesChange) return;
    const newEntry: MyotomeEntry = {
      id: Date.now().toString(),
      myotome: '',
    };
    onMyotomeEntriesChange([...myotomeEntries, newEntry]);
  };

  const handleUpdateMyotome = (id: string, updates: Partial<MyotomeEntry>) => {
    if (!onMyotomeEntriesChange) return;
    onMyotomeEntriesChange(myotomeEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteMyotome = (id: string) => {
    if (!onMyotomeEntriesChange) return;
    onMyotomeEntriesChange(myotomeEntries.filter(e => e.id !== id));
  };

  const handleCopyMyotomeToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = myotomeEntries.find(e => e.id === id);
    if (!entry || !onMyotomeEntriesChange) return;
    const updates: Partial<MyotomeEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.leftGrade = entry.rightGrade;
    } else {
      updates.rightGrade = entry.leftGrade;
    }
    handleUpdateMyotome(id, updates);
  };

  // Dermatomes handlers
  const handleAddDermatome = () => {
    if (!onDermatomeEntriesChange) return;
    const newEntry: DermatomeEntry = {
      id: Date.now().toString(),
      dermatome: '',
    };
    onDermatomeEntriesChange([...dermatomeEntries, newEntry]);
  };

  const handleUpdateDermatome = (id: string, updates: Partial<DermatomeEntry>) => {
    if (!onDermatomeEntriesChange) return;
    onDermatomeEntriesChange(dermatomeEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteDermatome = (id: string) => {
    if (!onDermatomeEntriesChange) return;
    onDermatomeEntriesChange(dermatomeEntries.filter(e => e.id !== id));
  };

  const handleCopyDermatomeToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = dermatomeEntries.find(e => e.id === id);
    if (!entry || !onDermatomeEntriesChange) return;
    const updates: Partial<DermatomeEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.leftSensation = entry.rightSensation;
    } else {
      updates.rightSensation = entry.leftSensation;
    }
    handleUpdateDermatome(id, updates);
  };

  // Reflexes handlers
  const handleAddReflex = () => {
    if (!onReflexEntriesChange) return;
    const newEntry: ReflexEntry = {
      id: Date.now().toString(),
      reflexName: '',
    };
    onReflexEntriesChange([...reflexEntries, newEntry]);
  };

  const handleUpdateReflex = (id: string, updates: Partial<ReflexEntry>) => {
    if (!onReflexEntriesChange) return;
    onReflexEntriesChange(reflexEntries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteReflex = (id: string) => {
    if (!onReflexEntriesChange) return;
    onReflexEntriesChange(reflexEntries.filter(e => e.id !== id));
  };

  const handleCopyReflexToColumn = (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => {
    const entry = reflexEntries.find(e => e.id === id);
    if (!entry || !onReflexEntriesChange) return;
    const updates: Partial<ReflexEntry> = {};
    if (fromSide === 'right' && toSide === 'left') {
      updates.leftResult = entry.rightResult;
    } else {
      updates.rightResult = entry.leftResult;
    }
    handleUpdateReflex(id, updates);
  };

  return (
    <Card className="p-5 mb-4">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <h3 className="text-h3 text-gray-900">Objective</h3>
          {isComplete && (
            <CheckCircle2 className="w-4 h-4 text-cairos-success" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-cairos-border">
          {/* Observation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-body-sm font-medium text-gray-700">
                Observation (Posture, Gait, Palpation)
              </label>
              {observationMicProps && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    observationMicProps.onMicClick();
                  }}
                  disabled={observationMicProps.isProcessing}
                  className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                    observationMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={observationMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {observationMicProps.isProcessing ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mic className={`w-5 h-5 ${
                      observationMicProps.isRecording 
                        ? 'text-red-600 animate-pulse' 
                        : observationMicProps.isMicModeEnabled 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                    }`} />
                  )}
                </button>
              )}
            </div>
            {observationMicPrompts ? (
              <div>
                {observationMicPrompts}
              </div>
            ) : (
            <textarea
              id="observation"
              value={observation}
              onChange={(e) => onObservationChange(e.target.value)}
              onFocus={() => {
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('setActiveTextArea', { detail: 'observation' });
                  window.dispatchEvent(event);
                }
              }}
              placeholder="Describe posture, gait patterns, and palpation findings..."
              className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[100px] resize-y"
            />
            )}
          </div>

          {/* General Section */}
          <div className="border border-cairos-border rounded-xl p-4">
            <button
              onClick={() => setGeneralExpanded(!generalExpanded)}
              className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <h4 className="text-body-sm font-semibold text-gray-700">General</h4>
              {generalExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {generalExpanded && (
              <div className="space-y-6">
                {/* AROM */}
                {onAROMEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">AROM</h5>
                      {aromMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            aromMicProps.onMicClick();
                          }}
                          disabled={aromMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            aromMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={aromMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {aromMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              aromMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : aromMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {aromMicPrompts ? (
                      <div className="mb-4">
                        {aromMicPrompts}
                      </div>
                    ) : (
                    <ROMTable
                    title="AROM"
                    entries={aromEntries}
                    onAddEntry={handleAddAROM}
                    onUpdateEntry={handleUpdateAROM}
                      onDeleteEntry={handleDeleteAROM}
                      onCopyToColumn={handleCopyAROMToColumn}
                    />
                    )}
                  </div>
                )}

                {/* PROM */}
                {onPROMEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">PROM</h5>
                      {promMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            promMicProps.onMicClick();
                          }}
                          disabled={promMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            promMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={promMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {promMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              promMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : promMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {promMicPrompts ? (
                      <div className="mb-4">
                        {promMicPrompts}
                      </div>
                    ) : (
                    <ROMTable
                    title="PROM"
                    entries={promEntries}
                    onAddEntry={handleAddPROM}
                    onUpdateEntry={handleUpdatePROM}
                      onDeleteEntry={handleDeletePROM}
                      onCopyToColumn={handleCopyPROMToColumn}
                    />
                    )}
                  </div>
                )}

                {/* Girth */}
                {onGirthEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">Girth</h5>
                      {girthMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            girthMicProps.onMicClick();
                          }}
                          disabled={girthMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            girthMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={girthMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {girthMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              girthMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : girthMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {girthMicPrompts ? (
                      <div className="mb-4">
                        {girthMicPrompts}
                      </div>
                    ) : (
                    <GirthTable
                    entries={girthEntries}
                    onAddEntry={handleAddGirth}
                    onUpdateEntry={handleUpdateGirth}
                      onDeleteEntry={handleDeleteGirth}
                      onCopyToColumn={handleCopyGirthToColumn}
                    />
                    )}
                  </div>
                )}

                {/* Muscle Testing */}
                {onMuscleTestingEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">Muscle Testing</h5>
                      {muscleTestingMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            muscleTestingMicProps.onMicClick();
                          }}
                          disabled={muscleTestingMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            muscleTestingMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={muscleTestingMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {muscleTestingMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              muscleTestingMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : muscleTestingMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {muscleTestingMicPrompts ? (
                      <div className="mb-4">
                        {muscleTestingMicPrompts}
                      </div>
                    ) : (
                    <MuscleTestingTable
                    entries={muscleTestingEntries}
                    onAddEntry={handleAddMuscleTesting}
                    onUpdateEntry={handleUpdateMuscleTesting}
                      onDeleteEntry={handleDeleteMuscleTesting}
                      onCopyToColumn={handleCopyMuscleTestingToColumn}
                    />
                    )}
                  </div>
                )}

                {/* Special Tests */}
                {onSpecialTestEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">Special Tests</h5>
                      {specialTestsMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            specialTestsMicProps.onMicClick();
                          }}
                          disabled={specialTestsMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            specialTestsMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={specialTestsMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {specialTestsMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              specialTestsMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : specialTestsMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {specialTestsMicPrompts ? (
                      <div className="mb-4">
                        {specialTestsMicPrompts}
                      </div>
                    ) : (
                    <SpecialTestsTable
                    entries={specialTestEntries}
                    onAddEntry={handleAddSpecialTest}
                    onUpdateEntry={handleUpdateSpecialTest}
                      onDeleteEntry={handleDeleteSpecialTest}
                      onCopyToColumn={handleCopySpecialTestToColumn}
                    />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Neurological Section */}
          <div className="border border-cairos-border rounded-xl p-4">
            <button
              onClick={() => setNeurologicalExpanded(!neurologicalExpanded)}
              className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <h4 className="text-body-sm font-semibold text-gray-700">Neurological</h4>
              {neurologicalExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {neurologicalExpanded && (
              <div className="space-y-6">
                {/* Myotomes */}
                {onMyotomeEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">Myotomes</h5>
                      {myotomesMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            myotomesMicProps.onMicClick();
                          }}
                          disabled={myotomesMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            myotomesMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={myotomesMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {myotomesMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              myotomesMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : myotomesMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {myotomesMicPrompts ? (
                      <div className="mb-4">
                        {myotomesMicPrompts}
                      </div>
                    ) : (
                    <MyotomesTable
                    entries={myotomeEntries}
                    onAddEntry={handleAddMyotome}
                    onUpdateEntry={handleUpdateMyotome}
                      onDeleteEntry={handleDeleteMyotome}
                      onCopyToColumn={handleCopyMyotomeToColumn}
                    />
                    )}
                  </div>
                )}

                {/* Dermatomes */}
                {onDermatomeEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">Dermatomes</h5>
                      {dermatomesMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            dermatomesMicProps.onMicClick();
                          }}
                          disabled={dermatomesMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            dermatomesMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={dermatomesMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {dermatomesMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              dermatomesMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : dermatomesMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {dermatomesMicPrompts ? (
                      <div className="mb-4">
                        {dermatomesMicPrompts}
                      </div>
                    ) : (
                    <DermatomesTable
                    entries={dermatomeEntries}
                    onAddEntry={handleAddDermatome}
                    onUpdateEntry={handleUpdateDermatome}
                      onDeleteEntry={handleDeleteDermatome}
                      onCopyToColumn={handleCopyDermatomeToColumn}
                    />
                    )}
                  </div>
                )}

                {/* Reflexes */}
                {onReflexEntriesChange && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-body-sm font-medium text-gray-700">Reflexes</h5>
                      {reflexesMicProps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            reflexesMicProps.onMicClick();
                          }}
                          disabled={reflexesMicProps.isProcessing}
                          className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                            reflexesMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={reflexesMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                        >
                          {reflexesMicProps.isProcessing ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mic className={`w-5 h-5 ${
                              reflexesMicProps.isRecording 
                                ? 'text-red-600 animate-pulse' 
                                : reflexesMicProps.isMicModeEnabled 
                                  ? 'text-green-600' 
                                  : 'text-gray-400'
                            }`} />
                          )}
                        </button>
                      )}
                    </div>
                    {reflexesMicPrompts ? (
                      <div className="mb-4">
                        {reflexesMicPrompts}
                      </div>
                    ) : (
                    <ReflexesTable
                    entries={reflexEntries}
                    onAddEntry={handleAddReflex}
                    onUpdateEntry={handleUpdateReflex}
                      onDeleteEntry={handleDeleteReflex}
                      onCopyToColumn={handleCopyReflexToColumn}
                    />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Functional Testing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-body-sm font-medium text-gray-700">
                Functional Testing (LEFS, DASH, Sit-Stand, etc.)
              </label>
              {functionalTestingMicProps && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    functionalTestingMicProps.onMicClick();
                  }}
                  disabled={functionalTestingMicProps.isProcessing}
                  className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                    functionalTestingMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={functionalTestingMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {functionalTestingMicProps.isProcessing ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mic className={`w-5 h-5 ${
                      functionalTestingMicProps.isRecording 
                        ? 'text-red-600 animate-pulse' 
                        : functionalTestingMicProps.isMicModeEnabled 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                    }`} />
                  )}
                </button>
              )}
            </div>
            {functionalTestingMicPrompts ? (
              <div>
                {functionalTestingMicPrompts}
              </div>
            ) : (
            <textarea
              value={functionalTesting}
              onChange={(e) => onFunctionalTestingChange(e.target.value)}
              placeholder="Document functional assessment results and scores..."
              className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[80px] resize-y"
            />
            )}
          </div>

          {/* Current Functional Limitations */}
          {onCurrentFunctionalLimitationsChange && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-body-sm font-medium text-gray-700">
                  Current Functional Limitations
                </label>
                {currentFunctionalLimitationsMicProps && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      currentFunctionalLimitationsMicProps.onMicClick();
                    }}
                    disabled={currentFunctionalLimitationsMicProps.isProcessing}
                    className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                      currentFunctionalLimitationsMicProps.isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label={currentFunctionalLimitationsMicProps.isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    {currentFunctionalLimitationsMicProps.isProcessing ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Mic className={`w-5 h-5 ${
                        currentFunctionalLimitationsMicProps.isRecording 
                          ? 'text-red-600 animate-pulse' 
                          : currentFunctionalLimitationsMicProps.isMicModeEnabled 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                      }`} />
                    )}
                  </button>
                )}
              </div>
              {currentFunctionalLimitationsMicPrompts ? (
                <div>
                  {currentFunctionalLimitationsMicPrompts}
                </div>
              ) : (
              <textarea
                value={currentFunctionalLimitations || ''}
                onChange={(e) => onCurrentFunctionalLimitationsChange(e.target.value)}
                placeholder="Document current functional limitations affecting daily activities..."
                className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[100px] resize-y"
              />
              )}
            </div>
          )}

          {/* Objective Treatments Table */}
          {onObjectiveTreatmentsChange && (
            <div className="pt-4 border-t border-cairos-border">
              <TreatmentsTable
                treatments={objectiveTreatments}
                onAddTreatment={handleAddTreatment}
                onUpdateTreatment={handleUpdateTreatment}
                onDeleteTreatment={handleDeleteTreatment}
                documentType={documentType}
              />
            </div>
          )}

          {/* Patient Response to Treatment - Daily Note Only */}
          {isDailyNote && onPatientResponseToTreatmentChange && (
            <div className="pt-4 border-t border-cairos-border">
              <label className="block text-body-sm font-medium text-gray-700 mb-2">
                Patient Response to Treatment
              </label>
              <textarea
                value={patientResponseToTreatment || ''}
                onChange={(e) => onPatientResponseToTreatmentChange(e.target.value)}
                placeholder="How did the patient respond? Any modifications needed? This feeds directly into Assessment section."
                className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[100px] resize-y"
              />
              <p className="mt-1 text-body-xs text-gray-500 italic">
                Document patient's response to treatments performed. This information will be used in the Assessment section.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
