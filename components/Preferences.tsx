import SearchSelectionModal, { type SearchSelectionItem } from '@/components/SearchSelectionModal';
import { icons } from '@/constants/images';
import {
    COUNTRY_CODES,
    getCountryFlag,
    getCountryName,
    normalizeCountryCode,
    // searchLocalities,
} from '@/data/locations';
import type { Country, Language, Measurement } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    country: Country;
    setCountry: (country: Country) => void;
    cityOrTown: string;
    cityOrTownId: string | null;
    setCityOrTown: (value: string) => void;
    setCityOrTownId: (value: string | null) => void;
    language: Language;
    measurement: Measurement;
    setMeasurement: (measurement: Measurement) => void;
    handleLanguageChange: (language: Language) => void;
    showIntro?: boolean;
};

const Preferences = ({
    country,
    setCountry,
    cityOrTown,
    cityOrTownId,
    setCityOrTown,
    setCityOrTownId,
    language,
    measurement,
    setMeasurement,
    handleLanguageChange,
    showIntro = true,
}: Props) => {
    const { t, i18n } = useTranslation();
    const activeLanguage: Language = i18n.language.startsWith('es') ? 'es' : 'en';
    const countryCode = normalizeCountryCode(country);
    const [countryOpen, setCountryOpen] = useState(false);
    // const [cityOpen, setCityOpen] = useState(false);
    // const [cityQuery, setCityQuery] = useState('');

    const countries = useMemo<SearchSelectionItem[]>(() =>
        COUNTRY_CODES.map((code) => ({
            id: code,
            label: getCountryName(code, activeLanguage),
            leading: getCountryFlag(code),
        })).sort((a, b) => a.label.localeCompare(b.label, activeLanguage === 'es' ? 'es-ES' : 'en-US')),
        [activeLanguage]);

    // const cities = useMemo<SearchSelectionItem[]>(() =>
    //     searchLocalities(countryCode, cityQuery).map((item) => ({ id: item.id, label: item.name })),
    //     [cityQuery, countryCode]);

    function chooseCountry(item: SearchSelectionItem) {
        if (item.id !== countryCode) {
            setCityOrTown('');
            setCityOrTownId(null);
        }
        setCountry(item.id);
    }

    return (
        <>
            {showIntro ? (
                <>
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-10">
                        {t('signup_preferences_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-2">
                        {t('signup_preferences_subtitle')}
                    </Text>
                </>
            ) : null}

            <View className={showIntro ? 'mt-8' : 'mt-2'}>
                <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_country')}</Text>
                <Text className="text-body font-jakarta text-sub mt-1 leading-relaxed">
                    {t('signup_country_note')}
                </Text>
                <TouchableOpacity
                    className="mt-3 min-h-14 rounded-2xl border border-border-default bg-surface-white px-4 py-3 flex-row items-center"
                    onPress={() => setCountryOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel={t('signup_country_select_a11y')}
                >
                    <Text className="text-[22px] mr-3">{getCountryFlag(countryCode)}</Text>
                    <Text className="flex-1 text-body font-jakarta-bold text-charcoal">
                        {getCountryName(countryCode, activeLanguage)}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#667085" />
                </TouchableOpacity>
            </View>

            {/* <View className="mt-6">
                <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_city_or_town')}</Text>
                <Text className="text-body font-jakarta text-sub mt-1 leading-relaxed">
                    {t('signup_city_note')}
                </Text>
                <TouchableOpacity
                    className="mt-3 min-h-14 rounded-2xl border border-border-default bg-surface-white px-4 py-3 flex-row items-center"
                    onPress={() => setCityOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel={t('signup_city_select_a11y')}
                >
                    <Ionicons name="location-outline" size={21} color="#667085" />
                    <Text className={`flex-1 text-body font-jakarta ml-3 ${cityOrTown ? 'text-charcoal' : 'text-faint'}`} numberOfLines={2}>
                        {cityOrTown || t('signup_city_search_placeholder')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#667085" />
                </TouchableOpacity>
            </View> */}

            <View className="mt-8">
                <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_language')}</Text>
                <View className="flex-row gap-3 mt-3">
                    {(['en', 'es'] as const).map((id) => {
                        const selected = language === id;
                        return (
                            <TouchableOpacity
                                key={id}
                                className={`flex-1 rounded-xl border px-3.5 py-3 flex-row items-center justify-center gap-2 ${selected
                                    ? 'border-surface-mint-border bg-surface-mint'
                                    : 'border-border-default bg-surface-white'
                                    }`}
                                onPress={() => handleLanguageChange(id)}
                                activeOpacity={0.85}
                            >
                                <Text className="text-body font-jakarta-semibold text-charcoal">
                                    {t(id === 'en' ? 'signup_language_en' : 'signup_language_es')}
                                </Text>
                                {selected ? (
                                    <Image
                                        source={icons.selectedCheckBadge}
                                        className="w-5 h-5"
                                        resizeMode="contain"
                                    />
                                ) : null}
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
                    {(['us', 'metric'] as const).map((id) => {
                        const selected = measurement === id;
                        return (
                            <TouchableOpacity
                                key={id}
                                className={`flex-1 rounded-xl border px-3.5 py-3 ${selected
                                    ? 'border-surface-mint-border bg-surface-mint'
                                    : 'border-border-default bg-surface-white'
                                    }`}
                                onPress={() => setMeasurement(id)}
                                activeOpacity={0.85}
                            >
                                <View className="flex-row items-center justify-between gap-2">
                                    <View className="flex-1">
                                        <Text className="text-body font-jakarta-bold text-charcoal">
                                            {t(id === 'us' ? 'signup_measurement_us' : 'signup_measurement_metric')}
                                        </Text>
                                        <Text className="text-tiny font-jakarta text-sub mt-0.5">
                                            {t(id === 'us' ? 'signup_measurement_us_units' : 'signup_measurement_metric_units')}
                                        </Text>
                                    </View>
                                    {selected ? (
                                        <Image
                                            source={icons.selectedCheckBadge}
                                            className="w-5 h-5"
                                            resizeMode="contain"
                                        />
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <SearchSelectionModal
                visible={countryOpen}
                title={t('signup_country_select_title')}
                placeholder={t('signup_country_search_placeholder')}
                items={countries}
                selectedId={countryCode}
                onClose={() => setCountryOpen(false)}
                onSelect={chooseCountry}
                closeLabel={t('common_close')}
                emptyLabel={t('common_no_results')}
            />
            {/* <SearchSelectionModal
                visible={cityOpen}
                title={t('signup_city_select_title')}
                placeholder={t('signup_city_search_placeholder')}
                items={cities}
                selectedId={cityOrTownId}
                onClose={() => setCityOpen(false)}
                onQueryChange={setCityQuery}
                onSelect={(item) => {
                    setCityOrTown(item.label);
                    setCityOrTownId(item.id);
                }}
                closeLabel={t('common_close')}
                emptyLabel={t('common_no_results')}
            /> */}
        </>
    );
};

export default Preferences;
