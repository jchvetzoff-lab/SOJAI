import type { BillingPlaceholder, ClinicSettings, TeamMember } from '@/features/clinic';

export const TEAM_FIXTURES: TeamMember[] = [
  { id: 'TM001', name: 'Dr. Laurent', role: 'practitioner', rbacRole: 'CLINIC_ADMIN', active: true },
  { id: 'TM002', name: 'Dr. Weber', role: 'practitioner', rbacRole: 'PRACTITIONER', active: true },
  { id: 'TM003', name: 'Emma Bernard', role: 'assistant', rbacRole: 'ASSISTANT', active: true },
  { id: 'TM004', name: 'Nina Rossi', role: 'assistant', rbacRole: 'ASSISTANT', active: false },
];

export const CLINIC_SETTINGS_FIXTURES: ClinicSettings = {
  openingHours: [
    { day: 'Mon', open: '08:30', close: '18:00' },
    { day: 'Tue', open: '08:30', close: '18:00' },
    { day: 'Wed', open: '08:30', close: '18:00' },
    { day: 'Thu', open: '08:30', close: '18:00' },
    { day: 'Fri', open: '08:30', close: '17:00' },
    { day: 'Sat', open: '09:00', close: '12:30' },
    { day: 'Sun', open: '00:00', close: '00:00', closed: true },
  ],
  templates: [
    'Default Diagnostic Report',
    'Implant Planning Summary',
    'Periodontal Follow-up',
  ],
  aiPreferences: {
    autoAnalyzeOnUpload: true,
    defaultProvider: 'mock',
    confidenceThreshold: 82,
  },
};

export const BILLING_PLACEHOLDER_FIXTURE: BillingPlaceholder = {
  plan: 'Demo Team Plan',
  renewalDate: '2026-03-31',
  seatsUsed: 3,
  seatsTotal: 5,
  note: 'Billing tab placeholder only. No payment workflow enabled in demo mode.',
};
