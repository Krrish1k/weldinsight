import { View, Text } from 'react-native';

interface AnalysisCardProps {
  label: string;
  value: string;
}

export default function AnalysisCard({ label, value }: AnalysisCardProps) {
  return (
    <View className="bg-zinc-900 rounded-xl p-4 gap-y-1.5">
      <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
        {label}
      </Text>
      <Text className="text-white text-sm leading-relaxed">{value}</Text>
    </View>
  );
}
