import PoolTonicLogo from '@/components/PoolTonicLogo';
import { icons } from '@/constants/images';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Placeholder landing page shown once the tree reaches a problem/treatment. */
export default function ProblemsTreatmentScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View className="flex-row items-center justify-between px-5 pt-2">
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
                </TouchableOpacity>
                <PoolTonicLogo width={152} height={43} />
                <View className="w-10 h-10" />
            </View>

            <View className="flex-1 items-center justify-center px-5">
                <Text className="text-body font-jakarta text-sub">{t('dashboard_coming_soon')}</Text>
            </View>
        </SafeAreaView>
    );
}
