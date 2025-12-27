'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
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
  onObservationChange: (value: string) => void;
  onRangeOfMotionChange: (value: string) => void;
  onMuscleTestingChange: (value: string) => void;
  onSpecialTestsChange: (value: string) => void;
  onNeurologicalTestingChange: (value: string) => void;
  onFunctionalTestingChange: (value: string) => void;
  onCurrentFunctionalLimitationsChange?: (value: string) => void;
  onObjectiveTreatmentsChange?: (treatments: Treatment[]) => void;
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
  onObservationChange,
  onRangeOfMotionChange,
  onMuscleTestingChange,
  onSpecialTestsChange,
  onNeurologicalTestingChange,
  onFunctionalTestingChange,
  onCurrentFunctionalLimitationsChange,
  onObjectiveTreatmentsChange,
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
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [neurologicalExpanded, setNeurologicalExpanded] = useState(true);
  
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
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-gray-900">Objective</h3>
          {isComplete && (
            <CheckCircle2 className="w-4 h-4 text-cairos-success" />
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-cairos-border">
          {/* Observation */}
          <div>
            <label className="block text-body-sm font-medium text-gray-700 mb-2">
              Observation (Posture, Gait, Palpation)
            </label>
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
          </div>

          {/* General Section */}
          <div className="border border-cairos-border rounded-xl p-4">
            <button
              onClick={() => setGeneralExpanded(!generalExpanded)}
              className="w-full flex items-center justify-between mb-4"
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
                  <ROMTable
                    title="AROM"
                    entries={aromEntries}
                    onAddEntry={handleAddAROM}
                    onUpdateEntry={handleUpdateAROM}
                    onDeleteEntry={handleDeleteAROM}
                    onCopyToColumn={handleCopyAROMToColumn}
                  />
                )}

                {/* PROM */}
                {onPROMEntriesChange && (
                  <ROMTable
                    title="PROM"
                    entries={promEntries}
                    onAddEntry={handleAddPROM}
                    onUpdateEntry={handleUpdatePROM}
                    onDeleteEntry={handleDeletePROM}
                    onCopyToColumn={handleCopyPROMToColumn}
                  />
                )}

                {/* Girth */}
                {onGirthEntriesChange && (
                  <GirthTable
                    entries={girthEntries}
                    onAddEntry={handleAddGirth}
                    onUpdateEntry={handleUpdateGirth}
                    onDeleteEntry={handleDeleteGirth}
                    onCopyToColumn={handleCopyGirthToColumn}
                  />
                )}

                {/* Muscle Testing */}
                {onMuscleTestingEntriesChange && (
                  <MuscleTestingTable
                    entries={muscleTestingEntries}
                    onAddEntry={handleAddMuscleTesting}
                    onUpdateEntry={handleUpdateMuscleTesting}
                    onDeleteEntry={handleDeleteMuscleTesting}
                    onCopyToColumn={handleCopyMuscleTestingToColumn}
                  />
                )}

                {/* Special Tests */}
                {onSpecialTestEntriesChange && (
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

          {/* Neurological Section */}
          <div className="border border-cairos-border rounded-xl p-4">
            <button
              onClick={() => setNeurologicalExpanded(!neurologicalExpanded)}
              className="w-full flex items-center justify-between mb-4"
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
                  <MyotomesTable
                    entries={myotomeEntries}
                    onAddEntry={handleAddMyotome}
                    onUpdateEntry={handleUpdateMyotome}
                    onDeleteEntry={handleDeleteMyotome}
                    onCopyToColumn={handleCopyMyotomeToColumn}
                  />
                )}

                {/* Dermatomes */}
                {onDermatomeEntriesChange && (
                  <DermatomesTable
                    entries={dermatomeEntries}
                    onAddEntry={handleAddDermatome}
                    onUpdateEntry={handleUpdateDermatome}
                    onDeleteEntry={handleDeleteDermatome}
                    onCopyToColumn={handleCopyDermatomeToColumn}
                  />
                )}

                {/* Reflexes */}
                {onReflexEntriesChange && (
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

          {/* Functional Testing */}
          <div>
            <label className="block text-body-sm font-medium text-gray-700 mb-2">
              Functional Testing (LEFS, DASH, Sit-Stand, etc.)
            </label>
            <textarea
              value={functionalTesting}
              onChange={(e) => onFunctionalTestingChange(e.target.value)}
              placeholder="Document functional assessment results and scores..."
              className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[80px] resize-y"
            />
          </div>

          {/* Current Functional Limitations */}
          {onCurrentFunctionalLimitationsChange && (
            <div>
              <label className="block text-body-sm font-medium text-gray-700 mb-2">
                Current Functional Limitations
              </label>
              <textarea
                value={currentFunctionalLimitations || ''}
                onChange={(e) => onCurrentFunctionalLimitationsChange(e.target.value)}
                placeholder="Document current functional limitations affecting daily activities..."
                className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[100px] resize-y"
              />
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
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
