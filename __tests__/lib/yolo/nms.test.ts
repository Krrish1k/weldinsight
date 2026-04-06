// __tests__/lib/yolo/nms.test.ts
import { applyNms } from '../../../src/lib/yolo/nms';
import { RawDetection } from '../../../src/types';

describe('applyNms', () => {
  it('keeps both boxes when they do not overlap', () => {
    const detections: RawDetection[] = [
      { cx: 0.2, cy: 0.2, w: 0.1, h: 0.1, confidence: 0.9 },
      { cx: 0.8, cy: 0.8, w: 0.1, h: 0.1, confidence: 0.8 },
    ];
    const result = applyNms(detections);
    expect(result).toHaveLength(2);
  });

  it('suppresses lower-confidence box when IoU exceeds threshold', () => {
    const detections: RawDetection[] = [
      { cx: 0.5, cy: 0.5, w: 0.3, h: 0.3, confidence: 0.9 },
      { cx: 0.52, cy: 0.52, w: 0.3, h: 0.3, confidence: 0.7 },
    ];
    const result = applyNms(detections);
    expect(result).toHaveLength(1);
    expect(result[0].confidence).toBeCloseTo(0.9);
  });

  it('converts center format to top-left in output BoundingBox', () => {
    const detections: RawDetection[] = [
      { cx: 0.5, cy: 0.5, w: 0.4, h: 0.2, confidence: 0.8 },
    ];
    const result = applyNms(detections);
    expect(result[0].x).toBeCloseTo(0.3);
    expect(result[0].y).toBeCloseTo(0.4);
  });

  it('returns empty array for empty input', () => {
    expect(applyNms([])).toHaveLength(0);
  });
});
