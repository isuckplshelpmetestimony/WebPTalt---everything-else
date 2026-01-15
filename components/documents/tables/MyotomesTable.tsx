'use client';

import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Copy, Settings, Search } from 'lucide-react';
import { Select } from '../../ui/Select';

export interface MyotomeEntry {
  id: string;
  myotome: string;
  rightGrade?: string;
  leftGrade?: string;
  comments?: string;
}

interface MyotomesTableProps {
  entries: MyotomeEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (id: string, updates: Partial<MyotomeEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onCopyToColumn?: (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => void;
  myotomeOptions?: { value: string; label: string }[];
}

// Default myotome options based on nerve root levels
const defaultMyotomeOptions = [
  { value: '', label: 'Select myotome...' },
  // Cervical
  { value: 'c1-2', label: 'C1,2 - Neck Flexion' },
  { value: 'c2-3-4', label: 'C2,3,4 - Upper Trap' },
  { value: 'c5', label: 'C5 - Deltoid' },
  { value: 'c6', label: 'C6 - Bicep / Wrist Ext.' },
  { value: 'c7', label: 'C7 - Tricep' },
  { value: 'c8', label: 'C8 - Thumb Extensions' },
  // Thoracic
  { value: 't1', label: 'T1 - Hand Intrinsics' },
  // Lumbar
  { value: 'l2', label: 'L2 - Hip Flexors' },
  { value: 'l3', label: 'L3 - Knee Extensors' },
  { value: 'l4', label: 'L4 - Ankle Dorsiflexors' },
  { value: 'l5', label: 'L5 - Great Toe Extensors' },
  // Sacral
  { value: 's1', label: 'S1 - Ankle Plantarflexors' },
  { value: 's2', label: 'S2 - Knee Flexors' },
  { value: 's3-4', label: 'S3,4 - Bladder/Bowel' },
];

const gradeOptions = [
  { value: '', label: 'Select...' },
  { value: '5/5', label: '5/5 (Normal)' },
  { value: '4/5', label: '4/5 (Good)' },
  { value: '3/5', label: '3/5 (Fair)' },
  { value: '2/5', label: '2/5 (Poor)' },
  { value: '1/5', label: '1/5 (Trace)' },
  { value: '0/5', label: '0/5 (Zero)' },
];

export const MyotomesTable: React.FC<MyotomesTableProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onCopyToColumn,
  myotomeOptions = defaultMyotomeOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Track which myotome input is showing suggestions
  const [activeMyotomeInput, setActiveMyotomeInput] = useState<string | null>(null);

  const filteredMyotomeOptions = myotomeOptions.filter(opt =>
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
        <h4 className="text-body-sm font-semibold text-gray-700">Myotomes</h4>
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
            {filteredMyotomeOptions.length > 0 ? (
              filteredMyotomeOptions.map((option) => (
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
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Myotome</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Right</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Left</th>
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
                        value={entry.myotome || ''}
                        onChange={(e) => {
                          onUpdateEntry(entry.id, { myotome: e.target.value });
                          if (e.target.value.length > 0) {
                            setActiveMyotomeInput(entry.id);
                          }
                        }}
                        onFocus={() => {
                          if (entry.myotome) {
                            setActiveMyotomeInput(entry.id);
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow click on suggestion
                          setTimeout(() => setActiveMyotomeInput(null), 200);
                        }}
                        placeholder="Select myotome..."
                        className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                      />
                      {activeMyotomeInput === entry.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          {myotomeOptions
                            .filter(opt => {
                              const searchValue = (entry.myotome || '').toLowerCase();
                              return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                            })
                            .slice(0, 10)
                            .map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  onUpdateEntry(entry.id, { myotome: option.label });
                                  setActiveMyotomeInput(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-body-xs"
                              >
                                {option.label}
                              </button>
                            ))}
                          {myotomeOptions.filter(opt => {
                            const searchValue = (entry.myotome || '').toLowerCase();
                            return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                          }).length === 0 && (
                            <div className="px-3 py-2 text-body-xs text-gray-500">
                              Type to see suggestions or enter custom myotome
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
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={gradeOptions}
                      value={entry.leftGrade || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { leftGrade: e.target.value })}
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
          <p className="text-body-sm text-gray-500">No myotome entries yet. Click "Add Items" to add one.</p>
        </div>
      )}
    </div>
  );
};





