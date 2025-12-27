export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  provider: string;
  startTime: Date;
  endTime: Date;
  type: 'Initial' | 'Follow-up' | 'Evaluation';
  status: 'confirmed' | 'pending' | 'checked-in' | 'no-show' | 'canceled';
  duration: number; // minutes
  notes?: string;
}

export interface Provider {
  id: string;
  name: string;
  role: 'therapist' | 'aide' | 'waiting';
  status: 'available' | 'busy' | 'off';
  color?: string; // For visual distinction
}

export interface Resource {
  id: string;
  name: string;
  type: 'provider' | 'room' | 'equipment';
}

export interface WaitListEntry {
  id: string;
  patientId: string;
  patientName: string;
  preferredDate?: Date;
  preferredTime?: string;
  notes?: string;
  createdAt: Date;
}

