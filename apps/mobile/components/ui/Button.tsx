import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'emerald' | 'primary' | 'ghost' | 'glass';
  leftIcon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = 'emerald',
  leftIcon,
}: ButtonProps) {
  const isDisabled = !!disabled || !!loading;

  const variantClass =
    variant === 'ghost'
      ? 'border border-white/15 bg-white/5'
      : variant === 'glass'
        ? 'border border-white/20 bg-white/[0.08]'
        : variant === 'primary'
          ? 'border border-[#12331f] bg-[#1B4332]'
          : 'border border-emerald-400/35 bg-emerald-500';

  const textClass =
    variant === 'emerald'
      ? 'font-bold text-[#0B1B3A]'
      : variant === 'ghost' || variant === 'glass'
        ? 'font-semibold text-white'
        : 'font-bold text-white';

  const spinnerColor =
    variant === 'emerald' ? '#0B1B3A' : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={isDisabled}
      className={[
        'h-[52px] flex-row items-center justify-center rounded-2xl px-4',
        variantClass,
        isDisabled ? 'opacity-55' : 'opacity-100',
        'shadow-md shadow-black/25',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {leftIcon ? <View>{leftIcon}</View> : null}
          <Text className={['text-[15px]', textClass].join(' ')}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
