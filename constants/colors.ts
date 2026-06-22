/**
 * PoolPal color tokens — single source of truth.
 * Hex values match assets/colors.json exactly.
 *
 * Tailwind utility mapping (via global.css @theme):
 *   brand.navy      → bg-brand-navy   / text-brand-navy   / border-brand-navy
 *   brand.blue      → bg-brand-blue   / text-brand-blue
 *   brand.blueDark  → bg-brand-blue-dark
 *   brand.aqua      → bg-brand-aqua   / text-brand-aqua
 *   surface.softAqua → bg-surface-soft-aqua
 *   surface.mint    → bg-surface-mint
 *   surface.mintBorder → border-surface-mint-border
 *   surface.bg      → bg-surface-bg
 *   surface.white   → bg-surface-white / text-surface-white
 *   border.default  → border-border-default
 *   text.charcoal   → text-charcoal   / bg-charcoal
 *   text.sub        → text-sub
 *   text.faint      → text-faint
 *   status.success  → bg-success      / text-success
 *   status.successText → text-success-text
 *   status.warning  → bg-warning      / text-warning
 *   status.warningBg → bg-warning-bg
 *   status.error    → bg-error        / text-error
 */

export const colors = {
  brand: {
    navy: '#0B2E4A',
    blue: '#0E97DC',
    blueDark: '#0B82C4',
    aqua: '#5ED6D1',
  },
  surface: {
    softAqua: '#EAF8FF',
    mint: '#E8FFF7',
    mintBorder: '#9FE7D8',
    bg: '#F5F7FA',
    white: '#FFFFFF',
  },
  border: {
    default: '#E5EAF0',
  },
  text: {
    charcoal: '#1D2939',
    sub: '#667085',
    faint: '#98A2B3',
  },
  status: {
    success: '#2EB872',
    successText: '#0B6B53',
    warning: '#F6B84B',
    warningBg: '#FEF6E7',
    error: '#E5484D',
  },
} as const;

export type Colors = typeof colors;
