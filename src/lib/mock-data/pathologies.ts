import { PathologyCategory, SeverityLevel } from '../platform-constants';

export interface Pathology {
  id: string;
  name: string;
  category: PathologyCategory;
  severity: SeverityLevel;
  confidence: number;
  affectedTeeth: number[];
  description: string;
}

export const pathologies: Pathology[] = [
  { id: 'PAT001', name: 'Periapical Lesion', category: 'endodontic', severity: 'critical', confidence: 96, affectedTeeth: [36], description: 'Radiolucency at apex of tooth 36, suggestive of periapical abscess. Diameter ~4mm.' },
  { id: 'PAT002', name: 'Proximal Caries', category: 'restorative', severity: 'high', confidence: 94, affectedTeeth: [15, 16], description: 'Mesial caries on tooth 16 extending to dentin. Distal shadow on tooth 15.' },
  { id: 'PAT003', name: 'Horizontal Bone Loss', category: 'periodontal', severity: 'medium', confidence: 91, affectedTeeth: [31, 32, 33, 41, 42, 43], description: 'Generalized horizontal bone loss in anterior mandibular region, approximately 30% attachment loss.' },
  { id: 'PAT004', name: 'Impacted Third Molar', category: 'anatomical', severity: 'medium', confidence: 99, affectedTeeth: [48], description: 'Mesioangular impaction of tooth 48 with partial bony coverage. Close proximity to IAN canal.' },
  { id: 'PAT005', name: 'Defective Restoration', category: 'restorative', severity: 'low', confidence: 88, affectedTeeth: [26], description: 'Overhanging restoration on distal of tooth 26. Open margin visible on radiograph.' },
  { id: 'PAT006', name: 'Furcation Involvement', category: 'periodontal', severity: 'high', confidence: 87, affectedTeeth: [46], description: 'Grade II furcation involvement on tooth 46. Radiolucency in furcation area.' },
  { id: 'PAT007', name: 'Root Resorption', category: 'endodontic', severity: 'high', confidence: 82, affectedTeeth: [21], description: 'External apical root resorption on tooth 21, approximately 2mm shortening.' },
  { id: 'PAT008', name: 'Calcified Canal', category: 'endodontic', severity: 'low', confidence: 79, affectedTeeth: [11], description: 'Partial canal obliteration in tooth 11. Reduced pulp chamber visible.' },
  { id: 'PAT009', name: 'Vertical Root Fracture', category: 'endodontic', severity: 'critical', confidence: 73, affectedTeeth: [14], description: 'Suspected vertical root fracture on tooth 14. J-shaped radiolucency along root.' },
  { id: 'PAT010', name: 'Widened PDL Space', category: 'periodontal', severity: 'medium', confidence: 85, affectedTeeth: [37], description: 'Widened periodontal ligament space around tooth 37, possible occlusal trauma.' },
  { id: 'PAT011', name: 'Secondary Caries', category: 'restorative', severity: 'high', confidence: 92, affectedTeeth: [24], description: 'Recurrent caries beneath existing amalgam restoration on tooth 24.' },
  { id: 'PAT012', name: 'Maxillary Sinus Thickening', category: 'anatomical', severity: 'low', confidence: 95, affectedTeeth: [16, 17], description: 'Mucosal thickening in left maxillary sinus floor, likely odontogenic origin.' },
];

// Category summary for filters
export const pathologyCategorySummary = Object.entries(
  pathologies.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {})
);
