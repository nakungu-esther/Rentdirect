import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: React.ComponentProps<typeof TextInput>['autoCapitalize'];
  autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
  textContentType?: React.ComponentProps<typeof TextInput>['textContentType'];
  returnKeyType?: React.ComponentProps<typeof TextInput>['returnKeyType'];
  onSubmitEditing?: React.ComponentProps<typeof TextInput>['onSubmitEditing'];
  onBlur?: () => void;
  rightAccessory?: React.ReactNode;
  /** Dim field when form is submitting */
  disabled?: boolean;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  onBlur,
  rightAccessory,
  disabled,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? 'border-red-400/70'
    : focused
      ? 'border-emerald-400/55'
      : 'border-white/15';

  return (
    <View className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/70">
        {label}
      </Text>
      <View
        className={[
          'h-[52px] flex-row items-center rounded-2xl border border-solid bg-white/10 px-4',
          borderClass,
          'shadow-sm shadow-black/20',
        ].join(' ')}
      >
        <TextInput
          className="flex-1 text-[16px] text-white"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.45)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={!disabled}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
        />
        {rightAccessory ? <View className="ml-1">{rightAccessory}</View> : null}
      </View>
      {error ? (
        <Text className="mt-2 text-[13px] font-medium leading-4 text-red-300">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
