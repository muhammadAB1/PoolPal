import { icons } from '@/constants/images';
import { en, es } from '@/data/translations';
import { Country, Language, Measurement } from '@/lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';


const Preferences = ({ country, setCountry, language, setLanguage, measurement, setMeasurement, handleLanguageChange }:
    {
        country: Country, setCountry: (country: Country) => void, language: Language, setLanguage: (language: Language) => void, measurement: Measurement, setMeasurement: (measurement: Measurement) => void, handleLanguageChange: (language: Language) => void
    }
) => {

    const { t } = useTranslation();

    const COUNTRIES: { id: Country; flag: string; name: string; subtitle: string }[] = [
        { id: 'us', flag: '🇺🇸', name: en.signup_country_us_name, subtitle: en.signup_country_us_subtitle },
        { id: 'es', flag: '🇪🇸', name: es.signup_country_es_name, subtitle: es.signup_country_es_subtitle },
    ];

    const LANGUAGES: { id: Language; label: string }[] = [
        { id: 'en', label: en.signup_language_en },
        { id: 'es', label: es.signup_language_es },
    ];

    const MEASUREMENTS: { id: Measurement; label: string; units: string }[] = [
        { id: 'us', label: en.signup_measurement_us, units: en.signup_measurement_us_units },
        { id: 'metric', label: es.signup_measurement_metric, units: es.signup_measurement_metric_units },
    ];
    return (
        <>
            <View className="card--info flex-row items-start gap-3 px-4 py-3.5 mt-6">
                <Image source={icons.info} className="w-5 h-5 mt-0.5" resizeMode="contain" />
                <Text className="flex-1 text-body font-jakarta text-sub leading-relaxed">
                    {t('signup_save_note')}
                </Text>
            </View>

            <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-10">
                {t('signup_preferences_title')}
            </Text>
            <Text className="text-body font-jakarta text-sub mt-2">
                {t('signup_preferences_subtitle')}
            </Text>

            <View className="mt-8">
                <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_country')}</Text>
                <Text className="text-body font-jakarta text-sub mt-1 leading-relaxed">
                    {t('signup_country_note')}
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

            <View className="mt-8">
                <Text className="text-label font-jakarta-bold text-charcoal">{t('signup_language')}</Text>
                <View className="flex-row gap-3 mt-3">
                    {LANGUAGES.map((item) => {
                        const selected = language === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                className={`flex-1 flex-row items-center gap-2 rounded-xl border px-3.5 py-3 ${selected
                                    ? 'border-surface-mint-border bg-surface-mint'
                                    : 'border-border-default bg-surface-white'
                                    }`}
                                onPress={() => handleLanguageChange(item.id)}
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

            <View className="mt-8">
                <Text className="text-label font-jakarta-bold text-charcoal">
                    {t('signup_measurement')}
                </Text>
                <View className="flex-row gap-3 mt-3">
                    {MEASUREMENTS.map((item) => {
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
                    {t('signup_measurement_note')}
                </Text>
            </View>
        </>
    )
}

export default Preferences