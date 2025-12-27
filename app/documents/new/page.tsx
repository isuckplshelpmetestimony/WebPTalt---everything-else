'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DocumentTypeSelector } from '@/components/documents/DocumentTypeSelector';
import { CaseSelector } from '@/components/documents/CaseSelector';
import { TimeTracker } from '@/components/documents/TimeTracker';
import { ProviderSelector } from '@/components/documents/ProviderSelector';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { DocumentType } from '@/lib/types/document';
import { Case } from '@/lib/types/patient';
import { format, startOfDay } from 'date-fns';

// Mock data - replace with actual API calls
const mockCases: Case[] = [
  {
    id: '1',
    name: '[WC] 12/15/2025: LUMBAR',
    createdDate: new Date('2025-12-15'),
    visitsRemaining: 12,
    expirationDate: new Date('2026-06-15'),
    authorizationStatus: 'active',
  },
  {
    id: '2',
    name: '[WC] 11/20/2025: CERVICAL',
    createdDate: new Date('2025-11-20'),
    visitsRemaining: 3,
    expirationDate: new Date('2026-05-20'),
    authorizationStatus: 'expiring',
  },
];

const mockProviders = [
  { id: '1', name: 'Dr. Sarah Johnson' },
  { id: '2', name: 'Dr. Michael Chen' },
  { id: '3', name: 'Dr. Emily Rodriguez' },
];

export default function NewDocumentPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<DocumentType | undefined>();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(
    format(startOfDay(new Date()), 'yyyy-MM-dd')
  );
  const [timeIn, setTimeIn] = useState<string>('');
  const [timeOut, setTimeOut] = useState<string>('');
  const [renderingProviderId, setRenderingProviderId] = useState<string>('');
  const [coSigningProviderId, setCoSigningProviderId] = useState<string>('');
  const [copyFromDocumentId, setCopyFromDocumentId] = useState<string>('');
  
  const handleClose = () => {
    setIsOpen(false);
    router.push('/documents');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle document creation
    console.log('Creating document:', {
      type: selectedType,
      caseId: selectedCaseId,
      entryDate,
      timeIn,
      timeOut,
      renderingProviderId,
      coSigningProviderId,
    });
    handleClose();
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Documents', href: '/documents' },
        { label: 'New Document' }
      ]} />
      <Modal isOpen={isOpen} onClose={handleClose} title="Create New Document" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Type Selection */}
        <div className="section-spacing">
          <h3 className="text-h3 mb-3">Document Type</h3>
          <DocumentTypeSelector
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        </div>
        
        <div className="h-px bg-cairos-border" />
        
        {/* Case Selection */}
        <div className="section-spacing">
          <h3 className="text-h3 mb-3">Case</h3>
          <CaseSelector
            cases={mockCases}
            selectedCaseId={selectedCaseId}
            onSelect={setSelectedCaseId}
          />
        </div>
        
        <div className="h-px bg-cairos-border" />
        
        {/* Entry Date */}
        <div className="section-spacing">
          <h3 className="text-h3 mb-3">Entry Date</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input
              type="date"
              label="Entry Date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setEntryDate(format(startOfDay(new Date()), 'yyyy-MM-dd'))
                }
              >
                Today
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setEntryDate(format(startOfDay(yesterday), 'yyyy-MM-dd'));
                }}
              >
                Yesterday
              </Button>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-cairos-border" />
        
        {/* Time Tracking */}
        <TimeTracker
          timeIn={timeIn}
          timeOut={timeOut}
          onTimeInChange={setTimeIn}
          onTimeOutChange={setTimeOut}
        />
        
        <div className="h-px bg-cairos-border" />
        
        {/* Provider Assignment */}
        <ProviderSelector
          providers={mockProviders}
          renderingProviderId={renderingProviderId}
          coSigningProviderId={coSigningProviderId}
          onRenderingProviderChange={setRenderingProviderId}
          onCoSigningProviderChange={setCoSigningProviderId}
        />
        
        <div className="h-px bg-cairos-border" />
        
        {/* Copy from Document (Optional) */}
        <div className="section-spacing">
          <h3 className="text-h3 mb-3">Copy from Document (Optional)</h3>
          <Input
            type="text"
            label="Document ID"
            placeholder="Enter locked document ID to copy from"
            value={copyFromDocumentId}
            onChange={(e) => setCopyFromDocumentId(e.target.value)}
          />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-cairos-border">
          <Button type="button" variant="cancel" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!selectedType || !selectedCaseId}>
            Create Document
          </Button>
        </div>
      </form>
    </Modal>
    </div>
  );
}

