module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: [
      [
        'expo/internal/babel-preset',
        isTest ? { reanimated: false, worklets: false } : {},
      ],
    ],
    plugins: [
      ...(isTest ? [] : ['nativewind/babel']),
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: true,
          allowUndefined: false,
        },
      ],
      ...(isTest ? [] : ['react-native-reanimated/plugin']),
    ],
  };
};
