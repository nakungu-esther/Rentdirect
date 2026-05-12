import { Platform } from 'react-native';

/**
 * Backend API base (no trailing slash).
 * Set EXPO_PUBLIC_API_URL in .env for physical devices (e.g. http://192.168.1.x:3001).
 * Android emulator maps 10.0.2.2 to host machine localhost.
 */
const defaultHost =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? defaultHost;

/** Web app origin for deep links (no trailing slash). */
export const WEB_APP_ORIGIN =
  process.env.EXPO_PUBLIC_WEB_APP_URL?.replace(/\/$/, '') ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');
