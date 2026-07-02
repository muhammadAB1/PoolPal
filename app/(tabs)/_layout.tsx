
import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { user, loading } = useAuth();
  if (loading) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </SafeAreaView>
  }
  if (!user) {
    return <Redirect href="/" />
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
