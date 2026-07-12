import type { TestReadingsMethod } from '@/lib/types';

export const TEST_READINGS_METHODS: readonly TestReadingsMethod[] = [
    'Readings',
    'Photo',
    'None',
] as const;

export const testReadingsMethodTranslationKeys: Record<
    TestReadingsMethod,
    { title: string; description: string }
> = {
    Readings: {
        title: 'test_readings_option_results_title',
        description: 'test_readings_option_results_desc',
    },
    Photo: {
        title: 'test_readings_option_photo_title',
        description: 'test_readings_option_photo_desc',
    },
    None: {
        title: 'test_readings_option_none_title',
        description: 'test_readings_option_none_desc',
    },
};

export type BasicReadingKey = 'freeChlorine' | 'ph' | 'totalAlkalinity' | 'cyanuricAcid' | 'calciumHardness';

export const BASIC_READING_FIELDS: readonly {
    key: BasicReadingKey;
    labelKey: string;
    showUnit: boolean;
    placeholder: string;
}[] = [
    { key: 'freeChlorine', labelKey: 'test_readings_fc_label', showUnit: true, placeholder: '3.0' },
    { key: 'ph', labelKey: 'test_readings_ph_label', showUnit: false, placeholder: '7.6' },
    { key: 'totalAlkalinity', labelKey: 'test_readings_ta_label', showUnit: true, placeholder: '80' },
    { key: 'cyanuricAcid', labelKey: 'test_readings_cya_label', showUnit: true, placeholder: '40' },
    { key: 'calciumHardness', labelKey: 'test_readings_ch_label', showUnit: true, placeholder: '250' },
] as const;

export const TEST_READINGS_PHOTO_TIPS: readonly string[] = [
    'test_readings_photo_tip_1',
    'test_readings_photo_tip_2',
    'test_readings_photo_tip_3',
    'test_readings_photo_tip_4',
] as const;

/**
 * Content for the "What do these readings mean?" info modal.
 * Badge colors are one-off decorative accents specific to this modal,
 * matched to the provided design reference.
 */
export const READINGS_INFO: readonly {
    key: BasicReadingKey;
    abbreviation: string;
    badgeColor: string;
    titleKey: string;
    descriptionKey: string;
}[] = [
    {
        key: 'freeChlorine',
        abbreviation: 'FC',
        badgeColor: '#1FB6A8',
        titleKey: 'test_readings_fc_label',
        descriptionKey: 'test_readings_info_fc_desc',
    },
    {
        key: 'ph',
        abbreviation: 'pH',
        badgeColor: '#8B6FE8',
        titleKey: 'test_readings_ph_label',
        descriptionKey: 'test_readings_info_ph_desc',
    },
    {
        key: 'totalAlkalinity',
        abbreviation: 'TA',
        badgeColor: '#6E9C4D',
        titleKey: 'test_readings_ta_label',
        descriptionKey: 'test_readings_info_ta_desc',
    },
    {
        key: 'cyanuricAcid',
        abbreviation: 'CYA',
        badgeColor: '#F0983D',
        titleKey: 'test_readings_cya_label',
        descriptionKey: 'test_readings_info_cya_desc',
    },
    {
        key: 'calciumHardness',
        abbreviation: 'CH',
        badgeColor: '#2F7DE0',
        titleKey: 'test_readings_ch_label',
        descriptionKey: 'test_readings_info_ch_desc',
    },
] as const;
