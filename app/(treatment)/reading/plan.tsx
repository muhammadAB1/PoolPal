import PoolTonicLogo from '@/components/PoolTonicLogo';
import { graphics, icons } from '@/constants/images';
import { colors, shadow } from '@/constants/theme';
import { usePool } from '@/providers/PoolProvider';
import { useTestStrips } from '@/providers/TestStripProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getReadingsThatNeedTreatment,
  statusesForReading,
  NO_TREATMENT_NEEDED,
  TREATMENT_PLAN,
  type TreatmentIconKey,
} from './_data';

/** Maps a content-only icon key to the actual icon library + glyph. */
function TreatmentIcon({
  iconKey,
  size,
  color,
}: {
  iconKey: TreatmentIconKey;
  size: number;
  color: string;
}) {
  switch (iconKey) {
    case 'dropper':
      return <MaterialCommunityIcons name="eyedropper-variant" size={size} color={color} />;
    case 'waterDrop':
      return <Ionicons name="water-outline" size={size} color={color} />;
    case 'measure':
      return <MaterialCommunityIcons name="beaker-outline" size={size} color={color} />;
    case 'wave':
      return <MaterialCommunityIcons name="waves" size={size} color={color} />;
    case 'sparkle':
      return <Ionicons name="sparkles-outline" size={size} color={color} />;
    case 'pill':
      return <MaterialCommunityIcons name="pill" size={size} color={color} />;
    case 'rain':
      return <Ionicons name="rainy-outline" size={size} color={color} />;
    case 'trendDown':
      return <Ionicons name="trending-down-outline" size={size} color={color} />;
    case 'calculator':
      return <Ionicons name="calculator-outline" size={size} color={color} />;
    case 'clock':
      return <Ionicons name="time-outline" size={size} color={color} />;
    default:
      return null;
  }
}

/** Treatment Plan screen — currently hardcodes the low pH scenario from `_data.ts`. */
export default function TreatmentPlanScreen() {
  const router = useRouter();
  const plan = TREATMENT_PLAN;

  const { latestReading, readingStatus, selections, selectedBrand } = useTestStrips();
  const { pools } = usePool();
  const alerts = getReadingsThatNeedTreatment(
    latestReading,
    statusesForReading(latestReading, readingStatus, selectedBrand, selections, pools),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.bg }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-surface-white border border-border-default items-center justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Image source={icons.backArrow} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>

        <PoolTonicLogo width={152} height={43} />

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-surface-white border border-border-default items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={20} color={colors.brand.navy} />
        </TouchableOpacity>
      </View>

      {alerts.length === 0 ? (
        <View className="flex-1 items-center px-8 pt-10">
          <Image source={graphics.checklistSuccess} className="w-36 h-36" resizeMode="contain" />
          <Text className="text-h1 font-jakarta-extrabold text-brand-navy text-center mt-3">
            {NO_TREATMENT_NEEDED.title}
          </Text>
          <Text className="text-body font-jakarta text-sub text-center mt-2 leading-relaxed">
            {NO_TREATMENT_NEEDED.body}
          </Text>

          <View className="card--success flex-row items-center gap-2.5 px-4 py-3 mt-6 self-stretch">
            <Ionicons name="checkmark-circle" size={16} color={colors.status.successText} />
            <Text className="flex-1 text-small font-jakarta-bold text-success-text">
              {NO_TREATMENT_NEEDED.tip}
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-3">
            <Text className="text-h1 font-jakarta-extrabold text-brand-navy">{plan.title}</Text>
            <Text className="text-body font-jakarta text-sub mt-1">{plan.subtitle}</Text>

            {/* Alerts — one card per reading that needs treatment */}
            <View className="gap-3 mt-4">
              {alerts.map((alert) => (
                <View
                  key={alert.testName}
                  className={`${alert.actionable ? 'card--error' : 'card--warning'} flex-row items-start gap-3 p-4`}
                >
                  <View
                    className={`w-11 h-11 rounded-full items-center justify-center ${
                      alert.actionable ? 'bg-error' : 'bg-warning'
                    }`}
                  >
                    <Ionicons
                      name={alert.actionable ? 'alert-circle' : 'time-outline'}
                      size={20}
                      color={colors.surface.white}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body-lg font-jakarta-bold text-brand-navy">
                      {alert.testName} — {alert.value}{alert.testName !== 'pH' ? 'ppm' : ''}
                    </Text>
                    <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
                      {alert.message}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* What to do */}
            <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-6">
              {plan.stepsSectionTitle}
            </Text>
            <View className="gap-3 mt-3">
              {plan.steps.map((step) => (
                <View key={step.id} className="card flex-row items-start gap-3 p-4" style={shadow.card}>

                  <View className="w-9 h-9 rounded-full bg-surface-soft-aqua items-center justify-center">
                    <TreatmentIcon iconKey={step.icon} size={16} color={colors.brand.blue} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body font-jakarta-bold text-brand-navy">{step.title}</Text>
                    <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                      {step.body}
                    </Text>
                  </View>
                </View>
              ))}

              <View className="card--info flex-row items-start gap-3 p-4">
                <View className="w-9 h-9 rounded-full bg-surface-white items-center justify-center">
                  <TreatmentIcon iconKey={plan.alternative.icon} size={16} color={colors.brand.blue} />
                </View>
                <View className="flex-1">
                  <Text className="text-body font-jakarta-bold text-brand-navy">
                    {plan.alternative.title}
                  </Text>
                  <Text className="text-small font-jakarta text-sub mt-0.5 leading-relaxed">
                    {plan.alternative.body}
                  </Text>
                </View>
              </View>
            </View>

            {/* Recommended products */}
            <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-6">
              {plan.productsSectionTitle}
            </Text>
            <View className="flex-row gap-3 mt-3">
              {plan.products.map((product) => (
                <View key={product.id} className="card flex-1 items-center p-3" style={shadow.card}>
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: product.accentColor }}
                  >
                    <Text
                      className="text-tiny font-jakarta-extrabold text-surface-white text-center px-1"
                      numberOfLines={2}
                    >
                      {product.badgeLabel}
                    </Text>
                  </View>
                  <Text
                    className="text-tiny font-jakarta-bold text-brand-navy text-center mt-2"
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="text-tiny font-jakarta text-faint mt-2.5">{plan.productsFootnote}</Text>

            {/* Common causes */}
            <Text className="text-h3 font-jakarta-extrabold text-brand-navy mt-6">
              {plan.causesSectionTitle}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, marginTop: 12 }}
          >
            {plan.causes.map((cause) => (
              <View key={cause.id} className="card items-center p-3" style={[shadow.card, { width: 96 }]}>
                <View className="w-10 h-10 rounded-full bg-surface-soft-aqua items-center justify-center">
                  <TreatmentIcon iconKey={cause.icon} size={16} color={colors.brand.blue} />
                </View>
                <Text
                  className="text-tiny font-jakarta-bold text-charcoal text-center mt-2"
                  numberOfLines={2}
                >
                  {cause.label}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View className="px-5">
            {/* Dosage reference */}
            <View className="card flex-row items-start gap-3 p-4 mt-4" style={shadow.card}>
              <View className="w-10 h-10 rounded-full bg-surface-soft-aqua items-center justify-center">
                <TreatmentIcon iconKey={plan.dosage.icon} size={18} color={colors.brand.blue} />
              </View>
              <View className="flex-1">
                <Text className="text-body font-jakarta-bold text-brand-navy">{plan.dosage.title}</Text>
                <Text className="text-small font-jakarta text-sub mt-1 leading-relaxed">
                  {plan.dosage.body}
                </Text>
              </View>
            </View>

            {/* Retest note */}
            <View className="card--success flex-row items-center gap-2.5 px-4 py-3 mt-3">
              <Ionicons name="time-outline" size={16} color={colors.status.successText} />
              <Text className="flex-1 text-small font-jakarta-bold text-success-text">
                {plan.retestNote}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Sticky footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-white px-5 pt-3 pb-7 border-t border-border-default">
        <TouchableOpacity className="rounded-full bg-brand-blue py-4 items-center"
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/readings')}>
          <Text className="text-button font-jakarta-bold text-surface-white">
            {alerts.length === 0 ? NO_TREATMENT_NEEDED.footer.primaryLabel : plan.footer.primaryLabel}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity className="items-center mt-3" activeOpacity={0.7}>
          <Text className="text-small font-jakarta-bold text-brand-blue">
            {plan.footer.secondaryLabel} ›
          </Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}
