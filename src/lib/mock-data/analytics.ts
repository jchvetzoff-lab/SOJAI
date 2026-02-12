export interface MonthlyScans {
  month: string;
  panoramic: number;
  cbct: number;
  periapical: number;
  bitewing: number;
}

export const monthlyScans: MonthlyScans[] = [
  { month: 'Sep', panoramic: 145, cbct: 82, periapical: 198, bitewing: 67 },
  { month: 'Oct', panoramic: 162, cbct: 95, periapical: 215, bitewing: 73 },
  { month: 'Nov', panoramic: 158, cbct: 101, periapical: 203, bitewing: 69 },
  { month: 'Dec', panoramic: 134, cbct: 78, periapical: 176, bitewing: 58 },
  { month: 'Jan', panoramic: 178, cbct: 112, periapical: 234, bitewing: 81 },
  { month: 'Feb', panoramic: 89, cbct: 56, periapical: 118, bitewing: 42 },
];

export interface PathologyDistribution {
  name: string;
  value: number;
  color: string;
}

export const pathologyDistribution: PathologyDistribution[] = [
  { name: 'Caries', value: 4235, color: '#FF3254' },
  { name: 'Periodontal', value: 2890, color: '#F59E0B' },
  { name: 'Endodontic', value: 1945, color: '#4A39C0' },
  { name: 'Anatomical', value: 1678, color: '#10B981' },
  { name: 'Restorative', value: 1234, color: '#6366F1' },
  { name: 'Other', value: 412, color: '#9CA3AF' },
];

export interface WeeklyTrend {
  day: string;
  scans: number;
  findings: number;
}

export const weeklyTrend: WeeklyTrend[] = [
  { day: 'Mon', scans: 42, findings: 128 },
  { day: 'Tue', scans: 38, findings: 115 },
  { day: 'Wed', scans: 51, findings: 156 },
  { day: 'Thu', scans: 45, findings: 138 },
  { day: 'Fri', scans: 36, findings: 102 },
  { day: 'Sat', scans: 18, findings: 52 },
  { day: 'Sun', scans: 5, findings: 14 },
];

export interface PractitionerPerformance {
  name: string;
  scansReviewed: number;
  avgReviewTime: string;
  accuracy: number;
}

export const practitionerPerformance: PractitionerPerformance[] = [
  { name: 'Dr. Laurent', scansReviewed: 342, avgReviewTime: '2m 15s', accuracy: 98.2 },
  { name: 'Dr. Weber', scansReviewed: 298, avgReviewTime: '3m 02s', accuracy: 97.5 },
  { name: 'Dr. Rossi', scansReviewed: 267, avgReviewTime: '2m 45s', accuracy: 98.8 },
  { name: 'Dr. Moreau', scansReviewed: 189, avgReviewTime: '3m 30s', accuracy: 96.1 },
  { name: 'Dr. Schmidt', scansReviewed: 156, avgReviewTime: '2m 58s', accuracy: 97.9 },
];
