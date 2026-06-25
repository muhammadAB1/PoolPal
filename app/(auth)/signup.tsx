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
import { en, es } from '@/data/translations';

type Country = 'us' | 'es';
type Language = 'en' | 'es';
type Measurement = 'us' | 'metric';

const COUNTRIES: { id: Country; flag: string; name: string; subtitle: string }[] = [
    { id: 'us', flag: '🇺🇸', name: en.signup_country_us_name, subtitle: en.signup_country_us_subtitle },
    { id: 'es', flag: '🇪🇸', name: es.signup_country_es_name, subtitle: es.signup_country_es_subtitle },
];

const LANGUAGES: { id: Language; label: string }[] = [
    { id: 'en', label: en.signup_language_en },
    { id: 'es', label: es.signup_language_es },
];

const MEASUREMENTS: { id: Measurement; label: string; units: string }[] = [
    { id: 'us', label: en.signup_measurement_us, units: en.signup_measurement_us_units },
    { id: 'metric', label: es.signup_measurement_metric, units: es.signup_measurement_metric_units },
];

export default function SignupScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { signUp, signInWithGoogle, signInWithApple } = useSupabase();

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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

        const { error } = await signUp({ email, password, firstName, phone, country, language, measurement });

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

        const { error } = await signInWithGoogle(country, language, measurement);

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

        const { error } = await signInWithApple(country, language, measurement);

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.replace('/');
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
                            {t('signup_account_title')}
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            {t('signup_account_subtitle')}
                        </Text>

                        <View className="mt-8 gap-5">
                            <View>
                                <Text className="form-label">{t('signup_first_name')}</Text>
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
                                <Text className="form-label">
                                    {t('signup_phone')}{' '}
                                    <Text className="font-jakarta text-faint">{t('signup_phone_optional')}</Text>
                                </Text>
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

                        <View className="card--info flex-row items-start gap-3 px-4 py-3.5 mt-6">
                            <Image source={icons.info} className="w-5 h-5 mt-0.5" resizeMode="contain" />
                            <Text className="flex-1 text-body font-jakarta text-sub leading-relaxed">
                                {t('signup_save_note')}
                            </Text>
                        </View>

                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-10">
                            {t('signup_preferences_title')}
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            {t('signup_preferences_subtitle')}
                        </Text>

                        <View className="mt-8">
                            <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_country')}</Text>
                            <Text className="text-body font-jakarta text-sub mt-1 leading-relaxed">
                                {t('signup_country_note')}
                            </Text>

                            <View className="flex-row gap-3 mt-4">
                                {COUNTRIES.map((item) => {
                                    const selected = country === item.id;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            className={`flex-1 rounded-2xl border p-3.5 ${selected
                                                ? 'border-surface-mint-border bg-surface-mint'
                                                : 'border-border-default bg-surface-white'
                                                }`}
                                            onPress={() => setCountry(item.id)}
                                            activeOpacity={0.85}
                                        >
                                            <View className="flex-row items-start justify-between">
                                                <View className="w-9 h-9 rounded-full bg-surface-bg items-center justify-center">
                                                    <Text className="text-[18px] leading-5">{item.flag}</Text>
                                                </View>
                                                {selected ? (
                                                    <Image
                                                        source={icons.selectedCheckBadge}
                                                        className="w-5 h-5"
                                                        resizeMode="contain"
                                                    />
                                                ) : null}
                                            </View>
                                            <Text className="text-body font-jakarta-bold text-charcoal mt-3">
                                                {item.name}
                                            </Text>
                                            <Text className="text-tiny font-jakarta text-sub mt-0.5">
                                                {item.subtitle}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mt-8">
                            <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_language')}</Text>
                            <View className="flex-row gap-3 mt-3">
                                {LANGUAGES.map((item) => {
                                    const selected = language === item.id;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            className={`flex-1 flex-row items-center gap-2 rounded-xl border px-3.5 py-3 ${selected
                                                ? 'border-surface-mint-border bg-surface-mint'
                                                : 'border-border-default bg-surface-white'
                                                }`}
                                            onPress={() => handleLanguageChange(item.id)}
                                            activeOpacity={0.85}
                                        >
                                            <Image
                                                source={selected ? icons.radioSelected : icons.radioEmpty}
                                                className="w-5 h-5"
                                                resizeMode="contain"
                                            />
                                            <Text className="text-body font-jakarta-semibold text-charcoal">
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mt-8">
                            <Text className="text-label font-jakarta-bold text-charcoal">
                                {t('signup_measurement')}
                            </Text>
                            <View className="flex-row gap-3 mt-3">
                                {MEASUREMENTS.map((item) => {
                                    const selected = measurement === item.id;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            className={`flex-1 rounded-xl border px-3.5 py-3 ${selected
                                                ? 'border-surface-mint-border bg-surface-mint'
                                                : 'border-border-default bg-surface-white'
                                                }`}
                                            onPress={() => setMeasurement(item.id)}
                                            activeOpacity={0.85}
                                        >
                                            <View className="flex-row items-center gap-2">
                                                <Image
                                                    source={selected ? icons.radioSelected : icons.radioEmpty}
                                                    className="w-5 h-5"
                                                    resizeMode="contain"
                                                />
                                                <Text className="text-body font-jakarta-bold text-charcoal">
                                                    {item.label}
                                                </Text>
                                            </View>
                                            <Text className="text-tiny font-jakarta text-sub mt-1 ml-7">
                                                {item.units}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="card--info flex-row items-start gap-3 px-4 py-3.5 mt-6">
                            <MaterialCommunityIcons name="ruler" size={20} color="#0E97DC" />
                            <Text className="flex-1 text-body font-jakarta text-sub leading-relaxed">
                                {t('signup_measurement_note')}
                            </Text>
                        </View>

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
                                <Text className="btn__label btn__label--secondary ml-2">
                                    {t('signup_google')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="btn btn--secondary"
                                onPress={handleAppleSignUp}
                                disabled={submitting}
                                activeOpacity={0.85}
                            >
                                <AntDesign name="apple" size={18} color="#1D2939" />
                                <Text className="btn__label btn__label--secondary ml-2">
                                    {t('signup_apple')}
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

