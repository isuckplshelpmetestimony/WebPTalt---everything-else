'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentTable } from '@/components/patients/DocumentTable';
import { ActionBar } from '@/components/patients/ActionBar';
import { PatientsSidebar } from '@/components/patients/PatientsSidebar';
import { PatientCharts } from '@/components/patients/PatientCharts';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { NewDocumentModal } from '@/components/documents/NewDocumentModal';
import { Document } from '@/lib/types/document';
import { Patient } from '@/lib/types/patient';

// Mock data - replace with actual API calls
const mockPatient: Patient = {
  id: '1',
  name: 'ROBERT D MCMULLEN JR',
  dob: new Date('1980-05-15'),
  gender: 'Male',
  phone: '(555) 123-4567',
  email: 'robert.mcmullen@example.com',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
  cases: [
    {
      id: '1',
      name: '[WC] 12/15/2025: LUMBAR',
      createdDate: new Date('2025-12-15'),
      visitsRemaining: 0,
      expirationDate: new Date('2025-12-19'),
      authorizationStatus: 'expiring',
    },
    {
      id: '2',
      name: '[WC] 12/22/2025: NECK',
      createdDate: new Date('2025-12-22'),
      visitsRemaining: 5,
      expirationDate: new Date('2026-06-22'),
      authorizationStatus: 'active',
    },
  ],
  insurance: {
    id: '1',
    name: 'NYSIF STATE INS FUND',
    policyNumber: 'BC123456789',
    groupNumber: 'GRP001',
    coverageStartDate: new Date('2025-01-01'),
    coverageEndDate: new Date('2025-12-31'),
  },
  diagnosis: 'Radiculopathy, lumbar region',
  diagnosisCode: 'M54.16',
  patientType: 'workers-comp',
  arrivalRate: 100.0,
  cancels: 0,
  noShows: 0,
  stationNumber: '12 STN',
  authorization: {
    id: '1',
    caseId: '1',
    visitsAuthorized: 20,
    visitsUsed: 20,
    expirationDate: new Date('2025-12-19'),
    status: 'expiring',
  },
  surveys: [
    {
      id: '1',
      type: 'PHQ-2',
      completedDate: new Date('2025-12-15'),
      score: 1,
      maxScore: 6,
      result: 'negative',
    },
    {
      id: '2',
      type: 'LEFS',
      completedDate: new Date('2025-12-15'),
      score: 45,
      maxScore: 80,
      result: 'not-triggered',
    },
    {
      id: '3',
      type: 'Social Drivers',
      completedDate: new Date('2025-12-15'),
      result: 'negative',
    },
  ],
};

// Mock multiple patients for tabs
const mockPatients = [
  { id: '1', name: 'ROBERT D MCMULLEN JR', patientId: '1', stationNumber: '12 STN' },
  { id: '2', name: 'MIGUEL A PEREZ', patientId: '2', stationNumber: '20499' },
  { id: '3', name: 'SANCHEZ, REBECCA', patientId: '3', stationNumber: '28004' },
  { id: '4', name: 'MEJIA, SEGUNDO', patientId: '4', stationNumber: '28559' },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'PT Daily Note',
    entryDate: new Date('2025-12-20'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'Appointment On: 12/20/2025',
    timeIn: '09:00',
    timeOut: '10:00',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'JONATHAN ZUMARRAGA',
    locked: false,
    createdAt: new Date('2025-12-20'),
    status: 'completed',
    content: {
      subjective: 'Patient reports improvement in lower back pain. Pain level decreased from 7/10 to 4/10. Able to sit for longer periods without discomfort.',
      objective: 'Vitals: BP 120/80, HR 72, O2 Sat 98%. Posture improved. AROM lumbar flexion increased to 45 degrees. Muscle strength 4/5 in lumbar extensors. Negative straight leg raise bilaterally.',
      assessment: 'Patient showing good progress with physical therapy intervention. Pain management effective. Strength and ROM improving.',
      plan: 'Continue current treatment plan: 3x/week for 2 weeks, then 2x/week. Continue therapeutic exercise (97110), manual therapy (97140), and neuromuscular re-education (97112).',
    },
  },
  {
    id: '2',
    type: 'PT Initial Evaluation',
    entryDate: new Date('2025-12-15'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'PT Initial Evaluation',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'JONATHAN ZUMARRAGA',
    locked: true,
    createdAt: new Date('2025-12-15'),
    status: 'locked',
    content: {
      subjective: 'Patient presents with acute lower back pain following work-related injury. Pain started 2 weeks ago after lifting heavy object. Pain is constant, 7/10, radiating to right leg. Aggravated by sitting and bending.',
      objective: 'Vitals: BP 130/85, HR 78, O2 Sat 99%. Antalgic gait. Limited AROM lumbar flexion (20 degrees). Positive straight leg raise on right at 45 degrees. Muscle strength 3/5 in lumbar extensors.',
      assessment: 'Lumbar radiculopathy, likely L5-S1. Patient requires physical therapy intervention to address pain, improve function, and prevent chronicity.',
      plan: 'Initial treatment plan: 3x/week for 4 weeks. Focus on pain management, core strengthening, and functional mobility. Billing codes: 97110 (Therapeutic Exercise), 97140 (Manual Therapy), 97112 (Neuromuscular Re-education).',
    },
  },
  {
    id: '3',
    type: 'Report',
    entryDate: new Date('2025-12-15'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'PT Full Initial Evaluation Report',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'JONATHAN ZUMARRAGA',
    locked: true,
    createdAt: new Date('2025-12-15'),
    status: 'locked',
  },
  {
    id: '4',
    type: 'Image Note',
    entryDate: new Date('2025-12-15'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'WCB VERI 12/15',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'BILLING',
    locked: true,
    createdAt: new Date('2025-12-15'),
    status: 'locked',
  },
  {
    id: '5',
    type: 'Image Note',
    entryDate: new Date('2025-12-15'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'WC VFX 2025',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'BILLING',
    locked: true,
    createdAt: new Date('2025-12-15'),
    status: 'locked',
  },
  {
    id: '6',
    type: 'Image Note',
    entryDate: new Date('2025-12-15'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'PAR APP 16V PA-00-3248-213',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'BILLING',
    locked: true,
    createdAt: new Date('2025-12-15'),
    status: 'locked',
  },
  {
    id: '7',
    type: 'Document Organizer',
    entryDate: new Date('2025-12-16'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'Appointment On: 12/16/2025',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'JONATHAN ZUMARRAGA',
    locked: true,
    createdAt: new Date('2025-12-16'),
    status: 'locked',
    relatedDocumentIds: ['1', '2', '3'],
  },
  {
    id: '8',
    type: 'Image Note',
    entryDate: new Date('2025-12-18'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'RX - NECK & BACK 12/3/25',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'JACKSON HEIGHTS',
    locked: true,
    createdAt: new Date('2025-12-18'),
    status: 'locked',
    imageUrl: 'https://via.placeholder.com/800x600?text=Medical+Image',
  },
  {
    id: '9',
    type: 'PT Progress with Billing',
    entryDate: new Date('2025-12-21'),
    caseId: '1',
    caseName: '[WC] 12/15/2025: LUMBAR',
    title: 'Appointment On: 12/21/2025',
    timeIn: '10:00',
    timeOut: '11:15',
    renderingProvider: 'Dr. Sarah Johnson',
    owner: 'JONATHAN ZUMARRAGA',
    locked: false,
    createdAt: new Date('2025-12-21'),
    status: 'completed',
    content: {
      subjective: 'Patient reports continued improvement. Pain level now 3/10. Able to perform daily activities with less discomfort.',
      objective: 'Vitals: BP 118/78, HR 70, O2 Sat 99%. AROM lumbar flexion improved to 50 degrees. Muscle strength 4+/5 in lumbar extensors.',
      assessment: 'Patient responding well to treatment. Progressing toward goals. Continue current plan.',
      plan: 'Continue 3x/week for 2 more weeks, then reduce to 2x/week. Continue therapeutic exercise and manual therapy.',
    },
    billing: {
      codes: [
        {
          code: '97110',
          description: 'Therapeutic Exercise',
          units: 2,
          time: 30,
        },
        {
          code: '97140',
          description: 'Manual Therapy',
          units: 1,
          time: 15,
        },
        {
          code: '97112',
          description: 'Neuromuscular Re-education',
          units: 1,
          time: 15,
        },
      ],
      totalUnits: 4,
      totalTime: 60,
    },
  },
];

export default function PatientChartPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeCaseId, setActiveCaseId] = useState<string>('1');
  const [activePatientId, setActivePatientId] = useState('1');
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false);
  
  const activeCase = mockPatient.cases.find(c => c.id === activeCaseId);
  const caseDocumentsCount = mockDocuments.filter(d => d.caseId === activeCaseId).length;
  
  const handleViewDocument = (documentId: string) => {
    router.push(`/patients/${params.id}/documents/${documentId}`);
  };
  
  const handleEditDocument = (id: string) => {
    // Navigate to edit page or open edit modal
    router.push(`/documents/${id}/edit`);
  };
  
  const handleCopyDocument = (id: string) => {
    // Copy document logic
    console.log('Copy document', id);
    // Could navigate to new document page with copied data
  };
  
  const handlePrintDocument = (id: string) => {
    // Print document logic
    console.log('Print document', id);
  };
  
  const handleAddAddendum = (id: string) => {
    // Open addendum modal or navigate to addendum page
    console.log('Add addendum to document', id);
  };
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar - Patients List */}
      <PatientsSidebar
        patients={mockPatients}
        activePatientId={activePatientId}
        onSelectPatient={setActivePatientId}
        onClosePatient={(patientId) => {
          if (patientId === activePatientId && mockPatients.length > 1) {
            const nextPatient = mockPatients.find(p => p.patientId !== patientId);
            if (nextPatient) setActivePatientId(nextPatient.patientId);
          }
        }}
        onNewPatient={() => console.log('New Patient')}
        onOpenPatient={() => console.log('Open Patient')}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumbs */}
        <div className="px-4 pt-4">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Patients', href: '/patients' },
            { label: mockPatient.name }
          ]} />
        </div>
        
        {/* Action Bar */}
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between mb-3">
            <ActionBar
              onNewDocument={() => setIsNewDocumentOpen(true)}
              onNewCase={() => console.log('New Case')}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Charts Section */}
          <div className="mb-6">
            <PatientCharts patient={mockPatient} activeCase={activeCase} />
          </div>
          
          {/* Document Table */}
          <DocumentTable
            documents={mockDocuments}
            cases={mockPatient.cases}
            activeCaseId={activeCaseId}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onCopy={handleCopyDocument}
            onPrint={handlePrintDocument}
          />
        </div>
      </div>

      {/* Modals */}
      <NewDocumentModal
        isOpen={isNewDocumentOpen}
        onClose={() => setIsNewDocumentOpen(false)}
        cases={mockPatient.cases}
        providers={[
          { id: '1', name: 'Dr. Sarah Johnson' },
          { id: '2', name: 'Dr. Michael Chen' },
          { id: '3', name: 'Dr. Emily Rodriguez' },
        ]}
        documents={mockDocuments}
        onSubmit={(data) => {
          console.log('Creating document:', data);
          // Handle document creation here
        }}
      />
    </div>
  );
}

