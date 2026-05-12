import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'agent' | 'admin' | 'government';
  isVerified: boolean;
  phoneVerified?: boolean;
  isActive?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  setUser: (user: User) => void;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,

  // Called after login/register
  setAuth: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('userId', user.id);
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
  },

  // Called on logout
  clearAuth: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userId');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Update user data without re-login
  setUser: (user) => set({ user }),

  // Called on app start — restore session from storage
  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      set({ accessToken: token });
      const { data: user } = await authApi.getMe();
      set({
        user: user as User,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      await get().clearAuth();
    }
  },
}));