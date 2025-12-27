'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Calendar, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

// Mock patient list - replace with actual API calls
const mockPatients = [
  { 
    id: '1', 
    name: 'ROBERT D MCMULLEN JR', 
    dob: new Date('1980-05-15'),
    diagnosis: 'Radiculopathy, lumbar region',
    lastVisit: new Date('2025-12-20'),
    stationNumber: '12 STN',
    caseCount: 2,
  },
  { 
    id: '2', 
    name: 'MIGUEL A PEREZ', 
    dob: new Date('1975-08-22'),
    diagnosis: 'Cervical strain',
    lastVisit: new Date('2025-12-18'),
    stationNumber: '20499',
    caseCount: 1,
  },
  { 
    id: '3', 
    name: 'SANCHEZ, REBECCA', 
    dob: new Date('1990-03-10'),
    diagnosis: 'Rotator cuff tear',
    lastVisit: new Date('2025-12-19'),
    stationNumber: '28004',
    caseCount: 1,
  },
  { 
    id: '4', 
    name: 'MEJIA, SEGUNDO', 
    dob: new Date('1985-11-05'),
    diagnosis: 'Knee osteoarthritis',
    lastVisit: new Date('2025-12-17'),
    stationNumber: '28559',
    caseCount: 1,
  },
  { 
    id: '5', 
    name: 'JOHN DOE', 
    dob: new Date('1980-05-15'),
    diagnosis: 'Lower back pain',
    lastVisit: new Date('2025-12-15'),
    stationNumber: '12345',
    caseCount: 1,
  },
  { 
    id: '6', 
    name: 'JANE SMITH', 
    dob: new Date('1975-08-22'),
    diagnosis: 'Shoulder impingement',
    lastVisit: new Date('2025-12-14'),
    stationNumber: '67890',
    caseCount: 2,
  },
];

const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export default function PatientsPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  
  const filteredPatients = useMemo(() => {
    if (!searchValue.trim()) return mockPatients;
    
    const query = searchValue.toLowerCase();
    return mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.diagnosis.toLowerCase().includes(query) ||
      patient.stationNumber.toLowerCase().includes(query)
    );
  }, [searchValue]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Patients' }
      ]} />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 mb-2">Patients</h1>
          <p className="text-body text-gray-600">
            Manage and view patient charts and documentation
          </p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-cairos-border rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPatients.map((patient) => {
          const initials = getInitials(patient.name);
          const age = calculateAge(patient.dob);
          
          return (
            <Card key={patient.id} className="p-5 hover:shadow-lg transition-all">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-cairos-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-body-lg font-bold text-cairos-primary">
                    {initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-body font-bold text-gray-900 mb-1 truncate">
                    {patient.name}
                  </h3>
                  <p className="text-body-sm text-gray-500">
                    Age {age} • {patient.stationNumber}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-body-sm text-gray-600 mb-4 line-clamp-2">
                {patient.diagnosis}
              </p>

              {/* Additional Info */}
              <div className="space-y-1.5 mb-4 text-body-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Last visit: {formatDate(patient.lastVisit)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  <span>{patient.caseCount} case{patient.caseCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-cairos-border">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/patients/${patient.id}`)}
                  className="flex-1"
                >
                  View Chart
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/schedule?patient=${patient.id}`)}
                  className="flex-1"
                >
                  Schedule
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-gray-600">No patients found</p>
        </div>
      )}
    </div>
  );
}
