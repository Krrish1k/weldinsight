export const useTensorflowModel = jest.fn(() => ({
  state: 'loaded',
  model: { runSync: jest.fn(() => [{ data: new Float32Array(5 * 8400) }]) },
}));
