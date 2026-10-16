import { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput, HelperText, Divider } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import ConfirmDialog from '../components/ConfirmDialog';

type Props = NativeStackScreenProps<RootStackParamList, 'UiKit'>;

// หน้านี้สร้างไว้เพื่อ "สอนใช้" component ของ React Native Paper โดยเฉพาะ
// ไม่เรียก API จริง แค่โชว์ทุก variant/state ให้เห็นเทียบกันในหน้าเดียว
export default function UiKitScreen({ navigation }: Props) {
  const [sampleText, setSampleText] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  function showPreview(name: string) {
    Alert.alert('กดปุ่มนี้แล้วจะเกิดอะไรขึ้น', `ตัวอย่าง: ${name} ถูกกด — นี่คือ popup ที่โค้ดจริงสั่งเปิด`);
  }

  function handleLoadingDemo() {
    setLoadingDemo(true);
    setTimeout(() => {
      setLoadingDemo(false);
      showPreview('Loading Button (จำลองรอ 1.5 วิ แล้วเด้ง popup)');
    }, 1500);
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="UI Kit" onBack={() => navigation.navigate('Home')} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium">UI Kit</Text>
      <Text variant="bodyMedium" style={styles.pageSubtitle}>
        รวม component จาก React Native Paper ที่ใช้ซ้ำทั้งแอป — ดูคู่กับ MOBILE_UX_GUIDE.md
      </Text>

      {/* ---------- Button ---------- */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Button
      </Text>

      <Text variant="bodySmall" style={styles.label}>
        mode=&quot;contained&quot; (ปุ่มหลัก) — ลองกดดูได้เลย
      </Text>
      <Button mode="contained" onPress={() => showPreview('Contained Button')} style={styles.sample}>
        Contained Button
      </Button>

      <Text variant="bodySmall" style={styles.label}>
        mode=&quot;outlined&quot; (ปุ่มรอง) — ลองกดดูได้เลย
      </Text>
      <Button mode="outlined" onPress={() => showPreview('Outlined Button')} style={styles.sample}>
        Outlined Button
      </Button>

      <Text variant="bodySmall" style={styles.label}>
        mode=&quot;text&quot; (ปุ่มลิงก์) — ลองกดดูได้เลย
      </Text>
      <Button mode="text" onPress={() => showPreview('Text Button')} style={styles.sample}>
        Text Button
      </Button>

      <Text variant="bodySmall" style={styles.label}>
        loading=&#123;true&#125; — กดแล้วปุ่มจะหมุน 1.5 วิ (กดซ้ำไม่ได้ระหว่างนั้น) แล้วเด้ง popup
      </Text>
      <Button
        mode="contained"
        loading={loadingDemo}
        disabled={loadingDemo}
        onPress={handleLoadingDemo}
        style={styles.sample}
      >
        กดเพื่อดูสถานะ Loading
      </Button>

      <Text variant="bodySmall" style={styles.label}>
        disabled=&#123;true&#125; (กดไม่ได้เลย — ลองกดดู ไม่มีอะไรเกิดขึ้น)
      </Text>
      <Button mode="contained" disabled onPress={() => showPreview('Disabled Button')} style={styles.sample}>
        Disabled Button
      </Button>

      <Divider style={styles.divider} />

      {/* ---------- TextInput ---------- */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        TextInput
      </Text>

      <Text variant="bodySmall" style={styles.label}>
        Default (label ลอยอัตโนมัติเมื่อพิมพ์)
      </Text>
      <TextInput
        label="Email"
        placeholder="student1@uniplay.test"
        value={sampleText}
        onChangeText={setSampleText}
        mode="outlined"
        style={styles.sample}
      />

      <Text variant="bodySmall" style={styles.label}>
        error=&#123;true&#125; (ขอบ/label เปลี่ยนเป็นสีแดง) + HelperText แสดงข้อความ
      </Text>
      <TextInput
        label="Email"
        placeholder="student1@uniplay.test"
        value={sampleText}
        onChangeText={setSampleText}
        mode="outlined"
        error
        style={styles.sample}
      />
      <HelperText type="error" visible>
        รูปแบบอีเมลไม่ถูกต้อง
      </HelperText>

      <Text variant="bodySmall" style={styles.label}>
        secureTextEntry (สำหรับ password)
      </Text>
      <TextInput label="Password" placeholder="********" secureTextEntry mode="outlined" style={styles.sample} />

      <Divider style={styles.divider} />

      {/* ---------- Dialog (Confirm Modal) ---------- */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Dialog (Confirm Modal)
      </Text>

      <Text variant="bodySmall" style={styles.label}>
        ใช้ถามผู้ใช้ก่อนทำสิ่งที่ย้อนกลับยาก (เช่น logout, ลบข้อมูล) — ลองกดดูได้เลย
      </Text>
      <Button mode="contained" onPress={() => setConfirmDialogVisible(true)} style={styles.sample}>
        เปิด Confirm Dialog
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        กลับหน้าแรก
      </Button>
      </ScrollView>

      <AppFooter />

      <ConfirmDialog
        visible={confirmDialogVisible}
        title="ตัวอย่าง Confirm Dialog"
        message="นี่คือ popup ยืนยันตัวอย่าง — กด 'ยืนยัน' หรือ 'ยกเลิก' ดูได้เลย ทั้งคู่แค่ปิด popup นี้ ไม่มีผลอะไรจริง"
        onConfirm={() => setConfirmDialogVisible(false)}
        onCancel={() => setConfirmDialogVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 32 },
  pageSubtitle: { color: '#4b5563', marginBottom: 24 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  label: { color: '#4b5563', marginBottom: 4 },
  sample: { marginBottom: 16 },
  divider: { marginVertical: 8 },
  backButton: { marginTop: 24 },
});
