import type { OverallStatus, SwimmingStatus } from '@/data/readingBands'

export type Country = string;
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

export type PoolType = 'Chlorine' | 'Saltwater' | 'Bromine' | 'Other';
export type PoolEnvironment = 'Outdoor' | 'Screened' | 'Covered' | 'Indoor';
export type UseType = 'Family' | 'VacationHome' | 'ShortTermRental';
export type HotTubType = 'Yes' | 'No';
export type SpaAttachmentType = 'Attached' | 'Detached';
export type UsageFrequency = '0-1' | '2-3' | '4-5' | '6-7';
export type NumberOfPoolUsers = '1-2' | '3-5' | '6-10' | '10+';
export type SaltSystemStatus = 'working' | 'not_working';
export type ManualChlorineStatus = 'yes' | 'no';
export type SpaSanitizer = 'chlorine' | 'saltwater' | 'bromine' | 'unknown';
export type PoolBodyType = 'pool' | 'hot_tub';
export type OccupancyPattern = 'year_round' | 'seasonal';
export type RentalActivity = 'year_round' | 'seasonal';

export type PoolCondition =
    | 'CRYSTAL_CLEAR'
    | 'A_LITTLE_CLOUDY'
    | 'GREEN'
    | 'VERY_GREEN_OR_DARK'

export type PoolShape = 'Rectangle' | 'Round' | 'Oval' | 'Freeform' | 'Kidney';
export type PoolDepthProfile = 'Flat' | 'ShallowDeep' | 'NotSure';
export type MeasurementMethod = 'Known' | 'Estimate';
export type MeasurementUnit = 'us' | 'metric';
export type VolumeSource = 'calculated' | 'manual';

export type FreeformSection = {
    id: string;
    index: number;
    length: number | null;
    averageWidth: number | null;
    shallowDepth: number | null;
    deepDepth: number | null;
    measurementUnit: MeasurementUnit;
    volumeUsGallons: number | null;
    volumeLiters: number | null;
};

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
    pool_screen?: PoolEnvironment | null
    pool_use_type: UseType
    usage_frequency?: UsageFrequency | null
    number_of_users?: NumberOfPoolUsers | null
    parent_pool_id?: string | null
    body_type?: PoolBodyType
    hot_tub_type?: HotTubType
    spa_attachment?: SpaAttachmentType | null
    salt_system_status?: SaltSystemStatus | null
    manual_chlorine_during_salt_failure?: ManualChlorineStatus | null
    standalone_spa_sanitizer?: SpaSanitizer | null
    occupancy_pattern?: OccupancyPattern | null
    seasonal_unused_months?: string[] | null
    rental_activity?: RentalActivity | null
    rental_active_months?: string[] | null
    pool_condition?: PoolCondition | null

    length?: number | null
    width?: number | null
    shallow_depth?: number | null
    deep_depth?: number | null
    shape?: PoolShape | null
    gallons?: number | null
    measurement_unit?: Measurement | null
    volume_us_gallons?: number | null
    volume_liters?: number | null
    volume_source?: VolumeSource | null
    freeform_sections?: FreeformSection[] | null


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
    length?: number | null
    width?: number | null
    shallowDepth?: number | null
    deepDepth?: number | null
    shape?: PoolShape
    gallons?: number | null
    volumeUsGallons?: number | null
    volumeLiters?: number | null
    volumeSource?: VolumeSource
    freeformSections?: FreeformSection[]
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
