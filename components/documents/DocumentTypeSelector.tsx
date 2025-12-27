'use client';

import React from 'react';
import { DocumentType } from '@/lib/types/document';
import { documentTypes } from '@/lib/constants/documentTypes';
import { clsx } from 'clsx';

interface DocumentTypeSelectorProps {
  selectedType?: DocumentType;
  onSelect: (type: DocumentType) => void;
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {documentTypes.map((docType) => {
        const Icon = docType.icon;
        const isSelected = selectedType === docType.type;
        
        return (
          <button
            key={docType.type}
            type="button"
            onClick={() => onSelect(docType.type)}
            className={clsx(
              'p-3 rounded-md border-2 transition-all text-left',
              'hover:shadow-sm hover:scale-[1.01]',
              isSelected
                ? 'border-cairos-primary bg-cairos-primary bg-opacity-5'
                : 'border-cairos-border bg-white'
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'p-1.5 rounded-md',
                  isSelected ? 'bg-cairos-primary' : 'bg-gray-100'
                )}
              >
                <Icon
                  className={clsx(
                    'w-4 h-4',
                    isSelected ? 'text-white' : 'text-gray-600'
                  )}
                />
              </div>
              <div>
                <div
                  className={clsx(
                    'text-body font-medium',
                    isSelected ? 'text-cairos-primary' : 'text-gray-900'
                  )}
                >
                  {docType.label}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

