'use client';

import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { flags } from '@/config/flags';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { AI_TOOLS_REGISTRY, getToolById } from '@/features/ai/tools/registry';
import type {
  AIToolDefinition,
  ToolOutputValue,
  ToolRunHistoryItem,
  ToolRunResult,
} from '@/features/ai/tools/types';

type FieldKind = 'string' | 'number' | 'boolean' | 'enum';

interface FieldDescriptor {
  key: string;
  kind: FieldKind;
  required: boolean;
  enumOptions: string[];
}

function unwrapSchema(schema: z.ZodTypeAny): { schema: z.ZodTypeAny; required: boolean } {
  if (schema instanceof z.ZodOptional) {
    return { schema: schema.unwrap(), required: false };
  }
  if (schema instanceof z.ZodDefault) {
    return { schema: schema._def.innerType, required: false };
  }
  return { schema, required: true };
}

function buildFieldDescriptors(tool: AIToolDefinition | null): FieldDescriptor[] {
  if (!tool || !(tool.inputSchema instanceof z.ZodObject)) return [];

  const shape = tool.inputSchema.shape;
  return Object.entries(shape).map(([key, rawSchema]) => {
    const { schema, required } = unwrapSchema(rawSchema);

    if (schema instanceof z.ZodNumber) {
      return { key, kind: 'number', required, enumOptions: [] };
    }

    if (schema instanceof z.ZodBoolean) {
      return { key, kind: 'boolean', required, enumOptions: [] };
    }

    if (schema instanceof z.ZodEnum) {
      return { key, kind: 'enum', required, enumOptions: schema.options };
    }

    return { key, kind: 'string', required, enumOptions: [] };
  });
}

function buildInitialFormValues(fields: FieldDescriptor[], selectedPatientId: string | null): Record<string, string> {
  const base: Record<string, string> = {};
  fields.forEach((field) => {
    if (field.key.toLowerCase().includes('patientid') && selectedPatientId) {
      base[field.key] = selectedPatientId;
      return;
    }

    if (field.kind === 'boolean') {
      base[field.key] = 'true';
      return;
    }

    if (field.kind === 'enum') {
      base[field.key] = field.enumOptions[0] ?? '';
      return;
    }

    base[field.key] = '';
  });
  return base;
}

function parseFormValues(fields: FieldDescriptor[], values: Record<string, string>): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};

  fields.forEach((field) => {
    const raw = values[field.key] ?? '';

    if (field.kind === 'number') {
      parsed[field.key] = raw === '' ? undefined : Number(raw);
      return;
    }

    if (field.kind === 'boolean') {
      parsed[field.key] = raw === 'true';
      return;
    }

    parsed[field.key] = raw;
  });

  return parsed;
}

function renderDataValue(value: ToolOutputValue): string {
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

export default function AICenterPage() {
  const { selectedPatientId } = usePlatformStore();

  const [selectedToolId, setSelectedToolId] = useState(AI_TOOLS_REGISTRY[0]?.id ?? '');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [latestOutput, setLatestOutput] = useState<ToolRunResult | null>(null);
  const [history, setHistory] = useState<ToolRunHistoryItem[]>([]);

  const selectedTool = useMemo(() => getToolById(selectedToolId), [selectedToolId]);
  const fields = useMemo(() => buildFieldDescriptors(selectedTool), [selectedTool]);

  useEffect(() => {
    setFormValues(buildInitialFormValues(fields, selectedPatientId));
    setRunError(null);
    setLatestOutput(null);
    setProgress(0);
  }, [fields, selectedPatientId]);

  const executeTool = async (): Promise<void> => {
    if (!selectedTool || running) return;

    setRunning(true);
    setProgress(3);
    setRunError(null);

    const startedAt = Date.now();
    const runAtIso = new Date(startedAt).toISOString();

    const interval = setInterval(() => {
      setProgress((current) => (current >= 90 ? current : current + 7));
    }, 180);

    try {
      const payload = parseFormValues(fields, formValues);
      const validated = selectedTool.inputSchema.parse(payload);
      const result = await selectedTool.run(validated, { runAtIso, selectedPatientId });

      const completedAt = Date.now();
      const historyEntry: ToolRunHistoryItem = {
        id: `run-${completedAt}`,
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        startedAtIso: runAtIso,
        durationMs: completedAt - startedAt,
        status: result.status,
        headline: result.headline,
        body: result.body,
      };

      setLatestOutput(result);
      setHistory((prev) => [historyEntry, ...prev].slice(0, 20));
      setProgress(100);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown execution error.';
      setRunError(message);

      const failedAt = Date.now();
      const historyEntry: ToolRunHistoryItem = {
        id: `run-${failedAt}`,
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        startedAtIso: runAtIso,
        durationMs: failedAt - startedAt,
        status: 'failed',
        headline: 'Execution failed',
        body: message,
      };
      setHistory((prev) => [historyEntry, ...prev].slice(0, 20));
      setProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setRunning(false);
      }, 120);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">AI Center</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Command center for demo AI tools and orchestration.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-md bg-white/[0.04] text-[#8B8B8E] border border-white/[0.08]">Latency: {flags.demoLatencyMs}ms</span>
          <span className="px-2 py-1 rounded-md bg-white/[0.04] text-[#8B8B8E] border border-white/[0.08]">Random fail: {Math.round(flags.randomFailRate * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_360px] gap-3 min-h-[70vh]">
        <section className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-[13px] font-semibold text-[#EDEDEF]">Tool Catalog</div>
          <div className="p-3 space-y-2">
            {AI_TOOLS_REGISTRY.map((tool) => {
              const active = tool.id === selectedToolId;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left rounded-md border p-3 transition-colors ${
                    active ? 'border-[#5B5BD6]/50 bg-[#5B5BD6]/10' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="text-[13px] font-medium text-[#EDEDEF]">{tool.name}</div>
                  <div className="text-[11px] text-[#5C5C5F] mt-1">{tool.description}</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[13px] font-semibold text-[#EDEDEF]">Execution</div>
              <div className="text-[11px] text-[#5C5C5F]">{selectedTool?.name ?? 'Select a tool'}</div>
            </div>
            <button
              onClick={() => {
                void executeTool();
              }}
              disabled={!selectedTool || running}
              className="px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[12px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? 'Running...' : 'Run tool'}
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {fields.map((field) => (
                <label key={field.key} className="block">
                  <div className="text-[11px] text-[#8B8B8E] mb-1">{field.key}{field.required ? ' *' : ''}</div>
                  {field.kind === 'enum' ? (
                    <select
                      value={formValues[field.key] ?? ''}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="w-full bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none"
                    >
                      {field.enumOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.kind === 'boolean' ? (
                    <select
                      value={formValues[field.key] ?? 'true'}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="w-full bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none"
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <input
                      type={field.kind === 'number' ? 'number' : 'text'}
                      value={formValues[field.key] ?? ''}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="w-full bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none"
                    />
                  )}
                </label>
              ))}
            </div>

            <div>
              <div className="text-[11px] text-[#8B8B8E] mb-1">Progress</div>
              <div className="h-2 rounded bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-[#5B5BD6] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-[11px] text-[#5C5C5F] mt-1">{progress}%</div>
            </div>

            {runError && (
              <div className="rounded-md border border-[#E5484D]/30 bg-[#E5484D]/10 px-3 py-2 text-[12px] text-[#FF9DA1]">
                {runError}
              </div>
            )}

            {latestOutput && (
              <div className="rounded-md border border-white/[0.08] bg-white/[0.02] p-3 space-y-2">
                <div className="text-[12px] text-[#8B8B8E]">Output</div>
                <div className="text-[13px] font-medium text-[#EDEDEF]">{latestOutput.headline}</div>
                <div className="text-[12px] text-[#8B8B8E]">{latestOutput.body}</div>
                {latestOutput.data && (
                  <div className="space-y-1 pt-1">
                    {Object.entries(latestOutput.data).map(([key, value]) => (
                      <div key={key} className="text-[11px] text-[#5C5C5F]">
                        <span className="text-[#8B8B8E]">{key}:</span> {renderDataValue(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-[13px] font-semibold text-[#EDEDEF]">Run History</div>
          <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {history.length === 0 && (
              <div className="text-[12px] text-[#5C5C5F]">No runs yet.</div>
            )}
            {history.map((entry) => (
              <div key={entry.id} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-[#EDEDEF]">{entry.toolName}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    entry.status === 'failed'
                      ? 'bg-[#E5484D]/20 text-[#FF9DA1]'
                      : entry.status === 'queued'
                      ? 'bg-[#E5A836]/20 text-[#FCD34D]'
                      : 'bg-[#30A46C]/20 text-[#6EE7B7]'
                  }`}>{entry.status}</span>
                </div>
                <div className="text-[11px] text-[#8B8B8E] mt-1">{entry.headline}</div>
                <div className="text-[11px] text-[#5C5C5F] mt-1">{entry.body}</div>
                <div className="text-[10px] text-[#5C5C5F] mt-2">{new Date(entry.startedAtIso).toLocaleString()} • {entry.durationMs}ms</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
