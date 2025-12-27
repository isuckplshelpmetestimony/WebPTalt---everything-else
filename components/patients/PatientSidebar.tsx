'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, FileText, CreditCard, Activity } from 'lucide-react';
import { Patient } from '@/lib/types/patient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/utils/date';

interface PatientSidebarProps {
  patient: Patient;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({ patient }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['info', 'cases', 'insurance'])
  );
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  return (
    <div className="w-56 space-y-3">
      {/* Patient Info */}
      <Card>
        <button
          onClick={() => toggleSection('info')}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="text-h3">Patient Info</h3>
          </div>
          {expandedSections.has('info') ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.has('info') && (
          <div className="space-y-2 text-body-sm">
            <div>
              <span className="text-gray-600">DOB:</span>{' '}
              <span className="font-medium">{formatDate(patient.dob)}</span>
            </div>
            {patient.diagnosis && (
              <div>
                <span className="text-gray-600">Diagnosis:</span>{' '}
                <span className="font-medium">{patient.diagnosis}</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Arrival Rate:</span>{' '}
              <span className="font-medium">{patient.arrivalRate}%</span>
            </div>
          </div>
        )}
      </Card>
      
      {/* Cases */}
      <Card>
        <button
          onClick={() => toggleSection('cases')}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-h3">Cases</h3>
          </div>
          {expandedSections.has('cases') ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.has('cases') && (
          <div className="space-y-2">
            {patient.cases.map((caseItem) => (
              <div key={caseItem.id} className="p-3 bg-cairos-bgSecondary rounded-lg">
                <div className="font-medium text-body-sm mb-4">{caseItem.name}</div>
                <div className="text-body-sm text-gray-600 space-y-4">
                  <div>Created: {formatDate(caseItem.createdDate)}</div>
                  {caseItem.visitsRemaining !== undefined && (
                    <div>Visits: {caseItem.visitsRemaining} remaining</div>
                  )}
                  {caseItem.expirationDate && (
                    <div>Expires: {formatDate(caseItem.expirationDate)}</div>
                  )}
                </div>
                {caseItem.authorizationStatus && (
                  <div className="mt-8">
                    <Badge
                      variant={
                        caseItem.authorizationStatus === 'active'
                          ? 'success'
                          : caseItem.authorizationStatus === 'expiring'
                          ? 'warning'
                          : 'alert'
                      }
                      size="sm"
                    >
                      {caseItem.authorizationStatus}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Insurance */}
      <Card>
        <button
          onClick={() => toggleSection('insurance')}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h3 className="text-h3">Insurance</h3>
          </div>
          {expandedSections.has('insurance') ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.has('insurance') && (
          <div className="space-y-2 text-body-sm">
            <div>
              <span className="text-gray-600">Provider:</span>{' '}
              <span className="font-medium">{patient.insurance.name}</span>
            </div>
            {patient.insurance.policyNumber && (
              <div>
                <span className="text-gray-600">Policy:</span>{' '}
                <span className="font-medium">{patient.insurance.policyNumber}</span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

