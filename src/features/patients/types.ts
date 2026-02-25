export type PatientGender = 'M' | 'F';
export type PatientStatus = 'active' | 'pending' | 'completed';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: PatientGender;
  lastVisit: string;
  nextAppointment: string | null;
  scanCount: number;
  pathologyCount: number;
  status: PatientStatus;
  avatar: string;
}

export interface PatientCreateInput {
  name: string;
  age: number;
  gender: PatientGender;
}

export interface PatientUpdateInput {
  name?: string;
  age?: number;
  gender?: PatientGender;
  nextAppointment?: string | null;
  status?: PatientStatus;
  scanCount?: number;
  pathologyCount?: number;
}

export type TimelineEventType = 'appointment' | 'analysis' | 'note' | 'export';

export interface PatientTimelineEvent {
  id: string;
  type: TimelineEventType;
  at: string;
  title: string;
  detail: string;
}

export interface PatientScanImage {
  id: string;
  capturedAt: string;
  modality: 'panoramic' | 'cbct' | 'periapical' | 'bitewing' | 'cephalometric';
  status: 'analyzed' | 'pending' | 'reviewed';
  thumbnailLabel: string;
}

export interface PatientNote {
  id: string;
  createdAt: string;
  author: string;
  text: string;
}

export interface PatientDocument {
  id: string;
  name: string;
  createdAt: string;
  kind: 'report' | 'prescription' | 'consent';
}

export interface PatientAIInsights {
  summary: string;
  findings: string[];
  recommendations: string[];
}
