'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ChevronDown, ChevronUp, CheckCircle2, Plus, X, ArrowUp, ArrowDown, Trash2, Copy, ChevronRight, Settings, Target } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ProblemList, Problem } from './ProblemList';

interface AssessmentEntry {
  id: string;
  text: string;
}

interface Goal {
  id: string;
  text: string;
  type?: 'short-term' | 'long-term';
}

interface PreviousDocument {
  id: string;
  type: string;
  date: Date;
  assessmentEntries?: AssessmentEntry[];
  problems?: Problem[];
  longTermGoals?: Goal[];
  overallAssessment?: string;
  treatmentFrequency?: string;
  treatmentDuration?: string;
}

interface AssessmentSectionProps {
  assessmentEntries: AssessmentEntry[];
  problems?: Problem[];
  comments: string;
  problemComments?: string;
  potentialToReachGoals?: string;
  overallAssessment?: string;
  previousDocuments?: PreviousDocument[];
  onAssessmentEntriesChange: (entries: AssessmentEntry[]) => void;
  onProblemsChange?: (problems: Problem[]) => void;
  onCommentsChange: (value: string) => void;
  onProblemCommentsChange?: (value: string) => void;
  onPotentialToReachGoalsChange?: (value: string) => void;
  onOverallAssessmentChange?: (value: string) => void;
  onCreateGoal?: (text: string) => void;
  onCopyToColumn?: (text: string, target: 'plan' | 'goals') => void;
}

const potentialToReachGoalsOptions = [
  { value: '', label: 'Select...' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'guarded', label: 'Guarded' },
];

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  assessmentEntries,
  problems = [],
  comments,
  problemComments = '',
  potentialToReachGoals,
  overallAssessment,
  previousDocuments = [],
  onAssessmentEntriesChange,
  onProblemsChange,
  onCommentsChange,
  onProblemCommentsChange,
  onPotentialToReachGoalsChange,
  onOverallAssessmentChange,
  onCreateGoal,
  onCopyToColumn,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [problemListExpanded, setProblemListExpanded] = useState(true);
  const [assessmentExpanded, setAssessmentExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCopyMenuOpen, setIsCopyMenuOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
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

  const addAssessmentEntry = () => {
    const newEntry: AssessmentEntry = {
      id: Date.now().toString(),
      text: '',
    };
    onAssessmentEntriesChange([...assessmentEntries, newEntry]);
    setEditingId(newEntry.id);
  };

  const updateAssessmentEntry = (id: string, text: string) => {
    onAssessmentEntriesChange(
      assessmentEntries.map(entry => entry.id === id ? { ...entry, text } : entry)
    );
  };

  const deleteAssessmentEntry = (id: string) => {
    onAssessmentEntriesChange(assessmentEntries.filter(entry => entry.id !== id));
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    const newEntries = [...assessmentEntries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newEntries.length) {
      [newEntries[index], newEntries[targetIndex]] = [newEntries[targetIndex], newEntries[index]];
      onAssessmentEntriesChange(newEntries);
    }
  };

  const handleCopyToColumn = (entryId: string, target: 'plan' | 'goals') => {
    const entry = assessmentEntries.find(e => e.id === entryId);
    if (entry && entry.text.trim() && onCopyToColumn) {
      onCopyToColumn(entry.text, target);
    }
  };

  const handleCreateGoal = (entryId: string) => {
    const entry = assessmentEntries.find(e => e.id === entryId);
    if (entry && entry.text.trim() && onCreateGoal) {
      onCreateGoal(entry.text);
    }
  };

  const handleCopyFromDocument = (document: PreviousDocument | null) => {
    if (document === null) {
      // Reset all fields
      onAssessmentEntriesChange([]);
      if (onProblemsChange) onProblemsChange([]);
      if (onOverallAssessmentChange) onOverallAssessmentChange('');
      if (onProblemCommentsChange) onProblemCommentsChange('');
    } else {
      // Copy from document
      if (document.assessmentEntries && document.assessmentEntries.length > 0) {
        onAssessmentEntriesChange(document.assessmentEntries);
      }
      if (document.problems && document.problems.length > 0 && onProblemsChange) {
        onProblemsChange(document.problems);
      }
      if (document.overallAssessment && onOverallAssessmentChange) {
        onOverallAssessmentChange(document.overallAssessment);
      }
    }
    setIsCopyMenuOpen(false);
  };

  const isComplete = (problems.length > 0 || assessmentEntries.length > 0 && assessmentEntries.some(e => e.text.trim().length > 0)) || comments.trim().length > 0;

  return (
    <Card className="p-5 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-gray-900">Assessment</h3>
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
                          <div className="text-body-xs text-gray-400">Clear all assessment fields</div>
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
                            {(doc.assessmentEntries && doc.assessmentEntries.length > 0) || (doc.problems && doc.problems.length > 0) && (
                              <div className="text-body-xs text-gray-400 mt-1 line-clamp-1">
                                {doc.assessmentEntries?.length || 0} assessment entries, {doc.problems?.length || 0} problems
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

          {/* Problem List Section */}
          {onProblemsChange && (
            <div className="border border-cairos-border rounded-xl p-4">
              <button
                onClick={() => setProblemListExpanded(!problemListExpanded)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h4 className="text-body-sm font-semibold text-gray-700">Problem List</h4>
                {problemListExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {problemListExpanded && (
                <ProblemList
                  problems={problems}
                  onProblemsChange={onProblemsChange}
                  onCommentsChange={onProblemCommentsChange}
                  comments={problemComments}
                />
              )}
            </div>
          )}

          {/* Assessment Section */}
          <div className="border border-cairos-border rounded-xl p-4">
            <button
              onClick={() => setAssessmentExpanded(!assessmentExpanded)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-body-sm font-semibold text-gray-700">Assessment</h4>
              {assessmentExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {assessmentExpanded && (
              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addAssessmentEntry}
                    className="flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Items
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5"
                    title="Customize Drop Downs"
                  >
                    <Settings className="w-4 h-4" />
                    Customize Drop Downs
                  </Button>
                </div>

                {/* Assessment Entries */}
                <div className="space-y-3">
                  {assessmentEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-2 p-3 rounded-xl border border-cairos-border transition-colors ${
                        selectedEntryId === entry.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedEntryId(entry.id)}
                    >
                      <div className="flex-1">
                        {editingId === entry.id ? (
                          <textarea
                            value={entry.text}
                            onChange={(e) => updateAssessmentEntry(entry.id, e.target.value)}
                            onBlur={() => {
                              setEditingId(null);
                              setSelectedEntryId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                setEditingId(null);
                                setSelectedEntryId(null);
                              }
                            }}
                            placeholder="Enter assessment entry..."
                            className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[60px] resize-y"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(entry.id);
                            }}
                            className="w-full px-3 py-2 text-body text-gray-900 cursor-text min-h-[60px] flex items-center"
                          >
                            {entry.text || <span className="text-gray-400">Click to edit...</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveEntry(index, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move up"
                        >
                          <ArrowUp className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveEntry(index, 'down');
                          }}
                          disabled={index === assessmentEntries.length - 1}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move down"
                        >
                          <ArrowDown className="w-4 h-4 text-gray-500" />
                        </button>
                        {onCopyToColumn && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyToColumn(entry.id, 'plan');
                              }}
                              disabled={!entry.text.trim()}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Copy To Column (Plan)"
                            >
                              <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyToColumn(entry.id, 'goals');
                              }}
                              disabled={!entry.text.trim()}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Copy To Column (Goals)"
                            >
                              <Copy className="w-4 h-4 text-gray-500 rotate-90" />
                            </button>
                          </>
                        )}
                        {onCreateGoal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateGoal(entry.id);
                            }}
                            disabled={!entry.text.trim()}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Create Goal"
                          >
                            <Target className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAssessmentEntry(entry.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                          aria-label="Delete Item"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {assessmentEntries.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-body-sm text-gray-500">No assessment entries yet. Click "Add Items" to add one.</p>
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-body-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => onCommentsChange(e.target.value)}
                    onFocus={() => {
                      if (typeof window !== 'undefined') {
                        const event = new CustomEvent('setActiveTextArea', { detail: 'comments' });
                        window.dispatchEvent(event);
                      }
                    }}
                    placeholder="Additional assessment comments..."
                    className="w-full px-3 py-2 border border-cairos-border rounded-xl text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[120px] resize-y"
                  />
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onPotentialToReachGoalsChange && (
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Potential To Reach Goals
                      </label>
                      <Select
                        options={potentialToReachGoalsOptions}
                        value={potentialToReachGoals || ''}
                        onChange={(e) => onPotentialToReachGoalsChange(e.target.value)}
                      />
                    </div>
                  )}

                  {onOverallAssessmentChange && (
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Overall Assessment
                      </label>
                      <Input
                        type="text"
                        placeholder="Overall assessment summary"
                        value={overallAssessment || ''}
                        onChange={(e) => onOverallAssessmentChange(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
