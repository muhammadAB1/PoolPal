import type { OverallStatus, SwimmingStatus } from '@/data/readingBands'

export type Country = 'us' | 'es';
export type Language = 'en' | 'es';
export type Measurement = 'us' | 'metric';

/** One row from the profile table. id is the same as auth.users.id. */
export type Profile = {
    id: string
    membership_tier: string
    country: Country
    language: Language
    measurement: Measurement
    name: string
    created_at?: string
    updated_at?: string
}

export type PoolType = 'Chlorine' | 'Saltwater' | 'Other';
export type ScreenedType = 'Screened' | 'Unscreened';
export type UseType = 'Family' | 'VacationHome' | 'ShortTermRental';
export type HotTubType = 'Yes' | 'No';
export type SpaAttachmentType = 'Attached' | 'Detached';
export type UsageFrequency = '0-1' | '2-3' | '4-5' | '6-7';
export type NumberOfPoolUsers = '1-2' | '3-4' | '5+';

export type PoolCondition =
    | 'CRYSTAL_CLEAR'
    | 'A_LITTLE_CLOUDY'
    | 'GREEN'
    | 'VERY_GREEN_OR_DARK'

export type PoolShape = 'Rectangle' | 'Round' | 'Oval' | 'Freeform' | 'Kidney';
export type PoolDepthProfile = 'Flat' | 'ShallowDeep' | 'NotSure';
export type MeasurementMethod = 'Known' | 'Estimate';
export type MeasurementUnit = 'us' | 'metric';

export type FilterType = 'Sand' | 'Cartridge' | 'DE';
export type PumpType = 'Single' | 'Dual' | 'Variable';
export type HeaterOption = 'Yes' | 'No';
export type SurfaceType =
    | 'Plaster'
    | 'Pebble'
    | 'Vinyl'
    | 'Fiberglass'
    | 'Tile'
    | 'Quartz'
    | 'PaintedConcrete'
    | 'SmoothStoneGlassBead'
    | 'ReinforcedPvcMembrane'
    | 'StainlessSteel'
    | 'Copper'
    | 'VinylLiner'
    | 'OtherCustomSurface'
export type CleaningType =
    | 'Robotic'
    | 'SuctionSide'
    | 'PressureSide'
    | 'ManualVacuum'
    | 'NoVacuum'

export type Pool = {
    id: string
    owner_user_id: string
    pool_name: string
    pool_type: PoolType
    pool_screen: ScreenedType
    pool_use_type: UseType
    usage_frequency?: UsageFrequency | null
    number_of_users?: NumberOfPoolUsers | null
    hot_tub_type?: HotTubType
    spa_attachment?: SpaAttachmentType | null
    pool_condition?: PoolCondition | null

    length?: number
    width?: number
    shallow_depth?: number
    deep_depth?: number
    shape?: PoolShape
    gallons?: number
    measurement_unit?: Measurement


    pump_type?: PumpType
    filter_type?: FilterType
    heater?: HeaterOption

    surface_type?: SurfaceType | null
    cleaning_type?: CleaningType | null

    reminder_day?: Weekday
    reminder_time?: string

    profile_completion_score: number
    missing_details?: string[] | null
    created_at?: string
    updated_at?: string
}

export type poolBasicUpdateProps = {
    poolCondition?: PoolCondition
}

export type poolSizeInsertProps = {
    length: number
    width: number
    shallowDepth: number
    deepDepth: number
    shape?: PoolShape
    gallons?: number
    measurementUnit?: Measurement
}

export type poolEquipmentInsertProps = {
    filterType?: FilterType
    pumpType?: PumpType
    heaterOption?: HeaterOption
}

export type poolSurfaceInsertProps = {
    surfaceType: SurfaceType
}

export type poolCleaningInsertProps = {
    cleaningType?: CleaningType
}

export type TestReadingsMethod = 'Readings' | 'Photo' | 'None';

export type PanelHandle = {
    show: () => void
    hide: () => void
}

export type testReadingsInsertProps = {
    bromine?: number
    testing_preference?: TestReadingsMethod
    free_chlorine?: number
    ph?: number
    total_alkalinity?: number
    cyanuric_acid?: string
    total_hardness?: number
    calcium_hardness?: number
    salt?: number
    total_chlorine?: number
    combined_chlorine?: number
    pool_status?: OverallStatus
    swimming_status?: SwimmingStatus
}

/** One row from the test_reading table. */
export type TestReadingRow = {
    id: string
    pool_id: string
    created_at: string
    free_chlorine?: number | null
    total_chlorine?: number | null
    bromine?: number | null
    ph?: number | null
    total_alkalinity?: number | null
    cyanuric_acid?: string | number | null
    calcium_hardness?: number | null
    salt?: number | null
    combined_chlorine?: number | null
    total_hardness?: number | null
    pool_status?: OverallStatus | null
    swimming_status?: SwimmingStatus | null
}

export type Weekday =
    | 'Sunday'
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'

export type poolReminderInsertProps = {
    reminderDay: Weekday
    reminderTime: string
}
