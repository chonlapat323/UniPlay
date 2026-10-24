// =============================================================================
// WelcomeScene.tsx — ฉากสุดท้าย "Welcome"
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.6   : รอคิวนอกจอขวา (ไม่ขยับ)
//   0.6 -> 0.8 : เลื่อนเข้ามาจากขวา
//   0.8        : อยู่กลางจอแล้วจบ — ไม่มีช่วง "ออก" เพราะไม่มีฉากถัดไป
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const welcomeImage = require('../../assets/onboarding/welcome.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 350; // รูปฉากนี้เกือบจัตุรัส จึงสูงกว่าฉากอื่น

export default function WelcomeScene({ animationController }: Props) {
  const window = useWindowDimensions();

  //   ตัวเลข: 0        0.6      0.8
  //   ค่า:    +width   +width   0
  //           (รอขวา)   (ยังรอ)  (กลางจอ)
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [window.width, window.width, 0],
  });

  // หัวข้อเหลื่อมตามมา 52 px (= fontSize 26 x 2) เหมือนฉาก Care
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0],
  });

  // รูปเริ่มไกล 1400 px (350 * 4) -> วิ่งเข้ามาเร็วกว่าตัวฉาก = parallax
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]}
        source={welcomeImage}
      />
      <Animated.Text style={[styles.title, { transform: [{ translateX: titleTranslateX }] }]}>Welcome</Animated.Text>
      <Text style={styles.subtitle}>Stay organised and live stress-free with you-do app</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
});
