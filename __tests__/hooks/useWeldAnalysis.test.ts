import { renderHook, act } from '@testing-library/react-native';
import { useWeldAnalysis } from '../../src/hooks/useWeldAnalysis';

// expo-file-system mock is handled via moduleNameMapper in jest.config.js

jest.mock('../../src/lib/imageUtils', () => ({
  cropAndPadFrame: jest.fn().mockResolvedValue('file:///cropped.jpg'),
}));

jest.mock('../../src/lib/gemini/analyzeWeld', () => ({
  analyzeWeld: jest.fn().mockResolvedValue({
    surface_condition: 'Acceptable',
    bead_geometry: 'Acceptable',
    fusion_quality: 'Acceptable',
    discontinuities: 'None detected',
    verdict: 'PASS',
    recommended_actions: ['Continue.'],
    confidence_score: 0.9,
  }),
}));

describe('useWeldAnalysis', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useWeldAnalysis());
    expect(result.current.analysisState.status).toBe('idle');
  });

  it('transitions to complete on successful analysis', async () => {
    const { result } = renderHook(() => useWeldAnalysis());

    await act(async () => {
      await result.current.startAnalysis(
        'file:///frame.jpg',
        { x: 0.1, y: 0.1, w: 0.5, h: 0.5, cx: 0.35, cy: 0.35, confidence: 0.9 },
        { width: 1920, height: 1080 }
      );
    });

    expect(result.current.analysisState.status).toBe('complete');
    expect(result.current.analysisState.result?.verdict).toBe('PASS');
  });

  it('resets to idle', async () => {
    const { result } = renderHook(() => useWeldAnalysis());

    await act(async () => {
      await result.current.startAnalysis(
        'file:///frame.jpg',
        { x: 0.1, y: 0.1, w: 0.5, h: 0.5, cx: 0.35, cy: 0.35, confidence: 0.9 },
        { width: 1920, height: 1080 }
      );
    });

    act(() => result.current.reset());
    expect(result.current.analysisState.status).toBe('idle');
  });
});
