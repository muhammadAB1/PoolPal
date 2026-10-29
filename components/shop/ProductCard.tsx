import { colors, shadow } from '@/constants/theme';
import { formatPrice, type Product } from '@/data/shop';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import ProductImage from './ProductImage';
import Rating from './Rating';
import SaveButton from './SaveButton';

type ProductCardProps = {
  product: Product;
  saved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
  /** Small label on the image, e.g. why this product was picked. */
  badge?: string;
};

/**
 * The one product card used on the shop home, category and "more like this" lists.
 * The parent decides the width.
 */
export default function ProductCard({ product, saved, onPress, onToggleSave, badge }: ProductCardProps) {
  return (
    <TouchableOpacity
      className="product-card"
      style={shadow.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={product.name}
    >
      <View className="product-card__body">
        <View className="product-card__stage">
          <ProductImage source={product.image} imageStyle={product.imageStyle} />
          {badge ? (
            <View className="product-card__badge">
              <MaterialCommunityIcons name="star-four-points" size={12} color={colors.brand.blueDark} />
              <Text className="product-card__badge-label" numberOfLines={1}>
                {badge}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="product-card__info">
          <Text className="product-card__name" numberOfLines={2}>
            {product.name}
          </Text>
          <View className="mt-1">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
          </View>
          <View className="flex-row items-center justify-between mt-2.5">
            <Text className="product-card__price">{formatPrice(product.price)}</Text>
            <SaveButton saved={saved} productName={product.name} onPress={onToggleSave} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
