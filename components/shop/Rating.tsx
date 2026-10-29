import { colors } from '@/constants/theme';
import { formatReviewCount } from '@/data/shop';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type RatingProps = {
  rating: number;
  reviewCount: number;
  /** Larger text for the product screen. */
  large?: boolean;
};

export default function Rating({ rating, reviewCount, large = false }: RatingProps) {
  return (
    <View
      className="flex-row items-center"
      accessible
      accessibilityLabel={`Rated ${rating} out of 5 from ${reviewCount} reviews`}
    >
      <MaterialCommunityIcons name="star" size={large ? 18 : 15} color={colors.status.warning} />
      <Text
        className={`font-jakarta-bold text-brand-navy ml-1 ${large ? 'text-body' : 'text-small'}`}
      >
        {rating.toFixed(1)}
      </Text>
      <Text className={`font-jakarta text-sub ml-1 ${large ? 'text-body' : 'text-small'}`}>
        ({formatReviewCount(reviewCount)})
      </Text>
    </View>
  );
}
