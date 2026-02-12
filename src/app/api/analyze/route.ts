import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const ANALYSIS_PROMPT = `You are a dental radiograph analysis AI. Analyze this dental image and return a structured JSON response.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanation.

The JSON must follow this exact schema:
{
  "summary": "Brief 1-2 sentence summary of findings",
  "pathologies": [
    {
      "name": "Pathology name",
      "category": "endodontic|restorative|periodontal|anatomical|prosthetic|surgical",
      "severity": "critical|high|medium|low",
      "confidence": 85,
      "affectedTeeth": [36, 37],
      "description": "Detailed description of the finding",
      "boundingBox": { "x": 35, "y": 60, "width": 10, "height": 12 }
    }
  ],
  "dentalChart": {
    "11": { "number": 11, "status": "healthy|caries|filling|crown|missing|implant|rootCanal|bridge", "findings": ["finding1"], "hasPathology": true },
    "12": { "number": 12, "status": "healthy", "findings": [], "hasPathology": false }
  },
  "periodontalData": {
    "11": { "pocketDepths": [3, 2, 3, 2, 2, 3], "boneLoss": 1 },
    "12": { "pocketDepths": [2, 2, 2, 2, 2, 2], "boneLoss": 0 }
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "measurements": {
    "cephalometric": [
      { "name": "SNA Angle", "value": 82.5, "unit": "degrees", "normalRange": "80-84", "status": "normal|elevated|reduced" }
    ]
  }
}

Rules:
- Use FDI tooth numbering (11-18, 21-28, 31-38, 41-48)
- Include ALL visible teeth in dentalChart (usually 28-32 teeth)
- boundingBox x,y,width,height are percentages (0-100) of the image
- pocketDepths array has 6 values: MB, B, DB, ML, L, DL (estimate from radiograph)
- boneLoss in mm (estimate from radiograph)
- confidence is 0-100
- For cephalometric measurements, only include if the image is a lateral cephalogram
- Be thorough but accurate — only report what you can actually see`;

export async function POST(request: NextRequest) {
  try {
    const { image, imageType, patientName } = await request.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Extract media type and base64 from data URL
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid image format. Expected base64 data URL.' }, { status: 400 });
    }

    const mediaType = match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const base64Data = match[2];

    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `${ANALYSIS_PROMPT}\n\nImage type: ${imageType || 'panoramic'}\nPatient: ${patientName || 'Unknown'}`,
            },
          ],
        },
      ],
    });

    const analysisTimeMs = Date.now() - startTime;

    // Extract text from response
    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from Claude' }, { status: 500 });
    }

    // Parse JSON — strip markdown code blocks if present
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonText);

    // Add unique IDs to pathologies
    const pathologies = (parsed.pathologies || []).map((p: Record<string, unknown>, i: number) => ({
      ...p,
      id: `PAT-${Date.now()}-${i}`,
    }));

    // Build dentalChart with numeric keys
    const dentalChart: Record<number, unknown> = {};
    if (parsed.dentalChart) {
      for (const [key, value] of Object.entries(parsed.dentalChart)) {
        dentalChart[Number(key)] = value;
      }
    }

    // Build periodontalData with numeric keys
    const periodontalData: Record<number, unknown> = {};
    if (parsed.periodontalData) {
      for (const [key, value] of Object.entries(parsed.periodontalData)) {
        periodontalData[Number(key)] = value;
      }
    }

    const result = {
      summary: parsed.summary || 'Analysis complete.',
      pathologies,
      dentalChart,
      periodontalData,
      recommendations: parsed.recommendations || [],
      measurements: parsed.measurements || { cephalometric: [] },
      analyzedAt: new Date().toISOString(),
      imageType: imageType || 'panoramic',
      analysisTimeMs,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
