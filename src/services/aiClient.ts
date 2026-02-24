import { flags } from '@/config/flags';
import { buildMockAnalysisResult, MOCK_CHAT_RESPONSES } from '@/lib/fixtures';
import type { AIAnalysisResult, ChatInput, ChatResponse } from '@/features/ai';

async function delay(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export interface AIClient {
  analyzeImage(imageBase64: string, imageType: string, patientName: string): Promise<AIAnalysisResult>;
  chat(input: ChatInput): Promise<ChatResponse>;
}

async function analyzeWithAnthropic(
  imageBase64: string,
  imageType: string,
  patientName: string
): Promise<AIAnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64, imageType, patientName }),
  });

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => ({ error: 'Analysis failed' }));
    const errorMessage = getApiErrorMessage(data, response.status);
    throw new Error(errorMessage);
  }

  return (await response.json()) as AIAnalysisResult;
}

function getApiErrorMessage(payload: unknown, status: number): string {
  if (typeof payload !== 'object' || payload === null || !('error' in payload)) {
    return `Analysis failed (${status})`;
  }

  const maybeError = (payload as { error: unknown }).error;
  return typeof maybeError === 'string' ? maybeError : `Analysis failed (${status})`;
}

export const aiClient: AIClient = {
  async analyzeImage(imageBase64, imageType, patientName) {
    if (flags.aiProvider === 'anthropic') {
      return analyzeWithAnthropic(imageBase64, imageType, patientName);
    }

    await delay(flags.demoLatencyMs);
    return buildMockAnalysisResult(imageType, patientName);
  },

  async chat(input) {
    if (!flags.enableJarvis) {
      return {
        sessionId: input.sessionId ?? 'jarvis-disabled-session',
        message: 'Jarvis is disabled by feature flag.',
        provider: 'mock',
      };
    }

    await delay(flags.demoLatencyMs);

    const normalized = input.message.trim().toLowerCase();
    const responseMessage = normalized.includes('hello') || normalized.includes('bonjour')
      ? MOCK_CHAT_RESPONSES.greeting
      : MOCK_CHAT_RESPONSES.fallback;

    return {
      sessionId: input.sessionId ?? 'jarvis-mock-session',
      message: responseMessage,
      provider: flags.aiProvider,
    };
  },
};

export async function analyzeImage(
  imageBase64: string,
  imageType: string,
  patientName: string
): Promise<AIAnalysisResult> {
  return aiClient.analyzeImage(imageBase64, imageType, patientName);
}

export async function chat(input: ChatInput): Promise<ChatResponse> {
  return aiClient.chat(input);
}
