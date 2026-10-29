import ListButton from '@/components/shop/ListButton';
import ProductCard from '@/components/shop/ProductCard';
import ProductImage from '@/components/shop/ProductImage';
import { colors } from '@/constants/theme';
import {
  FEATURED_PRODUCTS,
  SHOP_CATEGORIES,
  getProductsByCategory,
} from '@/data/shop';
import { usePool } from '@/providers/PoolProvider';
import { useShopList } from '@/providers/ShopListProvider';
import { useRouter, type Href } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Width of one "Customized for you" card, plus the gap to the next one. */
const FEATURE_CARD_WIDTH = 248;
const FEATURE_CARD_GAP = 12;

export default function ShopScreen() {
  const router = useRouter();
  const { pools } = usePool();
  const { isSaved, toggleSaved } = useShopList();

  const poolName = pools?.pool_name?.trim();

  const openProduct = (productId: string) => router.push(`/(shop)/product/${productId}` as Href);
  const openCategory = (categoryId: string) => router.push(`/(shop)/category/${categoryId}` as Href);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy">Shop</Text>
            <Text className="text-body font-jakarta text-sub mt-1">Everything your pool needs.</Text>
          </View>
          <ListButton />
        </View>

        <View className="px-5 mt-7">
          <Text className="section__title">Customized for you</Text>
          <Text className="section__subtitle mt-0.5" numberOfLines={1}>
            {poolName ? `Picked for ${poolName}` : 'Picked for your pool'}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={FEATURE_CARD_WIDTH + FEATURE_CARD_GAP}
          decelerationRate="fast"
          className="mt-3.5"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: FEATURE_CARD_GAP }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <View key={product.id} style={{ width: FEATURE_CARD_WIDTH }}>
              <ProductCard
                product={product}
                badge={product.forYou}
                saved={isSaved(product.id)}
                onPress={() => openProduct(product.id)}
                onToggleSave={() => toggleSaved(product.id)}
              />
            </View>
          ))}
        </ScrollView>

        <View className="px-5 mt-5">
          <Text className="section__title">Shop by category</Text>
          <View className="flex-row flex-wrap justify-between mt-3.5">
            {SHOP_CATEGORIES.map((category) => {
              const count = getProductsByCategory(category.id).length;
              return (
                <TouchableOpacity
                  key={category.id}
                  className={`w-[48.5%] mb-3 category-tile ${category.tone === 'aqua' ? 'category-tile--aqua' : 'category-tile--mint'}`}
                  activeOpacity={0.85}
                  onPress={() => openCategory(category.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${category.name}, ${count} products`}
                >
                  <Text className="category-tile__name">{category.name}</Text>
                  <Text className="category-tile__count">{count} products</Text>
                  <View className="category-tile__bubble">
                    <ProductImage source={category.image} imageStyle={category.imageStyle} padding="14%" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
