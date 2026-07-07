import type { FilterType, HeaterOption, PumpType } from '@/lib/types';

export const FILTER_TYPES: readonly FilterType[] = ['Sand', 'Cartridge', 'DE'] as const;
export const PUMP_TYPES: readonly PumpType[] = ['Single', 'Dual', 'Variable'] as const;
export const HEATER_OPTIONS: readonly HeaterOption[] = ['Yes', 'No', 'NotSure'] as const;

export const filterTypeTranslationKeys: Record<FilterType, string> = {
    Sand: 'equipment_filter_sand',
    Cartridge: 'equipment_filter_cartridge',
    DE: 'equipment_filter_de',
};

export const pumpTypeTranslationKeys: Record<PumpType, string> = {
    Single: 'equipment_pump_single',
    Dual: 'equipment_pump_dual',
    Variable: 'equipment_pump_variable',
};

export const heaterOptionTranslationKeys: Record<HeaterOption, string> = {
    Yes: 'equipment_basics_heater_yes',
    No: 'equipment_basics_heater_no',
    NotSure: 'equipment_basics_heater_not_sure',
};

export const filterExampleTranslationKeys: Record<
    FilterType,
    { title: string; description: string; identifyLabel: string; identify: string }
> = {
    Sand: {
        title: 'equipment_filter_sand',
        description: 'equipment_filter_sand_desc',
        identifyLabel: 'equipment_how_to_identify',
        identify: 'equipment_filter_sand_identify',
    },
    Cartridge: {
        title: 'equipment_filter_cartridge',
        description: 'equipment_filter_cartridge_desc',
        identifyLabel: 'equipment_how_to_identify',
        identify: 'equipment_filter_cartridge_identify',
    },
    DE: {
        title: 'equipment_filter_de_full',
        description: 'equipment_filter_de_desc',
        identifyLabel: 'equipment_how_to_identify',
        identify: 'equipment_filter_de_identify',
    },
};

export const pumpExampleTranslationKeys: Record<
    PumpType,
    { title: string; description: string; identifyLabel: string; identify: string }
> = {
    Single: {
        title: 'equipment_pump_single_full',
        description: 'equipment_pump_single_desc',
        identifyLabel: 'equipment_how_to_identify_pump',
        identify: 'equipment_pump_single_identify',
    },
    Dual: {
        title: 'equipment_pump_dual_full',
        description: 'equipment_pump_dual_desc',
        identifyLabel: 'equipment_how_to_identify_pump',
        identify: 'equipment_pump_dual_identify',
    },
    Variable: {
        title: 'equipment_pump_variable_full',
        description: 'equipment_pump_variable_desc',
        identifyLabel: 'equipment_how_to_identify_pump',
        identify: 'equipment_pump_variable_identify',
    },
};
