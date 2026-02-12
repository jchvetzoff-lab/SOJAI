import type { AnalysisResult } from '@/hooks/usePlatformStore';

export async function analyzeImage(
  imageBase64: string,
  imageType: string,
  patientName: string
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageBase64,
      imageType,
      patientName,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(data.error || `Analysis failed (${response.status})`);
  }

  return response.json();
}
