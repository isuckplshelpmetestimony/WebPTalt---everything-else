export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Insurance {
  id: string;
  name: string;
  policyNumber: string;
  groupNumber: string;
  coverageStartDate?: Date;
  coverageEndDate?: Date;
  secondaryInsurance?: Insurance;
}

export interface Case {
  id: string;
  name: string;
  createdDate: Date;
  visitsRemaining: number;
  expirationDate: Date;
  authorizationStatus: 'active' | 'expiring' | 'expired';
}

export interface Authorization {
  id: string;
  caseId: string;
  visitsAuthorized: number;
  visitsUsed: number;
  expirationDate: Date;
  status: 'active' | 'expiring' | 'expired';
}

export interface Survey {
  id: string;
  type: string;
  completedDate: Date;
  score?: number;
  maxScore?: number;
  result: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: Date;
  gender: string;
  phone: string;
  email: string;
  address: Address;
  cases: Case[];
  insurance: Insurance;
  diagnosis: string;
  diagnosisCode: string;
  patientType: string;
  arrivalRate: number;
  cancels?: number;
  noShows?: number;
  stationNumber?: string;
  authorization?: Authorization;
  surveys?: Survey[];
}

