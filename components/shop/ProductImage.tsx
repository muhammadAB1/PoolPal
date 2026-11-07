import type { ProductImageStyle } from '@/data/shop';
import { Image, View, type DimensionValue, type ImageSourcePropType } from 'react-native';

type ProductImageProps = {
  source: ImageSourcePropType;
  imageStyle: ProductImageStyle;
  /** Breathing room around studio images. Photos always fill the frame. */
  padding?: DimensionValue;
};

/**
 * Fills its parent. Photos crop to fill, studio shots sit centered with space around them.
 */
export default function ProductImage({ source, imageStyle, padding = '12%' }: ProductImageProps) {
  if (imageStyle === 'photo') {
    return <Image source={source} className="w-full h-full" resizeMode="cover" />;
  }

  return (
    <View className="w-full h-full" style={{ padding }}>
      <Image source={source} className="w-full h-full" resizeMode="contain" />
    </View>
  );
}
