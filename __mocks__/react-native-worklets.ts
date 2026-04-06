// Mock for react-native-worklets (not installed, but required by react-native-reanimated)

export const executeOnUIRuntimeSync = jest.fn(() => jest.fn());
export const runOnUI = jest.fn((fn: (...args: unknown[]) => unknown) => fn);
export const runOnJS = jest.fn((fn: (...args: unknown[]) => unknown) => fn);
export const makeShareable = jest.fn((v: unknown) => v);
export const createSerializable = jest.fn((v: unknown) => v);
export const createSynchronizable = jest.fn((v: unknown) => v);
export const createWorkletRuntime = jest.fn();
export const isWorkletFunction = jest.fn(() => false);
export const callMicrotasks = jest.fn();
export const serializableMappingCache = new Map();
export const WorkletsModule = {};
export const RuntimeKind = { UI: 'UI', default: 'default' };

// Aliases used by reanimated
export const runOnUIasrunOnUIFromWorklets = runOnUI;
export const runOnJSasrunOnJSFromWorklets = runOnJS;
export const executeOnUIRuntimeSyncasexecuteOnUIRuntimeSyncFromWorklets = executeOnUIRuntimeSync;
export const isWorkletFunctionasisWorkletFunctionFromWorklets = isWorkletFunction;
export const createWorkletRuntimeascreateWorkletRuntimeFromWorklets = createWorkletRuntime;
export const runOnRuntimeasrunOnRuntimeFromWorklets = jest.fn();
