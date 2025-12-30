'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, CheckCircle2, Plus, X, Trash2, Copy, ChevronRight, Mic } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

interface Goal {
  id: string;
  text: string;
  type?: 'short-term' | 'long-term';
}

interface PreviousDocument {
  id: string;
  type: string;
  date: Date;
  goals?: Goal[];
}

interface GoalsSectionProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  previousDocuments?: PreviousDocument[];
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  onGoalsChange,
  isVisible = true,
  onToggleVisibility,
  previousDocuments = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalType, setNewGoalType] = useState<'short-term' | 'long-term'>('short-term');
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

  const handleCopyFromDocument = (document: PreviousDocument | null) => {
    if (document === null) {
      // Reset all goals
      onGoalsChange([]);
    } else if (document.goals && document.goals.length > 0) {
      // Copy goals from document, preserving IDs
      const copiedGoals = document.goals.map(goal => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: goal.text,
        type: goal.type || 'short-term',
      }));
      onGoalsChange(copiedGoals);
    }
    setIsCopyMenuOpen(false);
  };

  const addGoal = () => {
    if (newGoalText.trim()) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        text: newGoalText.trim(),
        type: newGoalType,
      };
      onGoalsChange([...goals, newGoal]);
      setNewGoalText('');
      setNewGoalType('short-term');
    }
  };

  const updateGoal = (id: string, text: string) => {
    onGoalsChange(
      goals.map(goal => goal.id === id ? { ...goal, text } : goal)
    );
  };

  const deleteGoal = (id: string) => {
    onGoalsChange(goals.filter(goal => goal.id !== id));
  };

  const isComplete = goals.length > 0 && goals.some(g => g.text.trim().length > 0);

  if (!isVisible) return null;

  return (
    <Card className="p-5 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-gray-900">Goals</h3>
          {isComplete && (
            <CheckCircle2 className="w-4 h-4 text-cairos-success" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5 text-gray-400" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
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
                          <div className="text-body-xs text-gray-400">Clear all goals</div>
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
                            {doc.goals && doc.goals.length > 0 && (
                              <div className="text-body-xs text-gray-400 mt-1 line-clamp-1">
                                {doc.goals.length} goal{doc.goals.length !== 1 ? 's' : ''}
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

          {/* Add New Goal */}
          <div className="flex gap-2">
            <select
              value={newGoalType}
              onChange={(e) => setNewGoalType(e.target.value as 'short-term' | 'long-term')}
              className="px-3 py-2 border border-cairos-border rounded-lg text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
            >
              <option value="short-term">Short-term</option>
              <option value="long-term">Long-term</option>
            </select>
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGoal();
                }
              }}
              placeholder="Enter goal..."
              className="flex-1 px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addGoal}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {/* Short-term Goals */}
            {goals.filter(g => g.type === 'short-term').length > 0 && (
              <div>
                <h4 className="text-body-sm font-semibold text-gray-700 mb-2">Short-term Goals</h4>
                <div className="space-y-2">
                  {goals
                    .filter(g => g.type === 'short-term')
                    .map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-cairos-border"
                      >
                        <div className="flex-1">
                          {editingId === goal.id ? (
                            <textarea
                              value={goal.text}
                              onChange={(e) => updateGoal(goal.id, e.target.value)}
                              onBlur={() => setEditingId(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                  setEditingId(null);
                                }
                              }}
                              placeholder="Enter goal..."
                              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[60px] resize-y"
                              autoFocus
                            />
                          ) : (
                            <div
                              onClick={() => setEditingId(goal.id)}
                              className="w-full px-3 py-2 text-body text-gray-900 cursor-text min-h-[60px] flex items-center"
                            >
                              {goal.text || <span className="text-gray-400">Click to edit...</span>}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                          aria-label="Delete goal"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Long-term Goals */}
            {goals.filter(g => g.type === 'long-term').length > 0 && (
              <div>
                <h4 className="text-body-sm font-semibold text-gray-700 mb-2">Long-term Goals</h4>
                <div className="space-y-2">
                  {goals
                    .filter(g => g.type === 'long-term')
                    .map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-cairos-border"
                      >
                        <div className="flex-1">
                          {editingId === goal.id ? (
                            <textarea
                              value={goal.text}
                              onChange={(e) => updateGoal(goal.id, e.target.value)}
                              onBlur={() => setEditingId(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                  setEditingId(null);
                                }
                              }}
                              placeholder="Enter goal..."
                              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[60px] resize-y"
                              autoFocus
                            />
                          ) : (
                            <div
                              onClick={() => setEditingId(goal.id)}
                              className="w-full px-3 py-2 text-body text-gray-900 cursor-text min-h-[60px] flex items-center"
                            >
                              {goal.text || <span className="text-gray-400">Click to edit...</span>}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                          aria-label="Delete goal"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {goals.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-body-sm text-gray-500">No goals added yet. Add a goal above.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

