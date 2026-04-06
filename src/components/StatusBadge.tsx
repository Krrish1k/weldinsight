import { View, Text } from 'react-native';
import { WeldVerdict } from '../types';

export default function StatusBadge({ verdict }: { verdict: WeldVerdict }) {
  const isPass = verdict === 'PASS';
  return (
    <View className={`px-4 py-1.5 rounded-full ${isPass ? 'bg-green-500' : 'bg-red-500'}`}>
      <Text className="text-white font-bold text-sm tracking-widest">{verdict}</Text>
    </View>
  );
}
