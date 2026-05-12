import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/dashboard/GlassCard';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

function Row({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 border-b border-white/[0.06] py-3.5 last:border-b-0 active:opacity-85"
    >
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
        <Ionicons name={icon} size={20} color="#E2E8F0" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">{label}</Text>
        {sub ? <Text className="mt-0.5 text-xs text-slate-500">{sub}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#475569" />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const initial = (user?.fullName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();

  return (
    <View className="flex-1 bg-[#0B1B3A]">
      <View
        className="flex-row items-center border-b border-white/[0.06] px-4 pb-3"
        style={{ paddingTop: insets.top + 6 }}
      >
        <Pressable
          accessibilityLabel="Back to home"
          hitSlop={12}
          onPress={() => router.replace('/(tabs)/index')}
          className="mr-2 h-10 w-10 items-center justify-center rounded-xl bg-white/5"
        >
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </Pressable>
        <Text className="text-xl font-bold text-white">Profile</Text>
      </View>
      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-[#10B981]">
            <Text className="text-4xl font-black text-[#0B1B3A]">{initial}</Text>
          </View>
          <View className="mt-3 flex-row items-center gap-2">
            <Text className="text-xl font-bold text-white">{user?.fullName ?? 'Member'}</Text>
            <View className="flex-row items-center gap-1 rounded-full bg-[#10B981]/20 px-2 py-0.5">
              <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
              <Text className="text-[10px] font-bold uppercase tracking-wide text-[#A7F3D0]">
                Verified
              </Text>
            </View>
          </View>
          <Text className="mt-1 text-sm text-slate-500">{user?.phone ?? user?.email ?? ''}</Text>
          <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-600">
            {user?.role ?? 'tenant'}
          </Text>
        </View>

        <GlassCard className="mt-8 py-2">
          <Row icon="wallet-outline" label="Wallet & rails" sub="MoMo, cards, Sui receipts" />
          <Row icon="time-outline" label="Rental history" sub="Past and active leases" />
          <Row icon="heart-outline" label="Saved properties" sub="Synced across devices" />
        </GlassCard>

        <GlassCard className="mt-4 py-2">
          <Row icon="settings-outline" label="Settings" sub="Security, notifications, API keys" />
          <Row icon="help-circle-outline" label="Support" sub="Concierge and dispute desk" />
        </GlassCard>

        <Pressable
          onPress={logout}
          className="mt-8 items-center rounded-2xl border border-rose-500/30 py-4 active:opacity-90"
        >
          <Text className="font-bold text-rose-400">Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
