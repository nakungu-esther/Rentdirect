import * as SecureStore from 'expo-secure-store';

const KEY = 'rd_onboarding_complete';

export async function getOnboardingComplete(): Promise<boolean> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    return v === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  await SecureStore.setItemAsync(KEY, 'true');
}
