import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/dashboard/GlassCard';
import { MiniBarChart } from '../../components/dashboard/MiniBarChart';
import { SectionHeader } from '../../components/dashboard/SectionHeader';
import { StatTile } from '../../components/dashboard/StatTile';
import { contractsApi, listingsApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type ListingRow = {
  id: string;
  title: string;
  location?: string;
  priceUGX: string | number;
  status: string;
};

type ContractRow = {
  id: string;
  title?: string;
  status?: string;
  tenant?: { fullName?: string };
};

function norm(s: string) {
  return s.trim().toLowerCase();
}

function parsePrice(v: string | number) {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : 0;
}

function isRentedStatus(status: string) {
  const s = norm(status);
  return s.includes('rent') || s.includes('lease') || s.includes('occup');
}

function isActiveMarket(status: string) {
  const s = norm(status);
  return s === 'active' || s === 'published' || s === 'live';
}

function formatUGX(n: number) {
  if (!Number.isFinite(n) || n <= 0) return '—';
  return `UGX ${Math.round(n).toLocaleString('en-UG')}`;
}

export default function LandlordDashboardScreen() {
  const insets = useSafeAreaInsets();
  const role = useAuthStore((s) => s.user?.role);
  const fullName = useAuthStore((s) => s.user?.fullName);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [lr, cr] = await Promise.all([
        listingsApi.mine(),
        contractsApi.mineLandlord(),
      ]);
      setListings(Array.isArray(lr.data) ? (lr.data as ListingRow[]) : []);
      setContracts(Array.isArray(cr.data) ? (cr.data as ContractRow[]) : []);
    } catch {
      setListings([]);
      setContracts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = useMemo(() => {
    const total = listings.length;
    const active = listings.filter((l) => isActiveMarket(l.status)).length;
    const rented = listings.filter((l) => isRentedStatus(l.status)).length;
    const monthlyUGX = listings
      .filter((l) => isRentedStatus(l.status))
      .reduce((sum, l) => sum + parsePrice(l.priceUGX), 0);
    const occupancyPct = total > 0 ? Math.min(100, Math.round((rented / total) * 100)) : 0;
    const pendingContracts = contracts.filter((c) => {
      const s = norm(c.status ?? '');
      return s === 'draft' || s.includes('pending');
    }).length;
    return {
      total,
      active,
      rented,
      monthlyUGX,
      occupancyPct,
      pendingContracts,
    };
  }, [listings, contracts]);

  const chartValues = useMemo(() => {
    const base = Math.max(1, metrics.monthlyUGX / 7);
    const pattern = [0.82, 0.7, 0.9, 0.66, 0.93, 0.74, 0.88];
    return pattern.map((p) => p * base);
  }, [metrics.monthlyUGX]);

  const chartLabels = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days;
  }, []);

  const firstName = fullName?.split(/\s+/)[0] ?? 'there';

  if (role !== 'landlord') {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1B3A] px-8">
        <Text className="text-center text-base text-slate-400">
          This portfolio overview is available to landlord accounts only.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1B3A]">
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B1B3A]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load();
            }}
            tintColor="#34D399"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="flex-row items-start justify-between">
            <View className="max-w-[78%]">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-[#34D399]">
                RentDirect UG
              </Text>
              <Text className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                {firstName}, your portfolio
              </Text>
              <Text className="mt-2 text-sm leading-5 text-slate-400">
                Live performance, collections, and occupancy in one executive view.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Notifications"
              className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
              onPress={() =>
                Alert.alert(
                  'RentDirect',
                  'Push inbox is on the roadmap. Priority signals are mirrored in the Notifications section below.',
                  [{ text: 'OK' }],
                )
              }
            >
              <Ionicons name="notifications-outline" size={22} color="#E2E8F0" />
              <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#10B981]" />
            </Pressable>
          </View>

          <View className="mt-6 flex-row flex-wrap gap-3">
            <StatTile
              label="Monthly revenue"
              value={formatUGX(metrics.monthlyUGX)}
              hint="From listings marked as leased / occupied."
              delta={metrics.monthlyUGX > 0 ? 'Live from your listings' : 'Add leased units to populate'}
              deltaPositive
            />
            <StatTile
              label="Occupancy"
              value={`${metrics.occupancyPct}%`}
              hint="Leased or occupied units ÷ total listings."
              delta={metrics.total ? `${metrics.rented} of ${metrics.total} units` : 'No listings yet'}
              deltaPositive={metrics.occupancyPct >= 50}
            />
            <StatTile
              label="Pending rent"
              value={metrics.pendingContracts ? `${metrics.pendingContracts}` : '0'}
              hint="Contracts in draft or pending state (proxy for follow-ups)."
              delta="Reconcile in Contracts on web"
              deltaPositive={metrics.pendingContracts === 0}
            />
            <StatTile
              label="Active listings"
              value={`${metrics.active}`}
              hint="Published / live inventory."
              delta={`${metrics.total} total in portfolio`}
              deltaPositive
            />
          </View>

          <GlassCard className="mt-5">
            <MiniBarChart
              title="Cashflow pulse"
              subtitle="Seven-day rhythm scaled from current leased rent (illustrative)."
              values={chartValues}
              labels={chartLabels}
            />
          </GlassCard>

          <SectionHeader title="Tenant overview" actionLabel="Mine" onActionPress={() => router.push('/(tabs)/my-listings')} />
          <GlassCard className="py-4">
            {contracts.length === 0 ? (
              <Text className="text-sm text-slate-500">
                No contracts synced yet. When tenants sign, their leases appear here for a quick health
                check.
              </Text>
            ) : (
              contracts.slice(0, 4).map((c) => (
                <View
                  key={c.id}
                  className="mb-3 flex-row items-center justify-between border-b border-white/[0.06] pb-3 last:mb-0 last:border-b-0 last:pb-0"
                >
                  <View className="mr-3 flex-1">
                    <Text className="text-sm font-semibold text-white" numberOfLines={1}>
                      {c.tenant?.fullName ?? 'Tenant'}
                    </Text>
                    <Text className="text-xs text-slate-500" numberOfLines={1}>
                      {c.title ?? 'Lease'} · {c.status ?? 'status unknown'}
                    </Text>
                  </View>
                  <View className="max-w-[38%] rounded-full bg-white/10 px-2.5 py-1">
                    <Text
                      className="text-[10px] font-bold uppercase tracking-wide text-slate-300"
                      numberOfLines={1}
                    >
                      {(c.status ?? '—').replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </GlassCard>

          <SectionHeader title="Notifications" />
          <GlassCard className="py-4">
            {[
              {
                icon: 'cash-outline' as const,
                title: 'Collections',
                body:
                  metrics.monthlyUGX > 0
                    ? `Approx. ${formatUGX(metrics.monthlyUGX)} / mo from leased units.`
                    : 'No leased rent detected yet — publish and lease units to populate.',
                time: 'Live',
              },
              {
                icon: 'document-text-outline' as const,
                title: 'Agreements',
                body:
                  metrics.pendingContracts > 0
                    ? `${metrics.pendingContracts} contract(s) need attention (draft / pending).`
                    : 'No pending contract states from the API.',
                time: 'Today',
              },
              {
                icon: 'home-outline' as const,
                title: 'Inventory',
                body: `${metrics.active} active listings · ${metrics.total} total.`,
                time: 'Portfolio',
              },
            ].map((n, idx) => (
              <View
                key={idx}
                className="mb-4 flex-row gap-3 last:mb-0"
              >
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/12">
                  <Ionicons name={n.icon} size={20} color="#34D399" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-white">{n.title}</Text>
                    <Text className="text-[10px] font-medium text-slate-500">{n.time}</Text>
                  </View>
                  <Text className="mt-1 text-xs leading-5 text-slate-400">{n.body}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          <SectionHeader title="Quick actions" />
          <View className="flex-row flex-wrap gap-3">
            {(
              [
                {
                  label: 'New listing',
                  icon: 'add-circle-outline' as const,
                  onPress: () => router.push('/(tabs)/new-listing'),
                },
                {
                  label: 'My listings',
                  icon: 'layers-outline' as const,
                  onPress: () => router.push('/(tabs)/my-listings'),
                },
                {
                  label: 'Browse market',
                  icon: 'search-outline' as const,
                  onPress: () => router.push('/(tabs)/listings'),
                },
                {
                  label: 'Account',
                  icon: 'person-circle-outline' as const,
                  onPress: () => router.push('/(tabs)/index'),
                },
              ] as const
            ).map((a) => (
              <Pressable
                key={a.label}
                onPress={a.onPress}
                className="min-w-[47%] flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 active:opacity-90"
              >
                <Ionicons name={a.icon} size={22} color="#34D399" />
                <Text className="mt-2 text-sm font-bold text-white">{a.label}</Text>
                <Text className="mt-1 text-[11px] text-slate-500">One tap</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable
        accessibilityLabel="Create new listing"
        onPress={() => router.push('/(tabs)/new-listing')}
        className="absolute items-center justify-center rounded-full bg-[#10B981] shadow-lg shadow-black/40"
        style={{
          height: 58,
          width: 58,
          right: 22,
          bottom: insets.bottom + 62,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#0B1B3A" />
      </Pressable>
    </View>
  );
}
