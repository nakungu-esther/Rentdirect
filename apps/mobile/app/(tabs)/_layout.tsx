import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

export default function TabsLayout() {
  const role = useAuthStore((s) => s.user?.role);
  const tenantLike = role === 'tenant' || role === 'agent';
  const landlord = role === 'landlord';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#34D399',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: landlord ? '#0B1324' : '#0B1B3A',
          borderTopWidth: 1,
          borderTopColor: 'rgba(148,163,184,0.12)',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Overview',
          href: landlord ? undefined : null,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: landlord ? null : undefined,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Browse',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          href: tenantLike ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contracts"
        options={{
          title: 'Contracts',
          href: tenantLike ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-listings"
        options={{
          title: 'Mine',
          href: landlord ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-listing"
        options={{
          title: 'New listing',
          href: null,
          headerShown: true,
          headerStyle: { backgroundColor: '#0B1B3A' },
          headerTintColor: '#F8FAFC',
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
