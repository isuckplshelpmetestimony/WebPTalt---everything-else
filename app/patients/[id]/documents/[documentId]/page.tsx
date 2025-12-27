'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DocumentView } from '@/components/documents/DocumentView';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
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
  ],
  insurance: {
    id: '1',
    name: 'NYSIF STATE INS FUND',
    policyNumber: 'BC123456789',
    groupNumber: 'GRP001',
  },
  diagnosis: 'Radiculopathy, lumbar region',
  diagnosisCode: 'M54.16',
  patientType: 'workers-comp',
  arrivalRate: 100.0,
};

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

export default function DocumentPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.documentId as string;
  const patientId = params.id as string;

  const document = mockDocuments.find(d => d.id === documentId);
  const patient = mockPatient;

  if (!document) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Patients', href: '/patients' },
          { label: patient.name, href: `/patients/${patientId}` },
          { label: 'Document' }
        ]} />
        <div className="text-center py-12">
          <p className="text-body text-gray-600">Document not found</p>
        </div>
      </div>
    );
  }

  // Get related documents for Document Organizer
  const relatedDocuments = document.type === 'Document Organizer' && document.relatedDocumentIds
    ? mockDocuments.filter(d => document.relatedDocumentIds!.includes(d.id))
    : [];

  const handleEdit = (id: string) => {
    router.push(`/documents/${id}/edit`);
  };

  const handleCopy = (id: string) => {
    console.log('Copy document', id);
  };

  const handlePrint = (id: string) => {
    window.print();
  };

  const handleAddendum = (id: string) => {
    console.log('Add addendum to document', id);
  };

  return (
    <div className="min-h-screen bg-cairos-bg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Patients', href: '/patients' },
          { label: patient.name, href: `/patients/${patientId}` },
          { label: document.title || document.type }
        ]} />
        
        <DocumentView
          document={document}
          onEdit={handleEdit}
          onCopy={handleCopy}
          onPrint={handlePrint}
          onAddendum={handleAddendum}
          relatedDocuments={relatedDocuments}
        />
      </div>
    </div>
  );
}

