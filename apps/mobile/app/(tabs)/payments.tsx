import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { paymentsApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type PayRow = {
  id: string;
  amountUGX: string | number;
  status: string;
  provider: string;
  listing?: { title: string };
};

export default function PaymentsScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const params = useLocalSearchParams<{ listingId?: string }>();
  const [rows, setRows] = useState<PayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingId, setListingId] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await paymentsApi.mine();
      setRows((data as PayRow[]) ?? []);
    } catch {
      Alert.alert('Error', 'Could not load payments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (params.listingId) {
      setListingId(String(params.listingId));
    }
  }, [params.listingId]);

  const initiate = async () => {
    setBusy(true);
    try {
      await paymentsApi.initiate({
        listingId: listingId.trim(),
        amountUGX: Number(amount),
        provider: 'mtn_momo',
        phoneNumber: phone.trim(),
      });
      setAmount('');
      setPhone('');
      Alert.alert('OK', 'Payment initiated (pending provider).');
      void load();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: unknown } } })?.response?.data
          ?.message ?? 'Failed';
      Alert.alert(
        'Error',
        Array.isArray(msg) ? msg.join('\n') : String(msg),
      );
    } finally {
      setBusy(false);
    }
  };

  if (role !== 'tenant' && role !== 'agent') {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Payments are available for tenants and agents.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.h1}>Payments</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Listing ID</Text>
        <TextInput
          style={styles.input}
          value={listingId}
          onChangeText={setListingId}
          placeholder="UUID"
        />
        <Text style={styles.label}>Amount (UGX)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          placeholder="800000"
        />
        <Text style={styles.label}>Phone (+256XXXXXXXXX)</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+256700123456"
        />
        <TouchableOpacity
          style={[styles.btn, busy && styles.btnDis]}
          disabled={busy}
          onPress={() => void initiate()}
        >
          <Text style={styles.btnText}>{busy ? '…' : 'Initiate MTN MoMo'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sub}>History</Text>
      {rows.length === 0 ? (
        <Text style={styles.muted}>No payments yet.</Text>
      ) : (
        rows.map((p) => (
          <View key={p.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{p.listing?.title ?? 'Listing'}</Text>
              <Text style={styles.muted}>
                {p.provider} · {p.status}
              </Text>
            </View>
            <Text style={styles.price}>
              UGX {Number(p.amountUGX).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  inner: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  h1: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12 },
  sub: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: { fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    fontSize: 15,
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#1B4332',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDis: { opacity: 0.7 },
  btnText: { color: '#fff', fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 15, fontWeight: '700', color: '#111827' },
  muted: { fontSize: 13, color: '#6B7280' },
  price: { fontWeight: '800', color: '#1B4332' },
});
