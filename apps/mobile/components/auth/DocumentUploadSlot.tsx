import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type DocumentUploadSlotProps = {
  title: string;
  subtitle: string;
  value?: string;
  onChange: (uri: string) => void;
  onClear: () => void;
  /** National ID from library; selfie prefers camera then library */
  variant: 'nationalId' | 'selfie';
  disabled?: boolean;
};

export function DocumentUploadSlot({
  title,
  subtitle,
  value,
  onChange,
  onClear,
  variant,
  disabled,
}: DocumentUploadSlotProps) {
  const pick = async () => {
    if (disabled) return;
    try {
      if (variant === 'selfie') {
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        if (!cam.granted) {
          Alert.alert(
            'Camera access',
            'Enable camera permission in Settings to take your verification selfie.',
          );
          return;
        }
        const shot = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.82,
        });
        if (!shot.canceled && shot.assets[0]?.uri) {
          onChange(shot.assets[0].uri);
          return;
        }
        const libSelfie = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libSelfie.granted) return;
        const fallback = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.82,
        });
        if (!fallback.canceled && fallback.assets[0]?.uri) {
          onChange(fallback.assets[0].uri);
        }
        return;
      }

      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!lib.granted) {
        Alert.alert(
          'Photos access',
          'Enable photo library access in Settings to upload your national ID image.',
        );
        return;
      }
      const img = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });
      if (!img.canceled && img.assets[0]?.uri) onChange(img.assets[0].uri);
    } catch {
      Alert.alert('Upload', 'Could not open the picker. Please try again.');
    }
  };

  return (
    <View className={`mb-5 ${disabled ? 'opacity-50' : ''}`}>
      <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        {title}
      </Text>
      <Text className="mb-3 text-[13px] leading-5 text-slate-400">{subtitle}</Text>
      {value ? (
        <View className="overflow-hidden rounded-2xl border border-white/15 bg-black/20">
          <Image
            source={{ uri: value }}
            style={{ width: '100%', height: 176 }}
            resizeMode="cover"
            accessibilityLabel={title}
          />
          <View className="flex-row border-t border-white/10 bg-white/5">
            <Pressable
              onPress={pick}
              disabled={disabled}
              className="flex-1 items-center py-3 active:bg-white/10"
            >
              <Text className="text-sm font-semibold text-emerald-400">Replace</Text>
            </Pressable>
            <View className="w-px bg-white/10" />
            <Pressable
              onPress={onClear}
              disabled={disabled}
              className="flex-1 items-center py-3 active:bg-white/10"
            >
              <Text className="text-sm font-semibold text-red-300">Remove</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={pick}
          disabled={disabled}
          className="items-center justify-center rounded-2xl border border-dashed border-white/25 bg-white/[0.04] py-10 active:bg-white/[0.08]"
        >
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
            <Ionicons
              name={variant === 'selfie' ? 'camera' : 'document-text'}
              size={28}
              color="#6ee7b7"
            />
          </View>
          <Text className="text-base font-bold text-white">
            {variant === 'selfie' ? 'Take selfie' : 'Upload national ID'}
          </Text>
          <Text className="mt-1 px-6 text-center text-xs text-slate-500">
            {variant === 'selfie'
              ? 'Face the camera, good lighting, no sunglasses.'
              : 'JPG or PNG · ensure all corners of the ID are visible.'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
