import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingSlide } from './slide-data';

const EMERALD = '#10B981';
const CYAN = 'rgba(45, 212, 191, 0.25)';

type Props = {
  visual: OnboardingSlide['visual'];
};

/**
 * Abstract “premium illustration” stacks — no raster assets, scales crisply on all DPRs.
 */
export function SlideIllustration({ visual }: Props) {
  if (visual === 'trusted') {
    return (
      <View className="h-56 w-full items-center justify-center">
        <View className="absolute h-48 w-48 rounded-full border border-white/10 bg-white/[0.04]" />
        <View className="absolute h-36 w-36 rounded-full border border-emerald-500/20 bg-emerald-500/10" />
        <View className="h-28 w-28 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-lg shadow-black/40">
          <Ionicons name="shield-checkmark" size={52} color={EMERALD} />
        </View>
        <View className="absolute bottom-10 right-[18%] h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
          <Ionicons name="home" size={22} color="#E2E8F0" />
        </View>
        <View className="absolute bottom-14 left-[16%] h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
          <Ionicons name="ribbon" size={18} color={EMERALD} />
        </View>
      </View>
    );
  }

  if (visual === 'blockchain') {
    return (
      <View className="h-56 w-full items-center justify-center">
        <View
          className="absolute h-52 w-52 rounded-full border"
          style={{ borderColor: CYAN }}
        />
        <View className="flex-row items-end gap-2">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.06]"
              style={{
                width: 44 + i * 8,
                height: 52 + i * 10,
                opacity: 0.5 + i * 0.12,
              }}
            />
          ))}
        </View>
        <View className="absolute items-center justify-center">
          <View className="h-24 w-24 rotate-12 items-center justify-center rounded-2xl border-2 border-emerald-400/40 bg-[#0B1B3A]/90">
            <Ionicons name="link" size={36} color={EMERALD} />
          </View>
        </View>
        <View className="absolute right-[12%] top-12 h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
          <Ionicons name="cube" size={22} color="#5eead4" />
        </View>
      </View>
    );
  }

  return (
    <View className="h-56 w-full items-center justify-center">
      <View className="h-44 w-64 rounded-3xl border border-white/12 bg-white/[0.07] p-4 shadow-xl shadow-black/30">
        <View className="mb-2 h-2 rounded bg-white/20" style={{ width: '68%' }} />
        <View className="mb-2 h-2 w-full rounded bg-white/10" />
        <View className="mb-2 h-2 rounded bg-white/10" style={{ width: '88%' }} />
        <View className="mb-4 h-2 rounded bg-white/10" style={{ width: '72%' }} />
        <View className="flex-row items-center gap-2">
          <View className="h-10 flex-1 rounded-xl bg-emerald-500/20" />
          <View className="h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30">
            <Ionicons name="pencil" size={18} color={EMERALD} />
          </View>
        </View>
      </View>
      <View className="absolute -bottom-1 right-[14%] flex-row items-center gap-1 rounded-full border border-emerald-400/25 bg-[#0B1B3A] px-3 py-1.5">
        <Ionicons name="sparkles" size={14} color={EMERALD} />
        <View className="h-1.5 w-8 rounded-full bg-emerald-400/50" />
      </View>
    </View>
  );
}
