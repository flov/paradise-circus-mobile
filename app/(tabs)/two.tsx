import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-pc-bg">
      <Text className="text-xl font-bold text-pc-text">Tab Two</Text>
      <View className="my-8 h-px w-4/5 bg-pc-separator" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
