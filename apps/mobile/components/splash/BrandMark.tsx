import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SPLASH } from './colors';

/**
 * Centered monogram + wordmark with a restrained luxury pulse (scale + soft glow).
 */
export function BrandMark() {
  const pulse = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.045,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    const intro = Animated.timing(rise, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    intro.start();

    return () => {
      pulseLoop.stop();
      intro.stop();
    };
  }, [pulse, rise]);

  const riseStyle = {
    opacity: rise,
    transform: [
      {
        translateY: rise.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.stack, riseStyle]}>
      <Animated.View
        style={[
          styles.monoWrap,
          {
            transform: [{ scale: pulse }],
            shadowColor: SPLASH.emerald,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 12,
          },
        ]}
      >
        <Text style={styles.monoLetter}>R</Text>
      </Animated.View>
      <Text style={styles.wordmark}>RentDirect</Text>
      <View style={styles.subRow}>
        <View style={styles.subLine} />
        <Text style={styles.subLabel}>Uganda</Text>
        <View style={styles.subLine} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    alignItems: 'center',
  },
  monoWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SPLASH.emerald,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  monoLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  wordmark: {
    fontSize: 26,
    fontWeight: '800',
    color: SPLASH.ink,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  subLine: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(52, 211, 153, 0.45)',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: SPLASH.emeraldMuted,
  },
});
