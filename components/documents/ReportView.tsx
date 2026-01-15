'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { Card } from '../ui/Card';
import { FileText } from 'lucide-react';

interface ReportViewProps {
  document: Document;
}

export const ReportView: React.FC<ReportViewProps> = ({ document }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-50 rounded-lg">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-h3 text-gray-900">Report</h3>
      </div>

      {document.content?.subjective ? (
        <div className="prose max-w-none">
          <div className="text-body text-gray-700 whitespace-pre-wrap">
            {document.content.subjective}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-body text-gray-600">No report content available</p>
        </div>
      )}
    </Card>
  );
};





