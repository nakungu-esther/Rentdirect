import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

type GlassCardProps = ViewProps & {
  children: ReactNode;
  /** Extra NativeWind classes */
  className?: string;
};

/**
 * Glass-style surface: translucent layer + hairline border for fintech dashboards.
 */
export function GlassCard({ children, className = '', ...rest }: GlassCardProps) {
  return (
    <View
      className={`overflow-hidden rounded-3xl border border-white/[0.12] bg-white/[0.07] p-5 shadow-black/25 shadow-lg ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
