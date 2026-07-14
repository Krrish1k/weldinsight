import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WeldInsight Pro',
  slug: 'weldinsight-pro',
  owner: 'notencryption', // Added this to match your account
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  scheme: 'weldinsight',
  ios: {
    bundleIdentifier: 'com.anupeng.weldinsightpro',
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: 'WeldInsight Pro uses the camera to inspect weld beads.',
      NSPhotoLibraryUsageDescription: 'WeldInsight Pro needs photo library access to analyze weld images.',
    },
  },
  android: {
    package: 'com.anupeng.weldinsightpro',
    permissions: ['android.permission.CAMERA', 'android.permission.READ_MEDIA_IMAGES'],
  },
  plugins: [
    'expo-router',
    [
      'expo-image-picker',
      {
        photosPermission: 'WeldInsight Pro needs photo library access to analyze weld images.',
      },
    ],
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: 'WeldInsight Pro needs camera access to inspect welds.',
        enableMicrophonePermission: false,
      },
    ],
    [
      'expo-asset',
      {
        assets: ['./assets/models/yolov8n_weld.tflite']
      }
    ],
  ],
  extra: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    eas: {
      projectId: "6a06da60-5c61-4c02-bbed-870e020fc114"
    }
  }
});