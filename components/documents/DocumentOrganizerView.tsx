'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { Card } from '../ui/Card';
import { Folder, FileText, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { Badge } from '../ui/Badge';
import { clsx } from 'clsx';

interface DocumentOrganizerViewProps {
  document: Document;
  relatedDocuments: Document[];
}

const getDocumentIcon = (type: string) => {
  if (type.includes('Image')) return '🖼️';
  if (type.includes('Report')) return '📄';
  return '📋';
};

const getDocumentColor = (type: string) => {
  if (type.includes('Image')) return 'bg-blue-50 text-blue-600';
  if (type.includes('Report')) return 'bg-purple-50 text-purple-600';
  if (type.includes('Evaluation')) return 'bg-green-50 text-green-600';
  return 'bg-gray-50 text-gray-600';
};

export const DocumentOrganizerView: React.FC<DocumentOrganizerViewProps> = ({
  document,
  relatedDocuments,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-50 rounded-lg">
          <Folder className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-h3 text-gray-900">Document Organizer</h3>
      </div>

      {relatedDocuments.length > 0 ? (
        <div className="space-y-3">
          <p className="text-body-sm text-gray-600 mb-4">
            This organizer contains {relatedDocuments.length} related document{relatedDocuments.length !== 1 ? 's' : ''}:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    "p-2 rounded-lg flex-shrink-0",
                    getDocumentColor(doc.type)
                  )}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm font-semibold text-gray-900 mb-1 truncate">
                      {doc.title || doc.type}
                    </h4>
                    <Badge variant="default" size="xs" className="mb-2">
                      {doc.type}
                    </Badge>
                    <div className="space-y-1 text-body-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(doc.entryDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        <span className="truncate">{doc.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-body text-gray-600">No related documents found</p>
        </div>
      )}
    </Card>
  );
};

