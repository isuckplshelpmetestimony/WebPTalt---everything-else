'use client';

import React from 'react';
import { Lock, Copy, Printer, Eye, Edit } from 'lucide-react';
import { Document } from '@/lib/types/document';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime } from '@/lib/utils/date';
import { documentTypes } from '@/lib/constants/documentTypes';
import { clsx } from 'clsx';

interface DocumentCardProps {
  document: Document;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCopy?: (id: string) => void;
  onPrint?: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onCopy,
  onPrint,
}) => {
  const docType = documentTypes.find((dt) => dt.type === document.type);
  const Icon = docType?.icon;
  
  return (
    <Card
      className={clsx(
        'hover:shadow-md transition-all',
        document.locked && 'opacity-75'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
              <Icon className="w-5 h-5 text-cairos-primary" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-body font-medium">{document.type}</h4>
              {document.locked && (
                <Lock className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <div className="text-body-sm text-gray-600 mt-1">
              {formatDate(document.entryDate)}
            </div>
          </div>
        </div>
        <Badge
          variant={
            document.status === 'completed'
              ? 'success'
              : document.status === 'locked'
              ? 'primary'
              : 'default'
          }
          size="sm"
        >
          {document.status || 'draft'}
        </Badge>
      </div>
      
      <div className="text-body-sm text-gray-600 space-y-1 mb-4">
        {document.timeIn && document.timeOut && (
          <div>
            Time: {document.timeIn} - {document.timeOut}
          </div>
        )}
        <div>Provider: {document.renderingProvider}</div>
        {document.coSigningProvider && (
          <div>Co-signer: {document.coSigningProvider}</div>
        )}
        <div>Owner: {document.owner}</div>
      </div>
      
      <div className="flex gap-2 pt-3 border-t border-cairos-border">
        {onView && (
          <button
            onClick={() => onView(document.id)}
            className="flex items-center gap-1 text-body-sm text-gray-600 hover:text-cairos-primary transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        )}
        {onEdit && !document.locked && (
          <button
            onClick={() => onEdit(document.id)}
            className="flex items-center gap-1 text-body-sm text-gray-600 hover:text-cairos-primary transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
        {onCopy && (
          <button
            onClick={() => onCopy(document.id)}
            className="flex items-center gap-1 text-body-sm text-gray-600 hover:text-cairos-primary transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        )}
        {onPrint && (
          <button
            onClick={() => onPrint(document.id)}
            className="flex items-center gap-1 text-body-sm text-gray-600 hover:text-cairos-primary transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        )}
      </div>
    </Card>
  );
};

