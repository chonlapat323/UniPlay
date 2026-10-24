// =============================================================================
// CareScene.tsx — ฉากที่ 2 "Care"
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.2   : รอคิวนอกจอขวา (ไม่ขยับ)
//   0.2 -> 0.4 : เลื่อนเข้ามาจากขวา
//   0.4        : อยู่กลางจอ (ฉากของตัวเอง)
//   0.4 -> 0.6 : เลื่อนออกไปทางซ้าย
//   0.6 -> 0.8 : ค้างนอกจอซ้าย
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const careImage = require('../../assets/onboarding/care_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

export default function CareScene({ animationController }: Props) {
  const window = useWindowDimensions();

  // ตัวฉากทั้งก้อน (บวก = ขวา, ลบ = ซ้าย):
  //   ตัวเลข: 0              0.2            0.4   0.6             0.8
  //   ค่า:    +width         +width         0     -width          -width
  //           (รอนอกจอขวา)    (ยังรอ)        (กลาง) (ออกซ้ายพ้นจอ)   (ค้างนอกจอซ้าย)
  // เทคนิค: ใส่ค่าซ้ำ 2 จุดติดกัน (+width, +width) = ช่วงนั้น "ไม่ขยับ" ใช้บอกว่ายังไม่ถึงตา
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width, -window.width],
  });

  // หัวข้อ "Care": เลื่อนตามฉากแต่เหลื่อมเล็กน้อย 52 px (= fontSize 26 x 2)
  // ทำให้ตอนเข้ามา หัวข้อดูเหมือน "ตามมาช้านิดนึง" ไม่ได้ติดกับฉากแข็งๆ
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0, -(26 * 2), -(26 * 2)],
  });

  // รูป: เริ่มไกลกว่าฉากมาก (350 * 4 = 1400 px) แต่ต้องมาถึงกลางจอ (0) พร้อมกันที่ 0.4
  // ระยะไกลกว่าแต่เวลาเท่ากัน -> รูปวิ่งเร็วกว่า = parallax เหมือนฉาก Relax
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0, -(IMAGE_WIDTH * 4), -(IMAGE_WIDTH * 4)],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      <Animated.Image style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]} source={careImage} />
      <Animated.Text style={[styles.title, { transform: [{ translateX: titleTranslateX }] }]}>Care</Animated.Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // absolute + left/right: 0 = ซ้อนทับตำแหน่งเดียวกับฉาก Relax (กว้างเต็มจอ)
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
});
