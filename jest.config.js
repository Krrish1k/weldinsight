module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    'react-native-vision-camera': '<rootDir>/__mocks__/react-native-vision-camera.ts',
    'react-native-fast-tflite': '<rootDir>/__mocks__/react-native-fast-tflite.ts',
    'expo-image-manipulator': '<rootDir>/__mocks__/expo-image-manipulator.ts',
    '@env': '<rootDir>/__mocks__/@env.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|nativewind|react-native-reanimated)',
  ],
};
