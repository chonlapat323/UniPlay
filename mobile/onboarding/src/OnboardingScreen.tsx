// =============================================================================
// OnboardingScreen.tsx — "ผู้กำกับ" ของทั้งหน้า
// -----------------------------------------------------------------------------
// ไฟล์นี้ไม่มีรูป/ข้อความเองเลย มีแค่:
//   1) animationController — ตัวเลขตัวเดียวที่คุมทุกฉาก (วิ่งจาก 0 ถึง 0.8)
//   2) ฟังก์ชันของปุ่ม next / back / skip (สั่งให้ตัวเลขวิ่งไปค่าใหม่)
//   3) เอาทุกฉากมาวางซ้อนกัน แล้วส่ง animationController ให้ทุกฉากอ่าน
//
// ไทม์ไลน์ของตัวเลข (ช่วงละ 0.2 = 1 ฉาก):
//   0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
//   Splash    Relax       Care        MoodDiary   Welcome
// =============================================================================
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';
import RelaxScene from './scenes/RelaxScene';
import CareScene from './scenes/CareScene';
import MoodDiaryScene from './scenes/MoodDiaryScene';
import WelcomeScene from './scenes/WelcomeScene';
import TopBackSkipView from './scenes/TopBackSkipView';
import CenterNextButton from './scenes/CenterNextButton';

interface Props {
  onFinish: () => void; // App.tsx ส่งมา — เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
}

export default function OnboardingScreen({ onFinish }: Props) {
  // ขนาดจอจริงของเครื่อง (กว้าง/สูง) — ใช้เป็นระยะ "เลื่อนพ้นจอพอดี"
  const window = useWindowDimensions();

  // ตัวเลขหลักของทั้งหน้า เริ่มที่ 0 (= อยู่หน้า Splash)
  // ใช้ useRef เพื่อให้เป็น "ตัวเดิม" ตลอด ถ้าสร้างใหม่ทุก render animation จะรีเซ็ตกลับ 0
  const animationController = useRef(new Animated.Value(0));

  // Animated.Value อ่านค่าปัจจุบันตรงๆ ไม่ได้ จึงต้องจดค่าล่าสุดเก็บไว้ที่นี่
  // (ใช้ useRef ไม่ใช่ useState เพราะค่าเปลี่ยน ~60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก)
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    // ทุกครั้งที่ตัวเลขขยับ ให้จดค่าใหม่ลง currentValue
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    // เก็บกวาดตอนหน้านี้ถูกปิด — ถอด listener ออก กัน memory leak
    return () => controller.removeListener(id);
  }, []); // [] = ตั้ง listener ครั้งเดียวตอนหน้าขึ้นจอ

  // ยก "กลุ่มฉากเนื้อหา" (Relax, Care, MoodDiary, Welcome) ทั้งก้อนขึ้นมาจากใต้จอ
  //   ตัวเลข 0   -> translateY = window.height  (อยู่ใต้จอพอดี มองไม่เห็น)
  //   ตัวเลข 0.2 -> translateY = 0              (ขึ้นมาอยู่กลางจอแล้ว)
  //   0.4 - 0.8  -> 0 ตลอด                      (อยู่นิ่ง การสลับฉากภายในกลุ่มแต่ละฉากจัดการเอง)
  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  // ฟังก์ชันกลาง: สั่งให้ตัวเลขวิ่งจากค่าปัจจุบันไปที่ toValue แบบนุ่มนวล
  // ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ
  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue, // ค่าปลายทาง เช่น 0.4
      duration, // ใช้เวลากี่มิลลิวินาที (1600 = 1.6 วินาที)
      // เส้นโค้งความเร็วมาตรฐานของ Material Design: ออกตัวเร็ว แล้วค่อยๆ ชะลอตอนจบ
      // (ตัวเลข 4 ตัวคือจุดควบคุมของเส้นโค้ง Bézier ไม่ต้องจำ ใช้ค่านี้ได้เลย)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      // ต้องเป็น false: NextButtonArrow animate ค่า width/borderRadius และ dot animate สี
      // ซึ่ง native driver ทำไม่ได้ (ถ้าตั้ง true จะ error)
      useNativeDriver: false,
    }).start();
  }, []);

  // ปุ่ม "ถัดไป" — ดูว่าตอนนี้อยู่ฉากไหน แล้วเลื่อนไปฉากถัดไป (+0.2)
  // ใช้ <= แทน === เพราะถ้าผู้ใช้กดตอน animation ยังวิ่งไม่จบ ค่าอาจเป็นทศนิยมระหว่างช่วง เช่น 0.13
  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2); // Splash     -> Relax
    else if (value <= 0.2) playAnimation(0.4); // Relax      -> Care
    else if (value <= 0.4) playAnimation(0.6); // Care       -> MoodDiary
    else if (value <= 0.6) playAnimation(0.8); // MoodDiary  -> Welcome
    else onFinish(); // อยู่ Welcome แล้ว (> 0.6) -> จบ Onboarding
  }, [playAnimation, onFinish]);

  // ปุ่ม "ย้อนกลับ" — กลับกันกับปุ่มถัดไป (-0.2)
  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0); // Relax      -> Splash
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2); // Care       -> Relax
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4); // MoodDiary  -> Care
    else if (value >= 0.8) playAnimation(0.6); // Welcome    -> MoodDiary
  }, [playAnimation]);

  // ปุ่ม "Skip" — กระโดดไปฉากสุดท้าย (0.8) เลย ใช้เวลาสั้นกว่า (1.2 วิ)
  // หมายเหตุ: ไม่ได้ปิด Onboarding ทันที ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ)
  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    // ลำดับใน JSX สำคัญ: ตัวที่เขียน "ทีหลัง" จะวาด "ทับ" ตัวที่เขียนก่อน
    // ปุ่ม (TopBackSkipView, CenterNextButton) จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับจนกดไม่ได้
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      {/* หน้าแรกสุด — เลื่อนขึ้นหายไปตอนกด Let's begin */}
      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      {/* กลุ่มฉากเนื้อหา — ทั้ง 4 ฉากวางซ้อนกันตำแหน่งเดียวกัน แต่ละฉากเลื่อนเข้า/ออกด้านข้างเอง */}
      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
        <CareScene animationController={animationController} />
        <MoodDiaryScene animationController={animationController} />
        <WelcomeScene animationController={animationController} />
      </Animated.View>

      {/* แถบบน: ปุ่มย้อนกลับ + Skip */}
      <TopBackSkipView onBackClick={onBackClick} onSkipClick={onSkipClick} animationController={animationController} />

      {/* ส่วนล่าง: จุดบอกตำแหน่ง + ปุ่มลูกศร (มอร์ฟเป็น Sign Up) */}
      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // position absolute + top/left/right/bottom: 0 = ขยายเต็มจอ ซ้อนทับ Splash อยู่
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
