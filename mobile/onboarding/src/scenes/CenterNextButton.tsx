// =============================================================================
// CenterNextButton.tsx — ส่วนล่างของจอ: จุดบอกตำแหน่ง (dot) + ปุ่มลูกศร + ข้อความ Login
// -----------------------------------------------------------------------------
//   ตอนอยู่ Splash (0)          -> ซ่อนทั้งก้อนไว้ใต้จอ (Splash มีปุ่มของตัวเองแล้ว)
//   ฉาก Relax-MoodDiary (0.2-0.6) -> เห็นจุด 4 จุด + ปุ่มลูกศร
//   ฉาก Welcome (0.8)            -> จุดหายไป, ปุ่มมอร์ฟเป็น Sign Up, ข้อความ Login โผล่
// =============================================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../palette';
import NextButtonArrow from './NextButtonArrow';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

interface DotProps {
  index: number; // จุดนี้คือจุดที่เท่าไหร่ (0-3)
  selectedIndex: number; // ตอนนี้ฉากไหนถูกเลือกอยู่ (0-3)
}

// ---- จุด 1 จุด ที่เปลี่ยนสีแบบค่อยๆ ไล่ (ไม่ใช่สลับทันที) ----
function DotIndicator({ index, selectedIndex }: DotProps) {
  // แต่ละจุดมีตัวเลข animation "ของตัวเอง" แยกจาก animationController
  //   0 = สีจาง (ไม่ได้เลือก), 1 = สีเข้ม (ถูกเลือก)
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ทุกครั้งที่ selectedIndex เปลี่ยน: จุดที่ถูกเลือกวิ่งไป 1, จุดอื่นวิ่งกลับ 0 (ใช้เวลา 0.48 วิ)
    Animated.timing(progress, {
      toValue: index === selectedIndex ? 1 : 0,
      duration: 480,
      useNativeDriver: false, // ต้อง false เพราะ animate สีพื้นหลัง (native driver ทำไม่ได้)
    }).start();
  }, [selectedIndex, index, progress]);

  // interpolate "สี" ได้ด้วย — ครึ่งทางจะได้สีกลางๆ ระหว่างเทาอ่อนกับกรมท่าให้อัตโนมัติ
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.dotInactive, palette.dotActive],
  });

  return <Animated.View style={[styles.dot, { backgroundColor }]} />;
}

export default function CenterNextButton({ onNextClick, animationController }: Props) {
  // ความโปร่งใสของแถวจุด (0 = ซ่อน, 1 = เห็น) — แยกจากตัวเลขหลัก เพื่อให้ fade นุ่มนวลของตัวเอง
  const opacity = useRef(new Animated.Value(0)).current;
  // จำไว้ว่าตอนนี้แถวจุด "โชว์อยู่ไหม" (0/1) จะได้สั่ง fade เฉพาะตอนสถานะเปลี่ยน ไม่ใช่สั่งซ้ำทุกเฟรม
  const currentOpacity = useRef(0);
  // จุดที่เท่าไหร่กำลังเข้มอยู่ (ใช้ useState เพราะต้อง render ใหม่ให้จุดเปลี่ยนสี)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { bottom } = useSafeAreaInsets(); // ความสูงแถบ home ของ iPhone
  const dots = useMemo(() => [0, 1, 2, 3], []); // 4 จุด = 4 ฉากเนื้อหา

  useEffect(() => {
    // ฟังตัวเลขหลักทุกครั้งที่ขยับ แล้วตัดสินใจ 2 เรื่อง:
    const id = animationController.current.addListener(({ value }) => {
      // (1) แถวจุดควรโชว์ไหม: โชว์เฉพาะช่วงฉากเนื้อหา 0.2 - 0.6
      //     < 0.2 = ยังอยู่ Splash, > 0.6 = เข้าฉาก Welcome (ปุ่มกลายเป็น Sign Up แล้ว ไม่ต้องบอกตำแหน่ง)
      const isVisible = value >= 0.2 && value <= 0.6;
      // สั่ง fade เฉพาะตอน "สถานะเปลี่ยน" (ซ่อน->โชว์ หรือ โชว์->ซ่อน) ไม่งั้นจะสั่งซ้ำ 60 ครั้ง/วินาที
      if ((isVisible && currentOpacity.current === 0) || (!isVisible && currentOpacity.current === 1)) {
        // opacity เป็น style ที่ native driver รองรับ จึงใช้ true ได้ (ลื่นกว่า)
        Animated.timing(opacity, { toValue: isVisible ? 1 : 0, duration: 480, useNativeDriver: true }).start();
        currentOpacity.current = isVisible ? 1 : 0;
      }

      // (2) จุดไหนควรเข้ม: แปลงตัวเลขต่อเนื่อง (0-0.8) เป็นเลขจุด (0-3)
      //     จุดตัด 0.1 / 0.3 / 0.5 / 0.7 คือ "กึ่งกลางระหว่างฉาก"
      //     เช่น เลื่อนจาก Relax (0.2) ไป Care (0.4) พอเกิน 0.3 (ครึ่งทาง) จุดที่ 2 ก็เข้มทันที
      if (value >= 0.7) setSelectedIndex(3); // Welcome
      else if (value >= 0.5) setSelectedIndex(2); // MoodDiary
      else if (value >= 0.3) setSelectedIndex(1); // Care
      else if (value >= 0.1) setSelectedIndex(0); // Relax
    });
    return () => animationController.current.removeListener(id); // เก็บกวาด listener
  }, [animationController, opacity]);

  // ซ่อนทั้งก้อนไว้ใต้จอตอนอยู่ Splash:
  //   96 = ความสูงโดยประมาณของส่วนนี้ (จุด + ปุ่ม + ระยะห่าง), x 5 = ดันลงไปไกลพอแน่ใจว่าพ้นจอ
  //   ตัวเลข 0 -> 480 (ใต้จอ), 0.2 ขึ้นไป -> 0 (อยู่ที่ตำแหน่งจริง)
  const containerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [96 * 5, 0, 0, 0, 0],
  });

  // ข้อความ "Already have an account? Login" ซ่อนใต้จอ 150 px ตลอด โผล่ขึ้นมาเฉพาะฉาก Welcome
  //   0 - 0.6 -> 150 (ซ่อน), 0.6 -> 0.8 -> 150 ลดเหลือ 0 (ลอยขึ้นมา)
  const loginTextTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [150, 150, 150, 150, 0],
  });

  return (
    // paddingBottom = 16 + แถบ home กันปุ่มจมใต้แถบ
    <Animated.View
      style={[styles.container, { paddingBottom: 16 + bottom, transform: [{ translateY: containerTranslateY }] }]}
    >
      {/* แถวจุด 4 จุด */}
      <Animated.View style={[styles.dotsRow, { opacity }]}>
        {dots.map((item) => (
          <DotIndicator key={item} index={item} selectedIndex={selectedIndex} />
        ))}
      </Animated.View>

      {/* ปุ่มลูกศร (มอร์ฟเป็น Sign Up ฉากสุดท้าย) */}
      <NextButtonArrow onBtnPress={onNextClick} animationController={animationController} />

      {/* ข้อความตกแต่ง (กดไม่ได้ ตามต้นฉบับ) */}
      <Animated.View style={[styles.loginRow, { transform: [{ translateY: loginTextTranslateY }] }]}>
        <Text style={{ color: palette.textMuted }}>Already have an account? </Text>
        <Text style={styles.loginText}>Login</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ยึดติดขอบล่างของจอ กว้างเต็มจอ
  container: { alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  dotsRow: { flexDirection: 'row', marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 }, // borderRadius 5 = ครึ่งของ 10 = วงกลม
  loginRow: { flexDirection: 'row', marginTop: 8 },
  loginText: { color: palette.button, fontSize: 16, fontWeight: '700' },
});
