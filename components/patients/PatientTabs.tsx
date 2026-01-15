'use client';

import React from 'react';
import { X, User } from 'lucide-react';
import { clsx } from 'clsx';

interface PatientTab {
  id: string;
  name: string;
  patientId: string;
  stationNumber?: string;
}

interface PatientTabsProps {
  patients: PatientTab[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onClosePatient: (patientId: string) => void;
}

export const PatientTabs: React.FC<PatientTabsProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onClosePatient,
}) => {
  return (
    <div className="flex items-center gap-1 border-b border-cairos-border mb-3 overflow-x-auto">
      {patients.map((patient) => {
        const isActive = patient.patientId === activePatientId;
        
        return (
          <div
            key={patient.id}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 border-b-2 transition-colors cursor-pointer',
              isActive
                ? 'border-cairos-primary bg-cairos-primary bg-opacity-5'
                : 'border-transparent hover:bg-gray-50'
            )}
            onClick={() => onSelectPatient(patient.patientId)}
          >
            <User className="w-4 h-4 text-gray-600" />
            <span className={clsx(
              'text-body-sm font-medium whitespace-nowrap',
              isActive ? 'text-cairos-primary' : 'text-gray-700'
            )}>
              {patient.name}
            </span>
            {patient.stationNumber && (
              <span className="text-body-sm text-gray-500">
                {patient.stationNumber}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClosePatient(patient.patientId);
              }}
              className="ml-1 p-0.5 hover:bg-gray-200 rounded transition-colors"
              aria-label="Close patient tab"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
};





