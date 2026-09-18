import { icons } from '@/constants/images';
import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    ImageSourcePropType,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface EquipmentExampleItem {
    key: string;
    image: ImageSourcePropType;
    title: string;
    description: string;
    identifyLabel: string;
    identify: string;
}

interface EquipmentExamplesModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    footerNote?: string;
    items: EquipmentExampleItem[];
}

export default function EquipmentExamplesModal({
    visible,
    onClose,
    title,
    subtitle,
    footerNote,
    items,
}: EquipmentExamplesModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-surface-white" style={{ flex: 1 }}>
                <View className="flex-row items-start px-5 pt-4 pb-3">
                    <TouchableOpacity
                        className="w-9 h-9 items-center justify-center"
                        onPress={onClose}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons name="close" size={22} color={colors.brand.navy} />
                    </TouchableOpacity>

                    <View className="flex-1 items-center">
                        <Text className="text-h2 font-jakarta-extrabold text-brand-navy text-center">
                            {title}
                        </Text>
                        <Text className="text-small font-jakarta text-sub text-center mt-1">
                            {subtitle}
                        </Text>
                    </View>

                    <View className="w-9" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-5 pt-2 pb-6 gap-4">
                        {items.map((item) => (
                            <View key={item.key} className="card overflow-hidden">
                                <View className="w-full h-56 bg-surface-bg overflow-hidden items-center justify-center">
                                    <Image
                                        source={item.image}
                                        style={{ width: '100%', height: 224 }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View className="px-4 pt-3 pb-4">
                                    <Text className="text-h3 font-jakarta-extrabold text-charcoal">
                                        {item.title}
                                    </Text>
                                    <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
                                        {item.description}
                                    </Text>

                                    <View className="card--info flex-row items-start gap-2.5 px-3.5 py-3 mt-3">
                                        <Image
                                            source={icons.info}
                                            className="w-4 h-4 mt-0.5"
                                            resizeMode="contain"
                                        />
                                        <View className="flex-1">
                                            <Text className="text-small font-jakarta-bold text-charcoal">
                                                {item.identifyLabel}
                                            </Text>
                                            <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                                                {item.identify}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {footerNote ? (
                            <View className="flex-row items-start gap-2 mt-4 px-1">
                                <Image
                                    source={icons.info}
                                    className="w-4 h-4 mt-0.5"
                                    resizeMode="contain"
                                />
                                <Text className="flex-1 text-tiny font-jakarta text-sub leading-relaxed">
                                    {footerNote}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}
