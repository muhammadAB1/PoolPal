import { supabase } from '@/lib/Supabase';

export type PostAuthRoute = '/pool-basics' | '/dashboard';

export async function resolvePostAuthRoute(userId: string | null): Promise<PostAuthRoute> {
  const { data, error } = await supabase
    .from('pools')
    .select('id')
    .eq('owner_user_id', userId)
    .limit(1);
    
  if (error) throw error;

  return data?.length !== 0 ? '/dashboard' : '/pool-basics';
}

export async function userHasPool(userId: string): Promise<boolean> {
  const route = await resolvePostAuthRoute(userId);
  return route === '/dashboard';
}
