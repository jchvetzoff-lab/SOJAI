import { z } from 'zod';
import { patientsRepo } from '@/services/patientsRepo';
import { withToolSimulation } from '@/features/ai/tools/simulator';
import type { AIToolDefinition } from '@/features/ai/tools/types';

const autoSummarySchema = z.object({
  patientId: z.string().min(1),
  focus: z.string().max(120).optional(),
});

const orthoDraftSchema = z.object({
  patientId: z.string().min(1),
  objective: z.string().min(4),
  includeRiskNotes: z.boolean().default(true),
});

const segmentationSchema = z.object({
  scanId: z.string().min(1),
  target: z.enum(['teeth', 'mandible', 'maxilla', 'nerve']),
  priority: z.enum(['normal', 'high']).default('normal'),
});

const reportSchema = z.object({
  patientId: z.string().min(1),
  template: z.enum(['default', 'implant', 'periodontal']).default('default'),
});

const assistantSchema = z.object({
  format: z.enum(['email', 'call_script', 'sms']),
  objective: z.string().min(5),
  tone: z.enum(['neutral', 'friendly', 'formal']).default('friendly'),
});

const autoSummaryTool: AIToolDefinition<typeof autoSummarySchema> = {
  id: 'auto-summary-patient',
  name: 'Auto-summary patient',
  description: 'Generate a concise patient-level summary from mock dossier data.',
  inputSchema: autoSummarySchema,
  run: async (input) => withToolSimulation(async () => {
    const patient = await patientsRepo.getById(input.patientId);
    const insights = await patientsRepo.getAIInsights(input.patientId);

    if (!patient || !insights) {
      return {
        status: 'success',
        headline: 'No dossier available',
        body: `No mock dossier found for patient ${input.patientId}.`,
      };
    }

    const focusPart = input.focus ? ` Focus: ${input.focus}.` : '';

    return {
      status: 'success',
      headline: `Patient summary ready (${patient.id})`,
      body: `${patient.name} (${patient.age}y) currently has ${patient.pathologyCount} finding(s).${focusPart}`,
      data: {
        summary: insights.summary,
        topFinding: insights.findings[0] ?? 'No finding',
      },
    };
  }),
};

const orthoDraftTool: AIToolDefinition<typeof orthoDraftSchema> = {
  id: 'ortho-treatment-draft',
  name: 'Plan de traitement (ortho) draft',
  description: 'Produce a draft ortho treatment plan in demo mode.',
  inputSchema: orthoDraftSchema,
  run: async (input) => withToolSimulation(async () => {
    const patient = await patientsRepo.getById(input.patientId);
    const patientLabel = patient ? `${patient.name} (${patient.id})` : input.patientId;

    return {
      status: 'success',
      headline: `Ortho plan draft generated for ${patientLabel}`,
      body: `Objective: ${input.objective}. Draft includes diagnostics, appliance suggestion, and follow-up cadence.`,
      data: {
        phase1: 'Alignment and leveling (8 weeks)',
        phase2: 'Space management (10 weeks)',
        includeRiskNotes: input.includeRiskNotes,
      },
    };
  }),
};

const segmentationTool: AIToolDefinition<typeof segmentationSchema> = {
  id: 'cbct-segmentation-placeholder',
  name: 'CBCT segmentation (placeholder)',
  description: 'Queue a mock segmentation job and return queued status.',
  inputSchema: segmentationSchema,
  run: async (input, context) => withToolSimulation(async () => {
    const jobId = `SEG-${Date.now()}`;
    return {
      status: 'queued',
      headline: 'Segmentation job queued (demo)',
      body: `Queued ${input.target} segmentation for scan ${input.scanId} with ${input.priority} priority.`,
      data: {
        jobId,
        queuedAt: context.runAtIso,
      },
    };
  }),
};

const reportTool: AIToolDefinition<typeof reportSchema> = {
  id: 'generate-report-pdf-demo',
  name: 'Génération rapport PDF (demo)',
  description: 'Generate a demo PDF report artifact for a patient.',
  inputSchema: reportSchema,
  run: async (input) => withToolSimulation(async () => {
    const generated = await patientsRepo.generateReport(input.patientId);

    if (!generated) {
      return {
        status: 'success',
        headline: 'Report generation skipped',
        body: `Patient ${input.patientId} was not found.`,
      };
    }

    return {
      status: 'success',
      headline: 'Demo PDF generated',
      body: `Generated ${generated.name} using template ${input.template}.`,
      data: {
        documentId: generated.id,
        createdAt: generated.createdAt,
      },
    };
  }),
};

const assistantTool: AIToolDefinition<typeof assistantSchema> = {
  id: 'assistant-cabinet-demo',
  name: 'Assistant cabinet (emails, scripts) (demo)',
  description: 'Draft short communication assets for front-office workflows.',
  inputSchema: assistantSchema,
  run: async (input) => withToolSimulation(async () => {
    const generatedText = input.format === 'email'
      ? `Subject: Follow-up from SOJAI Clinic\n\nHello,\nWe are reaching out regarding: ${input.objective}.\nRegards.`
      : input.format === 'call_script'
      ? `Hello, this is the clinic team. We are calling about ${input.objective}.`
      : `SOJAI clinic update: ${input.objective}`;

    return {
      status: 'success',
      headline: 'Assistant draft generated',
      body: `Created ${input.format} draft with ${input.tone} tone.`,
      data: {
        draft: generatedText,
      },
    };
  }),
};

export const AI_TOOLS_REGISTRY: ReadonlyArray<AIToolDefinition> = [
  autoSummaryTool,
  orthoDraftTool,
  segmentationTool,
  reportTool,
  assistantTool,
];

export function getToolById(toolId: string): AIToolDefinition | null {
  return AI_TOOLS_REGISTRY.find((tool) => tool.id === toolId) ?? null;
}
