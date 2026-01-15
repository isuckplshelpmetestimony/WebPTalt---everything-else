'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Settings, Target, Search } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  subtitle?: string;
  type?: 'text' | 'select' | 'number' | 'date' | 'checkbox';
  options?: { value: string; label: string }[];
  placeholder?: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  editable?: boolean;
  searchable?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

interface DataTableProps {
  title: string;
  columns: TableColumn[];
  rows: TableRow[];
  onAddRow: () => void;
  onUpdateRow: (id: string, updates: Partial<TableRow>) => void;
  onDeleteRow: (id: string) => void;
  onMoveRowUp?: (id: string) => void;
  onMoveRowDown?: (id: string) => void;
  showActionButtons?: boolean;
  showCustomizeDropdowns?: boolean;
  showCopyToColumn?: boolean;
  showCreateGoal?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  rows,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onMoveRowUp,
  onMoveRowDown,
  showActionButtons = true,
  showCustomizeDropdowns = true,
  showCopyToColumn = true,
  showCreateGoal = true,
  emptyMessage = 'No items added yet',
  searchPlaceholder = 'Search Items (Ctrl-D)',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState<string | null>(null);

  const handleCellChange = (rowId: string, columnKey: string, value: any) => {
    onUpdateRow(rowId, { [columnKey]: value });
  };

  const filteredRows = rows.filter(row => {
    if (!searchTerm) return true;
    if (searchColumn) {
      return String(row[searchColumn] || '').toLowerCase().includes(searchTerm.toLowerCase());
    }
    return columns.some(col => 
      String(row[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-body-sm font-semibold text-gray-700">{title}</h4>
        {showActionButtons && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onAddRow}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Items
            </Button>
            {showCustomizeDropdowns && (
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
            )}
            {showCopyToColumn && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5"
                title="Copy To Column"
              >
                <Copy className="w-4 h-4" />
                Copy To Column
              </Button>
            )}
            {showCreateGoal && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5"
                title="Create Goal"
              >
                <Target className="w-4 h-4" />
                Create Goal
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Search Bar */}
      {searchTerm && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-body-xs border border-cairos-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchColumn(null);
              }}
              className="text-body-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {filteredRows.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-cairos-border">
          <p className="text-body-sm text-gray-500">{emptyMessage}</p>
          <p className="text-body-xs text-gray-400 mt-1">Click "Add Items" to start documenting</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-cairos-border rounded-xl">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-cairos-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-${column.align || 'left'} py-3 px-4 font-semibold text-gray-700 text-body-xs ${column.width ? `w-[${column.width}]` : ''}`}
                  >
                    {column.label}
                    {column.subtitle && (
                      <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                        {column.subtitle}
                      </span>
                    )}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-body-xs w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="border-b border-cairos-border hover:bg-gray-50 transition-colors">
                  {columns.map((column) => {
                    const cellValue = row[column.key] || '';
                    const isEditable = column.editable !== false;

                    return (
                      <td key={column.key} className="py-3 px-4">
                        {!isEditable ? (
                          <span className="text-body-xs">{cellValue}</span>
                        ) : column.type === 'select' ? (
                          <div className="relative">
                            <select
                              value={cellValue}
                              onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
                              className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary bg-white min-w-[150px]"
                            >
                              <option value="">Select...</option>
                              {column.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            {column.searchable && (
                              <button
                                onClick={() => {
                                  setSearchColumn(column.key);
                                  setSearchTerm('');
                                }}
                                className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                                title="Search in this column"
                              >
                                <Search className="w-3 h-3 text-gray-400" />
                              </button>
                            )}
                          </div>
                        ) : column.type === 'number' ? (
                          <input
                            type="number"
                            value={cellValue}
                            onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
                            placeholder={column.placeholder}
                            className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
                          />
                        ) : column.type === 'date' ? (
                          <input
                            type="date"
                            value={cellValue}
                            onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
                            className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
                          />
                        ) : column.type === 'checkbox' ? (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={!!cellValue}
                              onChange={(e) => handleCellChange(row.id, column.key, e.target.checked)}
                              className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary cursor-pointer"
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={cellValue}
                            onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
                            placeholder={column.placeholder}
                            className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
                          />
                        )}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {onMoveRowUp && index > 0 && (
                        <button
                          onClick={() => onMoveRowUp(row.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Move up"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                      {onMoveRowDown && index < filteredRows.length - 1 && (
                        <button
                          onClick={() => onMoveRowDown(row.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Move down"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteRow(row.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                        aria-label="Delete item"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};





