// =============================================================================
// RelaxScene.tsx — ฉากที่ 1 "Relax"
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.2 : ขึ้นมาพร้อมกลุ่มฉาก (OnboardingScreen ยกขึ้นให้) + หัวข้อไหลลงมาเข้าที่
//   0.2      : อยู่กลางจอ (ฉากของตัวเอง)
//   0.2 -> 0.4 : เลื่อนออกไปทางซ้าย (รูป/ข้อความเลื่อนเร็วไม่เท่ากัน = parallax)
//   0.4 -> 0.8 : ค้างอยู่นอกจอซ้าย
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const relaxImage = require('../../assets/onboarding/relax_image.png');
const IMAGE_WIDTH = 350; // ความกว้างสูงสุดของรูป (ใช้ทั้งใน style และคำนวณระยะเลื่อน)
const IMAGE_HEIGHT = 250;

export default function RelaxScene({ animationController }: Props) {
  const window = useWindowDimensions();

  // หัวข้อ "Relax" ไหลลงมาเข้าที่ตอนเข้าฉาก
  //   26 * 2 = 52 คือ "ความสูงตัวอักษร (fontSize 26) x 2" = ระยะพอดีให้หัวข้อเริ่มจากเหนือตำแหน่งจริง
  //   ตัวเลข 0   -> -52  (ติดลบ = อยู่สูงกว่าตำแหน่งจริง 52 px)
  //   ตัวเลข 0.2 -> 0    (ลงมาตรงตำแหน่งพอดี)
  //   0.2 - 0.8  -> 0    (อยู่นิ่ง — ตอนฉากออก ทั้งฉากเลื่อนไปด้วย containerTranslateX อยู่แล้ว)
  const titleTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [-(26 * 2), 0, 0],
  });

  // คำอธิบาย: เลื่อนออกซ้าย "เร็วกว่าตัวฉาก 2 เท่า" (ไป -width*2 ในเวลาเดียวกับที่ฉากไปแค่ -width)
  //   0 -> 0.2  : 0 (ไม่ขยับ)
  //   0.2 -> 0.4: 0 -> -window.width * 2 (พุ่งออกซ้ายเร็ว)
  //   0.6, 0.8  : กลับเป็น 0 — ไม่มีผลบนจอ เพราะตอนนั้นทั้งฉากอยู่นอกจอแล้ว (แค่ต่อเส้นให้ครบ)
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -window.width * 2, 0, 0],
  });

  // รูป: เลื่อนออกเร็วที่สุด ไป -(350 * 4) = -1400 px
  // ยิ่งระยะไกล ยิ่งเลื่อนเร็ว (เพราะใช้เวลาเท่ากัน) -> รูป, คำอธิบาย, ตัวฉาก เลื่อนเร็วไม่เท่ากัน
  // = เทคนิค "parallax" ทำให้ดูมีมิติ มีชั้นหน้า-หลัง
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -(IMAGE_WIDTH * 4), 0, 0],
  });

  // ตัวฉากทั้งก้อน:
  //   0 -> 0.2   : 0 (อยู่ตรงกลาง ขึ้นมาพร้อมกลุ่ม)
  //   0.2 -> 0.4 : 0 -> -window.width (เลื่อนออกซ้ายพ้นจอพอดี)
  //   0.4 -> 0.8 : ค้างที่ -window.width (นอกจอซ้าย)
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.8],
    outputRange: [0, 0, -window.width, -window.width],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      <Animated.Text style={[styles.title, { transform: [{ translateY: titleTranslateY }] }]}>Relax</Animated.Text>
      <Animated.Text style={[styles.subtitle, { transform: [{ translateX: subtitleTranslateX }] }]}>
        Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore
      </Animated.Text>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]}
        source={relaxImage}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ฉากนี้ไม่มี position: 'absolute' เพราะเป็น "ตัวหลัก" ที่กำหนดตำแหน่งกลางจอ
  // ฉากอื่น (Care, MoodDiary, Welcome) ใช้ absolute เพื่อซ้อนทับตำแหน่งเดียวกัน
  container: { alignItems: 'center', paddingBottom: 100 },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
});
