import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { graphics } from '@/constants/images';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 px-5 pt-6">

        {/* ── Logo Card ────────────────────────────────────────────── */}
        <View className="bg-surface-soft-aqua rounded-3xl items-center pt-10 pb-8 justify-center">
          <Image
          className='w-full left-12'
            source={graphics.poolPalLogo}
            resizeMode="contain"
          />
        </View>

        {/* ── Heading + Subtitle ───────────────────────────────────── */}
        <View className="mt-8 flex-1">
          <Text className="text-h1 font-jakarta-extrabold text-charcoal leading-tight">
            Your AI Pool Tech{'\n'}Concierge
          </Text>
          <Text className="text-body font-jakarta text-sub mt-3 leading-relaxed">
            Get weekly pool guidance, testing-kit recommendations, photo-based
            help, and step-by-step pool care.
          </Text>
        </View>

        {/* ── CTA Buttons ──────────────────────────────────────────── */}
        <View className="pb-6">
          <TouchableOpacity
            className="bg-brand-blue rounded-full py-[17px] items-center justify-center"
            onPress={() => router.push('/signup')}
            activeOpacity={0.85}
          >
            <Text className="text-button font-jakarta-bold text-surface-white">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface-soft-aqua rounded-full py-[17px] items-center justify-center mt-3"
            onPress={() => {
              /* TODO: navigate to sign-in */
            }}
            activeOpacity={0.85}
          >
            <Text className="text-button font-jakarta-bold text-brand-blue">
              I already have an account
            </Text>
          </TouchableOpacity>

          <Text className="text-tiny font-jakarta text-faint text-center mt-3">
            Start simple. Add details later.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
