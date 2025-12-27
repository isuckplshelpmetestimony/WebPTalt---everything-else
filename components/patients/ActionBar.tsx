'use client';

import React from 'react';
import { 
  FileText, 
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ActionBarProps {
  onNewDocument?: () => void;
  onNewCase?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onNewDocument,
  onNewCase,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-cairos-border pb-2 mb-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={onNewDocument}
        className="flex items-center gap-1.5"
      >
        <FileText className="w-4 h-4" />
        New Document
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={onNewCase}
        className="flex items-center gap-1.5"
      >
        <Briefcase className="w-4 h-4" />
        New Case
      </Button>
    </div>
  );
};
