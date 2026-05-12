import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { contractsApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type CRow = {
  id: string;
  title: string;
  status: string;
  listing?: { title: string };
};

export default function ContractsScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const [rows, setRows] = useState<CRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await contractsApi.mineTenant();
      setRows((data as CRow[]) ?? []);
    } catch {
      Alert.alert('Error', 'Could not load contracts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sign = async (id: string) => {
    setBusy(id);
    try {
      await contractsApi.sign(id);
      Alert.alert('Signed', 'Contract marked as signed.');
      void load();
    } catch {
      Alert.alert('Error', 'Could not sign.');
    } finally {
      setBusy(null);
    }
  };

  if (role !== 'tenant' && role !== 'agent') {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Contracts for tenants are listed here.</Text>
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
      <Text style={styles.h1}>My contracts</Text>
      {rows.length === 0 ? (
        <Text style={styles.muted}>No contracts yet.</Text>
      ) : (
        rows.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.muted}>
              {c.listing?.title ?? 'Listing'} · {c.status}
            </Text>
            {c.status === 'draft' && role === 'tenant' ? (
              <TouchableOpacity
                style={[styles.btn, busy === c.id && styles.btnDis]}
                disabled={busy === c.id}
                onPress={() => void sign(c.id)}
              >
                <Text style={styles.btnText}>{busy === c.id ? '…' : 'Sign'}</Text>
              </TouchableOpacity>
            ) : null}
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
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 12, color: '#111827' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  muted: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  btn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#1B4332',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnDis: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700' },
});
