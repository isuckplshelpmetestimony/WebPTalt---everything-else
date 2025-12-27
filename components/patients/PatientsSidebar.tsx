'use client';

import React, { useState, useMemo } from 'react';
import { User, X, Search, UserPlus, FolderOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Patient {
  id: string;
  name: string;
  patientId: string;
  stationNumber?: string;
}

interface PatientsSidebarProps {
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onClosePatient?: (patientId: string) => void;
  onNewPatient?: () => void;
  onOpenPatient?: () => void;
}

export const PatientsSidebar: React.FC<PatientsSidebarProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onClosePatient,
  onNewPatient,
  onOpenPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    
    const query = searchQuery.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.patientId.toLowerCase().includes(query) ||
      patient.stationNumber?.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-h3 text-white mb-2">Open Patients</h2>
        <p className="text-body-sm text-gray-400">{patients.length} patient{patients.length !== 1 ? 's' : ''} open</p>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-body-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-gray-800 space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onNewPatient}
          className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white border-gray-700 h-9"
        >
          <UserPlus className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>New Patient</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenPatient}
          className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white border-gray-700 h-9"
        >
          <FolderOpen className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>Open Patient</span>
        </Button>
      </div>
      
      {/* Patients List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-800">
        {filteredPatients.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-body-sm text-gray-400">No patients found</p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
          const isActive = patient.patientId === activePatientId;
          
          return (
            <div
              key={patient.id}
              className={clsx(
                'p-3 cursor-pointer transition-colors relative group rounded-r-xl mx-2 my-1',
                isActive
                  ? 'bg-cairos-primary border-l-4 border-cairos-primary'
                  : 'hover:bg-gray-800'
              )}
              onClick={() => onSelectPatient(patient.patientId)}
            >
              <div className="flex items-start gap-2">
                <User className={clsx(
                  'w-4 h-4 mt-0.5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400'
                )} />
                <div className="flex-1 min-w-0">
                  <div className={clsx(
                    'text-body-sm font-medium truncate',
                    isActive ? 'text-white' : 'text-gray-200'
                  )}>
                    {patient.name}
                  </div>
                  {patient.stationNumber && (
                    <div className={clsx(
                      'text-body-xs mt-0.5',
                      isActive ? 'text-gray-300' : 'text-gray-500'
                    )}>
                      {patient.stationNumber}
                    </div>
                  )}
                </div>
                {onClosePatient && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClosePatient(patient.patientId);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded-lg transition-all"
                    aria-label="Close patient"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};

