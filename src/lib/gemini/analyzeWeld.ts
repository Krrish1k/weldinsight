import { getGeminiModel } from './client';
import { buildCwiPrompt } from './prompt';
import { WeldAnalysis } from '../../types';

export async function analyzeWeld(base64Image: string): Promise<WeldAnalysis> {
  const model = getGeminiModel();
  const prompt = buildCwiPrompt();

  const result = await model.generateContent([
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    { text: prompt },
  ]);

  const responseText = result.response.text().trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    // Try extracting a JSON object if the model wrapped it in prose
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(`Gemini returned non-JSON response: ${responseText.slice(0, 200)}`);
    }
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error(`Gemini returned non-JSON response: ${responseText.slice(0, 200)}`);
    }
  }

  return validateWeldAnalysis(parsed);
}

function validateWeldAnalysis(raw: unknown): WeldAnalysis {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid analysis response: expected object');
  }

  const obj = raw as Record<string, unknown>;

  for (const key of ['verdict', 'reason']) {
    if (!(key in obj)) throw new Error(`Missing field in analysis response: ${key}`);
  }

  if (obj.verdict !== 'PASS' && obj.verdict !== 'FAIL') {
    throw new Error(`Invalid verdict: ${obj.verdict}`);
  }

  return obj as unknown as WeldAnalysis;
}
