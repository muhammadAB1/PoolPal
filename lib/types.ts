export type Country = 'us' | 'es';
export type Language = 'en' | 'es';
export type Measurement = 'us' | 'metric';

export type PoolType = 'Chlorine' | 'Saltwater' | 'Other';
export type ScreenedType = 'Screened' | 'Unscreened';
export type UseType = 'Family' | 'VacationHome' | 'ShortTermRental';

export type PoolCondition =
    | 'CRYSTAL_CLEAR'
    | 'A_LITTLE_CLOUDY'
    | 'GREEN'
    | 'VERY_GREEN_OR_DARK'
    | 'NOT_SURE';

export type PoolShape = 'Rectangle' | 'Oval' | 'Round' | 'Kidney' | 'Freeform';
export type MeasurementMethod = 'Known' | 'Estimate';
export type MeasurementUnit = 'us' | 'metric';

export type FilterType = 'Sand' | 'Cartridge' | 'DE';
export type PumpType = 'Single' | 'Dual' | 'Variable';
export type HeaterOption = 'Yes' | 'No' | 'NotSure';
export type SurfaceType = 'Plaster' | 'Pebble' | 'Vinyl' | 'Fiberglass' | 'Tile' | 'NotSure';
export type CleaningType =
    | 'Robotic'
    | 'SuctionSide'
    | 'PressureSide'
    | 'ManualVacuum'
    | 'NoVacuum'
    | 'NotSure';

export type Pool = {
    id: string
    owner_user_id: string
    pool_name: string
    pool_type: PoolType
    pool_screen: ScreenedType
    pool_use_type: UseType
    pool_condition?: PoolCondition | null
    surface_type?: SurfaceType | null
    cleaning_type?: CleaningType | null
    profile_completion_score: number
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