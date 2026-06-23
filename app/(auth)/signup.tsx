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
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { icons } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';

type Country = 'us' | 'es';
type Language = 'en' | 'es';
type Measurement = 'us' | 'metric';

const COUNTRIES: { id: Country; flag: string; name: string; subtitle: string }[] = [
    { id: 'us', flag: '🇺🇸', name: 'United States', subtitle: 'US pool care defaults' },
    { id: 'es', flag: '🇪🇸', name: 'Spain', subtitle: 'Metric pool care defaults' },
];

export default function SignupScreen() {
    const router = useRouter();
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

                        {/* ── Back + Progress ──────────────────────────────────────── */}
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

                        {/* ── Account Basics ───────────────────────────────────────── */}
                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                            Account Basics
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            Just the essentials to save your progress.
                        </Text>

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
                                <Text className="form-label">
                                    Phone number{' '}
                                    <Text className="font-jakarta text-faint">(optional)</Text>
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
                                <Text className="form-label">Password</Text>
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
                                We use this to save your pool profile and reminders.
                            </Text>
                        </View>

                        {/* ── App Preferences ──────────────────────────────────────── */}
                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-10">
                            App Preferences
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2">
                            You can change these anytime.
                        </Text>

                        {/* Country */}
                        <View className="mt-8">
                            <Text className="text-label font-jakarta-bold text-charcoal">Country</Text>
                            <Text className="text-body font-jakarta text-sub mt-1 leading-relaxed">
                                We&apos;ll use this to suggest units and local recommendations.
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

                        {/* Language */}
                        <View className="mt-8">
                            <Text className="text-label font-jakarta-bold text-charcoal">Language</Text>
                            <View className="flex-row gap-3 mt-3">
                                {([
                                    { id: 'en' as Language, label: 'English' },
                                    { id: 'es' as Language, label: 'Spanish' },
                                ]).map((item) => {
                                    const selected = language === item.id;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            className={`flex-1 flex-row items-center gap-2 rounded-xl border px-3.5 py-3 ${selected
                                                ? 'border-surface-mint-border bg-surface-mint'
                                                : 'border-border-default bg-surface-white'
                                                }`}
                                            onPress={() => setLanguage(item.id)}
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

                        {/* Measurement system */}
                        <View className="mt-8">
                            <Text className="text-label font-jakarta-bold text-charcoal">
                                Measurement system
                            </Text>
                            <View className="flex-row gap-3 mt-3">
                                {([
                                    {
                                        id: 'us' as Measurement,
                                        label: 'US System',
                                        units: 'gal, ft, lb, oz',
                                    },
                                    {
                                        id: 'metric' as Measurement,
                                        label: 'Metric System',
                                        units: 'm³, m, kg, L',
                                    },
                                ]).map((item) => {
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
                                We&apos;ll use this for pool volume, chemical amounts, and recommendations.
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
                                <AntDesign name="apple" size={18} color="#1D2939" />
                                <Text className="btn__label btn__label--secondary ml-2">
                                    Sign up with Apple
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* ── Continue ───────────────────────────────────────────── */}
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
