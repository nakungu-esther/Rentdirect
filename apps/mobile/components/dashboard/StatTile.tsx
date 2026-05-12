import { Text, View } from 'react-native';

export type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  /** Short trend text, e.g. "+12% vs last month" */
  delta?: string;
  deltaPositive?: boolean;
};

export function StatTile({ label, value, hint, delta, deltaPositive = true }: StatTileProps) {
  return (
    <View className="min-w-[44%] flex-1 rounded-2xl border border-white/[0.1] bg-white/[0.05] p-4">
      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</Text>
      <Text className="mt-2 text-2xl font-bold tracking-tight text-white" numberOfLines={1}>
        {value}
      </Text>
      {hint ? (
        <Text className="mt-1 text-xs leading-4 text-slate-500" numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
      {delta ? (
        <Text
          className={`mt-2 text-xs font-semibold ${deltaPositive ? 'text-[#34D399]' : 'text-amber-400'}`}
        >
          {delta}
        </Text>
      ) : null}
    </View>
  );
}
