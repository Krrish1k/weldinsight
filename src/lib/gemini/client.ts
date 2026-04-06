import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

let _model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (_model) return _model;

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined. Check your .env file.');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  _model = genAI.getGenerativeModel({
    model: 'gemma-4-31b-it',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      maxOutputTokens: 1024,
    },
  });

  return _model;
}
