import { Pressable, Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between px-1">
      <Text className="text-sm font-bold uppercase tracking-wider text-slate-400">{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8} accessibilityRole="button">
          <Text className="text-xs font-semibold text-[#34D399]">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
