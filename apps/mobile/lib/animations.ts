import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Reusable native-driver loops for premium UI (splash, cards, CTAs).
 */
export function usePulseLoop(
  toScale = 1.04,
  durationMs = 1400,
): Animated.Value {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: toScale,
          duration: durationMs,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 1,
          duration: durationMs,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, toScale, durationMs]);
  return v;
}

/** Opacity + translateY for section reveals; pass to `Animated.View` style. */
export function useFadeUpEntrance(delayMs = 0, durationMs = 440) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    const run = Animated.sequence([
      Animated.delay(delayMs),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: durationMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: durationMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);
    run.start();
    return () => run.stop();
  }, [delayMs, durationMs, opacity, translateY]);

  return {
    opacity,
    transform: [{ translateY }],
  };
}
