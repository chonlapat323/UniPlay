import { useRef } from 'react';
import { StyleSheet, Text, Animated, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../palette';

interface Props {
  onBtnPress: () => void;
  animationController: React.RefObject<Animated.Value>;
}

// ปุ่มกลมที่มีแค่ลูกศร ค่อยๆ "ยืดขยาย" กลายเป็นปุ่มยาว "Sign Up" พร้อมข้อความ ตอนเลื่อนถึงสไลด์สุดท้าย
export default function NextButtonArrow({ onBtnPress, animationController }: Props) {
  const arrowAnim = useRef<Animated.AnimatedInterpolation<number>>(
    animationController.current.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8],
      outputRange: [0, 0, 0, 0, 1],
    }),
  );

  const textTranslateY = arrowAnim.current.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [36, 0, 0],
  });
  const textOpacity = arrowAnim.current.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0, 1],
  });
  const iconTranslateY = arrowAnim.current.interpolate({
    inputRange: [0, 0.35, 0.85, 1],
    outputRange: [0, 0, -36, -36],
  });
  const iconOpacity = arrowAnim.current.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0, 0],
  });

  const widthAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [58, 258],
  });
  const radiusAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 8],
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: palette.button, width: widthAnim, borderRadius: radiusAnim }]}
    >
      <Pressable style={styles.pressable} android_ripple={{ color: 'darkgrey' }} onPress={onBtnPress}>
        <Animated.View style={[styles.textRow, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}>
          <Text style={styles.text}>Sign Up</Text>
          <MaterialIcons name="arrow-forward" size={24} color={palette.buttonText} />
        </Animated.View>

        <Animated.View style={[styles.icon, { opacity: iconOpacity, transform: [{ translateY: iconTranslateY }] }]}>
          <MaterialIcons name="arrow-forward-ios" size={24} color={palette.buttonText} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { height: 58, overflow: 'hidden' },
  pressable: { flex: 1, justifyContent: 'center' },
  textRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  text: { fontSize: 18, color: palette.buttonText },
  icon: { position: 'absolute', alignSelf: 'center' },
});
