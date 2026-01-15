'use client';

import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface IncompleteNotesCardProps {
  patients: Array<{ id: string; name: string; incompleteCount: number }>;
}

export const IncompleteNotesCard: React.FC<IncompleteNotesCardProps> = ({ patients }) => {
  const totalPatients = patients.length;
  const totalIncomplete = patients.reduce((sum, p) => sum + p.incompleteCount, 0);

  if (totalPatients === 0) return null;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-cairos-warning bg-opacity-10 rounded-xl">
          <FileText className="w-5 h-5 text-cairos-warning" />
        </div>
        <div className="flex-1">
          <h3 className="text-h3 text-gray-900">Incomplete Notes</h3>
          <p className="text-body-xs text-gray-500">
            {totalIncomplete} incomplete note{totalIncomplete !== 1 ? 's' : ''} across {totalPatients} patient{totalPatients !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {patients.map((patient) => (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <span className="text-body-sm text-gray-900 group-hover:text-cairos-primary transition-colors">
              {patient.name}
            </span>
            <Badge variant="warning" size="xs">
              {patient.incompleteCount} incomplete
            </Badge>
          </Link>
        ))}
      </div>

      {totalPatients > 5 && (
        <Link
          href="/patients"
          className="block mt-3 text-center text-body-sm text-cairos-primary hover:underline"
        >
          View all patients
        </Link>
      )}
    </Card>
  );
};





