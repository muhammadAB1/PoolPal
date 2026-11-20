import { colors, shadow } from '@/constants/theme';
import { /* formatPrice, */ type Product } from '@/data/shop';
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
};

/**
 * The one product card used on the shop home, category and "more like this" lists.
 * The parent decides the width.
 */
export default function ProductCard({ product, saved, onPress, onToggleSave }: ProductCardProps) {
  const name = product.name;

  return (
    <TouchableOpacity
      className="product-card"
      style={shadow.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View className="product-card__body">
        <View className="product-card__stage">
          <ProductImage source={product.image} imageStyle={product.imageStyle} />
          {product.label ? (
            <View className="product-card__badge">
              <MaterialCommunityIcons name="star-four-points" size={12} color={colors.brand.blueDark} />
              <Text className="product-card__badge-label" numberOfLines={1}>
                {product.label}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="product-card__info">
          <Text className="product-card__name" numberOfLines={2}>
            {name}
          </Text>
          {/* Fixed height keeps cards in a row aligned when a product has no rating. */}
          <View className="mt-1 h-5 justify-center">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
          </View>
          <View className="flex-row items-center justify-between mt-2.5">
            {/* <Text className="product-card__price">{formatPrice(product.price)}</Text> */}
            <SaveButton saved={saved} productName={name} onPress={onToggleSave} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
