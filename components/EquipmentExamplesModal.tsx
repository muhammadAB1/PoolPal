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
    footerNote: string;
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <View className="flex-row items-start px-5 pt-2 pb-2">
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

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="gap-4">
                        {items.map((item) => (
                            <View key={item.key} className="card overflow-hidden">
                                <Image
                                    source={item.image}
                                    className="w-full h-[120px]"
                                    resizeMode="cover"
                                />
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
                    </View>

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
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}
