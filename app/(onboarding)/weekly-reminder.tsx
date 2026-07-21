import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import {
    formatReminderTime,
    REMINDER_HOURS,
    REMINDER_PERIODS,
    WEEKDAYS,
    weekdayTranslationKeys,
    type ReminderHour,
    type ReminderPeriod,
    type Weekday,
} from '@/data/poolWeeklyReminder';
import { useSupabase } from '@/hooks/supabaseHooks';
import { parseRemainingSteps, resumeOnboardingHref } from '@/lib/onboardingFlow';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WeeklyReminderScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { weeklyReminderInsert } = useSupabase();
    const { resume, remaining } = useLocalSearchParams<{ resume?: string; remaining?: string }>();
    const isResuming = resume === '1';
    const remainingSteps = parseRemainingSteps(remaining);

    const [day, setDay] = useState<Weekday>('Saturday');
    const [hour, setHour] = useState<ReminderHour>(9);
    const [period, setPeriod] = useState<ReminderPeriod>('AM');
    const [dayMenuOpen, setDayMenuOpen] = useState(false);
    const [timeMenuOpen, setTimeMenuOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleComplete() {
        setErrorMessage(null);

        if (!day || !hour || !period) {
            setErrorMessage(t('pool_basics_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error } = await weeklyReminderInsert({
                props: {
                    reminderDay: day,
                    reminderTime: `${hour}:${period}`,
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            router.push(
                isResuming
                    ? resumeOnboardingHref(remainingSteps)
                    : ({
                        pathname: '/(onboarding)/onboarding-complete',
                        params: { percentage: data?.profile_completion_score?.toString() ?? '0', poolId: data?.id ?? '' },
                    } as Href)
            );

        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : t('pool_basics_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSkipForNow() {
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const { data, error } = await weeklyReminderInsert({});

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            router.push(
                isResuming
                    ? resumeOnboardingHref(remainingSteps)
                    : ({
                        pathname: '/(onboarding)/onboarding-complete',
                        params: { percentage: data?.profile_completion_score?.toString() ?? '0', poolId: data?.id ?? '' },
                    } as Href)
            );

        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : t('pool_basics_error')
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-5 pt-2 -mt-6">
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-6">
                        {t('weekly_reminder_title')}
                    </Text>
                    <Text className="text-body-lg font-jakarta text-sub mt-1">
                        {t('weekly_reminder_subtitle')}
                    </Text>

                    <View className="card--info mt-5 px-4 py-4">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-brand-aqua items-center justify-center">
                                <Image
                                    source={icons.bell}
                                    className="w-5 h-5"
                                    resizeMode="contain"
                                    style={{ tintColor: '#FFFFFF' }}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-body-lg font-jakarta-bold text-charcoal">
                                    {t('weekly_reminder_card_title')}
                                </Text>
                                <Text className="text-small font-jakarta text-sub mt-0.5">
                                    {t('weekly_reminder_card_subtitle')}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row gap-3 mt-4">
                            <View className="flex-1">
                                <TouchableOpacity
                                    className="form-input flex-row items-center justify-between px-3 py-3"
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setDayMenuOpen((prev) => !prev);
                                        setTimeMenuOpen(false);
                                    }}
                                >
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <Image
                                            source={icons.calendar}
                                            className="w-4 h-4"
                                            resizeMode="contain"
                                        />
                                        <Text
                                            className="text-body font-jakarta-bold text-brand-navy flex-1"
                                            numberOfLines={1}
                                        >
                                            {t(weekdayTranslationKeys[day])}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={dayMenuOpen ? 'chevron-up' : 'chevron-down'}
                                        size={16}
                                        color={colors.text.sub}
                                    />
                                </TouchableOpacity>

                                {dayMenuOpen ? (
                                    <View className="mt-2 rounded-xl border border-border-default bg-surface-white overflow-hidden">
                                        {WEEKDAYS.map((item, index) => {
                                            const selected = day === item;
                                            return (
                                                <TouchableOpacity
                                                    key={item}
                                                    activeOpacity={0.7}
                                                    onPress={() => {
                                                        setDay(item);
                                                        setErrorMessage(null);
                                                        setDayMenuOpen(false);
                                                    }}
                                                    className={`px-3 py-2.5 ${index !== WEEKDAYS.length - 1
                                                        ? 'border-b border-border-default'
                                                        : ''
                                                        } ${selected ? 'bg-surface-soft-aqua' : ''}`}
                                                >
                                                    <Text
                                                        className={`text-small font-jakarta ${selected
                                                            ? 'font-jakarta-bold text-brand-blue'
                                                            : 'text-charcoal'
                                                            }`}
                                                    >
                                                        {t(weekdayTranslationKeys[item])}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                ) : null}
                            </View>

                            <View className="flex-1">
                                <TouchableOpacity
                                    className="form-input flex-row items-center justify-between px-3 py-3"
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setTimeMenuOpen((prev) => !prev);
                                        setDayMenuOpen(false);
                                    }}
                                >
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <Ionicons
                                            name="time-outline"
                                            size={16}
                                            color={colors.brand.navy}
                                        />
                                        <Text
                                            className="text-body font-jakarta-bold text-brand-navy flex-1"
                                            numberOfLines={1}
                                        >
                                            {formatReminderTime(hour, period)}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={timeMenuOpen ? 'chevron-up' : 'chevron-down'}
                                        size={16}
                                        color={colors.text.sub}
                                    />
                                </TouchableOpacity>

                                {timeMenuOpen ? (
                                    <View className="mt-2 rounded-xl border border-border-default bg-surface-white overflow-hidden">
                                        <ScrollView
                                            nestedScrollEnabled
                                            showsVerticalScrollIndicator={false}
                                            style={{ maxHeight: 160 }}
                                        >
                                            {REMINDER_HOURS.map((item, index) => {
                                                const selected = hour === item;
                                                return (
                                                    <TouchableOpacity
                                                        key={item}
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            setHour(item);
                                                            setErrorMessage(null);
                                                        }}
                                                        className={`px-3 py-2.5 ${index !== REMINDER_HOURS.length - 1
                                                            ? 'border-b border-border-default'
                                                            : ''
                                                            } ${selected ? 'bg-surface-soft-aqua' : ''}`}
                                                    >
                                                        <Text
                                                            className={`text-small font-jakarta ${selected
                                                                ? 'font-jakarta-bold text-brand-blue'
                                                                : 'text-charcoal'
                                                                }`}
                                                        >
                                                            {item}:00
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </ScrollView>

                                        <View className="flex-row border-t border-border-default">
                                            {REMINDER_PERIODS.map((item) => {
                                                const selected = period === item;
                                                return (
                                                    <TouchableOpacity
                                                        key={item}
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            setPeriod(item);
                                                            setErrorMessage(null);
                                                            setTimeMenuOpen(false);
                                                        }}
                                                        className={`flex-1 py-2.5 items-center ${selected ? 'bg-surface-soft-aqua' : 'bg-surface-white'
                                                            }`}
                                                    >
                                                        <Text
                                                            className={`text-small font-jakarta ${selected
                                                                ? 'font-jakarta-bold text-brand-blue'
                                                                : 'text-charcoal'
                                                                }`}
                                                        >
                                                            {item}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </View>

                        <View className="flex-row items-center gap-2 mt-4">
                            <Image
                                source={icons.info}
                                className="w-4 h-4"
                                resizeMode="contain"
                                style={{ transform: [{ rotate: '180deg' }] }}
                            />
                            <Text className="flex-1 text-small font-jakarta text-sub">
                                {t('weekly_reminder_required_note')}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-2 mt-4 px-0.5">
                        <Image
                            source={icons.info}
                            className="w-4 h-4"
                            resizeMode="contain"
                        />
                        <Text className="flex-1 text-small font-jakarta text-sub">
                            {t('weekly_reminder_dashboard_note')}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
                {errorMessage ? (
                    <Text className="text-body font-jakarta text-error mb-3 text-center">
                        {errorMessage}
                    </Text>
                ) : null}
                <TouchableOpacity
                    className={`bg-brand-blue rounded-full py-4.25 items-center justify-center ${isSubmitting ? 'opacity-60' : ''}`}
                    onPress={handleComplete}
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('weekly_reminder_complete')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="items-center justify-center mt-3.5 py-1"
                    onPress={handleSkipForNow}
                    activeOpacity={0.7}
                >
                    <Text className="text-body font-jakarta-bold text-brand-blue">
                        {t('weekly_reminder_skip_for_now')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
