'use client';

import React from 'react';
import { Document } from '@/lib/types/document';
import { Button } from '../ui/Button';
import { Edit, Copy, Printer, FilePlus } from 'lucide-react';

interface DocumentViewActionsProps {
  document: Document;
  onEdit?: () => void;
  onCopy?: () => void;
  onPrint?: () => void;
  onAddendum?: () => void;
}

export const DocumentViewActions: React.FC<DocumentViewActionsProps> = ({
  document,
  onEdit,
  onCopy,
  onPrint,
  onAddendum,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {onEdit && !document.locked && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-1.5"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      )}
      
      {onCopy && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onCopy}
          className="flex items-center gap-1.5"
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
      )}
      
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePrint}
        className="flex items-center gap-1.5"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
      
      {onAddendum && document.locked && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAddendum}
          className="flex items-center gap-1.5"
        >
          <FilePlus className="w-4 h-4" />
          Add Addendum
        </Button>
      )}
    </div>
  );
};

