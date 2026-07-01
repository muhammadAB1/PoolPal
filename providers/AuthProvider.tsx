import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/Supabase';
import { resolvePostAuthRoute } from '@/lib/authRouting';
import { Href, router } from 'expo-router';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  plan: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Ran from auth provider')
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;

      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setPlan(session?.user?.user_metadata?.plan ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setPlan(session?.user?.user_metadata?.plan ?? null);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, plan, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
