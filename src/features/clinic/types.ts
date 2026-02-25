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

export type TeamRole = 'practitioner' | 'assistant' | 'admin';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  rbacRole: string;
  active: boolean;
}

export interface OpeningHoursEntry {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  open: string;
  close: string;
  closed?: boolean;
}

export interface ClinicSettings {
  openingHours: OpeningHoursEntry[];
  templates: string[];
  aiPreferences: {
    autoAnalyzeOnUpload: boolean;
    defaultProvider: 'mock' | 'anthropic';
    confidenceThreshold: number;
  };
}

export interface BillingPlaceholder {
  plan: string;
  renewalDate: string;
  seatsUsed: number;
  seatsTotal: number;
  note: string;
}
