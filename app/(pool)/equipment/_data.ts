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
  /** Short copy shown directly on the selectable card. */
  description: string;
  /** Longer copy + hint shown inside the "View examples" modal. */
  exampleDescription?: string;
  identifyHint?: string;
};

export const POOL_EQUIPMENT = {
  heading: 'pool-equipment' as const,

  filter: {
    label: 'Filter type',
    // Hardcoded for now. Once wired to Supabase, this should default to
    // the pool's saved `filter_type` value instead.
    defaultValue: 'Sand' as FilterType,
    options: [
      {
        value: 'Sand',
        title: 'Sand Filter',
        description: 'Uses filter sand to catch debris.',
        exampleDescription:
          "Uses sand inside the tank to trap dirt and debris. It's one of the most common types of filters.",
        identifyHint:
          'Usually a large round tank with a multiport valve on top or on the side. It often has a "Backwash" setting.',
      },
      {
        value: 'Cartridge',
        title: 'Cartridge Filter',
        description: 'Uses a pleated cartridge to filter debris.',
        exampleDescription:
          "Uses a pleated cartridge element to trap dirt and debris. It's easy to clean and does not need backwashing.",
        identifyHint:
          'Usually a tall tank with a removable pleated cartridge inside. It typically does not have a backwash setting.',
      },
      {
        value: 'DE',
        title: 'DE Filter',
        description: 'Uses diatomaceous earth powder for the finest filtration.',
        exampleDescription:
          'Uses DE powder to trap very fine particles for the cleanest possible water. Requires DE powder after cleaning.',
        identifyHint:
          'Usually looks similar to a large tank filter, but it uses DE powder after cleaning. It may have a backwash setting and a label mentioning DE or diatomaceous earth.',
      },
    ] as EquipmentOption<FilterType>[],
  },

  pump: {
    label: 'Pump',
    defaultValue: 'Variable' as PumpType,
    options: [
      {
        value: 'Single',
        title: 'Single Speed Pump',
        description: 'Runs at one constant speed. Simple and affordable.',
        exampleDescription:
          "Runs at one constant speed with no adjustment options. It's the simplest and most common pump type.",
        identifyHint: 'No digital display. Usually only has a simple on/off switch or timer.',
      },
      {
        value: 'Dual',
        title: 'Dual Speed Pump',
        description: 'Switches between two speeds to help save energy.',
        exampleDescription:
          'Runs at two speeds — high for cleaning and low for regular filtering — to help save energy.',
        identifyHint: 'May have a dial, switch, or small panel to select high or low speed.',
      },
      {
        value: 'Variable',
        title: 'Variable Speed Pump',
        description: 'Automatically adjusts speed for maximum efficiency.',
        exampleDescription:
          'Adjusts to multiple speeds for maximum energy efficiency and quieter operation.',
        identifyHint: 'Has a digital display or advanced control panel with multiple speed settings.',
      },
    ] as EquipmentOption<PumpType>[],
  },

  heater: {
    label: 'Heater',
    defaultValue: 'Yes' as HeaterChoice,
    options: [
      {
        value: 'Yes',
        title: 'Yes, I have a heater',
        description: 'Keeps your pool water warm whenever you want to swim.',
      },
      {
        value: 'No',
        title: 'No heater',
        description: 'Your pool relies on the sun to warm the water.',
      },
    ] as EquipmentOption<HeaterChoice>[],
  },
};
