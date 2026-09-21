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
import poolTonicWelcomeBackground from '../assets/welcome/pooltonic_home_image.png';
import poolTonicGradient from '../assets/welcome/pooltonic_gradient.png';
import poolTonicButtonGradient from '../assets/welcome/pooltonic_button_gradient.png';
import poolTonicLogo from '../assets/welcome/pooltonic_logo.png';
import poolTonicFeatureTest from '../assets/welcome/pooltonic_feature_test.png';
import poolTonicFeatureFix from '../assets/welcome/pooltonic_feature_fix.png';
import poolTonicFeatureEnjoy from '../assets/welcome/pooltonic_feature_enjoy.png';
import poolTonicRemedy from '../assets/welcome/pooltonic_pool_remedy.png';
import poolTonicTrustShield from '../assets/welcome/pooltonic_trust_shield.png';
import poolTonicStars from '../assets/welcome/pooltonic_stars.png';
import poolTonicWave from '../assets/welcome/pooltonic_wave.png';
import poolTonicLogoFullLight from '../assets/pooltonic-ui/pooltonic-logo-full-light.png';

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
import poolTypeBromine from '../assets/poolbasicsimages/poolbasics/Bromine.png';
import poolEnvOutdoor from '../assets/pool-basics-v2/pooltonic-outdoor.png';
import poolEnvScreened from '../assets/pool-basics-v2/pooltonic-screened-pool.png';
import poolEnvCovered from '../assets/pool-basics-v2/pooltonic-covered-pool.png';
import poolEnvIndoor from '../assets/pool-basics-v2/pooltonic-indoor-pool.png';
import poolTypeUnknown from '../assets/pool-basics-v2/pooltonic-idontknow.png';

// ─── Pool Basics — Screened ───────────────────────────────────────────────────
import poolScreenedYes from '../assets/poolbasicsimages/poolbasics/Screened.png';
import poolScreenedNo from '../assets/poolbasicsimages/poolbasics/Unscreened.png';

// ─── Pool Basics — Use ────────────────────────────────────────────────────────
import poolUseFamily from '../assets/poolbasicsimages/poolbasics/Family.png';
import poolUseVacationHome from '../assets/poolbasicsimages/poolbasics/VacationHome.png';
import poolUseShortTermRental from '../assets/poolbasicsimages/poolbasics/ShortTermRental.png';

// ─── Pool Basics — Hot Tub / Spa ──────────────────────────────────────────────
import poolHotTubYes from '../assets/poolbasicsimages/poolbasics/hottub.png';
import poolHotTubNo from '../assets/poolbasicsimages/poolbasics/no.png';
import poolSpaAttached from '../assets/poolbasicsimages/poolbasics/attached_spa.webp';
import poolSpaDetached from '../assets/poolbasicsimages/poolbasics/detatched_spa.webp';

// ─── Pool Condition (keyed to DB enum values) ──────────────────────────────────
import poolConditionCrystalClear from '../assets/pool-condition-images/aa.png';
import poolConditionALittleCloudy from '../assets/pool-condition-images/bb.png';
import poolConditionGreen from '../assets/pool-condition-images/cc.png';
import poolConditionVeryGreenOrDark from '../assets/pool-condition-images/dd.png';
import poolConditionNotSure from '../assets/pool-condition-images/ee.png';

// ─── Equipment Basics — Filter & Pump examples (keyed to DB enum values) ─────
import filterSand from '../assets/equipment-basic-images/filter_sand.png';
import filterCartridge from '../assets/equipment-basic-images/filter_cartridge.png';
import filterDe from '../assets/equipment-basic-images/filter_de.png';
import pumpSingleSpeed from '../assets/equipment-basic-images/pump_single_speed.png';
import pumpDualSpeed from '../assets/equipment-basic-images/pump_dual_speed.png';
import pumpVariableSpeed from '../assets/equipment-basic-images/pump_variable_speed.png';
import equipmentChoiceSand from '../assets/equipment-basic-images/pooltonic-sand_filter.png';
import equipmentChoiceCartridge from '../assets/equipment-basic-images/pooltonic-cartridge_filter.png';
import equipmentChoiceDe from '../assets/equipment-basic-images/pooltonic-de_filter.png';
import equipmentChoiceSingle from '../assets/equipment-basic-images/pooltonic-single_speed_pump.png';
import equipmentChoiceDual from '../assets/equipment-basic-images/pooltonic-dual_speed_pump.png';
import equipmentChoiceVariable from '../assets/equipment-basic-images/pooltonic-variable_speed_pump.png';

// ─── Pool Surface Type (keyed to DB enum values) ─────────────────────────────
import surfacePlaster from '../assets/pool-surface-images/plaster.png';
import surfacePebble from '../assets/pool-surface-images/pebble.png';
import surfaceVinyl from '../assets/pool-surface-images/vinyl.png';
import surfaceFiberglass from '../assets/pool-surface-images/fiberglass.png';
import surfaceTile from '../assets/pool-surface-images/tile.png';
import surfaceQuartz from '../assets/pool-surface-images/Additional_Pool_Surfaces/quartz.png';
import surfacePaintedConcrete from '../assets/pool-surface-images/Additional_Pool_Surfaces/painted_concrete.png';
import surfaceSmoothStoneGlassBead from '../assets/pool-surface-images/Additional_Pool_Surfaces/smooth_stone_glass_bead.png';
import surfaceReinforcedPvcMembrane from '../assets/pool-surface-images/Additional_Pool_Surfaces/reinforced_pvc_membrane.png';
import surfaceStainlessSteel from '../assets/pool-surface-images/Additional_Pool_Surfaces/stainless_steel.png';
import surfaceCopper from '../assets/pool-surface-images/Additional_Pool_Surfaces/copper.png';
import surfaceVinylLiner from '../assets/pool-surface-images/Additional_Pool_Surfaces/vinyl_liner.png';
import surfaceOtherCustom from '../assets/pool-surface-images/Additional_Pool_Surfaces/other_custom_surface.png';
import surfaceNotSure from '../assets/pool-surface-images/pool_surface_not_sure_icon.png';

// ─── Cleaning Setup (keyed to CleaningType values) ────────────────────────────
import cleaningRobotic from '../assets/cleaning-setup-images/robotic-cleaner1.png';
import cleaningSuctionSide from '../assets/cleaning-setup-images/suction-side-cleaner1.jpg';
import cleaningPressureSide from '../assets/cleaning-setup-images/pressure-side-cleaner1.jpg';
import cleaningManualVacuum from '../assets/cleaning-setup-images/manual-vaccum1.jpg';
import cleaningNoVacuum from '../assets/cleaning-setup-images/no-vaccum1.jpg';
import cleaningNotSure from '../assets/cleaning-setup-images/pool_surface_not_sure_icon.png';

// ─── Test Readings (keyed to TestReadingsMethod values) ───────────────────────
import testReadingsResultsIcon from '../assets/pool-reading-images/test_results_flask.png';
import testReadingsPhotoIcon from '../assets/pool-reading-images/test_strip_photo_camera.png';
import testReadingsNoneIcon from '../assets/pool-reading-images/no_results_calendar.png';
import testReadingsInfoIcon from '../assets/pool-reading-images/info_icon.png';
import testReadingsStripPhoto from '../assets/pool-reading-images/test_strips.png';
import testReadingsBackyardPhoto from '../assets/pool-reading-images/pool-backyard.png';
import reminderShield from '../assets/pool-reading-images/reminder_shield.png';
import poolTonicTipsIcon from '../assets/pooltonic-ui/pooltonic-tips-icon.png';
import poolTonicMeasurementsKnown from '../assets/pooltonic-ui/pooltonic-measurements-known.png';
import poolTonicHelp from '../assets/pooltonic-ui/pooltonic-help.png';
import poolTonicShapeRectangle from '../assets/pooltonic-ui/pooltonic-rectangle.png';
import poolTonicShapeCircle from '../assets/pooltonic-ui/pooltonic-circle.png';
import poolTonicShapeOval from '../assets/pooltonic-ui/pooltonic-oval.png';
import poolTonicShapeKidney from '../assets/pooltonic-ui/pooltonic-kidney.png';

// ─── Choose Test Method ───────────────────────────────────────────────────────
import chooseTestMethodStrip from '../assets/pool-reading-images-new/strip.webp';
import chooseTestMethodFlask from '../assets/pool-reading-images-new/flask.webp';
import chooseTestMethodResults from '../assets/pool-reading-images-new/results.webp';
import chooseTestMethodMagnifyingGlass from '../assets/pool-reading-images-new/magnifying_glass.webp';
import chooseTestMethodSettings from '../assets/pool-reading-images-new/settings.png';

// ─── Onboarding completion (pool profile) ────────────────────────────────────
import poolProfileWaterDrop from '../assets/onboardin-screen-images/pool-profile-water-drop.png';
import poolProfileTestTube from '../assets/onboardin-screen-images/pool-profile-test-tube.png';
import poolProfilePhoto from '../assets/onboardin-screen-images/pool-profile-photo.png';
import poolProfileCalculator from '../assets/onboardin-screen-images/pool-profile-calculator.png';
import poolProfileInfo from '../assets/onboardin-screen-images/pool-profile-info.png';
import poolProfileStar from '../assets/onboardin-screen-images/pool-profile-star.png';

// ─── Dashboard ────────────────────────────────────────────────────────────────
import dashboardHelloEmoji from '../assets/dashboard-images/hello_emoji.png';
import dashboardNotificationBell from '../assets/dashboard-images/notification_bell_with_dot.png';
import dashboardPoolIllustration from '../assets/dashboard-images/pool_summary_illustration.png';
import dashboardGreenCheckIcon from '../assets/dashboard-images/green_check_icon.png';
import dashboardSmallInfoIcon from '../assets/dashboard-images/small_info_icon.png';
import dashboardStarBadge from '../assets/dashboard-images/recommended_star_badge.png';
import dashboardTestingKitGraphic from '../assets/dashboard-images/testing_kit_recommendation_graphic.png';
import dashboardChevronRight from '../assets/dashboard-images/chevron_right.png';
import dashboardProfileIcon from '../assets/dashboard-images/profile_person_icon.png';
import dashboardNextStepIcon from '../assets/dashboard-images/next_step_flag_icon.png';
import dashboardChecklistIcon from '../assets/dashboard-images/checklist_clipboard_icon_active.png';
import dashboardReadingsIcon from '../assets/dashboard-images/latest_readings_flask_icon.png';
import dashboardUploadPhotoIcon from '../assets/dashboard-images/upload_pool_photo_camera_icon_2.png';
import dashboardAskPoolwiseIcon from '../assets/dashboard-images/ask_poolwise_chat_icon.png';
import dashboardLearnIcon from '../assets/dashboard-images/learn_play_icon.png';
import poolTonicNotificationBell from '../assets/pooltonic-ui/pooltonic-notification-bell.png';
import poolTonicNotificationBellUnread from '../assets/pooltonic-ui/pooltonic-notification-bell-update.png';
import poolTonicUserIcon from '../assets/pooltonic-ui/pooltonic-user-icon.png';
import poolTonicSolveProblems from '../assets/dashboard-images/pooltonic_solve_problems.png';
import poolTonicLearn from '../assets/dashboard-images/pooltonic_learn.png';
import poolTonicAskPoolTonic from '../assets/dashboard-images/pooltonic_ask_pooltonic.png';
import navHomeActive from '../assets/dashboard-images/nav_home_icon_active.png';
import navHomeInactive from '../assets/dashboard-images/nav_home_icon_inactive.png';
import navPoolActive from '../assets/dashboard-images/nav_pool_waves_icon_active.png';
import navPoolInactive from '../assets/dashboard-images/nav_pool_waves_icon_inactive.png';
import navReadingsActive from '../assets/dashboard-images/nav_readings_drop_icon_active.png';
import navReadingsInactive from '../assets/dashboard-images/nav_readings_drop_icon_inactive.png';
import navChecklist from '../assets/dashboard-images/nav_checklist_icon.png';
import navLearnActive from '../assets/dashboard-images/nav_learn_book_icon_active.png';
import navLearnInactive from '../assets/dashboard-images/nav_learn_book_icon_inactive.png';

// ─── Pool tab review screens ─────────────────────────────────────────────────
import poolBasicsHero from '../assets/pool-tab/pool-tab-pool-basic-screen-bg.png';

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
    poolTonicWelcomeBackground,
    poolTonicGradient,
    poolTonicButtonGradient,
    poolTonicLogo,
    poolTonicFeatureTest,
    poolTonicFeatureFix,
    poolTonicFeatureEnjoy,
    poolTonicRemedy,
    poolTonicTrustShield,
    poolTonicStars,
    poolTonicWave,
} as const;

export const brandAssets = {
    logoFull: poolTonicLogoFullLight,
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
 * Keys for poolType and environment match the stored pool values:
 *   Chlorine | Saltwater | Bromine | Other
 *   Outdoor | Screened | Covered | Indoor
 */
export const poolBasicsImages = {
    poolType: {
        Chlorine: poolTypeChlorine,
        Saltwater: poolTypeSaltwater,
        Bromine: poolTypeBromine,
        Other: poolTypeUnknown,
    },
    environment: {
        Outdoor: poolEnvOutdoor,
        Screened: poolEnvScreened,
        Covered: poolEnvCovered,
        Indoor: poolEnvIndoor,
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
    hotTub: {
        Yes: poolHotTubYes,
        No: poolHotTubNo,
        Attached: poolSpaAttached,
        Detached: poolSpaDetached,
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
 * Selectable Equipment Basics cards use this PoolTonic artwork.
 * See Examples uses `equipmentImages` above.
 */
export const equipmentChoiceImages = {
    filter: {
        Sand: equipmentChoiceSand,
        Cartridge: equipmentChoiceCartridge,
        DE: equipmentChoiceDe,
    },
    pump: {
        Single: equipmentChoiceSingle,
        Dual: equipmentChoiceDual,
        Variable: equipmentChoiceVariable,
    },
} as const;

/**
 * Pool Surface Type screen images.
 * Keys match the SurfaceType values exactly.
 */
export const poolSurfaceImages = {
    Plaster: surfacePlaster,
    Pebble: surfacePebble,
    Vinyl: surfaceVinyl,
    Fiberglass: surfaceFiberglass,
    Tile: surfaceTile,
    Quartz: surfaceQuartz,
    PaintedConcrete: surfacePaintedConcrete,
    SmoothStoneGlassBead: surfaceSmoothStoneGlassBead,
    ReinforcedPvcMembrane: surfaceReinforcedPvcMembrane,
    StainlessSteel: surfaceStainlessSteel,
    Copper: surfaceCopper,
    VinylLiner: surfaceVinylLiner,
    OtherCustomSurface: surfaceOtherCustom,
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

/**
 * Choose Test Method screen images.
 */
export const chooseTestMethodImages = {
    strip: chooseTestMethodStrip,
    flask: chooseTestMethodFlask,
    results: chooseTestMethodResults,
    magnifyingGlass: chooseTestMethodMagnifyingGlass,
    settings: chooseTestMethodSettings,
    hero: dashboardPoolIllustration,
} as const;

/**
 * Test strip brand bottle icons, in catalog order.
 * Real brand artwork has not been supplied yet — every slot points at the
 * shared strip placeholder. Replace them one by one as the assets arrive.
 */
export const testStripBrandIcons = [
    iconTestStrip, // icon1 — AquaChek
    iconTestStrip, // icon2 — HTH
    iconTestStrip, // icon3 — Clorox
    iconTestStrip, // icon4 — JNW
    iconTestStrip, // icon5 — EasyTest
    iconTestStrip, // icon6 — kimbist
    iconTestStrip, // icon7 — Bliss Pool
    iconTestStrip, // icon8 — Runbo
] as const;

export const poolSizeGraphics = {
    reminderShield,
    infoIcon: testReadingsInfoIcon,
    tipsIcon: poolTonicTipsIcon,
    measurementsKnown: poolTonicMeasurementsKnown,
    helpEstimate: poolTonicHelp,
    shapeRectangle: poolTonicShapeRectangle,
    shapeRound: poolTonicShapeCircle,
    shapeOval: poolTonicShapeOval,
    shapeFreeform: poolTonicShapeKidney,
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

/**
 * Dashboard screen images.
 */
export const dashboardImages = {
    helloEmoji: dashboardHelloEmoji,
    notificationBell: poolTonicNotificationBell,
    notificationBellUnread: poolTonicNotificationBellUnread,
    legacyNotificationBell: dashboardNotificationBell,
    poolIllustration: dashboardPoolIllustration,
    greenCheckIcon: dashboardGreenCheckIcon,
    smallInfoIcon: dashboardSmallInfoIcon,
    starBadge: dashboardStarBadge,
    testingKitGraphic: dashboardTestingKitGraphic,
    chevronRight: dashboardChevronRight,
    profileIcon: poolTonicUserIcon,
    legacyProfileIcon: dashboardProfileIcon,
    nextStepIcon: dashboardNextStepIcon,
    checklistIcon: dashboardChecklistIcon,
    readingsIcon: dashboardReadingsIcon,
    uploadPhotoIcon: dashboardUploadPhotoIcon,
    askPoolwiseIcon: dashboardAskPoolwiseIcon,
    learnIcon: dashboardLearnIcon,
    solveProblems: poolTonicSolveProblems,
    learn: poolTonicLearn,
    askPoolTonic: poolTonicAskPoolTonic,
} as const;

/**
 * Bottom tab bar icons.
 * `checklist` has a single flat icon — tint it programmatically for the active state.
 */
export const navImages = {
    home: { active: navHomeActive, inactive: navHomeInactive },
    pool: { active: navPoolActive, inactive: navPoolInactive },
    readings: { active: navReadingsActive, inactive: navReadingsInactive },
    checklist: { active: navChecklist, inactive: navChecklist },
    learn: { active: navLearnActive, inactive: navLearnInactive },
} as const;

/**
 * Pool tab review-screen images.
 */
export const poolTabImages = {
    basicsHero: poolBasicsHero,
} as const;

/** Convenience alias — use `graphics` or `icons` directly for clarity */
export const images = {
    ...graphics,
} as const;
