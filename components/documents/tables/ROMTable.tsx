'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Copy, Settings, Search } from 'lucide-react';
import { Select } from '../../ui/Select';

export interface ROMEntry {
  id: string;
  motion: string;
  right: string;
  rightGrossStrength?: string;
  left: string;
  leftGrossStrength?: string;
  units: string;
  comments?: string;
}

interface ROMTableProps {
  title: string;
  entries: ROMEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (id: string, updates: Partial<ROMEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onCopyToColumn?: (id: string, fromSide: 'right' | 'left', toSide: 'left' | 'right') => void;
  motionOptions?: { value: string; label: string }[];
  showSearch?: boolean;
}

import { getAllROMMotions } from '@/lib/constants/dropdownTemplates';

// Default motion options - now using comprehensive templates
const defaultMotionOptions = getAllROMMotions();

const strengthOptions = [
  { value: '', label: 'Select...' },
  { value: '5/5', label: '5/5 (Normal)' },
  { value: '4/5', label: '4/5 (Good)' },
  { value: '3/5', label: '3/5 (Fair)' },
  { value: '2/5', label: '2/5 (Poor)' },
  { value: '1/5', label: '1/5 (Trace)' },
  { value: '0/5', label: '0/5 (Zero)' },
];

const unitsOptions = [
  { value: 'degrees', label: 'Degrees' },
  { value: 'inches', label: 'Inches' },
  { value: 'cm', label: 'cm' },
];

export const ROMTable: React.FC<ROMTableProps> = ({
  title,
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onCopyToColumn,
  motionOptions = defaultMotionOptions,
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Track which motion input is showing suggestions
  const [activeMotionInput, setActiveMotionInput] = useState<string | null>(null);

  const filteredMotionOptions = motionOptions.filter(opt =>
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
        <h4 className="text-body-sm font-semibold text-gray-700">{title}</h4>
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
      {showSearch && (
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
              {filteredMotionOptions.length > 0 ? (
                filteredMotionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      // This would be used when selecting from search
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
      )}

      {/* Table */}
      {entries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cairos-border">
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Motion</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Right</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Right Gross Strength</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Left</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Left Gross Strength</th>
                <th className="text-left text-body-xs font-semibold text-gray-700 px-2 py-2">Units</th>
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
                        value={entry.motion || ''}
                        onChange={(e) => {
                          onUpdateEntry(entry.id, { motion: e.target.value });
                          if (e.target.value.length > 0) {
                            setActiveMotionInput(entry.id);
                          }
                        }}
                        onFocus={() => {
                          if (entry.motion) {
                            setActiveMotionInput(entry.id);
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow click on suggestion
                          setTimeout(() => setActiveMotionInput(null), 200);
                        }}
                        placeholder="Select motion..."
                        className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                      />
                      {activeMotionInput === entry.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          {motionOptions
                            .filter(opt => {
                              const searchValue = (entry.motion || '').toLowerCase();
                              return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                            })
                            .slice(0, 10)
                            .map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  onUpdateEntry(entry.id, { motion: option.label });
                                  setActiveMotionInput(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-body-xs"
                              >
                                {option.label}
                              </button>
                            ))}
                          {motionOptions.filter(opt => {
                            const searchValue = (entry.motion || '').toLowerCase();
                            return opt.label.toLowerCase().includes(searchValue) && opt.value !== '';
                          }).length === 0 && (
                            <div className="px-3 py-2 text-body-xs text-gray-500">
                              Type to see suggestions or enter custom motion
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={entry.right || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { right: e.target.value })}
                      placeholder="—"
                      className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={strengthOptions}
                      value={entry.rightGrossStrength || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { rightGrossStrength: e.target.value })}
                      className="text-body-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={entry.left || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { left: e.target.value })}
                      placeholder="—"
                      className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-cairos-primary"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={strengthOptions}
                      value={entry.leftGrossStrength || ''}
                      onChange={(e) => onUpdateEntry(entry.id, { leftGrossStrength: e.target.value })}
                      className="text-body-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Select
                      options={unitsOptions}
                      value={entry.units || 'degrees'}
                      onChange={(e) => onUpdateEntry(entry.id, { units: e.target.value })}
                      className="text-body-xs"
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
                        <Trash2 className="w-3 h-3 h-3 text-red-600" />
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
          <p className="text-body-sm text-gray-500">No {title.toLowerCase()} entries yet. Click "Add Items" to add one.</p>
        </div>
      )}

      {/* Comments Section */}
      {entries.length > 0 && (
        <div>
          <label className="block text-body-xs font-medium text-gray-700 mb-1">Comments</label>
          <textarea
            placeholder={`Add comments for ${title.toLowerCase()}...`}
            className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body-xs bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-h-[60px] resize-y"
          />
        </div>
      )}
    </div>
  );
};

