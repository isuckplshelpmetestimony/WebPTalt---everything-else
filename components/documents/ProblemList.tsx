'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Plus, X, ArrowUp, ArrowDown, Trash2, Settings, Search } from 'lucide-react';
import { getAllProblems, ProblemTemplate } from '@/lib/constants/problemTemplates';

export interface Problem {
  id: string;
  value: string;
  label: string;
  comments?: string;
}

interface ProblemListProps {
  problems: Problem[];
  onProblemsChange: (problems: Problem[]) => void;
  onCommentsChange?: (comments: string) => void;
  comments?: string;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onProblemsChange,
  onCommentsChange,
  comments = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const problemOptions = getAllProblems();
  const filteredOptions = problemOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProblem = () => {
    const newProblem: Problem = {
      id: Date.now().toString(),
      value: '',
      label: '',
    };
    onProblemsChange([...problems, newProblem]);
    setEditingId(newProblem.id);
  };

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    onProblemsChange(
      problems.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const deleteProblem = (id: string) => {
    onProblemsChange(problems.filter(p => p.id !== id));
  };

  const moveProblem = (index: number, direction: 'up' | 'down') => {
    const newProblems = [...problems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newProblems.length) {
      [newProblems[index], newProblems[targetIndex]] = [newProblems[targetIndex], newProblems[index]];
      onProblemsChange(newProblems);
    }
  };

  const handleProblemSelect = (id: string, value: string) => {
    const selectedOption = problemOptions.find(opt => opt.value === value);
    if (selectedOption) {
      updateProblem(id, { value: selectedOption.value, label: selectedOption.label });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-body-sm font-semibold text-gray-700">Problem List</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addProblem}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Problems
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
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Problems (Ctrl-D)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="flex-1 px-2 py-1 text-body-xs border border-cairos-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
          />
        </div>
        {isSearchOpen && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (editingId && option.value) {
                      handleProblemSelect(editingId, option.value);
                      setEditingId(null);
                    }
                    setIsSearchOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-body-xs"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-body-xs text-gray-500">No matches found</div>
            )}
          </div>
        )}
      </div>

      {/* Problems List */}
      {problems.length > 0 ? (
        <div className="space-y-2">
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-cairos-border hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                {editingId === problem.id ? (
                  <div className="relative">
                    <Select
                      options={problemOptions}
                      value={problem.value}
                      onChange={(e) => {
                        handleProblemSelect(problem.id, e.target.value);
                        setEditingId(null);
                      }}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingId(problem.id)}
                    className="w-full px-3 py-2 text-body text-gray-900 cursor-pointer min-h-[40px] flex items-center bg-white rounded-lg border border-transparent hover:border-cairos-border transition-colors"
                  >
                    {problem.label || <span className="text-gray-400">Select a problem...</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveProblem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => moveProblem(index, 'down')}
                  disabled={index === problems.length - 1}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => deleteProblem(problem.id)}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                  aria-label="Delete Problem"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-body-sm text-gray-500">No problems added yet. Click "Add Problems" to add one.</p>
        </div>
      )}

      {/* Comments */}
      {onCommentsChange && (
        <div>
          <label className="block text-body-xs font-medium text-gray-700 mb-1">Comments</label>
          <textarea
            value={comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            placeholder="Add comments about problems..."
            className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body-xs bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[80px] resize-y"
          />
        </div>
      )}
    </div>
  );
};

