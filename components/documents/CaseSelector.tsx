'use client';

import React from 'react';
import { Case } from '@/lib/types/patient';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/utils/date';

interface CaseSelectorProps {
  cases: Case[];
  selectedCaseId?: string;
  onSelect: (caseId: string) => void;
  error?: string;
}

export const CaseSelector: React.FC<CaseSelectorProps> = ({
  cases,
  selectedCaseId,
  onSelect,
  error,
}) => {
  const options = cases.map((caseItem) => ({
    value: caseItem.id,
    label: `${caseItem.name} - ${formatDate(caseItem.createdDate)}`,
  }));
  
  const selectedCase = cases.find((c) => c.id === selectedCaseId);
  
  return (
    <div>
      <Select
        options={[{ value: '', label: 'Select a case...' }, ...options]}
        value={selectedCaseId || ''}
        onChange={(e) => onSelect(e.target.value)}
        error={error}
      />
      {selectedCase && (
        <div className="mt-3 p-3 bg-cairos-bgSecondary rounded-md">
          <div className="flex items-center justify-between mb-8">
            <span className="text-body-sm font-medium text-gray-700">
              Case Summary
            </span>
            {selectedCase.authorizationStatus && (
              <Badge
                variant={
                  selectedCase.authorizationStatus === 'active'
                    ? 'success'
                    : selectedCase.authorizationStatus === 'expiring'
                    ? 'warning'
                    : 'alert'
                }
              >
                {selectedCase.authorizationStatus.toUpperCase()}
              </Badge>
            )}
          </div>
          <div className="text-body-sm text-gray-600 space-y-4">
            <div>Created: {formatDate(selectedCase.createdDate)}</div>
            {selectedCase.visitsRemaining !== undefined && (
              <div>Visits Remaining: {selectedCase.visitsRemaining}</div>
            )}
            {selectedCase.expirationDate && (
              <div>Expires: {formatDate(selectedCase.expirationDate)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

