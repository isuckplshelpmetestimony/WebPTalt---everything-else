'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, FileText, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface AlertCardsProps {
  incompleteNotesCount: number;
  incompleteNotesPatients: Array<{ id: string; name: string; count: number }>;
  expiringAuthorizationsCount: number;
  expiringAuthorizationsPatients: Array<{ id: string; name: string; expirationDate: Date }>;
}

export const AlertCards: React.FC<AlertCardsProps> = ({
  incompleteNotesCount,
  incompleteNotesPatients,
  expiringAuthorizationsCount,
  expiringAuthorizationsPatients,
}) => {
  const hasAlerts = incompleteNotesCount > 0 || expiringAuthorizationsCount > 0;

  if (!hasAlerts) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Incomplete Notes Alert */}
      {incompleteNotesCount > 0 && (
        <Card className="p-4 border-2 border-cairos-warning">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cairos-warning bg-opacity-10 rounded-xl flex-shrink-0">
              <FileText className="w-5 h-5 text-cairos-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-body font-semibold text-gray-900">
                  Incomplete Notes
                </h3>
                <Badge variant="warning" size="sm">
                  {incompleteNotesCount} patient{incompleteNotesCount !== 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-body-sm text-gray-600 mb-3">
                2 or more incomplete notes
              </p>
              <div className="space-y-1.5">
                {incompleteNotesPatients.slice(0, 3).map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-body-sm text-gray-900 group-hover:text-cairos-primary transition-colors">
                      {patient.name}
                    </span>
                    <span className="text-body-xs text-gray-500">
                      {patient.count} incomplete
                    </span>
                  </Link>
                ))}
                {incompleteNotesPatients.length > 3 && (
                  <Link
                    href="/patients"
                    className="text-body-xs text-cairos-primary hover:underline"
                  >
                    View all {incompleteNotesPatients.length} patients
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Authorization Expiration Alert */}
      {expiringAuthorizationsCount > 0 && (
        <Card className="p-4 border-2 border-cairos-alert">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cairos-alert bg-opacity-10 rounded-xl flex-shrink-0">
              <Clock className="w-5 h-5 text-cairos-alert" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-body font-semibold text-gray-900">
                  Authorization Expiring
                </h3>
                <Badge variant="alert" size="sm">
                  {expiringAuthorizationsCount} patient{expiringAuthorizationsCount !== 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-body-sm text-gray-600 mb-3">
                Expires in less than 1 day or has expired
              </p>
              <div className="space-y-1.5">
                {expiringAuthorizationsPatients.slice(0, 3).map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-body-sm text-gray-900 group-hover:text-cairos-primary transition-colors">
                      {patient.name}
                    </span>
                    <span className="text-body-xs text-gray-500">
                      {new Date(patient.expirationDate).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
                {expiringAuthorizationsPatients.length > 3 && (
                  <Link
                    href="/patients"
                    className="text-body-xs text-cairos-primary hover:underline"
                  >
                    View all {expiringAuthorizationsPatients.length} patients
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

