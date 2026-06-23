import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const isServer = typeof window === 'undefined'

const storage = isServer
  ? {
    getItem: async () => null,
    setItem: async () => { },
    removeItem: async () => { },
  }
  : Platform.OS === 'web'
    ? {
      getItem: async (key: string) => window.localStorage.getItem(key),
      setItem: async (key: string, value: string) => {
        window.localStorage.setItem(key, value)
      },
      removeItem: async (key: string) => {
        window.localStorage.removeItem(key)
      },
    }
    : AsyncStorage

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
)