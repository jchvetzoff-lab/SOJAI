import type { Appointment } from '@/features/clinic';

export const APPOINTMENT_FIXTURES: Appointment[] = [
  { id: 'APT001', patientId: 'P001', practitioner: 'Dr. Laurent', startsAt: '2026-03-03T09:00:00.000Z', status: 'scheduled', reason: 'Follow-up scan review' },
  { id: 'APT002', patientId: 'P002', practitioner: 'Dr. Weber', startsAt: '2026-03-06T11:30:00.000Z', status: 'scheduled', reason: 'Endodontic treatment planning' },
  { id: 'APT003', patientId: 'P003', practitioner: 'Dr. Rossi', startsAt: '2026-02-08T14:00:00.000Z', status: 'completed', reason: 'Post-op control' },
  { id: 'APT004', patientId: 'P004', practitioner: 'Dr. Laurent', startsAt: '2026-03-05T10:15:00.000Z', status: 'scheduled', reason: 'Implant suitability review' },
];
