'use client';

import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Copy, Settings, Search } from 'lucide-react';
import { Select } from '../../ui/Select';

export interface ReflexEntry {
  id: string;
  reflexName: string;
  rightResult?: string;
  leftResult?: string;
  comments?: string;
}

interface ReflexesTableProps {
  entries: ReflexEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (id: string, updates: Partial<ReflexEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onCopyToColumn?: (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => void;
  reflexOptions?: { value: string; label: string }[];
}

// Default reflex options
const defaultReflexOptions = [
  { value: '', label: 'Select reflex...' },
  // Upper Extremity
  { value: 'biceps', label: 'Biceps (C5-C6)' },
  { value: 'brachioradialis', label: 'Brachioradialis (C5-C6)' },
  { value: 'triceps', label: 'Triceps (C7-C8)' },
  // Lower Extremity
  { value: 'patellar', label: 'Patellar (L3-L4)' },
  { value: 'achilles', label: 'Achilles (S1-S2)' },
  { value: 'hamstring', label: 'Hamstring (L5-S1)' },
  // Pathological
  { value: 'babinski', label: 'Babinski' },
  { value: 'hoffmann', label: "Hoffmann's Sign" },
  { value: 'clonus', label: 'Clonus' },
];

const reflexResultOptions = [
  { value: '', label: 'Select...' },
  { value: '0', label: '0 (Absent)' },
  { value: '1+', label: '1+ (Hypoactive)' },
  { value: '2+', label: '2+ (Normal)' },
  { value: '3+', label: '3+ (Hyperactive)' },
  { value: '4+', label: '4+ (Very Hyperactive)' },
];

export const ReflexesTable: React.FC<ReflexesTableProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onCopyToColumn,
  reflexOptions = defaultReflexOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredReflexOptions = reflexOptions.filter(opt =>
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
        <h4 className="text-body-sm font-semibold text-gray-700">Reflexes</h4>
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
            {filteredReflexOptions.length > 0 ? (
              filteredReflexOptions.map((option) => (
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
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Reflex Name</th>
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
                    <Select
                      options={reflexOptions}
                      value={entry.reflexName}
                      onChange={(e) => onUpdateEntry(entry.id, { reflexName: e.target.value })}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={reflexResultOptions}
                      value={entry.rightResult || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { rightResult: e.target.value })}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={reflexResultOptions}
                      value={entry.leftResult || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { leftResult: e.target.value })}
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
          <p className="text-body-sm text-gray-500">No reflex entries yet. Click "Add Items" to add one.</p>
        </div>
      )}
    </div>
  );
};

