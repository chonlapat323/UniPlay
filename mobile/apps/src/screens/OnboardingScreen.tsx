import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { markOnboardingSeen } from '../lib/onboarding';
import { onboardingPalette as palette } from '../onboarding/palette';
import SplashScene from '../onboarding/scenes/SplashScene';
import RelaxScene from '../onboarding/scenes/RelaxScene';
import CareScene from '../onboarding/scenes/CareScene';
import MoodDiaryScene from '../onboarding/scenes/MoodDiaryScene';
import WelcomeScene from '../onboarding/scenes/WelcomeScene';
import TopBackSkipView from '../onboarding/scenes/TopBackSkipView';
import CenterNextButton from '../onboarding/scenes/CenterNextButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Onboarding แบบ "scrub เดียวขับเคลื่อนทุกอย่าง" — animationController วิ่งจาก 0 ถึง 0.8 เป็น 5 ช่วง (ละ 0.2)
// แต่ละ scene อ่านค่าตัวเดียวกันนี้ไป interpolate เอาเองว่าตัวเองควรอยู่ตรงไหน/โชว์ตอนไหน
// พอร์ตมาจาก https://github.com/Aashu-Dubey/React-Native-UI-Templates/tree/main/src/introduction_animation แบบเกือบเป๊ะ
// (ภาพประกอบ/สี/ข้อความเป็นของต้นฉบับจริง — ดูเหตุผลที่ไม่ใช้ธีมของแอปใน src/onboarding/palette.ts)
export default function OnboardingScreen({ navigation }: Props) {
  const window = useWindowDimensions();
  const animationController = useRef(new Animated.Value(0));
  const currentValue = useRef(0);

  useEffect(() => {
    const id = animationController.current.addListener(({ value }) => {
      currentValue.current = value;
    });
    return () => animationController.current.removeListener(id);
  }, []);

  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue,
      duration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      useNativeDriver: false, // ปิดเพราะ NextButtonArrow animate ค่า width/borderRadius ซึ่ง native driver ไม่รองรับ
    }).start();
  }, []);

  async function finishOnboarding() {
    await markOnboardingSeen();
    navigation.replace('Home');
  }

  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2);
    else if (value <= 0.2) playAnimation(0.4);
    else if (value <= 0.4) playAnimation(0.6);
    else if (value <= 0.6) playAnimation(0.8);
    else finishOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAnimation]);

  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0);
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2);
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4);
    else if (value >= 0.8) playAnimation(0.6);
  }, [playAnimation]);

  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
        <CareScene animationController={animationController} />
        <MoodDiaryScene animationController={animationController} />
        <WelcomeScene animationController={animationController} />
      </Animated.View>

      <TopBackSkipView onBackClick={onBackClick} onSkipClick={onSkipClick} animationController={animationController} />

      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
