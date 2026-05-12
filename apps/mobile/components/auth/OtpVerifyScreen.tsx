import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const OTP_LEN = 6;
const RESEND_SEC = 60;

const phoneOk = (p: string) => /^\+?[0-9]{9,15}$/.test(p.trim());

export function OtpVerifyScreen() {
  const params = useLocalSearchParams<{ phone?: string | string[] }>();
  const initialPhone = useMemo(() => {
    const raw = params.phone;
    const p = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : '';
    return p?.trim() ?? '';
  }, [params.phone]);

  const [phone, setPhone] = useState(initialPhone);
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LEN).fill(''));
  const [hasSent, setHasSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [banner, setBanner] = useState('');

  const refs = useRef<Array<TextInput | null>>([]);
  const pulse = useRef(new Animated.Value(0.4)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [ring]);

  useEffect(() => {
    if (!initialPhone) return;
    setPhone(initialPhone);
  }, [initialPhone]);

  const sendCode = useCallback(async () => {
    if (!phoneOk(phone)) {
      Alert.alert('Phone number', 'Enter a valid phone number (e.g. +256700123456).');
      return;
    }
    setSending(true);
    setBanner('');
    const isResend = hasSent;
    try {
      const res = await authApi.sendOtp(phone.trim());
      const body = res.data as { sent?: boolean; debugOtp?: string };
      if (isResend) {
        setDigits(Array(OTP_LEN).fill(''));
      }
      setHasSent(true);
      setResendIn(RESEND_SEC);
      if (body?.debugOtp) {
        setBanner(`Dev OTP: ${body.debugOtp}`);
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: unknown } } };
      const m = ax?.response?.data?.message;
      Alert.alert('Could not send code', Array.isArray(m) ? m.join('\n') : String(m ?? 'Try again later.'));
    } finally {
      setSending(false);
    }
  }, [phone, hasSent]);

  const autoSentRef = useRef(false);
  useEffect(() => {
    if (autoSentRef.current) return;
    if (!initialPhone || !phoneOk(initialPhone)) return;
    autoSentRef.current = true;
    void sendCode();
  }, [initialPhone, sendCode]);

  useEffect(() => {
    if (!hasSent || resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [hasSent, resendIn]);

  const setDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, '');
    let focusIndex: number | null = null;
    setDigits((prev) => {
      if (v.length >= OTP_LEN) {
        focusIndex = OTP_LEN - 1;
        return v.slice(0, OTP_LEN).split('');
      }
      if (v.length > 1) {
        const chars = v.split('');
        const next = [...prev];
        for (let j = 0; j < chars.length && index + j < OTP_LEN; j++) {
          next[index + j] = chars[j] ?? '';
        }
        focusIndex = Math.min(index + chars.length, OTP_LEN - 1);
        return next;
      }
      const next = [...prev];
      const ch = v.slice(-1);
      next[index] = ch;
      if (ch && index < OTP_LEN - 1) focusIndex = index + 1;
      return next;
    });
    if (focusIndex !== null) {
      requestAnimationFrame(() => refs.current[focusIndex]?.focus());
    }
  };

  const onKeyPress = (index: number, key: string) => {
    if (key !== 'Backspace') return;
    if (digits[index]) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }
    if (index > 0) {
      refs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
    }
  };

  const runSuccessAnimation = useCallback(() => {
    successScale.setValue(0);
    successOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [successOpacity, successScale]);

  const verify = async () => {
    const code = digits.join('');
    if (code.length !== OTP_LEN) {
      Alert.alert('Incomplete code', `Enter all ${OTP_LEN} digits.`);
      return;
    }
    if (!phoneOk(phone)) {
      Alert.alert('Phone number', 'Enter a valid phone number.');
      return;
    }
    setVerifying(true);
    try {
      await authApi.verifyOtp(phone.trim(), code);
      setSuccess(true);
      runSuccessAnimation();
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1600);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: unknown } } };
      const m = ax?.response?.data?.message;
      Alert.alert('Verification failed', Array.isArray(m) ? m.join('\n') : String(m ?? 'Invalid or expired code.'));
    } finally {
      setVerifying(false);
    }
  };

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });

  return (
    <SafeAreaView
      className="flex-1 bg-[#0B1B3A]"
      edges={['top', 'bottom', 'left', 'right']}
      style={{ backgroundColor: '#0B1B3A' }}
    >
      <StatusBar style="light" />
      <View
        pointerEvents="none"
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(6, 15, 36, 0.92)' }}
      />

      <KeyboardAvoidingView
        className="flex-1 justify-center px-5"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/login'))}
          className="absolute left-4 top-2 z-10 flex-row items-center gap-1 py-2"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color="#94a3b8" />
          <Text className="text-sm font-semibold text-slate-400">Back</Text>
        </Pressable>

        <View className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.09] px-5 py-8 shadow-2xl">
          <View className="mb-6 items-center">
            <View className="relative mb-4 h-24 w-24 items-center justify-center">
              <Animated.View
                pointerEvents="none"
                className="absolute rounded-full bg-emerald-400/25"
                style={{
                  width: 112,
                  height: 112,
                  opacity: ringOpacity,
                  transform: [{ scale: ringScale }],
                }}
              />
              <Animated.View
                style={{ opacity: glowOpacity }}
                className="absolute h-20 w-20 rounded-3xl bg-emerald-500/30"
              />
              <View className="h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/20 shadow-lg shadow-emerald-500/40">
                <Ionicons name="shield-checkmark" size={36} color="#6ee7b7" />
              </View>
            </View>
            <Text className="text-center text-xs font-bold uppercase tracking-[0.25em] text-emerald-400/90">
              Verification
            </Text>
            <Text className="mt-2 text-center text-2xl font-extrabold tracking-tight text-white">
              Enter one-time code
            </Text>
            <Text className="mt-2 px-2 text-center text-sm leading-5 text-slate-400">
              We sent a {OTP_LEN}-digit code to your phone. Codes expire in 10 minutes.
            </Text>
          </View>

          {!initialPhone ? (
            <View className="mb-5">
              <Input
                label="Phone number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+256700123456"
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                returnKeyType="done"
                disabled={sending || verifying}
              />
              {!hasSent ? (
                <Button
                  title={sending ? 'Sending…' : 'Send code'}
                  variant="glass"
                  onPress={() => void sendCode()}
                  disabled={sending}
                  loading={sending}
                />
              ) : null}
            </View>
          ) : (
            <Text className="mb-5 text-center text-sm text-slate-400">
              Code sent to{' '}
              <Text className="font-semibold text-white">{phone}</Text>
            </Text>
          )}

          {hasSent ? (
            <>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                One-time password
              </Text>
              <View className="mb-2 flex-row justify-between gap-2">
                {digits.map((d, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => {
                      refs.current[i] = r;
                    }}
                    value={d}
                    onChangeText={(t) => setDigit(i, t)}
                    onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
                    keyboardType="number-pad"
                    maxLength={i === 0 ? OTP_LEN : 1}
                    editable={!verifying && !success}
                    selectTextOnFocus
                    className="h-14 min-w-0 flex-1 rounded-2xl border border-white/15 bg-black/25 text-center text-xl font-extrabold text-white"
                    textContentType={i === 0 ? 'oneTimeCode' : 'none'}
                    autoComplete={i === 0 ? 'sms-otp' : 'off'}
                  />
                ))}
              </View>
              {banner ? (
                <Text className="mb-4 text-center text-xs font-mono text-emerald-300/90">{banner}</Text>
              ) : (
                <View className="mb-4 h-4" />
              )}

              <Button
                title={verifying ? 'Verifying…' : 'Verify'}
                variant="emerald"
                onPress={() => void verify()}
                disabled={verifying || success}
                loading={verifying}
              />

              <View className="mt-5 items-center">
                {resendIn > 0 ? (
                  <Text className="text-sm text-slate-500">
                    Resend code in{' '}
                    <Text className="font-bold text-emerald-400">{resendIn}s</Text>
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => void sendCode()}
                    disabled={sending}
                    className="py-2 active:opacity-80"
                  >
                    {sending ? (
                      <ActivityIndicator color="#34d399" />
                    ) : (
                      <Text className="text-sm font-bold text-emerald-400">Resend code</Text>
                    )}
                  </Pressable>
                )}
              </View>
            </>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      {success ? (
        <View
          className="absolute inset-0 items-center justify-center bg-black/55"
          pointerEvents="none"
        >
          <Animated.View
            style={{
              opacity: successOpacity,
              transform: [{ scale: successScale }],
            }}
            className="items-center rounded-3xl border border-emerald-400/40 bg-[#0B1B3A] px-10 py-8"
          >
            <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-emerald-500/25">
              <Ionicons name="checkmark-circle" size={52} color="#34d399" />
            </View>
            <Text className="text-center text-lg font-extrabold text-white">Phone verified</Text>
            <Text className="mt-1 text-center text-sm text-slate-400">Redirecting to sign in…</Text>
          </Animated.View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
