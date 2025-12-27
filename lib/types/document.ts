export type DocumentType = 
  | 'PT Daily Note'
  | 'PT Initial Evaluation'
  | 'PT Progress Note w/o Billing'
  | 'PT Discharge Note'
  | 'PT Progress with Billing'
  | 'WC Medical Report'
  | 'Image Note'
  | 'Document Organizer'
  | 'Report'
  | 'Data';

export interface BillingCode {
  code: string; // 97110, 97112, 97130, etc.
  description: string;
  units: number;
  time: number; // minutes
}

export interface Addendum {
  id: string;
  content: string;
  addedBy: string;
  addedAt: Date;
}

export interface Document {
  id: string;
  type: DocumentType;
  entryDate: Date;
  caseId: string;
  caseName?: string;
  title?: string; // Document title/name
  timeIn?: string;
  timeOut?: string;
  renderingProvider: string;
  coSigningProvider?: string;
  owner: string;
  locked: boolean;
  createdAt: Date;
  status?: 'draft' | 'completed' | 'locked';
  // SOAP note content
  content?: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
  };
  // Billing information
  billing?: {
    codes: BillingCode[];
    totalUnits: number;
    totalTime: number; // total minutes
  };
  // Addendums for locked documents
  addendums?: Addendum[];
  // For Image Notes
  imageUrl?: string;
  // For Document Organizer - related document IDs
  relatedDocumentIds?: string[];
}

