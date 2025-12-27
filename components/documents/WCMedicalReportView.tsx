'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { Card } from '../ui/Card';
import { FileText, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface WCMedicalReportViewProps {
  document: Document;
}

export const WCMedicalReportView: React.FC<WCMedicalReportViewProps> = ({ document }) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 border-2 border-cairos-warning">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-cairos-warning bg-opacity-10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-cairos-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-h3 text-gray-900">Workers' Compensation Medical Report</h3>
            <Badge variant="warning" size="sm" className="mt-1">
              WORKERS COMP
            </Badge>
          </div>
        </div>

        {document.content?.subjective ? (
          <div className="pt-4 border-t border-cairos-border">
            <div className="text-body text-gray-700 whitespace-pre-wrap">
              {document.content.subjective}
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-cairos-border">
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-body text-gray-600">No report content available</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

