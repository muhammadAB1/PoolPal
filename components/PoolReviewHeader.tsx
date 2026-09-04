import { icons } from '@/constants/images';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type PoolReviewHeaderProps = {
  title: string;
};

export default function PoolReviewHeader({ title }: PoolReviewHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="px-5 pt-2 pb-2 bg-surface-bg">
      <View className="flex-row items-center">
        <TouchableOpacity
          className="w-16 h-10 items-start justify-center -ml-1"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>

        <Text
          className="text-h3 font-jakarta-extrabold text-brand-navy text-center flex-1"
          numberOfLines={1}
        >
          {title}
        </Text>

        <TouchableOpacity className="w-16 h-10 items-end justify-center" activeOpacity={0.7}>
          <Text className="text-body-lg font-jakarta-bold text-brand-blue">
            {t('pool_basics_review_edit')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
