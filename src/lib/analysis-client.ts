import type { AnalysisResult } from '@/hooks/usePlatformStore';
import { analyzeImage as analyzeImageService } from '@/services/aiClient';

export async function analyzeImage(
  imageBase64: string,
  imageType: string,
  patientName: string
): Promise<AnalysisResult> {
  return analyzeImageService(imageBase64, imageType, patientName);
}
