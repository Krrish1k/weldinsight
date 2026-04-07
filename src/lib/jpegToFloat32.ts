import * as ImageManipulator from 'expo-image-manipulator';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { decode as decodeJpeg } from 'jpeg-js';
import { MODEL_INPUT_SIZE } from '../constants/model';

/**
 * Loads an image from a URI, resizes it to MODEL_INPUT_SIZE × MODEL_INPUT_SIZE,
 * and returns a normalized RGB Float32Array suitable for TFLite inference.
 */
export async function imageUriToFloat32(uri: string): Promise<Float32Array> {
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
    { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG }
  );

  const base64 = await readAsStringAsync(resized.uri, { encoding: 'base64' });

  const binary = atob(base64);
  const jpegBytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    jpegBytes[i] = binary.charCodeAt(i);
  }

  const { data: rgba, width: decodedW, height: decodedH } = decodeJpeg(jpegBytes, { useTArray: true });

  if (decodedW !== MODEL_INPUT_SIZE || decodedH !== MODEL_INPUT_SIZE) {
    throw new Error(`Unexpected decoded size: ${decodedW}x${decodedH}, expected ${MODEL_INPUT_SIZE}x${MODEL_INPUT_SIZE}`);
  }

  const pixelCount = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  const float32 = new Float32Array(pixelCount * 3);
  for (let i = 0; i < pixelCount; i++) {
    float32[i * 3 + 0] = rgba[i * 4 + 0] / 255;
    float32[i * 3 + 1] = rgba[i * 4 + 1] / 255;
    float32[i * 3 + 2] = rgba[i * 4 + 2] / 255;
  }

  return float32;
}
