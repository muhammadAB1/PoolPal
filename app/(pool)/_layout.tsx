import { Stack } from 'expo-router';

export default function PoolLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="basics/index" />
      <Stack.Screen name="condition/index" />
      <Stack.Screen name="size/index" />
      <Stack.Screen name="equipment/index" />
      <Stack.Screen name="surface/index" />
      <Stack.Screen name="cleaning/index" />
      <Stack.Screen name="reminder/index" />
    </Stack>
  );
}
