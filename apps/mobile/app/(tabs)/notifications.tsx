import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/dashboard/GlassCard';

type Row = { id: string; title: string; body: string; time: string; icon: keyof typeof Ionicons.glyphMap };

const SECTIONS: { title: string; data: Row[] }[] = [
  {
    title: 'Payments',
    data: [
      {
        id: '1',
        title: 'Rent settlement',
        body: 'MoMo receipt matched — your last payment was reconciled to the escrow rail.',
        time: '2h',
        icon: 'cash-outline',
      },
      {
        id: '2',
        title: 'Sui wallet',
        body: 'Optional on-chain receipt is available for this period (demo ledger).',
        time: 'Yesterday',
        icon: 'logo-bitcoin',
      },
    ],
  },
  {
    title: 'Contracts',
    data: [
      {
        id: '3',
        title: 'Lease countersign',
        body: 'A landlord shared a draft agreement — review before Walrus archive.',
        time: 'Today',
        icon: 'document-text-outline',
      },
    ],
  },
  {
    title: 'System',
    data: [
      {
        id: '4',
        title: 'Verification',
        body: 'KYC refresh not required — profile remains in good standing.',
        time: 'Mon',
        icon: 'shield-checkmark-outline',
      },
    ],
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

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
        <Text className="text-xl font-bold text-white">Notifications</Text>
      </View>
      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Priority inbox
        </Text>
        {SECTIONS.map((section) => (
          <View key={section.title} className="mb-6">
            <Text className="mb-2 text-sm font-bold text-slate-300">{section.title}</Text>
            <GlassCard className="gap-0 py-2">
              {section.data.map((row, idx) => (
                <Pressable
                  key={row.id}
                  className={`flex-row gap-3 px-2 py-3 ${idx < section.data.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/12">
                    <Ionicons name={row.icon} size={20} color="#34D399" />
                  </View>
                  <View className="min-w-0 flex-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <Text className="text-sm font-semibold text-white">{row.title}</Text>
                      <Text className="text-[10px] font-medium text-slate-500">{row.time}</Text>
                    </View>
                    <Text className="mt-1 text-xs leading-5 text-slate-400">{row.body}</Text>
                  </View>
                </Pressable>
              ))}
            </GlassCard>
          </View>
        ))}
        <Text className="text-center text-[11px] text-slate-600">
          Swipe actions and server push will wire to your API. This layout mirrors production card
          hierarchy.
        </Text>
      </ScrollView>
    </View>
  );
}
