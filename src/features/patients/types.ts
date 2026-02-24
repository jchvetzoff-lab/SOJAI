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
