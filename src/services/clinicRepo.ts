import type {
  ActivityItem,
  Appointment,
  AppointmentStatus,
  BillingPlaceholder,
  ClinicProfile,
  ClinicSettings,
  TeamMember,
} from '@/features/clinic';
import {
  ACTIVITY_FIXTURES,
  APPOINTMENT_FIXTURES,
  BILLING_PLACEHOLDER_FIXTURE,
  CLINIC_SETTINGS_FIXTURES,
  TEAM_FIXTURES,
} from '@/lib/fixtures';

let appointments: Appointment[] = APPOINTMENT_FIXTURES.map((entry) => ({ ...entry }));
let activityFeed: ActivityItem[] = ACTIVITY_FIXTURES.map((entry) => ({ ...entry }));
let teamMembers: TeamMember[] = TEAM_FIXTURES.map((entry) => ({ ...entry }));
let clinicSettings: ClinicSettings = {
  openingHours: CLINIC_SETTINGS_FIXTURES.openingHours.map((entry) => ({ ...entry })),
  templates: [...CLINIC_SETTINGS_FIXTURES.templates],
  aiPreferences: { ...CLINIC_SETTINGS_FIXTURES.aiPreferences },
};
const billingPlaceholder: BillingPlaceholder = { ...BILLING_PLACEHOLDER_FIXTURE };

const clinicProfile: ClinicProfile = {
  id: 'CLINIC-001',
  name: 'SOJAI Demo Clinic',
  timezone: 'Europe/Paris',
  country: 'FR',
};

function cloneAppointments(items: Appointment[]): Appointment[] {
  return items.map((item) => ({ ...item }));
}

function cloneActivity(items: ActivityItem[]): ActivityItem[] {
  return items.map((item) => ({ ...item }));
}

function cloneTeam(items: TeamMember[]): TeamMember[] {
  return items.map((item) => ({ ...item }));
}

function cloneSettings(settings: ClinicSettings): ClinicSettings {
  return {
    openingHours: settings.openingHours.map((entry) => ({ ...entry })),
    templates: [...settings.templates],
    aiPreferences: { ...settings.aiPreferences },
  };
}

function nextAppointmentId(): string {
  const max = appointments.reduce((acc, appointment) => {
    const numeric = Number(appointment.id.replace(/^APT/, ''));
    return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
  }, 0);
  return `APT${String(max + 1).padStart(3, '0')}`;
}

function nextActivityId(): string {
  const max = activityFeed.reduce((acc, item) => {
    const numeric = Number(item.id.replace(/^ACT/, ''));
    return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
  }, 0);
  return `ACT${String(max + 1).padStart(3, '0')}`;
}

export interface ClinicRepo {
  getProfile(): Promise<ClinicProfile>;
  listAppointments(): Promise<Appointment[]>;
  createAppointment(input: Omit<Appointment, 'id'>): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment | null>;
  listActivity(): Promise<ActivityItem[]>;
  addActivity(item: Omit<ActivityItem, 'id'>): Promise<ActivityItem>;
  listTeam(): Promise<TeamMember[]>;
  getSettings(): Promise<ClinicSettings>;
  getBillingPlaceholder(): Promise<BillingPlaceholder>;
}

export const clinicRepo: ClinicRepo = {
  async getProfile() {
    return { ...clinicProfile };
  },

  async listAppointments() {
    return cloneAppointments(appointments);
  },

  async createAppointment(input) {
    const created: Appointment = { id: nextAppointmentId(), ...input };
    appointments = [created, ...appointments];
    return { ...created };
  },

  async updateAppointmentStatus(id, status) {
    const index = appointments.findIndex((appointment) => appointment.id === id);
    if (index === -1) return null;

    const updated: Appointment = { ...appointments[index], status };
    appointments = [
      ...appointments.slice(0, index),
      updated,
      ...appointments.slice(index + 1),
    ];
    return { ...updated };
  },

  async listActivity() {
    return cloneActivity(activityFeed);
  },

  async addActivity(item) {
    const created: ActivityItem = { id: nextActivityId(), ...item };
    activityFeed = [created, ...activityFeed];
    return { ...created };
  },

  async listTeam() {
    return cloneTeam(teamMembers);
  },

  async getSettings() {
    return cloneSettings(clinicSettings);
  },

  async getBillingPlaceholder() {
    return { ...billingPlaceholder };
  },
};
