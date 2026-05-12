import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Msg = { id: string; from: 'me' | 'them'; text: string; time: string };

const SEED: Msg[] = [
  { id: '1', from: 'them', text: 'Hello — confirming viewing for the Kololo unit tomorrow 4pm.', time: '10:02' },
  { id: '2', from: 'me', text: 'Works for me. Please share the gate pass.', time: '10:04' },
  { id: '3', from: 'them', text: 'Sent to your inbox. Walrus proof attached to the thread.', time: '10:05' },
];

function TypingDots() {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.Text
      style={{ opacity }}
      className="px-4 py-2 text-xl tracking-[0.35em] text-slate-400"
    >
      ···
    </Animated.Text>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0B1B3A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <View
        className="flex-row items-center border-b border-white/[0.06] px-4 pb-3"
        style={{ paddingTop: insets.top + 6 }}
      >
        <Pressable
          accessibilityLabel="Back to home"
          hitSlop={12}
          onPress={() => router.replace('/(tabs)/index')}
          className="mr-1 h-10 w-10 items-center justify-center rounded-xl bg-white/5"
        >
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </Pressable>
        <View className="ml-1 h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/20">
          <Ionicons name="business-outline" size={18} color="#6EE7B7" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-white">Verified landlord</Text>
          <Text className="text-xs text-slate-500">Typically replies in minutes</Text>
        </View>
        <Pressable className="h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Ionicons name="call-outline" size={20} color="#94A3B8" />
        </Pressable>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
        }}
        ListFooterComponent={
          typing ? (
            <View className="mb-2 max-w-[72%] self-start rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06]">
              <TypingDots />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const mine = item.from === 'me';
          return (
            <View className={`mb-3 max-w-[82%] ${mine ? 'self-end' : 'self-start'}`}>
              <View
                className={`rounded-2xl px-3.5 py-2.5 ${
                  mine
                    ? 'rounded-br-sm bg-[#10B981]'
                    : 'rounded-bl-sm border border-white/10 bg-white/[0.07]'
                }`}
              >
                <Text className={`text-sm leading-5 ${mine ? 'text-[#0B1B3A]' : 'text-slate-100'}`}>
                  {item.text}
                </Text>
              </View>
              <Text
                className={`mt-1 text-[10px] text-slate-500 ${mine ? 'text-right' : 'text-left'}`}
              >
                {item.time}
              </Text>
            </View>
          );
        }}
      />

      <View
        className="border-t border-white/[0.06] bg-[#081428] px-3 pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-row items-end gap-2">
          <Pressable className="mb-2 h-10 w-10 items-center justify-center rounded-xl bg-white/5">
            <Ionicons name="attach-outline" size={22} color="#94A3B8" />
          </Pressable>
          <Pressable className="mb-2 h-10 w-10 items-center justify-center rounded-xl bg-white/5">
            <Ionicons name="mic-outline" size={22} color="#94A3B8" />
          </Pressable>
          <View className="mb-1 min-h-[44px] flex-1 flex-row items-center rounded-2xl border border-white/10 bg-white/[0.06] px-3">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message"
              placeholderTextColor="rgba(148,163,184,0.5)"
              className="native:text-base max-h-28 flex-1 py-2 text-base text-white"
              multiline
            />
          </View>
          <Pressable className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-[#10B981] active:opacity-90">
            <Ionicons name="send" size={18} color="#0B1B3A" />
          </Pressable>
        </View>
        <Text className="mt-2 text-center text-[10px] text-slate-600">
          Read receipts & files sync when your chat service is connected.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
