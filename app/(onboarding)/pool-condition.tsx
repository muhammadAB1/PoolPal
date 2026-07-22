import { icons, poolConditionImages } from '@/constants/images';
import {
    POOL_CONDITIONS,
    poolConditionTranslationKeys,
} from '@/data/poolConditions';
import { useSupabase } from '@/hooks/supabaseHooks';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import type { PoolCondition } from '@/lib/types';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function PoolConditionScreen() { 
    console.log('I was ran PoolConditionScreen')
    const router = useRouter();
    const { t } = useTranslation();
    const { poolBasicUpdate } = useSupabase();
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);

    const [poolCondition, setPoolCondition] = useState<PoolCondition>('CRYSTAL_CLEAR');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleContinue() {
        setErrorMessage(null);

        if (!poolCondition) {
            return;
        }

        const { error } = await poolBasicUpdate({
            props: {
                poolCondition,
            },
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/pool-size-gallons' as Href));
    }

    function handleSkipForNow() {
        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/pool-size-gallons' as Href));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('pool_condition_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {t('pool_condition_subtitle')}
                    </Text>

                    <View className="mt-6 gap-3">
                        {POOL_CONDITIONS.map((value) => {
                            const keys = poolConditionTranslationKeys[value];

                            return (
                                <ConditionOptionCard
                                    key={value}
                                    image={poolConditionImages[value]}
                                    label={t(keys.label)}
                                    description={t(keys.description)}
                                    selected={poolCondition === value}
                                    onPress={() => {
                                        setPoolCondition(value);
                                        setErrorMessage(null);
                                    }}
                                />
                            );
                        })}
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
                    className="bg-brand-blue rounded-full py-[17px] items-center justify-center"
                    onPress={handleContinue}
                    activeOpacity={0.85}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('pool_condition_continue')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="items-center justify-center mt-3.5 py-1"
                    onPress={handleSkipForNow}
                    activeOpacity={0.7}
                >
                    <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('pool_condition_skip_for_now')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

interface ConditionOptionCardProps {
    image: ImageSourcePropType;
    label: string;
    description: string;
    selected: boolean;
    onPress: () => void;
}

function ConditionOptionCard({
    image,
    label,
    description,
    selected,
    onPress,
}: ConditionOptionCardProps) {
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
                className="w-[60px] h-[60px] rounded-full"
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
