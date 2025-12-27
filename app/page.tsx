'use client';

import Link from 'next/link';
import { FileText, Users, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCards } from '@/components/dashboard/AlertCards';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

// Mock data - replace with actual API calls
const mockIncompleteNotesPatients = [
  { id: '1', name: 'ROBERT D MCMULLEN JR', count: 3 },
  { id: '2', name: 'MIGUEL A PEREZ', count: 2 },
];

const mockExpiringAuthorizationsPatients = [
  { id: '1', name: 'ROBERT D MCMULLEN JR', expirationDate: new Date('2025-12-19') },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <h1 className="text-h1 mb-6">Dashboard</h1>
      
      {/* Alert Cards */}
      <AlertCards
        incompleteNotesCount={mockIncompleteNotesPatients.length}
        incompleteNotesPatients={mockIncompleteNotesPatients}
        expiringAuthorizationsCount={mockExpiringAuthorizationsPatients.length}
        expiringAuthorizationsPatients={mockExpiringAuthorizationsPatients}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
              <FileText className="w-5 h-5 text-cairos-primary" />
            </div>
            <h2 className="text-h3">Documents</h2>
          </div>
          <p className="text-body text-gray-600 mb-3">
            Create and manage patient documentation
          </p>
          <Link href="/documents/new">
            <Button size="sm">Create Document</Button>
          </Link>
        </Card>
        
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
              <Users className="w-5 h-5 text-cairos-primary" />
            </div>
            <h2 className="text-h3">Patients</h2>
          </div>
          <p className="text-body text-gray-600 mb-3">
            View patient charts and documentation
          </p>
          <Link href="/patients">
            <Button size="sm">View Patients</Button>
          </Link>
        </Card>
        
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
              <Calendar className="w-5 h-5 text-cairos-primary" />
            </div>
            <h2 className="text-h3">Schedule</h2>
          </div>
          <p className="text-body text-gray-600 mb-3">
            Manage appointments and schedule
          </p>
          <Link href="/schedule">
            <Button size="sm">View Schedule</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

