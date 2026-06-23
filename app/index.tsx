import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { graphics } from '@/constants/images';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-1 items-center justify-center gap-6">
        <Image
          source={graphics.poolPalLogo}
          className=" left-[18%]"
          resizeMode="contain"
        />
        <TouchableOpacity
          className="bg-brand-blue rounded-full py-[14px] px-8 items-center"
          onPress={() => router.push('/welcome')}
          activeOpacity={0.85}
        >
          <Text className="text-button font-jakarta-bold text-surface-white">
            Open Welcome Screen
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
