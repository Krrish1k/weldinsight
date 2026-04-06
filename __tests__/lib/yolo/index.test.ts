// __tests__/lib/yolo/index.test.ts
import { runYoloPostProcess } from '../../../src/lib/yolo';

const NUM_ANCHORS = 8400;

describe('runYoloPostProcess', () => {
  it('returns primary as highest-confidence box', () => {
    const buf = new Float32Array(5 * NUM_ANCHORS);
    buf[0 * NUM_ANCHORS + 0] = 0.5;
    buf[1 * NUM_ANCHORS + 0] = 0.5;
    buf[2 * NUM_ANCHORS + 0] = 0.3;
    buf[3 * NUM_ANCHORS + 0] = 0.2;
    buf[4 * NUM_ANCHORS + 0] = 0.9;
    buf[0 * NUM_ANCHORS + 1] = 0.1;
    buf[1 * NUM_ANCHORS + 1] = 0.1;
    buf[2 * NUM_ANCHORS + 1] = 0.05;
    buf[3 * NUM_ANCHORS + 1] = 0.05;
    buf[4 * NUM_ANCHORS + 1] = 0.6;

    const result = runYoloPostProcess(buf, 12);
    expect(result.boxes).toHaveLength(2);
    expect(result.primary).not.toBeNull();
    expect(result.primary!.confidence).toBeCloseTo(0.9);
    expect(result.inferenceTimeMs).toBe(12);
  });

  it('returns null primary when no detections', () => {
    const buf = new Float32Array(5 * NUM_ANCHORS);
    const result = runYoloPostProcess(buf, 5);
    expect(result.primary).toBeNull();
    expect(result.boxes).toHaveLength(0);
  });
});
