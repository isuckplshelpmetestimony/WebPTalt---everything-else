'use client';

import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Copy, Settings, Search } from 'lucide-react';
import { Select } from '../../ui/Select';

export interface MuscleTestingEntry {
  id: string;
  muscle: string;
  rightGrade?: string;
  leftGrade?: string;
  comments?: string;
}

interface MuscleTestingTableProps {
  entries: MuscleTestingEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (id: string, updates: Partial<MuscleTestingEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onCopyToColumn?: (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => void;
  muscleOptions?: { value: string; label: string }[];
}

import { getAllMuscles } from '@/lib/constants/dropdownTemplates';

// Default muscle options - now using comprehensive templates
const defaultMuscleOptions = getAllMuscles();

const gradeOptions = [
  { value: '', label: 'Select...' },
  { value: '5/5', label: '5/5 (Normal)' },
  { value: '4/5', label: '4/5 (Good)' },
  { value: '3/5', label: '3/5 (Fair)' },
  { value: '2/5', label: '2/5 (Poor)' },
  { value: '1/5', label: '1/5 (Trace)' },
  { value: '0/5', label: '0/5 (Zero)' },
];

export const MuscleTestingTable: React.FC<MuscleTestingTableProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onCopyToColumn,
  muscleOptions = defaultMuscleOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Track which muscle input is showing suggestions
  const [activeMuscleInput, setActiveMuscleInput] = useState<string | null>(null);

  const filteredMuscleOptions = muscleOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyToColumn = (id: string, fromSide: 'right' | 'left') => {
    const entry = entries.find(e => e.id === id);
    if (!entry || !onCopyToColumn) return;
    
    const toSide = fromSide === 'right' ? 'left' : 'right';
    onCopyToColumn(id, fromSide, toSide);
  };

  return (
    <div className="space-y-4">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-body-sm font-semibold text-gray-700">Muscle Testing</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAddEntry}
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
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Items (Ctrl-D)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="flex-1 px-2 py-1 text-body-xs border border-cairos-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
          />
        </div>
        {isSearchOpen && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredMuscleOptions.length > 0 ? (
              filteredMuscleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
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

      {/* Table */}
      {entries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cairos-border">
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Muscle</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Right Grade</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Left Grade</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Comments</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-cairos-border hover:bg-gray-50">
                  <td className="px-2 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={entry.muscle || ''}
                        onChange={(e) => {
                          onUpdateEntry(entry.id, { muscle: e.target.value });
                          if (e.target.value.length > 0) {
                            setActiveMuscleInput(entry.id);
                          }
                        }}
                        onFocus={() => {
                          if (entry.muscle) {
                            setActiveMuscleInput(entry.id);
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow click on suggestion
                          setTimeout(() => setActiveMuscleInput(null), 200);
                        }}
                        placeholder="Select muscle..."
                        className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                      />
                      {activeMuscleInput === entry.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          {muscleOptions
                            .filter(opt => {
                              const searchValue = (entry.muscle || '').toLowerCase();
                              return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                            })
                            .slice(0, 10)
                            .map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  onUpdateEntry(entry.id, { muscle: option.label });
                                  setActiveMuscleInput(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-body-xs"
                              >
                                {option.label}
                              </button>
                            ))}
                          {muscleOptions.filter(opt => {
                            const searchValue = (entry.muscle || '').toLowerCase();
                            return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                          }).length === 0 && (
                            <div className="px-3 py-2 text-body-xs text-gray-500">
                              Type to see suggestions or enter custom muscle
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={gradeOptions}
                      value={entry.rightGrade || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { rightGrade: e.target.value })}
                      className="text-body-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={gradeOptions}
                      value={entry.leftGrade || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { leftGrade: e.target.value })}
                      className="text-body-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={entry.comments || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { comments: e.target.value })}
                      placeholder="Comments..."
                      className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      {onCopyToColumn && (
                        <>
                          <button
                            onClick={() => handleCopyToColumn(entry.id, 'right')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy Right to Left"
                          >
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleCopyToColumn(entry.id, 'left')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy Left to Right"
                          >
                            <Copy className="w-3 h-3 text-gray-500 rotate-180" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-body-sm text-gray-500">No muscle testing entries yet. Click "Add Items" to add one.</p>
        </div>
      )}
    </div>
  );
};

