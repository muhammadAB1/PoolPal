import { icons, poolConditionImages } from '@/constants/images';
import {
    POOL_CONDITIONS,
    poolConditionTranslationKeys,
} from '@/data/poolConditions';
import { useSupabase } from '@/hooks/supabaseHooks';
import type { PoolCondition } from '@/lib/types';
import { useRouter } from 'expo-router';
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
    const router = useRouter();
    const { t } = useTranslation();
    const { poolBasicUpdate } = useSupabase();

    const [poolCondition, setPoolCondition] = useState<PoolCondition>('CRYSTAL_CLEAR');

    async function handleContinue() {
        if (!poolCondition) {
            return;
        }

        await poolBasicUpdate({
            props: {
                profileCompletionScore: 20,
                poolCondition,
            },
        });

        router.replace('/dashboard');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-5 pt-2">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center -ml-2"
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={icons.backArrow}
                            className="w-5 h-5"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View className="progress-bar mt-2">
                        <View className="progress-bar__fill" style={{ width: '20%' }} />
                    </View>

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
                                    onPress={() => setPoolCondition(value)}
                                />
                            );
                        })}
                    </View>

                    <View className="h-28" />
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                <TouchableOpacity
                    className="bg-brand-blue rounded-full py-[17px] items-center justify-center"
                    onPress={handleContinue}
                    activeOpacity={0.85}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('pool_condition_continue')}
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
                className="w-[50px] h-[50px] rounded-full"
                resizeMode="cover"
            />

            <View className="flex-1 pr-1">
                <Text className="text-body font-jakarta-bold text-charcoal">
                    {label}
                </Text>
                <Text className="mt-0.5 text-small font-jakarta text-sub">
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
