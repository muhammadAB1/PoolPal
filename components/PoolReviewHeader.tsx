import { icons } from '@/constants/images';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type PoolReviewHeaderProps = {
  title: string;
  /** Overrides the default `router.back()` behavior, e.g. to cancel an inline edit view. */
  onBackPress?: () => void;
  /** When provided, tapping "Edit" calls this instead of doing nothing. */
  onEditPress?: () => void;
  /** Hides the "Edit" button, e.g. while an inline edit view is showing. Defaults to true. */
  showEdit?: boolean;
};

export default function PoolReviewHeader({
  title,
  onBackPress,
  onEditPress,
  showEdit = true,
}: PoolReviewHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="px-5 pt-2 pb-2 bg-surface-bg">
      <View className="flex-row items-center">
        <View className="w-16 items-start justify-center">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
            onPress={onBackPress ?? (() => router.back())}
            activeOpacity={0.7}
          >
            <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <Text
          className="text-h3 font-jakarta-extrabold text-brand-navy text-center flex-1"
          numberOfLines={1}
        >
          {title}
        </Text>

        {showEdit ? (
          <TouchableOpacity
            className="w-16 h-10 items-end justify-center"
            activeOpacity={0.7}
            onPress={onEditPress}
          >
            <Text className="text-body-lg font-jakarta-bold text-brand-blue">
              {t('pool_basics_review_edit')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="w-16" />
        )}
      </View>
    </View>
  );
}
