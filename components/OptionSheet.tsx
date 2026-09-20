import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type OptionSheetOption = {
    id: string;
    label: string;
    sublabel?: string;
    /** Emoji shown before the label, e.g. a flag. */
    leading?: string;
};

type OptionSheetProps = {
    visible: boolean;
    title: string;
    options: OptionSheetOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    onClose: () => void;
};

/** Small bottom sheet for picking between a couple of options (e.g. language, units). */
export default function OptionSheet({ visible, title, options, selectedId, onSelect, onClose }: OptionSheetProps) {
    const insets = useSafeAreaInsets();

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable className="flex-1 justify-end" style={{ backgroundColor: 'rgba(11,46,74,0.4)' }} onPress={onClose}>
                <Pressable
                    onPress={() => { }}
                    className="bg-surface-white rounded-t-3xl px-5 pt-3"
                    style={{ paddingBottom: insets.bottom + 20 }}
                >
                    <View className="w-10 h-1.5 rounded-full bg-border-default self-center mb-4" />
                    <Text className="text-h2 font-jakarta-extrabold text-brand-navy mb-4">{title}</Text>

                    <View className="gap-3">
                        {options.map((option) => {
                            const selected = option.id === selectedId;
                            return (
                                <Pressable
                                    key={option.id}
                                    onPress={() => onSelect(option.id)}
                                    className={`flex-row items-center gap-3 rounded-2xl border px-4 py-3.5 ${selected ? 'border-surface-mint-border bg-surface-mint' : 'border-border-default bg-surface-white'
                                        }`}
                                >
                                    {option.leading ? <Text className="text-[22px]">{option.leading}</Text> : null}
                                    <View className="flex-1">
                                        <Text className="text-body font-jakarta-bold text-charcoal">{option.label}</Text>
                                        {option.sublabel ? (
                                            <Text className="text-tiny font-jakarta text-sub mt-0.5">{option.sublabel}</Text>
                                        ) : null}
                                    </View>
                                    <Ionicons
                                        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={22}
                                        color={selected ? colors.brand.blue : colors.text.faint}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
