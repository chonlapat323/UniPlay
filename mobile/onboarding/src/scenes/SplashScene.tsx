// =============================================================================
// SplashScene.tsx — หน้าแรกสุด ("Clearhead" + ปุ่ม Let's begin)
// -----------------------------------------------------------------------------
// เห็นตอนตัวเลข = 0 พอกดปุ่ม ตัวเลขวิ่ง 0 -> 0.2 หน้านี้จะเลื่อนขึ้นจนหายพ้นจอด้านบน
// ปุ่มตรงนี้เป็นปุ่มธรรมดา (ไม่ใช่ NextButtonArrow ที่มอร์ฟได้ — ตัวนั้นอยู่ใน CenterNextButton
// ซึ่งซ่อนอยู่ใต้จอตอนอยู่หน้านี้)
// =============================================================================
import { StyleSheet, View, Text, Image, Animated, useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../palette';

interface Props {
  onNextClick: () => void; // ฟังก์ชันจาก OnboardingScreen — เรียกตอนกด Let's begin
  animationController: React.RefObject<Animated.Value>; // ตัวเลขหลักของทั้งหน้า (อ่านผ่าน .current)
}

// โหลดรูปจากในโปรเจค — path นับจากไฟล์นี้: ออกจาก scenes/ -> ออกจาก src/ -> เข้า assets/onboarding/
const introImage = require('../../assets/onboarding/introduction_image.png');

export default function SplashScene({ onNextClick, animationController }: Props) {
  const window = useWindowDimensions(); // ขนาดจอจริง
  const insets = useSafeAreaInsets(); // ระยะขอบที่ห้ามวางของ (รอยบากบน / แถบ home ด้านล่าง)

  // เลื่อนทั้งหน้าขึ้นในแนวตั้ง:
  //   ตัวเลข 0         -> 0               (อยู่ที่เดิม เห็นเต็มจอ)
  //   ตัวเลข 0.2       -> -window.height  (ติดลบ = เลื่อนขึ้น เท่าความสูงจอพอดี = หายพ้นขอบบน)
  //   ตัวเลข 0.2 - 0.8 -> -window.height  (ค้างอยู่นอกจอ ไม่กลับมาอีก)
  // ใส่จุด 0.8 ไว้ท้ายเพื่อ "ล็อก" ค่าไว้ตลอดช่วงที่เหลือ
  const translateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [0, -window.height, -window.height],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: palette.background, transform: [{ translateY }] }]}>
      {/* ScrollView เผื่อจอเล็กแล้วรูป+ข้อความยาวเกินจอ จะได้เลื่อนดูได้ */}
      <ScrollView style={{ flexGrow: 0 }} alwaysBounceVertical={false}>
        <Image
          // กว้างเท่าจอ ส่วนความสูงให้คำนวณจากสัดส่วนรูปจริง (357 กว้าง : 470 สูง)
          // height: undefined + aspectRatio = รูปไม่บิด ไม่ว่าจอจะกว้างแค่ไหน
          style={{ width: window.width, height: undefined, aspectRatio: 357 / 470 }}
          source={introImage}
        />
        <Text style={styles.title}>Clearhead</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet,consectetur{'\n'}adipiscing elit,sed do eiusmod tempor{'\n'}incididunt ut labore
        </Text>
      </ScrollView>

      {/* paddingBottom = 8 + ความสูงแถบ home ของ iPhone รุ่นใหม่ กันปุ่มจมใต้แถบ */}
      <View style={[styles.footer, { paddingBottom: 8 + insets.bottom }]}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: 'powderblue' }} // เอฟเฟกต์คลื่นตอนกด (เฉพาะ Android)
          onPress={onNextClick}
        >
          {/* &apos; = เครื่องหมาย ' ใน JSX */}
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
    borderRadius: 29, // ครึ่งหนึ่งของความสูง (58 / 2) = ปลายปุ่มโค้งมนสนิท
    paddingVertical: 16,
    paddingHorizontal: 56,
    justifyContent: 'center',
  },
  buttonText: { fontSize: 18, color: palette.buttonText },
});
