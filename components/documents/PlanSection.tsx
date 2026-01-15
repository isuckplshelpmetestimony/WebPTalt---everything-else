'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ChevronDown, ChevronUp, CheckCircle2, Sparkles, X, Copy, ChevronRight, Plus, Trash2, ArrowUp, ArrowDown, Mic } from 'lucide-react';
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

interface Recommendation {
  id: string;
  text: string;
  frequency?: string;
  duration?: string;
}

interface PreviousDocument {
  id: string;
  type: string;
  date: Date;
  treatmentFrequency?: string;
  treatmentDuration?: string;
  treatmentPlan?: string;
  recommendPT?: boolean;
  otherRecommendations?: Recommendation[];
}

interface PlanSectionProps {
  treatmentPlan: string;
  frequency: string;
  duration: string;
  recommendPT?: boolean;
  otherRecommendations?: Recommendation[];
  goals?: Goal[];
  assessmentEntries?: AssessmentEntry[];
  objectiveTreatments?: Treatment[];
  currentFunctionalLimitations?: string;
  previousDocuments?: PreviousDocument[];
  onTreatmentPlanChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onRecommendPTChange?: (value: boolean) => void;
  onOtherRecommendationsChange?: (recommendations: Recommendation[]) => void;
}

const frequencyOptions = [
  { value: '', label: 'Select frequency...' },
  { value: '1x/week', label: '1x/week' },
  { value: '2x/week', label: '2x/week' },
  { value: '3x/week', label: '3x/week' },
  { value: '4x/week', label: '4x/week' },
  { value: '5x/week', label: '5x/week' },
  { value: 'Daily', label: 'Daily' },
  { value: '2x/week for first 2 weeks, then 1x/week', label: '2x/week for first 2 weeks, then 1x/week' },
  { value: '3x/week for first 2 weeks, then 2x/week', label: '3x/week for first 2 weeks, then 2x/week' },
  { value: '3x/week for first 4 weeks, then 2x/week', label: '3x/week for first 4 weeks, then 2x/week' },
];

const durationOptions = [
  { value: '', label: 'Select duration...' },
  { value: '2 weeks', label: '2 weeks' },
  { value: '3 weeks', label: '3 weeks' },
  { value: '4 weeks', label: '4 weeks' },
  { value: '6 weeks', label: '6 weeks' },
  { value: '8 weeks', label: '8 weeks' },
  { value: '12 weeks', label: '12 weeks' },
  { value: '4-6 weeks', label: '4-6 weeks' },
  { value: '6-8 weeks', label: '6-8 weeks' },
  { value: '8-12 weeks', label: '8-12 weeks' },
];

export const PlanSection: React.FC<PlanSectionProps> = ({
  treatmentPlan,
  frequency,
  duration,
  recommendPT = false,
  otherRecommendations = [],
  goals = [],
  assessmentEntries = [],
  objectiveTreatments = [],
  currentFunctionalLimitations,
  previousDocuments = [],
  onTreatmentPlanChange,
  onFrequencyChange,
  onDurationChange,
  onRecommendPTChange,
  onOtherRecommendationsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopyMenuOpen, setIsCopyMenuOpen] = useState(false);
  const [editingRecommendationId, setEditingRecommendationId] = useState<string | null>(null);
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

  const isComplete = treatmentPlan.trim().length > 0 || recommendPT || otherRecommendations.length > 0;

  const handleCopyFromDocument = (document: PreviousDocument | null) => {
    if (document === null) {
      // Reset all fields
      onFrequencyChange('');
      onDurationChange('');
      onTreatmentPlanChange('');
      if (onRecommendPTChange) onRecommendPTChange(false);
      if (onOtherRecommendationsChange) onOtherRecommendationsChange([]);
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
      if (document.recommendPT !== undefined && onRecommendPTChange) {
        onRecommendPTChange(document.recommendPT);
      }
      if (document.otherRecommendations && onOtherRecommendationsChange) {
        onOtherRecommendationsChange(document.otherRecommendations);
      }
    }
    setIsCopyMenuOpen(false);
  };

  const addRecommendation = () => {
    if (!onOtherRecommendationsChange) return;
    const newRecommendation: Recommendation = {
      id: Date.now().toString(),
      text: '',
    };
    onOtherRecommendationsChange([...otherRecommendations, newRecommendation]);
    setEditingRecommendationId(newRecommendation.id);
  };

  const updateRecommendation = (id: string, updates: Partial<Recommendation>) => {
    if (!onOtherRecommendationsChange) return;
    onOtherRecommendationsChange(
      otherRecommendations.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  };

  const deleteRecommendation = (id: string) => {
    if (!onOtherRecommendationsChange) return;
    onOtherRecommendationsChange(otherRecommendations.filter(r => r.id !== id));
  };

  const moveRecommendation = (index: number, direction: 'up' | 'down') => {
    if (!onOtherRecommendationsChange) return;
    const newRecommendations = [...otherRecommendations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newRecommendations.length) {
      [newRecommendations[index], newRecommendations[targetIndex]] = [newRecommendations[targetIndex], newRecommendations[index]];
      onOtherRecommendationsChange(newRecommendations);
    }
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    
    // Enhanced AI generation - more intelligent and contextual
    let generatedPlan = '';
    
    // Add recommendation header if PT is recommended
    if (recommendPT) {
      generatedPlan += 'Recommend Physical Therapy\n\n';
    }
    
    // Add other recommendations
    if (otherRecommendations.length > 0) {
      generatedPlan += 'Other Recommendations:\n';
      otherRecommendations.forEach(rec => {
        if (rec.text.trim()) {
          generatedPlan += `- ${rec.text}`;
          if (rec.frequency && rec.duration) {
            generatedPlan += ` (${rec.frequency} for ${rec.duration})`;
          }
          generatedPlan += '\n';
        }
      });
      generatedPlan += '\n';
    }
    
    // Add Goals with smart context
    if (goals.length > 0) {
      generatedPlan += 'Treatment Goals:\n';
      const shortTermGoals = goals.filter(g => g.type === 'short-term');
      const longTermGoals = goals.filter(g => g.type === 'long-term');
      
      if (shortTermGoals.length > 0) {
        generatedPlan += 'Short-term Goals:\n';
        shortTermGoals.forEach(goal => {
          generatedPlan += `- ${goal.text}\n`;
        });
      }
      
      if (longTermGoals.length > 0) {
        generatedPlan += 'Long-term Goals:\n';
        longTermGoals.forEach(goal => {
          generatedPlan += `- ${goal.text}\n`;
        });
      }
      generatedPlan += '\n';
    }
    
    // Add Assessment findings with context
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
    
    // Add Objective Treatments performed with justification
    const performedTreatments = objectiveTreatments.filter(t => t.status === 'performed');
    if (performedTreatments.length > 0) {
      generatedPlan += 'Treatments Performed:\n';
      performedTreatments.forEach(treatment => {
        generatedPlan += `- ${treatment.description} (${treatment.cptCode})`;
        if (treatment.justification) {
          generatedPlan += ` - ${treatment.justification}`;
        }
        if (treatment.totalMinutes > 0) {
          generatedPlan += ` - ${treatment.totalMinutes} minutes`;
        }
        generatedPlan += '\n';
      });
      generatedPlan += '\n';
    }
    
    // Add recommended plan with intelligent suggestions
    generatedPlan += 'Recommended Treatment Plan:\n';
    
    // Smart plan generation based on findings
    if (goals.length > 0) {
      generatedPlan += 'Treatment will focus on achieving the identified goals through evidence-based interventions. ';
    }
    
    if (currentFunctionalLimitations && currentFunctionalLimitations.trim()) {
      generatedPlan += 'Addressing current functional limitations will be prioritized. ';
    }
    
    if (performedTreatments.length > 0) {
      const treatmentTypes = performedTreatments.map(t => {
        if (t.cptCode === '97110') return 'therapeutic exercise';
        if (t.cptCode === '97140') return 'manual therapy';
        if (t.cptCode === '97112') return 'neuromuscular re-education';
        return 'physical therapy interventions';
      });
      const uniqueTypes = [...new Set(treatmentTypes)];
      generatedPlan += `Treatment will consist of ${uniqueTypes.join(', ')} as indicated. `;
    } else {
      generatedPlan += 'Treatment will consist of therapeutic exercises, manual therapy, and modalities as indicated. ';
    }
    
    generatedPlan += 'Progress will be monitored regularly and the plan will be adjusted based on patient response and goal achievement.\n\n';
    
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
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <h3 className="text-h3 text-gray-900">Plan</h3>
          {isComplete && (
            <CheckCircle2 className="w-4 h-4 text-cairos-success" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5 text-gray-400" />
          </button>
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

          {/* Recommendations Section */}
          <div className="border border-cairos-border rounded-xl p-4">
            <div className="space-y-4">
              {/* Recommend PT Checkbox */}
              {onRecommendPTChange && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recommend-pt"
                    checked={recommendPT}
                    onChange={(e) => onRecommendPTChange(e.target.checked)}
                    className="w-4 h-4 text-cairos-primary border-cairos-border rounded focus:ring-2 focus:ring-cairos-primary"
                  />
                  <label htmlFor="recommend-pt" className="text-body-sm font-medium text-gray-700 cursor-pointer">
                    Recommend PT
                  </label>
                </div>
              )}

              {/* Other Recommendations */}
              {onOtherRecommendationsChange && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-body-sm font-semibold text-gray-700">Other Recommendations</h4>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addRecommendation}
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Items
                    </Button>
                  </div>

                  {otherRecommendations.length > 0 ? (
                    <div className="space-y-3">
                      {otherRecommendations.map((rec, index) => (
                        <div
                          key={rec.id}
                          className="p-3 bg-gray-50 rounded-xl border border-cairos-border"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              {editingRecommendationId === rec.id ? (
                                <textarea
                                  value={rec.text}
                                  onChange={(e) => updateRecommendation(rec.id, { text: e.target.value })}
                                  onBlur={() => setEditingRecommendationId(null)}
                                  placeholder="Enter recommendation..."
                                  className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[60px] resize-y"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  onClick={() => setEditingRecommendationId(rec.id)}
                                  className="w-full px-3 py-2 text-body text-gray-900 cursor-text min-h-[60px] flex items-center"
                                >
                                  {rec.text || <span className="text-gray-400">Click to edit...</span>}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveRecommendation(index, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Move up"
                              >
                                <ArrowUp className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={() => moveRecommendation(index, 'down')}
                                disabled={index === otherRecommendations.length - 1}
                                className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Move down"
                              >
                                <ArrowDown className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={() => deleteRecommendation(rec.id)}
                                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                                aria-label="Delete Item"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-body-xs font-medium text-gray-700 mb-1">Frequency</label>
                              <Select
                                options={frequencyOptions}
                                value={rec.frequency || ''}
                                onChange={(e) => updateRecommendation(rec.id, { frequency: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-body-xs font-medium text-gray-700 mb-1">Duration</label>
                              <Select
                                options={durationOptions}
                                value={rec.duration || ''}
                                onChange={(e) => updateRecommendation(rec.id, { duration: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <p className="text-body-sm text-gray-500">No recommendations added yet. Click "Add Items" to add one.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Frequency and Duration (for overall plan) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cairos-border">
                <div>
                  <label className="block text-body-sm font-medium text-gray-700 mb-2">Treatment Frequency</label>
                  <Select
                    options={frequencyOptions}
                    value={frequency}
                    onChange={(e) => onFrequencyChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-medium text-gray-700 mb-2">Duration</label>
                  <Select
                    options={durationOptions}
                    value={duration}
                    onChange={(e) => onDurationChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-3">
            <h4 className="text-body-sm font-semibold text-gray-700">Summary of Selected Information</h4>
            
            {/* Goals Summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border hover:bg-gray-100 transition-colors cursor-pointer">
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
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border hover:bg-gray-100 transition-colors cursor-pointer">
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
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border hover:bg-gray-100 transition-colors cursor-pointer">
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
            <div className="p-3 bg-gray-50 rounded-xl border border-cairos-border hover:bg-gray-100 transition-colors cursor-pointer">
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
              disabled={isGenerating || (goals.length === 0 && assessmentEntries.length === 0 && !currentFunctionalLimitations && objectiveTreatments.length === 0 && !recommendPT && otherRecommendations.length === 0)}
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
        </div>
      )}
    </Card>
  );
};
