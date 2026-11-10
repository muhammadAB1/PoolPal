import { icons } from '@/constants/images';
import { shadow } from '@/constants/theme';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity } from 'react-native';

/**
 * Round back button used across the shop screens.
 * Falls back to the Shop tab when there is nothing to go back to.
 */
export default function BackButton() {
  const router = useRouter();
  const { t } = useTranslation();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/shop' as Href);
    }
  };

  return (
    <TouchableOpacity
      className="icon-btn"
      style={shadow.card}
      activeOpacity={0.7}
      onPress={goBack}
      accessibilityRole="button"
      accessibilityLabel={t('shop.backA11y')}
    >
      <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
    </TouchableOpacity>
  );
}
