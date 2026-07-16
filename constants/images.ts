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
import selectedCheckBadge from '../assets/poolbasicsimages/poolwise_remaining_ui_assets_pngs/selected_check_badge.png';
import unselectedRadioIndicator from '../assets/poolbasicsimages/poolwise_remaining_ui_assets_pngs/unselected_radio_indicator.png';

// ─── Pool Basics — Pool Type (keyed to DB enum values) ───────────────────────
import poolTypeChlorine from '../assets/poolbasicsimages/poolbasics/Chlorine.png';
import poolTypeSaltwater from '../assets/poolbasicsimages/poolbasics/Saltwater.png';
import poolTypeOther from '../assets/poolbasicsimages/poolbasics/Other.png';

// ─── Pool Basics — Screened ───────────────────────────────────────────────────
import poolScreenedYes from '../assets/poolbasicsimages/poolbasics/Screened.png';
import poolScreenedNo from '../assets/poolbasicsimages/poolbasics/Unscreened.png';

// ─── Pool Basics — Use ────────────────────────────────────────────────────────
import poolUseFamily from '../assets/poolbasicsimages/poolbasics/Family.png';
import poolUseVacationHome from '../assets/poolbasicsimages/poolbasics/VacationHome.png';
import poolUseShortTermRental from '../assets/poolbasicsimages/poolbasics/ShortTermRental.png';

// ─── Pool Condition (keyed to DB enum values) ──────────────────────────────────
import poolConditionCrystalClear from '../assets/pool-condition-images/CrystalClear.png';
import poolConditionALittleCloudy from '../assets/pool-condition-images/ALittleCloudy.png';
import poolConditionGreen from '../assets/pool-condition-images/Green.png';
import poolConditionVeryGreenOrDark from '../assets/pool-condition-images/VeryGreen.png';
import poolConditionNotSure from '../assets/pool-condition-images/NotSure.png';

// ─── Equipment Basics — Filter & Pump examples (keyed to DB enum values) ─────
import filterSand from '../assets/equipment-basic-images/filter_sand.png';
import filterCartridge from '../assets/equipment-basic-images/filter_cartridge.png';
import filterDe from '../assets/equipment-basic-images/filter_de.png';
import pumpSingleSpeed from '../assets/equipment-basic-images/pump_single_speed.png';
import pumpDualSpeed from '../assets/equipment-basic-images/pump_dual_speed.png';
import pumpVariableSpeed from '../assets/equipment-basic-images/pump_variable_speed.png';

// ─── Pool Surface Type (keyed to DB enum values) ─────────────────────────────
import surfacePlaster from '../assets/pool-surface-images/plaster.png';
import surfacePebble from '../assets/pool-surface-images/pebble.png';
import surfaceVinyl from '../assets/pool-surface-images/vinyl.png';
import surfaceFiberglass from '../assets/pool-surface-images/fiberglass.png';
import surfaceTile from '../assets/pool-surface-images/tile.png';
import surfaceNotSure from '../assets/pool-surface-images/pool_surface_not_sure_icon.png';

// ─── Cleaning Setup (keyed to CleaningType values) ────────────────────────────
import cleaningRobotic from '../assets/cleaning-setup-images/robotic-cleaner.png';
import cleaningSuctionSide from '../assets/cleaning-setup-images/suction-side-cleaner.png';
import cleaningPressureSide from '../assets/cleaning-setup-images/pressure-side-cleaner.png';
import cleaningManualVacuum from '../assets/cleaning-setup-images/manual-vaccum.png';
import cleaningNoVacuum from '../assets/cleaning-setup-images/no-vaccum.png';
import cleaningNotSure from '../assets/cleaning-setup-images/pool_surface_not_sure_icon.png';

// ─── Test Readings (keyed to TestReadingsMethod values) ───────────────────────
import testReadingsResultsIcon from '../assets/pool-reading-images/test_results_flask.png';
import testReadingsPhotoIcon from '../assets/pool-reading-images/test_strip_photo_camera.png';
import testReadingsNoneIcon from '../assets/pool-reading-images/no_results_calendar.png';
import testReadingsInfoIcon from '../assets/pool-reading-images/info_icon.png';
import testReadingsStripPhoto from '../assets/pool-reading-images/test_strips.png';
import testReadingsBackyardPhoto from '../assets/pool-reading-images/pool-backyard.png';
import reminderShield from '../assets/pool-reading-images/reminder_shield.png';

// ─── Onboarding completion (pool profile) ────────────────────────────────────
import poolProfileWaterDrop from '../assets/onboardin-screen-images/pool-profile-water-drop.png';
import poolProfileTestTube from '../assets/onboardin-screen-images/pool-profile-test-tube.png';
import poolProfilePhoto from '../assets/onboardin-screen-images/pool-profile-photo.png';
import poolProfileCalculator from '../assets/onboardin-screen-images/pool-profile-calculator.png';
import poolProfileInfo from '../assets/onboardin-screen-images/pool-profile-info.png';
import poolProfileStar from '../assets/onboardin-screen-images/pool-profile-star.png';

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
    selectedCheckBadge,
    unselectedRadioIndicator,
} as const;

/**
 * Pool Basics screen images.
 * Keys for poolType match the Supabase DB enum values exactly:
 *   Chlorine | Saltwater | Other
 */
export const poolBasicsImages = {
    poolType: {
        Chlorine: poolTypeChlorine,
        Saltwater: poolTypeSaltwater,
        Other: poolTypeOther,
    },
    screened: {
        Screened: poolScreenedYes,
        Unscreened: poolScreenedNo,
    },
    use: {
        Family: poolUseFamily,
        VacationHome: poolUseVacationHome,
        ShortTermRental: poolUseShortTermRental,
    },
} as const;

/**
 * Pool Condition screen images.
 * Keys match the Supabase DB enum values exactly:
 *   CRYSTAL_CLEAR | A_LITTLE_CLOUDY | GREEN | VERY_GREEN_OR_DARK | NOT_SURE
 */
export const poolConditionImages = {
    CRYSTAL_CLEAR: poolConditionCrystalClear,
    A_LITTLE_CLOUDY: poolConditionALittleCloudy,
    GREEN: poolConditionGreen,
    VERY_GREEN_OR_DARK: poolConditionVeryGreenOrDark,
    NOT_SURE: poolConditionNotSure,
} as const;

/**
 * Equipment Basics screen images.
 * Keys match the FilterType / PumpType values exactly:
 *   filter: Sand | Cartridge | DE
 *   pump:   Single | Dual | Variable
 */
export const equipmentImages = {
    filter: {
        Sand: filterSand,
        Cartridge: filterCartridge,
        DE: filterDe,
    },
    pump: {
        Single: pumpSingleSpeed,
        Dual: pumpDualSpeed,
        Variable: pumpVariableSpeed,
    },
} as const;

/**
 * Pool Surface Type screen images.
 * Keys match the Supabase DB enum values exactly:
 *   Plaster | Pebble | Vinyl | Fiberglass | Tile | NotSure
 */
export const poolSurfaceImages = {
    Plaster: surfacePlaster,
    Pebble: surfacePebble,
    Vinyl: surfaceVinyl,
    Fiberglass: surfaceFiberglass,
    Tile: surfaceTile,
    NotSure: surfaceNotSure,
} as const;

/**
 * Cleaning Setup screen images.
 * Keys match the CleaningType values exactly:
 *   Robotic | SuctionSide | PressureSide | ManualVacuum | NoVacuum | NotSure
 */
export const cleaningSetupImages = {
    Robotic: cleaningRobotic,
    SuctionSide: cleaningSuctionSide,
    PressureSide: cleaningPressureSide,
    ManualVacuum: cleaningManualVacuum,
    NoVacuum: cleaningNoVacuum,
    NotSure: cleaningNotSure,
} as const;

/**
 * Test Readings screen images.
 * Keys match the TestReadingsMethod values exactly:
 *   Readings | Photo | None
 */
export const testReadingsImages = {
    Readings: testReadingsResultsIcon,
    Photo: testReadingsPhotoIcon,
    None: testReadingsNoneIcon,
} as const;

export const testReadingsGraphics = {
    infoIcon: testReadingsInfoIcon,
    stripPhoto: testReadingsStripPhoto,
    backyardPhoto: testReadingsBackyardPhoto,
} as const;

export const poolSizeGraphics = {
    reminderShield,
    infoIcon: testReadingsInfoIcon,
} as const;

/**
 * Onboarding completion screen images.
 */
export const onboardingCompleteImages = {
    waterDrop: poolProfileWaterDrop,
    testTube: poolProfileTestTube,
    photo: poolProfilePhoto,
    calculator: poolProfileCalculator,
    info: poolProfileInfo,
    star: poolProfileStar,
} as const;

/** Convenience alias — use `graphics` or `icons` directly for clarity */
export const images = {
    ...graphics,
} as const;
