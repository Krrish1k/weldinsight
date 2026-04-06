import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WeldInsight Pro',
  slug: 'weldinsight-pro',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  scheme: 'weldinsight',
  ios: {
    bundleIdentifier: 'com.anupeng.weldinsightpro',
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: 'WeldInsight Pro uses the camera to inspect weld beads.',
    },
  },
  android: {
    package: 'com.anupeng.weldinsightpro',
    permissions: ['android.permission.CAMERA'],
  },
  plugins: [
    'expo-router',
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: 'WeldInsight Pro needs camera access to inspect welds.',
        enableMicrophonePermission: false,
      },
    ],
    'expo-image-manipulator',
    ['expo-asset', { assets: ['./assets/models/yolov8n_weld.tflite'] }],
  ],
});
