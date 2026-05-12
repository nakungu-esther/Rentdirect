import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { getOnboardingComplete } from '../../lib/onboarding';
import { isAccountRole, type AccountRole } from './role-definitions';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DocumentUploadSlot } from './DocumentUploadSlot';

const STEPS = [
  { title: 'Profile', subtitle: 'Who you are and how we reach you' },
  { title: 'Security', subtitle: 'Protect your account' },
  { title: 'Verification', subtitle: 'Meet regulatory KYC standards' },
] as const;

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{9,15}$/, 'Use 9–15 digits, optional + prefix'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['tenant', 'landlord', 'agent']),
    nationalIdUri: z.string().min(1, 'Upload a clear photo of your national ID'),
    selfieUri: z.string().min(1, 'Add a verification selfie'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterWizard() {
  const { register: registerUser } = useAuth();
  const params = useLocalSearchParams<{ role?: string | string[] }>();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultRole = useMemo((): AccountRole => {
    const raw = params.role;
    const r =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
    return isAccountRole(r) ? r : 'tenant';
  }, [params.role]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      nationalIdUri: '',
      selfieUri: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const selectedRole = watch('role');

  useEffect(() => {
    const raw = params.role;
    const r =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
    if (isAccountRole(r)) setValue('role', r);
  }, [params.role, setValue]);

  useEffect(() => {
    let cancelled = false;
    void getOnboardingComplete().then((done) => {
      if (!cancelled && !done) router.replace('/(auth)/onboarding');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const goBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/role-select');
  }, [step]);

  const nextFromStep0 = async () => {
    const ok = await trigger(['fullName', 'email', 'phone', 'role'], {
      shouldFocus: true,
    });
    if (ok) setStep(1);
  };

  const nextFromStep1 = async () => {
    const ok = await trigger(['password', 'confirmPassword'], { shouldFocus: true });
    if (ok) setStep(2);
  };

  const onSubmit = async (data: RegisterForm) => {
    setSubmitting(true);
    try {
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        role: data.role,
      });
      // Documents are captured for future KYC upload; current API accepts account JSON only.
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: unknown } } };
      const raw = ax?.response?.data?.message ?? 'Registration failed. Try again.';
      const message = Array.isArray(raw) ? raw.join('\n') : String(raw);
      Alert.alert('Could not register', message);
    } finally {
      setSubmitting(false);
    }
  };

  const primaryAction = () => {
    if (step === 0) void nextFromStep0();
    else if (step === 1) void nextFromStep1();
    else void handleSubmit(onSubmit)();
  };

  const primaryLabel =
    step === 0 ? 'Continue' : step === 1 ? 'Continue' : submitting ? 'Creating…' : 'Create account';

  return (
    <SafeAreaView
      className="flex-1 bg-[#0B1B3A]"
      edges={['top', 'bottom', 'left', 'right']}
      style={{ backgroundColor: '#0B1B3A' }}
    >
      <StatusBar style="light" />
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 top-0 h-48"
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)' }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 32,
            paddingTop: 4,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable
              onPress={goBack}
              hitSlop={12}
              className="flex-row items-center gap-1 rounded-full py-2 pr-2 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#94a3b8" />
              <Text className="text-sm font-semibold text-slate-400">Back</Text>
            </Pressable>
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/90">
              Step {step + 1} / {STEPS.length}
            </Text>
          </View>

          <Text className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            RentDirect UG
          </Text>
          <Text className="mt-1 text-center text-3xl font-extrabold tracking-tight text-white">
            Create account
          </Text>

          {/* Progress */}
          <View className="mt-6 flex-row justify-between gap-2">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <View key={s.title} className="w-[31%] items-center">
                  <View
                    className={`h-10 w-10 items-center justify-center rounded-full border-2 ${
                      done
                        ? 'border-emerald-400/70 bg-emerald-500/20'
                        : active
                          ? 'border-emerald-400 bg-emerald-500'
                          : 'border-white/12 bg-white/5'
                    }`}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={20} color="#a7f3d0" />
                    ) : (
                      <Text
                        className={`text-sm font-extrabold ${
                          active ? 'text-[#0B1B3A]' : 'text-slate-500'
                        }`}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    numberOfLines={2}
                    className={`mt-2 text-center text-[10px] font-bold uppercase leading-3 tracking-wide ${
                      active ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text className="mt-1 text-center text-[13px] text-slate-500">
            {STEPS[step]?.subtitle}
          </Text>

          <View className="mt-6 rounded-[28px] border border-white/[0.12] bg-white/[0.08] px-5 py-6 shadow-2xl">
            {/* Role summary — all steps */}
            <View className="mb-5 flex-row items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
              <View className="flex-1">
                <Text className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200/90">
                  Account type
                </Text>
                <Text className="text-lg font-extrabold capitalize text-white">
                  {selectedRole}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/role-select',
                    params: { role: selectedRole },
                  })
                }
                className="rounded-xl bg-white/10 px-3 py-2 active:bg-white/15"
              >
                <Text className="text-xs font-bold text-emerald-200">Change</Text>
              </Pressable>
            </View>

            {step === 0 ? (
              <>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      label="Full name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="As on your national ID"
                      autoComplete="name"
                      textContentType="name"
                      returnKeyType="next"
                      error={errors.fullName?.message}
                      disabled={submitting}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      label="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      error={errors.email?.message}
                      disabled={submitting}
                    />
                  )}
                />
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
                      returnKeyType="done"
                      error={errors.phone?.message}
                      disabled={submitting}
                    />
                  )}
                />
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="At least 8 characters"
                      secureTextEntry={!showPassword}
                      autoComplete="password-new"
                      textContentType="newPassword"
                      returnKeyType="next"
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
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      label="Confirm password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Repeat password"
                      secureTextEntry={!showConfirm}
                      autoComplete="password-new"
                      textContentType="newPassword"
                      returnKeyType="done"
                      error={errors.confirmPassword?.message}
                      disabled={submitting}
                      rightAccessory={
                        <Pressable
                          onPress={() => setShowConfirm((s) => !s)}
                          className="h-10 items-center justify-center rounded-xl px-2 active:bg-white/10"
                          accessibilityLabel={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          <Ionicons
                            name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="rgba(226,232,240,0.85)"
                          />
                        </Pressable>
                      }
                    />
                  )}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Text className="mb-4 text-[13px] leading-5 text-slate-400">
                  Uploads stay on-device until our compliance pipeline is connected; you still need
                  them to finish this onboarding flow.
                </Text>
                <Controller
                  control={control}
                  name="nationalIdUri"
                  render={({ field: { onChange, value } }) => (
                    <DocumentUploadSlot
                      title="National ID"
                      subtitle="Government-issued photo ID. Ensure text is readable and glare-free."
                      value={value}
                      onChange={onChange}
                      onClear={() => onChange('')}
                      variant="nationalId"
                      disabled={submitting}
                    />
                  )}
                />
                {errors.nationalIdUri?.message ? (
                  <Text className="-mt-2 mb-3 text-[13px] font-medium text-red-300">
                    {errors.nationalIdUri.message}
                  </Text>
                ) : null}
                <Controller
                  control={control}
                  name="selfieUri"
                  render={({ field: { onChange, value } }) => (
                    <DocumentUploadSlot
                      title="Verification selfie"
                      subtitle="Live capture preferred. Match lighting to your ID photo where possible."
                      value={value}
                      onChange={onChange}
                      onClear={() => onChange('')}
                      variant="selfie"
                      disabled={submitting}
                    />
                  )}
                />
                {errors.selfieUri?.message ? (
                  <Text className="-mt-2 mb-1 text-[13px] font-medium text-red-300">
                    {errors.selfieUri.message}
                  </Text>
                ) : null}
              </>
            ) : null}

            {step === 0 ? (
              <View className="mt-2 w-full">
                <Button
                  title={primaryLabel}
                  variant="emerald"
                  onPress={primaryAction}
                  disabled={submitting}
                />
              </View>
            ) : (
              <View className="mt-2 flex-row gap-3">
                <View className="flex-1">
                  <Button
                    title="Previous"
                    variant="glass"
                    onPress={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={submitting}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title={primaryLabel}
                    variant="emerald"
                    onPress={primaryAction}
                    disabled={submitting}
                    loading={submitting && step === 2}
                  />
                </View>
              </View>
            )}

            <View className="mt-6 flex-row flex-wrap justify-center">
              <Text className="text-center text-sm text-slate-500">Already registered? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-sm font-extrabold text-emerald-400">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
