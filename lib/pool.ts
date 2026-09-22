import type { Pool, PoolEnvironment, PoolType, SpaSanitizer } from '@/lib/types';

export function isHotTubPool(pool?: Pool | null) {
    return pool?.body_type === 'hot_tub';
}

/** Map stored or legacy screen values onto the current environment options. */
export function toPoolEnvironment(value?: string | null): PoolEnvironment | undefined {
    if (value === 'Screened' || value === 'screened') return 'Screened';
    if (value === 'Covered' || value === 'covered') return 'Covered';
    if (value === 'Indoor' || value === 'indoor') return 'Indoor';
    if (value === 'Outdoor' || value === 'outdoor' || value === 'Unscreened') return 'Outdoor';
    return undefined;
}

export function spaSanitizerToPoolType(spaSanitizer?: SpaSanitizer | null): PoolType {
    if (spaSanitizer === 'saltwater') return 'Saltwater';
    if (spaSanitizer === 'bromine') return 'Bromine';
    return 'Chlorine';
}

/** Keep each detached spa immediately after its parent, not at the end of created_at order. */
export function sortPoolsWithSpasBesideParents(pools: Pool[]): Pool[] {
    const childrenByParent = new Map<string, Pool[]>();
    const roots: Pool[] = [];

    for (const pool of pools) {
        if (pool.parent_pool_id) {
            const siblings = childrenByParent.get(pool.parent_pool_id) ?? [];
            siblings.push(pool);
            childrenByParent.set(pool.parent_pool_id, siblings);
        } else {
            roots.push(pool);
        }
    }

    const sorted: Pool[] = [];
    for (const root of roots) {
        sorted.push(root);
        const children = childrenByParent.get(root.id);
        if (children) {
            sorted.push(...children);
            childrenByParent.delete(root.id);
        }
    }

    for (const leftover of childrenByParent.values()) {
        sorted.push(...leftover);
    }

    return sorted;
}
