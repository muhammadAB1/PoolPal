/**
 * PoolPal combined design theme.
 *
 * Re-exports colors and typography tokens, and provides pre-built
 * StyleSheet-compatible text style presets for use in StyleSheet.create()
 * or any context that requires plain RN style objects (Animated, etc.).
 *
 * For NativeWind/Tailwind usage, refer to global.css @theme utilities:
 *   Colors:     text-charcoal, bg-brand-blue, border-border-default, etc.
 *   Type scale: text-h1, text-h2, text-body, text-tiny, etc.
 *   Fonts:      font-jakarta, font-jakarta-bold, font-jakarta-extrabold, etc.
 */

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fontFamily, fontSize, lineHeight } from './typography';

export { colors } from './colors';
export { fontFamily, fontSize, lineHeight, fontWeight } from './typography';

/**
 * Pre-composed text style presets.
 * Use in StyleSheet.create() or spread into inline styles.
 *
 * Example:
 *   <Text style={textPresets.h1}>Hello</Text>
 *   <Text style={[textPresets.body, { color: colors.text.sub }]}>...</Text>
 */
export const textPresets = StyleSheet.create({
  h1: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    color: colors.text.charcoal,
  },
  h2: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.h2,
    lineHeight: lineHeight.h2,
    color: colors.text.charcoal,
  },
  h3: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.h3,
    lineHeight: lineHeight.h3,
    color: colors.text.charcoal,
  },
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyLg,
    lineHeight: lineHeight.bodyLg,
    color: colors.text.charcoal,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.text.charcoal,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.subtitle,
    lineHeight: lineHeight.subtitle,
    color: colors.text.sub,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.label,
    lineHeight: lineHeight.label,
    color: colors.text.sub,
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.small,
    lineHeight: lineHeight.small,
    color: colors.text.charcoal,
  },
  tiny: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.tiny,
    lineHeight: lineHeight.tiny,
    color: colors.text.charcoal,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.button,
    lineHeight: lineHeight.button,
  },
});

/**
 * Shadow presets (platform-specific, not expressible with NativeWind).
 * Spread these into StyleSheet styles.
 */
export const shadow = {
  card: {
    shadowColor: colors.brand.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: colors.brand.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

/** Convenience re-export for the full theme in a single import */
const theme = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  textPresets,
  shadow,
} as const;

export default theme;
