import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { THINKING_ANIMATION_DURATION } from '../constants/ui';

export function useThinkingAnimation(active: boolean) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: THINKING_ANIMATION_DURATION }),
          withTiming(0.3, { duration: THINKING_ANIMATION_DURATION }),
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle };
}
