import Animated, { FadeInDown } from 'react-native-reanimated';

export function AnimatedItem({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 80, 400)).duration(400)}>
      {children}
    </Animated.View>
  );
}
