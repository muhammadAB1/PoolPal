import type { SurfaceType } from '@/lib/types';

export const POOL_SURFACE = {
  heading: 'surface-type' as const,
  details: {
    database_column_name: 'surface_type' as const,
    value: {
      Plaster: { name: 'surface_type_plaster', description: 'surface_type_plaster_desc' },
      Pebble: { name: 'surface_type_pebble', description: 'surface_type_pebble_desc' },
      Vinyl: { name: 'surface_type_vinyl', description: 'surface_type_vinyl_desc' },
      Fiberglass: { name: 'surface_type_fiberglass', description: 'surface_type_fiberglass_desc' },
      Tile: { name: 'surface_type_tile', description: 'surface_type_tile_desc' },
      Quartz: { name: 'surface_type_quartz', description: 'surface_type_quartz_desc' },
      PaintedConcrete: {
        name: 'surface_type_painted_concrete',
        description: 'surface_type_painted_concrete_desc',
      },
      SmoothStoneGlassBead: {
        name: 'surface_type_smooth_stone_glass_bead',
        description: 'surface_type_smooth_stone_glass_bead_desc',
      },
      ReinforcedPvcMembrane: {
        name: 'surface_type_reinforced_pvc_membrane',
        description: 'surface_type_reinforced_pvc_membrane_desc',
      },
      StainlessSteel: {
        name: 'surface_type_stainless_steel',
        description: 'surface_type_stainless_steel_desc',
      },
      Copper: { name: 'surface_type_copper', description: 'surface_type_copper_desc' },
      VinylLiner: { name: 'surface_type_vinyl_liner', description: 'surface_type_vinyl_liner_desc' },
      OtherCustomSurface: {
        name: 'surface_type_other_custom',
        description: 'surface_type_other_custom_desc',
      },
    } as Record<SurfaceType, { name: string; description: string }>,
  },
};
