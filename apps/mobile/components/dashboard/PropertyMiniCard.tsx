import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type PropertyMiniCardProps = {
  title: string;
  location: string;
  priceUGX: string | number;
  propertyType: string;
  bedrooms?: number;
  onPress: () => void;
  /** Optional corner label e.g. "AI pick" */
  badge?: string;
  className?: string;
};

function formatPrice(v: string | number) {
  const n = typeof v === 'string' ? Number(v) : v;
  if (!Number.isFinite(n)) return '—';
  return `UGX ${Math.round(n).toLocaleString('en-UG')}`;
}

function PropertyMiniCardInner({
  title,
  location,
  priceUGX,
  propertyType,
  bedrooms,
  onPress,
  badge,
  className = '',
}: PropertyMiniCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.06] active:opacity-90 ${className}`}
    >
      {badge ? (
        <View className="absolute right-3 top-3 z-10 rounded-full bg-[#10B981]/25 px-2.5 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-[#A7F3D0]">
            {badge}
          </Text>
        </View>
      ) : null}
      <View className="aspect-[4/3] w-full bg-[#0F2744]">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="image-outline" size={36} color="rgba(148,163,184,0.35)" />
        </View>
      </View>
      <View className="p-3.5">
        <Text className="text-sm font-bold text-white" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-1 text-xs text-slate-500" numberOfLines={1}>
          {location}
        </Text>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-sm font-extrabold text-[#34D399]">
            {formatPrice(priceUGX)}
            <Text className="text-[10px] font-semibold text-slate-500"> /mo</Text>
          </Text>
          <Text className="max-w-[45%] text-right text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {propertyType}
            {bedrooms != null ? ` · ${bedrooms} bd` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export const PropertyMiniCard = memo(PropertyMiniCardInner);
