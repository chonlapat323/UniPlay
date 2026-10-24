// =============================================================================
// MoodDiaryScene.tsx — ฉากที่ 3 "Mood Dairy" (สะกด Dairy ตามต้นฉบับ)
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.4   : รอคิวนอกจอขวา (ไม่ขยับ)
//   0.4 -> 0.6 : เลื่อนเข้ามาจากขวา
//   0.6        : อยู่กลางจอ (ฉากของตัวเอง)
//   0.6 -> 0.8 : เลื่อนออกไปทางซ้าย
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const moodDiaryImage = require('../../assets/onboarding/mood_dairy_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

export default function MoodDiaryScene({ animationController }: Props) {
  const window = useWindowDimensions();

  // inputRange มีแค่ 4 จุด ไม่ต้องใส่ 0.2 เพราะช่วง 0 -> 0.4 ฉากนี้แค่รอคิว ค่าไม่เปลี่ยนอยู่แล้ว
  //   ตัวเลข: 0        0.4      0.6   0.8
  //   ค่า:    +width   +width   0     -width
  //           (รอขวา)   (ยังรอ)  (กลาง) (ออกซ้าย)
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width],
  });

  // คำอธิบาย: วิ่งไกลเป็น 2 เท่าของฉาก (width * 2) ในเวลาเดียวกัน -> เร็วกว่าฉาก = parallax
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width * 2, window.width * 2, 0, -(window.width * 2)],
  });

  // รูป: วิ่งไกลที่สุด (350 * 4 = 1400 px) -> เร็วที่สุด
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0, -(IMAGE_WIDTH * 4)],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      {/* หัวข้อใช้ Text ธรรมดา (ไม่ animate แยก) เลื่อนไปพร้อมตัวฉาก */}
      <Text style={styles.title}>Mood Dairy</Text>
      <Animated.Text style={[styles.subtitle, { transform: [{ translateX: subtitleTranslateX }] }]}>
        Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore
      </Animated.Text>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]}
        source={moodDiaryImage}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
});
