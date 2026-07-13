import { supabase } from '@/lib/Supabase';
import type { Pool } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type PoolContextValue = {
  poolId: string | null;
  setPoolId: (poolId: string | null) => void;
  pools: Pool | null;
  loading: boolean;
  error: Error | null;
};

const PoolContext = createContext<PoolContextValue | undefined>(undefined);

export function PoolProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [poolId, setPoolId] = useState<string | null>(null);
  const [pools, setPools] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('Ran from pool provider')
    async function fetchPools() {
      if (authLoading) return;

      setLoading(true);
      setError(null);

      if (!user) {
        setPools(null);
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
        const userPools = activePool.data ?? null;
        setPools(userPools);

        if (activePool.error) {
          setError(activePool.error);
        }
      }
      else {
        const { data, error: fetchError } = await supabase
          .from('pools')
          .select('*')
          .eq('owner_user_id', user.id)
          .single();

        if (fetchError) {
          setError(fetchError);
          setPools(null);
          setPoolId(null);
        } else {
          const userPools = data ?? null;
          setPools(userPools);


          const resolvedId = userPools?.id ?? null;
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
