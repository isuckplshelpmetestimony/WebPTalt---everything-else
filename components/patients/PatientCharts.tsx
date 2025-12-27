'use client';

import React from 'react';
import { Patient, Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Clock, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Shield, 
  Activity,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { clsx } from 'clsx';

interface PatientChartsProps {
  patient: Patient;
  activeCase?: Case;
}

export const PatientCharts: React.FC<PatientChartsProps> = ({ patient, activeCase }) => {
  const arrivalRate = patient.arrivalRate || 0;
  const cancels = patient.cancels || 0;
  const noShows = patient.noShows || 0;
  
  const authorization = activeCase 
    ? patient.authorization 
    : patient.authorization;
  
  const visitsRemaining = authorization 
    ? authorization.visitsAuthorized - authorization.visitsUsed 
    : activeCase?.visitsRemaining || 0;
  
  const visitsUsed = authorization?.visitsUsed || 0;
  const visitsAuthorized = authorization?.visitsAuthorized || 0;
  const visitsUsedPercent = visitsAuthorized > 0 
    ? (visitsUsed / visitsAuthorized) * 100 
    : 0;
  
  const surveys = patient.surveys || [];
  const insuranceName = patient.insurance.name;
  
  const calculateAge = (dob: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  
  const age = calculateAge(patient.dob);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Patient Information Card */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
            <User className="w-4 h-4 text-cairos-primary" />
          </div>
          <h3 className="text-h3 text-gray-900">Patient Information</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Case Info */}
          {activeCase && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-body-xs font-semibold text-gray-500 uppercase tracking-wide">
                <FileText className="w-3 h-3" />
                <span>Case</span>
              </div>
              <p className="text-body-sm font-semibold text-gray-900">{activeCase.name}</p>
              <div className="flex items-center gap-1.5 text-body-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Created {formatDate(activeCase.createdDate)}</span>
              </div>
            </div>
          )}

          {/* Insurance */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-body-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Shield className="w-3 h-3" />
              <span>Insurance</span>
            </div>
            <p className="text-body-sm font-semibold text-gray-900">{insuranceName}</p>
            {patient.patientType === 'workers-comp' && (
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="warning" size="xs">WORKERS COMP</Badge>
              </div>
            )}
          </div>

          {/* Arrival Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-body-xs font-semibold text-gray-500 uppercase tracking-wide">
              <TrendingUp className="w-3 h-3" />
              <span>Arrival Rate</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{arrivalRate.toFixed(1)}%</div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-cairos-success h-2 rounded-full transition-all"
                style={{ width: `${arrivalRate}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-body-xs text-gray-500">
              <span>{cancels} Cancels</span>
              <span>•</span>
              <span>{noShows} No Shows</span>
            </div>
          </div>

          {/* Diagnosis */}
          {patient.diagnosis && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-body-xs font-semibold text-gray-500 uppercase tracking-wide">
                <Activity className="w-3 h-3" />
                <span>Diagnosis</span>
              </div>
              {patient.diagnosisCode && (
                <div className="text-body-xs font-mono text-gray-400">{patient.diagnosisCode}</div>
              )}
              <p className="text-body-sm font-medium text-gray-900">{patient.diagnosis}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Authorization Status Card */}
      {authorization && (
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 mb-3">
            <div className={clsx(
              "p-2 rounded-lg",
              authorization.status === 'expired' ? "bg-cairos-alert bg-opacity-10" :
              authorization.status === 'expiring' ? "bg-cairos-warning bg-opacity-10" :
              "bg-cairos-primary bg-opacity-10"
            )}>
              <Shield className={clsx(
                "w-4 h-4",
                authorization.status === 'expired' ? "text-cairos-alert" :
                authorization.status === 'expiring' ? "text-cairos-warning" :
                "text-cairos-primary"
              )} />
            </div>
            <div className="flex-1">
              <h3 className="text-body-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Authorization</h3>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {visitsUsed} <span className="text-body-sm text-gray-500 font-normal">/ {visitsAuthorized}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div 
              className={clsx(
                "h-2 rounded-full transition-all",
                visitsUsedPercent >= 90 ? "bg-cairos-alert" :
                visitsUsedPercent >= 75 ? "bg-cairos-warning" :
                "bg-cairos-primary"
              )}
              style={{ width: `${visitsUsedPercent}%` }}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-body-xs">
              <span className="text-gray-500">Remaining</span>
              <span className="font-semibold text-gray-900">{visitsRemaining} visits</span>
            </div>
            <div className="flex items-center justify-between text-body-xs">
              <span className="text-gray-500">Expires</span>
              <span className="font-medium text-gray-900">{formatDate(authorization.expirationDate)}</span>
            </div>
            {(authorization.status === 'expiring' || authorization.status === 'expired') && (
              <Badge
                variant={authorization.status === 'expired' ? 'alert' : 'warning'}
                size="xs"
                className="mt-1"
              >
                {authorization.status === 'expired' ? 'EXPIRED' : 'EXPIRING'}
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Survey Results Card - Combined */}
      {surveys.length > 0 && (
        <Card className={clsx(
          "p-4 hover:shadow-md transition-shadow",
          surveys.some(s => s.result === 'triggered' || s.result === 'positive') && "border border-cairos-warning"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <div className={clsx(
              "p-2 rounded-lg",
              surveys.some(s => s.result === 'triggered' || s.result === 'positive')
                ? "bg-cairos-warning bg-opacity-10"
                : "bg-cairos-success bg-opacity-10"
            )}>
              {surveys.some(s => s.result === 'triggered' || s.result === 'positive') ? (
                <AlertCircle className="w-4 h-4 text-cairos-warning" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-cairos-success" />
              )}
            </div>
            <h3 className="text-h3 text-gray-900">Surveys</h3>
          </div>
          
          <div className="space-y-2">
            {surveys.map((survey) => (
              <div 
                key={survey.id} 
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-body-sm font-semibold text-gray-900">{survey.type}</span>
                    {survey.result && (
                      <Badge
                        variant={
                          (survey.result === 'triggered' || survey.result === 'positive')
                            ? 'warning'
                            : 'success'
                        }
                        size="xs"
                      >
                        {(survey.result === 'triggered' || survey.result === 'positive') ? 'TRIGGERED' : 'NEGATIVE'}
                      </Badge>
                    )}
                  </div>
                  
                  {survey.completedDate && (
                    <div className="flex items-center gap-1.5 text-body-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(survey.completedDate)}</span>
                    </div>
                  )}
                </div>
                
                {survey.score !== undefined && survey.maxScore !== undefined && (
                  <div className="flex-shrink-0 text-right">
                    <div className="text-body-sm font-bold text-gray-900 mb-1">
                      {survey.score}/{survey.maxScore}
                    </div>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={clsx(
                          "h-1.5 rounded-full transition-all",
                          (survey.result === 'triggered' || survey.result === 'positive')
                            ? "bg-cairos-warning"
                            : "bg-cairos-primary"
                        )}
                        style={{ width: `${(survey.score / survey.maxScore) * 100}%` }}
                      />
                    </div>
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
