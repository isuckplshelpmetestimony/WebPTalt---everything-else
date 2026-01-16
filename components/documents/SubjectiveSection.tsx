'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { ChevronDown, ChevronUp, CheckCircle2, Plus, X, Trash2, Copy, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
// Removed BodyDiagram - replaced with structured pain tracking

interface TreatmentRelated {
  id: string;
  text: string;
}

interface PreviousDocument {
  id: string;
  type: string;
  date: Date;
  chiefComplaint?: string;
  onsetDate?: string;
  typeOfInjury?: string;
  specificInjury?: string;
  surgeryDate?: string;
  surgeryType?: string;
  occupation?: string;
}

interface PriorTreatment {
  id: string;
  type: string;
  when: string;
  duration: string;
  response: string;
}

interface SubjectiveSectionProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  chiefComplaint: string;
  onsetDate: string | Date;
  typeOfInjury?: string;
  specificInjury?: string;
  additionalInjuryDetails?: string;
  surgeryDate?: string;
  surgeryType?: string;
  occupation?: string;
  treatmentsRelated?: TreatmentRelated[];
  previousDocuments?: PreviousDocument[];
  documentType?: 'PT Daily Note' | 'PT Initial Evaluation';
  onChiefComplaintChange: (value: string) => void;
  onOnsetDateChange: (value: string | Date) => void;
  onTypeOfInjuryChange?: (value: string) => void;
  onSpecificInjuryChange?: (value: string) => void;
  onAdditionalInjuryDetailsChange?: (value: string) => void;
  onSurgeryDateChange?: (value: string) => void;
  onSurgeryTypeChange?: (value: string) => void;
  onOccupationChange?: (value: string) => void;
  onTreatmentsRelatedChange?: (treatments: TreatmentRelated[]) => void;
  onCreateGoal?: (text: string) => void;
}

export const SubjectiveSection: React.FC<SubjectiveSectionProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  chiefComplaint,
  onsetDate,
  typeOfInjury,
  specificInjury,
  additionalInjuryDetails,
  surgeryDate,
  surgeryType,
  occupation,
  treatmentsRelated = [],
  previousDocuments = [],
  documentType = 'PT Daily Note',
  onChiefComplaintChange,
  onOnsetDateChange,
  onTypeOfInjuryChange,
  onSpecificInjuryChange,
  onAdditionalInjuryDetailsChange,
  onSurgeryDateChange,
  onSurgeryTypeChange,
  onOccupationChange,
  onTreatmentsRelatedChange,
  onCreateGoal,
}) => {
  const isInitialEvaluation = documentType === 'PT Initial Evaluation';
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCopyMenuOpen, setIsCopyMenuOpen] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  // State for new comprehensive fields
  const [currentPain, setCurrentPain] = useState('');
  const [worstPain, setWorstPain] = useState('');
  const [bestPain, setBestPain] = useState('');
  const [progression, setProgression] = useState('');
  const [previousEpisodes, setPreviousEpisodes] = useState(false);
  const [previousEpisodesDetails, setPreviousEpisodesDetails] = useState('');
  const [symptomCharacter, setSymptomCharacter] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('');
  const [durationOfEpisodes, setDurationOfEpisodes] = useState('');
  const [hepCompliance, setHepCompliance] = useState('');
  const [hepComplianceReason, setHepComplianceReason] = useState('');
  const [twentyFourHourPattern, setTwentyFourHourPattern] = useState('');
  const [aggravatingFactors, setAggravatingFactors] = useState<string[]>([]);
  const [aggravatingOther, setAggravatingOther] = useState('');
  const [relievingFactors, setRelievingFactors] = useState<string[]>([]);
  const [relievingOther, setRelievingOther] = useState('');
  const [functionalLimitations, setFunctionalLimitations] = useState<string[]>([]);
  const [sittingMinutes, setSittingMinutes] = useState('');
  const [standingMinutes, setStandingMinutes] = useState('');
  const [walkingDistance, setWalkingDistance] = useState('');
  const [liftingWeight, setLiftingWeight] = useState('');
  const [householdChoresSpecify, setHouseholdChoresSpecify] = useState('');
  const [workDutiesSpecify, setWorkDutiesSpecify] = useState('');
  const [recreationalSpecify, setRecreationalSpecify] = useState('');
  const [priorTreatments, setPriorTreatments] = useState<PriorTreatment[]>([]);
  const [workStatus, setWorkStatus] = useState('');
  const [workHoursPerDay, setWorkHoursPerDay] = useState('');
  const [jobDemands, setJobDemands] = useState<string[]>([]);
  const [weightLiftedRegularly, setWeightLiftedRegularly] = useState('');
  const [workModifications, setWorkModifications] = useState('');
  const [returnToWorkGoal, setReturnToWorkGoal] = useState('');
  const [workRestrictions, setWorkRestrictions] = useState('');
  const [livesWith, setLivesWith] = useState('');
  const [homeType, setHomeType] = useState('');
  const [stairsInHome, setStairsInHome] = useState('');
  const [bedroomLocation, setBedroomLocation] = useState('');
  const [bathroomLocation, setBathroomLocation] = useState('');
  const [supportSystem, setSupportSystem] = useState('');
  const [assistiveDevices, setAssistiveDevices] = useState<string[]>([]);
  const [barriersToTherapy, setBarriersToTherapy] = useState<string[]>([]);
  const [shortTermGoals, setShortTermGoals] = useState('');
  const [longTermGoals, setLongTermGoals] = useState('');
  const [timelineExpectations, setTimelineExpectations] = useState('');
  const [motivationLevel, setMotivationLevel] = useState('');
  const [patientUnderstanding, setPatientUnderstanding] = useState('');
  const [priorPTExperience, setPriorPTExperience] = useState('');
  const [redFlagAcknowledged, setRedFlagAcknowledged] = useState(false);
  const [priorLevelOfFunction, setPriorLevelOfFunction] = useState('');
  // Pain tracking by body part (for Daily Notes)
  const [painfulAreas, setPainfulAreas] = useState<Array<{
    id: string;
    bodyPart: string;
    currentPain: string;
    previousPain?: string;
    status: 'improving' | 'same' | 'worse' | 'new';
  }>>([]);
  
  // Pain location fields (for Initial Evaluation)
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [secondaryLocation, setSecondaryLocation] = useState('');
  const [radiationPattern, setRadiationPattern] = useState('');
  
  // New fields state
  const [activityDurationBeforeSymptoms, setActivityDurationBeforeSymptoms] = useState('');
  const [symptomDurationOnceTriggered, setSymptomDurationOnceTriggered] = useState('');
  const [patientConcerns, setPatientConcerns] = useState<string[]>([]);
  const [patientConcernsNotes, setPatientConcernsNotes] = useState('');
  const [physicianRestrictions, setPhysicianRestrictions] = useState<string[]>([]);
  const [additionalRestrictions, setAdditionalRestrictions] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([]);
  const [specialNeedsOther, setSpecialNeedsOther] = useState('');
  const [specialNeedsLanguage, setSpecialNeedsLanguage] = useState('');
  const [specialNeedsTherapistNotes, setSpecialNeedsTherapistNotes] = useState('');
  const [bladderControlIssues, setBladderControlIssues] = useState('');
  const [memoryConcerns, setMemoryConcerns] = useState('');
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [lastDateWorked, setLastDateWorked] = useState('');
  const [diagnosticImaging, setDiagnosticImaging] = useState<Array<{type: string; date: string; results: string}>>([]);
  const [relatedSurgeries, setRelatedSurgeries] = useState<Array<{type: string; date: string; outcome: string}>>([]);
  const [currentPainMedications, setCurrentPainMedications] = useState<Array<{medication: string; dosage: string; frequency: string; effectiveness: string}>>([]);

  // Mock red flags count (would come from intake in real implementation)
  const redFlagsCount = 0; // Change to > 0 to see alert banner
  const redFlagsTotal = 10;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
        setIsCopyMenuOpen(false);
      }
    };

    if (isCopyMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCopyMenuOpen]);

  const addTreatmentRelated = () => {
    if (!onTreatmentsRelatedChange) return;
    const newTreatment: TreatmentRelated = {
      id: Date.now().toString(),
      text: '',
    };
    onTreatmentsRelatedChange([...treatmentsRelated, newTreatment]);
    setEditingId(newTreatment.id);
  };

  const updateTreatmentRelated = (id: string, text: string) => {
    if (!onTreatmentsRelatedChange) return;
    onTreatmentsRelatedChange(
      treatmentsRelated.map(t => t.id === id ? { ...t, text } : t)
    );
  };

  const deleteTreatmentRelated = (id: string) => {
    if (!onTreatmentsRelatedChange) return;
    onTreatmentsRelatedChange(treatmentsRelated.filter(t => t.id !== id));
  };

  const handleCreateGoal = (text: string) => {
    if (onCreateGoal) {
      onCreateGoal(text);
    }
  };

  const handleCopyFromDocument = (document: PreviousDocument | null) => {
    if (document === null) {
      onChiefComplaintChange('');
      onOnsetDateChange('');
      if (onTypeOfInjuryChange) onTypeOfInjuryChange('');
      if (onSpecificInjuryChange) onSpecificInjuryChange('');
      if (onSurgeryDateChange) onSurgeryDateChange('');
      if (onSurgeryTypeChange) onSurgeryTypeChange('');
      if (onOccupationChange) onOccupationChange('');
    } else {
      if (document.chiefComplaint) {
        onChiefComplaintChange(document.chiefComplaint);
      }
      if (document.onsetDate) {
        onOnsetDateChange(document.onsetDate);
      }
      if (document.typeOfInjury && onTypeOfInjuryChange) {
        onTypeOfInjuryChange(document.typeOfInjury);
      }
      if (document.specificInjury && onSpecificInjuryChange) {
        onSpecificInjuryChange(document.specificInjury);
      }
      if (document.surgeryDate && onSurgeryDateChange) {
        onSurgeryDateChange(document.surgeryDate);
      }
      if (document.surgeryType && onSurgeryTypeChange) {
        onSurgeryTypeChange(document.surgeryType);
      }
      if (document.occupation && onOccupationChange) {
        onOccupationChange(document.occupation);
      }
    }
    setIsCopyMenuOpen(false);
  };

  const toggleCheckbox = (array: string[], setArray: (val: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const addPriorTreatment = () => {
    setPriorTreatments([...priorTreatments, {
      id: Date.now().toString(),
      type: '',
      when: '',
      duration: '',
      response: '',
    }]);
  };

  const updatePriorTreatment = (id: string, field: keyof PriorTreatment, value: string) => {
    setPriorTreatments(priorTreatments.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const deletePriorTreatment = (id: string) => {
    setPriorTreatments(priorTreatments.filter(t => t.id !== id));
  };

  // Calculate average pain
  const averagePain = currentPain && worstPain && bestPain
    ? ((parseFloat(currentPain) + parseFloat(worstPain) + parseFloat(bestPain)) / 3).toFixed(1)
    : '';

  const commonBodyParts = [
    'Cervical Spine', 'Upper Back', 'Lower Back', 'Left Shoulder', 'Right Shoulder',
    'Left Elbow', 'Right Elbow', 'Left Wrist', 'Right Wrist', 'Left Hip', 'Right Hip',
    'Left Knee', 'Right Knee', 'Left Ankle', 'Right Ankle', 'Other'
  ];

  const addPainfulArea = () => {
    setPainfulAreas([...painfulAreas, {
      id: Date.now().toString(),
      bodyPart: '',
      currentPain: '',
      status: 'new',
    }]);
  };

  const updatePainfulArea = (id: string, updates: Partial<typeof painfulAreas[0]>) => {
    setPainfulAreas(painfulAreas.map(area => 
      area.id === id ? { ...area, ...updates } : area
    ));
  };

  const deletePainfulArea = (id: string) => {
    setPainfulAreas(painfulAreas.filter(area => area.id !== id));
  };

  // Auto-calculate status based on pain levels
  const calculateStatus = (current: string, previous?: string): 'improving' | 'same' | 'worse' | 'new' => {
    if (!previous || previous === '') return 'new';
    const currentNum = parseFloat(current);
    const previousNum = parseFloat(previous);
    if (isNaN(currentNum) || isNaN(previousNum)) return 'same';
    if (currentNum < previousNum) return 'improving';
    if (currentNum > previousNum) return 'worse';
    return 'same';
  };

  const isComplete = chiefComplaint.trim().length > 0;

  return (
    <Card className="p-5 mb-4">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <h3 className="text-h3 text-gray-900">Subjective</h3>
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
          {/* Show prompts instead of form when mic mode is enabled */}
          {micModePrompts ? (
            <div>
              {micModePrompts}
            </div>
          ) : (
            <>
              {/* 1. RED FLAG ALERT - Only show for Initial Evaluation */}
              {isInitialEvaluation && (
                <div className={`p-4 rounded-xl border-2 ${
                  redFlagsCount > 0 
                    ? 'bg-yellow-50 border-yellow-300' 
                    : 'bg-green-50 border-green-300'
                }`}>
                  <div className="flex items-start gap-3">
                    {redFlagsCount > 0 ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-body font-semibold text-yellow-900">
                              ⚠️ CAUTION: Patient has {redFlagsCount}/{redFlagsTotal} positive red flag indicators.
                            </span>
                          </div>
                          <p className="text-body-sm text-yellow-800 mb-3">
                            Review before proceeding. Positive flags: Unexplained weight loss, Night pain, Progressive weakness
                          </p>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={redFlagAcknowledged}
                              onChange={(e) => setRedFlagAcknowledged(e.target.checked)}
                              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                            <span className="text-body-sm font-medium text-yellow-900">
                              I acknowledge the red flag screening results and have reviewed them before proceeding
                            </span>
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-body font-semibold text-green-900">
                            ✓ RED FLAG SCREENING: {redFlagsCount}/{redFlagsTotal} flags positive - Cleared for PT evaluation
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 1b. ADDITIONAL SAFETY SCREENING FLAGS */}
              {isInitialEvaluation && (bladderControlIssues === 'yes' || memoryConcerns === 'yes') && (
                <div className="p-4 rounded-xl border-2 bg-yellow-50 border-yellow-300">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-body font-semibold text-yellow-900 mb-2 block">
                        ⚠️ Additional Safety Considerations
                      </span>
                      <div className="space-y-1 text-body-sm text-yellow-800 mb-3">
                        {bladderControlIssues === 'yes' && (
                          <p>• Patient reported bladder control issues.</p>
                        )}
                        {memoryConcerns === 'yes' && (
                          <p>• Patient reported memory concerns.</p>
                        )}
                        <p className="mt-2">Review full screening results in relevant sections.</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={safetyAcknowledged}
                          onChange={(e) => setSafetyAcknowledged(e.target.checked)}
                          className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <span className="text-body-sm font-medium text-yellow-900">
                          Therapist Acknowledgment: Reviewed and noted
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CHIEF COMPLAINT */}
              <div>
                <label className="block text-body-sm font-medium text-gray-700 mb-2">
                  Chief Complaint (Patient's Own Words) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="chief-complaint"
                    value={chiefComplaint}
                    onChange={(e) => onChiefComplaintChange(e.target.value)}
                    onFocus={() => {
                      if (typeof window !== 'undefined') {
                        const event = new CustomEvent('setActiveTextArea', { detail: 'chief-complaint' });
                        window.dispatchEvent(event);
                      }
                    }}
                    placeholder='"Tell us more about when the pain/symptom started..."'
                    maxLength={500}
                    className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[120px] resize-y"
                  />
                  <div className="absolute bottom-2 right-2 text-body-xs text-gray-400">
                    {chiefComplaint.length}/500
                  </div>
                </div>
                <p className="mt-1 text-body-xs text-gray-500 italic">
                  Auto-populated from intake form (editable)
                </p>
                {!isInitialEvaluation && previousDocuments.length > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const lastDoc = previousDocuments[0];
                      if (lastDoc.chiefComplaint) {
                        onChiefComplaintChange(lastDoc.chiefComplaint);
                      }
                    }}
                    className="mt-2 flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    Copy from Previous Note
                  </Button>
                )}
              </div>

              {/* DAILY NOTE SPECIFIC FIELDS */}
              {!isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  {/* Current Pain Level with Previous Comparison */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Current Pain Level (0-10)
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={currentPain || ''}
                        onChange={(e) => setCurrentPain(e.target.value)}
                        placeholder="0-10"
                        className="w-24"
                      />
                      <span className="text-body text-gray-600">/ 10</span>
                      {previousDocuments.length > 0 && previousDocuments[0].chiefComplaint && (
                        <span className="text-body-xs text-gray-500 ml-auto">
                          Previous: {previousDocuments[0].chiefComplaint.match(/(\d+)\/10/)?.[1] || 'N/A'}/10
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pain Location Tracking - Structured List */}
                  <div className="pt-4 border-t border-cairos-border">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-body-sm font-medium text-gray-700">
                        Painful Areas & Progress Tracking
                      </label>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addPainfulArea}
                        className="flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add Area
                      </Button>
                    </div>
                    
                    {painfulAreas.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-cairos-border">
                        <p className="text-body-sm text-gray-500">No painful areas documented yet</p>
                        <p className="text-body-xs text-gray-400 mt-1">Click "Add Area" to track pain by body part</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {painfulAreas.map((area) => {
                          const status = calculateStatus(area.currentPain, area.previousPain);
                          const statusColors = {
                            improving: 'bg-green-50 border-green-200 text-green-800',
                            same: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                            worse: 'bg-red-50 border-red-200 text-red-800',
                            new: 'bg-blue-50 border-blue-200 text-blue-800',
                          };
                          const statusLabels = {
                            improving: '✓ Improving',
                            same: '→ Same',
                            worse: '⚠ Worse',
                            new: 'New',
                          };

                          return (
                            <div key={area.id} className="border border-cairos-border rounded-xl p-4 bg-white">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                <div>
                                  <label className="block text-body-xs font-medium text-gray-700 mb-1">
                                    Body Part
                                  </label>
                                  <Select
                                    options={[
                                      { value: '', label: 'Select...' },
                                      ...commonBodyParts.map(part => ({ value: part, label: part })),
                                    ]}
                                    value={area.bodyPart}
                                    onChange={(e) => updatePainfulArea(area.id, { bodyPart: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-body-xs font-medium text-gray-700 mb-1">
                                    Current Pain (0-10)
                                  </label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={area.currentPain}
                                    onChange={(e) => {
                                      const newPain = e.target.value;
                                      const newStatus = calculateStatus(newPain, area.previousPain);
                                      updatePainfulArea(area.id, { currentPain: newPain, status: newStatus });
                                    }}
                                    placeholder="0-10"
                                  />
                                </div>
                                <div>
                                  <label className="block text-body-xs font-medium text-gray-700 mb-1">
                                    Previous Pain (0-10)
                                  </label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={area.previousPain || ''}
                                    onChange={(e) => {
                                      const newPrevious = e.target.value;
                                      const newStatus = calculateStatus(area.currentPain, newPrevious);
                                      updatePainfulArea(area.id, { previousPain: newPrevious, status: newStatus });
                                    }}
                                    placeholder="N/A"
                                  />
                                </div>
                                <div>
                                  <label className="block text-body-xs font-medium text-gray-700 mb-1">
                                    Status
                                  </label>
                                  <div className={`px-3 py-2 rounded-lg border text-body-xs font-semibold text-center ${statusColors[status]}`}>
                                    {statusLabels[status]}
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => deletePainfulArea(area.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    aria-label="Remove area"
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                  </button>
                                </div>
                              </div>
                              {status === 'improving' && area.currentPain && area.previousPain && (
                                <div className="mt-2 text-body-xs text-green-700">
                                  ✓ Pain reduced from {area.previousPain}/10 to {area.currentPain}/10
                                </div>
                              )}
                              {status === 'worse' && area.currentPain && area.previousPain && (
                                <div className="mt-2 text-body-xs text-red-700">
                                  ⚠ Pain increased from {area.previousPain}/10 to {area.currentPain}/10
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="mt-3 text-body-xs text-gray-500 italic">
                      Track which body parts are still painful and compare to previous visit to monitor progress
                    </p>
                  </div>

                  {/* Functional Progress Since Last Visit */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Functional Progress Since Last Visit
                    </label>
                    <div className="relative">
                      <textarea
                        value={progression}
                        onChange={(e) => setProgression(e.target.value)}
                        placeholder="e.g., 'Patient reports being able to climb 8 stairs today, up from 4 last week'"
                        maxLength={500}
                        className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[100px] resize-y"
                      />
                      <div className="absolute bottom-2 right-2 text-body-xs text-gray-400">
                        {progression.length}/500
                      </div>
                    </div>
                    <p className="mt-1 text-body-xs text-gray-500 italic">
                      Must be specific and measurable, not generic
                    </p>
                  </div>

                  {/* HEP Compliance */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      HEP (Home Exercise Program) Compliance
                    </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        options={[
                          { value: '', label: 'Select...' },
                          { value: 'compliant', label: 'Compliant' },
                          { value: 'partially-compliant', label: 'Partially Compliant' },
                          { value: 'non-compliant', label: 'Non-Compliant' },
                        ]}
                        value={hepCompliance}
                        onChange={(e) => setHepCompliance(e.target.value)}
                      />
                      {hepCompliance === 'non-compliant' && (
                        <Input
                          type="text"
                          placeholder="If non-compliant, reason?"
                          value={hepComplianceReason}
                          onChange={(e) => setHepComplianceReason(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Aggravating/Easing Factors Update */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Aggravating/Easing Factors Update
                    </label>
                    <textarea
                      value={twentyFourHourPattern}
                      onChange={(e) => setTwentyFourHourPattern(e.target.value)}
                      placeholder="What makes it worse/better?"
                      className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[80px] resize-y"
                    />
                  </div>

                  {/* Red/Yellow Flag Screening - Conditional */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Red/Yellow Flag Screening
                      <span className="text-body-xs text-gray-500 ml-2">(Only if patient age &gt;50 or history indicates need)</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        'Unexplained weight loss',
                        'Fever',
                        'Night sweats',
                        'Bowel/bladder changes',
                        'Trauma',
                      ].map((flag) => (
                        <label key={flag} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={symptomCharacter.includes(flag)}
                            onChange={() => toggleCheckbox(symptomCharacter, setSymptomCharacter, flag)}
                            className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                          />
                          <span className="text-body-sm text-gray-700">{flag}</span>
                        </label>
                      ))}
                      {symptomCharacter.length > 0 && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-body-xs text-yellow-800">
                              ⚠️ Red flag detected. Consider physician referral.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PAIN LOCATION - Text Fields Only */}
              {isInitialEvaluation && (
                <div>
                  <label className="block text-body-sm font-medium text-gray-700 mb-2">
                    Pain Location <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <div>
                      <Input
                        type="text"
                        label="Primary Location"
                        placeholder="e.g., L4-L5 lumbar spine"
                        value={primaryLocation}
                        onChange={(e) => setPrimaryLocation(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Secondary Location(s)"
                        placeholder="e.g., Cervical spine (compensatory tension)"
                        value={secondaryLocation}
                        onChange={(e) => setSecondaryLocation(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Radiation Pattern"
                        placeholder="e.g., Right posterior leg following sciatic nerve distribution to lateral calf"
                        value={radiationPattern}
                        onChange={(e) => setRadiationPattern(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <p className="mt-2 text-body-xs text-gray-500 italic">Document pain location(s) and radiation pattern</p>
                  </div>
                </div>
              )}

              {/* 4. CURRENT PAIN INTENSITY SCALES */}
              {isInitialEvaluation && (
                <div>
                  <label className="block text-body-sm font-medium text-gray-700 mb-2">
                    Current Pain Intensity Scales <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        type="number"
                        label="Current Pain (0-10)"
                        min="0"
                        max="10"
                        value={currentPain}
                        onChange={(e) => setCurrentPain(e.target.value)}
                        placeholder="0-10"
                        className="bg-blue-50"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        label="Worst Pain - Past Week (0-10)"
                        min="0"
                        max="10"
                        value={worstPain}
                        onChange={(e) => setWorstPain(e.target.value)}
                        placeholder="0-10"
                        className="bg-blue-50"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        label="Best Pain - Past Week (0-10)"
                        min="0"
                        max="10"
                        value={bestPain}
                        onChange={(e) => setBestPain(e.target.value)}
                        placeholder="0-10"
                        className="bg-blue-50"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Average"
                        value={averagePain ? `${averagePain}/10` : ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-body-xs text-gray-500 italic">
                    Auto-populated from intake form. Marked as baseline values.
                  </p>
                </div>
              )}

              {/* 5. HISTORY OF PRESENT ILLNESS */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">History of Present Illness</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Onset Date/Timeline
                      </label>
                      <DatePicker
                        value={onsetDate}
                        onChange={onOnsetDateChange}
                        placeholder="e.g., 3 weeks ago"
                        allowApproximate={true}
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 1</p>
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Mechanism of Injury
                      </label>
                      <textarea
                        value={additionalInjuryDetails || ''}
                        onChange={(e) => onAdditionalInjuryDetailsChange && onAdditionalInjuryDetailsChange(e.target.value)}
                        placeholder="e.g., Lifting heavy box at work"
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 2</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Progression
                    </label>
                    <div className="flex gap-4">
                      {['Improving', 'Stable', 'Worsening'].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="progression"
                            value={option}
                            checked={progression === option}
                            onChange={(e) => setProgression(e.target.value)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                          />
                          <span className="text-body-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={previousEpisodes}
                        onChange={(e) => setPreviousEpisodes(e.target.checked)}
                        className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                      />
                      <span className="text-body-sm font-medium text-gray-700">Previous Episodes</span>
                    </label>
                    {previousEpisodes && (
                      <textarea
                        value={previousEpisodesDetails}
                        onChange={(e) => setPreviousEpisodesDetails(e.target.value)}
                        placeholder="Describe previous episodes..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    )}
                  </div>

                  {/* Physician Activity Restrictions */}
                  <div className="pt-4 border-t border-cairos-border">
                    <h5 className="text-body-sm font-semibold text-gray-900 mb-3">Physician Activity Restrictions</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                      {['No lifting over 10 lbs', 'Avoid overhead work', 'No high-impact activities', 'No running/sports participation', 'Avoid heavy pushing/pulling', 'Modified work duties', 'Other restrictions'].map((restriction) => (
                        <label key={restriction} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={physicianRestrictions.includes(restriction)}
                            onChange={() => toggleCheckbox(physicianRestrictions, setPhysicianRestrictions, restriction)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                          />
                          <span className="text-body-sm text-gray-700">{restriction}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-body-xs text-gray-500 italic mb-3">Auto-populated from intake Step 4</p>
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Additional Restrictions (therapist can add)
                      </label>
                      <textarea
                        value={additionalRestrictions}
                        onChange={(e) => setAdditionalRestrictions(e.target.value)}
                        placeholder="Add any additional restrictions..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>
                  </div>

                  {/* Diagnostic Imaging Completed */}
                  <div className="pt-4 border-t border-cairos-border">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-body-sm font-semibold text-gray-900">Diagnostic Imaging / Tests Completed</h5>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setDiagnosticImaging([...diagnosticImaging, { type: '', date: '', results: '' }])}
                        className="flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add Imaging/Test
                      </Button>
                    </div>
                    <p className="text-body-xs text-gray-500 italic mb-3">Auto-populated from intake Step 3 (only checked items shown)</p>
                    {diagnosticImaging.length > 0 ? (
                      <div className="space-y-3">
                        {diagnosticImaging.map((imaging, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-cairos-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <Select
                                label="Type"
                                options={[
                                  { value: '', label: 'Select...' },
                                  { value: 'X-ray', label: 'X-ray' },
                                  { value: 'MRI', label: 'MRI' },
                                  { value: 'CT scan', label: 'CT scan' },
                                  { value: 'Ultrasound', label: 'Ultrasound' },
                                  { value: 'EMG/Nerve test', label: 'EMG/Nerve test' },
                                  { value: 'Blood work', label: 'Blood work' },
                                ]}
                                value={imaging.type}
                                onChange={(e) => {
                                  const updated = [...diagnosticImaging];
                                  updated[index].type = e.target.value;
                                  setDiagnosticImaging(updated);
                                }}
                                className="bg-blue-50"
                              />
                              <Input
                                type="date"
                                label="Date"
                                value={imaging.date}
                                onChange={(e) => {
                                  const updated = [...diagnosticImaging];
                                  updated[index].date = e.target.value;
                                  setDiagnosticImaging(updated);
                                }}
                              />
                              <div>
                                <label className="block text-body-sm font-medium text-gray-700 mb-1">Results</label>
                                <textarea
                                  value={imaging.results}
                                  onChange={(e) => {
                                    const updated = [...diagnosticImaging];
                                    updated[index].results = e.target.value;
                                    setDiagnosticImaging(updated);
                                  }}
                                  placeholder="Enter results..."
                                  rows={2}
                                  className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => setDiagnosticImaging(diagnosticImaging.filter((_, i) => i !== index))}
                              className="mt-2 p-1 hover:bg-red-100 rounded-lg transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-body-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No imaging added yet</p>
                    )}
                  </div>

                  {/* Related Surgical History */}
                  <div className="pt-4 border-t border-cairos-border">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-body-sm font-semibold text-gray-900">Surgical History Related to Current Problem</h5>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setRelatedSurgeries([...relatedSurgeries, { type: '', date: '', outcome: '' }])}
                        className="flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add Surgery
                      </Button>
                    </div>
                    <p className="text-body-xs text-gray-500 italic mb-3">Auto-populated if patient answered 'Yes' to surgery question in Step 3</p>
                    {relatedSurgeries.length > 0 ? (
                      <div className="space-y-3">
                        {relatedSurgeries.map((surgery, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-cairos-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <Input
                                type="text"
                                label="Type"
                                placeholder="e.g., Lumbar fusion"
                                value={surgery.type}
                                onChange={(e) => {
                                  const updated = [...relatedSurgeries];
                                  updated[index].type = e.target.value;
                                  setRelatedSurgeries(updated);
                                }}
                                className="bg-blue-50"
                              />
                              <Input
                                type="date"
                                label="Date"
                                value={surgery.date}
                                onChange={(e) => {
                                  const updated = [...relatedSurgeries];
                                  updated[index].date = e.target.value;
                                  setRelatedSurgeries(updated);
                                }}
                                className="bg-blue-50"
                              />
                              <div>
                                <label className="block text-body-sm font-medium text-gray-700 mb-1">Outcome</label>
                                <textarea
                                  value={surgery.outcome}
                                  onChange={(e) => {
                                    const updated = [...relatedSurgeries];
                                    updated[index].outcome = e.target.value;
                                    setRelatedSurgeries(updated);
                                  }}
                                  placeholder="Therapist fills in outcome..."
                                  rows={2}
                                  className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => setRelatedSurgeries(relatedSurgeries.filter((_, i) => i !== index))}
                              className="mt-2 p-1 hover:bg-red-100 rounded-lg transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-body-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No related surgeries added yet</p>
                    )}
                    <p className="mt-2 text-body-xs text-gray-500 italic">Note: Complete surgical history available in Medical History section</p>
                  </div>
                </div>
              )}

              {/* 6. SYMPTOM CHARACTERISTICS (OLD CARTS) */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Symptom Characteristics (OLD CARTS)</h4>
                  
                  {/* Character */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Character (Multi-select)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Sharp', 'Shooting', 'Dull', 'Aching', 'Burning', 'Tingling', 'Numbness', 'Throbbing', 'Stabbing'].map((char) => (
                        <label key={char} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={symptomCharacter.includes(char)}
                            onChange={() => toggleCheckbox(symptomCharacter, setSymptomCharacter, char)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                          />
                          <span className="text-body-sm text-gray-700">{char}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 2</p>
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <div className="flex gap-4">
                      {['Constant', 'Intermittent'].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="frequency"
                            value={option}
                            checked={frequency === option}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                          />
                          <span className="text-body-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 2</p>
                  </div>

                  {/* Duration of Episodes - Only show if Intermittent */}
                  {frequency === 'Intermittent' && (
                    <div>
                      <Input
                        type="text"
                        label="Duration of Episodes (for intermittent symptoms)"
                        placeholder="e.g., Lasts 5-10 minutes when triggered"
                        value={durationOfEpisodes}
                        onChange={(e) => setDurationOfEpisodes(e.target.value)}
                        className="bg-blue-50"
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                    </div>
                  )}

                  {/* 24-Hour Pattern */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      24-Hour Pattern
                    </label>
                    <div className="space-y-2">
                      {[
                        'Constant throughout day',
                        'Worse in morning (morning stiffness)',
                        'Worse as day progresses',
                        'Night pain (wakes from sleep)',
                        'Pain with first steps after rest'
                      ].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pattern"
                            value={option}
                            checked={twentyFourHourPattern === option}
                            onChange={(e) => setTwentyFourHourPattern(e.target.value)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                          />
                          <span className="text-body-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 2</p>
                  </div>

                  {/* Aggravating Factors */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Aggravating Factors (Multi-select) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                      {['Sitting', 'Standing', 'Walking', 'Bending', 'Lifting', 'Stairs', 'Reaching'].map((factor) => (
                        <label key={factor} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aggravatingFactors.includes(factor)}
                            onChange={() => toggleCheckbox(aggravatingFactors, setAggravatingFactors, factor)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                          />
                          <span className="text-body-sm text-gray-700">{factor}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aggravatingFactors.includes('Other')}
                          onChange={() => toggleCheckbox(aggravatingFactors, setAggravatingFactors, 'Other')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Other</span>
                      </label>
                    </div>
                    {aggravatingFactors.includes('Other') && (
                      <Input
                        type="text"
                        placeholder="Specify other aggravating factors"
                        value={aggravatingOther}
                        onChange={(e) => setAggravatingOther(e.target.value)}
                        className="mt-2"
                      />
                    )}
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 2</p>
                  </div>

                  {/* Relieving Factors */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Relieving Factors (Multi-select)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                      {['Walking', 'Resting', 'Lying down', 'Heat', 'Ice', 'Medication', 'Stretching'].map((factor) => (
                        <label key={factor} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={relievingFactors.includes(factor)}
                            onChange={() => toggleCheckbox(relievingFactors, setRelievingFactors, factor)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                          />
                          <span className="text-body-sm text-gray-700">{factor}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={relievingFactors.includes('Other')}
                          onChange={() => toggleCheckbox(relievingFactors, setRelievingFactors, 'Other')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Other</span>
                      </label>
                    </div>
                    {relievingFactors.includes('Other') && (
                      <Input
                        type="text"
                        placeholder="Specify other relieving factors"
                        value={relievingOther}
                        onChange={(e) => setRelievingOther(e.target.value)}
                        className="mt-2"
                      />
                    )}
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 2</p>
                  </div>
                </div>
              )}

              {/* 6a. ACTIVITY TOLERANCE DURATION */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Activity Tolerance</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Activity Duration Before Symptoms Start"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: '5 minutes', label: '5 minutes' },
                          { value: '10 minutes', label: '10 minutes' },
                          { value: '15 minutes', label: '15 minutes' },
                          { value: '30 minutes', label: '30 minutes' },
                          { value: '1 hour', label: '1 hour' },
                          { value: '2 hours', label: '2 hours' },
                          { value: '3+ hours', label: '3+ hours' },
                        ]}
                        value={activityDurationBeforeSymptoms}
                        onChange={(e) => setActivityDurationBeforeSymptoms(e.target.value)}
                        className="bg-blue-50"
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                    </div>

                    <div>
                      <Select
                        label="Symptom Duration Once Triggered"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: '5 minutes', label: '5 minutes' },
                          { value: '10 minutes', label: '10 minutes' },
                          { value: '30 minutes', label: '30 minutes' },
                          { value: '1 hour', label: '1 hour' },
                          { value: 'Until I rest', label: 'Until I rest' },
                          { value: 'All day', label: 'All day' },
                        ]}
                        value={symptomDurationOnceTriggered}
                        onChange={(e) => setSymptomDurationOnceTriggered(e.target.value)}
                        className="bg-blue-50"
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. FUNCTIONAL LIMITATIONS */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">
                    Current Functional Limitations (activities patient CANNOT do) <span className="text-red-500">*</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={functionalLimitations.includes('Sitting')}
                          onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Sitting')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Sitting &gt;</span>
                        {functionalLimitations.includes('Sitting') && (
                          <Input
                            type="text"
                            placeholder="minutes"
                            value={sittingMinutes}
                            onChange={(e) => setSittingMinutes(e.target.value)}
                            className="w-24"
                          />
                        )}
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={functionalLimitations.includes('Standing')}
                          onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Standing')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Standing &gt;</span>
                        {functionalLimitations.includes('Standing') && (
                          <Input
                            type="text"
                            placeholder="minutes"
                            value={standingMinutes}
                            onChange={(e) => setStandingMinutes(e.target.value)}
                            className="w-24"
                          />
                        )}
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={functionalLimitations.includes('Walking')}
                          onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Walking')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Walking &gt;</span>
                        {functionalLimitations.includes('Walking') && (
                          <Input
                            type="text"
                            placeholder="distance"
                            value={walkingDistance}
                            onChange={(e) => setWalkingDistance(e.target.value)}
                            className="w-24"
                          />
                        )}
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={functionalLimitations.includes('Lifting')}
                          onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Lifting')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Lifting &gt;</span>
                        {functionalLimitations.includes('Lifting') && (
                          <Input
                            type="text"
                            placeholder="lbs"
                            value={liftingWeight}
                            onChange={(e) => setLiftingWeight(e.target.value)}
                            className="w-24"
                          />
                        )}
                      </label>
                    </div>

                    {['Ascending/descending stairs', 'Reaching overhead', 'Bending/stooping', 'Sleeping (pain disrupts sleep)', 'Driving', 'Self-care activities (dressing, bathing, etc.)'].map((activity) => (
                      <label key={activity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={functionalLimitations.includes(activity)}
                          onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, activity)}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">{activity}</span>
                      </label>
                    ))}

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functionalLimitations.includes('Household chores')}
                        onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Household chores')}
                        className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                      />
                      <span className="text-body-sm text-gray-700">Household chores (specify:</span>
                      {functionalLimitations.includes('Household chores') && (
                        <Input
                          type="text"
                          placeholder="specify"
                          value={householdChoresSpecify}
                          onChange={(e) => setHouseholdChoresSpecify(e.target.value)}
                          className="flex-1"
                        />
                      )}
                      <span className="text-body-sm text-gray-700">)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functionalLimitations.includes('Work duties')}
                        onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Work duties')}
                        className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                      />
                      <span className="text-body-sm text-gray-700">Work duties (specify:</span>
                      {functionalLimitations.includes('Work duties') && (
                        <Input
                          type="text"
                          placeholder="specify"
                          value={workDutiesSpecify}
                          onChange={(e) => setWorkDutiesSpecify(e.target.value)}
                          className="flex-1"
                        />
                      )}
                      <span className="text-body-sm text-gray-700">)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functionalLimitations.includes('Recreational activities')}
                        onChange={() => toggleCheckbox(functionalLimitations, setFunctionalLimitations, 'Recreational activities')}
                        className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                      />
                      <span className="text-body-sm text-gray-700">Recreational activities (specify:</span>
                      {functionalLimitations.includes('Recreational activities') && (
                        <Input
                          type="text"
                          placeholder="specify"
                          value={recreationalSpecify}
                          onChange={(e) => setRecreationalSpecify(e.target.value)}
                          className="flex-1"
                        />
                      )}
                      <span className="text-body-sm text-gray-700">)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 8. PRIOR TREATMENT & RESPONSE */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-body font-semibold text-gray-900">Prior Treatment & Response</h4>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addPriorTreatment}
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Treatment
                    </Button>
                  </div>

                  {priorTreatments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-cairos-border px-3 py-2 text-left text-body-sm font-medium text-gray-700">Treatment Type</th>
                            <th className="border border-cairos-border px-3 py-2 text-left text-body-sm font-medium text-gray-700">When</th>
                            <th className="border border-cairos-border px-3 py-2 text-left text-body-sm font-medium text-gray-700">Duration</th>
                            <th className="border border-cairos-border px-3 py-2 text-left text-body-sm font-medium text-gray-700">Response</th>
                            <th className="border border-cairos-border px-3 py-2 text-left text-body-sm font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {priorTreatments.map((treatment) => (
                            <tr key={treatment.id}>
                              <td className="border border-cairos-border px-3 py-2">
                                <Select
                                  options={[
                                    { value: '', label: 'Select...' },
                                    { value: 'PT', label: 'PT' },
                                    { value: 'Chiropractic', label: 'Chiropractic' },
                                    { value: 'Massage', label: 'Massage' },
                                    { value: 'Acupuncture', label: 'Acupuncture' },
                                    { value: 'Surgery', label: 'Surgery' },
                                    { value: 'Medication', label: 'Medication' },
                                    { value: 'Injections', label: 'Injections' },
                                    { value: 'Home remedies', label: 'Home remedies' },
                                    { value: 'Other', label: 'Other' },
                                  ]}
                                  value={treatment.type}
                                  onChange={(e) => updatePriorTreatment(treatment.id, 'type', e.target.value)}
                                />
                              </td>
                              <td className="border border-cairos-border px-3 py-2">
                                <Input
                                  type="text"
                                  placeholder="e.g., 2 years ago"
                                  value={treatment.when}
                                  onChange={(e) => updatePriorTreatment(treatment.id, 'when', e.target.value)}
                                />
                              </td>
                              <td className="border border-cairos-border px-3 py-2">
                                <Input
                                  type="text"
                                  placeholder="e.g., 6 weeks"
                                  value={treatment.duration}
                                  onChange={(e) => updatePriorTreatment(treatment.id, 'duration', e.target.value)}
                                />
                              </td>
                              <td className="border border-cairos-border px-3 py-2">
                                <Select
                                  options={[
                                    { value: '', label: 'Select...' },
                                    { value: 'Complete resolution', label: 'Complete resolution' },
                                    { value: 'Significant improvement', label: 'Significant improvement' },
                                    { value: 'Moderate improvement', label: 'Moderate improvement' },
                                    { value: 'Minimal improvement', label: 'Minimal improvement' },
                                    { value: 'No improvement', label: 'No improvement' },
                                    { value: 'Made it worse', label: 'Made it worse' },
                                  ]}
                                  value={treatment.response}
                                  onChange={(e) => updatePriorTreatment(treatment.id, 'response', e.target.value)}
                                />
                              </td>
                              <td className="border border-cairos-border px-3 py-2">
                                <button
                                  onClick={() => deletePriorTreatment(treatment.id)}
                                  className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                                  aria-label="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-cairos-border">
                      <p className="text-body-sm text-gray-500">No prior treatments added yet. Click "Add Treatment" to add one.</p>
                    </div>
                  )}
                  <p className="text-body-xs text-gray-500 italic">Auto-populated from intake Steps 3 & 5</p>
                  
                  {/* Current Pain Medications */}
                  <div className="pt-4 border-t border-cairos-border mt-4">
                    <h5 className="text-body-sm font-semibold text-gray-900 mb-3">Current Pain Management Medications</h5>
                    <p className="text-body-xs text-gray-500 italic mb-3">Auto-populated from Intake Step 3 - Medication History</p>
                    
                    {currentPainMedications.length > 0 ? (
                      <div className="space-y-3">
                        {currentPainMedications.map((med, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-cairos-border">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <Input
                                type="text"
                                label="Medication"
                                placeholder="e.g., Naproxen"
                                value={med.medication}
                                onChange={(e) => {
                                  const updated = [...currentPainMedications];
                                  updated[index].medication = e.target.value;
                                  setCurrentPainMedications(updated);
                                }}
                                className="bg-blue-50"
                              />
                              <Input
                                type="text"
                                label="Dosage"
                                value={med.dosage}
                                onChange={(e) => {
                                  const updated = [...currentPainMedications];
                                  updated[index].dosage = e.target.value;
                                  setCurrentPainMedications(updated);
                                }}
                              />
                              <Input
                                type="text"
                                label="Frequency"
                                value={med.frequency}
                                onChange={(e) => {
                                  const updated = [...currentPainMedications];
                                  updated[index].frequency = e.target.value;
                                  setCurrentPainMedications(updated);
                                }}
                              />
                              <Select
                                label="Effectiveness"
                                options={[
                                  { value: '', label: 'Select...' },
                                  { value: 'Significant relief', label: 'Significant relief' },
                                  { value: 'Moderate relief', label: 'Moderate relief' },
                                  { value: 'Minimal relief', label: 'Minimal relief' },
                                  { value: 'No relief', label: 'No relief' },
                                  { value: 'Unknown', label: 'Unknown' },
                                ]}
                                value={med.effectiveness}
                                onChange={(e) => {
                                  const updated = [...currentPainMedications];
                                  updated[index].effectiveness = e.target.value;
                                  setCurrentPainMedications(updated);
                                }}
                              />
                            </div>
                            <button
                              onClick={() => setCurrentPainMedications(currentPainMedications.filter((_, i) => i !== index))}
                              className="mt-2 p-1 hover:bg-red-100 rounded-lg transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-body-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No pain medications added yet</p>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentPainMedications([...currentPainMedications, { medication: '', dosage: '', frequency: '', effectiveness: '' }])}
                      className="mt-3 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Medication
                    </Button>
                    <p className="mt-2 text-body-xs text-gray-500">
                      <a href="#medical-history" className="text-blue-600 hover:underline">View Complete Medication List</a> (in Medical History section)
                    </p>
                  </div>
                </div>
              )}

              {/* 9. WORK / OCCUPATION DETAILS */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Work / Occupation Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        label="Job Title"
                        placeholder="e.g., Construction worker"
                        value={occupation || ''}
                        onChange={(e) => onOccupationChange && onOccupationChange(e.target.value)}
                        className="bg-blue-50"
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 5</p>
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Work Status
                      </label>
                      <div className="space-y-2">
                        {['Currently working full duty', 'Working with limitations', 'On leave', 'Disabled', 'Not working'].map((status) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="workStatus"
                              value={status}
                              checked={workStatus === status}
                              onChange={(e) => setWorkStatus(e.target.value)}
                              className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                            />
                            <span className="text-body-sm text-gray-700">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="Hours per Day"
                        placeholder="8"
                        value={workHoursPerDay}
                        onChange={(e) => setWorkHoursPerDay(e.target.value)}
                      />
                    </div>

                    <div>
                      <Select
                        label="Last Date Worked"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: 'Today', label: 'Today' },
                          { value: 'This week', label: 'This week' },
                          { value: 'This month', label: 'This month' },
                          { value: 'Longer ago', label: 'Longer ago' },
                          { value: 'Not applicable', label: 'Not applicable' },
                        ]}
                        value={lastDateWorked}
                        onChange={(e) => setLastDateWorked(e.target.value)}
                        className="bg-blue-50"
                      />
                      <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Primary Job Demands (Multi-select)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Sitting', 'Standing', 'Walking', 'Lifting', 'Carrying', 'Bending', 'Reaching', 'Computer use', 'Driving', 'Manual labor'].map((demand) => (
                          <label key={demand} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={jobDemands.includes(demand)}
                              onChange={() => toggleCheckbox(jobDemands, setJobDemands, demand)}
                              className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                            />
                            <span className="text-body-sm text-gray-700">{demand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Input
                        type="text"
                        label="Weight Lifted Regularly"
                        placeholder="e.g., 50 lbs"
                        value={weightLiftedRegularly}
                        onChange={(e) => setWeightLiftedRegularly(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Current Work Modifications
                      </label>
                      <textarea
                        value={workModifications}
                        onChange={(e) => setWorkModifications(e.target.value)}
                        placeholder="Describe current work modifications..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Return to Work Goal
                      </label>
                      <textarea
                        value={returnToWorkGoal}
                        onChange={(e) => setReturnToWorkGoal(e.target.value)}
                        placeholder="e.g., Full duty without restrictions"
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Work Restrictions from Physician
                      </label>
                      <textarea
                        value={workRestrictions}
                        onChange={(e) => setWorkRestrictions(e.target.value)}
                        placeholder="Describe physician restrictions..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 10. LIVING SITUATION / HOME ENVIRONMENT */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Living Situation / Home Environment</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Lives With"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: 'Alone', label: 'Alone' },
                          { value: 'Spouse/partner', label: 'Spouse/partner' },
                          { value: 'Family', label: 'Family' },
                          { value: 'Roommate', label: 'Roommate' },
                          { value: 'Assisted living', label: 'Assisted living' },
                        ]}
                        value={livesWith}
                        onChange={(e) => setLivesWith(e.target.value)}
                      />
                    </div>

                    <div>
                      <Select
                        label="Home Type"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: 'Single story', label: 'Single story' },
                          { value: 'Multi-story', label: 'Multi-story' },
                          { value: 'Apartment - which floor?', label: 'Apartment - which floor?' },
                          { value: 'Other', label: 'Other' },
                        ]}
                        value={homeType}
                        onChange={(e) => setHomeType(e.target.value)}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="Number of Stairs in Home"
                        placeholder="0"
                        value={stairsInHome}
                        onChange={(e) => setStairsInHome(e.target.value)}
                      />
                    </div>

                    <div>
                      <Select
                        label="Bedroom Location"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: 'Ground floor', label: 'Ground floor' },
                          { value: 'Upstairs', label: 'Upstairs' },
                          { value: 'Basement', label: 'Basement' },
                        ]}
                        value={bedroomLocation}
                        onChange={(e) => setBedroomLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <Select
                        label="Bathroom Location"
                        options={[
                          { value: '', label: 'Select...' },
                          { value: 'Ground floor', label: 'Ground floor' },
                          { value: 'Upstairs', label: 'Upstairs' },
                          { value: 'Same floor as bedroom', label: 'Same floor as bedroom' },
                          { value: 'Basement', label: 'Basement' },
                        ]}
                        value={bathroomLocation}
                        onChange={(e) => setBathroomLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Support System
                      </label>
                      <textarea
                        value={supportSystem}
                        onChange={(e) => setSupportSystem(e.target.value)}
                        placeholder="e.g., Spouse assists with household chores"
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Assistive Devices at Home (Multi-select)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Walker', 'Cane', 'Grab bars', 'Shower chair', 'None'].map((device) => (
                          <label key={device} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assistiveDevices.includes(device)}
                              onChange={() => toggleCheckbox(assistiveDevices, setAssistiveDevices, device)}
                              className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                            />
                            <span className="text-body-sm text-gray-700">{device}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Barriers to Therapy (Multi-select)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Transportation', 'Childcare', 'Work schedule', 'Financial', 'None'].map((barrier) => (
                          <label key={barrier} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={barriersToTherapy.includes(barrier)}
                              onChange={() => toggleCheckbox(barriersToTherapy, setBarriersToTherapy, barrier)}
                              className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                            />
                            <span className="text-body-sm text-gray-700">{barrier}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. PATIENT GOALS & EXPECTATIONS */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Patient Goals & Expectations</h4>
                  
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Short-term Goals (Patient's Words)
                    </label>
                    <textarea
                      value={shortTermGoals}
                      onChange={(e) => setShortTermGoals(e.target.value)}
                      placeholder="Patient's short-term goals..."
                      rows={3}
                      className="w-full px-2.5 py-1.5 border rounded-md text-body bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                    />
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Long-term Goals (Patient's Words)
                    </label>
                    <textarea
                      value={longTermGoals}
                      onChange={(e) => setLongTermGoals(e.target.value)}
                      placeholder="What do you want to be able to do again?"
                      rows={3}
                      className="w-full px-2.5 py-1.5 border rounded-md text-body bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                    />
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Timeline Expectations"
                      placeholder="e.g., Wants to be better in 6 weeks"
                      value={timelineExpectations}
                      onChange={(e) => setTimelineExpectations(e.target.value)}
                    />
                  </div>

                  <div>
                    <Select
                      label="Motivation Level (1-10)"
                      options={[
                        { value: '', label: 'Select...' },
                        { value: '1', label: '1 - Very Low' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                        { value: '5', label: '5 - Moderate' },
                        { value: '6', label: '6' },
                        { value: '7', label: '7' },
                        { value: '8', label: '8' },
                        { value: '9', label: '9' },
                        { value: '10', label: '10 - Very High' },
                      ]}
                      value={motivationLevel}
                      onChange={(e) => setMotivationLevel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Patient's Understanding of Problem
                    </label>
                    <textarea
                      value={patientUnderstanding}
                      onChange={(e) => setPatientUnderstanding(e.target.value)}
                      placeholder="What do you think is causing this?"
                      rows={2}
                      className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Prior PT Experience
                    </label>
                    <textarea
                      value={priorPTExperience}
                      onChange={(e) => setPriorPTExperience(e.target.value)}
                      placeholder="Describe prior PT experience if applicable..."
                      rows={2}
                      className="w-full px-2.5 py-1.5 border rounded-md text-body bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                    />
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated if answered yes in intake Step 3</p>
                  </div>
                </div>
              )}

              {/* 11a. PATIENT CONCERNS / QUESTIONS */}
              {isInitialEvaluation && patientConcerns.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Patient Concerns / Questions from Intake</h4>
                  
                  <div className="bg-gray-50 border border-cairos-border rounded-xl p-4">
                    <div className="space-y-2 mb-4">
                      {patientConcerns.map((concern) => (
                        <label key={concern} className="flex items-center gap-2 cursor-default">
                          <input
                            type="checkbox"
                            checked={true}
                            disabled
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                          />
                          <span className="text-body-sm text-gray-700">{concern}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-body-xs text-gray-500 italic mb-3">Auto-populated from intake Step 3 - Only checked items shown</p>
                    
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={patientConcernsNotes}
                        onChange={(e) => setPatientConcernsNotes(e.target.value)}
                        placeholder="Therapist notes about patient concerns..."
                        rows={3}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 12. MENTAL HEALTH SCREENING SUMMARY */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Mental Health Screening Results</h4>
                  
                  <div className="bg-gray-50 border border-cairos-border rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-body-sm font-medium text-gray-700 mb-1">
                        Depression Screening (PHQ-2): <span className="font-normal">[score]/6 - [interpretation]</span>
                      </p>
                      <p className="text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                    </div>
                    <div>
                      <p className="text-body-sm font-medium text-gray-700 mb-1">
                        Fear-avoidance beliefs: <span className="font-normal">[High/Moderate/Low]</span>
                      </p>
                      <p className="text-body-xs text-gray-500 italic">Auto-populated from intake Step 4</p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {}}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              )}

              {/* 13. PRIOR LEVEL OF FUNCTION (PLOF) */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Prior Level of Function (PLOF)</h4>
                  
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Describe patient's function level before this injury/condition
                    </label>
                    <textarea
                      value={priorLevelOfFunction}
                      onChange={(e) => setPriorLevelOfFunction(e.target.value)}
                      placeholder="e.g., Patient was independent in all ADLs, worked full-time as office manager, exercised 3x/week, cared for grandchildren on weekends"
                      rows={4}
                      className="w-full px-2.5 py-1.5 border rounded-md text-body bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                    />
                    <p className="mt-1 text-body-xs text-gray-500 italic">Auto-populated from intake form</p>
                  </div>
                </div>
              )}

              {/* 14. SPECIAL NEEDS / ADMINISTRATIVE NOTES */}
              {isInitialEvaluation && (
                <div className="space-y-4 pt-4 border-t border-cairos-border">
                  <h4 className="text-body font-semibold text-gray-900">Special Needs / Administrative Notes</h4>
                  
                  <div className="bg-gray-50 border border-cairos-border rounded-xl p-4">
                    <p className="text-body-xs text-gray-500 italic mb-3">Auto-populated from intake Step 4 - "Anything else we should know?"</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {['Needs work/school letter', 'Time-sensitive (visit before specific date)', 'Needs assistive device prescription (cane, wheelchair, etc.)', 'Needs exercise modifications', 'Has childcare constraints', 'Transportation barriers', 'Financial concerns'].map((need) => (
                        <label key={need} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={specialNeeds.includes(need)}
                            onChange={() => toggleCheckbox(specialNeeds, setSpecialNeeds, need)}
                            className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                          />
                          <span className="text-body-sm text-gray-700">{need}</span>
                        </label>
                      ))}
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={specialNeeds.includes('Language assistance needed')}
                          onChange={() => toggleCheckbox(specialNeeds, setSpecialNeeds, 'Language assistance needed')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Language assistance needed:</span>
                        {specialNeeds.includes('Language assistance needed') && (
                          <Input
                            type="text"
                            placeholder="language"
                            value={specialNeedsLanguage}
                            onChange={(e) => setSpecialNeedsLanguage(e.target.value)}
                            className="flex-1"
                          />
                        )}
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={specialNeeds.includes('Other')}
                          onChange={() => toggleCheckbox(specialNeeds, setSpecialNeeds, 'Other')}
                          className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary rounded"
                        />
                        <span className="text-body-sm text-gray-700">Other:</span>
                        {specialNeeds.includes('Other') && (
                          <Input
                            type="text"
                            placeholder="specify"
                            value={specialNeedsOther}
                            onChange={(e) => setSpecialNeedsOther(e.target.value)}
                            className="flex-1"
                          />
                        )}
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Therapist Notes
                      </label>
                      <textarea
                        value={specialNeedsTherapistNotes}
                        onChange={(e) => setSpecialNeedsTherapistNotes(e.target.value)}
                        placeholder="Additional administrative notes..."
                        rows={3}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Copy from Previous Document - Only show for Daily Notes, not Initial Evaluations */}
              {!isInitialEvaluation && previousDocuments.length > 0 && (
                <div className="relative" ref={copyMenuRef}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCopyMenuOpen(!isCopyMenuOpen)}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    Copy from Previous Note
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCopyMenuOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {isCopyMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-cairos-border rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-body-xs font-semibold text-gray-700 px-2 py-1 mb-1">Select a document to copy from:</div>
                        
                        <button
                          onClick={() => handleCopyFromDocument(null)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors mb-2 border-b border-cairos-border"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-body-xs font-medium text-gray-500 italic">None (Reset Fields)</div>
                              <div className="text-body-xs text-gray-400">Clear all subjective fields</div>
                            </div>
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                        </button>

                        {previousDocuments.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => handleCopyFromDocument(doc)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors mb-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-body-xs font-medium text-gray-900">{doc.type}</div>
                                <div className="text-body-xs text-gray-500">{formatDate(doc.date)}</div>
                                {doc.chiefComplaint && (
                                  <div className="text-body-xs text-gray-400 mt-1 line-clamp-1">
                                    {doc.chiefComplaint.substring(0, 60)}...
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Fields Grid - For Daily Notes */}
              {!isInitialEvaluation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Onset Date
                    </label>
                    <DatePicker
                      value={onsetDate}
                      onChange={onOnsetDateChange}
                      placeholder="e.g., Chronic pain that flared up 1 month ago"
                      allowApproximate={false}
                    />
                  </div>

                  {onTypeOfInjuryChange && (
                    <Select
                      label="Type of Injury"
                      options={[
                        { value: '', label: 'Select...' },
                        { value: 'acute', label: 'Acute' },
                        { value: 'chronic', label: 'Chronic' },
                        { value: 'post-surgical', label: 'Post-Surgical' },
                        { value: 'work-related', label: 'Work-Related' },
                      ]}
                      value={typeOfInjury || ''}
                      onChange={(e) => onTypeOfInjuryChange(e.target.value)}
                    />
                  )}

                  {onSpecificInjuryChange && (
                    <Select
                      label="Specific Injury"
                      options={[
                        { value: '', label: 'Select...' },
                        { value: 'strain', label: 'Strain' },
                        { value: 'sprain', label: 'Sprain' },
                        { value: 'fracture', label: 'Fracture' },
                        { value: 'dislocation', label: 'Dislocation' },
                      ]}
                      value={specificInjury || ''}
                      onChange={(e) => onSpecificInjuryChange(e.target.value)}
                    />
                  )}

                  {onAdditionalInjuryDetailsChange && (
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Additional Injury Details
                      </label>
                      <textarea
                        value={additionalInjuryDetails || ''}
                        onChange={(e) => onAdditionalInjuryDetailsChange(e.target.value)}
                        placeholder="e.g., possibly with radiculopathy, pain radiates to right leg"
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>
                  )}

                  {onSurgeryDateChange && (
                    <Input
                      type="date"
                      label="Surgery Date"
                      value={surgeryDate || ''}
                      onChange={(e) => onSurgeryDateChange(e.target.value)}
                    />
                  )}

                  {onSurgeryTypeChange && (
                    <Input
                      type="text"
                      label="Surgery Type"
                      placeholder="e.g., Lumbar fusion"
                      value={surgeryType || ''}
                      onChange={(e) => onSurgeryTypeChange(e.target.value)}
                    />
                  )}

                  {onOccupationChange && (
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <textarea
                        value={occupation || ''}
                        onChange={(e) => onOccupationChange(e.target.value)}
                        placeholder="e.g., Construction worker"
                        rows={2}
                        className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border resize-y"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Treatments Related To Condition - For Daily Notes */}
              {!isInitialEvaluation && onTreatmentsRelatedChange && (
                <div className="pt-4 border-t border-cairos-border">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-body-sm font-medium text-gray-700">
                      Treatments Related To Condition
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addTreatmentRelated}
                        className="flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add Items
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {treatmentsRelated.map((treatment) => (
                      <div
                        key={treatment.id}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-cairos-border"
                      >
                        <div className="flex-1">
                          {editingId === treatment.id ? (
                            <textarea
                              value={treatment.text}
                              onChange={(e) => updateTreatmentRelated(treatment.id, e.target.value)}
                              onBlur={() => setEditingId(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                  setEditingId(null);
                                }
                              }}
                              placeholder="Enter treatment related to condition..."
                              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[60px] resize-y"
                              autoFocus
                            />
                          ) : (
                            <div
                              onClick={() => setEditingId(treatment.id)}
                              className="w-full px-3 py-2 text-body text-gray-900 cursor-text min-h-[60px] flex items-center"
                            >
                              {treatment.text || <span className="text-gray-400">Click to edit...</span>}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteTreatmentRelated(treatment.id)}
                            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {treatmentsRelated.length === 0 && (
                      <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <p className="text-body-sm text-gray-500">No treatments added yet. Click "Add Items" to add one.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
};
