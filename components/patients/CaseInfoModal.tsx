'use client';

import React from 'react';
import { Case, Patient } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Folder, Calendar, Shield, FileText, Activity } from 'lucide-react';
import { clsx } from 'clsx';

interface CaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: Case;
  patient: Patient;
  documentsCount?: number;
}

export const CaseInfoModal: React.FC<CaseInfoModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  patient,
  documentsCount = 0,
}) => {
  const authorization = patient.authorization;
  const visitsRemaining = authorization
    ? authorization.visitsAuthorized - authorization.visitsUsed
    : caseItem.visitsRemaining;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Case Information" size="md">
      <div className="space-y-4">
        {/* Case Details */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Folder className="w-5 h-5 text-cairos-primary" />
            <h3 className="text-h3 text-gray-900">Case Details</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Case Name</div>
              <div className="text-body font-semibold text-gray-900">{caseItem.name}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-body-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Created Date</span>
              </div>
              <div className="text-body font-semibold text-gray-900">
                {formatDate(caseItem.createdDate)}
              </div>
            </div>
            {caseItem.expirationDate && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Expiration Date</div>
                <div className="text-body font-semibold text-gray-900">
                  {formatDate(caseItem.expirationDate)}
                </div>
              </div>
            )}
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Case Status</div>
              <Badge
                variant={
                  caseItem.authorizationStatus === 'expired' ? 'alert' :
                  caseItem.authorizationStatus === 'expiring' ? 'warning' :
                  'success'
                }
                size="sm"
              >
                {caseItem.authorizationStatus?.toUpperCase() || 'ACTIVE'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Authorization Details */}
        {authorization && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-h3 text-gray-900">Authorization Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Visits Used</div>
                <div className="text-body font-semibold text-gray-900">
                  {authorization.visitsUsed} / {authorization.visitsAuthorized}
                </div>
              </div>
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Visits Remaining</div>
                <div className="text-body font-semibold text-gray-900">
                  {visitsRemaining} visits
                </div>
              </div>
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Expiration Date</div>
                <div className="text-body font-semibold text-gray-900">
                  {formatDate(authorization.expirationDate)}
                </div>
              </div>
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Authorization Status</div>
                <Badge
                  variant={
                    authorization.status === 'expired' ? 'alert' :
                    authorization.status === 'expiring' ? 'warning' :
                    'success'
                  }
                  size="sm"
                >
                  {authorization.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Diagnosis */}
        {patient.diagnosis && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-purple-600" />
              <h3 className="text-h3 text-gray-900">Diagnosis</h3>
            </div>
            <div className="space-y-2">
              {patient.diagnosisCode && (
                <div>
                  <div className="text-body-sm text-gray-600 mb-1">Diagnosis Code</div>
                  <div className="text-body font-mono text-gray-900">{patient.diagnosisCode}</div>
                </div>
              )}
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Diagnosis</div>
                <div className="text-body font-semibold text-gray-900">{patient.diagnosis}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Related Documents */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-h3 text-gray-900">Related Documents</h3>
          </div>
          <div className="text-body text-gray-900">
            {documentsCount} document{documentsCount !== 1 ? 's' : ''} associated with this case
          </div>
        </Card>
      </div>
    </Modal>
  );
};

