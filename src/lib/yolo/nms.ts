// src/lib/yolo/nms.ts
import { RawDetection, BoundingBox } from '../../types';
import { IOU_THRESHOLD } from '../../constants/model';

function computeIou(a: RawDetection, b: RawDetection): number {
  const aX1 = a.cx - a.w / 2, aY1 = a.cy - a.h / 2;
  const aX2 = a.cx + a.w / 2, aY2 = a.cy + a.h / 2;
  const bX1 = b.cx - b.w / 2, bY1 = b.cy - b.h / 2;
  const bX2 = b.cx + b.w / 2, bY2 = b.cy + b.h / 2;

  const interX1 = Math.max(aX1, bX1);
  const interY1 = Math.max(aY1, bY1);
  const interX2 = Math.min(aX2, bX2);
  const interY2 = Math.min(aY2, bY2);

  const interW = Math.max(0, interX2 - interX1);
  const interH = Math.max(0, interY2 - interY1);
  const intersection = interW * interH;

  if (intersection === 0) return 0;

  const aArea = a.w * a.h;
  const bArea = b.w * b.h;
  return intersection / (aArea + bArea - intersection);
}

export function applyNms(detections: RawDetection[]): BoundingBox[] {
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const kept: RawDetection[] = [];

  for (const candidate of sorted) {
    const suppressed = kept.some(
      (existing) => computeIou(candidate, existing) > IOU_THRESHOLD
    );
    if (!suppressed) kept.push(candidate);
  }

  return kept.map((d) => ({
    x: d.cx - d.w / 2,
    y: d.cy - d.h / 2,
    w: d.w,
    h: d.h,
    cx: d.cx,
    cy: d.cy,
    confidence: d.confidence,
  }));
}
