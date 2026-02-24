import type { ActivityItem } from '@/features/clinic';

export const ACTIVITY_FIXTURES: ActivityItem[] = [
  { id: 'ACT001', text: 'AI analysis completed for Jean-Pierre Martin', time: '2 min ago', type: 'analysis' },
  { id: 'ACT002', text: 'New scan uploaded for Marie Dupont', time: '15 min ago', type: 'upload' },
  { id: 'ACT003', text: 'Report sent to Thomas Weber', time: '1 hour ago', type: 'report' },
  { id: 'ACT004', text: 'Critical finding: Periapical lesion on tooth 36', time: '2 hours ago', type: 'alert' },
  { id: 'ACT005', text: 'Appointment scheduled for Elena Rossi', time: '3 hours ago', type: 'schedule' },
];
