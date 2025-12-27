'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { CaseSelector } from './CaseSelector';
import { TimeTracker } from './TimeTracker';
import { ProviderSelector } from './ProviderSelector';
import { DocumentType, Document } from '@/lib/types/document';
import { Case } from '@/lib/types/patient';
import { format, startOfDay } from 'date-fns';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
  providers: { id: string; name: string }[];
  documents?: Document[];
  onSubmit?: (data: {
    type: DocumentType;
    caseId: string;
    entryDate: string;
    timeIn?: string;
    timeOut?: string;
    renderingProviderId?: string;
    coSigningProviderId?: string;
    copyFromDocumentId?: string;
  }) => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  cases,
  providers,
  documents = [],
  onSubmit,
}) => {
  const router = useRouter();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    // Navigate to the document creation page for the selected type
    router.push(`/documents/new/${encodeURIComponent(selectedType)}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Document" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
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
            cases={cases}
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
          providers={providers}
          renderingProviderId={renderingProviderId}
          coSigningProviderId={coSigningProviderId}
          onRenderingProviderChange={setRenderingProviderId}
          onCoSigningProviderChange={setCoSigningProviderId}
        />

        <div className="h-px bg-cairos-border" />

        {/* Copy from Document (Optional) */}
        {documents.length > 0 && (
          <div className="section-spacing">
            <h3 className="text-h3 mb-3">Copy from Document (Optional)</h3>
            <Select
              options={[
                { value: '', label: 'Select a document to copy from...' },
                ...documents.map((doc) => ({
                  value: doc.id,
                  label: `${doc.title || doc.type} - ${format(doc.entryDate, 'MMM d, yyyy')}`,
                })),
              ]}
              value={copyFromDocumentId}
              onChange={(e) => setCopyFromDocumentId(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-cairos-border">
          <Button type="button" variant="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!selectedType}>
            Create Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};

