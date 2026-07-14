import { GoogleGenerativeAI, GenerativeModel, SchemaType } from '@google/generative-ai';
import Constants from 'expo-constants';

let _model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (_model) return _model;

  const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey as string | undefined;

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined. Check your EAS environment variables.');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  _model = genAI.getGenerativeModel({
    model: 'gemma-4-31b-it',
    systemInstruction:
      'You are a Certified Welding Inspector (CWI). ' +
      'Output ONLY raw JSON. No markdown. No explanation. No reasoning. No preamble. ' +
      'Your entire response must be a single JSON object matching this exact schema: ' +
      '{"verdict":"PASS","reason":"..."} or {"verdict":"FAIL","reason":"..."}',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          verdict: { type: SchemaType.STRING, enum: ['PASS', 'FAIL'] },
          reason: { type: SchemaType.STRING },
        },
        required: ['verdict', 'reason'],
      },
      temperature: 0.1,
      maxOutputTokens: 256,
    },
  });

  return _model;
}
