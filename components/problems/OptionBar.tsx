import { icons } from '@/constants/images';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

type OptionBarProps = {
    /** Omit for text-only steps (e.g. algae, stains, foam options). */
    image?: ImageSourcePropType;
    label: string;
    description?: string;
    selected: boolean;
    onPress: () => void;
};

/** Shared selectable row used for every question step in the problems flow. */
export default function OptionBar({
    image,
    label,
    description,
    selected,
    onPress,
}: OptionBarProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`flex-row items-center rounded-2xl px-3 py-3 border-[1.5px] gap-3 ${selected
                ? 'bg-surface-soft-aqua border-brand-aqua'
                : 'bg-surface-white border-border-default'
                }`}
        >
            {image ? (
                <Image source={image} className="w-15 h-15 rounded-full" resizeMode="cover" />
            ) : null}

            <View className="flex-1 pr-1">
                <Text className="text-body-lg font-jakarta-bold text-charcoal">{label}</Text>
                {description ? (
                    <Text className="mt-0.5 text-body font-jakarta text-sub">{description}</Text>
                ) : null}
            </View>

            <Image
                source={selected ? icons.selectedCheckBadge : icons.unselectedRadioIndicator}
                className="w-5.5 h-5.5"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}
 