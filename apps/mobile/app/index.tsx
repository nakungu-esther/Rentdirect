import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { SplashScreen } from '../components/splash';
import { getOnboardingComplete } from '../lib/onboarding';
import { useAuthStore } from '../store/authStore';

const MIN_SPLASH_MS = 2200;

export default function Index() {
  const { isLoading, isAuthenticated, user } = useAuthStore();
  const [timerDone, setTimerDone] = useState(false);
  const [onboardingResolved, setOnboardingResolved] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const done = await getOnboardingComplete();
      if (!cancelled) {
        setOnboardingDone(done);
        setOnboardingResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!timerDone || isLoading || !onboardingResolved) {
    return <SplashScreen />;
  }

  if (isAuthenticated && user) {
    return <Redirect href="/(tabs)" />;
  }

  if (!onboardingDone) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
