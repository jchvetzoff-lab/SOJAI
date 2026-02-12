export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: 'diagnostic' | 'treatment_plan' | 'follow_up' | 'surgical_guide';
  status: 'draft' | 'final' | 'sent';
  scanIds: string[];
  findingsCount: number;
}

export const reports: Report[] = [
  { id: 'RPT001', patientId: 'P002', patientName: 'Jean-Pierre Martin', date: '2026-02-09', type: 'diagnostic', status: 'final', scanIds: ['SC001', 'SC002'], findingsCount: 5 },
  { id: 'RPT002', patientId: 'P001', patientName: 'Marie Dupont', date: '2026-02-10', type: 'treatment_plan', status: 'draft', scanIds: ['SC003'], findingsCount: 2 },
  { id: 'RPT003', patientId: 'P006', patientName: 'François Leroy', date: '2026-02-05', type: 'diagnostic', status: 'sent', scanIds: ['SC005'], findingsCount: 11 },
  { id: 'RPT004', patientId: 'P004', patientName: 'Thomas Weber', date: '2026-02-07', type: 'follow_up', status: 'final', scanIds: ['SC004'], findingsCount: 4 },
  { id: 'RPT005', patientId: 'P003', patientName: 'Sophie Bernard', date: '2026-02-08', type: 'diagnostic', status: 'sent', scanIds: ['SC007'], findingsCount: 1 },
];

export interface ReportSection {
  id: string;
  title: string;
  enabled: boolean;
}

export const reportSections: ReportSection[] = [
  { id: 'header', title: 'Clinic Header & Branding', enabled: true },
  { id: 'patient', title: 'Patient Information', enabled: true },
  { id: 'dental_chart', title: 'Dental Chart', enabled: true },
  { id: 'findings', title: 'AI Findings', enabled: true },
  { id: 'images', title: 'Annotated Images', enabled: true },
  { id: 'recommendations', title: 'Recommendations', enabled: true },
  { id: 'treatment_plan', title: 'Treatment Plan', enabled: false },
  { id: 'follow_up', title: 'Follow-up Notes', enabled: false },
];
