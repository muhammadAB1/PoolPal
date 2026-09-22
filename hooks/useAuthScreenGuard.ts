import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';

export type PostAuthRoute = '/account-basics' | '/(onboarding)/pool-basics' | '/(tabs)/dashboard';

export function useAuthScreenGuard(): PostAuthRoute | null {
  const { user, loading: authLoading, country, language, measurement } = useAuth();
  const { poolId, loading: poolLoading } = usePool();

  if (authLoading || poolLoading || !user) return null;

  if (poolId) return '/(tabs)/dashboard'
  if (!country || !language || !measurement) return '/account-basics'
  return '/(onboarding)/pool-basics'
}
