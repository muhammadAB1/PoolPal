import type { PoolShape } from '@/lib/types';

export const POOL_SHAPES: readonly PoolShape[] = [
    'Rectangle',
    'Oval',
    'Round',
    'Kidney',
    'Freeform',
] as const;

export const poolShapeTranslationKeys: Record<PoolShape, string> = {
    Rectangle: 'pool_size_shape_rectangle',
    Oval: 'pool_size_shape_oval',
    Round: 'pool_size_shape_round',
    Kidney: 'pool_size_shape_kidney',
    Freeform: 'pool_size_shape_freeform',
};
