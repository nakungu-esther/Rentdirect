import { Text, View } from 'react-native';

type MiniBarChartProps = {
  title: string;
  /** Relative heights 0–1 per bar */
  values: number[];
  /** Short labels under bars */
  labels: string[];
  subtitle?: string;
};

export function MiniBarChart({ title, values, labels, subtitle }: MiniBarChartProps) {
  const max = Math.max(0.01, ...values);
  return (
    <View>
      <Text className="text-base font-bold text-white">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text>
      ) : null}
      <View className="mt-4 h-28 flex-row items-end justify-between gap-1.5">
        {values.map((v, i) => {
          const heightPx = Math.max(6, Math.round((v / max) * 96));
          return (
            <View key={i} className="flex-1 items-center justify-end">
              <View
                className="w-[55%] max-w-[14px] rounded-t-md bg-[#10B981]/90"
                style={{ height: heightPx }}
              />
            </View>
          );
        })}
      </View>
      <View className="mt-2 flex-row justify-between gap-1">
        {labels.map((lab, i) => (
          <Text
            key={i}
            className="flex-1 text-center text-[10px] font-medium text-slate-500"
            numberOfLines={1}
          >
            {lab}
          </Text>
        ))}
      </View>
    </View>
  );
}
