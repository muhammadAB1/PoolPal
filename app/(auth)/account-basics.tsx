import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { icons } from '@/constants/images';
import { setLanguage as changeAppLanguage } from '@/lib/i18n';
import { Country, Language, Measurement } from '@/lib/types';
import Preferences from '@/components/Preferences';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { useSupabase } from '@/hooks/supabaseHooks';

export default function AccountBasicsScreen() {
    const { t } = useTranslation();
    const { user, loading: authLoading, country: savedCountry, language: savedLanguage, measurement: savedMeasurement } = useAuth();
    const { poolId, loading: poolLoading } = usePool();
    const { saveAccountBasics } = useSupabase();

    const [country, setCountry] = useState<Country>(savedCountry ?? 'us');
    const [cityOrTown, setCityOrTown] = useState('');
    const [cityOrTownId, setCityOrTownId] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>(savedLanguage ?? 'en');
    const [measurement, setMeasurement] = useState<Measurement>(savedMeasurement ?? 'us');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleLanguageChange(lang: Language) {
        setLanguage(lang);
        changeAppLanguage(lang);
    }

    async function handleContinue() {
        setErrorMessage(null);
        setSubmitting(true);

        const { error } = await saveAccountBasics({
            country,
            language,
            measurement,
        });

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.replace('/(onboarding)/pool-basics' as Href);
    }

    if (authLoading || poolLoading) {
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
    }

    if (!user) {
        return <Redirect href={'/signup' as Href} />;
    }

    if (poolId) {
        return <Redirect href={'/(tabs)/dashboard' as Href} />;
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

                        {/* <TouchableOpacity
                            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            disabled={submitting}
                        >
                            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
                        </TouchableOpacity> */}

                        <View className="progress-bar mt-2">
                            <View className="progress-bar__fill" style={{ width: '10%' }} />
                        </View>

                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                            {t('signup_account_title')}
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            {t('signup_account_subtitle')}
                        </Text>

                        <Preferences
                            country={country}
                            setCountry={setCountry}
                            cityOrTown={cityOrTown}
                            cityOrTownId={cityOrTownId}
                            setCityOrTown={setCityOrTown}
                            setCityOrTownId={setCityOrTownId}
                            language={language}
                            measurement={measurement}
                            setMeasurement={setMeasurement}
                            handleLanguageChange={handleLanguageChange}
                        />

                        {errorMessage ? (
                            <Text className="text-body font-jakarta text-error mt-4">{errorMessage}</Text>
                        ) : null}

                        <View className="mt-6 gap-3">
                            <TouchableOpacity
                                className="btn btn--secondary"
                                onPress={handleContinue}
                                disabled={submitting}
                                activeOpacity={0.85}
                            >
                                <Text className="btn__label btn__label--secondary ml-2 h-5">
                                    {t('signup_continue')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
