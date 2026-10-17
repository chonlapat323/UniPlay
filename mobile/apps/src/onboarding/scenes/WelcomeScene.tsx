import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { onboardingPalette as palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const welcomeImage = require('../../../assets/onboarding/welcome.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 350;

// สไลด์สุดท้าย (progress 0.6 -> 0.8) — เข้าจากขวาแล้วหยุดอยู่กับที่
export default function WelcomeScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [window.width, window.width, 0],
  });
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0],
  });
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
