import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { listingsApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type Row = {
  id: string;
  title: string;
  location: string;
  priceUGX: string | number;
  status: string;
};

export default function MyListingsScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await listingsApi.mine();
      setRows((data as Row[]) ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
      setRef(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (role !== 'landlord') {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Only landlords see their own listings here.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.head}>My listings</Text>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={ref} onRefresh={() => { setRef(true); void load(); }} />
        }
        ListEmptyComponent={
          <Text style={styles.muted}>You have no listings yet. Use the web app to publish in full, or POST /listings from API tools.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/listing/${item.id}`)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>
              {item.location} · {item.status}
            </Text>
            <Text style={styles.price}>
              UGX {Number(item.priceUGX).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  head: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  muted: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  price: { marginTop: 8, fontSize: 15, fontWeight: '800', color: '#1B4332' },
});
