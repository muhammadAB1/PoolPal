
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const { poolId, loading: poolLoading } = usePool();
  if (loading || poolLoading) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </SafeAreaView>
  }
  if (!user) {
    return <Redirect href="/" />
  }
  if (poolId) {
    return <Redirect href="/pool-basics" />
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
