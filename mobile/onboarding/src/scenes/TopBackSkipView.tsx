import { StyleSheet, Text, Animated, Pressable, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../palette';

interface Props {
  onBackClick: () => void;
  onSkipClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

// แถบบนสุด: ปุ่มย้อนกลับ (ซ่อนอยู่ตอนอยู่หน้า Splash) + ปุ่ม "Skip" (เลื่อนตัวเองออกไปตอนถึงสไลด์สุดท้ายเพราะไม่มีอะไรให้ข้ามต่อแล้ว)
export default function TopBackSkipView({ onBackClick, onSkipClick, animationController }: Props) {
  const { top } = useSafeAreaInsets();
  const marginTop = Platform.OS === 'ios' ? top : RNStatusBar.currentHeight ?? 0;

  const headerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [-(58 + marginTop), 0, 0, 0, 0],
  });
  const skipTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, 0, 0, 80],
  });

  return (
    <Animated.View style={[styles.container, { marginTop, transform: [{ translateY: headerTranslateY }] }]}>
      <Pressable
        style={styles.backBtn}
        android_ripple={{ color: 'darkgrey', borderless: true, radius: 28 }}
        onPress={onBackClick}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color={palette.text} />
      </Pressable>

      <Animated.View style={{ transform: [{ translateX: skipTranslateX }] }}>
        <Pressable
          style={styles.skipBtn}
          android_ripple={{ color: 'darkgrey', borderless: true, radius: 28 }}
          onPress={onSkipClick}
        >
          <Text style={{ color: palette.text }}>Skip</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  skipBtn: { paddingVertical: 8, paddingHorizontal: 4 },
});
