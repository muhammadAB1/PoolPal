import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';

export type PostAuthRoute = '/(onboarding)/pool-basics' | '/(tabs)/dashboard';

export function useAuthScreenGuard(): PostAuthRoute | null {
  const { user, loading: authLoading } = useAuth();
  const { poolId, loading: poolLoading } = usePool();

  if (authLoading || poolLoading || !user) return null;

  return poolId ? '/(tabs)/dashboard' : '/(onboarding)/pool-basics';
}
