import { ToothStatus } from '../platform-constants';

export interface ToothData {
  number: number;
  status: ToothStatus;
  findings: string[];
  hasPathology: boolean;
}

// FDI numbering: Q1(18-11), Q2(21-28), Q3(38-31), Q4(41-48)
export const dentalChartData: Record<number, ToothData> = {
  // Upper Right (Q1)
  18: { number: 18, status: 'healthy', findings: [], hasPathology: false },
  17: { number: 17, status: 'filling', findings: ['MOD amalgam'], hasPathology: false },
  16: { number: 16, status: 'caries', findings: ['Mesial caries', 'Sinus proximity'], hasPathology: true },
  15: { number: 15, status: 'caries', findings: ['Distal shadow'], hasPathology: true },
  14: { number: 14, status: 'rootCanal', findings: ['Suspected VRF', 'Post & core'], hasPathology: true },
  13: { number: 13, status: 'healthy', findings: [], hasPathology: false },
  12: { number: 12, status: 'healthy', findings: [], hasPathology: false },
  11: { number: 11, status: 'filling', findings: ['Calcified canal', 'Composite'], hasPathology: true },
  // Upper Left (Q2)
  21: { number: 21, status: 'rootCanal', findings: ['Root resorption', 'Apical lesion'], hasPathology: true },
  22: { number: 22, status: 'healthy', findings: [], hasPathology: false },
  23: { number: 23, status: 'healthy', findings: [], hasPathology: false },
  24: { number: 24, status: 'filling', findings: ['Secondary caries under amalgam'], hasPathology: true },
  25: { number: 25, status: 'healthy', findings: [], hasPathology: false },
  26: { number: 26, status: 'crown', findings: ['Defective restoration', 'Overhang'], hasPathology: true },
  27: { number: 27, status: 'healthy', findings: [], hasPathology: false },
  28: { number: 28, status: 'missing', findings: ['Extracted'], hasPathology: false },
  // Lower Left (Q3)
  38: { number: 38, status: 'healthy', findings: [], hasPathology: false },
  37: { number: 37, status: 'healthy', findings: ['Widened PDL space'], hasPathology: true },
  36: { number: 36, status: 'rootCanal', findings: ['Periapical lesion', 'Previous RCT'], hasPathology: true },
  35: { number: 35, status: 'healthy', findings: [], hasPathology: false },
  34: { number: 34, status: 'healthy', findings: [], hasPathology: false },
  33: { number: 33, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
  32: { number: 32, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
  31: { number: 31, status: 'healthy', findings: ['Mild bone loss', 'Calculus'], hasPathology: true },
  // Lower Right (Q4)
  41: { number: 41, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
  42: { number: 42, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
  43: { number: 43, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
  44: { number: 44, status: 'healthy', findings: [], hasPathology: false },
  45: { number: 45, status: 'filling', findings: ['DO composite'], hasPathology: false },
  46: { number: 46, status: 'crown', findings: ['Furcation involvement', 'PFM crown'], hasPathology: true },
  47: { number: 47, status: 'implant', findings: ['Implant-supported crown'], hasPathology: false },
  48: { number: 48, status: 'healthy', findings: ['Mesioangular impaction'], hasPathology: true },
};
