import BackButton from '@/components/shop/BackButton';
import ListButton from '@/components/shop/ListButton';
import ProductCard from '@/components/shop/ProductCard';
import ProductImage from '@/components/shop/ProductImage';
import Rating from '@/components/shop/Rating';
import { colors, shadow } from '@/constants/theme';
import {
  formatPrice,
  getCategory,
  getProduct,
  getProductsByCategory,
} from '@/data/shop';
import { useShopList } from '@/providers/ShopListProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO_HEIGHT = 360;
const RELATED_CARD_WIDTH = 220;
const RELATED_CARD_GAP = 12;

export default function ProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { isSaved, toggleSaved } = useShopList();

  const product = getProduct(productId);

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <View className="px-5 pt-2">
          <BackButton />
        </View>
        <View className="flex-1 items-center justify-center px-8 pb-24">
          <Text className="text-h2 font-jakarta-extrabold text-brand-navy text-center">
            Product not found
          </Text>
          <Text className="text-body-lg font-jakarta text-sub text-center mt-2">
            This product is no longer available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategory(product.categoryId);
  const saved = isSaved(product.id);
  const related = getProductsByCategory(product.categoryId).filter((item) => item.id !== product.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 112 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-surface-white" style={{ height: HERO_HEIGHT }}>
          {product.imageStyle === 'photo' ? (
            <ProductImage source={product.image} imageStyle="photo" />
          ) : (
            <View style={{ flex: 1, paddingTop: insets.top + 64, paddingBottom: 48, paddingHorizontal: 40 }}>
              <ProductImage source={product.image} imageStyle="studio" padding={0} />
            </View>
          )}
        </View>

        <View className="-mt-6 rounded-t-[28px] bg-surface-bg pt-6">
          <View className="px-5">
            <View className="flex-row flex-wrap items-center gap-2">
              <TouchableOpacity
                className="rounded-full bg-surface-soft-aqua px-3 py-1.5"
                activeOpacity={0.8}
                onPress={() => router.push(`/(shop)/category/${product.categoryId}` as Href)}
                accessibilityRole="button"
                accessibilityLabel={`More in ${category?.name}`}
              >
                <Text className="text-small font-jakarta-bold text-brand-navy">{category?.name}</Text>
              </TouchableOpacity>
              {product.forYou ? (
                <View className="flex-row items-center rounded-full bg-surface-mint px-3 py-1.5">
                  <MaterialCommunityIcons name="star-four-points" size={12} color={colors.status.successText} />
                  <Text className="text-small font-jakarta-bold text-success-text ml-1">{product.forYou}</Text>
                </View>
              ) : null}
            </View>

            <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-3">{product.name}</Text>
            <Text className="text-body font-jakarta text-sub mt-1">by {product.brand}</Text>

            <View className="mt-3">
              <Rating rating={product.rating} reviewCount={product.reviewCount} large />
            </View>

            <View className="flex-row items-center mt-4">
              <Text className="text-[30px] leading-9 font-jakarta-extrabold text-brand-navy">
                {formatPrice(product.price)}
              </Text>
              <View className="flex-row items-center ml-3">
                <View className="w-2 h-2 rounded-full bg-success" />
                <Text className="text-small font-jakarta-semibold text-success-text ml-1.5">In stock</Text>
              </View>
            </View>

            <View className="card--info flex-row p-4 mt-5">
              <View className="w-10 h-10 rounded-full bg-surface-white items-center justify-center">
                <MaterialCommunityIcons name="pool" size={22} color={colors.brand.blueDark} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-body-lg font-jakarta-bold text-brand-navy">Why it fits your pool</Text>
                <Text className="text-body font-jakarta text-charcoal mt-1">{product.fitNote}</Text>
              </View>
            </View>

            <Text className="section__title mt-7">About this product</Text>
            <Text className="text-body-lg font-jakarta-semibold text-brand-navy mt-2">{product.tagline}</Text>
            <Text className="text-body-lg font-jakarta text-sub mt-1">{product.description}</Text>

            <Text className="section__title mt-7">Details</Text>
            <View className="card px-4 mt-3" style={shadow.card}>
              {product.specs.map((spec, index) => (
                <View
                  key={spec.label}
                  className={`flex-row items-center justify-between py-3.5 ${index === product.specs.length - 1 ? '' : 'border-b border-border-default'}`}
                >
                  <Text className="text-body font-jakarta text-sub">{spec.label}</Text>
                  <Text className="text-body font-jakarta-bold text-brand-navy ml-4 shrink text-right">
                    {spec.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {related.length > 0 ? (
            <>
              <Text className="section__title mt-8 px-5">More in {category?.name}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={RELATED_CARD_WIDTH + RELATED_CARD_GAP}
                decelerationRate="fast"
                className="mt-3.5"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: RELATED_CARD_GAP }}
              >
                {related.map((item) => (
                  <View key={item.id} style={{ width: RELATED_CARD_WIDTH }}>
                    <ProductCard
                      product={item}
                      saved={isSaved(item.id)}
                      onPress={() => router.push(`/(shop)/product/${item.id}` as Href)}
                      onToggleSave={() => toggleSaved(item.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View
        className="absolute left-5 right-5 flex-row items-center justify-between"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        <BackButton />
        <ListButton />
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 bg-surface-white border-t border-border-default px-5 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 12),
          shadowColor: colors.brand.navy,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {saved ? (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="w-13 h-13 rounded-full border border-border-default bg-surface-white items-center justify-center"
              activeOpacity={0.7}
              onPress={() => toggleSaved(product.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${product.name} from my list`}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.text.sub} />
            </TouchableOpacity>
            <TouchableOpacity
              className="btn btn--primary flex-1"
              activeOpacity={0.85}
              onPress={() => router.push('/(shop)/list' as Href)}
            >
              <MaterialCommunityIcons name="check" size={20} color={colors.surface.white} />
              <Text className="btn__label btn__label--primary ml-2">Added · View my list</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="btn btn--primary"
            activeOpacity={0.85}
            onPress={() => toggleSaved(product.id)}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.surface.white} />
            <Text className="btn__label btn__label--primary ml-2">Add to my list</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
