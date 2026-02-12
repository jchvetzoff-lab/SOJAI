export interface Scan {
  id: string;
  patientId: string;
  type: 'panoramic' | 'cbct' | 'periapical' | 'bitewing' | 'cephalometric';
  date: string;
  status: 'analyzed' | 'pending' | 'reviewing';
  findingsCount: number;
  analysisTime: number; // seconds
  resolution: string;
}

export const scans: Scan[] = [
  { id: 'SC001', patientId: 'P002', type: 'panoramic', date: '2026-02-09', status: 'analyzed', findingsCount: 5, analysisTime: 10, resolution: '2400x1200' },
  { id: 'SC002', patientId: 'P002', type: 'cbct', date: '2026-02-09', status: 'analyzed', findingsCount: 8, analysisTime: 45, resolution: '512x512x400' },
  { id: 'SC003', patientId: 'P001', type: 'periapical', date: '2026-02-10', status: 'analyzed', findingsCount: 2, analysisTime: 5, resolution: '1800x2400' },
  { id: 'SC004', patientId: 'P004', type: 'panoramic', date: '2026-02-07', status: 'reviewing', findingsCount: 4, analysisTime: 12, resolution: '2400x1200' },
  { id: 'SC005', patientId: 'P006', type: 'cbct', date: '2026-02-05', status: 'analyzed', findingsCount: 11, analysisTime: 52, resolution: '512x512x400' },
  { id: 'SC006', patientId: 'P008', type: 'bitewing', date: '2026-02-03', status: 'pending', findingsCount: 0, analysisTime: 0, resolution: '1200x800' },
  { id: 'SC007', patientId: 'P003', type: 'periapical', date: '2026-02-08', status: 'analyzed', findingsCount: 1, analysisTime: 4, resolution: '1800x2400' },
  { id: 'SC008', patientId: 'P009', type: 'cephalometric', date: '2026-02-02', status: 'analyzed', findingsCount: 0, analysisTime: 8, resolution: '2400x3000' },
];

export const activeScan = scans[0]; // Panoramic of P002
