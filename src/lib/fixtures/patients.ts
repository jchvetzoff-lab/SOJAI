import type { Patient } from '@/features/patients';

export const PATIENT_FIXTURES: Patient[] = [
  { id: 'P001', name: 'Marie Dupont', age: 45, gender: 'F', lastVisit: '2026-02-10', nextAppointment: '2026-03-03', scanCount: 8, pathologyCount: 3, status: 'active', avatar: 'MD' },
  { id: 'P002', name: 'Jean-Pierre Martin', age: 62, gender: 'M', lastVisit: '2026-02-09', nextAppointment: '2026-03-06', scanCount: 12, pathologyCount: 5, status: 'active', avatar: 'JM' },
  { id: 'P003', name: 'Sophie Bernard', age: 34, gender: 'F', lastVisit: '2026-02-08', nextAppointment: null, scanCount: 3, pathologyCount: 1, status: 'completed', avatar: 'SB' },
  { id: 'P004', name: 'Thomas Weber', age: 51, gender: 'M', lastVisit: '2026-02-07', nextAppointment: '2026-03-05', scanCount: 6, pathologyCount: 4, status: 'active', avatar: 'TW' },
  { id: 'P005', name: 'Elena Rossi', age: 28, gender: 'F', lastVisit: '2026-02-06', nextAppointment: '2026-03-11', scanCount: 2, pathologyCount: 0, status: 'pending', avatar: 'ER' },
];
