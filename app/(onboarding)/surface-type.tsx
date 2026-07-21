import { icons, poolSurfaceImages } from '@/constants/images';
import {
    SURFACE_TYPES,
    surfaceTypeTranslationKeys,
} from '@/data/poolSurfaceTypes';
import { useSupabase } from '@/hooks/supabaseHooks';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import type { SurfaceType } from '@/lib/types';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SurfaceTypeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { poolSurfaceInsert } = useSupabase();
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);

    const [surfaceType, setSurfaceType] = useState<SurfaceType>('Plaster');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    async function handleContinue() {
        setErrorMessage(null);

        if (!surfaceType) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await poolSurfaceInsert({
                props: { surfaceType },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            router.replace(isResuming ? resumeOnboardingHref(remainingSteps) : ('/cleaning-setup' as Href));
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : t('pool_basics_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleSkipForNow() {
        router.replace(isResuming ? resumeOnboardingHref(remainingSteps) : ('/cleaning-setup' as Href));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('surface_type_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {t('surface_type_subtitle')}
                    </Text>

                    <View className="mt-6 gap-3">
                        {SURFACE_TYPES.map((value) => {
                            const keys = surfaceTypeTranslationKeys[value];

                            return (
                                <SurfaceOptionCard
                                    key={value}
                                    image={poolSurfaceImages[value]}
                                    label={t(keys.label)}
                                    description={t(keys.description)}
                                    selected={surfaceType === value}
                                    onPress={() => {
                                        setSurfaceType(value);
                                        setErrorMessage(null);
                                        value === 'NotSure' && //scroll to bottom of the screen
                                            setTimeout(() => {
                                                scrollViewRef.current?.scrollToEnd({ animated: true });
                                            }, 100);
                                    }}
                                />
                            );
                        })}

                        {surfaceType === 'NotSure' ? (
                            <TouchableOpacity
                                className="flex-row items-start gap-3 rounded-2xl border border-dashed border-brand-aqua bg-surface-soft-aqua px-4 py-3.5"
                                activeOpacity={0.7}
                                onPress={() => { }}
                            >
                                <View className="w-11 h-11 rounded-xl bg-surface-white items-center justify-center">
                                    <Image
                                        source={icons.camera}
                                        className="w-5 h-5"
                                        resizeMode="contain"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-body font-jakarta-bold text-charcoal">
                                        {t('surface_type_upload_photo_title')}
                                    </Text>
                                    <Text className="text-tiny font-jakarta text-sub mt-1 leading-relaxed">
                                        {t('surface_type_upload_photo_desc')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <View className="h-28" />
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                {errorMessage ? (
                    <Text className="text-body font-jakarta text-error mb-3 text-center">
                        {errorMessage}
                    </Text>
                ) : null}
                <TouchableOpacity
                    className={`bg-brand-blue rounded-full py-[17px] items-center justify-center ${isSubmitting ? 'opacity-60' : ''}`}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('surface_type_continue')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="items-center justify-center mt-3.5 py-1"
                    onPress={handleSkipForNow}
                    activeOpacity={0.7}
                >
                    <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('surface_type_skip_for_now')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

interface SurfaceOptionCardProps {
    image: ImageSourcePropType;
    label: string;
    description: string;
    selected: boolean;
    onPress: () => void;
}

function SurfaceOptionCard({
    image,
    label,
    description,
    selected,
    onPress,
}: SurfaceOptionCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`flex-row items-center rounded-2xl px-3 py-3 border-[1.5px] gap-3 ${selected
                ? 'bg-surface-soft-aqua border-brand-aqua'
                : 'bg-surface-white border-border-default'
                }`}
        >
            <Image
                source={image}
                className="w-[60px] h-[60px] rounded-xl"
                resizeMode="cover"
            />

            <View className="flex-1 pr-1">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">
                    {label}
                </Text>
                <Text className="mt-0.5 text-body font-jakarta text-sub">
                    {description}
                </Text>
            </View>

            <Image
                source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                className="w-[22px] h-[22px]"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}
