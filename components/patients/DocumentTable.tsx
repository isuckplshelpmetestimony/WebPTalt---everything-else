'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon,
  FileCheck,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { DocumentActions } from './DocumentActions';

interface DocumentTableProps {
  documents: Document[];
  cases: Case[];
  activeCaseId?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCopy?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const getDocumentIcon = (type: string) => {
  if (type.includes('Image')) return ImageIcon;
  if (type.includes('Report')) return FileCheck;
  if (type.includes('Organizer')) return Folder;
  return FileText;
};

const getDocumentColor = (type: string) => {
  if (type.includes('Image')) return 'bg-blue-50 text-blue-600';
  if (type.includes('Report')) return 'bg-purple-50 text-purple-600';
  if (type.includes('Organizer')) return 'bg-orange-50 text-orange-600';
  if (type.includes('Evaluation')) return 'bg-green-50 text-green-600';
  return 'bg-gray-50 text-gray-600';
};

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  cases,
  activeCaseId,
  onView,
  onEdit,
  onCopy,
  onPrint,
}) => {
  // Show all documents (Full Chart view)
  const filteredDocuments = documents;

  // Group documents by case, then by entry date
  const groupedData = cases
    .map((caseItem) => {
      const caseDocs = filteredDocuments.filter(doc => doc.caseId === caseItem.id);
      if (caseDocs.length === 0) return null;

      const isActiveCase = caseItem.id === activeCaseId;

      // Group by entry date
      const docsByDate = caseDocs.reduce((acc, doc) => {
        const dateKey = formatDate(doc.entryDate);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(doc);
        return acc;
      }, {} as Record<string, Document[]>);

      return {
        caseItem,
        isActiveCase,
        docsByDate,
      };
    })
    .filter(Boolean);

  return (
    <div>
      <div className="space-y-6">
        {groupedData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-body text-gray-600">No documents found</p>
          </div>
        ) : (
          groupedData.map((group) => {
            if (!group) return null;
            const { caseItem, isActiveCase, docsByDate } = group;

            return (
              <div key={caseItem.id} className="space-y-4">
                {/* Case Header */}
                <div className="flex items-center gap-2 px-2 py-2">
                  <Folder className={clsx('w-5 h-5', isActiveCase ? 'text-cairos-primary' : 'text-gray-500')} />
                  <div className="flex items-center gap-2">
                    <h3 className={clsx(
                      "text-body font-semibold",
                      isActiveCase ? "text-cairos-primary" : "text-gray-700"
                    )}>
                      {caseItem.name}
                    </h3>
                    <Badge 
                      variant={isActiveCase ? "primary" : "default"} 
                      size="xs"
                    >
                      {Object.values(docsByDate).flat().length} docs
                    </Badge>
                    <span className="text-body-xs text-gray-500">
                      • Created {formatDate(caseItem.createdDate)}
                    </span>
                  </div>
                </div>

                {/* Documents grouped by Entry Date */}
                {Object.entries(docsByDate)
                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                  .map(([date, docs]) => (
                    <div key={`${caseItem.id}-${date}`} className="space-y-3">
                      {/* Date Section Header */}
                      <div className="flex items-center gap-2 px-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <h4 className="text-body-sm font-semibold text-gray-700">
                          Entry Date: {date}
                        </h4>
                        <div className="flex-1 h-px bg-cairos-border"></div>
                        <span className="text-body-xs text-gray-500">{docs.length} document{docs.length !== 1 ? 's' : ''}</span>
                      </div>

                      {/* Document Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {docs.map((doc) => {
                          const Icon = getDocumentIcon(doc.type);
                          const iconColor = getDocumentColor(doc.type);

                          return (
                            <Card
                              key={doc.id}
                              className="p-4 hover:shadow-md transition-all cursor-pointer group"
                              onClick={() => onView?.(doc.id)}
                            >
                              {/* Card Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className={clsx(
                                  "p-2 rounded-xl",
                                  iconColor
                                )}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <DocumentActions
                                  onView={() => onView?.(doc.id)}
                                  onEdit={() => onEdit?.(doc.id)}
                                  onCopy={() => onCopy?.(doc.id)}
                                  onPrint={() => onPrint?.(doc.id)}
                                />
                              </div>

                              {/* Document Title */}
                              <h5 className="text-body font-semibold text-gray-900 mb-2 group-hover:text-cairos-primary transition-colors">
                                <span className="line-clamp-2 block">{doc.title || doc.type}</span>
                              </h5>

                              {/* Document Type Badge */}
                              <div className="mb-3">
                                <Badge variant="default" size="xs">
                                  {doc.type}
                                </Badge>
                              </div>

                              {/* Metadata */}
                              <div className="space-y-1.5 pt-2 border-t border-cairos-border">
                                {doc.timeIn && doc.timeOut && (
                                  <div className="flex items-center gap-2 text-body-sm font-medium text-gray-900 mb-1.5">
                                    <Clock className="w-4 h-4 text-cairos-primary" />
                                    <span>{doc.timeIn} - {doc.timeOut}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-body-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(doc.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-body-xs text-gray-500">
                                  <User className="w-3 h-3" />
                                  <span className="truncate">{doc.owner}</span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
