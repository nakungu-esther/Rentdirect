import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getOnboardingComplete } from '../../lib/onboarding';

const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{9,15}$/, 'Enter a valid phone number (e.g. +256700123456)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getOnboardingComplete().then((done) => {
      if (!cancelled && !done) router.replace('/(auth)/onboarding');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const cardAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 480,
      useNativeDriver: true,
    }).start();
  }, [cardAnim]);

  const translateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const phoneWatch = useWatch({ control, name: 'phone', defaultValue: '' });

  const onSubmit = async (data: LoginForm) => {
    setSubmitError('');
    setSubmitting(true);
    try {
      await login(data.phone, data.password);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: unknown } }; message?: string };
      const raw = ax?.response?.data?.message ?? ax?.message ?? 'Login failed. Check your credentials.';
      const msg = Array.isArray(raw) ? raw.join('\n') : String(raw);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const biometricLogin = () => {
    Alert.alert(
      'Biometric sign-in',
      'Face ID / Touch ID will unlock the app once device credentials are enrolled. Coming in the next release.',
    );
  };

  const forgotPassword = () => {
    Alert.alert(
      'Reset password',
      'We will send a secure reset link to your verified phone or email. This flow is not wired yet — contact support or use the web console.',
    );
  };

  const socialLogin = (provider: 'Google' | 'Apple') => {
    Alert.alert(
      `${provider} sign-in`,
      'OAuth with RentDirect is on the roadmap. Use phone and password for now.',
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#0B1B3A]"
      edges={['top', 'bottom', 'left', 'right']}
      style={{ backgroundColor: '#0B1B3A' }}
    >
      <StatusBar style="light" />
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 top-0 h-52"
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.07)' }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 40,
            paddingTop: 8,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 mt-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-emerald-500 shadow-lg shadow-emerald-900/40">
                <Text className="text-lg font-black text-[#0B1B3A]">R</Text>
              </View>
              <View>
                <Text className="text-lg font-extrabold tracking-tight text-white">
                  RentDirect
                </Text>
                <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
                  Uganda
                </Text>
              </View>
            </View>
          </View>

          <Text className="mb-6 text-3xl font-extrabold tracking-tight text-white">
            Welcome back
          </Text>

          <Animated.View
            style={{
              opacity: cardAnim,
              transform: [{ translateY }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.35,
              shadowRadius: 24,
              elevation: 12,
            }}
            className="rounded-[28px] border border-white/[0.14] bg-white/[0.09] px-5 pb-7 pt-6"
          >
            <Text className="mb-6 text-sm leading-5 text-slate-400">
              Sign in with the phone number on your account. Fields validate as you go after the
              first interaction.
            </Text>

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="+256700123456"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  returnKeyType="next"
                  error={errors.phone?.message}
                  disabled={submitting}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  error={errors.password?.message}
                  disabled={submitting}
                  rightAccessory={
                    <Pressable
                      onPress={() => setShowPassword((s) => !s)}
                      className="h-10 items-center justify-center rounded-xl px-2 active:bg-white/10"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color="rgba(226,232,240,0.85)"
                      />
                    </Pressable>
                  }
                />
              )}
            />

            {submitError ? (
              <View className="mb-4 flex-row gap-3 rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3">
                <Ionicons name="alert-circle" size={22} color="#fca5a5" />
                <Text className="min-w-0 flex-1 text-[13px] font-medium leading-5 text-red-100">
                  {submitError}
                </Text>
              </View>
            ) : null}

            <Button
              title="Sign in"
              variant="emerald"
              onPress={handleSubmit(onSubmit)}
              disabled={submitting}
              loading={submitting}
            />

            <View className="mt-4 flex-row flex-wrap items-center justify-between gap-y-3">
              <Pressable
                onPress={biometricLogin}
                disabled={submitting}
                className="flex-row items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-3 py-2.5 active:bg-white/10 disabled:opacity-50"
              >
                <Ionicons name="finger-print" size={20} color="#6ee7b7" />
                <Text className="text-sm font-semibold text-white/90">Biometric</Text>
              </Pressable>
              <View className="flex-row flex-wrap items-center justify-end gap-x-4 gap-y-2">
                <Link
                  href={{
                    pathname: '/(auth)/verify-otp',
                    params: phoneWatch?.trim() ? { phone: phoneWatch.trim() } : {},
                  }}
                  asChild
                >
                  <Pressable hitSlop={8} accessibilityRole="link" className="py-2">
                    <Text className="text-sm font-semibold text-emerald-400">OTP sign-in</Text>
                  </Pressable>
                </Link>
                <Pressable
                  onPress={forgotPassword}
                  disabled={submitting}
                  hitSlop={8}
                  className="py-2 disabled:opacity-50"
                >
                  <Text className="text-sm font-semibold text-emerald-400">Forgot password?</Text>
                </Pressable>
              </View>
            </View>

            <View className="my-6 flex-row items-center">
              <View className="h-px flex-1 bg-white/12" />
              <Text className="px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-white/12" />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => socialLogin('Google')}
                disabled={submitting}
                className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] active:bg-white/10 disabled:opacity-50"
              >
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text className="text-sm font-bold text-white/95">Google</Text>
              </Pressable>
              <Pressable
                onPress={() => socialLogin('Apple')}
                disabled={submitting}
                className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] active:bg-white/10 disabled:opacity-50"
              >
                <Ionicons name="logo-apple" size={22} color="#fff" />
                <Text className="text-sm font-bold text-white/95">Apple</Text>
              </Pressable>
            </View>

            <View className="mt-8 flex-row flex-wrap justify-center">
              <Text className="text-center text-sm text-slate-500">No account? </Text>
              <Link href="/(auth)/role-select" asChild>
                <Pressable accessibilityRole="link">
                  <Text className="text-sm font-extrabold text-emerald-400">Create one</Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
