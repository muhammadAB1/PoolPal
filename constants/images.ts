/**
 * Centralized image & icon imports.
 * All app assets are imported here and exported as named objects.
 *
 * Usage:
 *   import { graphics, icons } from '@/constants/images';
 *   <Image source={graphics.poolPalLogo} />
 *   <Image source={icons.bell} />
 */

import type { ImageSourcePropType } from 'react-native';

// ─── Graphics ────────────────────────────────────────────────────────────────
import checklistSuccess from '../assets/graphics/checklist_success.png';
import completionRing from '../assets/graphics/completion_ring.png';
import emptyStatePool from '../assets/graphics/empty_state_pool.png';
import poolCardWave from '../assets/graphics/pool_card_wave.png';
import poolPalLogo from '../assets/graphics/pool_pal_logo.png';
import poolPalLogoDarkBg from '../assets/graphics/pool_pal_logo_dark_bg.png';
import poolPalLogoLightBg from '../assets/graphics/pool_pal_logo_light_bg.png';
import testKitCardGraphic from '../assets/graphics/test_kit_card_graphic.png';
import weeklyReminderIcon from '../assets/graphics/PoolTonic-Set-Reminder-removebg-preview.png';
import poolTonicLogoFullLight from '../assets/pooltonic-ui/pooltonic-logo-full-light.png';
import poolTonicButtonGradient from '../assets/welcome/pooltonic_button_gradient.png';
import poolTonicFeatureEnjoy from '../assets/welcome/pooltonic_feature_enjoy.png';
import poolTonicFeatureFix from '../assets/welcome/pooltonic_feature_fix.png';
import poolTonicFeatureTest from '../assets/welcome/pooltonic_feature_test.png';
import poolTonicGradient from '../assets/welcome/pooltonic_gradient.png';
import poolTonicWelcomeBackground from '../assets/welcome/pooltonic_home_image.png';
import poolTonicLogo from '../assets/welcome/pooltonic_logo.png';
import poolTonicRemedy from '../assets/welcome/pooltonic_pool_remedy.png';
import poolTonicStars from '../assets/welcome/pooltonic_stars.png';
import poolTonicTrustShield from '../assets/welcome/pooltonic_trust_shield.png';
import poolTonicWave from '../assets/welcome/pooltonic_wave.png';

// ─── Chemistry icons ─────────────────────────────────────────────────────────
import chemistryBromine from '../assets/chemistry-icons/bromine.png';
import chemistryCalciumHardness from '../assets/chemistry-icons/calcium-hardness.png';
import chemistryCombinedChlorine from '../assets/chemistry-icons/combined-chlorine.png';
import chemistryCopper from '../assets/chemistry-icons/copper.png';
import chemistryCyanuricAcid from '../assets/chemistry-icons/cyanuric-acid.png';
import chemistryFreeChlorine from '../assets/chemistry-icons/free-chlorine.png';
import chemistryIron from '../assets/chemistry-icons/iron.png';
import chemistryPh from '../assets/chemistry-icons/ph.png';
import chemistryPhosphates from '../assets/chemistry-icons/phosphates.png';
import chemistrySalt from '../assets/chemistry-icons/salt.png';
import chemistryTds from '../assets/chemistry-icons/tds.png';
import chemistryTotalAlkalinity from '../assets/chemistry-icons/total-alkalinity.png';
import chemistryTotalChlorine from '../assets/chemistry-icons/total-chlorine.png';
import chemistryTotalHardness from '../assets/chemistry-icons/total-hardness.png';

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
import aquachek7in1 from '../assets/test-strips/aquacheck/aquachek-7-in-1.jpg';
import blissPoolStrips from '../assets/test-strips/Bliss Pool/BlissPool.jpeg';
import cloroxPoolSpa from '../assets/test-strips/clorox/CloroxPoolSpa-Test_strips.jpg';
import easyTest9in1 from '../assets/test-strips/EasyTest 9 in 1/easytest-9in1.jpg';
import hth6Way from '../assets/test-strips/Hth/hth-6-way-strips.webp';
import jnwHotTubSpa from '../assets/test-strips/JNW Hot Tub & Spa/jnw-hot-tub-spa-6-in-1.jpg';
import jnwPoolAndSpa from '../assets/test-strips/jnw/jnwPoolandSpa-7-in-1.jpg';
import kimbistStrips from '../assets/test-strips/kimbist/kimbist.jpeg';
import runboStrips from '../assets/test-strips/Runbo/runbo.jpg';

// ─── Pool Basics — Pool Type (keyed to DB enum values) ───────────────────────
import poolEnvCovered from '../assets/pool-basics-v2/pooltonic-covered-pool.png';
import poolTypeUnknown from '../assets/pool-basics-v2/pooltonic-idontknow.png';
import poolEnvIndoor from '../assets/pool-basics-v2/pooltonic-indoor-pool.png';
import poolEnvOutdoor from '../assets/pool-basics-v2/pooltonic-outdoor.png';
import poolEnvScreened from '../assets/pool-basics-v2/pooltonic-screened-pool.png';
import poolTypeBromine from '../assets/poolbasicsimages/poolbasics/Bromine.png';
import poolTypeChlorine from '../assets/poolbasicsimages/poolbasics/Chlorine.png';
import poolTypeSaltwater from '../assets/poolbasicsimages/poolbasics/Saltwater.png';

// ─── Pool Basics — Screened ───────────────────────────────────────────────────
import poolScreenedYes from '../assets/poolbasicsimages/poolbasics/Screened.png';
import poolScreenedNo from '../assets/poolbasicsimages/poolbasics/Unscreened.png';

// ─── Pool Basics — Use ────────────────────────────────────────────────────────
import poolUseFamily from '../assets/poolbasicsimages/poolbasics/Family.png';
import poolUseShortTermRental from '../assets/poolbasicsimages/poolbasics/ShortTermRental.png';
import poolUseVacationHome from '../assets/poolbasicsimages/poolbasics/VacationHome.png';

// ─── Pool Basics — Hot Tub / Spa ──────────────────────────────────────────────
import poolSpaAttached from '../assets/poolbasicsimages/poolbasics/attached_spa.webp';
import poolSpaDetached from '../assets/poolbasicsimages/poolbasics/detatched_spa.webp';
import poolHotTubYes from '../assets/poolbasicsimages/poolbasics/hottub.png';
import poolHotTubNo from '../assets/poolbasicsimages/poolbasics/no.png';

// ─── Pool Condition (keyed to DB enum values) ──────────────────────────────────
import poolConditionCrystalClear from '../assets/pool-condition-images/aa.png';
import poolConditionALittleCloudy from '../assets/pool-condition-images/bb.png';
import poolConditionGreen from '../assets/pool-condition-images/cc.png';
import poolConditionVeryGreenOrDark from '../assets/pool-condition-images/dd.png';
import poolConditionNotSure from '../assets/pool-condition-images/ee.png';

// ─── Equipment Basics — Filter & Pump examples (keyed to DB enum values) ─────
import filterCartridge from '../assets/equipment-basic-images/filter_cartridge.png';
import filterDe from '../assets/equipment-basic-images/filter_de.png';
import filterSand from '../assets/equipment-basic-images/filter_sand.png';
import equipmentChoiceCartridge from '../assets/equipment-basic-images/pooltonic-cartridge_filter.png';
import equipmentChoiceDe from '../assets/equipment-basic-images/pooltonic-de_filter.png';
import equipmentChoiceDual from '../assets/equipment-basic-images/pooltonic-dual_speed_pump.png';
import equipmentChoiceSand from '../assets/equipment-basic-images/pooltonic-sand_filter.png';
import equipmentChoiceSingle from '../assets/equipment-basic-images/pooltonic-single_speed_pump.png';
import equipmentChoiceVariable from '../assets/equipment-basic-images/pooltonic-variable_speed_pump.png';
import pumpDualSpeed from '../assets/equipment-basic-images/pump_dual_speed.png';
import pumpSingleSpeed from '../assets/equipment-basic-images/pump_single_speed.png';
import pumpVariableSpeed from '../assets/equipment-basic-images/pump_variable_speed.png';

// ─── Pool Surface Type (keyed to DB enum values) ─────────────────────────────
import surfaceCopper from '../assets/pool-surface-images/Additional_Pool_Surfaces/copper.png';
import surfaceOtherCustom from '../assets/pool-surface-images/Additional_Pool_Surfaces/other_custom_surface.png';
import surfacePaintedConcrete from '../assets/pool-surface-images/Additional_Pool_Surfaces/painted_concrete.png';
import surfaceQuartz from '../assets/pool-surface-images/Additional_Pool_Surfaces/quartz.png';
import surfaceReinforcedPvcMembrane from '../assets/pool-surface-images/Additional_Pool_Surfaces/reinforced_pvc_membrane.png';
import surfaceSmoothStoneGlassBead from '../assets/pool-surface-images/Additional_Pool_Surfaces/smooth_stone_glass_bead.png';
import surfaceStainlessSteel from '../assets/pool-surface-images/Additional_Pool_Surfaces/stainless_steel.png';
import surfaceVinylLiner from '../assets/pool-surface-images/Additional_Pool_Surfaces/vinyl_liner.png';
import surfaceFiberglass from '../assets/pool-surface-images/fiberglass.png';
import surfacePebble from '../assets/pool-surface-images/pebble.png';
import surfacePlaster from '../assets/pool-surface-images/plaster.png';
import surfaceNotSure from '../assets/pool-surface-images/pool_surface_not_sure_icon.png';
import surfaceTile from '../assets/pool-surface-images/tile.png';
import surfaceVinyl from '../assets/pool-surface-images/vinyl.png';

// ─── Cleaning Setup (keyed to CleaningType values) ────────────────────────────
import cleaningManualVacuum from '../assets/cleaning-setup-images/manual-vaccum1.jpg';
import cleaningNoVacuum from '../assets/cleaning-setup-images/no-vaccum1.jpg';
import cleaningNotSure from '../assets/cleaning-setup-images/pool_surface_not_sure_icon.png';
import cleaningPressureSide from '../assets/cleaning-setup-images/pressure-side-cleaner1.jpg';
import cleaningRobotic from '../assets/cleaning-setup-images/robotic-cleaner1.jpg';
import cleaningSuctionSide from '../assets/cleaning-setup-images/suction-side-cleaner1.jpg';

// ─── Test Readings (keyed to TestReadingsMethod values) ───────────────────────
import testReadingsNoneIcon from '../assets/pool-reading-images/no_results_calendar.png';
import testReadingsBackyardPhoto from '../assets/pool-reading-images/pool-backyard.png';
import reminderShield from '../assets/pool-reading-images/reminder_shield.png';
import testReadingsResultsIcon from '../assets/pool-reading-images/test_results_flask.png';
import testReadingsPhotoIcon from '../assets/pool-reading-images/test_strip_photo_camera.png';
import testReadingsStripPhoto from '../assets/pool-reading-images/test_strips.png';
import poolTonicShapeCircle from '../assets/pooltonic-ui/pooltonic-circle.png';
import poolTonicHelp from '../assets/pooltonic-ui/pooltonic-help.png';
import poolTonicShapeKidney from '../assets/pooltonic-ui/pooltonic-kidney.png';
import poolTonicMeasurementsKnown from '../assets/pooltonic-ui/pooltonic-measurements-known.png';
import poolTonicShapeOval from '../assets/pooltonic-ui/pooltonic-oval.png';
import poolTonicShapeRectangle from '../assets/pooltonic-ui/pooltonic-rectangle.png';
import poolTonicTipsIcon from '../assets/pooltonic-ui/pooltonic-tips-icon.png';

// ─── Choose Test Method ───────────────────────────────────────────────────────
import chooseTestMethodFlask from '../assets/pool-reading-images-new/flask.webp';
import chooseTestMethodSettings from '../assets/pool-reading-images-new/settings.png';
import poolTonicCheckInfo from '../assets/pooltonic-ui/pooltonic-info-i-icon.png';
import poolTonicCheckVisibleProblem from '../assets/pooltonic-ui/pooltonic-solve-visible-pool-problems.png';
import poolTonicCheckResults from '../assets/pooltonic-ui/pooltonic-test-results.png';
import poolTonicCheckStrip from '../assets/pooltonic-ui/pooltonic-test-strip.png';

// ─── Onboarding completion ───────────────────────────────────────────────────
import onboardingCompleteBackground from '../assets/onboardin-screen-images/screen_07_equipment_basics.png';
import onboardingCatchProblems from '../assets/onboardin-screen-images/Pooltonic-catch-problems.png';
import onboardingKeepWaterSafe from '../assets/onboardin-screen-images/pooltonic-keep-water-safe.png';
import onboardingKnowWhatToDo from '../assets/onboardin-screen-images/PoolTonic-know-what-to-do.png';
import onboardingWeeklyCare from '../assets/onboardin-screen-images/pooltonic-pool-care-each-week.png';
import onboardingRightProducts from '../assets/onboardin-screen-images/pooltonic-use-right-products.png';
// import poolProfileCalculator from '../assets/onboardin-screen-images/pool-profile-calculator.png';
// import poolProfilePhoto from '../assets/onboardin-screen-images/pool-profile-photo.png';
// import poolProfileStar from '../assets/onboardin-screen-images/pool-profile-star.png';
// import poolProfileTestTube from '../assets/onboardin-screen-images/pool-profile-test-tube.png';
// import poolProfileWaterDrop from '../assets/onboardin-screen-images/pool-profile-water-drop.png';

// ─── Dashboard ────────────────────────────────────────────────────────────────
import dashboardAskPoolwiseIcon from '../assets/dashboard-images/ask_poolwise_chat_icon.png';
import dashboardChecklistIcon from '../assets/dashboard-images/checklist_clipboard_icon_active.png';
import dashboardChevronRight from '../assets/dashboard-images/chevron_right.png';
import dashboardGreenCheckIcon from '../assets/dashboard-images/green_check_icon.png';
import dashboardHelloEmoji from '../assets/dashboard-images/hello_emoji.png';
import dashboardReadingsIcon from '../assets/dashboard-images/latest_readings_flask_icon.png';
import dashboardLearnIcon from '../assets/dashboard-images/learn_play_icon.png';
import navLearnActive from '../assets/dashboard-images/nav_learn_book_icon_active.png';
import navLearnInactive from '../assets/dashboard-images/nav_learn_book_icon_inactive.png';
import dashboardNextStepIcon from '../assets/dashboard-images/next_step_flag_icon.png';
import dashboardNotificationBell from '../assets/dashboard-images/notification_bell_with_dot.png';
import dashboardPoolIllustration from '../assets/dashboard-images/pool_summary_illustration.png';
import poolTonicAskPoolTonic from '../assets/dashboard-images/pooltonic_ask_pooltonic.png';
import poolTonicLearn from '../assets/dashboard-images/pooltonic_learn.png';
import poolTonicSolveProblems from '../assets/dashboard-images/pooltonic_solve_problems.png';
import dashboardProfileIcon from '../assets/dashboard-images/profile_person_icon.png';
import dashboardStarBadge from '../assets/dashboard-images/recommended_star_badge.png';
import dashboardSmallInfoIcon from '../assets/dashboard-images/small_info_icon.png';
import dashboardTestingKitGraphic from '../assets/dashboard-images/testing_kit_recommendation_graphic.png';
import dashboardUploadPhotoIcon from '../assets/dashboard-images/upload_pool_photo_camera_icon_2.png';
import poolTonicNavChecklistSelected from '../assets/pooltonic-ui/pooltonic-checklist-selected.png';
import poolTonicNavChecklist from '../assets/pooltonic-ui/pooltonic-checklist.png';
import poolTonicNavHomeSelected from '../assets/pooltonic-ui/pooltonic-home-selected.png';
import poolTonicNavHome from '../assets/pooltonic-ui/pooltonic-home.png';
import poolTonicNotificationBellUnread from '../assets/pooltonic-ui/pooltonic-notification-bell-update.png';
import poolTonicNotificationBell from '../assets/pooltonic-ui/pooltonic-notification-bell.png';
import poolTonicNavPoolSelected from '../assets/pooltonic-ui/pooltonic-pool-selected.png';
import poolTonicNavPool from '../assets/pooltonic-ui/pooltonic-pool.png';
import poolTonicNavReadingsSelected from '../assets/pooltonic-ui/pooltonic-readings-selected.png';
import poolTonicNavReadings from '../assets/pooltonic-ui/pooltonic-readings.png';
import poolTonicNavShopSelected from '../assets/pooltonic-ui/pooltonic-shop-selected.png';
import poolTonicNavShop from '../assets/pooltonic-ui/pooltonic-shop.png';
import poolTonicUserIcon from '../assets/pooltonic-ui/pooltonic-user-icon.png';

// ─── Pool tab review screens ─────────────────────────────────────────────────
import poolBasicsHero from '../assets/pool-tab/pool-tab-pool-basic-screen-bg.jpg';

// ─── Shop product photos (file name = product name without "/") ──────────────
// "&", "+" and "%" are written as "_" in file names: Expo's dev server reads
// asset paths from a query string, where those characters break the lookup.
import productImage001 from '../assets/Product Images/162-Piece 7-Way PoolSpa Test Strips.webp';
import productImage002 from '../assets/Product Images/17-inch Nylon Pool Wall Brush.webp';
import productImage003 from '../assets/Product Images/18-inch Curved-End Pool Brush (greenblack).webp';
import productImage004 from '../assets/Product Images/AIPER EcoSurfer S2 Solar Surface Skimmer.webp';
import productImage005 from '../assets/Product Images/Aqua Joe Pool _ Spa Salt, 40 lb.webp';
import productImage006 from '../assets/Product Images/AquaChek Salt White Test Strip Titrators, 10 ct.webp';
import productImage007 from '../assets/Product Images/AquaChek Silver 7-Way Test Strips (100).webp';
import productImage008 from '../assets/Product Images/AquaChek Yellow 4-Way Test Strips (50).webp';
import productImage009 from '../assets/Product Images/AquaDoc Phosphate Remover, 32 oz.webp';
import productImage010 from '../assets/Product Images/AQUASALT Pool _ Spa Salt, 40 lb.webp';
import productImage011 from '../assets/Product Images/ARM _ Hammer Clear Balance pH Maintenance Tabs (24).webp';
import productImage012 from '../assets/Product Images/Betta SE Plus Dual-Charging Solar Surface Skimmer.webp';
import productImage013 from '../assets/Product Images/Betta SE Solar Robotic Surface Skimmer.webp';
import productImage014 from '../assets/Product Images/BioGuard Chem Out ChlorineBromine Neutralizer, 2 lb.webp';
import productImage015 from '../assets/Product Images/Clorox Pool_Spa Algaecide and Clarifier (128 oz).webp';
import productImage016 from '../assets/Product Images/Clorox Pool_Spa Alkalinity Increaser, 5 lb.webp';
import productImage017 from '../assets/Product Images/Clorox Pool_Spa Calcium Hardness Increaser, 4 lb.webp';
import productImage018 from '../assets/Product Images/Clorox Pool_Spa Chlorine Stabilizer (4 lb).webp';
import productImage019 from '../assets/Product Images/Clorox Pool_Spa ClearPHOS, 1 quart.webp';
import productImage020 from '../assets/Product Images/Clorox Pool_Spa Crazy Clarifier (128 oz).webp';
import productImage021 from '../assets/Product Images/Clorox Pool_Spa My Pool Care Assistant Test Strips (50).webp';
import productImage022 from '../assets/Product Images/Clorox Pool_Spa pH Down, 5 lb.webp';
import productImage023 from '../assets/Product Images/Clorox Pool_Spa pH Up (4 lb).webp';
import productImage024 from '../assets/Product Images/Clorox Pool_Spa Scale, Metal _ Stain Control, 32 oz.webp';
import productImage025 from '../assets/Product Images/Clorox Pool_Spa Shock Clear (6 pack).webp';
import productImage026 from '../assets/Product Images/Clorox Pool_Spa Shock XTRABLUE Plus (12 pack).webp';
import productImage027 from '../assets/Product Images/Clorox Pool_Spa Shock XTRABLUE Plus (6 pack).webp';
import productImage028 from '../assets/Product Images/Clorox Pool_Spa Sink to Clear Flocculant (1 qt).webp';
import productImage029 from '../assets/Product Images/Clorox Pool_Spa Spa Bromine Tablets, 1.5 lb.webp';
import productImage030 from '../assets/Product Images/Clorox Pool_Spa Super Water Clarifier (1 qt).webp';
import productImage031 from '../assets/Product Images/Clorox Pool_Spa Swimming Pool Algaecide and Clarifier.webp';
import productImage032 from '../assets/Product Images/Clorox Pool_Spa XTRABLUE 3-inch Chlorinating Tablets (25 lb).webp';
import productImage033 from '../assets/Product Images/Clorox Pool_Spa XTRABLUE 3-inch Chlorinating Tablets (35 lb).webp';
import productImage034 from '../assets/Product Images/Clorox Pool_Spa XTRABLUE 3-inch Chlorinating Tabs (5 lb).webp';
import productImage035 from '../assets/Product Images/Coopache Skimmer Socks (30 pack).webp';
import productImage036 from '../assets/Product Images/CuLator Metal Eliminator PowerPak 1.0.webp';
import productImage037 from '../assets/Product Images/Dolphin Nautilus CC Plus (standard).webp';
import productImage038 from '../assets/Product Images/Dolphin Nautilus CC Robotic Pool Cleaner.webp';
import productImage039 from '../assets/Product Images/EASYTEST 7-Way Pool Test Strips (150).webp';
import productImage040 from '../assets/Product Images/ENHULK PC15 Wide-Head Rechargeable Pool Vacuum.webp';
import productImage041 from '../assets/Product Images/Floating Turtle Easy-Read Pool Thermometer.webp';
import productImage042 from '../assets/Product Images/GLB Super Blue Clarifier (64 oz).webp';
import productImage043 from '../assets/Product Images/Hofun 5-in-1 Salt, pH, TDS, EC and Temperature Meter.webp';
import productImage044 from '../assets/Product Images/HTH 1-inch Chlorine Tabs with Clarifier (1.5 lb).webp';
import productImage045 from '../assets/Product Images/HTH 3-inch Chlorine Tabs Advanced (5 lb).webp';
import productImage046 from '../assets/Product Images/HTH 42047 Pool Care 1-inch Chlorine Tabs (5 lb).webp';
import productImage047 from '../assets/Product Images/HTH 52025 Cal-Hypo Pool Shock (12 x 13.3 oz).webp';
import productImage048 from '../assets/Product Images/HTH 52040B Pool Shock Ultra Cal-Hypo (6 pack).webp';
import productImage049 from '../assets/Product Images/HTH Alkalinity Up, 5 lb.webp';
import productImage050 from '../assets/Product Images/HTH Calcium Hardness Up, 4 lb.webp';
import productImage051 from '../assets/Product Images/HTH Clarifier Advanced.webp';
import productImage052 from '../assets/Product Images/HTH Metal, Stain _ Scale Control, 32 oz.webp';
import productImage053 from '../assets/Product Images/HTH Pool Algaecide Super Algae Guard 60.webp';
import productImage054 from '../assets/Product Images/HTH Pool Care pH Down, 5 lb.webp';
import productImage055 from '../assets/Product Images/HTH Shock Advanced Cal-Hypo (12 x 1 lb).webp';
import productImage056 from '../assets/Product Images/HTH Shock Advanced Cal-Hypo (6 pack).webp';
import productImage057 from '../assets/Product Images/HTH Swimming Pool Care Algae Guard Ultra.webp';
import productImage058 from '../assets/Product Images/In The Swim 1-Inch Bromine Plus Tablets, 3.5 lb.webp';
import productImage059 from '../assets/Product Images/In The Swim 3-inch Chlorine Tablets 25 lb _ Cal-Hypo Shock (12 x 1 lb).webp';
import productImage060 from '../assets/Product Images/In The Swim 3-inch Chlorine Tablets 50 lb _ 35,000-Gallon Opening Kit.webp';
import productImage061 from '../assets/Product Images/In The Swim 3-inch Chlorine Tablets 50 lb _ Cal-Hypo Shock (24 x 1 lb).webp';
import productImage062 from '../assets/Product Images/In The Swim 3-inch Stabilized Chlorine Tabs (10 lb).webp';
import productImage063 from '../assets/Product Images/In The Swim 3-inch Stabilized Chlorine Tabs (25 lb).webp';
import productImage064 from '../assets/Product Images/In The Swim 3-inch Stabilized Chlorine Tabs (5 lb).webp';
import productImage065 from '../assets/Product Images/In The Swim 3-inch Stabilized Chlorine Tabs (50 lb).webp';
import productImage066 from '../assets/Product Images/In The Swim Alkalinity Increaser, 25 lb.webp';
import productImage067 from '../assets/Product Images/In The Swim Cal-Hypo Pool Shock 68_ (12 x 1 lb).webp';
import productImage068 from '../assets/Product Images/In The Swim Calcium Hardness Increaser, 45 lb.webp';
import productImage069 from '../assets/Product Images/In The Swim pH Reducer, 30 lb.webp';
import productImage070 from '../assets/Product Images/INTEX 10 ft Round Easy Set Pool Cover.webp';
import productImage071 from '../assets/Product Images/INTEX 2,100 GPH Krystal Clear Sand Filter Pump.webp';
import productImage072 from '../assets/Product Images/INTEX 2,800 GPH Krystal Clear Sand Filter Pump.webp';
import productImage073 from '../assets/Product Images/INTEX 28021E 10 ft Easy Set Pool Cover.webp';
import productImage074 from '../assets/Product Images/INTEX 3,000 GPH Krystal Clear Sand Filter Pump.webp';
import productImage075 from '../assets/Product Images/INTEX C1000 Cartridge Filter Pump (1000 GPH).webp';
import productImage076 from '../assets/Product Images/JNW 7-in-1 Pool Test Strips (100).webp';
import productImage077 from '../assets/Product Images/JNW 7-in-1 Pool Test Strips (150).webp';
import productImage078 from '../assets/Product Images/KOKIDO Rechargeable Handheld Pool Vacuum _ Pole.webp';
import productImage079 from '../assets/Product Images/Leisure Time Spa Bromine Tablets, 2.2 lb.webp';
import productImage080 from '../assets/Product Images/Lime Pool 7-Way PoolSpa Test Strips (100).webp';
import productImage081 from "../assets/Product Images/Morton Professional's Choice Pool Salt, 40 lb.webp";
import productImage082 from '../assets/Product Images/Natural Chemistry PHOSfree, 3 L.webp';
import productImage083 from '../assets/Product Images/Pool Filter  Skimmer Socks (50 pack).webp';
import productImage084 from '../assets/Product Images/Poolmaster 5-inch Stainless Steel Algae Detail Brush.webp';
import productImage085 from '../assets/Product Images/PoolMr Rechargeable Handheld Pool Vacuum.webp';
import productImage086 from '../assets/Product Images/PoolSpa Chlorine and pH 2-Way Test Kit.webp';
import productImage087 from '../assets/Product Images/Poolvio Brush _ Pole _ Skimmer Kit.webp';
import productImage088 from '../assets/Product Images/POOLWHALE Leaf Skimmer Net with Adjustable Pole.webp';
import productImage089 from '../assets/Product Images/POOLWHALE Professional Deep Leaf Skimmer Net.webp';
import productImage090 from '../assets/Product Images/Sepetrel 17.5-inch Reinforced Pool Brush.webp';
import productImage091 from '../assets/Product Images/Sepetrel Deluxe Above-Ground Cleaning Kit.webp';
import productImage092 from '../assets/Product Images/Sepetrel Heavy-Duty Flat Leaf Skimmer Net.webp';
import productImage093 from '../assets/Product Images/Sepetrel Round Pool Brush with Aluminum Back.webp';
import productImage094 from '../assets/Product Images/Sun2Solar Blue 24 ft Round Solar Cover (12 mil).webp';
import productImage095 from '../assets/Product Images/Sunnyglade Heavy-Duty Fine Mesh Leaf Rake.webp';
import productImage096 from '../assets/Product Images/Superior Pump 91250 14 HP Submersible Utility Pump.webp';
import productImage097 from '../assets/Product Images/TABIT 3-inch Chlorinating Tabs (25 lb).webp';
import productImage098 from '../assets/Product Images/Taylor K-1004 DPD PoolSpa Test Kit (includes bromine).webp';
import productImage099 from '../assets/Product Images/Taylor K-1766 Saltwater Chloride Drop Test.webp';
import productImage100 from '../assets/Product Images/Taylor K-2006 FAS-DPD Complete Pool Test Kit.webp';
import productImage101 from '../assets/Product Images/TempPro Wireless Digital Floating Pool Thermometer.webp';
import productImage102 from '../assets/Product Images/U.S. Pool Supply 5 ft Leaf Skimmer Net with Pole.webp';
import productImage103 from '../assets/Product Images/Xtremeclear 3-inch Tri-Chlor Tabs (5 lb).webp';
import productImage104 from '../assets/Product Images/XY-WQ Floating Turtle Pool Thermometer.webp';

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
    weeklyReminderIcon,
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

export const chemistryIcons = {
    freeChlorine: chemistryFreeChlorine,
    totalChlorine: chemistryTotalChlorine,
    combinedChlorine: chemistryCombinedChlorine,
    bromine: chemistryBromine,
    ph: chemistryPh,
    totalAlkalinity: chemistryTotalAlkalinity,
    calciumHardness: chemistryCalciumHardness,
    cyanuricAcid: chemistryCyanuricAcid,
    salt: chemistrySalt,
    totalHardness: chemistryTotalHardness,
    phosphates: chemistryPhosphates,
    tds: chemistryTds,
    iron: chemistryIron,
    copper: chemistryCopper,
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
    info: poolTonicCheckInfo,
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
    infoIcon: poolTonicCheckInfo,
    stripPhoto: testReadingsStripPhoto,
    backyardPhoto: testReadingsBackyardPhoto,
} as const;

/**
 * Choose Test Method screen images.
 */
export const chooseTestMethodImages = {
    strip: poolTonicCheckStrip,
    flask: chooseTestMethodFlask,
    results: poolTonicCheckResults,
    magnifyingGlass: poolTonicCheckVisibleProblem,
    settings: chooseTestMethodSettings,
    info: poolTonicCheckInfo,
    hero: dashboardPoolIllustration,
} as const;

/**
 * Bottle photos for catalog strips.
 * Keys are `${product_brand}|${product_model}` after whitespace is collapsed,
 * matching `toBrands` in data/testStripBrands.ts. Unknown / custom strips
 * fall back to `icons.testStrip`.
 */
export const testStripProductImages = {
    'AquaChek|7-in-1': aquachek7in1,
    'HTH|6-Way Test Strips': hth6Way,
    'Clorox|A-E five-level reference chart': cloroxPoolSpa,
    'JNW|Version 1.0 (11-2025) 7 in 1': jnwPoolAndSpa,
    'JNW|Version 1.0 (11-2025) Hot Tub & Spa': jnwHotTubSpa,
    'EasyTest|9 in 1': easyTest9in1,
    'kimbist|Attached reference chart': kimbistStrips,
    'Bliss Pool|150-strip reference chart; promotional badge omitted': blissPoolStrips,
    'Runbo|Attached reference chart': runboStrips,
} as const;

export const poolSizeGraphics = {
    reminderShield,
    infoIcon: poolTonicCheckInfo,
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
    background: onboardingCompleteBackground,
    knowWhatToDo: onboardingKnowWhatToDo,
    catchProblems: onboardingCatchProblems,
    keepWaterSafe: onboardingKeepWaterSafe,
    rightProducts: onboardingRightProducts,
    weeklyCare: onboardingWeeklyCare,
    info: poolTonicCheckInfo,
    // waterDrop: poolProfileWaterDrop,
    // testTube: poolProfileTestTube,
    // photo: poolProfilePhoto,
    // calculator: poolProfileCalculator,
    // star: poolProfileStar,
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
 */
export const navImages = {
    home: { active: poolTonicNavHomeSelected, inactive: poolTonicNavHome },
    pool: { active: poolTonicNavPoolSelected, inactive: poolTonicNavPool },
    shop: { active: poolTonicNavShopSelected, inactive: poolTonicNavShop },
    checklist: { active: poolTonicNavChecklistSelected, inactive: poolTonicNavChecklist },
    readings: { active: poolTonicNavReadingsSelected, inactive: poolTonicNavReadings },
    learn: { active: navLearnActive, inactive: navLearnInactive },
} as const;

/**
 * Pool tab review-screen images.
 */
export const poolTabImages = {
    basicsHero: poolBasicsHero,
} as const;

/**
 * Shop tab product and category images.
 * Reuses existing pool-product artwork so the shop UI looks real before
 * dedicated product photography exists.
 */
export const shopImages = {
    // Test kits
    aquachek: aquachek7in1,
    hth: hth6Way,
    jnw: jnwPoolAndSpa,
    easyTest: easyTest9in1,
    // Balancers
    ph: chemistryPh,
    alkalinity: chemistryTotalAlkalinity,
    hardness: chemistryCalciumHardness,
    phosphates: chemistryPhosphates,
    // Sanitizers
    chlorine: chemistryFreeChlorine,
    salt: chemistrySalt,
    stabilizer: chemistryCyanuricAcid,
    bromine: chemistryBromine,
    // Cleaners
    robotic: cleaningRobotic,
    pressureSide: cleaningPressureSide,
    suctionSide: cleaningSuctionSide,
    manualVacuum: cleaningManualVacuum,
    // Pumps
    variablePump: equipmentChoiceVariable,
    dualPump: equipmentChoiceDual,
    singlePump: equipmentChoiceSingle,
    // Filters
    cartridgeFilter: equipmentChoiceCartridge,
    sandFilter: equipmentChoiceSand,
    deFilter: equipmentChoiceDe,
    // Category tiles that had no better match
    totalChlorine: chemistryTotalChlorine,
    tools: cleaningNoVacuum,
    cover: poolEnvCovered,
    outdoor: poolEnvOutdoor,
    // Shared placeholder shown on every product until real photos exist
    placeholder: poolConditionCrystalClear,
} as const;

/** Convenience alias — use `graphics` or `icons` directly for clarity */
export const images = {
    ...graphics,
} as const;

/**
 * Shop product photos, keyed by product name with "/" removed (same as the file name).
 * Products without a photo are not listed here and use shopImages.placeholder.
 */
export const productImages: Record<string, ImageSourcePropType> = {
    "162-Piece 7-Way PoolSpa Test Strips": productImage001,
    "17-inch Nylon Pool Wall Brush": productImage002,
    "18-inch Curved-End Pool Brush (greenblack)": productImage003,
    "AIPER EcoSurfer S2 Solar Surface Skimmer": productImage004,
    "Aqua Joe Pool & Spa Salt, 40 lb": productImage005,
    "AquaChek Salt White Test Strip Titrators, 10 ct": productImage006,
    "AquaChek Silver 7-Way Test Strips (100)": productImage007,
    "AquaChek Yellow 4-Way Test Strips (50)": productImage008,
    "AquaDoc Phosphate Remover, 32 oz": productImage009,
    "AQUASALT Pool & Spa Salt, 40 lb": productImage010,
    "ARM & Hammer Clear Balance pH Maintenance Tabs (24)": productImage011,
    "Betta SE Plus Dual-Charging Solar Surface Skimmer": productImage012,
    "Betta SE Solar Robotic Surface Skimmer": productImage013,
    "BioGuard Chem Out ChlorineBromine Neutralizer, 2 lb": productImage014,
    "Clorox Pool&Spa Algaecide and Clarifier (128 oz)": productImage015,
    "Clorox Pool&Spa Alkalinity Increaser, 5 lb": productImage016,
    "Clorox Pool&Spa Calcium Hardness Increaser, 4 lb": productImage017,
    "Clorox Pool&Spa Chlorine Stabilizer (4 lb)": productImage018,
    "Clorox Pool&Spa ClearPHOS, 1 quart": productImage019,
    "Clorox Pool&Spa Crazy Clarifier (128 oz)": productImage020,
    "Clorox Pool&Spa My Pool Care Assistant Test Strips (50)": productImage021,
    "Clorox Pool&Spa pH Down, 5 lb": productImage022,
    "Clorox Pool&Spa pH Up (4 lb)": productImage023,
    "Clorox Pool&Spa Scale, Metal & Stain Control, 32 oz": productImage024,
    "Clorox Pool&Spa Shock Clear (6 pack)": productImage025,
    "Clorox Pool&Spa Shock XTRABLUE Plus (12 pack)": productImage026,
    "Clorox Pool&Spa Shock XTRABLUE Plus (6 pack)": productImage027,
    "Clorox Pool&Spa Sink to Clear Flocculant (1 qt)": productImage028,
    "Clorox Pool&Spa Spa Bromine Tablets, 1.5 lb": productImage029,
    "Clorox Pool&Spa Super Water Clarifier (1 qt)": productImage030,
    "Clorox Pool&Spa Swimming Pool Algaecide and Clarifier": productImage031,
    "Clorox Pool&Spa XTRABLUE 3-inch Chlorinating Tablets (25 lb)": productImage032,
    "Clorox Pool&Spa XTRABLUE 3-inch Chlorinating Tablets (35 lb)": productImage033,
    "Clorox Pool&Spa XTRABLUE 3-inch Chlorinating Tabs (5 lb)": productImage034,
    "Coopache Skimmer Socks (30 pack)": productImage035,
    "CuLator Metal Eliminator PowerPak 1.0": productImage036,
    "Dolphin Nautilus CC Plus (standard)": productImage037,
    "Dolphin Nautilus CC Robotic Pool Cleaner": productImage038,
    "EASYTEST 7-Way Pool Test Strips (150)": productImage039,
    "ENHULK PC15 Wide-Head Rechargeable Pool Vacuum": productImage040,
    "Floating Turtle Easy-Read Pool Thermometer": productImage041,
    "GLB Super Blue Clarifier (64 oz)": productImage042,
    "Hofun 5-in-1 Salt, pH, TDS, EC and Temperature Meter": productImage043,
    "HTH 1-inch Chlorine Tabs with Clarifier (1.5 lb)": productImage044,
    "HTH 3-inch Chlorine Tabs Advanced (5 lb)": productImage045,
    "HTH 42047 Pool Care 1-inch Chlorine Tabs (5 lb)": productImage046,
    "HTH 52025 Cal-Hypo Pool Shock (12 x 13.3 oz)": productImage047,
    "HTH 52040B Pool Shock Ultra Cal-Hypo (6 pack)": productImage048,
    "HTH Alkalinity Up, 5 lb": productImage049,
    "HTH Calcium Hardness Up, 4 lb": productImage050,
    "HTH Clarifier Advanced": productImage051,
    "HTH Metal, Stain & Scale Control, 32 oz": productImage052,
    "HTH Pool Algaecide Super Algae Guard 60": productImage053,
    "HTH Pool Care pH Down, 5 lb": productImage054,
    "HTH Shock Advanced Cal-Hypo (12 x 1 lb)": productImage055,
    "HTH Shock Advanced Cal-Hypo (6 pack)": productImage056,
    "HTH Swimming Pool Care Algae Guard Ultra": productImage057,
    "In The Swim 1-Inch Bromine Plus Tablets, 3.5 lb": productImage058,
    "In The Swim 3-inch Chlorine Tablets 25 lb + Cal-Hypo Shock (12 x 1 lb)": productImage059,
    "In The Swim 3-inch Chlorine Tablets 50 lb + 35,000-Gallon Opening Kit": productImage060,
    "In The Swim 3-inch Chlorine Tablets 50 lb + Cal-Hypo Shock (24 x 1 lb)": productImage061,
    "In The Swim 3-inch Stabilized Chlorine Tabs (10 lb)": productImage062,
    "In The Swim 3-inch Stabilized Chlorine Tabs (25 lb)": productImage063,
    "In The Swim 3-inch Stabilized Chlorine Tabs (5 lb)": productImage064,
    "In The Swim 3-inch Stabilized Chlorine Tabs (50 lb)": productImage065,
    "In The Swim Alkalinity Increaser, 25 lb": productImage066,
    "In The Swim Cal-Hypo Pool Shock 68% (12 x 1 lb)": productImage067,
    "In The Swim Calcium Hardness Increaser, 45 lb": productImage068,
    "In The Swim pH Reducer, 30 lb": productImage069,
    "INTEX 10 ft Round Easy Set Pool Cover": productImage070,
    "INTEX 2,100 GPH Krystal Clear Sand Filter Pump": productImage071,
    "INTEX 2,800 GPH Krystal Clear Sand Filter Pump": productImage072,
    "INTEX 28021E 10 ft Easy Set Pool Cover": productImage073,
    "INTEX 3,000 GPH Krystal Clear Sand Filter Pump": productImage074,
    "INTEX C1000 Cartridge Filter Pump (1000 GPH)": productImage075,
    "JNW 7-in-1 Pool Test Strips (100)": productImage076,
    "JNW 7-in-1 Pool Test Strips (150)": productImage077,
    "KOKIDO Rechargeable Handheld Pool Vacuum + Pole": productImage078,
    "Leisure Time Spa Bromine Tablets, 2.2 lb": productImage079,
    "Lime Pool 7-Way PoolSpa Test Strips (100)": productImage080,
    "Morton Professional's Choice Pool Salt, 40 lb": productImage081,
    "Natural Chemistry PHOSfree, 3 L": productImage082,
    "Pool Filter  Skimmer Socks (50 pack)": productImage083,
    "Poolmaster 5-inch Stainless Steel Algae Detail Brush": productImage084,
    "PoolMr Rechargeable Handheld Pool Vacuum": productImage085,
    "PoolSpa Chlorine and pH 2-Way Test Kit": productImage086,
    "Poolvio Brush + Pole + Skimmer Kit": productImage087,
    "POOLWHALE Leaf Skimmer Net with Adjustable Pole": productImage088,
    "POOLWHALE Professional Deep Leaf Skimmer Net": productImage089,
    "Sepetrel 17.5-inch Reinforced Pool Brush": productImage090,
    "Sepetrel Deluxe Above-Ground Cleaning Kit": productImage091,
    "Sepetrel Heavy-Duty Flat Leaf Skimmer Net": productImage092,
    "Sepetrel Round Pool Brush with Aluminum Back": productImage093,
    "Sun2Solar Blue 24 ft Round Solar Cover (12 mil)": productImage094,
    "Sunnyglade Heavy-Duty Fine Mesh Leaf Rake": productImage095,
    "Superior Pump 91250 14 HP Submersible Utility Pump": productImage096,
    "TABIT 3-inch Chlorinating Tabs (25 lb)": productImage097,
    "Taylor K-1004 DPD PoolSpa Test Kit (includes bromine)": productImage098,
    "Taylor K-1766 Saltwater Chloride Drop Test": productImage099,
    "Taylor K-2006 FAS-DPD Complete Pool Test Kit": productImage100,
    "TempPro Wireless Digital Floating Pool Thermometer": productImage101,
    "U.S. Pool Supply 5 ft Leaf Skimmer Net with Pole": productImage102,
    "Xtremeclear 3-inch Tri-Chlor Tabs (5 lb)": productImage103,
    "XY-WQ Floating Turtle Pool Thermometer": productImage104,
};
