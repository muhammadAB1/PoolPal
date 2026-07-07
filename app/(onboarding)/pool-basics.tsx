import { icons, poolBasicsImages } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PoolType = 'Chlorine' | 'Saltwater' | 'Other';
type ScreenedType = 'Screened' | 'Unscreened';
type UseType = 'Family' | 'VacationHome' | 'ShortTermRental';

export default function PoolBasicsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [poolName, setPoolName] = useState('');
    const [poolType, setPoolType] = useState<PoolType>();
    const [screened, setScreened] = useState<ScreenedType>();
    const [useType, setUseType] = useState<UseType>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { poolBasicInsert } = useSupabase();

    async function handleContinue() {
        // setErrorMessage(null);

        // if (
        //     !poolName.trim()
        //     // !poolType ||
        //     // !screened ||
        //     // !useType
        // ) {
        //     setErrorMessage(t('pool_basics_error'));
        //     return;
        // }

        // const { error } = await poolBasicInsert({
        //     poolName,
        //     poolType,
        //     screened,
        //     useType,
        // });
        // if (error) {
        //     setErrorMessage(error.message);
        //     return;
        // }

        router.replace('/pool-condition');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('pool_basics_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1">
                        {t('pool_basics_subtitle')}
                    </Text>

                    <View className="mt-6">
                        <Text className="form-label">{t('pool_basics_pool_name_label')}</Text>
                        <TextInput
                            className="form-input"
                            value={poolName}
                            onChangeText={(text) => {
                                setPoolName(text);
                                setErrorMessage(null);
                            }}
                            placeholder={t('pool_basics_pool_name_placeholder')}
                            placeholderTextColor="#98A2B3"
                        />
                    </View>

                    <View className="mt-6">
                        <Text className="section__title">{t('pool_basics_pool_type_label')}</Text>
                        <Text className="section__subtitle mt-0.5">
                            {t('pool_basics_pool_type_subtitle')}
                        </Text>

                        <View className="flex-row mt-3 gap-2">
                            {(
                                [
                                    {
                                        value: 'Chlorine' as PoolType,
                                        label: t('pool_basics_type_chlorine'),
                                        desc: t('pool_basics_type_chlorine_desc'),
                                    },
                                    {
                                        value: 'Saltwater' as PoolType,
                                        label: t('pool_basics_type_saltwater'),
                                        desc: t('pool_basics_type_saltwater_desc'),
                                    },
                                    {
                                        value: 'Other' as PoolType,
                                        label: t('pool_basics_type_other'),
                                        desc: t('pool_basics_type_other_desc'),
                                    },
                                ] as const
                            ).map((item) => (
                                <SelectionCard
                                    key={item.value}
                                    image={poolBasicsImages.poolType[item.value]}
                                    label={item.label}
                                    description={item.desc}
                                    selected={poolType === item.value}
                                    onPress={() => {
                                        setPoolType(item.value);
                                        setErrorMessage(null);
                                    }}
                                    imageClassName="w-[52px] h-[52px] rounded-full"
                                />
                            ))}
                        </View>
                    </View>

                    <View className="mt-6">
                        <Text className="section__title">{t('pool_basics_screened_label')}</Text>
                        <Text className="section__subtitle mt-0.5">
                            {t('pool_basics_screened_subtitle')}
                        </Text>

                        <View className="flex-row mt-3 gap-2">
                            {(
                                [
                                    {
                                        value: 'Screened' as ScreenedType,
                                        label: t('pool_basics_screened_yes'),
                                        desc: t('pool_basics_screened_yes_desc'),
                                    },
                                    {
                                        value: 'Unscreened' as ScreenedType,
                                        label: t('pool_basics_screened_no'),
                                        desc: t('pool_basics_screened_no_desc'),
                                    },
                                ] as const
                            ).map((item) => (
                                <SelectionCard
                                    key={item.value}
                                    image={poolBasicsImages.screened[item.value]}
                                    label={item.label}
                                    description={item.desc}
                                    selected={screened === item.value}
                                    onPress={() => {
                                        setScreened(item.value);
                                        setErrorMessage(null);
                                    }}
                                    imageClassName="w-[72px] h-[72px] rounded-full"
                                />
                            ))}
                        </View>
                    </View>

                    <View className="mt-6">
                        <Text className="section__title">{t('pool_basics_use_label')}</Text>
                        <Text className="section__subtitle mt-0.5">
                            {t('pool_basics_use_subtitle')}
                        </Text>

                        <View className="flex-row mt-3 gap-2">
                            {(
                                [
                                    {
                                        value: 'Family' as UseType,
                                        label: t('pool_basics_use_family'),
                                        desc: t('pool_basics_use_family_desc'),
                                    },
                                    {
                                        value: 'VacationHome' as UseType,
                                        label: t('pool_basics_use_vacation'),
                                        desc: t('pool_basics_use_vacation_desc'),
                                    },
                                    {
                                        value: 'ShortTermRental' as UseType,
                                        label: t('pool_basics_use_rental'),
                                        desc: t('pool_basics_use_rental_desc'),
                                    },
                                ] as const
                            ).map((item) => (
                                <SelectionCard
                                    key={item.value}
                                    image={poolBasicsImages.use[item.value]}
                                    label={item.label}
                                    description={item.desc}
                                    selected={useType === item.value}
                                    onPress={() => {
                                        setUseType(item.value);
                                        setErrorMessage(null);
                                    }}
                                    imageClassName="w-[52px] h-[52px] rounded-full"
                                />
                            ))}
                        </View>
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
                        {t('pool_basics_continue')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

interface SelectionCardProps {
    image: ImageSourcePropType;
    label: string;
    description: string;
    selected: boolean;
    onPress: () => void;
    imageClassName: string;
}

function SelectionCard({
    image,
    label,
    description,
    selected,
    onPress,
    imageClassName,
}: SelectionCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`flex-1 rounded-2xl p-2.5 items-center overflow-hidden border-[1.5px] relative ${selected
                ? 'bg-surface-soft-aqua border-brand-aqua'
                : 'bg-surface-white border-border-default'
                }`}
        >
            <View className="absolute top-1 right-1">
                <Image
                    source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                    className="w-[22px] h-[22px]"
                    resizeMode="contain"
                />
            </View>

            <Image
                source={image}
                className={imageClassName}
                resizeMode="contain"
            />

            <Text className="mt-2 text-small font-jakarta-bold text-charcoal text-center" numberOfLines={1}>
                {label}
            </Text>
            <Text className="mt-0.5 text-tiny font-jakarta text-sub text-center" numberOfLines={2}>
                {description}
            </Text>
        </TouchableOpacity>
    );
}
