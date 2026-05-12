import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { PropertyMiniCard } from './PropertyMiniCard';
import { listingsApi, type ListingsPage } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useFadeUpEntrance } from '../../lib/animations';

function shuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function TenantHomeDashboard() {
  const insets = useSafeAreaInsets();
  const fullName = useAuthStore((s) => s.user?.fullName);
  const firstName = fullName?.split(/\s+/)[0] ?? 'there';

  const [page, setPage] = useState<ListingsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const heroStyle = useFadeUpEntrance(0, 480);
  const searchStyle = useFadeUpEntrance(70, 420);
  const featuredStyle = useFadeUpEntrance(120, 420);

  const load = useCallback(async () => {
    try {
      const { data } = await listingsApi.browse({ page: 1, limit: 24 });
      setPage(data);
    } catch {
      setPage({ data: [], total: 0, page: 1, pages: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const items = page?.data ?? [];

  const { featured, nearby, aiPicks } = useMemo(() => {
    const featuredSlice = items.slice(0, 5);
    const nearbySlice = items.slice(5, 9);
    const rest = items.slice(9);
    const aiSource = rest.length ? rest : items;
    const aiPicksShuffled = shuffle(aiSource, firstName).slice(0, 6);
    return {
      featured: featuredSlice,
      nearby: nearbySlice.length ? nearbySlice : items.slice(1, 5),
      aiPicks: aiPicksShuffled,
    };
  }, [items, firstName]);

  const openListing = useCallback((id: string) => {
    router.push(`/listing/${id}`);
  }, []);

  const submitSearch = useCallback(() => {
    const q = query.trim();
    if (q) {
      router.push({ pathname: '/(tabs)/listings', params: { q } });
    } else {
      router.push('/(tabs)/listings');
    }
  }, [query]);

  if (loading && !page) {
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
          paddingBottom: insets.bottom + 100,
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
        <View style={{ paddingTop: insets.top + 6 }}>
          <Animated.View style={heroStyle}>
            <View className="flex-row items-start justify-between">
              <View className="max-w-[76%]">
                <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-[#34D399]">
                  RentDirect UG
                </Text>
                <Text className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                  {firstName}, find your space
                </Text>
                <Text className="mt-2 text-sm leading-5 text-slate-400">
                  Curated inventory, verified counterparties, and settlement rails built for
                  East Africa.
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  accessibilityLabel="Open messages"
                  onPress={() => router.push('/(tabs)/chat')}
                  className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:opacity-80"
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#E2E8F0" />
                </Pressable>
                <Pressable
                  accessibilityLabel="Notifications"
                  onPress={() => router.push('/(tabs)/notifications')}
                  className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:opacity-80"
                >
                  <Ionicons name="notifications-outline" size={22} color="#E2E8F0" />
                  <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#10B981]" />
                </Pressable>
                <Pressable
                  accessibilityLabel="Profile"
                  onPress={() => router.push('/(tabs)/profile')}
                  className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:opacity-80"
                >
                  <Ionicons name="person-outline" size={21} color="#E2E8F0" />
                </Pressable>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={searchStyle} className="mt-6">
            <GlassCard className="flex-row items-center gap-3 py-3.5">
              <Ionicons name="search" size={22} color="#64748B" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Smart search — city, budget, beds…"
                placeholderTextColor="rgba(148,163,184,0.55)"
                returnKeyType="search"
                onSubmitEditing={submitSearch}
                className="native:text-base min-h-[40px] flex-1 text-base text-white"
                accessibilityLabel="Search listings"
              />
              <Pressable
                onPress={submitSearch}
                className="rounded-xl bg-[#10B981] px-4 py-2.5 active:opacity-90"
              >
                <Text className="text-xs font-bold uppercase tracking-wide text-[#0B1B3A]">
                  Go
                </Text>
              </Pressable>
            </GlassCard>
          </Animated.View>

          <Animated.View style={featuredStyle} className="mt-8">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-white">Featured</Text>
                <Text className="text-xs text-slate-500">Hand-picked from live inventory</Text>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/listings')} hitSlop={8}>
                <Text className="text-xs font-bold text-[#34D399]">See all</Text>
              </Pressable>
            </View>
            {featured.length === 0 ? (
              <GlassCard>
                <Text className="text-sm text-slate-400">
                  No listings yet. Pull to refresh or check that the API is running.
                </Text>
              </GlassCard>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14, paddingRight: 8 }}
              >
                {featured.map((p) => (
                  <PropertyMiniCard
                    key={p.id}
                    title={p.title}
                    location={p.location}
                    priceUGX={p.priceUGX}
                    propertyType={p.propertyType}
                    bedrooms={p.bedrooms}
                    onPress={() => openListing(p.id)}
                    className="w-[260px]"
                  />
                ))}
              </ScrollView>
            )}
          </Animated.View>

          <View className="mt-10">
            <View className="mb-3">
              <Text className="text-lg font-bold text-white">Nearby rentals</Text>
              <Text className="text-xs text-slate-500">Weighted by your last session context</Text>
            </View>
            <View className="gap-3">
              {nearby.slice(0, 3).map((p) => (
                <PropertyMiniCard
                  key={p.id}
                  title={p.title}
                  location={p.location}
                  priceUGX={p.priceUGX}
                  propertyType={p.propertyType}
                  bedrooms={p.bedrooms}
                  onPress={() => openListing(p.id)}
                />
              ))}
            </View>
          </View>

          <View className="mt-10">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-white">AI recommendations</Text>
                <Text className="text-xs text-slate-500">
                  Ranking blends price stability, verification, and liquidity
                </Text>
              </View>
              <View className="flex-row items-center gap-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-1">
                <Ionicons name="sparkles" size={12} color="#6EE7B7" />
                <Text className="text-[10px] font-bold uppercase tracking-wide text-[#A7F3D0]">
                  Beta
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingRight: 8 }}
            >
              {aiPicks.map((p) => (
                <PropertyMiniCard
                  key={`ai-${p.id}`}
                  title={p.title}
                  location={p.location}
                  priceUGX={p.priceUGX}
                  propertyType={p.propertyType}
                  bedrooms={p.bedrooms}
                  badge="AI pick"
                  onPress={() => openListing(p.id)}
                  className="w-[248px]"
                />
              ))}
            </ScrollView>
          </View>

          <View className="mt-10">
            <Text className="mb-3 text-lg font-bold text-white">Shortcuts</Text>
            <View className="flex-row flex-wrap gap-3">
              {(
                [
                  { label: 'Payments', icon: 'card-outline' as const, href: '/(tabs)/payments' },
                  { label: 'Contracts', icon: 'document-text-outline' as const, href: '/(tabs)/contracts' },
                  { label: 'Browse all', icon: 'grid-outline' as const, href: '/(tabs)/listings' },
                ] as const
              ).map((s) => (
                <Pressable
                  key={s.label}
                  onPress={() => router.push(s.href)}
                  className="min-w-[30%] flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 active:opacity-90"
                >
                  <Ionicons name={s.icon} size={22} color="#34D399" />
                  <Text className="mt-2 text-sm font-bold text-white">{s.label}</Text>
                  <Text className="mt-1 text-[10px] text-slate-500">One tap</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
