// src/lib/yolo/index.ts
import { parseYoloOutput } from './parseOutput';
import { applyNms } from './nms';
import { DetectionResult } from '../../types';

export function runYoloPostProcess(
  rawOutput: Float32Array,
  inferenceTimeMs: number
): DetectionResult {
  const raw = parseYoloOutput(rawOutput);
  const boxes = applyNms(raw);
  const primary = boxes.length > 0 ? boxes[0] : null;
  return { boxes, primary, inferenceTimeMs };
}
