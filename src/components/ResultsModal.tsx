import { Modal, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { WeldAnalysis } from '../types';
import StatusBadge from './StatusBadge';
import AnalysisCard from './AnalysisCard';

interface ResultsModalProps {
  visible: boolean;
  analysis: WeldAnalysis | null;
  croppedImageUri: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export default function ResultsModal({
  visible, analysis, croppedImageUri, onClose, onRetry,
}: ResultsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-zinc-950">
        <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-12 gap-y-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-bold">Inspection Report</Text>
            {analysis && <StatusBadge verdict={analysis.verdict} />}
          </View>

          {croppedImageUri && (
            <Image source={{ uri: croppedImageUri }} className="w-full h-48 rounded-xl" resizeMode="cover" />
          )}

          {!analysis && (
            <View className="bg-red-950 rounded-xl p-4">
              <Text className="text-red-300 font-semibold">Analysis Failed</Text>
              <Text className="text-red-400 text-sm mt-1">
                Unable to complete cloud analysis. Check your connection and API key.
              </Text>
            </View>
          )}

          {analysis && (
            <View className="gap-y-3">
              <AnalysisCard label="Surface Condition" value={analysis.surface_condition} />
              <AnalysisCard label="Bead Geometry" value={analysis.bead_geometry} />
              <AnalysisCard label="Fusion Quality" value={analysis.fusion_quality} />
              <AnalysisCard label="Discontinuities" value={analysis.discontinuities} />

              <View className="bg-zinc-900 rounded-xl p-4 gap-y-2">
                <Text className="text-zinc-300 text-sm font-semibold uppercase tracking-wider">
                  Recommended Actions
                </Text>
                {analysis.recommended_actions.map((action, idx) => (
                  <Text key={idx} className="text-zinc-400 text-sm leading-relaxed">
                    {idx + 1}. {action}
                  </Text>
                ))}
              </View>

              <View className="flex-row items-center justify-between bg-zinc-900 rounded-xl px-4 py-3">
                <Text className="text-zinc-400 text-sm">AI Confidence</Text>
                <Text className="text-white font-semibold">
                  {Math.round(analysis.confidence_score * 100)}%
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-6 pb-10 gap-y-3">
          <Pressable onPress={onRetry} className="bg-zinc-800 active:bg-zinc-700 rounded-2xl py-4 items-center">
            <Text className="text-white font-semibold">Inspect Another</Text>
          </Pressable>
          <Pressable onPress={onClose} className="items-center py-3">
            <Text className="text-zinc-500 text-sm">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
