// =============================================================================
// App.tsx — จุดเริ่มต้นของแอป (ไฟล์แรกที่ Expo เปิด)
// -----------------------------------------------------------------------------
// หน้าที่ของไฟล์นี้มีแค่ 2 อย่าง:
//   1) ครอบทั้งแอปด้วย <SafeAreaProvider> (จำเป็น — ดูคำอธิบายด้านล่าง)
//   2) เลือกว่าจะโชว์ "หน้า Onboarding" หรือ "หน้าจบแล้ว"
// ตัว animation จริงไม่ได้อยู่ที่นี่ แต่อยู่ใน src/OnboardingScreen.tsx และ src/scenes/*
// =============================================================================
import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/OnboardingScreen';
import { palette } from './src/palette';

export default function App() {
  // false = ยังดู Onboarding อยู่ (ค่าเริ่มต้น), true = กด Sign Up จบแล้ว
  const [finished, setFinished] = useState(false);

  // ตัวนับรอบการเล่น — ใช้เป็น key ของ OnboardingScreen
  // key เปลี่ยนเมื่อไหร่ React จะ "ทิ้งของเก่าแล้วสร้างใหม่ทั้งก้อน"
  // ทำให้ animation กลับไปเริ่มที่ 0 ใหม่ (เหมือนเปิดแอปครั้งแรก) โดยไม่ต้อง reload แอป
  const [runId, setRunId] = useState(0);

  function replay() {
    setRunId((id) => id + 1); // 0 -> 1 -> 2 ... ทุกครั้งที่กด "ดูอีกครั้ง"
    setFinished(false); // กลับไปโชว์หน้า Onboarding
  }

  return (
    // SafeAreaProvider ต้องอยู่นอกสุดเสมอ: ฉากต่างๆ เรียก useSafeAreaInsets()
    // เพื่อถามระยะ "รอยบาก/แถบล่าง" ของจอ ถ้าไม่มีตัวนี้ครอบ แอปจะพังบนมือถือจริง
    <SafeAreaProvider>
      {finished ? (
        // ---- หน้า "จบแล้ว" (หน้านิ่ง ไม่มี animation) ----
        <View style={[styles.done, { backgroundColor: palette.background }]}>
          <Text style={styles.doneTitle}>จบ Onboarding แล้ว 🎉</Text>
          <Pressable style={styles.replayButton} onPress={replay}>
            <Text style={styles.replayText}>ดูอีกครั้ง</Text>
          </Pressable>
        </View>
      ) : (
        // ---- หน้า Onboarding (animation ทั้งหมดอยู่ในนี้) ----
        // onFinish: ฟังก์ชันที่ OnboardingScreen จะเรียกเมื่อผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
        <OnboardingScreen key={runId} onFinish={() => setFinished(true)} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  doneTitle: { fontSize: 22, fontWeight: '700', color: palette.text },
  replayButton: { backgroundColor: palette.button, borderRadius: 29, paddingVertical: 16, paddingHorizontal: 40 },
  replayText: { color: palette.buttonText, fontSize: 18 },
});
