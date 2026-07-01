import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/Supabase';
import type { Pool } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/providers/AuthProvider';

type PoolContextValue = {
  poolId: string | null;
  setPoolId: (poolId: string | null) => void;
  pools: Pool[];
  loading: boolean;
  error: Error | null;
};

const PoolContext = createContext<PoolContextValue | undefined>(undefined);

export function PoolProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [poolId, setPoolId] = useState<string | null>(null);
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('Ran from pool provider')
    async function fetchPools() {
      if (authLoading) return;

      setLoading(true);
      setError(null);

      if (!user) {
        setPools([]);
        setPoolId(null);
        setLoading(false);
        return;
      }

      const activePoolId = await AsyncStorage.getItem('activePoolId');
      if (activePoolId) {
        setPoolId(activePoolId);
        const activePool = await supabase
          .from('pools')
          .select('*')
          .eq('id', activePoolId)
          .single();

        if (activePool.error) {
          setError(activePool.error);
        }
      }
      else {
        const { data, error: fetchError } = await supabase
          .from('pools')
          .select('*')
          .eq('owner_user_id', user.id);

        if (fetchError) {
          setError(fetchError);
          setPools([]);
          setPoolId(null);
        } else {
          const userPools = data ?? [];
          setPools(userPools);

          const validActiveId = userPools.find((pool) => pool.id === activePoolId)?.id;
          const resolvedId = validActiveId ?? userPools[0]?.id ?? null;
          setPoolId(resolvedId);

          if (resolvedId) {
            await AsyncStorage.setItem('activePoolId', resolvedId);
          }
        }
      }
      setLoading(false);
    }

    fetchPools();
  }, [user?.id, authLoading]);

  return (
    <PoolContext.Provider
      value={{ poolId, setPoolId, pools, loading, error }}
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
