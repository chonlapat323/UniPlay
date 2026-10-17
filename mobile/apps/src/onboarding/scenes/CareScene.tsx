import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { onboardingPalette as palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const careImage = require('../../../assets/onboarding/care_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

// สไลด์ที่ 2 (progress 0.4 -> 0.6) — เข้าจากขวา ออกทางซ้าย
export default function CareScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width, -window.width],
  });
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0, -(26 * 2), -(26 * 2)],
  });
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
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
});
