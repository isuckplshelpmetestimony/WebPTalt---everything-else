'use client';

import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Copy, Settings, Search } from 'lucide-react';
import { Select } from '../../ui/Select';

export interface DermatomeEntry {
  id: string;
  dermatome: string;
  rightSensation?: string;
  leftSensation?: string;
  comments?: string;
}

interface DermatomesTableProps {
  entries: DermatomeEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (id: string, updates: Partial<DermatomeEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onCopyToColumn?: (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => void;
  dermatomeOptions?: { value: string; label: string }[];
}

// Default dermatome options based on nerve root levels
const defaultDermatomeOptions = [
  { value: '', label: 'Select dermatome...' },
  // Cervical
  { value: 'c2', label: 'C2 - Posterior Head' },
  { value: 'c3', label: 'C3 - Neck' },
  { value: 'c4', label: 'C4 - Shoulder' },
  { value: 'c5', label: 'C5 - Lateral Arm' },
  { value: 'c6', label: 'C6 - Thumb/Index Finger' },
  { value: 'c7', label: 'C7 - Middle Finger' },
  { value: 'c8', label: 'C8 - Ring/Little Finger' },
  { value: 't1', label: 'T1 - Medial Arm' },
  // Thoracic
  { value: 't2', label: 'T2 - Upper Chest' },
  { value: 't4', label: 'T4 - Nipple Line' },
  { value: 't10', label: 'T10 - Umbilicus' },
  // Lumbar
  { value: 'l1', label: 'L1 - Inguinal Region' },
  { value: 'l2', label: 'L2 - Anterior Thigh' },
  { value: 'l3', label: 'L3 - Medial Knee' },
  { value: 'l4', label: 'L4 - Medial Leg/Ankle' },
  { value: 'l5', label: 'L5 - Lateral Leg/Dorsum Foot' },
  // Sacral
  { value: 's1', label: 'S1 - Lateral Foot' },
  { value: 's2', label: 'S2 - Posterior Thigh' },
  { value: 's3-5', label: 'S3-5 - Perianal' },
];

const sensationOptions = [
  { value: '', label: 'Select...' },
  { value: 'intact', label: 'Intact' },
  { value: 'decreased', label: 'Decreased' },
  { value: 'absent', label: 'Absent' },
  { value: 'hyperesthesia', label: 'Hyperesthesia' },
  { value: 'paresthesia', label: 'Paresthesia' },
];

export const DermatomesTable: React.FC<DermatomesTableProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onCopyToColumn,
  dermatomeOptions = defaultDermatomeOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Track which dermatome input is showing suggestions
  const [activeDermatomeInput, setActiveDermatomeInput] = useState<string | null>(null);

  const filteredDermatomeOptions = dermatomeOptions.filter(opt =>
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
        <h4 className="text-body-sm font-semibold text-gray-700">Dermatomes</h4>
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
            {filteredDermatomeOptions.length > 0 ? (
              filteredDermatomeOptions.map((option) => (
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
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Dermatome</th>
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
                        value={entry.dermatome || ''}
                        onChange={(e) => {
                          onUpdateEntry(entry.id, { dermatome: e.target.value });
                          if (e.target.value.length > 0) {
                            setActiveDermatomeInput(entry.id);
                          }
                        }}
                        onFocus={() => {
                          if (entry.dermatome) {
                            setActiveDermatomeInput(entry.id);
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow click on suggestion
                          setTimeout(() => setActiveDermatomeInput(null), 200);
                        }}
                        placeholder="Select dermatome..."
                        className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                      />
                      {activeDermatomeInput === entry.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          {dermatomeOptions
                            .filter(opt => {
                              const searchValue = (entry.dermatome || '').toLowerCase();
                              return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                            })
                            .slice(0, 10)
                            .map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  onUpdateEntry(entry.id, { dermatome: option.label });
                                  setActiveDermatomeInput(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-body-xs"
                              >
                                {option.label}
                              </button>
                            ))}
                          {dermatomeOptions.filter(opt => {
                            const searchValue = (entry.dermatome || '').toLowerCase();
                            return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                          }).length === 0 && (
                            <div className="px-3 py-2 text-body-xs text-gray-500">
                              Type to see suggestions or enter custom dermatome
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={sensationOptions}
                      value={entry.rightSensation || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { rightSensation: e.target.value })}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={sensationOptions}
                      value={entry.leftSensation || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { leftSensation: e.target.value })}
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
          <p className="text-body-sm text-gray-500">No dermatome entries yet. Click "Add Items" to add one.</p>
        </div>
      )}
    </div>
  );
};





