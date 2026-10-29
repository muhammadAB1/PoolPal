import ProductCard from '@/components/shop/ProductCard';
import ShopHeader from '@/components/shop/ShopHeader';
import { colors } from '@/constants/theme';
import { SHOP_CATEGORIES, getCategory, getProductsByCategory } from '@/data/shop';
import { useShopList } from '@/providers/ShopListProvider';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Rough width of one chip, used to bring the active chip into view. */
const CHIP_SCROLL_STEP = 104;

export default function CategoryScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { isSaved, toggleSaved } = useShopList();
  const chipsRef = useRef<ScrollView>(null);

  const category = getCategory(categoryId) ?? SHOP_CATEGORIES[0];
  const products = getProductsByCategory(category.id);

  useEffect(() => {
    const index = SHOP_CATEGORIES.findIndex((item) => item.id === category.id);
    chipsRef.current?.scrollTo({ x: Math.max(0, index * CHIP_SCROLL_STEP - 48), animated: true });
  }, [category.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <ShopHeader title={category.name} subtitle={`${products.length} products`} showList />

        <ScrollView
          ref={chipsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4, gap: 8 }}
        >
          {SHOP_CATEGORIES.map((item) => {
            const active = item.id === category.id;
            return (
              <TouchableOpacity
                key={item.id}
                className={`filter-chip ${active ? 'filter-chip--active' : ''}`}
                activeOpacity={0.8}
                onPress={() => router.setParams({ categoryId: item.id })}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text className={`filter-chip__label ${active ? 'filter-chip__label--active' : ''}`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="flex-row flex-wrap justify-between px-5 mt-4">
          {products.map((product) => (
            <View key={product.id} className="w-[48.5%] mb-3">
              <ProductCard
                product={product}
                saved={isSaved(product.id)}
                onPress={() => router.push(`/(shop)/product/${product.id}` as Href)}
                onToggleSave={() => toggleSaved(product.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
