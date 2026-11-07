import ProductImage from '@/components/shop/ProductImage';
import ShopHeader from '@/components/shop/ShopHeader';
import { colors, shadow } from '@/constants/theme';
import { formatPrice, getCategory, getProduct, type Product } from '@/data/shop';
import { useShopList } from '@/providers/ShopListProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopListScreen() {
  const router = useRouter();
  const { savedIds, removeSaved } = useShopList();

  const items = savedIds
    .map((id) => getProduct(id))
    .filter((product): product is Product => product !== undefined);
  const total = items.reduce((sum, product) => sum + product.price, 0);

  const browseShop = () => router.dismissTo('/(tabs)/shop' as Href);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <ShopHeader
          title="My list"
          subtitle={items.length > 0 ? `${items.length} ${items.length === 1 ? 'item' : 'items'} saved` : undefined}
        />

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8 pb-24">
            <View className="w-28 h-28 rounded-full bg-surface-soft-aqua items-center justify-center">
              <MaterialCommunityIcons name="playlist-plus" size={52} color={colors.brand.blueDark} />
            </View>
            <Text className="text-h2 font-jakarta-extrabold text-brand-navy text-center mt-6">
              Your list is empty
            </Text>
            <Text className="text-body-lg font-jakarta text-sub text-center mt-2">
              Tap the plus on any product to save it here for later.
            </Text>
            <TouchableOpacity
              className="btn btn--primary self-stretch mt-7"
              activeOpacity={0.85}
              onPress={browseShop}
            >
              <Text className="btn__label btn__label--primary">Browse products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-5">
            <View className="card" style={shadow.card}>
              <View className="px-4">
                {items.map((product, index) => (
                  <TouchableOpacity
                    key={product.id}
                    className={`flex-row items-center py-3.5 ${index === items.length - 1 ? '' : 'border-b border-border-default'}`}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/(shop)/product/${product.id}` as Href)}
                    accessibilityRole="button"
                    accessibilityLabel={product.name}
                  >
                    <View className="w-20 h-20 rounded-xl overflow-hidden bg-surface-white border border-border-default">
                      <ProductImage source={product.image} imageStyle={product.imageStyle} padding="8%" />
                    </View>

                    <View className="flex-1 mx-3">
                      <Text className="text-body-lg font-jakarta-bold text-brand-navy" numberOfLines={2}>
                        {product.name}
                      </Text>
                      <Text className="text-small font-jakarta text-sub mt-0.5">
                        {getCategory(product.categoryId)?.name}
                      </Text>
                      <Text className="text-body-lg font-jakarta-extrabold text-brand-navy mt-1.5">
                        {formatPrice(product.price)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      className="w-11 h-11 rounded-full items-center justify-center bg-surface-bg"
                      activeOpacity={0.7}
                      onPress={() => removeSaved(product.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${product.name} from my list`}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={21} color={colors.text.sub} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row items-center justify-between px-4 py-4 bg-surface-soft-aqua rounded-b-2xl">
                <Text className="text-body font-jakarta-semibold text-brand-navy">Estimated total</Text>
                <Text className="text-h2 font-jakarta-extrabold text-brand-navy">{formatPrice(total)}</Text>
              </View>
            </View>

            <TouchableOpacity className="btn btn--secondary mt-4" activeOpacity={0.85} onPress={browseShop}>
              <Text className="btn__label btn__label--secondary">Keep browsing</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
