module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/lib/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      moduleNameMapper: {
        '@env': '<rootDir>/__mocks__/@env.ts',
        '\\.tflite$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(?:png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
      },
    },
    {
      displayName: 'expo',
      testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
      testPathIgnorePatterns: ['<rootDir>/__tests__/lib/'],
      preset: 'jest-expo',
      setupFiles: ['./jest.setup.js'],
      moduleNameMapper: {
        'react-native-vision-camera': '<rootDir>/__mocks__/react-native-vision-camera.ts',
        'react-native-fast-tflite': '<rootDir>/__mocks__/react-native-fast-tflite.ts',
        'expo-image-manipulator': '<rootDir>/__mocks__/expo-image-manipulator.ts',
        '@env': '<rootDir>/__mocks__/@env.ts',
        'react-native-worklets/package.json': '<rootDir>/__mocks__/react-native-worklets/package.json',
        'react-native-worklets': '<rootDir>/__mocks__/react-native-worklets.ts',
        'expo-file-system/build/legacy/FileSystem': '<rootDir>/__mocks__/expo-file-system.ts',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|nativewind|react-native-reanimated)',
      ],
    },
  ],
};
