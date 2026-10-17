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
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: Props) {
  const window = useWindowDimensions();
  const animationController = useRef(new Animated.Value(0));
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    return () => controller.removeListener(id);
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
      useNativeDriver: false, // NextButtonArrow animate width/borderRadius ซึ่ง native driver ไม่รองรับ
    }).start();
  }, []);

  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2);
    else if (value <= 0.2) playAnimation(0.4);
    else if (value <= 0.4) playAnimation(0.6);
    else if (value <= 0.6) playAnimation(0.8);
    else onFinish();
  }, [playAnimation, onFinish]);

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
