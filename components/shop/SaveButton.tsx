import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

type SaveButtonProps = {
  saved: boolean;
  productName: string;
  onPress: () => void;
};

/**
 * Round add-to-list button. Pops once when a product gets added.
 */
export default function SaveButton({ saved, productName, onPress }: SaveButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const wasSaved = useRef(saved);

  useEffect(() => {
    if (saved && !wasSaved.current) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.22, speed: 50, bounciness: 0, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, speed: 20, bounciness: 10, useNativeDriver: true }),
      ]).start();
    }
    wasSaved.current = saved;
  }, [saved, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        className={`w-11 h-11 rounded-full items-center justify-center ${saved ? 'bg-brand-blue-dark' : 'bg-surface-soft-aqua'}`}
        activeOpacity={0.75}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={saved ? `Remove ${productName} from my list` : `Add ${productName} to my list`}
      >
        <MaterialCommunityIcons
          name={saved ? 'check' : 'plus'}
          size={22}
          color={saved ? colors.surface.white : colors.brand.blueDark}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
