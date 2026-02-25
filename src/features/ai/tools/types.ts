import { z } from 'zod';

export type ToolOutputValue =
  | string
  | number
  | boolean
  | null
  | ToolOutputValue[]
  | { [key: string]: ToolOutputValue };

export interface ToolRunResult {
  status: 'success' | 'queued';
  headline: string;
  body: string;
  data?: Record<string, ToolOutputValue>;
}

export interface ToolRunContext {
  runAtIso: string;
  selectedPatientId: string | null;
}

export interface AIToolDefinition<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  id: string;
  name: string;
  description: string;
  inputSchema: TSchema;
  run: (input: z.infer<TSchema>, context: ToolRunContext) => Promise<ToolRunResult>;
}

export interface ToolRunHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  startedAtIso: string;
  durationMs: number;
  status: 'success' | 'queued' | 'failed';
  headline: string;
  body: string;
}
