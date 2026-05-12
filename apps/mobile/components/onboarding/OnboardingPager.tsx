import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { setOnboardingComplete } from '../../lib/onboarding';
import { ONBOARDING_SLIDES } from './slide-data';
import { SlideIllustration } from './SlideIllustration';

export function OnboardingPager() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<(typeof ONBOARDING_SLIDES)[number]> | null>(null);
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const panelOpacity = useRef(new Animated.Value(1)).current;

  const bumpPanel = useCallback(() => {
    panelOpacity.setValue(0.9);
    Animated.timing(panelOpacity, {
      toValue: 1,
      duration: 340,
      useNativeDriver: true,
    }).start();
  }, [panelOpacity]);

  useEffect(() => {
    bumpPanel();
  }, [index, bumpPanel]);

  const finish = useCallback(async () => {
    setFinishing(true);
    try {
      await setOnboardingComplete();
      router.replace('/(auth)/login');
    } finally {
      setFinishing(false);
    }
  }, []);

  const goNext = useCallback(() => {
    if (index >= ONBOARDING_SLIDES.length - 1) {
      void finish();
      return;
    }
    const next = index + 1;
    const w = Math.max(width, 1);
    listRef.current?.scrollToOffset({ offset: next * w, animated: true });
    setIndex(next);
  }, [index, finish, width]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / Math.max(width, 1));
      setIndex(Math.min(Math.max(next, 0), ONBOARDING_SLIDES.length - 1));
    },
    [width],
  );

  const isLast = index === ONBOARDING_SLIDES.length - 1;

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
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.07)' }}
      />

      <View className="flex-row items-center justify-end px-5 pt-1">
        <Pressable
          onPress={() => void finish()}
          disabled={finishing}
          hitSlop={12}
          className="rounded-full px-3 py-2 active:opacity-70 disabled:opacity-40"
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text className="text-sm font-semibold text-slate-400">Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        keyboardShouldPersistTaps="handled"
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 px-6 pb-4 pt-2">
            <SlideIllustration visual={item.visual} />
            <View className="mt-2">
              <Text className="text-center text-3xl font-extrabold tracking-tight text-white">
                {item.title}
              </Text>
              <Text className="mt-3 text-center text-base leading-6 text-slate-400">
                {item.subtitle}
              </Text>
            </View>
          </View>
        )}
      />

      <Animated.View
        style={{ opacity: panelOpacity }}
        className="border-t border-white/10 bg-white/[0.08] px-6 pb-2 pt-5"
      >
        <View className="mb-6 flex-row items-center justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              className="h-2 rounded-full"
              style={{
                width: i === index ? 28 : 8,
                backgroundColor: i === index ? '#34D399' : 'rgba(148,163,184,0.35)',
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={() => void goNext()}
          disabled={finishing}
          className="mb-3 h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-500 active:opacity-90 disabled:opacity-50"
        >
          <Text className="text-center text-base font-bold text-[#0B1B3A]">
            {isLast ? 'Get started' : 'Next'}
          </Text>
          {!isLast ? <Ionicons name="arrow-forward" size={20} color="#0B1B3A" /> : null}
        </Pressable>

        {isLast ? (
          <Pressable
            onPress={() => void finish()}
            disabled={finishing}
            className="mb-2 py-3 active:opacity-80 disabled:opacity-40"
            accessibilityRole="button"
          >
            <Text className="text-center text-sm font-semibold text-emerald-400/90">
              I already have an account
            </Text>
          </Pressable>
        ) : (
          <View className="h-3" />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
