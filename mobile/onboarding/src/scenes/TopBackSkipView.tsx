// =============================================================================
// TopBackSkipView.tsx — แถบบนสุด: ปุ่มย้อนกลับ (ซ้าย) + ปุ่ม Skip (ขวา)
// -----------------------------------------------------------------------------
//   ตอนอยู่ Splash (0)   -> ซ่อนทั้งแถบไว้เหนือจอ (ยังไม่มีอะไรให้ย้อนกลับ)
//   ฉากเนื้อหา (0.2-0.6) -> เลื่อนลงมาให้เห็น
//   ฉาก Welcome (0.8)    -> ปุ่ม Skip เลื่อนออกขวาพ้นจอ (ไม่มีอะไรให้ข้ามแล้ว)
// =============================================================================
import { StyleSheet, Text, Animated, Pressable, Platform, StatusBar as RNStatusBar } from 'react-native';
// StatusBar as RNStatusBar = เปลี่ยนชื่อตอน import กันชนกับ StatusBar ของ expo-status-bar
// (ตัวนี้ใช้อ่านความสูง status bar ของ Android ผ่าน .currentHeight)
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../palette';

interface Props {
  onBackClick: () => void;
  onSkipClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

export default function TopBackSkipView({ onBackClick, onSkipClick, animationController }: Props) {
  const { top } = useSafeAreaInsets();
  // ระยะห่างจากขอบบนให้พ้น status bar / รอยบาก:
  //   iOS     -> ถาม safe area (top) ได้ค่าแม่นยำตามรุ่นเครื่อง
  //   Android -> ใช้ความสูง status bar (ถ้าได้ undefined ให้ใช้ 0 แทน ด้วย ?? 0)
  const marginTop = Platform.OS === 'ios' ? top : RNStatusBar.currentHeight ?? 0;

  // ซ่อนแถบไว้เหนือจอตอนอยู่ Splash:
  //   ต้องดันขึ้นไป = ความสูงแถบ (58) + ระยะ marginTop  ถึงจะพ้นจอพอดี (ติดลบ = เลื่อนขึ้น)
  //   ตัวเลข 0 -> -(58 + marginTop) (ซ่อน), 0.2 ขึ้นไป -> 0 (เห็น)
  const headerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [-(58 + marginTop), 0, 0, 0, 0],
  });

  // ปุ่ม Skip: อยู่ที่เดิมตลอด แล้วเลื่อนไปทางขวา 80 px ในฉากสุดท้าย (พ้นขอบจอขวาพอดี)
  const skipTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, 0, 0, 80],
  });

  return (
    <Animated.View style={[styles.container, { marginTop, transform: [{ translateY: headerTranslateY }] }]}>
      {/* ปุ่มย้อนกลับ — ไอคอนอยู่ใน Pressable ธรรมดา ไม่ได้ animate ไอคอนตรงๆ (ปลอดภัย) */}
      <Pressable
        style={styles.backBtn}
        // borderless + radius 28 = คลื่นตอนกดเป็นวงกลมรอบไอคอน (Android)
        android_ripple={{ color: 'darkgrey', borderless: true, radius: 28 }}
        onPress={onBackClick}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color={palette.text} />
      </Pressable>

      {/* ปุ่ม Skip — ห่อ Animated.View เพื่อเลื่อนออกตอนฉากสุดท้าย */}
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
    flexDirection: 'row', // วางปุ่มเรียงแนวนอน
    alignItems: 'center',
    justifyContent: 'space-between', // ปุ่มย้อนกลับชิดซ้าย, Skip ชิดขวา
    paddingLeft: 8,
    paddingRight: 16,
    position: 'absolute', // ลอยทับฉาก ยึดขอบบน
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  skipBtn: { paddingVertical: 8, paddingHorizontal: 4 },
});
