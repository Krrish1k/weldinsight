import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-zinc-950">
      <StatusBar style="light" />
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-16 pb-10 gap-y-8">
        <View className="gap-y-1">
          <Text className="text-3xl font-bold text-white tracking-tight">WeldInsight Pro</Text>
          <Text className="text-zinc-400 text-base">AI-powered weld quality inspection</Text>
        </View>

        <View className="bg-zinc-900 rounded-2xl p-5 gap-y-2">
          <View className="flex-row items-center gap-x-2">
            <View className="w-3 h-3 rounded-full bg-green-500" />
            <Text className="text-green-400 font-semibold">System Ready</Text>
          </View>
          <Text className="text-zinc-500 text-sm">YOLOv8 Nano model loaded on device</Text>
        </View>

        <Pressable
          onPress={() => router.push('/camera')}
          className="bg-green-500 active:bg-green-600 rounded-2xl py-5 items-center"
        >
          <Text className="text-white font-semibold text-lg">Start Inspection</Text>
        </Pressable>

        <View className="bg-zinc-900 rounded-2xl p-5 gap-y-3">
          <Text className="text-white font-semibold text-base">How it works</Text>
          <Text className="text-zinc-400 text-sm leading-relaxed">
            1. Point the camera at a weld bead.{'\n'}
            2. The on-device YOLOv8 model detects the bead in real time.{'\n'}
            3. Tap Capture to send the crop to Gemma 4 CWI analysis.{'\n'}
            4. Review the PASS/FAIL report.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
