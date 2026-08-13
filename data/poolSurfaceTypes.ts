import type { SurfaceType } from '@/lib/types';

export const SURFACE_TYPES: readonly SurfaceType[] = [
    'Plaster',
    'Pebble',
    'Vinyl',
    'Fiberglass',
    'Tile',
    'NotSure',
] as const;

export const NEW_SURFACE_TYPES: readonly SurfaceType[] = [
    'Quartz',
    'PaintedConcrete',
    'SmoothStoneGlassBead',
    'ReinforcedPvcMembrane',
    'StainlessSteel',
    'Copper',
    'VinylLiner',
    'OtherCustomSurface',
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
    Quartz: {
        label: 'surface_type_quartz',
        description: 'surface_type_quartz_desc',
    },
    PaintedConcrete: {
        label: 'surface_type_painted_concrete',
        description: 'surface_type_painted_concrete_desc',
    },
    SmoothStoneGlassBead: {
        label: 'surface_type_smooth_stone_glass_bead',
        description: 'surface_type_smooth_stone_glass_bead_desc',
    },
    ReinforcedPvcMembrane: {
        label: 'surface_type_reinforced_pvc_membrane',
        description: 'surface_type_reinforced_pvc_membrane_desc',
    },
    StainlessSteel: {
        label: 'surface_type_stainless_steel',
        description: 'surface_type_stainless_steel_desc',
    },
    Copper: {
        label: 'surface_type_copper',
        description: 'surface_type_copper_desc',
    },
    VinylLiner: {
        label: 'surface_type_vinyl_liner',
        description: 'surface_type_vinyl_liner_desc',
    },
    OtherCustomSurface: {
        label: 'surface_type_other_custom',
        description: 'surface_type_other_custom_desc',
    },
    NotSure: {
        label: 'surface_type_not_sure',
        description: 'surface_type_not_sure_desc',
    },
};
