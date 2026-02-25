export type AIProvider = 'mock' | 'anthropic';

export interface AppFlags {
  isDemo: boolean;
  aiProvider: AIProvider;
  demoLatencyMs: number;
  enableJarvis: boolean;
  randomFailRate: number;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (value === '1' || value.toLowerCase() === 'true') return true;
  if (value === '0' || value.toLowerCase() === 'false') return false;
  return fallback;
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

function parseAIProvider(value: string | undefined, fallback: AIProvider): AIProvider {
  if (value === 'mock' || value === 'anthropic') return value;
  return fallback;
}

function parseRate(value: string | undefined, fallback: number): number {
  const parsed = parseNumber(value, fallback);
  if (parsed < 0) return 0;
  if (parsed > 1) return 1;
  return parsed;
}

export const flags: AppFlags = {
  isDemo: parseBoolean(process.env.NEXT_PUBLIC_IS_DEMO, true),
  aiProvider: parseAIProvider(process.env.NEXT_PUBLIC_AI_PROVIDER, 'mock'),
  demoLatencyMs: parseNumber(process.env.NEXT_PUBLIC_DEMO_LATENCY_MS, 600),
  enableJarvis: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_JARVIS, true),
  randomFailRate: parseRate(process.env.NEXT_PUBLIC_RANDOM_FAIL_RATE, 0),
};

export function getFlags(): AppFlags {
  return flags;
}
