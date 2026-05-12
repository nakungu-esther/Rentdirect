import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/config';

function unwrapBody(payload: unknown): unknown {
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as { success: boolean }).success === true &&
    'data' in payload
  ) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use((response) => {
  if (response.data !== undefined) {
    response.data = unwrapBody(response.data);
  }
  return response;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const userId = await SecureStore.getItemAsync('userId');

        if (!refreshToken || !userId) {
          await clearTokens();
          return Promise.reject(error);
        }

        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
          userId,
        });
        const body = unwrapBody(res.data) as {
          accessToken: string;
          refreshToken: string;
        };

        await SecureStore.setItemAsync('accessToken', body.accessToken);
        await SecureStore.setItemAsync('refreshToken', body.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${body.accessToken}`;
        return api(originalRequest);
      } catch {
        await clearTokens();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

async function clearTokens() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('userId');
}

export const authApi = {
  register: (data: {
    email: string;
    fullName: string;
    phone: string;
    password: string;
    role?: string;
  }) => api.post('/auth/register', data),

  login: (data: { phone?: string; email?: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me'),

  sendOtp: (phone: string) =>
    api.post<{ sent: boolean; debugOtp?: string }>('/auth/otp/send', { phone }),

  verifyOtp: (phone: string, code: string) =>
    api.post<{ verified: boolean }>('/auth/otp/verify', { phone, code }),
};

export type ListingsPage = {
  data: Array<{
    id: string;
    title: string;
    location: string;
    priceUGX: string | number;
    propertyType: string;
    bedrooms?: number;
  }>;
  total: number;
  page: number;
  pages: number;
};

export const listingsApi = {
  browse: (params?: { page?: number; limit?: number }) =>
    api.get<ListingsPage>('/listings', { params }),
  mine: () => api.get('/listings/mine'),
  one: (id: string) => api.get(`/listings/${id}`),
  create: (body: Record<string, unknown>) => api.post('/listings', body),
};

export const paymentsApi = {
  mine: () => api.get('/payments/my'),
  initiate: (body: {
    listingId: string;
    amountUGX: number;
    provider: string;
    phoneNumber: string;
  }) => api.post('/payments/initiate', body),
  stubComplete: (id: string) => api.post(`/payments/${id}/stub-complete`),
};

export const contractsApi = {
  mineTenant: () => api.get('/contracts/mine/tenant'),
  mineLandlord: () => api.get('/contracts/mine/landlord'),
  create: (body: {
    listingId: string;
    tenantId: string;
    title: string;
    body?: string;
  }) => api.post('/contracts', body),
  sign: (id: string) => api.post(`/contracts/${id}/sign`),
};

export default api;
