import { useRef } from 'react';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useFrameProcessor, runAtTargetFps } from 'react-native-vision-camera';
import { runYoloPostProcess } from '../lib/yolo';
import { MODEL_ASSET_PATH } from '../constants/model';
import { BoundingBox } from '../types';

export function useWeldDetection() {
  const model = useTensorflowModel(MODEL_ASSET_PATH);
  const isModelReady = model.state === 'loaded' && model.model != null;
  const detectionSharedValue = useSharedValue<BoundingBox | null>(null);
  const lastInferenceMsRef = useRef(0);

  const updateDetection = (primary: BoundingBox | null, ms: number) => {
    detectionSharedValue.value = primary;
    lastInferenceMsRef.current = ms;
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!isModelReady || model.model == null) return;

    runAtTargetFps(15, () => {
      'worklet';
      const start = performance.now();
      const pixelBuffer = frame.toArrayBuffer();
      const outputs = model.model!.runSync([pixelBuffer]);
      const inferenceTimeMs = performance.now() - start;

      if (outputs[0]) {
        const rawData = outputs[0] as Float32Array;
        const copy = new Float32Array(rawData);
        runOnJS(updateDetection)(
          runYoloPostProcess(copy, inferenceTimeMs).primary,
          inferenceTimeMs
        );
      }
    });
  }, [isModelReady, model.model]);

  return {
    frameProcessor,
    detectionSharedValue,
    isModelReady,
    get lastInferenceMs() { return lastInferenceMsRef.current; },
  };
}
