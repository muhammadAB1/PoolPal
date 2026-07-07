import type { SurfaceType } from '@/lib/types';

export const SURFACE_TYPES: readonly SurfaceType[] = [
    'Plaster',
    'Pebble',
    'Vinyl',
    'Fiberglass',
    'Tile',
    'NotSure',
] as const;

export const surfaceTypeTranslationKeys: Record<
    SurfaceType,
    { label: string; description: string }
> = {
    Plaster: {
        label: 'surface_type_plaster',
        description: 'surface_type_plaster_desc',
    },
    Pebble: {
        label: 'surface_type_pebble',
        description: 'surface_type_pebble_desc',
    },
    Vinyl: {
        label: 'surface_type_vinyl',
        description: 'surface_type_vinyl_desc',
    },
    Fiberglass: {
        label: 'surface_type_fiberglass',
        description: 'surface_type_fiberglass_desc',
    },
    Tile: {
        label: 'surface_type_tile',
        description: 'surface_type_tile_desc',
    },
    NotSure: {
        label: 'surface_type_not_sure',
        description: 'surface_type_not_sure_desc',
    },
};
