import { type Href } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';

export type PostAuthRoute = '/pool-basics' | '/dashboard';

export function useAuthScreenGuard(): Href | null {
  const { user, loading: authLoading } = useAuth();
  const { poolId, loading: poolLoading } = usePool();

  if (authLoading || poolLoading || !user) return null;

  return poolId ? '/dashboard' : '/pool-basics';
}
