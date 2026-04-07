import { useCallback } from 'react';
import { useTensorflowModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import { MODEL_ASSET_PATH, NUM_ANCHORS, STATIC_CONFIDENCE_THRESHOLD } from '../constants/model';
import { runYoloPostProcess } from '../lib/yolo';
import { imageUriToFloat32 } from '../lib/jpegToFloat32';
import { BoundingBox, FrameDimensions } from '../types';

export interface StaticDetectionResult {
  box: BoundingBox | null;
  /** Dimensions of the URI that was actually used for detection. */
  dims: FrameDimensions;
  /** The URI that was actually used — may be rotated relative to the original. */
  uri: string;
}

async function runDetection(
  model: { runSync: (inputs: unknown[]) => unknown[] },
  uri: string,
): Promise<{ primary: BoundingBox | null; rawOutput: Float32Array }> {
  const float32 = await imageUriToFloat32(uri);
  const outputs = model.runSync([float32]);
  const rawOutput = outputs[0] as Float32Array;

  // DEBUG — remove before shipping
  let maxConf = 0;
  let above01 = 0, above02 = 0, above045 = 0;
  for (let i = 0; i < NUM_ANCHORS; i++) {
    const c = rawOutput[4 * NUM_ANCHORS + i];
    if (c > maxConf) maxConf = c;
    if (c > 0.1) above01++;
    if (c > 0.2) above02++;
    if (c > 0.45) above045++;
  }
  console.log('[YOLO static] max confidence:', maxConf.toFixed(4), ' >0.10:', above01, ' >0.45:', above045);

  const { primary } = runYoloPostProcess(rawOutput, 0, STATIC_CONFIDENCE_THRESHOLD);
  return { primary, rawOutput };
}

export function useStaticDetection() {
  const model = useTensorflowModel(MODEL_ASSET_PATH);
  const isModelReady = model.state === 'loaded' && model.model != null;

  const detectInImage = useCallback(async (
    imageUri: string,
    imageDims: FrameDimensions,
  ): Promise<StaticDetectionResult> => {
    if (!model.model) throw new Error('Model not loaded');

    // First attempt: original orientation
    const { primary } = await runDetection(model.model, imageUri);
    if (primary) {
      return { box: primary, dims: imageDims, uri: imageUri };
    }

    // Fallback: rotate 90° and retry
    console.log('[YOLO static] no detection — retrying with 90° rotation');
    const rotated = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ rotate: 90 }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
    );
    const rotatedDims: FrameDimensions = { width: imageDims.height, height: imageDims.width };
    const { primary: primaryRotated } = await runDetection(model.model, rotated.uri);

    return { box: primaryRotated, dims: rotatedDims, uri: rotated.uri };
  }, [model.model]);

  return { detectInImage, isModelReady };
}
