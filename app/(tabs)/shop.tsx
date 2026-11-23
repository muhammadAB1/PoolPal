import ListButton from '@/components/shop/ListButton';
import ProductCard from '@/components/shop/ProductCard';
import ProductImage from '@/components/shop/ProductImage';
import { colors, shadow } from '@/constants/theme';
import {
  FEATURED_PRODUCTS,
  SHOP_CATEGORIES,
  getProductsByCategory,
  searchProducts,
} from '@/data/shop';
import { usePool } from '@/providers/PoolProvider';
import { useShopList } from '@/providers/ShopListProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Width of one "Customized for you" card, plus the gap to the next one. */
const FEATURE_CARD_WIDTH = 248;
const FEATURE_CARD_GAP = 12;

export default function ShopScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { pools } = usePool();
  const { isSaved, toggleSaved } = useShopList();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Search only after the user stops typing for 500ms.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const poolName = pools?.pool_name?.trim();
  const isSearching = debouncedQuery !== '';
  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
  };
  const results = useMemo(() => searchProducts(debouncedQuery), [debouncedQuery]);

  const openProduct = (productId: string) => router.push(`/(shop)/product/${productId}` as Href);
  const openCategory = (categoryId: string) => router.push(`/(shop)/category/${categoryId}` as Href);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
        <View className="px-5 pt-2 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy">{t('nav_shop')}</Text>
            <Text className="text-body font-jakarta text-sub mt-1">{t('shop.subtitle')}</Text>
          </View>
          <ListButton />
        </View>

        <View className="px-5 mt-5 pb-3">
          <View className="search-field" style={shadow.card}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.text.sub} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('shop.searchPlaceholder')}
              placeholderTextColor={colors.text.sub}
              selectionColor={colors.brand.blue}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              className="search-field__input"
            />
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={clearSearch}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={t('shop.searchClear')}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color={colors.text.faint} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {isSearching ? (
          // FlatList only draws the cards near the screen, so big result lists stay fast.
          <FlatList
            data={results}
            keyExtractor={(product) => product.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={
              results.length > 0 ? (
                <View className="mt-3 mb-3.5">
                  <Text className="section__title">
                    {t(results.length === 1 ? 'shop.searchResultsOne' : 'shop.searchResultsOther', {
                      count: results.length,
                    })}
                  </Text>
                  <Text className="section__subtitle mt-0.5" numberOfLines={1}>
                    {t('shop.searchResultsFor', { query: debouncedQuery })}
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View className="search-empty">
                <View className="search-empty__icon">
                  <MaterialCommunityIcons name="magnify-close" size={30} color={colors.brand.blueDark} />
                </View>
                <Text className="search-empty__title">{t('shop.searchEmptyTitle', { query: debouncedQuery })}</Text>
                <Text className="search-empty__body">{t('shop.searchEmptyBody')}</Text>
              </View>
            }
            renderItem={({ item: product }) => (
              <View className="w-[48.5%] mb-3">
                <ProductCard
                  product={product}
                  saved={isSaved(product.id)}
                  onPress={() => openProduct(product.id)}
                  onToggleSave={() => toggleSaved(product.id)}
                />
              </View>
            )}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View className="px-5 mt-4">
              <Text className="section__title">{t('shop.forYouTitle')}</Text>
              <Text className="section__subtitle mt-0.5" numberOfLines={1}>
                {poolName ? t('shop.forYouPool', { name: poolName }) : t('shop.forYouGeneric')}
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
                    saved={isSaved(product.id)}
                    onPress={() => openProduct(product.id)}
                    onToggleSave={() => toggleSaved(product.id)}
                  />
                </View>
              ))}
            </ScrollView>

            <View className="px-5 mt-5">
              <Text className="section__title">{t('shop.categoriesTitle')}</Text>
              <View className="flex-row flex-wrap justify-between mt-3.5">
                {SHOP_CATEGORIES.map((category) => {
                  const count = getProductsByCategory(category.id).length;
                  const name = category.name;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      className={`w-[48.5%] mb-3 category-tile ${category.tone === 'aqua' ? 'category-tile--aqua' : 'category-tile--mint'}`}
                      activeOpacity={0.85}
                      onPress={() => openCategory(category.id)}
                      accessibilityRole="button"
                      accessibilityLabel={t('shop.categoryA11y', { name, count })}
                    >
                      <Text className="category-tile__name">{name}</Text>
                      <Text className="category-tile__count">{t('shop.productCount', { count })}</Text>
                      <View className="category-tile__bubble">
                        <ProductImage source={category.image} imageStyle={category.imageStyle} padding="14%" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
    </SafeAreaView>
  );
}
