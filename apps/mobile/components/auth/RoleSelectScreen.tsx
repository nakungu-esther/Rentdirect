import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getOnboardingComplete } from '../../lib/onboarding';
import { RoleCard } from './RoleCard';
import {
  ROLE_DEFINITIONS,
  type AccountRole,
  isAccountRole,
} from './role-definitions';

export function RoleSelectScreen() {
  const params = useLocalSearchParams<{ role?: string | string[] }>();
  const initial = useMemo(() => {
    const raw = params.role;
    const r =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
    return isAccountRole(r) ? r : 'tenant';
  }, [params.role]);

  const [selected, setSelected] = useState<AccountRole>(initial);

  useEffect(() => {
    const raw = params.role;
    const r =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
    if (isAccountRole(r)) setSelected(r);
  }, [params.role]);

  useEffect(() => {
    let cancelled = false;
    void getOnboardingComplete().then((done) => {
      if (!cancelled && !done) router.replace('/(auth)/onboarding');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const continueToRegister = useCallback(() => {
    router.push({
      pathname: '/(auth)/register',
      params: { role: selected },
    });
  }, [selected]);

  return (
    <SafeAreaView
      className="flex-1 bg-[#0B1B3A]"
      edges={['top', 'bottom', 'left', 'right']}
      style={{ backgroundColor: '#0B1B3A' }}
    >
      <StatusBar style="light" />
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 top-0 h-44 opacity-90"
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)' }}
      />

      <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(auth)/login')
          }
          hitSlop={12}
          className="flex-row items-center gap-1 rounded-full py-2 pr-3 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color="#94a3b8" />
          <Text className="text-sm font-semibold text-slate-400">Back</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-center text-xs font-bold uppercase tracking-[0.25em] text-emerald-400/90">
          RentDirect UG
        </Text>
        <Text className="mt-2 text-center text-3xl font-extrabold tracking-tight text-white">
          Choose your role
        </Text>
        <Text className="mx-auto mt-2 max-w-sm text-center text-sm leading-5 text-slate-400">
          Select the profile that matches how you use the platform. You can revisit this before
          signing up.
        </Text>

        <View className="mt-8">
          {ROLE_DEFINITIONS.map((def) => (
            <RoleCard
              key={def.role}
              role={def.role}
              title={def.title}
              headline={def.headline}
              description={def.description}
              icon={def.icon}
              selected={selected === def.role}
              onSelect={setSelected}
            />
          ))}
        </View>
      </ScrollView>

      <View className="border-t border-white/10 bg-white/[0.07] px-5 pb-2 pt-4">
        <Pressable
          onPress={continueToRegister}
          className="mb-3 h-14 items-center justify-center rounded-2xl bg-emerald-500 active:opacity-90"
          accessibilityRole="button"
        >
          <Text className="text-base font-bold text-[#0B1B3A]">Continue to sign up</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/(auth)/login')}
          className="py-2 active:opacity-80"
          accessibilityRole="button"
        >
          <Text className="text-center text-sm font-semibold text-slate-400">
            Already have an account? <Text className="text-emerald-400">Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
