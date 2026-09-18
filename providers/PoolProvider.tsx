import { sortPoolsWithSpasBesideParents } from '@/lib/pool';
import { supabase } from '@/lib/Supabase';
import type { Pool } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type RefreshPoolsOptions = {
  /** Skip the global loading spinner (keeps current screens mounted). */
  silent?: boolean;
};

type PoolContextValue = {
  poolId: string | null;
  setPoolId: (poolId: string | null) => void;
  pools: Pool | null;
  allPools: Pool[];
  loading: boolean;
  error: Error | null;
  refreshPools: (options?: RefreshPoolsOptions) => Promise<void>;
  switchPool: (id: string) => Promise<void>;
  /** Silent flag — does not re-render. Call after a successful pool write. */
  markPoolsStale: () => void;
  /** Refreshes only if markPoolsStale was called since the last refresh. */
  refreshPoolsIfStale: (options?: RefreshPoolsOptions) => Promise<void>;
};

const PoolContext = createContext<PoolContextValue | undefined>(undefined);

export function PoolProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [poolId, setPoolId] = useState<string | null>(null);
  const [pools, setPools] = useState<Pool | null>(null);
  const [allPools, setAllPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // Ref (not state): marking stale must not re-render or set poolId during onboarding.
  const poolsStaleRef = useRef(false);
  const allPoolsRef = useRef<Pool[]>([]);

  const markPoolsStale = useCallback(() => {
    poolsStaleRef.current = true;
  }, []);

  const refreshPools = useCallback(async (options?: RefreshPoolsOptions) => {
    if (authLoading) return;

    if (!options?.silent) {
      setLoading(true);
    }
    setError(null);

    if (!user) {
      setPools(null);
      setAllPools([]);
      allPoolsRef.current = [];
      setPoolId(null);
      setLoading(false);
      await AsyncStorage.removeItem('activePoolId');
      return;
    }

    const { data: list, error: fetchError } = await supabase
      .from('pools')
      .select('*')
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError);
      setAllPools([]);
      allPoolsRef.current = [];
      setPools(null);
      setPoolId(null);
      setLoading(false);
      return;
    }

    const poolsList = sortPoolsWithSpasBesideParents(list ?? []);
    allPoolsRef.current = poolsList;
    setAllPools(poolsList);

    let activeId = await AsyncStorage.getItem('activePoolId');
    if (!activeId || !poolsList.some((pool) => pool.id === activeId)) {
      activeId = poolsList[0]?.id ?? null;
      if (activeId) {
        await AsyncStorage.setItem('activePoolId', activeId);
      } else {
        await AsyncStorage.removeItem('activePoolId');
      }
    }

    setPoolId(activeId);
    setPools(poolsList.find((pool) => pool.id === activeId) ?? null);
    setLoading(false);
  }, [user, authLoading]);

  const refreshPoolsIfStale = useCallback(
    async (options?: RefreshPoolsOptions) => {
      if (!poolsStaleRef.current) return;
      poolsStaleRef.current = false;
      await refreshPools(options);
    },
    [refreshPools],
  );

  const switchPool = useCallback(async (id: string) => {
    const next = allPoolsRef.current.find((pool) => pool.id === id);
    if (!next) return;
    await AsyncStorage.setItem('activePoolId', id);
    setPoolId(id);
    setPools(next);
  }, []);

  useEffect(() => {
    refreshPools();
  }, [refreshPools]);

  return (
    <PoolContext.Provider
      value={{
        poolId,
        setPoolId,
        pools,
        allPools,
        loading,
        error,
        refreshPools,
        switchPool,
        markPoolsStale,
        refreshPoolsIfStale,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
}

export function usePool() {
  const context = useContext(PoolContext);

  if (context === undefined) {
    throw new Error('usePool must be used within a PoolProvider');
  }

  return context;
}
