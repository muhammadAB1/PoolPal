import type { PoolDepthProfile, PoolShape } from '@/lib/types';

/** Shapes shown in the Pool Size UI (matches design — Kidney kept in type for backend). */
export const POOL_SHAPES: readonly PoolShape[] = [
    'Rectangle',
    'Round',
    'Oval',
    'Freeform',
] as const;

export const poolShapeTranslationKeys: Record<PoolShape, string> = {
    Rectangle: 'pool_size_shape_rectangle',
    Round: 'pool_size_shape_round',
    Oval: 'pool_size_shape_oval',
    Freeform: 'pool_size_shape_freeform',
    Kidney: 'pool_size_shape_kidney',
};

export const POOL_DEPTH_PROFILES: readonly PoolDepthProfile[] = [
    'Flat',
    'ShallowDeep',
    'NotSure',
] as const;

export const poolDepthProfileTranslationKeys: Record<PoolDepthProfile, string> = {
    Flat: 'pool_size_depth_flat',
    ShallowDeep: 'pool_size_depth_shallow_deep',
    NotSure: 'pool_size_depth_not_sure',
};

/** Default shallow/deep values used when estimating from a depth profile. */
export function depthsFromProfile(profile: PoolDepthProfile): {
    shallowDepth: string;
    deepDepth: string;
} {
    switch (profile) {
        case 'Flat':
            return { shallowDepth: '4', deepDepth: '4' };
        case 'ShallowDeep':
            return { shallowDepth: '3', deepDepth: '6' };
        case 'NotSure':
            return { shallowDepth: '4', deepDepth: '5' };
    }
}
