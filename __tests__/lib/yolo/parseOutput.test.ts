// __tests__/lib/yolo/parseOutput.test.ts
import { parseYoloOutput } from '../../../src/lib/yolo/parseOutput';

const NUM_ANCHORS = 8400;

function makeFlatOutput(anchors: Array<{ cx: number; cy: number; w: number; h: number; conf: number }>): Float32Array {
  const buf = new Float32Array(5 * NUM_ANCHORS);
  for (const [i, a] of anchors.entries()) {
    buf[0 * NUM_ANCHORS + i] = a.cx;
    buf[1 * NUM_ANCHORS + i] = a.cy;
    buf[2 * NUM_ANCHORS + i] = a.w;
    buf[3 * NUM_ANCHORS + i] = a.h;
    buf[4 * NUM_ANCHORS + i] = a.conf;
  }
  return buf;
}

describe('parseYoloOutput', () => {
  it('returns detections above confidence threshold', () => {
    const output = makeFlatOutput([
      { cx: 0.5, cy: 0.5, w: 0.3, h: 0.2, conf: 0.9 },
      { cx: 0.2, cy: 0.2, w: 0.1, h: 0.1, conf: 0.1 },
    ]);
    const result = parseYoloOutput(output);
    expect(result).toHaveLength(1);
    expect(result[0].cx).toBeCloseTo(0.5);
    expect(result[0].confidence).toBeCloseTo(0.9);
  });

  it('returns empty array when no detections above threshold', () => {
    const output = makeFlatOutput([
      { cx: 0.5, cy: 0.5, w: 0.3, h: 0.2, conf: 0.1 },
    ]);
    expect(parseYoloOutput(output)).toHaveLength(0);
  });

  it('returns empty array for zeroed buffer', () => {
    const output = new Float32Array(5 * NUM_ANCHORS);
    expect(parseYoloOutput(output)).toHaveLength(0);
  });
});
