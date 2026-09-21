import { brandAssets } from '@/constants/images';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

export default function PoolTonicLogo({
  width = 164,
  height = 48,
  style,
}: {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
    className=''
      source={brandAssets.logoFull}
      resizeMode="contain"
      accessibilityLabel="Pool Tonic"
      style={[{ width, height }, style]}
    />
  );
}
