export interface Vitals {
  id: string;
  patientId: string;
  date: Date;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
}

export interface Assessment {
  id: string;
  documentId: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

