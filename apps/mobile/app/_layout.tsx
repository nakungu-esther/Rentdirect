import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);

  useEffect(() => {
    void loadStoredAuth();
  }, [loadStoredAuth]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="listing/[id]"
          options={{ headerShown: true, title: 'Listing' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
