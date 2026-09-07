import { ProblemsProvider } from '@/providers/ProblemsProvider';
import { Stack } from 'expo-router';

export default function ProblemsLayout() {
    return (
        <ProblemsProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ProblemsProvider>
    );
}
