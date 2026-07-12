import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { icons } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';
import { setLanguage as changeAppLanguage } from '@/lib/i18n';
import { Country, Language, Measurement } from '@/lib/types';
import Preferences from '@/components/Preferences';
import { useAuthScreenGuard } from '@/hooks/useAuthScreenGuard';
import { usePool } from '@/providers/PoolProvider';

export default function SigninScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { signInWithGoogle } = useSupabase();

    const authRedirect = useAuthScreenGuard();
    const [country, setCountry] = useState<Country>('us');
    const [language, setLanguage] = useState<Language>('en');
    const [measurement, setMeasurement] = useState<Measurement>('us');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleGoogleSignUp() {
        setErrorMessage(null);
        setSubmitting(true);

        const { redirectTo, error } = await signInWithGoogle(country, language, measurement);
        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }
        if (redirectTo) {
            router.replace(redirectTo as Href);
        }
    }


    function handleLanguageChange(lang: Language) {
        setLanguage(lang);
        changeAppLanguage(lang);
    }

    if (authRedirect) {
        return <Redirect href={authRedirect as Href} />;
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
                            onPress={() => router.replace('/welcome')}
                            activeOpacity={0.7}
                        >
                            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
                        </TouchableOpacity>

                        <View className="progress-bar mt-2">
                            <View className="progress-bar__fill" style={{ width: '10%' }} />
                        </View>

                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                            {t('signin_account_title')}
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            {t('signin_account_subtitle')}
                        </Text>


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
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

