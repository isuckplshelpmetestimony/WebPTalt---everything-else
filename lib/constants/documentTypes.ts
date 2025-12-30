import { DocumentType } from '../types/document';
import { FileText, ClipboardList, FileCheck, FileX, Receipt, FileSearch } from 'lucide-react';

export interface DocumentTypeConfig {
  type: DocumentType;
  label: string;
  icon: typeof FileText;
  color: string;
}

export const documentTypes: DocumentTypeConfig[] = [
  {
    type: 'PT Daily Note',
    label: 'PT Daily Note',
    icon: FileText,
    color: 'cairos-primary',
  },
  {
    type: 'PT Initial Evaluation',
    label: 'PT Initial Evaluation',
    icon: ClipboardList,
    color: 'cairos-primary',
  },
  {
    type: 'PT Progress Note w/o Billing',
    label: 'PT Progress Note w/o Billing',
    icon: FileCheck,
    color: 'cairos-primary',
  },
  {
    type: 'PT Discharge Note',
    label: 'PT Discharge Note',
    icon: FileX,
    color: 'cairos-alert',
  },
  {
    type: 'PT Progress with Billing',
    label: 'PT Progress with Billing',
    icon: Receipt,
    color: 'cairos-success',
  },
  {
    type: 'WC Medical Report',
    label: 'WC Medical Report',
    icon: FileSearch,
    color: 'cairos-warning',
  },
];



