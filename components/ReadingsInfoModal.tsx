import { graphics, icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import { READINGS_INFO } from '@/data/poolReadings';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReadingsInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ReadingsInfoModal({ visible, onClose }: ReadingsInfoModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <View className="px-5 pt-2">
                    <TouchableOpacity
                        className="w-9 h-9 items-center justify-center -ml-2"
                        onPress={onClose}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons name="chevron-back" size={22} color={colors.brand.navy} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text className="text-h1 font-jakarta-extrabold text-brand-navy">
                        {t('test_readings_info_modal_title')}
                    </Text>
                    <Text className="text-body font-jakarta text-sub mt-1.5">
                        {t('test_readings_info_modal_subtitle')}
                    </Text>

                    <View className="mt-5 gap-3">
                        {READINGS_INFO.map((item) => (
                            <View key={item.key} className="card flex-row items-start gap-3 px-4 py-4">
                                <View
                                    className="w-11 h-11 rounded-full items-center justify-center"
                                    style={{ backgroundColor: item.badgeColor }}
                                >
                                    <Text className="text-tiny font-jakarta-extrabold text-surface-white">
                                        {item.abbreviation}
                                    </Text>
                                </View>
                                <View className="flex-1 pt-0.5">
                                    <Text className="text-body font-jakarta-bold text-charcoal">
                                        {t(item.titleKey)}
                                    </Text>
                                    <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
                                        {t(item.descriptionKey)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View className="rounded-2xl overflow-hidden mt-4">
                        <Image
                            source={graphics.poolCardWave}
                            className="absolute w-full h-full"
                            resizeMode="cover"
                        />
                        <View className="flex-row items-start gap-3 px-4 py-4">
                            <View className="w-11 h-11 rounded-full bg-surface-white items-center justify-center">
                                <Image
                                    source={icons.waterDrop}
                                    className="w-5 h-5"
                                    resizeMode="contain"
                                />
                            </View>
                            <View className="flex-1 pt-0.5">
                                <Text className="text-body font-jakarta-bold text-brand-navy">
                                    {t('test_readings_info_why_test_title')}
                                </Text>
                                <Text className="text-small font-jakarta text-brand-navy mt-1 leading-relaxed opacity-80">
                                    {t('test_readings_info_why_test_desc')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}
