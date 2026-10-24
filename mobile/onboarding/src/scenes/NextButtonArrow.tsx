// =============================================================================
// NextButtonArrow.tsx — ปุ่มลูกศรกลม ที่ "มอร์ฟ" เป็นปุ่มยาว "Sign Up"
// -----------------------------------------------------------------------------
// ตลอดฉาก Relax / Care / MoodDiary  -> เป็นปุ่มกลมมีแค่ลูกศร  >
// พอเลื่อนเข้าฉาก Welcome (0.6 -> 0.8) -> ค่อยๆ ยืดออกเป็นปุ่มยาว  [ Sign Up → ]
// ทำได้โดย animate หลายค่าพร้อมกัน: ความกว้าง, ความมนของมุม, และสลับไอคอน <-> ข้อความ
// =============================================================================
import { useRef } from 'react';
import { StyleSheet, Text, Animated, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../palette';

interface Props {
  onBtnPress: () => void;
  animationController: React.RefObject<Animated.Value>;
}

export default function NextButtonArrow({ onBtnPress, animationController }: Props) {
  // ---- ขั้นที่ 1: ย่อช่วงให้คิดง่าย ----
  // ปุ่มนี้สนใจแค่ช่วงสุดท้าย (0.6 -> 0.8) จึงแปลงเป็นตัวเลขใหม่ "arrowAnim" ที่:
  //   ตัวเลขหลัก 0 - 0.6  -> arrowAnim = 0  (ยังเป็นปุ่มกลม)
  //   ตัวเลขหลัก 0.6 -> 0.8 -> arrowAnim = 0 -> 1  (กำลังมอร์ฟ)
  // ค่าที่เหลือทั้งหมดด้านล่างคิดจาก arrowAnim ในช่วง 0 -> 1 ง่ายๆ (interpolate ซ้อน interpolate)
  const arrowAnim = useRef<Animated.AnimatedInterpolation<number>>(
    animationController.current.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8],
      outputRange: [0, 0, 0, 0, 1],
    }),
  );

  // ---- ขั้นที่ 2: สลับของข้างในปุ่ม (ลูกศร ออก / ข้อความ Sign Up เข้า) ----
  // ข้อความ "Sign Up": เริ่มอยู่ต่ำกว่าปุ่ม 36 px (ถูก overflow: hidden ตัดทิ้ง มองไม่เห็น)
  //   arrowAnim 0    -> 36  (อยู่ใต้ปุ่ม)
  //   arrowAnim 0.85 -> 0   (ลอยขึ้นมาตรงกลางปุ่ม)
  //   arrowAnim 1    -> 0   (อยู่นิ่ง)
  const textTranslateY = arrowAnim.current.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [36, 0, 0],
  });
  // ข้อความ "Sign Up" โปร่งใส 100% จนถึง 0.7 แล้วค่อยชัดขึ้นจนเต็มที่ 1
  // (รอให้ลูกศรหายไปก่อน ข้อความค่อยโผล่ จะได้ไม่ซ้อนกัน)
  const textOpacity = arrowAnim.current.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0, 1],
  });
  // ลูกศร: อยู่นิ่งถึง 0.35 แล้วลอยขึ้นไปเหนือปุ่ม 36 px ภายใน 0.85
  const iconTranslateY = arrowAnim.current.interpolate({
    inputRange: [0, 0.35, 0.85, 1],
    outputRange: [0, 0, -36, -36],
  });
  // ลูกศร: ชัด 100% ตอนเริ่ม ค่อยๆ จางจนหายที่ 0.7
  const iconOpacity = arrowAnim.current.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0, 0],
  });
  // สรุปจังหวะ: 0-0.35 ลูกศรนิ่ง | 0.35-0.7 ลูกศรลอยขึ้น+จาง | 0.7-1 ข้อความโผล่+ลอยขึ้นมา

  // ---- ขั้นที่ 3: ตัวปุ่มยืดออก ----
  // ความกว้าง: 58 (เท่าความสูง = จัตุรัส) -> 258 (ยาวพอใส่คำว่า Sign Up + ลูกศร)
  const widthAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [58, 258],
  });
  // ความมนของมุม: 40 -> 8
  //   40 มากกว่าครึ่งความสูง (58 / 2 = 29) -> มุมโค้งเต็มที่ = วงกลมสนิท
  //   8 -> มุมมนนิดๆ = สี่เหลี่ยมผืนผ้ามุมมน
  const radiusAnim = arrowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 8],
  });

  return (
    // overflow: 'hidden' สำคัญมาก — ตัดส่วนที่ล้นขอบปุ่มทิ้ง
    // ทำให้ลูกศรดูเหมือน "ลอยหายออกด้านบน" และข้อความ "ลอยเข้ามาจากด้านล่าง"
    <Animated.View
      style={[styles.container, { backgroundColor: palette.button, width: widthAnim, borderRadius: radiusAnim }]}
    >
      <Pressable style={styles.pressable} android_ripple={{ color: 'darkgrey' }} onPress={onBtnPress}>
        {/* ข้อความ Sign Up + ลูกศรเล็ก (โผล่ตอนฉากสุดท้าย) */}
        <Animated.View style={[styles.textRow, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}>
          <Text style={styles.text}>Sign Up</Text>
          <MaterialIcons name="arrow-forward" size={24} color={palette.buttonText} />
        </Animated.View>

        {/* ลูกศรกลางปุ่ม (เห็นตลอดฉาก Relax-MoodDiary)
            ⚠️ ห้ามใช้ Animated.createAnimatedComponent(MaterialIcons) แล้ว animate ไอคอนตรงๆ
            บน iPhone/Android จริงจะพังทันที (undefined is not a function / setNativeProps)
            วิธีที่ถูก: ห่อไอคอนด้วย Animated.View แล้ว animate ที่ View แทน (แบบนี้) */}
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
  // absolute + alignSelf center = ลูกศรอยู่กลางปุ่ม ซ้อนทับแถวข้อความได้
  icon: { position: 'absolute', alignSelf: 'center' },
});
