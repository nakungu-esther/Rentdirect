import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/dashboard/GlassCard';
import { PropertyMiniCard } from '../../components/dashboard/PropertyMiniCard';
import { listingsApi, type ListingsPage } from '../../services/api';

type SortKey = 'newest' | 'price_asc' | 'price_desc';

function paramFirst(v: string | string[] | undefined): string {
  if (v == null) return '';
  return Array.isArray(v) ? (v[0] ?? '') : v;
}

export default function ListingsScreen() {
  const insets = useSafeAreaInsets();
  const { q: qParam } = useLocalSearchParams<{ q?: string }>();
  const initialQ = paramFirst(qParam);

  const [page, setPage] = useState<ListingsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(initialQ);
  const [sort, setSort] = useState<SortKey>('newest');
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    if (initialQ) setSearch(initialQ);
  }, [initialQ]);

  const load = useCallback(async () => {
    try {
      const { data } = await listingsApi.browse({ page: 1, limit: 60 });
      setPage(data);
      setError('');
    } catch {
      setError('Could not load listings. Is the API running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = page?.data ?? [];

  const filtered = useMemo(() => {
    let list = [...rows];
    const needle = search.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(needle) ||
          r.location.toLowerCase().includes(needle) ||
          r.propertyType.toLowerCase().includes(needle),
      );
    }
    if (sort === 'price_asc') {
      list.sort((a, b) => Number(a.priceUGX) - Number(b.priceUGX));
    } else if (sort === 'price_desc') {
      list.sort((a, b) => Number(b.priceUGX) - Number(a.priceUGX));
    }
    if (savedOnly) {
      list = [];
    }
    return list;
  }, [rows, search, sort, savedOnly]);

  if (loading && !page) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B1B3A]">
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B1B3A]">
      <View style={{ paddingTop: insets.top + 8 }} className="px-5 pb-2">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-[#34D399]">
          Discover
        </Text>
        <Text className="mt-1 text-2xl font-extrabold text-white">Property search</Text>
      </View>

      <View className="px-5 pb-3">
        <GlassCard className="flex-row items-center gap-3 py-3">
          <Ionicons name="search" size={22} color="#64748B" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search city, title, type…"
            placeholderTextColor="rgba(148,163,184,0.55)"
            className="flex-1 text-base text-white"
            returnKeyType="search"
          />
          {search ? (
            <Pressable hitSlop={8} onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={22} color="#64748B" />
            </Pressable>
          ) : null}
        </GlassCard>

        <ScrollChips
          sort={sort}
          onSort={setSort}
          savedOnly={savedOnly}
          onToggleSaved={() => setSavedOnly((s) => !s)}
        />

        <Pressable
          onPress={() =>
            Alert.alert(
              'Map preview',
              'Connect Mapbox or Google Maps for live pins, isochrones, and commute overlays.',
            )
          }
          className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0F2744] active:opacity-90"
        >
          <View className="h-[120px] items-center justify-center">
            <Ionicons name="map-outline" size={40} color="rgba(52,211,153,0.45)" />
            <Text className="mt-2 text-xs font-semibold text-slate-400">Map preview</Text>
            <Text className="mt-0.5 text-[10px] text-slate-600">Wire to Mapbox / Google Maps</Text>
          </View>
        </Pressable>
      </View>

      {error ? (
        <Text className="px-5 pb-2 text-sm text-rose-400">{error}</Text>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100 }}
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
        ListEmptyComponent={
          <GlassCard>
            <Text className="text-center text-sm text-slate-400">
              {savedOnly
                ? 'Saved listings sync when favorites API is connected.'
                : 'No listings match your filters.'}
            </Text>
          </GlassCard>
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <PropertyMiniCard
            title={item.title}
            location={item.location}
            priceUGX={item.priceUGX}
            propertyType={item.propertyType}
            bedrooms={item.bedrooms}
            onPress={() => router.push(`/listing/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

function ScrollChips({
  sort,
  onSort,
  savedOnly,
  onToggleSaved,
}: {
  sort: SortKey;
  onSort: (s: SortKey) => void;
  savedOnly: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      <Chip label="Sort: price ↑" active={sort === 'price_asc'} onPress={() => onSort('price_asc')} />
      <Chip label="Sort: price ↓" active={sort === 'price_desc'} onPress={() => onSort('price_desc')} />
      <Chip label="Newest" active={sort === 'newest'} onPress={() => onSort('newest')} />
      <Chip label="Saved" active={savedOnly} onPress={onToggleSaved} />
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3.5 py-2 ${
        active
          ? 'border-[#10B981]/50 bg-[#10B981]/20'
          : 'border-white/10 bg-white/[0.05]'
      }`}
    >
      <Text
        className={`text-xs font-bold ${active ? 'text-[#A7F3D0]' : 'text-slate-400'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
