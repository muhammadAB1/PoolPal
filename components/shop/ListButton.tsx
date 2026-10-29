import { colors, shadow } from '@/constants/theme';
import { useShopList } from '@/providers/ShopListProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * Round shortcut to "My list" with a live count of saved products.
 */
export default function ListButton() {
  const router = useRouter();
  const { savedIds } = useShopList();
  const count = savedIds.length;

  return (
    <TouchableOpacity
      className="icon-btn"
      style={shadow.card}
      activeOpacity={0.7}
      onPress={() => router.push('/(shop)/list' as Href)}
      accessibilityRole="button"
      accessibilityLabel={`My list, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <MaterialCommunityIcons name="format-list-bulleted" size={22} color={colors.brand.navy} />
      {count > 0 ? (
        <View className="icon-btn__count">
          <Text className="icon-btn__count-label">{count}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
