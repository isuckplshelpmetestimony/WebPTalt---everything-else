'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Document } from '@/lib/types/document';
import { formatDate } from '@/lib/utils/date';
import { SOAPNoteView } from './SOAPNoteView';
import { BillingDisplay } from './BillingDisplay';
import { ImageNoteView } from './ImageNoteView';
import { DocumentOrganizerView } from './DocumentOrganizerView';
import { ReportView } from './ReportView';
import { WCMedicalReportView } from './WCMedicalReportView';
import { DocumentViewActions } from './DocumentViewActions';
import { Badge } from '../ui/Badge';
import { Lock, Calendar, Clock, User, FileText } from 'lucide-react';
import { clsx } from 'clsx';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onEdit?: (id: string) => void;
  onCopy?: (id: string) => void;
  onPrint?: (id: string) => void;
  onAddendum?: (id: string) => void;
  relatedDocuments?: Document[]; // For Document Organizer view
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  document,
  onEdit,
  onCopy,
  onPrint,
  onAddendum,
  relatedDocuments = [],
}) => {
  const isSOAPNote = [
    'PT Daily Note',
    'PT Initial Evaluation',
    'PT Progress Note w/o Billing',
    'PT Discharge Note',
    'PT Progress with Billing',
  ].includes(document.type);

  const hasBilling = document.type === 'PT Progress with Billing' && document.billing;

  const renderDocumentContent = () => {
    switch (document.type) {
      case 'Image Note':
        return <ImageNoteView document={document} />;
      
      case 'Document Organizer':
        return <DocumentOrganizerView document={document} relatedDocuments={relatedDocuments} />;
      
      case 'Report':
        return <ReportView document={document} />;
      
      case 'WC Medical Report':
        return <WCMedicalReportView document={document} />;
      
      default:
        if (isSOAPNote) {
          return (
            <>
              <SOAPNoteView document={document} />
              {hasBilling && <BillingDisplay billing={document.billing!} timeIn={document.timeIn} timeOut={document.timeOut} />}
            </>
          );
        }
        return (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-body text-gray-600">Document content not available</p>
          </div>
        );
    }
  };

  const calculateDuration = () => {
    if (!document.timeIn || !document.timeOut) return null;
    
    const [inHours, inMinutes] = document.timeIn.split(':').map(Number);
    const [outHours, outMinutes] = document.timeOut.split(':').map(Number);
    
    const inTotal = inHours * 60 + inMinutes;
    const outTotal = outHours * 60 + outMinutes;
    const duration = outTotal - inTotal;
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const duration = calculateDuration();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={document.title || document.type} size="xl">
      {/* Document Header */}
      <div className="mb-6 pb-6 border-b border-cairos-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" size="sm">
                {document.type}
              </Badge>
              {document.locked && (
                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Locked
                </Badge>
              )}
              {document.status && (
                <Badge 
                  variant={document.status === 'completed' ? 'success' : 'default'} 
                  size="sm"
                >
                  {document.status.toUpperCase()}
                </Badge>
              )}
            </div>
            {document.caseName && (
              <p className="text-body-sm text-gray-600 mb-1">Case: {document.caseName}</p>
            )}
          </div>
          
          <DocumentViewActions
            document={document}
            onEdit={onEdit ? () => onEdit(document.id) : undefined}
            onCopy={onCopy ? () => onCopy(document.id) : undefined}
            onPrint={onPrint ? () => onPrint(document.id) : undefined}
            onAddendum={onAddendum && document.locked ? () => onAddendum(document.id) : undefined}
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Entry Date</div>
              <div className="font-medium text-gray-900">{formatDate(document.entryDate)}</div>
            </div>
          </div>
          
          {document.timeIn && document.timeOut && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-gray-500">Time</div>
                <div className="font-medium text-gray-900">
                  {document.timeIn} - {document.timeOut}
                  {duration && ` (${duration})`}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Provider</div>
              <div className="font-medium text-gray-900">{document.renderingProvider}</div>
            </div>
          </div>
          
          {document.coSigningProvider && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-gray-500">Co-Signing</div>
                <div className="font-medium text-gray-900">{document.coSigningProvider}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Content */}
      <div className="space-y-6">
        {renderDocumentContent()}
      </div>

      {/* Addendums */}
      {document.addendums && document.addendums.length > 0 && (
        <div className="mt-6 pt-6 border-t border-cairos-border">
          <h3 className="text-h3 mb-4">Addendums</h3>
          <div className="space-y-4">
            {document.addendums.map((addendum) => (
              <div key={addendum.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm font-medium text-gray-900">{addendum.addedBy}</span>
                  <span className="text-body-xs text-gray-500">{formatDate(addendum.addedAt)}</span>
                </div>
                <p className="text-body-sm text-gray-700 whitespace-pre-wrap">{addendum.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};





