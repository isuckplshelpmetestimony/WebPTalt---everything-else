'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { Card } from '../ui/Card';
import { Image as ImageIcon } from 'lucide-react';

interface ImageNoteViewProps {
  document: Document;
}

export const ImageNoteView: React.FC<ImageNoteViewProps> = ({ document }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <ImageIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-h3 text-gray-900">Image Note</h3>
      </div>

      {document.imageUrl ? (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-cairos-border">
            <img
              src={document.imageUrl}
              alt={document.title || 'Document image'}
              className="w-full h-auto"
            />
          </div>
          {document.content?.subjective && (
            <div className="pt-4 border-t border-cairos-border">
              <h4 className="text-body-sm font-semibold text-gray-700 mb-2">Notes</h4>
              <p className="text-body text-gray-700 whitespace-pre-wrap">
                {document.content.subjective}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-body text-gray-600">No image available</p>
        </div>
      )}
    </Card>
  );
};

