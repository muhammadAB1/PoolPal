import { poolConditionImages } from '@/constants/images';
import type { NextAction, QuestionPage, Warning } from './_types';

export const QUESTION_PAGES: Record<string, QuestionPage> = {
    appearance: {
        id: 'appearance',
        titleKey: 'pool_condition_title',
        subtitleKey: 'pool_condition_subtitle',
        multiple: false,
        options: [
            {
                id: 'CRYSTAL_CLEAR',
                labelKey: 'pool_condition_crystal_clear',
                descriptionKey: 'pool_condition_crystal_clear_desc',
                image: poolConditionImages.CRYSTAL_CLEAR,
            },
            {
                id: 'A_LITTLE_CLOUDY',
                labelKey: 'pool_condition_a_little_cloudy',
                descriptionKey: 'pool_condition_a_little_cloudy_desc',
                image: poolConditionImages.A_LITTLE_CLOUDY,
            },
            {
                id: 'GREEN',
                labelKey: 'pool_condition_green',
                descriptionKey: 'pool_condition_green_desc',
                image: poolConditionImages.GREEN,
            },
            {
                id: 'VERY_GREEN_OR_DARK',
                labelKey: 'pool_condition_very_green_or_dark',
                descriptionKey: 'pool_condition_very_green_or_dark_desc',
                image: poolConditionImages.VERY_GREEN_OR_DARK,
            },
        ],
    },
    visible_signs: {
        id: 'visible_signs',
        titleKey: 'problems_more_signs_title',
        subtitleKey: 'problems_more_signs_subtitle',
        multiple: true,
        options: [
            { id: 'ALGAE', labelKey: 'problems_algae_label', descriptionKey: 'problems_algae_desc' },
            { id: 'STAINS', labelKey: 'problems_stains_label', descriptionKey: 'problems_stains_desc' },
            { id: 'FOAM', labelKey: 'problems_foam_label', descriptionKey: 'problems_foam_desc' },
            { id: 'CHLORINE_SMELL', labelKey: 'problems_chlorine_smell_label', descriptionKey: 'problems_chlorine_smell_desc' },
            { id: 'SCALE', labelKey: 'problems_scale_label', descriptionKey: 'problems_scale_desc' },
            { id: 'LOW_FLOW', labelKey: 'problems_low_flow_label', descriptionKey: 'problems_low_flow_desc' },
            { id: 'WATER_LEVEL_DROPPING', labelKey: 'problems_water_level_label', descriptionKey: 'problems_water_level_desc' },
            { id: 'DIRTY_RETURNS', labelKey: 'problems_dirty_returns_label', descriptionKey: 'problems_dirty_returns_desc' },
            { id: 'OTHER', labelKey: 'problems_other_label', descriptionKey: 'problems_other_desc' },
            { id: 'NONE', labelKey: 'problems_none_label' },
        ],
    },
    very_green_followup: {
        id: 'very_green_followup',
        titleKey: 'problems_see_bottom_title',
        subtitleKey: 'problems_see_bottom_subtitle',
        multiple: false,
        options: [
            { id: 'YES_CLEARLY', labelKey: 'problems_see_bottom_yes' },
            { id: 'NOT_CLEARLY', labelKey: 'problems_see_bottom_not_clearly' },
            { id: 'NO', labelKey: 'problems_see_bottom_no' },
            { id: 'NOT_SURE', labelKey: 'problems_see_bottom_not_sure' },
        ],
    },
    looks_normal: {
        id: 'looks_normal',
        titleKey: 'problems_another_issue_title',
        multiple: false,
        options: [
            { id: 'NORMAL', labelKey: 'problems_another_normal' },
            { id: 'STAINS', labelKey: 'problems_another_stains' },
            { id: 'SCALE', labelKey: 'problems_another_scale' },
            { id: 'SPOTS', labelKey: 'problems_another_spots' },
            { id: 'FOAM', labelKey: 'problems_another_foam' },
            { id: 'BUBBLES', labelKey: 'problems_another_bubbles' },
            { id: 'WEAK_FLOW', labelKey: 'problems_another_weak_flow' },
            { id: 'WATER_DROPPING', labelKey: 'problems_another_water_dropping' },
            { id: 'CHLORINE_SMELL', labelKey: 'problems_another_chlorine_smell' },
            { id: 'NOT_SURE', labelKey: 'problems_another_not_sure' },
        ],
    },
    urgent_safety: {
        id: 'urgent_safety',
        titleKey: 'problems_urgent_safety_title',
        subtitleKey: 'problems_urgent_safety_subtitle',
        multiple: true,
        options: [
            { id: 'CHEMICAL_FUMES', labelKey: 'problems_safety_chemical_fumes' },
            { id: 'GAS_SMELL', labelKey: 'problems_safety_gas_smell' },
            { id: 'BURNING_SMELL', labelKey: 'problems_safety_burning_smell' },
            { id: 'CRACKED_FILTER', labelKey: 'problems_safety_cracked_filter' },
            { id: 'BROKEN_DRAIN', labelKey: 'problems_safety_broken_drain' },
            { id: 'MIXED_CHEMICALS', labelKey: 'problems_safety_mixed_chemicals' },
            { id: 'DEAD_ANIMAL', labelKey: 'problems_safety_dead_animal' },
            { id: 'NONE', labelKey: 'problems_safety_none' },
            { id: 'NOT_SURE', labelKey: 'problems_safety_not_sure' },
        ],
    },
    growth_color: {
        id: 'growth_color',
        titleKey: 'problems_growth_color_title',
        multiple: false,
        options: [
            { id: 'GREEN', labelKey: 'problems_growth_green' },
            { id: 'YELLOW', labelKey: 'problems_growth_yellow' },
            { id: 'BLACK', labelKey: 'problems_growth_black' },
            { id: 'PINK', labelKey: 'problems_growth_pink' },
            { id: 'WHITE', labelKey: 'problems_growth_white' },
            { id: 'BROWN', labelKey: 'problems_growth_brown' },
            { id: 'NOT_SURE', labelKey: 'problems_growth_not_sure' },
        ],
    },
    growth_where: {
        id: 'growth_where',
        titleKey: 'problems_growth_where_title',
        subtitleKey: 'problems_more_signs_subtitle',
        multiple: true,
        options: [
            { id: 'WALLS', labelKey: 'problems_growth_where_walls' },
            { id: 'FLOOR', labelKey: 'problems_growth_where_floor' },
            { id: 'STEPS', labelKey: 'problems_growth_where_steps' },
            { id: 'CORNERS', labelKey: 'problems_growth_where_corners' },
            { id: 'LADDERS', labelKey: 'problems_growth_where_ladders' },
            { id: 'LIGHTS', labelKey: 'problems_growth_where_lights' },
            { id: 'SKIMMER', labelKey: 'problems_growth_where_skimmer' },
            { id: 'TOYS', labelKey: 'problems_growth_where_toys' },
            { id: 'THROUGHOUT', labelKey: 'problems_growth_where_throughout' },
        ],
    },
    when_brushed: {
        id: 'when_brushed',
        titleKey: 'problems_growth_brush_title',
        subtitleKey: 'problems_growth_brush_subtitle',
        multiple: false,
        options: [
            { id: 'BRUSHES_AWAY', labelKey: 'problems_growth_brush_away' },
            { id: 'CLOUD', labelKey: 'problems_growth_brush_cloud' },
            { id: 'RETURNS', labelKey: 'problems_growth_brush_returns' },
            { id: 'FADES', labelKey: 'problems_growth_brush_fades' },
            { id: 'DOES_NOT_MOVE', labelKey: 'problems_growth_brush_no_move' },
            { id: 'HARD', labelKey: 'problems_growth_brush_hard' },
            { id: 'NOT_TRIED', labelKey: 'problems_growth_brush_not_tried' },
            { id: 'NOT_SURE', labelKey: 'problems_growth_brush_not_sure' },
        ],
    },
    feels_slippery: {
        id: 'feels_slippery',
        titleKey: 'problems_growth_slippery_title',
        multiple: false,
        options: [
            { id: 'YES', labelKey: 'problems_growth_slippery_yes' },
            { id: 'NO', labelKey: 'problems_growth_slippery_no' },
            { id: 'FEW_AREAS', labelKey: 'problems_growth_slippery_few' },
            { id: 'NOT_SURE', labelKey: 'problems_growth_slippery_not_sure' },
        ],
    },
    also_cloudy: {
        id: 'also_cloudy',
        titleKey: 'problems_growth_water_title',
        multiple: false,
        options: [
            { id: 'CLEAR', labelKey: 'problems_growth_water_clear' },
            { id: 'A_LITTLE_CLOUDY', labelKey: 'problems_growth_water_cloudy' },
            { id: 'GREEN_VISIBLE', labelKey: 'problems_growth_water_green' },
            { id: 'VERY_GREEN_OR_DARK', labelKey: 'problems_growth_water_very_green' },
            { id: 'NOT_SURE', labelKey: 'problems_growth_water_not_sure' },
        ],
    },
    when_patches: {
        id: 'when_patches',
        titleKey: 'problems_when_patches_title',
        multiple: false,
        options: [
            { id: 'TODAY', labelKey: 'problems_when_patches_today' },
            { id: 'FEW_DAYS', labelKey: 'problems_when_patches_few_days' },
            { id: 'WEEK_PLUS', labelKey: 'problems_when_patches_week' },
            { id: 'AFTER_RAIN', labelKey: 'problems_when_patches_rain' },
            { id: 'AFTER_PUMP', labelKey: 'problems_when_patches_pump' },
            { id: 'AFTER_AWAY', labelKey: 'problems_when_patches_away' },
            { id: 'KEEP_RETURNING', labelKey: 'problems_when_patches_returning' },
            { id: 'NOT_SURE', labelKey: 'problems_when_patches_not_sure' },
        ],
    },
    already_treated: {
        id: 'already_treated',
        titleKey: 'problems_already_treated_title',
        subtitleKey: 'problems_more_signs_subtitle',
        multiple: true,
        options: [
            { id: 'NO_TREATMENT', labelKey: 'problems_already_treated_none' },
            { id: 'CHLORINE', labelKey: 'problems_already_treated_chlorine' },
            { id: 'SHOCK', labelKey: 'problems_already_treated_shock' },
            { id: 'ALGAECIDE', labelKey: 'problems_already_treated_algaecide' },
            { id: 'BRUSHED', labelKey: 'problems_already_treated_brushed' },
            { id: 'FILTER', labelKey: 'problems_already_treated_filter' },
            { id: 'STAIN_PRODUCT', labelKey: 'problems_already_treated_stain' },
            { id: 'SOMETHING_ELSE', labelKey: 'problems_already_treated_other' },
        ],
    },
    after_treatment: {
        id: 'after_treatment',
        titleKey: 'problems_after_treatment_title',
        multiple: false,
        options: [
            { id: 'IMPROVED', labelKey: 'problems_after_treatment_improved' },
            { id: 'RETURNED', labelKey: 'problems_after_treatment_returned' },
            { id: 'NO_CHANGE', labelKey: 'problems_after_treatment_no_change' },
            { id: 'WORSE', labelKey: 'problems_after_treatment_worse' },
            { id: 'NOT_WAITED', labelKey: 'problems_after_treatment_not_waited' },
        ],
    },
    describe_water: {
        id: 'describe_water',
        titleKey: 'problems_describe_water_title',
        multiple: false,
        options: [
            { id: 'THICK_DARK_GREEN', labelKey: 'problems_describe_water_thick_green' },
            { id: 'BROWN_TEA', labelKey: 'problems_describe_water_brown' },
            { id: 'BLACK_DARK', labelKey: 'problems_describe_water_black' },
            { id: 'BLACK_SPOTS_WALLS', labelKey: 'problems_describe_water_black_spots' },
            { id: 'LEAVES_DEBRIS', labelKey: 'problems_describe_water_leaves' },
            { id: 'NOT_SURE', labelKey: 'problems_describe_water_not_sure' },
        ],
    },
    how_long: {
        id: 'how_long',
        titleKey: 'problems_how_long_title',
        multiple: false,
        options: [
            { id: 'LESS_THAN_ONE_DAY', labelKey: 'problems_how_long_one_day' },
            { id: 'A_FEW_DAYS', labelKey: 'problems_how_long_few_days' },
            { id: 'MORE_THAN_ONE_WEEK', labelKey: 'problems_how_long_week' },
            { id: 'NOT_SURE', labelKey: 'problems_how_long_not_sure' },
        ],
    },
    pump_moving: {
        id: 'pump_moving',
        titleKey: 'problems_pump_moving_title',
        multiple: false,
        options: [
            { id: 'FLOW_NORMAL', labelKey: 'problems_pump_moving_normal' },
            { id: 'FLOW_WEAK', labelKey: 'problems_pump_moving_weak' },
            { id: 'NOT_RUNNING', labelKey: 'problems_pump_moving_not_running' },
            { id: 'WILL_NOT_PRIME', labelKey: 'problems_pump_moving_no_prime' },
            { id: 'HUMS', labelKey: 'problems_pump_moving_hums' },
            { id: 'NOT_SURE', labelKey: 'problems_pump_moving_not_sure' },
        ],
    },
    chlorine_result: {
        id: 'chlorine_result',
        titleKey: 'problems_chlorine_result_title',
        multiple: false,
        options: [
            { id: 'ZERO', labelKey: 'problems_chlorine_result_zero' },
            { id: 'LOW', labelKey: 'problems_chlorine_result_low' },
            { id: 'NORMAL', labelKey: 'problems_chlorine_result_normal' },
            { id: 'HIGH', labelKey: 'problems_chlorine_result_high' },
            { id: 'NOT_TESTED', labelKey: 'problems_chlorine_result_not_tested' },
            { id: 'NOT_SURE', labelKey: 'problems_chlorine_result_not_sure' },
        ],
    },
    water_added: {
        id: 'water_added',
        titleKey: 'problems_water_added_title',
        multiple: false,
        options: [
            { id: 'CITY', labelKey: 'problems_water_added_city' },
            { id: 'WELL', labelKey: 'problems_water_added_well' },
            { id: 'TRUCKED', labelKey: 'problems_water_added_trucked' },
            { id: 'RAIN_ONLY', labelKey: 'problems_water_added_rain' },
            { id: 'NO_NEW_WATER', labelKey: 'problems_water_added_none' },
            { id: 'NOT_SURE', labelKey: 'problems_water_added_not_sure' },
        ],
    },
    contamination_event: {
        id: 'contamination_event',
        titleKey: 'problems_contamination_title',
        multiple: false,
        options: [
            { id: 'DEAD_ANIMAL', labelKey: 'problems_contamination_dead_animal' },
            { id: 'FECAL', labelKey: 'problems_contamination_fecal' },
            { id: 'VOMIT', labelKey: 'problems_contamination_vomit' },
            { id: 'FLOODWATER', labelKey: 'problems_contamination_floodwater' },
            { id: 'CHEMICAL_SPILL', labelKey: 'problems_contamination_spill' },
            { id: 'NONE', labelKey: 'problems_contamination_none' },
            { id: 'NOT_SURE', labelKey: 'problems_contamination_not_sure' },
        ],
    },
    pump_skimmer_blocked: {
        id: 'pump_skimmer_blocked',
        titleKey: 'problems_pump_skimmer_blocked_title',
        multiple: false,
        options: [
            { id: 'YES', labelKey: 'problems_growth_slippery_yes' },
            { id: 'NO', labelKey: 'problems_growth_slippery_no' },
            { id: 'NOT_SURE', labelKey: 'problems_growth_slippery_not_sure' },
        ],
    },
    water_level_normal: {
        id: 'water_level_normal',
        titleKey: 'problems_water_level_normal_title',
        multiple: false,
        options: [
            { id: 'NORMAL', labelKey: 'problems_water_level_normal_ok' },
            { id: 'TOO_LOW', labelKey: 'problems_water_level_normal_low' },
            { id: 'TOO_HIGH', labelKey: 'problems_water_level_normal_high' },
            { id: 'NOT_SURE', labelKey: 'problems_growth_slippery_not_sure' },
        ],
    },
};

export function getNextAction(pages: string[], selected: string[]): NextAction {
    const page = pages[pages.length - 1];

    if (page === 'appearance') {
        if (selected.includes('VERY_GREEN_OR_DARK')) {
            return { type: 'question', page: 'very_green_followup' };
        }
        return { type: 'question', page: 'visible_signs' };
    }

    if (page === 'very_green_followup') {
        if(pages.includes('visible_signs')) {
            return { type: 'question', page: 'describe_water' };
        }
        return { type: 'question', page: 'urgent_safety' };
    }

    if (page === 'urgent_safety') {
        return { type: 'question', page: 'visible_signs' };
    }

    if (page === 'visible_signs') {
        if (pages.includes('urgent_safety')) {
            return { type: 'question', page: 'very_green_followup' };
        }
        return { type: 'question', page: 'looks_normal' };
    }

    if (page === 'looks_normal') {
        return { type: 'question', page: 'growth_color' };
    }

    if (page === 'growth_color') {
        return { type: 'question', page: 'growth_where' };
    }

    if (page === 'growth_where') {
        return { type: 'question', page: 'when_brushed' };
    }

    if (page === 'when_brushed') {
        return { type: 'question', page: 'feels_slippery' };
    }

    if (page === 'feels_slippery') {
        return { type: 'question', page: 'also_cloudy' };
    }

    if (page === 'also_cloudy') {
        return { type: 'question', page: 'when_patches' };
    }

    if (page === 'when_patches') {
        return { type: 'question', page: 'already_treated' };
    }

    if (page === 'already_treated') {
        return { type: 'question', page: 'after_treatment' };
    }

    if (page === 'describe_water') {
        return { type: 'question', page: 'how_long' };
    }

    if (page === 'how_long') {
        return { type: 'question', page: 'pump_moving' };
    }

    if (page === 'pump_moving') {
        return { type: 'question', page: 'chlorine_result' };
    }

    if (page === 'chlorine_result') {
        return { type: 'question', page: 'water_added' };
    }

    if (page === 'water_added') {
        return { type: 'question', page: 'contamination_event' };
    }

    if (page === 'contamination_event') {
        return { type: 'question', page: 'pump_skimmer_blocked' };
    }

    if (page === 'pump_skimmer_blocked') {
        return { type: 'question', page: 'water_level_normal' };
    }

    if (page === 'water_level_normal') {
        return { type: 'question', page: 'growth_color' };
    }

    return { type: 'treatment' };
}

export function getPageWarning(page: string, selected: string[]): Warning | null {
    if (page === 'very_green_followup' && (selected.includes('NO') || selected.includes('NOT_SURE'))) {
        return {
            titleKey: 'problems_warning_keep_swimmers_out',
            subtitleKey: 'problems_warning_keep_swimmers_out_desc',
        };
    }

    return null;
}
