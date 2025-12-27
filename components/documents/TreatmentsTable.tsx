'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface Treatment {
  id: string;
  status: 'performed' | 'not-performed';
  cptCode: string;
  description: string;
  settings?: string;
  totalMinutes: number;
  isHEP: boolean;
  justification?: string;
}

interface TreatmentsTableProps {
  treatments: Treatment[];
  onAddTreatment: () => void;
  onUpdateTreatment: (id: string, updates: Partial<Treatment>) => void;
  onDeleteTreatment: (id: string) => void;
}

const cptCodeOptions = [
  { value: '97110', label: '97110 - Therapeutic Exercise' },
  { value: '97112', label: '97112 - Neuromuscular Re-education' },
  { value: '97130', label: '97130 - Therapeutic Activities' },
  { value: '97140', label: '97140 - Manual Therapy' },
  { value: '97116', label: '97116 - Gait Training' },
  { value: '97010', label: '97010 - Hot/Cold Pack' },
  { value: '97014', label: '97014 - Electrical Stimulation' },
  { value: '97161', label: '97161 - Physical Therapy Evaluation' },
  { value: '97162', label: '97162 - Physical Therapy Re-evaluation' },
];

export const TreatmentsTable: React.FC<TreatmentsTableProps> = ({
  treatments,
  onAddTreatment,
  onUpdateTreatment,
  onDeleteTreatment,
}) => {
  const totalUnits = treatments
    .filter(t => t.status === 'performed')
    .reduce((sum, t) => {
      // Calculate units: 1 unit per 15 minutes
      return sum + Math.ceil(t.totalMinutes / 15);
    }, 0);

  const totalTime = treatments
    .filter(t => t.status === 'performed')
    .reduce((sum, t) => sum + t.totalMinutes, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-body-sm font-semibold text-gray-700">Treatments</h4>
          <p className="text-body-xs text-gray-500 mt-1">
            Document treatments performed during this session. Units are calculated as 1 unit per 15 minutes.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddTreatment}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Treatment
        </Button>
      </div>

      {treatments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-body-sm text-gray-500">No treatments added yet</p>
          <p className="text-body-xs text-gray-400 mt-1">Click "Add Treatment" to start documenting</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-cairos-border rounded-xl">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-cairos-border">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    Status
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Performed/Not Performed
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    CPT Code
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Billing code
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    Treatment
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Description of treatment/exercise
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    Settings
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Modality parameters (optional)
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    Justification
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Based on patient goals
                    </span>
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    Minutes
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Time spent
                    </span>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-body-xs">
                    HEP
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      Home Exercise Program
                    </span>
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-body-xs w-12"></th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.id} className="border-b border-cairos-border hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <select
                        value={treatment.status}
                        onChange={(e) => onUpdateTreatment(treatment.id, { status: e.target.value as 'performed' | 'not-performed' })}
                        className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary bg-white"
                      >
                        <option value="performed">Performed</option>
                        <option value="not-performed">Not Performed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={treatment.cptCode}
                        onChange={(e) => onUpdateTreatment(treatment.id, { cptCode: e.target.value })}
                        className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary bg-white min-w-[200px]"
                      >
                        <option value="">Select CPT Code...</option>
                        {cptCodeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={treatment.description}
                        onChange={(e) => onUpdateTreatment(treatment.id, { description: e.target.value })}
                        placeholder="e.g., AROM Extension, L-Spine Flexion, Patient Education"
                        className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-w-[200px]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={treatment.settings || ''}
                        onChange={(e) => onUpdateTreatment(treatment.id, { settings: e.target.value })}
                        placeholder="e.g., 10 min @ 110°F, Level 3"
                        className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-w-[120px]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={treatment.justification || ''}
                        onChange={(e) => onUpdateTreatment(treatment.id, { justification: e.target.value })}
                        placeholder="e.g., To improve ROM per goals"
                        className="w-full text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent min-w-[180px]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          value={treatment.totalMinutes}
                          onChange={(e) => onUpdateTreatment(treatment.id, { totalMinutes: Number(e.target.value) || 0 })}
                          min="0"
                          step="1"
                          placeholder="15"
                          className="w-20 text-body-xs border border-cairos-border rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
                        />
                        <span className="text-body-xs text-gray-500">min</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={treatment.isHEP}
                        onChange={(e) => onUpdateTreatment(treatment.id, { isHEP: e.target.checked })}
                        className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary cursor-pointer"
                        title="Home Exercise Program"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteTreatment(treatment.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                        aria-label="Delete treatment"
                        title="Delete treatment"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-cairos-border font-semibold">
                  <td colSpan={5} className="py-3 px-4 text-gray-900 text-body-sm">
                    Total (Performed treatments only)
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 text-body-sm">
                    {Math.floor(totalTime / 60) > 0 && `${Math.floor(totalTime / 60)}h `}
                    {totalTime % 60}m
                  </td>
                  <td colSpan={2} className="py-3 px-4 text-right text-gray-900 text-body-sm">
                    {totalUnits} unit{totalUnits !== 1 ? 's' : ''}
                    <span className="block text-body-xs font-normal text-gray-500 mt-0.5">
                      (1 unit = 15 min)
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
