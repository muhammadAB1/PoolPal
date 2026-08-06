import { TestStripProvider } from '@/providers/TestStripProvider';
import { Stack } from 'expo-router';

export default function ReadingsLayout() {
  return (
    <TestStripProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TestStripProvider>
  );
}
