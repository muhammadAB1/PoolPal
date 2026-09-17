import { icons, poolBasicsImages } from '@/constants/images';
import { useSupabase } from '@/hooks/supabaseHooks';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import type {
    HotTubType,
    ManualChlorineStatus,
    NumberOfPoolUsers,
    OccupancyPattern,
    PoolType,
    RentalActivity,
    SaltSystemStatus,
    ScreenedType,
    SpaAttachmentType,
    SpaSanitizer,
    UsageFrequency,
    UseType,
} from '@/lib/types';
import { usePool } from '@/providers/PoolProvider';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    type ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

type PoolBasicsFields = {
    poolName?: string;
    poolType?: PoolType;
    screened?: ScreenedType;
    hasHotTub?: HotTubType;
    spaAttachment?: SpaAttachmentType;
    useType?: UseType;
    usageFrequency?: UsageFrequency;
    numberOfPoolUsers?: NumberOfPoolUsers;
    saltSystemStatus?: SaltSystemStatus;
    manualChlorine?: ManualChlorineStatus;
    spaSanitizer?: SpaSanitizer;
    occupancyPattern?: OccupancyPattern;
    unusedMonths?: string[];
    rentalActivity?: RentalActivity;
    activeMonths?: string[];
};

type PoolBasicsScreenProps = {
    initialPoolBasics?: PoolBasicsFields | null;
    showSkip?: boolean;
    onSuccess?: () => void;
    markStale?: boolean;
};

type CardOption<T extends string> = {
    value: T;
    label: string;
    description?: string;
    image?: ImageSourcePropType;
};

export default function PoolBasicsScreen({
    initialPoolBasics,
    showSkip = true,
    onSuccess,
    markStale = true,
}: PoolBasicsScreenProps = {}) {
    const router = useRouter();
    const { t } = useTranslation();
    const { width: screenWidth } = useWindowDimensions();
    const { resume, remaining, newPool } = useLocalSearchParams<{ resume?: string; remaining?: string; newPool?: string }>();
    const isResuming = resume === '1';
    const isNewPool = newPool === '1';
    const remainingSteps = parseRemainingSteps(remaining);
    const isEmbedded = Boolean(onSuccess);
    const createdNewPool = useRef(false);

    const [poolName, setPoolName] = useState<string>(initialPoolBasics?.poolName ?? '');
    const [poolType, setPoolType] = useState<PoolType | undefined>(initialPoolBasics?.poolType);
    const [environment, setEnvironment] = useState<'outdoor' | 'screened' | 'covered' | 'indoor' | undefined>(
        initialPoolBasics?.screened === 'Screened'
            ? 'screened'
            : initialPoolBasics?.screened === 'Unscreened'
                ? 'outdoor'
                : undefined,
    );
    const [hasHotTub, setHasHotTub] = useState<HotTubType | undefined>(initialPoolBasics?.hasHotTub);
    const [spaAttachment, setSpaAttachment] = useState<SpaAttachmentType | undefined>(initialPoolBasics?.spaAttachment);
    const [useType, setUseType] = useState<UseType | undefined>(initialPoolBasics?.useType);
    const [usageFrequency, setUsageFrequency] = useState<UsageFrequency | undefined>(initialPoolBasics?.usageFrequency);
    const [batherLoad, setBatherLoad] = useState<NumberOfPoolUsers | undefined>(
        initialPoolBasics?.numberOfPoolUsers,
    );
    const [saltSystemStatus, setSaltSystemStatus] = useState<SaltSystemStatus | undefined>(initialPoolBasics?.saltSystemStatus);
    const [manualChlorine, setManualChlorine] = useState<ManualChlorineStatus | undefined>(initialPoolBasics?.manualChlorine);
    const [spaSanitizer, setSpaSanitizer] = useState<SpaSanitizer | undefined>(initialPoolBasics?.spaSanitizer);
    const [occupancyPattern, setOccupancyPattern] = useState<OccupancyPattern | undefined>(initialPoolBasics?.occupancyPattern);
    const [unusedMonths, setUnusedMonths] = useState<string[]>(initialPoolBasics?.unusedMonths ?? []);
    const [rentalActivity, setRentalActivity] = useState<RentalActivity | undefined>(initialPoolBasics?.rentalActivity);
    const [activeMonths, setActiveMonths] = useState<string[]>(initialPoolBasics?.activeMonths ?? []);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const { poolBasicInsert } = useSupabase();
    const { refreshPools } = usePool();

    const pageHorizontalPadding = 20;
    const gridGap = 10;
    const cardWidth = Math.max(138, Math.floor((screenWidth - pageHorizontalPadding * 2 - gridGap) / 2));

    const missing = useMemo(() => {
        const keys: string[] = [];
        if (!poolName.trim()) keys.push(t('pool_basics_missing_name'));
        if (!poolType) keys.push(t('pool_basics_missing_sanitizer'));
        if (poolType === 'Saltwater' && saltSystemStatus !== 'working' && saltSystemStatus !== 'not_working') {
            keys.push(t('pool_basics_missing_salt_status'));
        }
        if (poolType === 'Saltwater' && saltSystemStatus === 'not_working' && !manualChlorine) {
            keys.push(t('pool_basics_missing_manual_chlorine'));
        }
        if (!environment) keys.push(t('pool_basics_missing_environment'));
        if (!hasHotTub) keys.push(t('pool_basics_missing_spa'));
        if (hasHotTub === 'Yes' && !spaAttachment) keys.push(t('pool_basics_missing_spa_type'));
        if (hasHotTub === 'Yes' && spaAttachment === 'Detached' && !spaSanitizer) {
            keys.push(t('pool_basics_missing_spa_sanitizer'));
        }
        if (!useType) keys.push(t('pool_basics_missing_property'));
        if (useType === 'VacationHome' && !occupancyPattern) keys.push(t('pool_basics_missing_seasonality'));
        if (useType === 'VacationHome' && occupancyPattern === 'seasonal' && unusedMonths.length === 0) {
            keys.push(t('pool_basics_missing_months'));
        }
        if (useType === 'ShortTermRental' && !rentalActivity) keys.push(t('pool_basics_missing_rental_activity'));
        if (useType === 'ShortTermRental' && rentalActivity === 'seasonal' && activeMonths.length === 0) {
            keys.push(t('pool_basics_missing_months'));
        }
        if (!usageFrequency) keys.push(t('pool_basics_missing_usage'));
        if (!batherLoad) keys.push(t('pool_basics_missing_bathers'));
        return keys;
    }, [
        poolName,
        poolType,
        saltSystemStatus,
        manualChlorine,
        environment,
        hasHotTub,
        spaAttachment,
        spaSanitizer,
        useType,
        occupancyPattern,
        unusedMonths,
        rentalActivity,
        activeMonths,
        usageFrequency,
        batherLoad,
        t,
    ]);

    const requiredComplete = missing.length === 0;

    function clearSaveError() {
        if (errorMessage) setErrorMessage(null);
    }

    function choosePoolType(value: PoolType) {
        setPoolType(value);
        if (value !== 'Saltwater') {
            setSaltSystemStatus(undefined);
            setManualChlorine(undefined);
        }
        clearSaveError();
    }

    function chooseSaltStatus(value: SaltSystemStatus) {
        setSaltSystemStatus(value);
        if (value === 'working') setManualChlorine(undefined);
        clearSaveError();
    }

    function chooseHasHotTub(value: HotTubType) {
        setHasHotTub(value);
        if (value === 'No') {
            setSpaAttachment(undefined);
            setSpaSanitizer(undefined);
        }
        clearSaveError();
    }

    function chooseSpaAttachment(value: SpaAttachmentType) {
        setSpaAttachment(value);
        if (value !== 'Detached') setSpaSanitizer(undefined);
        clearSaveError();
    }

    function chooseUseType(value: UseType) {
        setUseType(value);
        if (value !== 'VacationHome') {
            setOccupancyPattern(undefined);
            setUnusedMonths([]);
        }
        if (value !== 'ShortTermRental') {
            setRentalActivity(undefined);
            setActiveMonths([]);
        }
        clearSaveError();
    }

    function toggleMonth(month: string, setter: Dispatch<SetStateAction<string[]>>) {
        setter((current) => (current.includes(month) ? current.filter((item) => item !== month) : [...current, month]));
        clearSaveError();
    }

    async function handleContinue() {
        setErrorMessage(null);
        if (!requiredComplete) {
            setErrorMessage(t('pool_basics_required_visible_error'));
            return;
        }

        setSaving(true);
        const { error } = await poolBasicInsert({
            poolName,
            poolType,
            screened: environment === 'screened' ? 'Screened' : environment ? 'Unscreened' : undefined,
            hasHotTub,
            spaAttachment,
            useType,
            usageFrequency,
            numberOfUsers: batherLoad,
            saltSystemStatus,
            manualChlorine,
            spaSanitizer,
            occupancyPattern,
            unusedMonths,
            rentalActivity,
            activeMonths,
            markStale,
            forceCreate: isNewPool && !createdNewPool.current,
        });
        setSaving(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }
        if (isNewPool) {
            createdNewPool.current = true;
            await refreshPools({ silent: true });
        }

        if (onSuccess) {
            onSuccess();
            return;
        }

        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/pool-size-gallons' as Href));
    }

    function handleSkipForNow() {
        router.push(isResuming ? resumeOnboardingHref(remainingSteps) : ('/pool-size-gallons' as Href));
    }

    const sanitizerOptions: CardOption<PoolType>[] = [
        {
            value: 'Chlorine',
            label: t('pool_basics_sanitizer_chlorine'),
            description: t('pool_basics_sanitizer_chlorine_desc'),
            image: poolBasicsImages.poolType.Chlorine,
        },
        {
            value: 'Bromine',
            label: t('pool_basics_sanitizer_bromine'),
            description: t('pool_basics_sanitizer_bromine_desc'),
            image: poolBasicsImages.poolType.Bromine,
        },
        {
            value: 'Saltwater',
            label: t('pool_basics_sanitizer_saltwater'),
            description: t('pool_basics_sanitizer_saltwater_desc'),
            image: poolBasicsImages.poolType.Saltwater,
        },
        {
            value: 'Other',
            label: t('pool_basics_sanitizer_unknown'),
            description: t('pool_basics_sanitizer_unknown_desc'),
            image: poolBasicsImages.poolType.Other,
        },
    ];

    const spaSanitizerOptions = [
        { value: 'chlorine' as SpaSanitizer, label: t('pool_basics_sanitizer_chlorine') },
        { value: 'bromine' as SpaSanitizer, label: t('pool_basics_sanitizer_bromine') },
        { value: 'saltwater' as SpaSanitizer, label: t('pool_basics_sanitizer_saltwater') },
        { value: 'unknown' as SpaSanitizer, label: t('pool_basics_sanitizer_unknown') },
    ];

    const useOptions: CardOption<UseType>[] = [
        {
            value: 'Family',
            label: t('pool_basics_property_primary'),
            description: t('pool_basics_property_primary_desc'),
            image: poolBasicsImages.use.Family,
        },
        {
            value: 'VacationHome',
            label: t('pool_basics_property_second'),
            description: t('pool_basics_property_second_desc'),
            image: poolBasicsImages.use.VacationHome,
        },
        {
            value: 'ShortTermRental',
            label: t('pool_basics_property_rental'),
            description: t('pool_basics_property_rental_desc'),
            image: poolBasicsImages.use.ShortTermRental,
        },
    ];

    const continueDisabled = !requiredComplete || saving;
    const showSkipLink = showSkip && !isNewPool;

    const content = (
        <>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: showSkipLink ? 168 : 124 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.page}>
                    <Text style={styles.h1}>{t('pool_basics_title')}</Text>
                    <Text style={styles.subtitle}>{t('pool_basics_subtitle')}</Text>

                    <Section title={t('pool_basics_name_label')} subtitle={t('pool_basics_name_subtitle')}>
                        <TextInput
                            value={poolName}
                            onChangeText={(text) => {
                                setPoolName(text);
                                clearSaveError();
                            }}
                            placeholder={t('pool_basics_name_placeholder')}
                            placeholderTextColor="#98A2B3"
                            style={styles.input}
                        />
                    </Section>

                    <Section title={t('pool_basics_sanitizer_title')} subtitle={t('pool_basics_sanitizer_subtitle')}>
                        <View style={styles.grid}>
                            {sanitizerOptions.map((option) => (
                                <SelectionCard
                                    key={option.value}
                                    {...option}
                                    width={cardWidth}
                                    selected={poolType === option.value}
                                    onPress={() => choosePoolType(option.value)}
                                />
                            ))}
                        </View>
                    </Section>

                    {poolType === 'Saltwater' ? (
                        <Conditional title={t('pool_basics_salt_status_title')}>
                            <ChoiceGrid
                                options={[
                                    { value: 'working', label: t('pool_basics_salt_status_working') },
                                    { value: 'not_working', label: t('pool_basics_salt_status_not_working') },
                                ]}
                                selected={saltSystemStatus}
                                onSelect={(value) => chooseSaltStatus(value as SaltSystemStatus)}
                            />
                            {saltSystemStatus === 'not_working' ? (
                                <View style={styles.nestedBlock}>
                                    <Text style={styles.sectionTitle}>{t('pool_basics_manual_chlorine_title')}</Text>
                                    <View style={styles.followUpOptions}>
                                        <ChoiceGrid
                                            options={[
                                                { value: 'yes', label: t('common_yes') },
                                                { value: 'no', label: t('common_no') },
                                            ]}
                                            selected={manualChlorine}
                                            onSelect={(value) => {
                                                setManualChlorine(value as ManualChlorineStatus);
                                                clearSaveError();
                                            }}
                                        />
                                    </View>
                                    {manualChlorine === 'yes' || manualChlorine === 'no' ? (
                                        <View style={styles.saltFailureNotice}>
                                            <Text style={styles.saltFailureNoticeText}>
                                                {t(
                                                    manualChlorine === 'yes'
                                                        ? 'pool_basics_salt_failure_manual_yes_message'
                                                        : 'pool_basics_salt_failure_manual_no_message',
                                                )}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            ) : null}
                        </Conditional>
                    ) : null}

                    <Section title={t('pool_basics_environment_title')} subtitle={t('pool_basics_environment_subtitle')}>
                        <View style={styles.grid}>
                            {([
                                { value: 'outdoor' as const, label: t('pool_basics_environment_outdoor'), description: t('pool_basics_environment_outdoor_desc'), image: poolBasicsImages.environment.outdoor },
                                { value: 'screened' as const, label: t('pool_basics_environment_screened'), description: t('pool_basics_environment_screened_desc'), image: poolBasicsImages.environment.screened },
                                { value: 'covered' as const, label: t('pool_basics_environment_covered'), description: t('pool_basics_environment_covered_desc'), image: poolBasicsImages.environment.covered },
                                { value: 'indoor' as const, label: t('pool_basics_environment_indoor'), description: t('pool_basics_environment_indoor_desc'), image: poolBasicsImages.environment.indoor },
                            ]).map((option) => (
                                <SelectionCard
                                    key={option.value}
                                    {...option}
                                    width={cardWidth}
                                    selected={environment === option.value}
                                    onPress={() => {
                                        setEnvironment(option.value);
                                        clearSaveError();
                                    }}
                                />
                            ))}
                        </View>
                    </Section>

                    <Section title={t('pool_basics_hot_tub_label')} subtitle={t('pool_basics_hot_tub_subtitle')}>
                        <View style={styles.inlineChoices}>
                            <InlineChoice
                                label={t('common_yes')}
                                selected={hasHotTub === 'Yes'}
                                onPress={() => chooseHasHotTub('Yes')}
                            />
                            <InlineChoice
                                label={t('common_no')}
                                selected={hasHotTub === 'No'}
                                onPress={() => chooseHasHotTub('No')}
                            />
                        </View>

                        {hasHotTub === 'Yes' ? (
                            <View style={styles.nestedBlock}>
                                <Text style={styles.sectionTitle}>{t('pool_basics_spa_type_title')}</Text>
                                <View style={styles.followUpOptions}>
                                    <View style={styles.grid}>
                                        <SelectionCard
                                            value="Attached"
                                            label={t('pool_basics_spa_attached')}
                                            description={t('pool_basics_spa_attached_desc')}
                                            image={poolBasicsImages.hotTub.Attached}
                                            width={cardWidth}
                                            selected={spaAttachment === 'Attached'}
                                            onPress={() => chooseSpaAttachment('Attached')}
                                        />
                                        <SelectionCard
                                            value="Detached"
                                            label={t('pool_basics_spa_standalone')}
                                            description={t('pool_basics_spa_standalone_desc')}
                                            image={poolBasicsImages.hotTub.Detached}
                                            width={cardWidth}
                                            selected={spaAttachment === 'Detached'}
                                            onPress={() => chooseSpaAttachment('Detached')}
                                        />
                                    </View>
                                </View>

                                {spaAttachment === 'Detached' ? (
                                    <View style={styles.nestedBlock}>
                                        <Text style={styles.sectionTitle}>{t('pool_basics_spa_sanitizer_title')}</Text>
                                        <ChoiceGrid
                                            options={spaSanitizerOptions}
                                            selected={spaSanitizer}
                                            onSelect={(value) => {
                                                setSpaSanitizer(value as SpaSanitizer);
                                                clearSaveError();
                                            }}
                                        />
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                    </Section>

                    <Section title={t('pool_basics_property_title')} subtitle={t('pool_basics_property_subtitle')}>
                        <View style={styles.stack}>
                            {useOptions.map((option) => (
                                <WideSelectionCard
                                    key={option.value}
                                    {...option}
                                    selected={useType === option.value}
                                    onPress={() => chooseUseType(option.value)}
                                />
                            ))}
                        </View>

                        {useType === 'VacationHome' ? (
                            <View style={styles.nestedBlock}>
                                <Text style={styles.sectionTitle}>{t('pool_basics_year_round_title')}</Text>
                                <View style={styles.followUpOptions}>
                                    <ChoiceGrid
                                        options={[
                                            { value: 'year_round', label: t('pool_basics_year_round_yes') },
                                            { value: 'seasonal', label: t('pool_basics_year_round_no') },
                                        ]}
                                        selected={occupancyPattern}
                                        onSelect={(value) => {
                                            setOccupancyPattern(value as OccupancyPattern);
                                            if (value !== 'seasonal') setUnusedMonths([]);
                                            clearSaveError();
                                        }}
                                    />
                                </View>
                                {occupancyPattern === 'seasonal' ? (
                                    <MonthPicker
                                        title={t('pool_basics_unused_months_title')}
                                        selected={unusedMonths}
                                        onToggle={(month) => toggleMonth(month, setUnusedMonths)}
                                    />
                                ) : null}
                            </View>
                        ) : null}

                        {useType === 'ShortTermRental' ? (
                            <View style={styles.nestedBlock}>
                                <Text style={styles.sectionTitle}>{t('pool_basics_rental_activity_title')}</Text>
                                <View style={styles.rentalActivityOptions}>
                                    <ChoiceGrid
                                        options={[
                                            { value: 'year_round', label: t('pool_basics_rental_year_round') },
                                            { value: 'seasonal', label: t('pool_basics_rental_seasonal') },
                                        ]}
                                        selected={rentalActivity}
                                        spacious
                                        onSelect={(value) => {
                                            setRentalActivity(value as RentalActivity);
                                            if (value !== 'seasonal') setActiveMonths([]);
                                            clearSaveError();
                                        }}
                                    />
                                </View>
                                {rentalActivity === 'seasonal' ? (
                                    <MonthPicker
                                        title={t('pool_basics_active_months_title')}
                                        selected={activeMonths}
                                        onToggle={(month) => toggleMonth(month, setActiveMonths)}
                                    />
                                ) : null}
                            </View>
                        ) : null}
                    </Section>

                    <Section title={t('pool_basics_usage_frequency_label')} subtitle={t('pool_basics_usage_frequency_subtitle')}>
                        <ChoiceGrid
                            options={['0-1', '2-3', '4-5', '6-7'].map((value) => ({
                                value,
                                label: t(`pool_basics_usage_frequency_${value.replace('-', '_')}`),
                            }))}
                            selected={usageFrequency}
                            onSelect={(value) => {
                                setUsageFrequency(value as UsageFrequency);
                                clearSaveError();
                            }}
                        />
                    </Section>

                    <Section title={t('pool_basics_bather_title')} subtitle={t('pool_basics_bather_subtitle')}>
                        <ChoiceGrid
                            options={[
                                { value: '1-2', label: t('pool_basics_bather_1_2') },
                                { value: '3-5', label: t('pool_basics_bather_3_5') },
                                { value: '6-10', label: t('pool_basics_bather_6_10') },
                                { value: '10+', label: t('pool_basics_bather_10_plus') },
                            ]}
                            selected={batherLoad}
                            onSelect={(value) => {
                                setBatherLoad(value as NumberOfPoolUsers);
                                clearSaveError();
                            }}
                        />
                    </Section>

                    {!requiredComplete ? (
                        <View style={styles.missingCard}>
                            <Text style={styles.missingTitle}>{t('pool_basics_missing_title')}</Text>
                            {missing.slice(0, 5).map((item) => (
                                <Text key={item} style={styles.missingText}>• {item}</Text>
                            ))}
                        </View>
                    ) : null}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                {errorMessage ? (
                    <Text className="text-body font-jakarta text-error mb-3 text-center">
                        {errorMessage}
                    </Text>
                ) : null}
                <TouchableOpacity
                    className={`bg-brand-blue rounded-full py-4.25 items-center justify-center ${continueDisabled ? 'opacity-50' : ''}`}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={continueDisabled}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('pool_basics_continue')}
                    </Text>
                </TouchableOpacity>
                {showSkipLink ? (
                    <TouchableOpacity
                        className="items-center justify-center mt-3.5 py-1"
                        onPress={handleSkipForNow}
                        activeOpacity={0.7}
                    >
                        <Text className="text-body font-jakarta-bold text-brand-blue">
                            {t('pool_basics_skip_for_now')}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </>
    );

    if (isEmbedded) {
        return <View className="flex-1">{content}</View>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {content}
        </SafeAreaView>
    );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

function Conditional({ title, children }: { title: string; children: ReactNode }) {
    return (
        <View style={styles.conditional}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

function SelectionCard<T extends string>({
    label,
    description,
    image,
    selected,
    onPress,
    width,
}: CardOption<T> & { selected: boolean; onPress: () => void; width: number }) {
    return (
        <TouchableOpacity
            style={[styles.card, { width }, selected && styles.selected]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.check}>
                <Image
                    source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                    style={styles.checkImage}
                    resizeMode="contain"
                />
            </View>
            {image ? <Image source={image} style={styles.optionImage} resizeMode="contain" /> : null}
            <Text style={styles.cardTitle}>{label}</Text>
            {description ? <Text style={styles.cardDescription}>{description}</Text> : null}
        </TouchableOpacity>
    );
}

function WideSelectionCard<T extends string>({
    label,
    description,
    image,
    selected,
    onPress,
}: CardOption<T> & { selected: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity style={[styles.wideCard, selected && styles.selected]} onPress={onPress} activeOpacity={0.8}>
            {image ? <Image source={image} style={styles.wideImage} resizeMode="contain" /> : null}
            <View style={styles.wideCopy}>
                <Text style={styles.wideTitle}>{label}</Text>
                {description ? <Text style={styles.wideDescription}>{description}</Text> : null}
            </View>
            <Image
                source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                style={styles.choiceCheck}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

function InlineChoice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity style={[styles.inlineChoice, selected && styles.selected]} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.choiceTitle}>{label}</Text>
            <Image
                source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                style={styles.choiceCheck}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

function ChoiceGrid({
    options,
    selected,
    onSelect,
    spacious = false,
}: {
    options: { value: string; label: string }[];
    selected?: string;
    onSelect: (value: string) => void;
    spacious?: boolean;
}) {
    return (
        <View style={[styles.grid, spacious && styles.spaciousChoiceGrid]}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.smallChoice,
                        spacious && styles.spaciousSmallChoice,
                        selected === option.value && styles.selected,
                    ]}
                    onPress={() => onSelect(option.value)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.smallChoiceText}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

function MonthPicker({ title, selected, onToggle }: { title: string; selected: string[]; onToggle: (month: string) => void }) {
    const { t } = useTranslation();
    return (
        <View style={styles.nestedBlock}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.monthGrid}>
                {MONTHS.map((month) => (
                    <TouchableOpacity
                        key={month}
                        style={[styles.month, selected.includes(month) && styles.monthSelected]}
                        onPress={() => onToggle(month)}
                    >
                        <Text style={[styles.monthText, selected.includes(month) && styles.monthTextSelected]}>
                            {t(`month_short_${month.toLowerCase()}`)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, paddingHorizontal: 20, paddingTop: 2 },
    h1: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#073B5C',
        fontSize: 32,
        lineHeight: 39,
        marginTop: 4,
    },
    subtitle: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#6F7A91',
        fontSize: 16,
        lineHeight: 23,
        marginTop: 4,
    },
    section: { marginTop: 24 },
    conditional: {
        marginTop: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#BDEDEA',
        backgroundColor: '#F4FFFE',
        padding: 14,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#073B5C',
        fontSize: 17,
        lineHeight: 23,
    },
    sectionSubtitle: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#6F7A91',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 3,
    },
    sectionBody: { marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#D9E2EA',
        borderRadius: 14,
        minHeight: 52,
        paddingHorizontal: 14,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#1E293B',
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    card: {
        minHeight: 168,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 14,
        position: 'relative',
    },
    selected: { borderColor: '#0FB7BC', backgroundColor: '#EAFBF9' },
    check: { position: 'absolute', right: 8, top: 8, zIndex: 2 },
    checkImage: { width: 22, height: 22 },
    optionImage: { width: 86, height: 72 },
    cardTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#073B5C',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        marginTop: 7,
    },
    cardDescription: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#6F7A91',
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'center',
        marginTop: 3,
    },
    inlineChoices: { flexDirection: 'row', gap: 10 },
    inlineChoice: {
        flex: 1,
        minHeight: 58,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
    },
    stack: { gap: 10 },
    wideCard: {
        width: '100%',
        minHeight: 104,
        borderRadius: 17,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    wideImage: { width: 86, height: 78 },
    wideCopy: { flex: 1 },
    wideTitle: { fontFamily: 'PlusJakartaSans_700Bold', color: '#073B5C', fontSize: 15, lineHeight: 20 },
    wideDescription: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#6F7A91',
        fontSize: 12,
        lineHeight: 17,
        marginTop: 3,
    },
    choiceTitle: { fontFamily: 'PlusJakartaSans_700Bold', color: '#073B5C', fontSize: 14 },
    choiceCheck: { width: 22, height: 22 },
    smallChoice: {
        flexBasis: '48%',
        flexGrow: 1,
        minHeight: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#D9E2EA',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    smallChoiceText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#073B5C',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    nestedBlock: { marginTop: 14 },
    followUpOptions: { marginTop: 12 },
    rentalActivityOptions: { marginTop: 14 },
    spaciousChoiceGrid: { columnGap: 24, rowGap: 10 },
    spaciousSmallChoice: { flexBasis: '46%' },
    saltFailureNotice: {
        marginTop: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#BDEDEA',
        backgroundColor: '#EAFBF9',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    saltFailureNoticeText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#073B5C',
        fontSize: 13,
        lineHeight: 19,
    },
    monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    month: {
        width: '22.5%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9E2EA',
        paddingVertical: 10,
        alignItems: 'center',
    },
    monthSelected: { backgroundColor: '#EAFBF9', borderColor: '#0FB7BC' },
    monthText: { fontFamily: 'PlusJakartaSans_600SemiBold', color: '#073B5C', fontSize: 12 },
    monthTextSelected: { color: '#073B5C' },
    missingCard: {
        marginTop: 24,
        borderRadius: 16,
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FED7AA',
        padding: 14,
    },
    missingTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#9A3412',
        fontSize: 14,
        marginBottom: 4,
    },
    missingText: {
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#9A3412',
        fontSize: 12,
        lineHeight: 18,
    },
});
