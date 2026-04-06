export const Camera = 'Camera';
export const useCameraDevice = jest.fn(() => ({ id: 'mock', position: 'back' }));
export const useCameraPermission = jest.fn(() => ({
  hasPermission: true,
  requestPermission: jest.fn(),
}));
export const useFrameProcessor = jest.fn(() => jest.fn());
export const runAtTargetFps = jest.fn((_, fn) => fn());
