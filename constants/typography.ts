/**
 * PoolPal typography tokens — single source of truth.
 * Font: Plus Jakarta Sans (Google Fonts via @expo-google-fonts/plus-jakarta-sans).
 *
 * fontFamily values map to the exact font file names loaded by expo-font.
 * Use these in StyleSheet contexts (e.g. fontFamily: fontFamily.extrabold).
 *
 * Tailwind utility mapping (via global.css @theme):
 *   fontFamily.regular    → font-jakarta
 *   fontFamily.semibold   → font-jakarta-semibold
 *   fontFamily.bold       → font-jakarta-bold
 *   fontFamily.extrabold  → font-jakarta-extrabold
 *
 *   Text scale → text-h1, text-h2, text-h3, text-body-lg,
 *                text-body, text-label, text-small, text-tiny, text-button
 */

export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

/** Font sizes in px (source: typography.json scale) */
export const fontSize = {
  h1: 24,
  h2: 22,
  h3: 17,
  bodyLg: 16,
  body: 14,
  subtitle: 14,
  label: 12.5,
  small: 12.5,
  tiny: 10.5,
  button: 16,
} as const;

/**
 * Absolute line heights (font-size × multiplier, rounded).
 * Use these in StyleSheet — React Native requires absolute px, not ratios.
 */
export const lineHeight = {
  h1: Math.round(24 * 1.2),       // 29
  h2: Math.round(22 * 1.25),      // 28
  h3: Math.round(17 * 1.3),       // 22
  bodyLg: Math.round(16 * 1.55),  // 25
  body: Math.round(14 * 1.45),    // 20
  subtitle: Math.round(14 * 1.45),// 20
  label: Math.round(12.5 * 1.3),  // 16
  small: Math.round(12.5 * 1.4),  // 18
  tiny: Math.round(10.5 * 1.2),   // 13
  button: Math.round(16 * 1.0),   // 16
} as const;

/** Font weights as numbers (for reference; use fontFamily variants in RN) */
export const fontWeight = {
  regular: 400,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export type FontFamily = typeof fontFamily;
export type FontSize = typeof fontSize;
export type LineHeight = typeof lineHeight;
