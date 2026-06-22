/**
 * Centralized image & icon imports.
 * All app assets are imported here and exported as named objects.
 *
 * Usage:
 *   import { graphics, icons } from '@/constants/images';
 *   <Image source={graphics.poolPalLogo} />
 *   <Image source={icons.bell} />
 */

// ─── Graphics ────────────────────────────────────────────────────────────────
import poolPalLogo from '../assets/graphics/pool_pal_logo.png';
import poolPalLogoDarkBg from '../assets/graphics/pool_pal_logo_dark_bg.png';
import poolPalLogoLightBg from '../assets/graphics/pool_pal_logo_light_bg.png';
import poolCardWave from '../assets/graphics/pool_card_wave.png';
import testKitCardGraphic from '../assets/graphics/test_kit_card_graphic.png';
import checklistSuccess from '../assets/graphics/checklist_success.png';
import completionRing from '../assets/graphics/completion_ring.png';
import emptyStatePool from '../assets/graphics/empty_state_pool.png';

// ─── Icons (1x) ──────────────────────────────────────────────────────────────

import iconAiChat from '../assets/icons_1x/ai_chat.png';
import iconArrowRight from '../assets/icons_1x/arrow_right.png';
import iconBackArrow from '../assets/icons_1x/back_arrow.png';
import iconBell from '../assets/icons_1x/bell.png';
import iconCalendar from '../assets/icons_1x/calendar.png';
import iconCamera from '../assets/icons_1x/camera.png';
import iconCheckboxChecked from '../assets/icons_1x/checkbox_checked.png';
import iconChecklist from '../assets/icons_1x/checklist.png';
import iconCheckmark from '../assets/icons_1x/checkmark.png';
import iconCircleCheck from '../assets/icons_1x/circle_check.png';
import iconDashboard from '../assets/icons_1x/dashboard.png';
import iconFilter from '../assets/icons_1x/filter.png';
import iconInfo from '../assets/icons_1x/info.png';
import iconLearn from '../assets/icons_1x/learn.png';
import iconLock from '../assets/icons_1x/lock.png';
import iconPool from '../assets/icons_1x/pool.png';
import iconProfile from '../assets/icons_1x/profile.png';
import iconPump from '../assets/icons_1x/pump.png';
import iconRadioEmpty from '../assets/icons_1x/radio_empty.png';
import iconRadioSelected from '../assets/icons_1x/radio_selected.png';
import iconReadings from '../assets/icons_1x/readings.png';
import iconSalt from '../assets/icons_1x/salt.png';
import iconTestStrip from '../assets/icons_1x/test_strip.png';
import iconUpload from '../assets/icons_1x/upload.png';
import iconWarning from '../assets/icons_1x/warning.png';
import iconWaterDrop from '../assets/icons_1x/water_drop.png';

// ─── Exports ─────────────────────────────────────────────────────────────────

export const graphics = {
    poolPalLogo,
    poolPalLogoDarkBg,
    poolPalLogoLightBg,
    poolCardWave,
    testKitCardGraphic,
    checklistSuccess,
    completionRing,
    emptyStatePool,
} as const;

export const icons = {
    aiChat: iconAiChat,
    arrowRight: iconArrowRight,
    backArrow: iconBackArrow,
    bell: iconBell,
    calendar: iconCalendar,
    camera: iconCamera,
    checkboxChecked: iconCheckboxChecked,
    checklist: iconChecklist,
    checkmark: iconCheckmark,
    circleCheck: iconCircleCheck,
    dashboard: iconDashboard,
    filter: iconFilter,
    info: iconInfo,
    learn: iconLearn,
    lock: iconLock,
    pool: iconPool,
    profile: iconProfile,
    pump: iconPump,
    radioEmpty: iconRadioEmpty,
    radioSelected: iconRadioSelected,
    readings: iconReadings,
    salt: iconSalt,
    testStrip: iconTestStrip,
    upload: iconUpload,
    warning: iconWarning,
    waterDrop: iconWaterDrop,
} as const;

/** Convenience alias — use `graphics` or `icons` directly for clarity */
export const images = {
    ...graphics,
} as const;
