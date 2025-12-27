'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, CheckCircle2, Plus, X, Trash2 } from 'lucide-react';

interface Goal {
  id: string;
  text: string;
  type?: 'short-term' | 'long-term';
}

interface GoalsSectionProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  onGoalsChange,
  isVisible = true,
  onToggleVisibility,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalType, setNewGoalType] = useState<'short-term' | 'long-term'>('short-term');

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
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-cairos-border">
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

