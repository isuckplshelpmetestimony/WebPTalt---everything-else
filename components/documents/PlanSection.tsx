'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, CheckCircle2, Sparkles, X, Copy, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

interface Goal {
  id: string;
  text: string;
  type?: 'short-term' | 'long-term';
}

interface AssessmentEntry {
  id: string;
  text: string;
}

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

interface PreviousDocument {
  id: string;
  type: string;
  date: Date;
  treatmentFrequency?: string;
  treatmentDuration?: string;
  treatmentPlan?: string;
}

interface PlanSectionProps {
  treatmentPlan: string;
  frequency: string;
  duration: string;
  goals?: Goal[];
  assessmentEntries?: AssessmentEntry[];
  objectiveTreatments?: Treatment[];
  currentFunctionalLimitations?: string;
  previousDocuments?: PreviousDocument[];
  onTreatmentPlanChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

export const PlanSection: React.FC<PlanSectionProps> = ({
  treatmentPlan,
  frequency,
  duration,
  goals = [],
  assessmentEntries = [],
  objectiveTreatments = [],
  currentFunctionalLimitations,
  previousDocuments = [],
  onTreatmentPlanChange,
  onFrequencyChange,
  onDurationChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopyMenuOpen, setIsCopyMenuOpen] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);

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

  const isComplete = treatmentPlan.trim().length > 0;

  const handleCopyFromDocument = (document: PreviousDocument | null) => {
    if (document === null) {
      // Reset all fields
      onFrequencyChange('');
      onDurationChange('');
      onTreatmentPlanChange('');
    } else {
      // Copy from document
      if (document.treatmentFrequency) {
        onFrequencyChange(document.treatmentFrequency);
      }
      if (document.treatmentDuration) {
        onDurationChange(document.treatmentDuration);
      }
      if (document.treatmentPlan) {
        onTreatmentPlanChange(document.treatmentPlan);
      }
    }
    setIsCopyMenuOpen(false);
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    
    // Basic AI generation - combine all selected information
    let generatedPlan = 'Treatment Plan:\n\n';
    
    // Add Goals
    if (goals.length > 0) {
      generatedPlan += 'Goals:\n';
      goals.forEach(goal => {
        const typeLabel = goal.type === 'short-term' ? 'Short-term' : 'Long-term';
        generatedPlan += `- ${typeLabel}: ${goal.text}\n`;
      });
      generatedPlan += '\n';
    }
    
    // Add Assessment findings
    if (assessmentEntries.length > 0) {
      generatedPlan += 'Assessment Findings:\n';
      assessmentEntries.forEach(entry => {
        if (entry.text.trim()) {
          generatedPlan += `- ${entry.text}\n`;
        }
      });
      generatedPlan += '\n';
    }
    
    // Add Functional Limitations
    if (currentFunctionalLimitations && currentFunctionalLimitations.trim()) {
      generatedPlan += `Current Functional Limitations: ${currentFunctionalLimitations}\n\n`;
    }
    
    // Add Objective Treatments performed
    const performedTreatments = objectiveTreatments.filter(t => t.status === 'performed');
    if (performedTreatments.length > 0) {
      generatedPlan += 'Treatments Performed:\n';
      performedTreatments.forEach(treatment => {
        generatedPlan += `- ${treatment.description} (${treatment.cptCode})`;
        if (treatment.justification) {
          generatedPlan += ` - ${treatment.justification}`;
        }
        generatedPlan += '\n';
      });
      generatedPlan += '\n';
    }
    
    // Add recommended plan
    generatedPlan += 'Recommended Plan:\n';
    generatedPlan += 'Continue with physical therapy interventions focusing on the identified goals and addressing current functional limitations. ';
    generatedPlan += 'Treatment will consist of therapeutic exercises, manual therapy, and modalities as indicated. ';
    generatedPlan += 'Progress will be monitored and plan adjusted based on patient response.\n\n';
    
    if (frequency) {
      generatedPlan += `Frequency: ${frequency}\n`;
    }
    if (duration) {
      generatedPlan += `Duration: ${duration}\n`;
    }
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onTreatmentPlanChange(generatedPlan);
    setIsGenerating(false);
  };

  return (
    <Card className="p-5 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-gray-900">Plan</h3>
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
        <div className="space-y-4 pt-4 border-t border-cairos-border">
          {/* Copy from Previous Document */}
          {previousDocuments.length > 0 && (
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
                    
                    {/* None/Reset Option */}
                    <button
                      onClick={() => handleCopyFromDocument(null)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors mb-2 border-b border-cairos-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-body-xs font-medium text-gray-500 italic">None (Reset Fields)</div>
                          <div className="text-body-xs text-gray-400">Clear all plan fields</div>
                        </div>
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>

                    {/* Previous Documents */}
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
                            {(doc.treatmentFrequency || doc.treatmentDuration) && (
                              <div className="text-body-xs text-gray-400 mt-1 line-clamp-1">
                                {doc.treatmentFrequency && doc.treatmentDuration 
                                  ? `${doc.treatmentFrequency} • ${doc.treatmentDuration}`
                                  : doc.treatmentFrequency || doc.treatmentDuration}
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

          {/* Summary Section */}
          <div className="space-y-3">
            <h4 className="text-body-sm font-semibold text-gray-700">Summary of Selected Information</h4>
            
            {/* Goals Summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-xs font-semibold text-gray-700">Goals</span>
              </div>
              {goals.length > 0 ? (
                <div className="space-y-1">
                  {goals.map((goal) => (
                    <div key={goal.id} className="text-body-xs text-gray-600">
                      <span className="font-medium">{goal.type === 'short-term' ? 'Short-term' : 'Long-term'}:</span> {goal.text}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-xs text-gray-400 italic">No goals added yet</p>
              )}
            </div>

            {/* Assessment Summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-xs font-semibold text-gray-700">Assessment Findings</span>
              </div>
              {assessmentEntries.length > 0 && assessmentEntries.some(e => e.text.trim()) ? (
                <div className="space-y-1">
                  {assessmentEntries.filter(e => e.text.trim()).map((entry) => (
                    <div key={entry.id} className="text-body-xs text-gray-600">
                      • {entry.text}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-xs text-gray-400 italic">No assessment findings added yet</p>
              )}
            </div>

            {/* Functional Limitations Summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-xs font-semibold text-gray-700">Current Functional Limitations</span>
              </div>
              {currentFunctionalLimitations && currentFunctionalLimitations.trim() ? (
                <div className="text-body-xs text-gray-600">
                  {currentFunctionalLimitations}
                </div>
              ) : (
                <p className="text-body-xs text-gray-400 italic">No functional limitations documented yet</p>
              )}
            </div>

            {/* Objective Treatments Summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-xs font-semibold text-gray-700">Treatments Performed</span>
              </div>
              {objectiveTreatments.length > 0 && objectiveTreatments.some(t => t.status === 'performed' && t.description.trim()) ? (
                <div className="space-y-1">
                  {objectiveTreatments
                    .filter(t => t.status === 'performed' && t.description.trim())
                    .map((treatment) => (
                      <div key={treatment.id} className="text-body-xs text-gray-600">
                        • {treatment.description} ({treatment.cptCode}) - {treatment.totalMinutes} min
                        {treatment.justification && (
                          <span className="text-gray-500"> - {treatment.justification}</span>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-body-xs text-gray-400 italic">No treatments performed yet</p>
              )}
            </div>
          </div>

          {/* Auto-generate Button */}
          <div className="pt-4 border-t border-cairos-border">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAutoGenerate}
              disabled={isGenerating || (goals.length === 0 && assessmentEntries.length === 0 && !currentFunctionalLimitations && objectiveTreatments.length === 0)}
              className="flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Auto-generate Treatment Plan'}
            </Button>
          </div>

          {/* Treatment Plan Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-body-sm font-medium text-gray-700">
                Treatment Plan
              </label>
              {treatmentPlan && (
                <button
                  onClick={() => onTreatmentPlanChange('')}
                  className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Clear text"
                  title="Clear text"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <textarea
              id="treatment-plan"
              value={treatmentPlan}
              onChange={(e) => onTreatmentPlanChange(e.target.value)}
              onFocus={() => {
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('setActiveTextArea', { detail: 'treatment-plan' });
                  window.dispatchEvent(event);
                }
              }}
              placeholder="Treatment plan will be generated based on selected information, or enter manually..."
              className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[200px] resize-y"
            />
          </div>

          {/* Frequency and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Treatment Frequency"
              placeholder="e.g., 3x/week for first 2 weeks, then 2x/week"
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value)}
            />

            <Input
              type="text"
              label="Duration"
              placeholder="e.g., 4 weeks total"
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
