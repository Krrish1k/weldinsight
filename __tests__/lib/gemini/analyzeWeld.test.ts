import { analyzeWeld } from '../../../src/lib/gemini/analyzeWeld';

const mockGenerateContent = jest.fn();

jest.mock('../../../src/lib/gemini/client', () => ({
  getGeminiModel: () => ({
    generateContent: mockGenerateContent,
  }),
}));

const VALID_RESPONSE = {
  verdict: 'PASS',
  reason: 'No significant defects detected; bead geometry and fusion are acceptable.',
};

describe('analyzeWeld', () => {
  it('parses valid JSON response into WeldAnalysis', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(VALID_RESPONSE) },
    });

    const result = await analyzeWeld('base64data');
    expect(result.verdict).toBe('PASS');
    expect(result.reason).toBe(VALID_RESPONSE.reason);
  });

  it('throws on non-JSON response', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Sorry, I cannot analyze this image.' },
    });

    await expect(analyzeWeld('base64data')).rejects.toThrow('non-JSON');
  });

  it('throws when verdict is missing', async () => {
    const { verdict, ...incomplete } = VALID_RESPONSE;
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(incomplete) },
    });

    await expect(analyzeWeld('base64data')).rejects.toThrow('Missing field');
  });

  it('throws when verdict is invalid value', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ ...VALID_RESPONSE, verdict: 'MAYBE' }) },
    });

    await expect(analyzeWeld('base64data')).rejects.toThrow('Invalid verdict');
  });
});
