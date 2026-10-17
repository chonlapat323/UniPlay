import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/OnboardingScreen';
import { palette } from './src/palette';

export default function App() {
  const [finished, setFinished] = useState(false);
  // key เปลี่ยนทุกครั้งที่กด "ดูอีกครั้ง" -> React สร้าง OnboardingScreen ใหม่ทั้งก้อน animation เริ่มที่ 0 ใหม่
  const [runId, setRunId] = useState(0);

  function replay() {
    setRunId((id) => id + 1);
    setFinished(false);
  }

  return (
    <SafeAreaProvider>
      {finished ? (
        <View style={[styles.done, { backgroundColor: palette.background }]}>
          <Text style={styles.doneTitle}>จบ Onboarding แล้ว 🎉</Text>
          <Pressable style={styles.replayButton} onPress={replay}>
            <Text style={styles.replayText}>ดูอีกครั้ง</Text>
          </Pressable>
        </View>
      ) : (
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
