import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { listingsApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [listing, setListing] = useState<{
    title: string;
    description: string;
    location: string;
    address: string;
    priceUGX: string | number;
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    landlord?: { fullName: string };
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await listingsApi.one(String(id));
        if (!c) setListing(data as never);
      } catch {
        if (!c) setErr('Could not load listing.');
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1B4332" />
      </View>
    );
  }

  if (err || !listing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.err}>{err || 'Not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.meta}>
        {listing.location} · {listing.address}
      </Text>
      <Text style={styles.price}>
        UGX {Number(listing.priceUGX).toLocaleString()} / mo
      </Text>
      <Text style={styles.body}>{listing.description}</Text>
      <Text style={styles.meta}>
        {listing.propertyType} · {listing.bedrooms ?? 0} bed ·{' '}
        {listing.bathrooms ?? 0} bath
      </Text>
      {listing.landlord ? (
        <Text style={styles.meta}>Listed by {listing.landlord.fullName}</Text>
      ) : null}

      {(role === 'tenant' || role === 'agent') && id ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.push(
              `/(tabs)/payments?listingId=${encodeURIComponent(String(id))}` as never,
            )
          }
        >
          <Text style={styles.btnText}>Pay rent (initiate)</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  inner: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 },
  meta: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  price: { fontSize: 20, fontWeight: '800', color: '#1B4332', marginVertical: 12 },
  body: { fontSize: 15, color: '#374151', lineHeight: 24, marginTop: 8 },
  err: { color: '#B91C1C' },
  btn: {
    marginTop: 24,
    backgroundColor: '#1B4332',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
