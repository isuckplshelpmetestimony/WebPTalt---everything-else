'use client';

import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import {
  generateChargesFromTreatments,
  calculateBillingTotals,
  verifyCharges,
  Treatment,
} from '@/lib/utils/billing';
import { BillingCode } from '@/lib/types/document';

interface BillingSectionProps {
  objectiveTreatments: Treatment[];
  renderingProvider: string;
  primaryDiagnosis: string;
  placeOfService?: string; // Default: '11' (Office)
  typeOfService?: string; // Default: '01' (Medical Care)
  timeIn?: string;
  timeOut?: string;
  onChargesChange?: (charges: BillingCode[]) => void; // Optional callback for parent
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  objectiveTreatments,
  renderingProvider,
  primaryDiagnosis,
  placeOfService = '11',
  typeOfService = '01',
  timeIn,
  timeOut,
  onChargesChange,
}) => {
  // Auto-generate charges from treatments
  const charges = useMemo(() => {
    return generateChargesFromTreatments(
      objectiveTreatments,
      renderingProvider,
      primaryDiagnosis,
      placeOfService,
      typeOfService
    );
  }, [objectiveTreatments, renderingProvider, primaryDiagnosis, placeOfService, typeOfService]);

  // Calculate totals
  const totals = useMemo(() => {
    return calculateBillingTotals(charges);
  }, [charges]);

  // Verify charges
  const verification = useMemo(() => {
    return verifyCharges(charges, objectiveTreatments);
  }, [charges, objectiveTreatments]);

  // Calculate duration from time in/out
  const duration = useMemo(() => {
    if (!timeIn || !timeOut) return null;

    try {
      const [inHours, inMinutes] = timeIn.split(':').map(Number);
      const [outHours, outMinutes] = timeOut.split(':').map(Number);

      if (isNaN(inHours) || isNaN(inMinutes) || isNaN(outHours) || isNaN(outMinutes)) {
        return null;
      }

      const inTotal = inHours * 60 + inMinutes;
      const outTotal = outHours * 60 + outMinutes;
      const diff = outTotal - inTotal;
      return diff > 0 ? diff : null;
    } catch {
      return null;
    }
  }, [timeIn, timeOut]);

  // Notify parent of charges changes (if callback provided)
  React.useEffect(() => {
    if (onChargesChange) {
      onChargesChange(charges);
    }
  }, [charges, onChargesChange]);

  // Verification status indicator
  const getVerificationIcon = () => {
    if (verification.isValid) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    } else if (verification.issues.length > 0) {
      // Check if any are critical (missing charges)
      const hasCritical = verification.issues.some(issue => issue.includes('has no charge'));
      if (hasCritical) {
        return <XCircle className="w-5 h-5 text-red-600" />;
      }
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
    return null;
  };

  return (
    <Card className="p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-gray-900">Billing</h3>
          {getVerificationIcon()}
          {!verification.isValid && verification.issues.length > 0 ? (
            <span className="text-body-xs text-gray-500">
              {verification.issues.length} issue{verification.issues.length !== 1 ? 's' : ''}
            </span>
          ) : null}
        </div>
      </div>

      {/* Verification Issues */}
      {!verification.isValid && verification.issues.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-body-xs font-semibold text-yellow-900 mb-1">Verification Issues:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {verification.issues.map((issue, index) => (
                  <li key={index} className="text-body-xs text-yellow-800">{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Time Summary */}
      {timeIn && timeOut && duration && (
        <div className="mb-4 pb-4 border-b border-cairos-border">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-body-xs text-gray-500 mb-1">Time In</div>
              <div className="text-body font-semibold text-gray-900">{timeIn}</div>
            </div>
            <div>
              <div className="text-body-xs text-gray-500 mb-1">Time Out</div>
              <div className="text-body font-semibold text-gray-900">{timeOut}</div>
            </div>
            <div>
              <div className="text-body-xs text-gray-500 mb-1">Duration</div>
              <div className="text-body font-semibold text-gray-900">
                {Math.floor(duration / 60)}h {duration % 60}m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charges Table */}
      {charges.length > 0 ? (
        <div className="mb-4">
          <h4 className="text-body-sm font-semibold text-gray-700 mb-3">Charges</h4>
          <div className="overflow-x-auto border border-cairos-border rounded-xl">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-cairos-border">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">CPT</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-body-xs">Units</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-body-xs">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">Diagnosis</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">POS</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-body-xs">TOS</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((charge, index) => (
                  <tr key={index} className="border-b border-cairos-border hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900">{renderingProvider}</td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">{charge.code}</td>
                    <td className="py-3 px-4 text-gray-700">{charge.description}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{charge.units}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{charge.time} min</td>
                    <td className="py-3 px-4 text-gray-700">{primaryDiagnosis || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-700">{placeOfService}</td>
                    <td className="py-3 px-4 text-gray-700">{typeOfService}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-cairos-border font-semibold">
                  <td colSpan={3} className="py-3 px-4 text-gray-900 text-body-sm">Total</td>
                  <td className="py-3 px-4 text-right text-gray-900 text-body-sm">{totals.totalUnits}</td>
                  <td className="py-3 px-4 text-right text-gray-900 text-body-sm">
                    {Math.floor(totals.totalTime / 60) > 0 && `${Math.floor(totals.totalTime / 60)}h `}
                    {totals.totalTime % 60}m
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-body-sm text-gray-500">No charges generated yet</p>
          <p className="text-body-xs text-gray-400 mt-1">
            Charges will appear automatically when treatments are documented in the Objective section
          </p>
        </div>
      )}

      {/* Summary Totals */}
      {charges.length > 0 ? (
        <div className="space-y-3 pt-4 border-t border-cairos-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-body-xs text-gray-500 mb-1">Total Timed Codes</div>
              <div className="text-body-lg font-semibold text-gray-900">
                {Math.floor(totals.totalTimedCodes / 60) > 0 && `${Math.floor(totals.totalTimedCodes / 60)}h `}
                {totals.totalTimedCodes % 60}m
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-body-xs text-gray-500 mb-1">Total Untimed Codes</div>
              <div className="text-body-lg font-semibold text-gray-900">
                {totals.totalUntimedCodes} code{totals.totalUntimedCodes !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="p-3 bg-cairos-primary bg-opacity-10 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-body-sm font-semibold text-gray-700">Total Treatment Time</div>
              <div className="text-body-lg font-bold text-cairos-primary">
                {Math.floor(totals.totalTime / 60) > 0 && `${Math.floor(totals.totalTime / 60)}h `}
                {totals.totalTime % 60}m
              </div>
            </div>
          </div>
          <div className="p-3 bg-cairos-primary bg-opacity-10 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-body-sm font-semibold text-gray-700">Total Units</div>
              <div className="text-body-lg font-bold text-cairos-primary">{totals.totalUnits}</div>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

