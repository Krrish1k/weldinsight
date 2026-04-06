import { View, Text } from 'react-native';
import { useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import { router } from 'expo-router';

import { useCamera } from '../src/hooks/useCamera';
import { useWeldDetection } from '../src/hooks/useWeldDetection';
import { useWeldAnalysis } from '../src/hooks/useWeldAnalysis';

import BoundingBoxOverlay from '../src/components/BoundingBoxOverlay';
import ThinkingOverlay from '../src/components/ThinkingOverlay';
import ResultsModal from '../src/components/ResultsModal';
import CaptureButton from '../src/components/CaptureButton';

const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;

export default function CameraScreen() {
  const cameraRef = useRef<Camera>(null);
  const { device, hasPermission, requestPermission } = useCamera();
  const { frameProcessor, detectionSharedValue, isModelReady } = useWeldDetection();
  const { analysisState, startAnalysis, reset } = useWeldAnalysis();

  const isAnalyzing = ['capturing', 'cropping', 'analyzing'].includes(analysisState.status);

  const handleCapture = async () => {
    const currentBox = detectionSharedValue.value;
    if (!currentBox || !cameraRef.current) return;

    const snapshot = await cameraRef.current.takeSnapshot({ quality: 85 });
    await startAnalysis(
      `file://${snapshot.path}`,
      currentBox,
      { width: FRAME_WIDTH, height: FRAME_HEIGHT }
    );
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center px-8 gap-y-4">
        <Text className="text-white text-center text-base">
          Camera permission is required for weld inspection.
        </Text>
        <Text onPress={requestPermission} className="text-green-400 font-semibold text-base">
          Grant Permission
        </Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-zinc-400">No camera device available.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={device}
        isActive
        frameProcessor={frameProcessor}
        pixelFormat="rgb"
      />

      <View className="absolute inset-0">
        <BoundingBoxOverlay
          detectionSharedValue={detectionSharedValue}
          frameWidth={FRAME_WIDTH}
          frameHeight={FRAME_HEIGHT}
        />
      </View>

      <View className="absolute bottom-12 left-0 right-0 items-center gap-y-3">
        {!isModelReady && (
          <Text className="text-yellow-400 text-xs">Loading model...</Text>
        )}
        <CaptureButton
          onPress={handleCapture}
          disabled={!isModelReady || isAnalyzing || !detectionSharedValue.value}
        />
      </View>

      <ThinkingOverlay visible={isAnalyzing} />

      <ResultsModal
        visible={analysisState.status === 'complete' || analysisState.status === 'error'}
        analysis={analysisState.result}
        croppedImageUri={analysisState.croppedImageUri}
        onClose={() => { reset(); router.back(); }}
        onRetry={reset}
      />
    </View>
  );
}
