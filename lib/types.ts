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

export type Pool = {
    id: string
    owner_user_id: string
    pool_name: string
    pool_type: PoolType
    pool_screen: ScreenedType
    pool_use_type: UseType
    pool_condition?: PoolCondition | null
    profile_completion_score: number
    created_at?: string
    updated_at?: string
}

export type poolBasicUpdateProps = {
    profileCompletionScore: number
    poolCondition?: PoolCondition
}