import { useState, useCallback } from 'react';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { cropAndPadFrame } from '../lib/imageUtils';
import { analyzeWeld } from '../lib/gemini/analyzeWeld';
import { AnalysisState, BoundingBox, FrameDimensions } from '../types';

const INITIAL_STATE: AnalysisState = {
  status: 'idle',
  result: null,
  error: null,
  croppedImageUri: null,
};

export function useWeldAnalysis() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>(INITIAL_STATE);

  const startAnalysis = useCallback(async (
    frameUri: string,
    box: BoundingBox,
    dims: FrameDimensions
  ) => {
    setAnalysisState({ ...INITIAL_STATE, status: 'capturing' });

    try {
      setAnalysisState((s) => ({ ...s, status: 'cropping' }));
      const croppedUri = await cropAndPadFrame(frameUri, box, dims);

      setAnalysisState((s) => ({ ...s, status: 'analyzing', croppedImageUri: croppedUri }));
      const base64 = await readAsStringAsync(croppedUri, {
        encoding: 'base64',
      });
      const result = await analyzeWeld(base64);

      setAnalysisState({
        status: 'complete',
        result,
        error: null,
        croppedImageUri: croppedUri,
      });
    } catch (err) {
      console.error('[analyzeWeld] failed:', err);
      setAnalysisState((s) => ({
        ...s,
        status: 'error',
        error: err instanceof Error ? err.message : 'Analysis failed',
      }));
    }
  }, []);

  const reset = useCallback(() => setAnalysisState(INITIAL_STATE), []);

  const isAnalyzing = ['capturing', 'cropping', 'analyzing'].includes(analysisState.status);

  return { analysisState, startAnalysis, reset, isAnalyzing };
}
