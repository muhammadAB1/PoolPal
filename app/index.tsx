import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSupabase } from '@/hooks/supabaseHooks';

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading } = useSupabase();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/welcome');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0E97DC" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-h2 font-jakarta-extrabold text-charcoal text-center">
          Welcome back
        </Text>
        <Text className="text-body font-jakarta text-sub text-center mt-2">
          You are signed in.
        </Text>
      </View>
    </SafeAreaView>
  );
}
