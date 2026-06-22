import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { icons } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithApple } = useSupabase();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleContinue() {
    setErrorMessage(null);
    setSubmitting(true);

    const { error } = await signUp({ email, password, firstName, phone });

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace('/');
  }

  async function handleGoogleSignUp() {
    setErrorMessage(null);
    setSubmitting(true);

    const { error } = await signInWithGoogle();

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace('/');
  }

  async function handleAppleSignUp() {
    setErrorMessage(null);
    setSubmitting(true);

    const { error } = await signInWithApple();

    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace('/');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-2 pb-6">

            {/* ── Back + Progress ──────────────────────────────────────── */}
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center -ml-2"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>

            <View className="progress-bar mt-2">
              <View className="progress-bar__fill" style={{ width: '20%' }} />
            </View>

            {/* ── Heading ────────────────────────────────────────────── */}
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
              Account Basics
            </Text>
            <Text className="text-body font-jakarta text-sub mt-2">
              Just the essentials to save your progress.
            </Text>

            {/* ── Form ───────────────────────────────────────────────── */}
            <View className="mt-8 gap-5">
              <View>
                <Text className="form-label">First name</Text>
                <TextInput
                  className="form-input"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Teresa"
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="form-label">Email</Text>
                <TextInput
                  className="form-input"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="teresa@email.com"
                  placeholderTextColor="#98A2B3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="form-label">Phone number</Text>
                <TextInput
                  className="form-input"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(555) 000-0000"
                  placeholderTextColor="#98A2B3"
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text className="form-label">Password</Text>
                <TextInput
                  className="form-input"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#98A2B3"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* ── Info callout ───────────────────────────────────────── */}
            <View className="card--info flex-row items-start gap-3 px-4 py-3.5 mt-6">
              <Image source={icons.info} className="w-5 h-5 mt-0.5" resizeMode="contain" />
              <Text className="flex-1 text-body font-jakarta text-sub leading-relaxed">
                We use this to save your pool profile and reminders.
              </Text>
            </View>

            {errorMessage ? (
              <Text className="text-body font-jakarta text-error mt-4">{errorMessage}</Text>
            ) : null}

            {/* ── Social sign-up ─────────────────────────────────────── */}
            <View className="mt-6 gap-3">
              <TouchableOpacity
                className="btn btn--secondary"
                onPress={handleGoogleSignUp}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <AntDesign name="google" size={18} color="#1D2939" />
                <Text className="btn__label btn__label--secondary ml-2">
                  Sign up with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="btn btn--secondary"
                onPress={handleAppleSignUp}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <AntDesign name="apple1" size={18} color="#1D2939" />
                <Text className="btn__label btn__label--secondary ml-2">
                  Sign up with Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Continue ───────────────────────────────────────────── */}
            <View className="mt-auto pt-8">
              <TouchableOpacity
                className="bg-brand-blue rounded-full py-[17px] items-center justify-center"
                onPress={handleContinue}
                disabled={submitting}
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-button font-jakarta-bold text-surface-white">
                    Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
