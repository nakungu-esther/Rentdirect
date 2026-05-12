import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { router } from 'expo-router';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth } = useAuthStore();

  const login = async (phone: string, password: string) => {
    const { data } = await authApi.login({ phone, password });
    await setAuth(data.user, data.accessToken, data.refreshToken);
    router.replace('/(tabs)');
    return data;
  };

  const register = async (payload: {
    email: string;
    fullName: string;
    phone: string;
    password: string;
    role?: 'tenant' | 'landlord' | 'agent';
  }) => {
    const { data } = await authApi.register(payload);
    await setAuth(data.user, data.accessToken, data.refreshToken);
    router.replace('/(tabs)');
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Still clear locally even if backend fails
    }
    await clearAuth();
    router.replace('/(auth)/login');
  };

  return { user, isAuthenticated, isLoading, login, register, logout };
}