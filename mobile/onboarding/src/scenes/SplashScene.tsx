import { StyleSheet, View, Text, Image, Animated, useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../palette';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

const introImage = require('../../assets/onboarding/introduction_image.png');

// หน้าแรกสุดที่เห็นตอนเปิดแอป — เลื่อนขึ้นหายไปทั้งหน้าทันทีที่กด "Let's begin" (progress 0 -> 0.2)
// ปุ่มตรงนี้เป็นปุ่มธรรมดา (ไม่ใช่ NextButtonArrow ที่มอร์ฟได้ — ตัวนั้นอยู่ใน CenterNextButton ซึ่งซ่อนอยู่ตอนอยู่หน้านี้)
export default function SplashScene({ onNextClick, animationController }: Props) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const translateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [0, -window.height, -window.height],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: palette.background, transform: [{ translateY }] }]}>
      <ScrollView style={{ flexGrow: 0 }} alwaysBounceVertical={false}>
        <Image
          style={{ width: window.width, height: undefined, aspectRatio: 357 / 470 }}
          source={introImage}
        />
        <Text style={styles.title}>Clearhead</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet,consectetur{'\n'}adipiscing elit,sed do eiusmod tempor{'\n'}incididunt ut labore
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 8 + insets.bottom }]}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: 'powderblue' }}
          onPress={onNextClick}
        >
          <Text style={styles.buttonText}>Let&apos;s begin</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: palette.text, fontSize: 25, textAlign: 'center', fontWeight: '700', paddingVertical: 8 },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 24 },
  footer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 8 },
  button: {
    height: 58,
    backgroundColor: palette.button,
    borderRadius: 29,
    paddingVertical: 16,
    paddingHorizontal: 56,
    justifyContent: 'center',
  },
  buttonText: { fontSize: 18, color: palette.buttonText },
});
