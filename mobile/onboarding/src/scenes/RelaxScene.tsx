import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const relaxImage = require('../../assets/onboarding/relax_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

// สไลด์ที่ 1 (progress 0.2 -> 0.4 คือช่วงที่เห็นเต็มจอ)
export default function RelaxScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const titleTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [-(26 * 2), 0, 0],
  });
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -window.width * 2, 0, 0],
  });
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -(IMAGE_WIDTH * 4), 0, 0],
  });
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
  container: { alignItems: 'center', paddingBottom: 100 },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
});
