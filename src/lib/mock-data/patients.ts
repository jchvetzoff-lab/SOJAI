export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  lastVisit: string;
  nextAppointment: string | null;
  scanCount: number;
  pathologyCount: number;
  status: 'active' | 'pending' | 'completed';
  avatar: string;
}

export const patients: Patient[] = [
  { id: 'P001', name: 'Marie Dupont', age: 45, gender: 'F', lastVisit: '2026-02-10', nextAppointment: '2026-02-20', scanCount: 8, pathologyCount: 3, status: 'active', avatar: 'MD' },
  { id: 'P002', name: 'Jean-Pierre Martin', age: 62, gender: 'M', lastVisit: '2026-02-09', nextAppointment: '2026-02-15', scanCount: 12, pathologyCount: 5, status: 'active', avatar: 'JM' },
  { id: 'P003', name: 'Sophie Bernard', age: 34, gender: 'F', lastVisit: '2026-02-08', nextAppointment: null, scanCount: 3, pathologyCount: 1, status: 'completed', avatar: 'SB' },
  { id: 'P004', name: 'Thomas Weber', age: 51, gender: 'M', lastVisit: '2026-02-07', nextAppointment: '2026-02-18', scanCount: 6, pathologyCount: 4, status: 'active', avatar: 'TW' },
  { id: 'P005', name: 'Elena Rossi', age: 28, gender: 'F', lastVisit: '2026-02-06', nextAppointment: '2026-03-01', scanCount: 2, pathologyCount: 0, status: 'pending', avatar: 'ER' },
  { id: 'P006', name: 'François Leroy', age: 73, gender: 'M', lastVisit: '2026-02-05', nextAppointment: '2026-02-14', scanCount: 15, pathologyCount: 8, status: 'active', avatar: 'FL' },
  { id: 'P007', name: 'Isabelle Moreau', age: 39, gender: 'F', lastVisit: '2026-02-04', nextAppointment: null, scanCount: 4, pathologyCount: 2, status: 'completed', avatar: 'IM' },
  { id: 'P008', name: 'Klaus Schmidt', age: 56, gender: 'M', lastVisit: '2026-02-03', nextAppointment: '2026-02-22', scanCount: 9, pathologyCount: 6, status: 'active', avatar: 'KS' },
  { id: 'P009', name: 'Laura Fontaine', age: 41, gender: 'F', lastVisit: '2026-02-02', nextAppointment: '2026-02-25', scanCount: 5, pathologyCount: 2, status: 'pending', avatar: 'LF' },
  { id: 'P010', name: 'Marco Bianchi', age: 67, gender: 'M', lastVisit: '2026-02-01', nextAppointment: null, scanCount: 11, pathologyCount: 7, status: 'completed', avatar: 'MB' },
  { id: 'P011', name: 'Nathalie Petit', age: 32, gender: 'F', lastVisit: '2026-01-30', nextAppointment: '2026-02-28', scanCount: 2, pathologyCount: 1, status: 'active', avatar: 'NP' },
  { id: 'P012', name: 'Pierre Durand', age: 48, gender: 'M', lastVisit: '2026-01-28', nextAppointment: '2026-02-16', scanCount: 7, pathologyCount: 3, status: 'active', avatar: 'PD' },
];

export const selectedPatient = patients[1]; // Jean-Pierre Martin - used as default in viewer
