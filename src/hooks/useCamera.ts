import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export function useCamera() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  return { device, hasPermission, requestPermission };
}
