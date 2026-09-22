import { setLanguage as setAppLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/Supabase';
import { Country, Language, Measurement, Profile } from '@/lib/types';
import type { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  plan: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  measurement: Measurement;
  country: Country | null;
  language: Language | null;
  name: string | null;
  cityOrTown: string | null;
  cityOrTownId: string | null;
  /** Re-fetches the signed-in user's profile row (call after writing prefs). */
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [measurement, setMeasurement] = useState<Measurement>('us');
  const [country, setCountry] = useState<Country | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [cityOrTown, setCityOrTown] = useState<string | null>(null);
  const [cityOrTownId, setCityOrTownId] = useState<string | null>(null);

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      setPlan(null);
      setCountry(null);
      setLanguage(null);
      setMeasurement('us');
      setName(null);
      setCityOrTown(null);
      setCityOrTownId(null);
      return;
    }

    const profile = data as Profile;
    setPlan(profile.membership_tier ?? null);
    setCountry(profile.country ?? null);
    setLanguage(profile.language ?? null);
    setMeasurement(profile.measurement ?? 'us');
    setName(profile.name ?? null);
    setCityOrTown(profile.city_or_town ?? null);
    setCityOrTownId(profile.city_or_town_id ?? null);
    if (profile.language === 'en' || profile.language === 'es') {
      setAppLanguage(profile.language);
    }
  }

  function clearProfile() {
    setPlan(null);
    setCountry(null);
    setLanguage(null);
    setMeasurement('us');
    setName(null);
    setCityOrTown(null);
    setCityOrTownId(null);
  }

  useEffect(() => {
    async function syncSession(session: Session | null) {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        clearProfile();
      }

      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      syncSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function refreshProfile() {
    if (user) await loadProfile(user.id);
  }

  return (
    <AuthContext.Provider
      value={{ user, accessToken, plan, loading, setUser, measurement, country, language, name, cityOrTown, cityOrTownId, refreshProfile }}
    >
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
