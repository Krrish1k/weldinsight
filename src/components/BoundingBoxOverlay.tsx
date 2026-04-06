import { StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';
import { BoundingBox } from '../types';
import { BBOX_COLOR, BBOX_STROKE_WIDTH } from '../constants/ui';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface Props {
  detectionSharedValue: SharedValue<BoundingBox | null>;
  frameWidth: number;
  frameHeight: number;
}

export default function BoundingBoxOverlay({ detectionSharedValue, frameWidth, frameHeight }: Props) {
  const animatedProps = useAnimatedProps(() => {
    const box = detectionSharedValue.value;
    if (!box) return { x: 0, y: 0, width: 0, height: 0, opacity: 0 };
    return {
      x: box.x * frameWidth,
      y: box.y * frameHeight,
      width: box.w * frameWidth,
      height: box.h * frameHeight,
      opacity: 1,
    };
  });

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <AnimatedRect
        animatedProps={animatedProps}
        stroke={BBOX_COLOR}
        strokeWidth={BBOX_STROKE_WIDTH}
        fill="transparent"
        rx={4}
        ry={4}
      />
    </Svg>
  );
}
