import { View, Text, Pressable, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { useStaticDetection } from '../src/hooks/useStaticDetection';
import { useWeldAnalysis } from '../src/hooks/useWeldAnalysis';
import ThinkingOverlay from '../src/components/ThinkingOverlay';
import ResultsModal from '../src/components/ResultsModal';
import { FrameDimensions } from '../src/types';

type UploadStatus = 'idle' | 'detecting' | 'no_weld';

export default function UploadScreen() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const { detectInImage, isModelReady } = useStaticDetection();
  const { analysisState, startAnalysis, reset, isAnalyzing } = useWeldAnalysis();

  const handlePick = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const dims: FrameDimensions = { width: asset.width, height: asset.height };

    setPickedUri(asset.uri);
    setUploadStatus('detecting');

    try {
      const { box, uri: detectionUri, dims: detectionDims } = await detectInImage(asset.uri, dims);
      if (!box) {
        setUploadStatus('no_weld');
        return;
      }
      setUploadStatus('idle');
      await startAnalysis(detectionUri, box, detectionDims);
    } catch (err) {
      console.error('[upload] detection failed:', err);
      setUploadStatus('no_weld');
    }
  }, [detectInImage, startAnalysis]);

  const handleRetry = useCallback(() => {
    reset();
    setPickedUri(null);
    setUploadStatus('idle');
  }, [reset]);

  const handleClose = useCallback(() => {
    reset();
    router.back();
  }, [reset]);

  const buttonLabel = !isModelReady
    ? 'Loading model...'
    : uploadStatus === 'no_weld'
    ? 'Try Another Photo'
    : 'Select Photo';

  return (
    <View className="flex-1 bg-zinc-950">
      <View className="pt-16 px-6 pb-4">
        <Text className="text-3xl font-bold text-white tracking-tight">Upload Photo</Text>
        <Text className="text-zinc-400 text-base mt-1">
          Select a weld image from your library
        </Text>
      </View>

      <View className="flex-1 px-6 items-center justify-center gap-y-6">
        {pickedUri && (
          <Image
            source={{ uri: pickedUri }}
            className="w-full rounded-2xl"
            style={{ aspectRatio: 4 / 3 }}
            resizeMode="cover"
          />
        )}

        {uploadStatus === 'detecting' && (
          <Text className="text-zinc-400 text-sm">Detecting weld...</Text>
        )}

        {uploadStatus === 'no_weld' && (
          <View className="bg-zinc-900 rounded-2xl p-5 w-full gap-y-2">
            <Text className="text-red-400 font-semibold">No weld detected</Text>
            <Text className="text-zinc-400 text-sm">
              The model couldn't find a weld bead in this image. Try a clearer photo.
            </Text>
          </View>
        )}

        {uploadStatus !== 'detecting' && !isAnalyzing && (
          <Pressable
            onPress={handlePick}
            disabled={!isModelReady}
            className="bg-green-500 active:bg-green-600 rounded-2xl py-5 w-full items-center"
            style={({ pressed }) => ({ opacity: !isModelReady ? 0.5 : pressed ? 0.8 : 1 })}
          >
            <Text className="text-white font-semibold text-lg">{buttonLabel}</Text>
          </Pressable>
        )}

        <Pressable onPress={() => router.back()} className="py-2">
          <Text className="text-zinc-500 text-sm">Back</Text>
        </Pressable>
      </View>

      <ThinkingOverlay visible={isAnalyzing} />

      <ResultsModal
        visible={analysisState.status === 'complete' || analysisState.status === 'error'}
        analysis={analysisState.result}
        croppedImageUri={analysisState.croppedImageUri}
        onClose={handleClose}
        onRetry={handleRetry}
      />
    </View>
  );
}
