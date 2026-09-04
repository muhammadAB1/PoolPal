import type { FilterType, PumpType } from '@/lib/types';

/**
 * Heater is a simple Yes / No choice (not a device "type" like
 * filter or pump), so it gets its own small local type instead of reusing
 * the global `HeaterOption` type.
 */
export type HeaterChoice = 'Yes' | 'No';

type EquipmentOption<T extends string> = {
  value: T;
  title: string;
  description: string;
  exampleDescription?: string;
  identifyHint?: string;
};

export const POOL_EQUIPMENT = {
  heading: 'pool-equipment' as const,

  filter: {
    label: 'equipment_basics_filter_label',
    defaultValue: 'Sand' as FilterType,
    options: [
      {
        value: 'Sand',
        title: 'equipment_filter_sand',
        description: 'equipment_filter_sand_desc',
        exampleDescription: 'equipment_filter_sand_desc',
        identifyHint: 'equipment_filter_sand_identify',
      },
      {
        value: 'Cartridge',
        title: 'equipment_filter_cartridge',
        description: 'equipment_filter_cartridge_desc',
        exampleDescription: 'equipment_filter_cartridge_desc',
        identifyHint: 'equipment_filter_cartridge_identify',
      },
      {
        value: 'DE',
        title: 'equipment_filter_de',
        description: 'equipment_filter_de_desc',
        exampleDescription: 'equipment_filter_de_desc',
        identifyHint: 'equipment_filter_de_identify',
      },
    ] as EquipmentOption<FilterType>[],
  },

  pump: {
    label: 'equipment_basics_pump_label',
    defaultValue: 'Variable' as PumpType,
    options: [
      {
        value: 'Single',
        title: 'equipment_pump_single_full',
        description: 'equipment_pump_single_desc',
        exampleDescription: 'equipment_pump_single_desc',
        identifyHint: 'equipment_pump_single_identify',
      },
      {
        value: 'Dual',
        title: 'equipment_pump_dual_full',
        description: 'equipment_pump_dual_desc',
        exampleDescription: 'equipment_pump_dual_desc',
        identifyHint: 'equipment_pump_dual_identify',
      },
      {
        value: 'Variable',
        title: 'equipment_pump_variable_full',
        description: 'equipment_pump_variable_desc',
        exampleDescription: 'equipment_pump_variable_desc',
        identifyHint: 'equipment_pump_variable_identify',
      },
    ] as EquipmentOption<PumpType>[],
  },

  heater: {
    label: 'equipment_basics_heater_label',
    defaultValue: 'Yes' as HeaterChoice,
    options: [
      {
        value: 'Yes',
        title: 'equipment_heater_yes_title',
        description: 'equipment_heater_yes_desc',
      },
      {
        value: 'No',
        title: 'equipment_heater_no_title',
        description: 'equipment_heater_no_desc',
      },
    ] as EquipmentOption<HeaterChoice>[],
  },
};
