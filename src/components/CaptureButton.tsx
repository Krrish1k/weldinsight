import { Pressable, View } from 'react-native';

interface CaptureButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export default function CaptureButton({ onPress, disabled }: CaptureButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.7 : 1 })}
    >
      <View className="w-20 h-20 rounded-full border-4 border-white items-center justify-center">
        <View className="w-14 h-14 rounded-full bg-white" />
      </View>
    </Pressable>
  );
}
