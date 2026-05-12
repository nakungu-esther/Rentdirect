import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { SPLASH } from './colors';

const RINGS = 4;
const CYCLE_MS = 2600;
const STAGGER_MS = 520;

type RippleRingProps = {
  index: number;
};

/**
 * Sui-inspired concentric ripples: staggered pulses expanding from the brand core.
 * Uses the native driver (opacity + scale only).
 */
function RippleRing({ index }: RippleRingProps) {
  const progress = useRef(new Animated.Value(0)).current;

  const anim = useMemo(
    () =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * STAGGER_MS),
          Animated.timing(progress, {
            toValue: 1,
            duration: CYCLE_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(progress, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    [index, progress],
  );

  useEffect(() => {
    anim.start();
    return () => anim.stop();
  }, [anim]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 2.35],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.35, 1],
    outputRange: [0, 0.42, 0.22, 0],
  });

  const borderWidth = index === 0 ? 2 : 1.5;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth,
        borderColor: index % 2 === 0 ? SPLASH.ring : SPLASH.ringSoft,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

export function RippleField() {
  return (
    <View className="h-52 w-52 items-center justify-center">
      {Array.from({ length: RINGS }, (_, i) => (
        <RippleRing key={i} index={i} />
      ))}
    </View>
  );
}
