import { useEffect } from 'react';
import { useRouter, type Href } from 'expo-router';
import { resolvePostAuthRoute } from '@/lib/authRouting';
import { useAuth } from '@/providers/AuthProvider';

export function useAuthScreenGuard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Ran from auth screen guard')
    if (loading || !user) return;

    async function redirectIfAuthenticated() {
      try {
        const route = await resolvePostAuthRoute(user!.id);
        router.replace(route as Href);
      } catch {
        // Stay on auth screen if pool check fails
      }
    }

    redirectIfAuthenticated();
  }, [user, loading]);
}
