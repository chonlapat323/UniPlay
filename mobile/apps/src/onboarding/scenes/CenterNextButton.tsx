import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onboardingPalette as palette } from '../palette';
import NextButtonArrow from './NextButtonArrow';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

interface DotProps {
  index: number;
  selectedIndex: number;
}

function DotIndicator({ index, selectedIndex }: DotProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: index === selectedIndex ? 1 : 0,
      duration: 480,
      useNativeDriver: false,
    }).start();
  }, [selectedIndex, index, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.dotInactive, palette.dotActive],
  });

  return <Animated.View style={[styles.dot, { backgroundColor }]} />;
}

// กลุ่มปุ่ม "ถัดไป" ตรงกลางล่างจอ: dot บอกตำแหน่งสไลด์ + ปุ่มลูกศร (ที่จะมอร์ฟเป็นปุ่ม "Sign Up" ในสไลด์สุดท้าย)
// ซ่อนตัวเองตอนอยู่หน้า Splash (ยังไม่เลื่อน) เห็นเฉพาะช่วงสไลด์เนื้อหา
export default function CenterNextButton({ onNextClick, animationController }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const currentOpacity = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { bottom } = useSafeAreaInsets();
  const dots = useMemo(() => [0, 1, 2, 3], []);

  useEffect(() => {
    const id = animationController.current.addListener(({ value }) => {
      const isVisible = value >= 0.2 && value <= 0.6;
      if ((isVisible && currentOpacity.current === 0) || (!isVisible && currentOpacity.current === 1)) {
        Animated.timing(opacity, { toValue: isVisible ? 1 : 0, duration: 480, useNativeDriver: true }).start();
        currentOpacity.current = isVisible ? 1 : 0;
      }

      if (value >= 0.7) setSelectedIndex(3);
      else if (value >= 0.5) setSelectedIndex(2);
      else if (value >= 0.3) setSelectedIndex(1);
      else if (value >= 0.1) setSelectedIndex(0);
    });
    return () => animationController.current.removeListener(id);
  }, [animationController, opacity]);

  const containerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [96 * 5, 0, 0, 0, 0],
  });
  const loginTextTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [150, 150, 150, 150, 0],
  });

  return (
    <Animated.View
      style={[styles.container, { paddingBottom: 16 + bottom, transform: [{ translateY: containerTranslateY }] }]}
    >
      <Animated.View style={[styles.dotsRow, { opacity }]}>
        {dots.map((item) => (
          <DotIndicator key={item} index={item} selectedIndex={selectedIndex} />
        ))}
      </Animated.View>

      <NextButtonArrow onBtnPress={onNextClick} animationController={animationController} />

      <Animated.View style={[styles.loginRow, { transform: [{ translateY: loginTextTranslateY }] }]}>
        <Text style={{ color: palette.textMuted }}>Already have an account? </Text>
        <Text style={styles.loginText}>Login</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  dotsRow: { flexDirection: 'row', marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  loginRow: { flexDirection: 'row', marginTop: 8 },
  loginText: { color: palette.button, fontSize: 16, fontWeight: '700' },
});
