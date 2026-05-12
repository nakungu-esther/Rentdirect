import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AccountRole } from './role-definitions';

type RoleCardProps = {
  role: AccountRole;
  title: string;
  headline: string;
  description: string;
  icon: 'home' | 'business' | 'people';
  selected: boolean;
  onSelect: (role: AccountRole) => void;
};

export function RoleCard({
  role,
  title,
  headline,
  description,
  icon,
  selected,
  onSelect,
}: RoleCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: selected ? 1.018 : 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: selected ? 1 : 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selected, scale, glow]);

  return (
    <Pressable
      onPress={() => onSelect(role)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      android_ripple={{ color: 'rgba(16, 185, 129, 0.22)', foreground: true }}
      className="mb-3 w-full max-w-lg self-center"
    >
      <Animated.View
        style={{
          transform: [{ scale }],
        }}
        className={`w-full overflow-hidden rounded-3xl border px-5 py-5 ${
          selected
            ? 'border-emerald-400/90 bg-white/[0.12]'
            : 'border-white/[0.12] bg-white/[0.05]'
        }`}
      >
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 rounded-3xl bg-emerald-500/15"
          style={{ opacity: glow }}
        />
        <View className="flex-row items-start gap-4">
          <View
            className={`h-14 w-14 items-center justify-center rounded-2xl border ${
              selected
                ? 'border-emerald-400/50 bg-emerald-500/25'
                : 'border-white/10 bg-white/10'
            }`}
          >
            <Ionicons name={icon} size={28} color={selected ? '#6ee7b7' : '#cbd5e1'} />
          </View>
          <View className="min-w-0 flex-1">
            <View className="mb-1 flex-row flex-wrap items-center gap-2">
              <Text className="text-lg font-extrabold tracking-tight text-white">{title}</Text>
              {selected ? (
                <View className="rounded-full bg-emerald-500/25 px-2.5 py-0.5">
                  <Text className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                    Selected
                  </Text>
                </View>
              ) : null}
            </View>
            <Text className="text-sm font-semibold text-emerald-400/95">{headline}</Text>
            <Text className="mt-2 text-sm leading-5 text-slate-400">{description}</Text>
          </View>
          <Ionicons
            name={selected ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={selected ? '#34d399' : 'rgba(148,163,184,0.45)'}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}
