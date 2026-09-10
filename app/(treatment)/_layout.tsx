import { Stack } from 'expo-router';

export default function TreatmentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="treatment/plan" />
    </Stack>
  );
}
