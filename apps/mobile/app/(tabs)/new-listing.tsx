import { Linking, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/dashboard/GlassCard';
import { WEB_APP_ORIGIN } from '../../constants/config';

export default function NewListingScreen() {
  const insets = useSafeAreaInsets();
  const webNewListing = `${WEB_APP_ORIGIN.replace(/\/$/, '')}/landlord/listings/new`;

  return (
    <View className="flex-1 bg-[#0B1B3A]" style={{ paddingTop: 8, paddingBottom: insets.bottom + 16 }}>
      <View className="px-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-[#34D399]">
          RentDirect UG
        </Text>
        <Text className="mt-2 text-2xl font-extrabold text-white">Publish a listing</Text>
        <Text className="mt-2 text-sm leading-5 text-slate-400">
          The full landlord publishing flow (media, compliance fields, pricing) is optimized on web.
          Start there, then manage inventory from this app.
        </Text>

        <GlassCard className="mt-6">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/20">
              <Ionicons name="globe-outline" size={26} color="#34D399" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">Web console</Text>
              <Text className="mt-1 text-xs leading-5 text-slate-400">
                Opens your default browser to the guided listing wizard.
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => void Linking.openURL(webNewListing)}
            className="mt-5 items-center rounded-2xl bg-[#10B981] py-3.5 active:opacity-90"
          >
            <Text className="text-base font-bold text-[#0B1B3A]">Open listing wizard</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/my-listings')}
            className="mt-3 items-center py-3"
          >
            <Text className="text-sm font-semibold text-[#34D399]">View my listings instead</Text>
          </Pressable>
        </GlassCard>

        <Text className="mt-6 text-center text-[11px] leading-4 text-slate-600">
          Tip: set EXPO_PUBLIC_WEB_APP_URL in .env if the link should not use localhost.
        </Text>
      </View>
    </View>
  );
}
