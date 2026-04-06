// __tests__/lib/imageUtils.test.ts
import { cropAndPadFrame } from '../../src/lib/imageUtils';
import { manipulateAsync } from 'expo-image-manipulator';

jest.mock('expo-image-manipulator');
const mockManipulate = manipulateAsync as jest.MockedFunction<typeof manipulateAsync>;

describe('cropAndPadFrame', () => {
  beforeEach(() => {
    mockManipulate.mockResolvedValue({ uri: 'file:///cropped.jpg', width: 100, height: 100, base64: undefined });
  });

  it('applies 20% padding and clamps to frame bounds', async () => {
    const box = { x: 0.1, y: 0.1, w: 0.5, h: 0.5, cx: 0.35, cy: 0.35, confidence: 0.9 };
    const dims = { width: 1920, height: 1080 };

    await cropAndPadFrame('file:///frame.jpg', box, dims);

    const [, actions] = mockManipulate.mock.calls[0];
    const crop = (actions as any)[0].crop;

    expect(crop.originX).toBe(0);
    expect(crop.originY).toBe(0);
    expect(crop.width).toBe(Math.round(0.7 * 1920));
    expect(crop.height).toBe(Math.round(0.7 * 1080));
  });

  it('clamps padding at frame edges', async () => {
    const box = { x: 0.85, y: 0.85, w: 0.1, h: 0.1, cx: 0.9, cy: 0.9, confidence: 0.8 };
    const dims = { width: 1920, height: 1080 };

    await cropAndPadFrame('file:///frame.jpg', box, dims);

    const [, actions] = mockManipulate.mock.calls[0];
    const crop = (actions as any)[0].crop;

    expect(crop.originX + crop.width).toBeLessThanOrEqual(1920);
    expect(crop.originY + crop.height).toBeLessThanOrEqual(1080);
  });
});
