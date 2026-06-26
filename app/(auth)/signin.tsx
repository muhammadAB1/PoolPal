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
import { useTranslation } from 'react-i18next';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { icons } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';
import { setLanguage as changeAppLanguage } from '@/lib/i18n';
import { Country, Language, Measurement } from '@/lib/types';
import Preferences from '@/components/Preferences';

export default function SignupScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { signInWithEmailAndPassword, signInWithApple, signInWithGoogle } = useSupabase();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [country, setCountry] = useState<Country>('us');
    const [language, setLanguage] = useState<Language>('en');
    const [measurement, setMeasurement] = useState<Measurement>('us');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleContinue() {
        setErrorMessage(null);
        setSubmitting(true);

        const { error } = await signInWithEmailAndPassword(email, password);

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.replace('/pool-basics');
    }

    async function handleGoogleSignUp() {
        setErrorMessage(null);
        setSubmitting(true);

        const { error } = await signInWithGoogle(country, language, measurement);

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.replace('/pool-basics');
    }

    async function handleAppleSignUp() {
        setErrorMessage(null);
        setSubmitting(true);

        const { error } = await signInWithApple(country, language, measurement);

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.replace('/pool-basics');
    }

    function handleLanguageChange(lang: Language) {
        setLanguage(lang);
        changeAppLanguage(lang);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-5 pt-2">

                        <TouchableOpacity
                            className="w-10 h-10 items-center justify-center -ml-2"
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
                        </TouchableOpacity>

                        <View className="progress-bar mt-2">
                            <View className="progress-bar__fill" style={{ width: '25%' }} />
                        </View>

                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                            {t('signin_account_title')}
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            {t('signin_account_subtitle')}
                        </Text>

                        <View className="mt-8 gap-5">
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
                                <Text className="form-label">{t('signup_password')}</Text>
                                <View>
                                    <TextInput
                                        className="form-input pr-12"
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="••••••••"
                                        placeholderTextColor="#98A2B3"
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-0 bottom-0 justify-center"
                                        onPress={() => setShowPassword((v) => !v)}
                                        activeOpacity={0.7}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#98A2B3"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Preferences
                            country={country}
                            language={language}
                            handleLanguageChange={handleLanguageChange}
                            measurement={measurement}
                            setCountry={setCountry}
                            setLanguage={setLanguage}
                            setMeasurement={setMeasurement} />

                        {errorMessage ? (
                            <Text className="text-body font-jakarta text-error mt-4">{errorMessage}</Text>
                        ) : null}

                        <View className="mt-6 gap-3">
                            <TouchableOpacity
                                className="btn btn--secondary"
                                onPress={handleGoogleSignUp}
                                disabled={submitting}
                                activeOpacity={0.85}
                            >
                                <AntDesign name="google" size={18} color="#1D2939" />
                                <Text className="btn__label btn__label--secondary ml-2 h-5">
                                    {t('signin_google')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="btn btn--secondary"
                                onPress={handleAppleSignUp}
                                disabled={submitting}
                                activeOpacity={0.85}
                            >
                                <AntDesign name="apple" size={18} color="#1D2939" />
                                <Text className="btn__label btn__label--secondary ml-2 h-5">
                                    {t('signin_apple')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="mt-8">
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
                                        {t('signup_continue')}
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

