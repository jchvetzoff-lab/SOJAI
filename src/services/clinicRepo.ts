import type { ActivityItem, Appointment, AppointmentStatus, ClinicProfile } from '@/features/clinic';
import { ACTIVITY_FIXTURES, APPOINTMENT_FIXTURES } from '@/lib/fixtures';

let appointments: Appointment[] = APPOINTMENT_FIXTURES.map((entry) => ({ ...entry }));
let activityFeed: ActivityItem[] = ACTIVITY_FIXTURES.map((entry) => ({ ...entry }));

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
};
