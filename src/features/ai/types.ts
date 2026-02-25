import type { AnalysisResult } from '@/hooks/usePlatformStore';

export interface AnalyzeImageInput {
  imageBase64: string;
  imageType: string;
  patientName: string;
}

export interface ChatInput {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  provider: 'mock' | 'anthropic';
}

export type AIAnalysisResult = AnalysisResult;
