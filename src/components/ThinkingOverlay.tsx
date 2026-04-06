import Animated from 'react-native-reanimated';
import { View, Text } from 'react-native';
import { useThinkingAnimation } from '../hooks/useThinkingAnimation';
import { OVERLAY_BACKDROP_OPACITY } from '../constants/ui';

export default function ThinkingOverlay({ visible }: { visible: boolean }) {
  const { animatedStyle } = useThinkingAnimation(visible);
  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center"
      style={{ backgroundColor: `rgba(0,0,0,${OVERLAY_BACKDROP_OPACITY})` }}
    >
      <Animated.View style={animatedStyle} className="items-center gap-y-3">
        <View className="w-12 h-12 rounded-full border-2 border-green-400 border-t-transparent" />
        <Text className="text-white text-lg font-semibold tracking-wide">Thinking...</Text>
        <Text className="text-zinc-400 text-sm">Analyzing weld quality</Text>
      </Animated.View>
    </View>
  );
}
