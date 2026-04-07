// src/lib/yolo/parseOutput.ts
import { RawDetection } from '../../types';
import { CONFIDENCE_THRESHOLD, NUM_ANCHORS } from '../../constants/model';

export function parseYoloOutput(output: Float32Array, confidenceThreshold = CONFIDENCE_THRESHOLD): RawDetection[] {
  const detections: RawDetection[] = [];

  for (let i = 0; i < NUM_ANCHORS; i++) {
    const confidence = output[4 * NUM_ANCHORS + i];
    if (confidence < confidenceThreshold) continue;

    detections.push({
      cx: output[0 * NUM_ANCHORS + i],
      cy: output[1 * NUM_ANCHORS + i],
      w:  output[2 * NUM_ANCHORS + i],
      h:  output[3 * NUM_ANCHORS + i],
      confidence,
    });
  }

  return detections;
}
