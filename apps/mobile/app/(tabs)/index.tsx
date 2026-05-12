import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { TenantHomeDashboard } from '../../components/dashboard/TenantHomeDashboard';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const role = user?.role;
  const isLandlord = role === 'landlord';
  const isOps = role === 'admin' || role === 'government';

  if (isLandlord) {
    return (
      <View className="flex-1 justify-center bg-[#0B1B3A] px-8">
        <Text className="text-center text-2xl font-extrabold text-white">Portfolio home</Text>
        <Text className="mt-3 text-center text-sm leading-6 text-slate-400">
          Your executive overview lives on the Overview tab. Open it for revenue, occupancy, and
          tenant signals.
        </Text>
        <TouchableOpacity
          className="mt-8 items-center rounded-2xl bg-[#10B981] py-4 active:opacity-90"
          onPress={() => router.replace('/(tabs)/dashboard')}
        >
          <Text className="text-base font-bold text-[#0B1B3A]">Open overview</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isOps) {
    return (
      <View className="flex-1 bg-[#0B1B3A] px-6 pt-14">
        <Text className="text-2xl font-extrabold text-white">
          Hey, {user?.fullName?.split(' ')[0] ?? 'there'}
        </Text>
        <Text className="mt-2 text-sm text-slate-400">Operations account</Text>
        <View className="mt-8 rounded-3xl border border-[#10B981]/30 bg-white/[0.06] p-5">
          <Text className="text-base font-bold text-white">Web console</Text>
          <Text className="mt-2 text-sm leading-6 text-slate-400">
            Admin and government tools are optimized on the web app (same API). Open
            http://localhost:3000/admin or /government after signing in there with this account.
          </Text>
        </View>
        <TouchableOpacity
          className="mt-auto mb-10 items-center rounded-2xl border border-white/15 py-4"
          onPress={logout}
        >
          <Text className="font-semibold text-rose-400">Sign out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <TenantHomeDashboard />;
}
