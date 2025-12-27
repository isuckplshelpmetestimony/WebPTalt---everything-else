'use client';

import React from 'react';
import { Clock, ClipboardList } from 'lucide-react';
import { Patient, Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface VitalsSidebarProps {
  patient: Patient;
  activeCase?: Case;
}

export const VitalsSidebar: React.FC<VitalsSidebarProps> = ({ patient, activeCase }) => {
  const arrivalRate = patient.arrivalRate || 0;
  const cancels = patient.cancels || 0;
  const noShows = patient.noShows || 0;
  
  const authorization = activeCase 
    ? patient.authorization 
    : patient.authorization;
  
  const visitsRemaining = authorization 
    ? authorization.visitsAuthorized - authorization.visitsUsed 
    : activeCase?.visitsRemaining || 0;
  
  const insuranceName = patient.insurance.name;
  const surveys = patient.surveys || [];
  
  return (
    <div className="w-64 space-y-3">
      <Card>
        <h3 className="text-h3 mb-3 text-gray-900">Vitals</h3>
        
        <div className="space-y-3 text-body-sm">
          {/* Case Name */}
          {activeCase && (
            <div>
              <div className="text-gray-600 mb-1">Case Name:</div>
              <div className="font-medium text-gray-900">{activeCase.name}</div>
            </div>
          )}
          
          {/* Insurances */}
          <div>
            <div className="text-gray-600 mb-1">Insurances:</div>
            <div className="font-medium text-gray-900">
              Primary: {insuranceName}
            </div>
          </div>
          
          {/* Patient Icons */}
          {patient.patientType === 'workers-comp' && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">WORKERS COMP</span>
            </div>
          )}
          
          {/* Arrival Rate */}
          <div>
            <div className="text-gray-600 mb-1">Arrival Rate:</div>
            <div className="font-medium text-gray-900">
              {arrivalRate.toFixed(1)}% ({cancels} Cancels {noShows} No Shows)
            </div>
          </div>
          
          {/* Diagnosis */}
          {patient.diagnosis && (
            <div>
              <div className="text-gray-600 mb-1">Diagnosis:</div>
              <div className="font-medium text-gray-900">
                {patient.diagnosisCode && `${patient.diagnosisCode} - `}
                {patient.diagnosis}
              </div>
            </div>
          )}
          
          {/* Authorization Information */}
          {authorization && (
            <div>
              <div className="text-gray-600 mb-1">Authorization Information:</div>
              <div className="font-medium text-gray-900">
                {visitsRemaining} Visits Remaining for PT, Expiring on {formatDate(authorization.expirationDate)} for {insuranceName}
              </div>
              {authorization.status === 'expiring' || authorization.status === 'expired' ? (
                <Badge
                  variant={authorization.status === 'expired' ? 'alert' : 'warning'}
                  size="sm"
                  className="mt-2"
                >
                  {authorization.status === 'expired' ? 'EXPIRED' : 'EXPIRING'}
                </Badge>
              ) : null}
            </div>
          )}
        </div>
      </Card>
      
      {/* Surveys Section */}
      {surveys.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-gray-600" />
            <h3 className="text-h3 text-gray-900">Surveys</h3>
          </div>
          
          <div className="space-y-2 text-body-sm">
            {surveys.map((survey) => (
              <div key={survey.id} className="border-b border-cairos-border pb-2 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{survey.type}</span>
                  {survey.result && (
                    <Badge
                      variant={
                        survey.result === 'positive' || survey.result === 'triggered'
                          ? 'warning'
                          : 'success'
                      }
                      size="xs"
                    >
                      {survey.result === 'positive' || survey.result === 'triggered' ? 'TRIGGERED' : 'NEGATIVE'}
                    </Badge>
                  )}
                </div>
                {survey.completedDate && (
                  <div className="text-gray-600 text-body-xs">
                    {formatDate(survey.completedDate)}
                  </div>
                )}
                {survey.score !== undefined && survey.maxScore !== undefined && (
                  <div className="text-gray-600 text-body-xs">
                    Score: {survey.score}/{survey.maxScore}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

