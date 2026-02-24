export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  practitioner: string;
  startsAt: string;
  status: AppointmentStatus;
  reason: string;
}

export type ActivityType = 'analysis' | 'upload' | 'report' | 'alert' | 'schedule' | 'patient';

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: ActivityType;
}

export interface ClinicProfile {
  id: string;
  name: string;
  timezone: string;
  country: string;
}
