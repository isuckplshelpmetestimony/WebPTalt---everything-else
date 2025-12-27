'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { ChevronDown, ChevronUp, CheckCircle2, Plus, X, Trash2, Copy, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

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

interface SubjectiveSectionProps {
  chiefComplaint: string;
  onsetDate: string | Date;
  typeOfInjury?: string;
  specificInjury?: string;
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
  onSurgeryDateChange?: (value: string) => void;
  onSurgeryTypeChange?: (value: string) => void;
  onOccupationChange?: (value: string) => void;
  onTreatmentsRelatedChange?: (treatments: TreatmentRelated[]) => void;
  onCreateGoal?: (text: string) => void;
}

export const SubjectiveSection: React.FC<SubjectiveSectionProps> = ({
  chiefComplaint,
  onsetDate,
  typeOfInjury,
  specificInjury,
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

  const copyToColumn = (text: string) => {
    // This would copy to another column/section
    // For now, we'll just log it
    console.log('Copy to column:', text);
  };

  const handleCreateGoal = (text: string) => {
    if (onCreateGoal) {
      onCreateGoal(text);
    }
  };

  const handleCopyFromDocument = (document: PreviousDocument | null) => {
    if (document === null) {
      // Reset all fields
      onChiefComplaintChange('');
      onOnsetDateChange('');
      if (onTypeOfInjuryChange) onTypeOfInjuryChange('');
      if (onSpecificInjuryChange) onSpecificInjuryChange('');
      if (onSurgeryDateChange) onSurgeryDateChange('');
      if (onSurgeryTypeChange) onSurgeryTypeChange('');
      if (onOccupationChange) onOccupationChange('');
    } else {
      // Copy from document
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


  const isComplete = chiefComplaint.trim().length > 0;

  return (
    <Card className="p-5 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-gray-900">Subjective</h3>
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
                    
                    {/* None/Reset Option */}
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

          {/* Chief Complaint */}
          <div>
            <label className="block text-body-sm font-medium text-gray-700 mb-2">
              Chief Complaint
            </label>
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
              placeholder="Describe the patient's current condition, pain history, functional status, medical history, and previous surgeries..."
              className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[120px] resize-y"
            />
          </div>

          {/* Additional Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-gray-700 mb-2">
                Onset Date
              </label>
              <DatePicker
                value={onsetDate}
                onChange={onOnsetDateChange}
                placeholder={isInitialEvaluation ? "e.g., mid-March 2025 or select date" : "e.g., Chronic pain that flared up 1 month ago"}
                allowApproximate={isInitialEvaluation}
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
              <Input
                type="text"
                label="Occupation"
                placeholder="e.g., Construction worker"
                value={occupation || ''}
                onChange={(e) => onOccupationChange(e.target.value)}
              />
            )}
          </div>

          {/* Treatments Related To Condition */}
          {onTreatmentsRelatedChange && (
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
        </div>
      )}
    </Card>
  );
};
