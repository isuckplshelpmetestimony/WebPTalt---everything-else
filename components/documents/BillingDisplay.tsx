'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { BillingCode } from '@/lib/types/document';
import { Clock, DollarSign, FileText } from 'lucide-react';

interface BillingDisplayProps {
  billing: {
    codes: BillingCode[];
    totalUnits: number;
    totalTime: number;
  };
  timeIn?: string;
  timeOut?: string;
}

const billingCodeDescriptions: Record<string, string> = {
  '97110': 'Therapeutic Exercise',
  '97112': 'Neuromuscular Re-education',
  '97130': 'Therapeutic Activities',
  '97140': 'Manual Therapy',
  '97116': 'Gait Training',
  '97150': 'Group Therapy',
};

export const BillingDisplay: React.FC<BillingDisplayProps> = ({
  billing,
  timeIn,
  timeOut,
}) => {
  const calculateDuration = () => {
    if (!timeIn || !timeOut) return null;
    
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    const inTotal = inHours * 60 + inMinutes;
    const outTotal = outHours * 60 + outMinutes;
    return outTotal - inTotal;
  };

  const duration = calculateDuration();

  return (
    <Card className="p-5 border-2 border-cairos-primary bg-cairos-primary bg-opacity-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
          <DollarSign className="w-5 h-5 text-cairos-primary" />
        </div>
        <h3 className="text-h3 text-gray-900">Billing Information</h3>
      </div>

      {/* Time Summary */}
      {timeIn && timeOut && duration && (
        <div className="mb-4 pb-4 border-b border-cairos-border">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 text-body-xs text-gray-500 mb-1">
                <Clock className="w-3 h-3" />
                <span>Time In</span>
              </div>
              <div className="text-body font-semibold text-gray-900">{timeIn}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-body-xs text-gray-500 mb-1">
                <Clock className="w-3 h-3" />
                <span>Time Out</span>
              </div>
              <div className="text-body font-semibold text-gray-900">{timeOut}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-body-xs text-gray-500 mb-1">
                <Clock className="w-3 h-3" />
                <span>Duration</span>
              </div>
              <div className="text-body font-semibold text-gray-900">
                {Math.floor(duration / 60)}h {duration % 60}m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Codes Table */}
      <div className="mb-4">
        <h4 className="text-body-sm font-semibold text-gray-700 mb-3">Billing Codes</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-cairos-border">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Code</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Units</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {billing.codes.map((code, index) => (
                <tr key={index} className="border-b border-cairos-border">
                  <td className="py-2 px-3 font-mono font-medium text-gray-900">{code.code}</td>
                  <td className="py-2 px-3 text-gray-700">
                    {code.description || billingCodeDescriptions[code.code] || 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-gray-900">{code.units}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{code.time} min</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={2} className="py-2 px-3 text-gray-900">Total</td>
                <td className="py-2 px-3 text-right text-gray-900">{billing.totalUnits}</td>
                <td className="py-2 px-3 text-right text-gray-900">
                  {Math.floor(billing.totalTime / 60)}h {billing.totalTime % 60}m
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between p-3 bg-cairos-primary bg-opacity-10 rounded-xl">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cairos-primary" />
          <span className="text-body-sm font-semibold text-gray-700">Total Units:</span>
        </div>
        <span className="text-body-lg font-bold text-cairos-primary">{billing.totalUnits}</span>
      </div>
    </Card>
  );
};





