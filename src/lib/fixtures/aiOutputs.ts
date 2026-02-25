import type { AnalysisResult } from '@/hooks/usePlatformStore';

const FIXTURE_ANALYZED_AT = '2026-02-24T10:00:00.000Z';

export function buildMockAnalysisResult(imageType: string, patientName: string): AnalysisResult {
  return {
    summary: `Mock analysis complete for ${patientName}. Findings indicate endodontic and periodontal attention areas.`,
    pathologies: [
      {
        id: 'PAT-MOCK-001',
        name: 'Periapical Lesion',
        category: 'endodontic',
        severity: 'high',
        confidence: 94,
        affectedTeeth: [36],
        description: 'Radiolucent area around apex of tooth 36, suggestive of chronic apical periodontitis.',
        boundingBox: { x: 34, y: 63, width: 10, height: 12 },
      },
      {
        id: 'PAT-MOCK-002',
        name: 'Horizontal Bone Loss',
        category: 'periodontal',
        severity: 'medium',
        confidence: 89,
        affectedTeeth: [31, 32, 41, 42],
        description: 'Generalized horizontal bone loss in mandibular anterior region.',
        boundingBox: { x: 44, y: 72, width: 18, height: 10 },
      },
      {
        id: 'PAT-MOCK-003',
        name: 'Secondary Caries',
        category: 'restorative',
        severity: 'medium',
        confidence: 87,
        affectedTeeth: [24],
        description: 'Recurrent proximal carious lesion under existing restoration.',
        boundingBox: { x: 48, y: 30, width: 9, height: 9 },
      },
    ],
    dentalChart: {
      24: { number: 24, status: 'filling', findings: ['Secondary caries'], hasPathology: true },
      31: { number: 31, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
      32: { number: 32, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
      36: { number: 36, status: 'rootCanal', findings: ['Periapical lesion'], hasPathology: true },
      41: { number: 41, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
      42: { number: 42, status: 'healthy', findings: ['Mild bone loss'], hasPathology: true },
    },
    periodontalData: {
      31: { pocketDepths: [4, 3, 4, 3, 3, 4], boneLoss: 2 },
      32: { pocketDepths: [4, 3, 4, 3, 3, 4], boneLoss: 2 },
      36: { pocketDepths: [6, 5, 6, 5, 5, 6], boneLoss: 5 },
      41: { pocketDepths: [4, 3, 4, 3, 3, 4], boneLoss: 2 },
      42: { pocketDepths: [4, 3, 4, 3, 3, 4], boneLoss: 2 },
    },
    recommendations: [
      'Schedule endodontic re-evaluation for tooth 36.',
      'Initiate periodontal maintenance and reassessment in 8 weeks.',
      'Restore recurrent caries on tooth 24.',
    ],
    measurements: {
      cephalometric: imageType === 'cephalometric'
        ? [{ name: 'SNA Angle', value: 82.1, unit: 'degrees', normalRange: '80-84', status: 'normal' }]
        : [],
    },
    analyzedAt: FIXTURE_ANALYZED_AT,
    imageType,
    analysisTimeMs: 1200,
  };
}

export const MOCK_CHAT_RESPONSES = {
  greeting: 'Jarvis mock online. I can summarize findings, suggest follow-up steps, and draft patient-facing explanations.',
  fallback: 'Mock response: I do not have external context in demo mode, but I can help with the current case details.',
} as const;
