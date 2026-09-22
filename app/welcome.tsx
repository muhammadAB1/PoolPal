import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { graphics } from '@/constants/images';
import { fontFamily } from '@/constants/typography';

const NAVY = '#073B5C';
const TEAL_DARK = '#078B8F';
const TEAL = '#0FB7BC';
const AQUA = '#22CBD2';
const WHITE = '#FFFFFF';
const BASE_WIDTH = 390;
const BASE_LAYOUT_HEIGHT = 760;

function FeatureCard({
  icon,
  label,
  size,
  scale,
}: {
  icon: ImageSourcePropType;
  label: string;
  size: number;
  scale: number;
}) {
  return (
    <View
      style={[
        styles.featureCard,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          paddingHorizontal: 7 * scale,
        },
      ]}
    >
      <Image
        source={icon}
        style={{ width: 42 * scale, height: 42 * scale }}
        resizeMode="contain"
      />
      <Text
        allowFontScaling={false}
        style={[
          styles.featureText,
          {
            marginTop: 2 * scale,
            fontSize: 11.3 * scale,
            lineHeight: 13.2 * scale,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // One-screen layout: no scrolling. The hero and CTA panel share the safe viewport.
  const availableHeight = Math.max(1, height - insets.top - insets.bottom);
  const scale = Math.min(width / BASE_WIDTH, availableHeight / BASE_LAYOUT_HEIGHT, 1.08);

  // Match the approved mockup proportions: roughly half hero / half CTA panel.
  const heroHeight = availableHeight * 0.49;
  const ctaHeight = availableHeight - heroHeight;
  const side = 20 * scale;
  const featureSize = 99 * scale;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Image
        source={graphics.poolTonicWelcomeBackground}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={[styles.hero, { height: heroHeight, paddingHorizontal: side }]}>
            <View style={[styles.brandRow, { marginTop: 3 * scale }]}>
              <Image
                source={graphics.poolTonicLogo}
                style={{ width: 58 * scale, height: 58 * scale }}
                resizeMode="contain"
              />
              <Text
                allowFontScaling={false}
                style={[
                  styles.brandName,
                  {
                    marginLeft: 10 * scale,
                    fontSize: 31.5 * scale,
                    lineHeight: 36 * scale,
                  },
                ]}
              >
                PoolTonic
              </Text>
            </View>

            <View style={[styles.heroCopy, { width: 254 * scale, marginTop: 24 * scale }]}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.heroTitle,
                  {
                    fontSize: 34.5 * scale,
                    lineHeight: 37 * scale,
                    letterSpacing: -0.9 * scale,
                  },
                ]}
              >
                {t('welcome_title_primary')}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.heroTitle,
                  styles.heroTitleAccent,
                  {
                    fontSize: 34.5 * scale,
                    lineHeight: 37 * scale,
                    letterSpacing: -0.9 * scale,
                  },
                ]}
              >
                {t('welcome_title_accent')}
              </Text>

              <Text
                allowFontScaling={false}
                style={[
                  styles.heroSubtitle,
                  {
                    width: 246 * scale,
                    marginTop: 14 * scale,
                    fontSize: 16.7 * scale,
                    lineHeight: 22.8 * scale,
                  },
                ]}
              >
                {t('welcome_subtitle')}
              </Text>
            </View>

            <View
              style={[
                styles.featuresRow,
                {
                  left: 14 * scale,
                  right: 14 * scale,
                  // Raised above the CTA panel to create the approved visual breathing room.
                  bottom: 13 * scale,
                },
              ]}
            >
              <FeatureCard
                scale={scale}
                size={featureSize}
                icon={graphics.poolTonicFeatureTest}
                label={t('welcome_feature_test')}
              />
              <FeatureCard
                scale={scale}
                size={featureSize}
                icon={graphics.poolTonicFeatureFix}
                label={t('welcome_feature_fix')}
              />
              <FeatureCard
                scale={scale}
                size={featureSize}
                icon={graphics.poolTonicFeatureEnjoy}
                label={t('welcome_feature_enjoy')}
              />
            </View>
          </View>

          <View
            style={[
              styles.ctaCard,
              {
                height: ctaHeight,
                marginHorizontal: 7 * scale,
                borderRadius: 31 * scale,
                paddingHorizontal: 20 * scale,
                paddingTop: 15 * scale,
                paddingBottom: 10 * scale,
              },
            ]}
          >
            <View style={styles.ctaHeadingRow}>
              <Image
                source={graphics.poolTonicRemedy}
                style={{ width: 62 * scale, height: 68 * scale }}
                resizeMode="contain"
              />
              <View style={[styles.ctaHeadingCopy, { marginLeft: 10 * scale }]}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.86}
                  style={[
                    styles.ctaTitle,
                    {
                      fontSize: 22 * scale,
                      lineHeight: 25 * scale,
                    },
                  ]}
                >
                  {t('welcome_cta_title')}
                </Text>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                  style={[
                    styles.ctaTitle,
                    styles.ctaTitleAccent,
                    {
                      fontSize: 20.2 * scale,
                      lineHeight: 24 * scale,
                    },
                  ]}
                >
                  {t('welcome_cta_title_accent')}
                </Text>
              </View>
            </View>

            <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
              style={[
                styles.ctaSubtitle,
                {
                  marginTop: 5 * scale,
                  marginBottom: 9 * scale,
                  fontSize: 13.8 * scale,
                  lineHeight: 18 * scale,
                },
              ]}
            >
              {t('welcome_cta_subtitle')}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/signup')}
              activeOpacity={0.88}
              style={[
                styles.primaryButtonShell,
                {
                  height: 48 * scale,
                  borderRadius: 24 * scale,
                },
              ]}
            >
              <ImageBackground
                source={graphics.poolTonicButtonGradient}
                resizeMode="stretch"
                style={styles.buttonFill}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.primaryButtonText, { fontSize: 19 * scale }]}
                >
                  {t('welcome_get_started')}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.primaryButtonArrow,
                    {
                      marginLeft: 11 * scale,
                      fontSize: 31 * scale,
                      lineHeight: 31 * scale,
                    },
                  ]}
                >
                  ›
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/signin')}
              activeOpacity={0.85}
              style={[
                styles.secondaryButton,
                {
                  height: 42 * scale,
                  marginTop: 8 * scale,
                  borderRadius: 21 * scale,
                  borderWidth: 1.5 * scale,
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.86}
                style={[styles.secondaryButtonText, { fontSize: 15.7 * scale }]}
              >
                {t('welcome_have_account')}
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.trustBox,
                {
                  height: 50 * scale,
                  marginTop: 8 * scale,
                  borderRadius: 25 * scale,
                  paddingHorizontal: 14 * scale,
                },
              ]}
            >
              <Image
                source={graphics.poolTonicTrustShield}
                style={{ width: 32 * scale, height: 36 * scale }}
                resizeMode="contain"
              />
              <View
                style={[
                  styles.trustDivider,
                  {
                    height: 30 * scale,
                    marginHorizontal: 12 * scale,
                  },
                ]}
              />
              <View style={styles.trustCopy}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  style={[styles.trustText, { fontSize: 12.2 * scale, lineHeight: 15 * scale }]}
                >
                  {t('welcome_trusted')}
                </Text>
                <Image
                  source={graphics.poolTonicStars}
                  style={{ width: 94 * scale, height: 20 * scale, marginTop: 1 * scale }}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={[styles.footerBlock, { marginTop: 7 * scale }]}>
              <View style={styles.taglineRow}>
                <View style={[styles.taglineRule, { width: 68 * scale, marginRight: 12 * scale }]} />
                <Image
                  source={graphics.poolTonicWave}
                  style={{ width: 33 * scale, height: 20 * scale }}
                  resizeMode="contain"
                />
                <View style={[styles.taglineRule, { width: 68 * scale, marginLeft: 12 * scale }]} />
              </View>
              <Text
                allowFontScaling={false}
                style={[
                  styles.tagline,
                  {
                    marginTop: 1 * scale,
                    fontSize: 8.5 * scale,
                    letterSpacing: 2.65 * scale,
                  },
                ]}
              >
                {t('welcome_tagline')}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#D8F7FC',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  hero: {
    position: 'relative',
    overflow: 'visible',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 4,
  },
  brandName: {
    color: NAVY,
    fontFamily: fontFamily.extrabold,
    letterSpacing: -1,
  },
  heroCopy: {
    zIndex: 4,
  },
  heroTitle: {
    color: NAVY,
    fontFamily: fontFamily.extrabold,
  },
  heroTitleAccent: {
    color: TEAL,
  },
  heroSubtitle: {
    color: NAVY,
    fontFamily: fontFamily.semibold,
    letterSpacing: -0.25,
  },
  featuresRow: {
    position: 'absolute',
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NAVY,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 9,
    elevation: 4,
  },
  featureText: {
    color: '#071C47',
    fontFamily: fontFamily.bold,
    textAlign: 'center',
  },
  ctaCard: {
    backgroundColor: 'rgba(255,255,255,0.985)',
    shadowColor: NAVY,
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 18,
    elevation: 8,
  },
  ctaHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  ctaTitle: {
    color: NAVY,
    fontFamily: fontFamily.extrabold,
    letterSpacing: -0.55,
  },
  ctaTitleAccent: {
    color: TEAL,
  },
  ctaSubtitle: {
    textAlign: 'center',
    color: NAVY,
    fontFamily: fontFamily.regular,
  },
  primaryButtonShell: {
    overflow: 'hidden',
    shadowColor: AQUA,
    shadowOpacity: 0.27,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 12,
    elevation: 5,
  },
  buttonFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: WHITE,
    fontFamily: fontFamily.extrabold,
  },
  primaryButtonArrow: {
    color: WHITE,
    fontFamily: fontFamily.regular,
  },
  secondaryButton: {
    borderColor: TEAL,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: TEAL_DARK,
    fontFamily: fontFamily.bold,
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1FAFC',
  },
  trustDivider: {
    width: 1,
    backgroundColor: '#A7D9E2',
  },
  trustCopy: {
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  trustText: {
    color: NAVY,
    fontFamily: fontFamily.regular,
  },
  footerBlock: {
    alignItems: 'center',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineRule: {
    height: 1,
    backgroundColor: '#B8E6EC',
  },
  tagline: {
    color: TEAL,
    textAlign: 'center',
    fontFamily: fontFamily.semibold,
    textTransform: 'uppercase',
  },
});
