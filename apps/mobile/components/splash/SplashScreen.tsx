import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from './BrandMark';
import { RippleField } from './RippleField';
import { SPLASH } from './colors';

type SplashScreenProps = {
  /** Optional line under the logo stack (e.g. product tagline). */
  tagline?: string;
};

/**
 * Production splash: navy canvas, emerald system, Sui-style ripples, safe areas.
 */
export function SplashScreen({
  tagline = 'Smart rentals. Trusted settlements.',
}: SplashScreenProps) {
  return (
    <SafeAreaView
      className="flex-1 bg-[#0B1B3A]"
      edges={['top', 'bottom', 'left', 'right']}
      style={{ backgroundColor: SPLASH.navy }}
    >
      <StatusBar style="light" />
      {/* subtle top sheen */}
      <View pointerEvents="none" style={styles.sheen} />
      <View className="flex-1 items-center justify-center px-8">
        <View className="items-center">
          <View className="relative items-center justify-center">
            <RippleField />
            <View className="absolute items-center justify-center">
              <BrandMark />
            </View>
          </View>
          <Text className="mt-10 max-w-[280px] text-center text-sm leading-5 text-slate-400">
            {tagline}
          </Text>
          <View className="mt-8 h-8 items-center justify-center">
            <ActivityIndicator size="small" color={SPLASH.emeraldMuted} />
          </View>
          <Text className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600">
            Loading
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 160,
    backgroundColor: 'rgba(16, 185, 129, 0.07)',
  },
});
