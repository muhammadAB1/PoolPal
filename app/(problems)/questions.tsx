import OptionBar from '@/components/problems/OptionBar';
import { icons } from '@/constants/images';
import { useProblems } from '@/providers/ProblemsProvider';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getNextAction, getPageWarning, QUESTION_PAGES } from './_tree';

/** Single screen for every Solve Visible Problems question page. */
export default function ProblemsQuestionsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { answers, setAnswer } = useProblems();

    const [page, setPage] = useState(QUESTION_PAGES.appearance.id);
    const [history, setHistory] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [selected, setSelected] = useState<string[]>([]);

    const questionPage = QUESTION_PAGES[page];
    const warning = getPageWarning(page, selected);

    function toggleOption(optionId: string) {
        if (!questionPage.multiple) {
            setSelected([optionId]);
            return;
        }

        setSelected(
            selected.includes(optionId)
                ? selected.filter((id) => id !== optionId)
                : [...selected, optionId],
        );
    }

    function handleBack() {
        const previousPage = history[history.length - 1];
        if (!previousPage) {
            router.back();
            return;
        }
        setHistory((prev) => prev.slice(0, -1));
        setPage(previousPage);
        setSelected(answers[previousPage] ?? []);
        setStep((prev) => Math.max(1, prev - 1));
    }

    function handleContinue() {
        if (selected.length === 0) return;
        setAnswer(page, selected);

        const action = getNextAction([...history, page], selected);
        if (action.type === 'question') {
            setHistory((prev) => [...prev, page]);
            setPage(action.page);
            setSelected(answers[action.page] ?? []);
            setStep((prev) => prev + 1);
        } else {
            router.push('/(problems)/treatment' as Href);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View className="flex-row items-center justify-between px-5 pt-2">
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center justify-center gap-1.5">
                    <Image source={icons.waterDrop} className="w-5 h-5" resizeMode="contain" />
                    <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                        {t('dashboard_solve_problems_title')}
                    </Text>
                </View>

                <Text className="text-small font-jakarta text-sub">
                    {t('problems_step', { n: step })}
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-5 pt-4">
                    {warning ? (
                        <View className="flex-row items-start gap-3 rounded-2xl border border-error bg-[#FDECEC] px-4 py-3 mb-4">
                            <Ionicons name="close-circle" size={22} color="#E5484D" />
                            <View className="flex-1">
                                <Text className="text-body-lg font-jakarta-bold text-error">
                                    {t(warning.titleKey)}
                                </Text>
                                <Text className="text-body font-jakarta text-error mt-0.5">
                                    {t(warning.subtitleKey)}
                                </Text>
                            </View>
                        </View>
                    ) : null}

                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy">
                        {t(questionPage.titleKey)}
                    </Text>
                    {questionPage.subtitleKey ? (
                        <Text className="text-body font-jakarta text-sub mt-1">
                            {t(questionPage.subtitleKey)}
                        </Text>
                    ) : null}

                    <View className="mt-6 gap-3">
                        {questionPage.options.map((option) => (
                            <OptionBar
                                key={option.id}
                                image={option.image}
                                label={t(option.labelKey)}
                                description={option.descriptionKey ? t(option.descriptionKey) : undefined}
                                selected={selected.includes(option.id)}
                                onPress={() => toggleOption(option.id)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View className="px-5 pb-7">
                <TouchableOpacity
                    disabled={selected.length === 0}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    className={`rounded-full py-4.25 items-center justify-center ${selected.length > 0 ? 'bg-brand-blue' : 'bg-border-default'
                        }`}
                >
                    <Text className="text-button font-jakarta-bold text-surface-white">
                        {t('problems_continue')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
