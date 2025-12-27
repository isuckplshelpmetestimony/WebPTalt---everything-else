'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { DocumentCard } from './DocumentCard';
import { formatDate } from '@/lib/utils/date';
import { Tabs } from '../ui/Tabs';

interface DocumentListProps {
  documents: Document[];
  activeTab: 'all' | 'organizers' | 'full-chart' | 'locked';
  onTabChange: (tab: 'all' | 'organizers' | 'full-chart' | 'locked') => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCopy?: (id: string) => void;
  onPrint?: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  activeTab,
  onTabChange,
  onView,
  onEdit,
  onCopy,
  onPrint,
}) => {
  // Group documents by date
  const groupedDocuments = documents.reduce((acc, doc) => {
    const dateKey = formatDate(doc.entryDate);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);
  
  // Filter documents based on active tab
  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === 'locked') return doc.locked;
    if (activeTab === 'organizers') return !doc.locked; // Simplified logic
    if (activeTab === 'full-chart') return true;
    return true;
  });
  
  const filteredGrouped = filteredDocuments.reduce((acc, doc) => {
    const dateKey = formatDate(doc.entryDate);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);
  
  const tabs = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'organizers', label: 'Organizers', count: documents.filter((d) => !d.locked).length },
    { id: 'full-chart', label: 'Full Chart', count: documents.length },
    { id: 'locked', label: 'Locked', count: documents.filter((d) => d.locked).length },
  ];
  
  return (
    <div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) =>
          onTabChange(tabId as 'all' | 'organizers' | 'full-chart' | 'locked')
        }
      />
      
      <div className="mt-4 space-y-4">
        {Object.entries(filteredGrouped)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, docs]) => (
            <div key={date}>
              <h3 className="text-h3 mb-2 text-gray-700">{date}</h3>
              <div className="grid grid-cols-1 gap-2">
                {docs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onView={onView}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    onPrint={onPrint}
                  />
                ))}
              </div>
            </div>
          ))}
        {Object.keys(filteredGrouped).length === 0 && (
          <div className="text-center py-12 text-body text-gray-600">
            No documents found
          </div>
        )}
      </div>
    </div>
  );
};

