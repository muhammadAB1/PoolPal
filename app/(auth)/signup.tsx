import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { graphics, icons } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';
import { useAuthScreenGuard } from '@/hooks/useAuthScreenGuard';

export default function SignupScreen() {
    const { t } = useTranslation();
    const { signInWithGoogle, signUpWithEmail } = useSupabase();

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const authRedirect = useAuthScreenGuard();

    async function handleGoogleSignUp() {
        setErrorMessage(null);
        setSubmitting(true);

        const { error } = await signInWithGoogle();

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }
    }

    async function handleEmailSignUp() {
        setErrorMessage(null);
        setSubmitting(true);

        const { error } = await signUpWithEmail(firstName, email, password);

        setSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
        }
    }

    if (authRedirect) {
        return <Redirect href={authRedirect} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-5 pt-2">

                        <TouchableOpacity
                            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
                        </TouchableOpacity>

                        <View className="items-center mt-3">
                            <Image
                                source={graphics.poolTonicLogo}
                                style={{ width: 72, height: 72 }}
                                resizeMode="contain"
                            />
                            <Text className="font-jakarta-extrabold text-brand-navy mt-2" style={{ fontSize: 25 }}>
                                PoolTonic
                            </Text>
                        </View>

                        <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6 text-center">
                            {t('signup_create_title')}
                        </Text>
                        <Text className="text-body font-jakarta text-sub mt-2 text-center leading-relaxed">
                            {t('signup_create_subtitle')}
                        </Text>

                        <TouchableOpacity
                            className="btn btn--secondary mt-7 min-h-14"
                            onPress={handleGoogleSignUp}
                            disabled={submitting}
                            activeOpacity={0.85}
                        >
                            <AntDesign name="google" size={18} color="#1D2939" />
                            <Text className="btn__label btn__label--secondary ml-2" style={{ lineHeight: 22 }}>
                                {t('signup_google')}
                            </Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center gap-3 my-6">
                            <View className="divider flex-1" />
                            <Text className="text-small font-jakarta text-faint">{t('signup_or')}</Text>
                            <View className="divider flex-1" />
                        </View>

                        <View>
                            <Text className="form-label">{t('signup_first_name')}</Text>
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder={t('signup_first_name_placeholder')}
                                placeholderTextColor="#98A2B3"
                                autoCapitalize="words"
                                autoComplete="name"
                                textContentType="givenName"
                                className="form-input"
                                editable={!submitting}
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="form-label">{t('signup_email')}</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('signup_email_placeholder')}
                                placeholderTextColor="#98A2B3"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                textContentType="emailAddress"
                                className="form-input"
                                editable={!submitting}
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="form-label">{t('signup_password')}</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder={t('signup_password_placeholder')}
                                placeholderTextColor="#98A2B3"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="new-password"
                                textContentType="newPassword"
                                className="form-input"
                                editable={!submitting}
                            />
                            <Text className="text-tiny font-jakarta text-faint mt-1.5">
                                {t('signup_password_hint')}
                            </Text>
                        </View>

                        {errorMessage ? (
                            <Text className="text-body font-jakarta text-error mt-4">{errorMessage}</Text>
                        ) : null}

                        <View className="mt-6 gap-3">
                            <TouchableOpacity
                                className="btn btn--primary"
                                onPress={handleEmailSignUp}
                                disabled={submitting}
                                activeOpacity={0.85}
                            >
                                <Text className="btn__label btn__label--primary">
                                    {t('signup_continue')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center justify-center mt-6">
                            <Text className="text-body font-jakarta text-sub">
                                {t('signup_have_account')}{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/signin')} activeOpacity={0.75}>
                                <Text className="text-body font-jakarta-bold text-brand-blue">
                                    {t('signup_sign_in')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
