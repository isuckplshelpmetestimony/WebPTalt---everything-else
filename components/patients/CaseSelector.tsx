'use client';

import React from 'react';
import { Folder } from 'lucide-react';
import { Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { Select } from '../ui/Select';
import { clsx } from 'clsx';

interface CaseSelectorProps {
  cases: Case[];
  activeCaseId: string;
  onCaseChange: (caseId: string) => void;
}

export const CaseSelector: React.FC<CaseSelectorProps> = ({
  cases,
  activeCaseId,
  onCaseChange,
}) => {
  const options = cases.map((caseItem) => ({
    value: caseItem.id,
    label: `${caseItem.name} (${formatDate(caseItem.createdDate)})`,
  }));

  return (
    <div className="flex items-center gap-2">
      <Folder className="w-4 h-4 text-gray-600" />
      <Select
        options={options}
        value={activeCaseId}
        onChange={(e) => onCaseChange(e.target.value)}
        className="min-w-[300px]"
      />
    </div>
  );
};



