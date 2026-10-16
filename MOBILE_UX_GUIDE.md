# คู่มือจัดการ UX/UI แบบเป็นระบบใน Mobile App (React Native Paper)

เอกสารนี้สอนวิธี **รีแฟคเตอร์หน้าจอที่ทำไว้ใน `MOBILE_GUIDE.md`** ให้ใช้ **React Native Paper** (UI library สำเร็จรูป) แทนการเขียน `<TextInput>`/`<Pressable>` + style เองทั้งหมด — เป้าหมายคือได้ UI ที่สวย เป็นระบบ (ธีมสีกลางที่เดียว, state ครบในตัว) โดยไม่ต้องดูแล component เองทุกบรรทัด

> คู่มือนี้ต้องทำ `MOBILE_GUIDE.md` เสร็จก่อน (มี `LoginScreen`, `RegisterScreen`, `HomeScreen` ที่ทำงานได้แล้ว) เพราะคู่มือนี้คือการ**รีแฟคเตอร์โค้ดเดิม** ไม่ใช่สร้างฟีเจอร์ใหม่ — โค้ดในนี้ทดสอบผ่านจริงแล้วใน `mobile/apps` (type-check ผ่าน, bundle ผ่าน 681 modules)

---

## 0. ทำไมไม่ใช้ Class Component

คำถามที่พบบ่อย: "จะจัดการให้เป็นระบบ ควรเปลี่ยนไปเขียนแบบ class ไหม?" — **ไม่ต้องครับ** Function component (ที่ใช้อยู่ทั้งโปรเจคนี้) คือมาตรฐานของ React/React Native ตั้งแต่ปี 2019 เป็นต้นมา เหตุผล:

- **Hook (`useState`, `useEffect`, `useFocusEffect`) ใช้ได้แค่กับ function component** — ถ้าเปลี่ยนเป็น class ต้องเขียนใหม่ทั้งหมดด้วย `this.state`/`componentDidMount` ซึ่งโค้ดยาวกว่าและมี `this` ที่สับสนง่ายกว่ามาก
- React Native Paper (ที่จะใช้ในคู่มือนี้) เองก็เขียนด้วย function component เหมือนกันทั้งหมด

**"เป็นระบบ" ในคู่มือนี้มาจาก 2 อย่างนี้แทน** (ไม่เกี่ยวกับ class/function เลย):
1. **ใช้ UI library ที่มี component/state มาตรฐานพร้อมใช้** (หัวข้อ 1-3) แทนการเขียนเอง
2. **ธีมสีกลางที่เดียว** (`paperTheme.ts`, หัวข้อ 3) — แก้สีหลักที่เดียว มีผลกับทุก component ของ Paper ทั้งแอป

---

## 1. ทำไมใช้ UI Library แทนสร้างเอง

เขียน `Button`/`TextInput` เองได้ (และเคยทำได้จริงมาก่อน) แต่มีข้อจำกัด:
- ต้องไล่ทำ state ที่ต้องมีครบเอง (loading, disabled, error, focus) ทีละ component
- หน้าตาดูธรรมดา ไม่มี animation/shadow/ripple effect แบบแอปมืออาชีพ
- ต้องดูแล/แก้บั๊กของ component ตัวเองตลอดไป

**React Native Paper** คือ UI library ที่ทำตาม [Material Design](https://m3.material.io/) (มาตรฐานของ Google ที่ Android ใช้) ให้ `Button`, `TextInput`, `Menu` ฯลฯ พร้อมใช้ มี state ครบ (loading/disabled/error) มี animation ในตัว และดูแลรักษาต่อเนื่องโดยทีมที่เชี่ยวชาญเฉพาะด้านนี้ — ข้อแลกเปลี่ยนคือต้องเรียนรู้ API ของ library (ชื่อ prop, ชื่อ component) แทนที่จะออกแบบเองได้อิสระ 100%

---

## 2. ติดตั้ง React Native Paper

```bash
npx expo install react-native-paper
```

**ไม่ต้องติดตั้ง `react-native-vector-icons` เพิ่ม** แม้เอกสารบางที่ของ Paper จะแนะนำไว้ — Expo มี `@expo/vector-icons` ติดมาให้ในตัวอยู่แล้ว และปุ่ม/ช่องกรอกพื้นฐานในคู่มือนี้ไม่ได้ใช้ไอคอนเลย **ถ้าเคยติดตั้ง `react-native-vector-icons` ไปแล้วให้ถอนออก:**
```bash
npm uninstall react-native-vector-icons
```
เพราะ package นี้ถูก deprecate แล้ว (ทีมงานย้ายไปเป็น per-icon-family package แทน) และตอนเขียนคู่มือนี้พบว่าการติดตั้งมันดึง dependency ที่มีช่องโหว่ระดับ **critical** (`shell-quote`) ติดมาด้วย (ผ่าน `react-devtools-core`)

**เช็คและแก้ช่องโหว่ที่แก้ได้แบบไม่พัง:**
```bash
npm audit fix
```
ไม่ใช้ `--force` (จะพังเวอร์ชันที่ Expo pin ไว้ให้เข้ากันพอดี) — ตอนเขียนคู่มือนี้หลังรัน `npm audit fix` เหลือ **22 vulnerabilities (7 moderate, 15 high)** ทั้งหมดยังคงเป็น dev-tooling ของ Expo/Metro/React Native เอง (`metro`, `braces`, `micromatch`, `@expo/cli` ฯลฯ) ไม่ได้ติดไปกับแอปที่ build จริงส่งให้ผู้ใช้ — เหมือนที่อธิบายไว้ใน `MOBILE_GUIDE.md` หัวข้อ 1

---

## 3. ตั้งธีมสีกลาง (`paperTheme.ts`) แล้วครอบ `App.tsx` ด้วย `PaperProvider`

```typescript
// src/paperTheme.ts
import { MD3LightTheme } from 'react-native-paper';

// ชุดสีเต็มรูปแบบตามระบบ Material Design 3 (ไม่ใช่แค่เปลี่ยน primary สีเดียว)
// แต่ละ role มีคู่ "on" (ตัวอักษร/ไอคอนที่วางทับสีนั้น) และ "Container" (พื้นหลังอ่อนสำหรับ state รอง)
// แก้ชุดสีนี้ที่เดียว มีผลกับทุก component ของ Paper ทั้งแอป
export const paperTheme = {
  ...MD3LightTheme,
  roundness: 14, // ขอบมนขึ้นกว่า default (4) ทำให้การ์ด/ปุ่ม/ช่องกรอกดูนุ่มนวลทันสมัยขึ้น
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0E7FF',
    onPrimaryContainer: '#312E81',

    secondary: '#7C3AED',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#EDE9FE',
    onSecondaryContainer: '#4C1D95',

    tertiary: '#059669',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#D1FAE5',
    onTertiaryContainer: '#064E3B',

    error: '#DC2626',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#7F1D1D',

    background: '#FAFAFA',
    onBackground: '#1C1B1F',
    surface: '#FFFFFF',
    onSurface: '#1C1B1F',
    surfaceVariant: '#F3F4F6',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
  },
};
```

**อธิบาย:** `MD3LightTheme` คือธีม default ของ Paper (ตาม Material Design 3) — `{ ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: '#4F46E5', ... } }` ใช้ spread operator **copy ค่า default ทั้งหมดมาก่อน แล้วค่อย override เฉพาะที่อยากเปลี่ยน** ค่าอื่นที่ไม่ได้ระบุจะใช้ค่า default ของ Material Design ต่อไป ไม่ต้องกำหนดเองทั้งหมด

**ทำไมต้องกำหนดครบทั้งคู่ `primary`/`onPrimary`/`primaryContainer`/`onPrimaryContainer` (ไม่ใช่แค่ `primary` สีเดียว):** Material Design 3 ออกแบบให้แต่ละสี "บทบาท" มาเป็นชุด 4 ตัวเสมอ — `primary` (พื้นหลังปุ่มหลัก), `onPrimary` (สีตัวอักษร/ไอคอนที่วางทับ `primary` ต้องคอนทราสต์สูงพออ่านง่าย), `primaryContainer` (พื้นหลังอ่อนสำหรับ state รอง เช่น badge/chip), `onPrimaryContainer` (ตัวอักษรบน container นั้น) — ถ้ากำหนดแค่ `primary` ตัวเดียวแล้วปล่อยที่เหลือเป็น default ของ Google สีจะไม่เข้าชุดกัน (เช่น `primary` เป็นม่วงแต่ `primaryContainer` default ยังเป็นโทนอื่น) กำหนดครบทั้ง 4 ตัวต่อ 1 role จึงได้ชุดสีที่ "เข้ากัน" จริงๆ

**`roundness: 14`** — ค่านี้คุม "ความมน" ของขอบ component ทุกตัวของ Paper พร้อมกัน (ปุ่ม, ช่องกรอก, dialog, การ์ด) ค่า default คือ `4` (เกือบเหลี่ยม) ปรับเป็นเลขสูงขึ้นทำให้ทุกอย่างดูนุ่มนวล/ทันสมัยขึ้นทันทีโดยไม่ต้องไปกำหนด `borderRadius` แยกทีละ component

```typescript
// App.tsx
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UiKitScreen from './src/screens/UiKitScreen';
import { paperTheme } from './src/paperTheme';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  UiKit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="UiKit" component={UiKitScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
```

**ทำไม `<PaperProvider>` ต้องครอบนอกสุด (นอก `<NavigationContainer>` ด้วยซ้ำ):** component ของ Paper ทุกตัว (`Button`, `TextInput` ฯลฯ) อ่านค่าธีม (สี, font) ผ่านกลไกของ React ที่เรียกว่า **Context** — `PaperProvider` คือตัว "ประกาศ" ค่าธีมไว้ให้ลูกหลานทุกชั้นที่อยู่ข้างในอ่านได้ ไม่ว่าจะอยู่ลึกแค่ไหนในต้นไม้ของ component (เช่น `Button` ใน `LoginScreen` ที่อยู่ใน `Stack.Navigator` ที่อยู่ใน `NavigationContainer`) — ถ้าลืมครอบ `PaperProvider` component ของ Paper จะยังทำงานได้แต่ใช้ธีม default ล้วนๆ ไม่ได้สีที่เราตั้งไว้ใน `paperTheme.ts`

เพิ่ม `UiKit` ใน `RootStackParamList` และ `Stack.Screen` เผื่อไว้สำหรับหัวข้อ 7 (หน้าโชว์ UI Kit)

---

## 4. รีแฟคเตอร์ `LoginScreen.tsx`

```typescript
// src/screens/LoginScreen.tsx
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { login, ApiError } from '../lib/api';
import { saveToken } from '../lib/token';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('ui.test@uniplay.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      const { access_token } = await login({ email, password });
      await saveToken(access_token);
      navigation.replace('Home');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        เข้าสู่ระบบ
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.field}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        error={!!error}
        style={styles.field}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submitButton}>
        เข้าสู่ระบบ
      </Button>

      <Button mode="text" onPress={() => navigation.navigate('Register')}>
        ยังไม่มีบัญชี? สมัครสมาชิก
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 24 },
  field: { marginBottom: 8 },
  submitButton: { marginTop: 8, marginBottom: 8 },
});
```

**อธิบายทีละส่วนที่ต่างจากตอนสร้างเอง:**

- **`<Text variant="headlineMedium">`** — Paper มี `Text` ของตัวเองแทน `Text` จาก `react-native` ตรงๆ — ไม่ต้องกำหนด `fontSize`/`fontWeight` เอง แค่เลือก `variant` ตามชุดมาตรฐานของ Material Design (`headlineMedium`, `bodyMedium`, `titleMedium`, `bodySmall` ฯลฯ) ขนาด/น้ำหนักตัวอักษรจะสม่ำเสมอกันทั้งแอปอัตโนมัติ
- **`<TextInput mode="outlined">`** — มี **label ลอย** ในตัว (ตอนช่องว่าง label อยู่ตรงกลางเหมือน placeholder พอเริ่มพิมพ์ label จะลอยขึ้นไปอยู่ขอบบนอัตโนมัติ พร้อม animation) ไม่ต้องเขียน `<Text>` label แยกเองแบบก่อนหน้า — `mode="outlined"` คือสไตล์เส้นขอบ (อีกแบบคือ `mode="flat"` พื้นหลังทึบ ไม่มีเส้นขอบ)
- **`error={!!error}` บน `TextInput` + `<HelperText type="error">`** — แยกกัน 2 ส่วน: `error` (boolean) สั่งให้ `TextInput` เปลี่ยนสีขอบ/label เป็นสีแดงเฉยๆ ส่วน `<HelperText>` เป็น component แยกสำหรับ**โชว์ข้อความ** ใต้ช่อง (ต้องวางไว้ใต้ `TextInput` เอง ไม่ได้ผูกอัตโนมัติ) `visible={!!error}` ควบคุมว่าจะโชว์ไหม (ไม่ได้ซ่อนด้วย `error && <Text>...` แบบที่เคยเขียนเอง เพราะ `HelperText` มี animation fade in/out ให้เองตอนโชว์/ซ่อน)
- **`<Button mode="contained" loading={loading} disabled={loading}>`** — ต่างจาก component ที่เคยสร้างเอง (`Button` ของเราเองมี logic `disabled || loading` ให้อัตโนมัติ) Paper's `Button` แยก `loading`/`disabled` เป็นคนละ prop ต้องส่งทั้งคู่เองถ้าต้องการให้กดไม่ได้ระหว่าง loading — `loading={true}` แค่โชว์วงกลมหมุนที่ปุ่ม **ไม่ได้ทำให้กดไม่ได้อัตโนมัติ**
- **`mode="contained"` vs `mode="text"`** — Paper มีปุ่ม 5 แบบ (`contained`, `outlined`, `text`, `elevated`, `contained-tonal`) คู่มือนี้ใช้ `contained` (พื้นสีทึบ เด่นสุด สำหรับ action หลัก) กับ `text` (แค่ตัวหนังสือ ไม่มีพื้นหลัง สำหรับ action รอง เช่น ลิงก์ไปหน้าอื่น)

### 4.1 เพิ่มไอคอนและปุ่มดู/ซ่อนรหัสผ่าน

```typescript
const [showPassword, setShowPassword] = useState(false);

// ...

<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
  left={<TextInput.Icon icon="email-outline" />}
  // ...
/>

<TextInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  mode="outlined"
  secureTextEntry={!showPassword}
  left={<TextInput.Icon icon="lock-outline" />}
  right={
    <TextInput.Icon
      icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
      onPress={() => setShowPassword((prev) => !prev)}
    />
  }
  // ...
/>
```

**อธิบาย:**
- **`left={<TextInput.Icon icon="..." />}`** — วางไอคอนไว้ด้านซ้ายในช่องกรอก ชื่อไอคอน (`"email-outline"`, `"lock-outline"`) มาจากชุดไอคอน [Material Community Icons](https://pictogrammers.com/library/mdi/) ที่ติดมากับ `react-native-paper` อยู่แล้ว (ผ่าน `@expo/vector-icons`) ไม่ต้องหาไฟล์ไอคอนเอง แค่พิมพ์ชื่อให้ตรง
- **`right={<TextInput.Icon icon="eye-outline" onPress={...} />}`** — ไอคอนฝั่งขวาใส่ `onPress` ได้ (ต่างจาก `left` ที่ปกติไว้โชว์เฉยๆ) ใช้ทำปุ่ม "ดู/ซ่อนรหัสผ่าน" แบบที่เห็นในแอปทั่วไป
- **`secureTextEntry={!showPassword}`** — เดิมใส่ `secureTextEntry` ตรงๆ (ซ่อนตลอด) ตอนนี้ผูกกับ state `showPassword` แทน: ซ่อนอยู่ (`true`) ตอน `showPassword = false` (ค่าเริ่มต้น) พอกดไอคอนตา `showPassword` สลับเป็น `true` ทำให้ `secureTextEntry={false}` → ตัวอักษรที่พิมพ์โชว์ให้เห็นปกติ

ทำแบบเดียวกันกับ `RegisterScreen.tsx` และ `HomeScreen.tsx` ได้เลย (ดูโค้ดเต็มในหัวข้อ 5-6)

---

## 5. รีแฟคเตอร์ `RegisterScreen.tsx` — เพิ่ม `Menu` สำหรับเลือก Role

```typescript
// src/screens/RegisterScreen.tsx
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText, Menu } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { createUser, ApiError } from '../lib/api';
import { ROLES } from '../lib/roles';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(ROLES[0].id);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedRole = ROLES.find((role) => role.id === roleId);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      await createUser({ email, password, name, roleId });
      navigation.replace('Login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        สมัครสมาชิก
      </Text>

      <TextInput label="ชื่อ" value={name} onChangeText={setName} mode="outlined" style={styles.field} />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.field}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.field}
      />

      <Menu
        visible={roleMenuOpen}
        onDismiss={() => setRoleMenuOpen(false)}
        anchor={
          <Button mode="outlined" onPress={() => setRoleMenuOpen(true)} style={styles.roleButton}>
            บทบาท: {selectedRole?.name}
          </Button>
        }
      >
        {ROLES.map((role) => (
          <Menu.Item
            key={role.id}
            title={role.name}
            onPress={() => {
              setRoleId(role.id);
              setRoleMenuOpen(false);
            }}
          />
        ))}
      </Menu>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submitButton}>
        สมัครสมาชิก
      </Button>

      <Button mode="text" onPress={() => navigation.navigate('Login')}>
        มีบัญชีแล้ว? เข้าสู่ระบบ
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 24 },
  field: { marginBottom: 8 },
  roleButton: { marginTop: 8, marginBottom: 8, alignSelf: 'flex-start' },
  submitButton: { marginTop: 8, marginBottom: 8 },
});
```

**ทำไมใช้ `Menu` แทนปุ่มเลือก role แบบเดิม (role chip ที่เคยทำเอง):** ตอนทำเองใช้แถวปุ่มให้กดเลือก (เหมาะกับ role 3-4 ตัวพอดีจอ) แต่ `Menu` ของ Paper เป็น pattern มาตรฐานกว่าสำหรับ "เลือก 1 จากหลายตัวเลือก" และขยายได้ถ้า role เพิ่มในอนาคต (ไม่ต้องกังวลเรื่องพื้นที่จอไม่พอแบบปุ่มเรียงแถว):

- **`<Menu visible={roleMenuOpen} onDismiss={...} anchor={<Button .../>}>`** — `anchor` คือ element ที่กดแล้ว menu จะเด้งออกมาข้างๆ (ที่นี่คือปุ่มโชว์ role ที่เลือกอยู่) `visible`/`onDismiss` ควบคุมเปิด-ปิด (ต้องจัดการ state เองเสมอ ไม่ได้ auto toggle ให้)
- **`<Menu.Item onPress={...} title="...">`** — แต่ละตัวเลือกใน dropdown พอกดจะเรียก `onPress` (ที่นี่ set role ที่เลือก แล้วปิด menu ทันทีด้วย `setRoleMenuOpen(false)`)
- **`selectedRole?.name`** — ใช้ optional chaining เพราะ `ROLES.find(...)` อาจ return `undefined` ถ้าหา id ไม่เจอ (ในทางปฏิบัติไม่เกิดขึ้นเพราะ `roleId` เริ่มจาก `ROLES[0].id` เสมอ แต่ TypeScript บังคับให้เช็คไว้เพราะ `.find()` มี type เป็น `T | undefined` เสมอ)

---

## 6. รีแฟคเตอร์ `HomeScreen.tsx`

```typescript
// src/screens/HomeScreen.tsx
import { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { clearToken, getToken } from '../lib/token';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [hasToken, setHasToken] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getToken().then((token) => setHasToken(!!token));
    }, []),
  );

  async function handleLogout() {
    await clearToken();
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">UniPlay Admin</Text>

      {hasToken ? (
        <>
          <Text variant="bodyMedium" style={styles.subtitle}>
            เข้าสู่ระบบแล้ว (มี access_token เก็บอยู่)
          </Text>
          <Button mode="outlined" onPress={handleLogout}>
            ออกจากระบบ
          </Button>
        </>
      ) : (
        <View style={styles.row}>
          <Button mode="contained" onPress={() => navigation.navigate('Login')}>
            เข้าสู่ระบบ
          </Button>
          <Button mode="outlined" onPress={() => navigation.navigate('Register')}>
            สมัครสมาชิก
          </Button>
        </View>
      )}

      <Button mode="text" onPress={() => navigation.navigate('UiKit')}>
        ดูตัวอย่าง UI Kit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  subtitle: { color: '#4b5563' },
  row: { flexDirection: 'row', gap: 12 },
});
```

ไม่มีอะไรใหม่เพิ่มจากหัวข้อ 4-5 — แค่เอา pattern เดียวกัน (`Text variant`, `Button mode`) มาใช้ซ้ำ นี่คือข้อดีของการมี UI library: เรียนรู้ API ครั้งเดียว ใช้ได้ทุกหน้า

---

## 7. สร้างหน้า "UI Kit" สำหรับสอนใช้โดยเฉพาะ

หน้าจอทั้ง 3 หน้าที่รีแฟคเตอร์ไปแล้ว (หัวข้อ 4-6) ใช้ component จริงปนกับ logic ของแต่ละหน้า (เรียก API, เปลี่ยนหน้า) — เหมาะกับการใช้งานจริง แต่ไม่ได้ออกแบบมาให้ "ดูตัวอย่างทุก state เทียบกัน" ง่ายๆ จึงสร้างหน้าแยกต่างหากไว้สำหรับสอน/สาธิตโดยเฉพาะ ไม่ยุ่งกับ logic ของแอปจริงเลย:

```typescript
// src/screens/UiKitScreen.tsx
import { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput, HelperText, Divider } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'UiKit'>;

// หน้านี้สร้างไว้เพื่อ "สอนใช้" component ของ React Native Paper โดยเฉพาะ
// ไม่เรียก API จริง แค่โชว์ทุก variant/state ให้เห็นเทียบกันในหน้าเดียว
export default function UiKitScreen({ navigation }: Props) {
  const [sampleText, setSampleText] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium">UI Kit</Text>
      <Text variant="bodyMedium" style={styles.pageSubtitle}>
        รวม component จาก React Native Paper ที่ใช้ซ้ำทั้งแอป — ดูคู่กับ MOBILE_UX_GUIDE.md
      </Text>

      {/* ---------- Button ---------- */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Button</Text>

      <Text variant="bodySmall" style={styles.label}>mode="contained" (ปุ่มหลัก) — ลองกดดูได้เลย</Text>
      <Button mode="contained" onPress={() => showPreview('Contained Button')} style={styles.sample}>
        Contained Button
      </Button>

      <Text variant="bodySmall" style={styles.label}>mode="outlined" (ปุ่มรอง) — ลองกดดูได้เลย</Text>
      <Button mode="outlined" onPress={() => showPreview('Outlined Button')} style={styles.sample}>
        Outlined Button
      </Button>

      <Text variant="bodySmall" style={styles.label}>mode="text" (ปุ่มลิงก์) — ลองกดดูได้เลย</Text>
      <Button mode="text" onPress={() => showPreview('Text Button')} style={styles.sample}>
        Text Button
      </Button>

      <Text variant="bodySmall" style={styles.label}>
        loading — กดแล้วปุ่มจะหมุน 1.5 วิ (กดซ้ำไม่ได้ระหว่างนั้น) แล้วเด้ง popup
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

      <Text variant="bodySmall" style={styles.label}>disabled (กดไม่ได้เลย — ลองกดดู ไม่มีอะไรเกิดขึ้น)</Text>
      <Button mode="contained" disabled onPress={() => showPreview('Disabled Button')} style={styles.sample}>
        Disabled Button
      </Button>

      <Divider style={styles.divider} />

      {/* ---------- TextInput ---------- */}
      <Text variant="titleMedium" style={styles.sectionTitle}>TextInput</Text>

      <Text variant="bodySmall" style={styles.label}>Default (label ลอยอัตโนมัติเมื่อพิมพ์)</Text>
      <TextInput
        label="Email"
        placeholder="student1@uniplay.test"
        value={sampleText}
        onChangeText={setSampleText}
        mode="outlined"
        style={styles.sample}
      />

      <Text variant="bodySmall" style={styles.label}>
        error (ขอบ/label เปลี่ยนเป็นสีแดง) + HelperText แสดงข้อความ
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

      <Text variant="bodySmall" style={styles.label}>secureTextEntry (สำหรับ password)</Text>
      <TextInput label="Password" placeholder="********" secureTextEntry mode="outlined" style={styles.sample} />

      <Button mode="outlined" onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        กลับหน้าแรก
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 32 },
  pageSubtitle: { color: '#4b5563', marginBottom: 24 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  label: { color: '#4b5563', marginBottom: 4 },
  sample: { marginBottom: 16 },
  divider: { marginVertical: 8 },
  backButton: { marginTop: 24 },
});
```

**จุดสำคัญที่ทำให้หน้านี้ "สอนใช้" ได้จริง ไม่ใช่แค่ภาพนิ่ง:**
- **ทุกปุ่มกดได้จริง** — `onPress={() => showPreview('...')}` เรียก `Alert.alert(...)` (popup มาตรฐานของระบบปฏิบัติการ ไม่ใช่ popup ที่วาดเอง) โชว์ชื่อปุ่มที่กด ให้เห็นว่าโค้ดจริงทำงานอยู่ ไม่ใช่แค่ UI หลอก
- **ปุ่ม loading กดแล้วเห็นผลจริง** — `handleLoadingDemo()` ตั้ง `loadingDemo = true` ก่อน (ปุ่มหมุน + กดไม่ได้) แล้วใช้ `setTimeout(..., 1500)` จำลองการรอ response จาก server 1.5 วินาที พอครบเวลาค่อยปิด loading แล้วเด้ง popup — เห็น loading state ทำงานจริงแบบเดียวกับตอน login จริง ไม่ใช่แค่ภาพนิ่งของปุ่มที่หมุนค้างไว้
- **ปุ่ม disabled กดแล้วไม่มีอะไรเกิดขึ้นจริง** — แม้จะใส่ `onPress` ไว้ แต่ `disabled` บล็อกไม่ให้ `onPress` ทำงานเลย ลองกดเทียบกับปุ่มอื่นจะเห็นความต่างชัดเจน

เพิ่ม path ไปหน้านี้จาก `HomeScreen.tsx` (หัวข้อ 6) ด้วยปุ่ม "ดูตัวอย่าง UI Kit" (`mode="text"`)

---

## 7.1 สร้าง Navbar, Footer, และ Confirm Dialog ที่ใช้ซ้ำทุกหน้า

ตอนนี้ทุกหน้าเขียนหัวข้อ (`<Text variant="headlineMedium">`) และปุ่ม back เอง กระจายกันคนละแบบ — สร้าง component ใช้ซ้ำอีก 3 ตัว เพื่อให้ navbar/footer/popup ยืนยันหน้าตาเหมือนกันทุกหน้า แก้ที่เดียวมีผลทั้งแอป

### `src/components/AppHeader.tsx` — Navbar

```typescript
import { Appbar } from 'react-native-paper';

type AppHeaderProps = {
  title: string;
  onBack?: () => void;
};

// Navbar กลางที่ใช้ซ้ำทุกหน้า — มีปุ่ม back ให้ถ้าส่ง onBack มา (หน้า Home ไม่ต้องมีปุ่ม back จึงไม่ส่ง prop นี้)
export default function AppHeader({ title, onBack }: AppHeaderProps) {
  return (
    <Appbar.Header>
      {onBack && <Appbar.BackAction onPress={onBack} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
```

**อธิบาย:** `Appbar.Header` คือ Material Design app bar มาตรฐาน (แถบบนสุดของแอป) — `Appbar.BackAction` คือปุ่มลูกศรย้อนกลับ (ไอคอนมาตรฐาน ไม่ต้องหาเอง) ใส่แบบมีเงื่อนไข `{onBack && <Appbar.BackAction ... />}` เพราะหน้า **Home** เป็นหน้าแรกสุดของแอป ไม่มีที่ให้ "ย้อนกลับไป" จึงไม่ส่ง `onBack` prop มา (component จะไม่ render ปุ่มนี้เลย) ส่วนหน้า Login/Register/UiKit ส่ง `onBack={() => navigation.navigate('Home')}` มาด้วยเสมอ

### `src/components/AppFooter.tsx` — Footer

```typescript
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

// Footer ง่ายๆ ใช้ซ้ำทุกหน้า — โชว์ชื่อแอป + ปีปัจจุบัน ไม่มี logic อะไรซับซ้อน
export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={styles.text}>
        UniPlay © {year} — University Sports Facility Booking
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, alignItems: 'center' },
  text: { color: '#9ca3af' },
});
```

**อธิบาย:** `new Date().getFullYear()` ดึงปีปัจจุบันจากนาฬิกาเครื่อง ไม่ต้อง hardcode ปีไว้ตรงๆ (ปีจะอัปเดตเองทุกครั้งที่เปิดแอปข้ามปี ไม่ต้องแก้โค้ด)

### `src/components/ConfirmDialog.tsx` — Confirm Modal

```typescript
import { Portal, Dialog, Text, Button } from 'react-native-paper';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Popup ยืนยันก่อนทำสิ่งที่ย้อนกลับยาก (เช่น logout, ลบข้อมูล) ใช้ซ้ำได้ทุกที่ที่ต้องการ "ถามก่อน" ผู้ใช้
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{cancelLabel}</Button>
          <Button onPress={onConfirm}>{confirmLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
```

**อธิบายทีละส่วนที่สำคัญ:**
- **`<Portal>` ครอบ `<Dialog>` ไว้เสมอ:** ปกติ component ที่อยู่ลึกใน tree (เช่น `ConfirmDialog` ที่อยู่ใน `HomeScreen` ที่อยู่ใน `Stack.Navigator`) จะ render ซ้อนอยู่ในตำแหน่งนั้นตาม DOM/view hierarchy จริง — แต่ popup/modal ต้องการ**ลอยทับทุกอย่างบนสุดของทั้งหน้าจอ** ไม่ใช่แค่ทับ component ที่อยู่ใกล้ๆ กัน `Portal` คือกลไกของ Paper ที่ "ย้าย" สิ่งที่อยู่ข้างในไปแสดงผลที่ชั้นบนสุดของแอปแทน (ทำงานได้เพราะ `PaperProvider` ใน `App.tsx` เตรียม "พื้นที่" สำหรับ Portal ไว้ให้อัตโนมัติอยู่แล้ว ไม่ต้องตั้งค่าเพิ่ม)
- **`visible`/`onDismiss`/`onConfirm`/`onCancel` เป็น prop ที่ผู้เรียกใช้ควบคุมเองทั้งหมด** — `ConfirmDialog` เองไม่มี state ภายในเลยว่าจะเปิด/ปิดเมื่อไหร่ (ไม่มี `useState` ในไฟล์นี้) หน้าที่เรียกใช้ (เช่น `HomeScreen`) ต้องเป็นคนเก็บ state `visible` เอง แล้วส่งเข้ามา — ข้อดีคือ `ConfirmDialog` ใช้ซ้ำได้กับทุกสถานการณ์ที่ต้องการยืนยัน ไม่ผูกติดกับ logic เฉพาะอย่างใดอย่างหนึ่ง (เช่น logout)
- **`confirmLabel = 'ยืนยัน'` (ค่า default ของ prop)** — ถ้าไม่ส่ง `confirmLabel`/`cancelLabel` มา จะใช้ข้อความนี้เป็นค่าเริ่มต้น ส่งมาเองได้ถ้าอยากเปลี่ยนข้อความให้ตรงบริบท (เช่น `confirmLabel="ออกจากระบบ"` แทน `"ยืนยัน"` เฉยๆ)

### นำไปใช้ใน `HomeScreen.tsx` — เปลี่ยน logout ให้ต้องยืนยันก่อน

```typescript
const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

async function handleConfirmLogout() {
  setLogoutConfirmVisible(false);
  await clearToken();
  navigation.replace('Login');
}

// ในปุ่ม "ออกจากระบบ" เปลี่ยนจากเรียก logout ตรงๆ เป็นเปิด dialog ก่อน:
<Button mode="outlined" onPress={() => setLogoutConfirmVisible(true)}>
  ออกจากระบบ
</Button>

// วาง ConfirmDialog ไว้ท้ายสุดของหน้า (นอก View หลักก็ได้ เพราะ Portal จะยกไปลอยด้านบนอยู่แล้ว)
<ConfirmDialog
  visible={logoutConfirmVisible}
  title="ออกจากระบบ"
  message="ต้องการออกจากระบบใช่ไหม? ต้อง login ใหม่ถึงจะใช้งานต่อได้"
  confirmLabel="ออกจากระบบ"
  onConfirm={handleConfirmLogout}
  onCancel={() => setLogoutConfirmVisible(false)}
/>
```

**ทำไมต้องมีขั้นตอนยืนยันก่อน logout:** logout เป็น action ที่ "ย้อนกลับยาก" ในแง่ประสบการณ์ผู้ใช้ (กดพลาดแล้วต้อง login ใหม่ เสียเวลา) — หลักการ UX ทั่วไปคือ **action ที่ทำพลาดแล้วเสียเวลา/ข้อมูลควรมีด่านถามยืนยันก่อนเสมอ** (เทียบกับปุ่ม "เข้าสู่ระบบ" ที่กดพลาดไม่มีผลเสียหาย จึงไม่ต้องมี dialog ยืนยัน)

ใส่ `<AppHeader>`/`<AppFooter>` แบบเดียวกันนี้ในทุกหน้า (`LoginScreen`, `RegisterScreen`, `UiKitScreen`) แทนหัวข้อ/ปุ่ม back ที่เขียนเองไว้ก่อนหน้า — ดูโค้ดเต็มในโฟลเดอร์ `mobile/apps` (ทำเสร็จและทดสอบผ่านแล้ว)

---

## 8. States ที่ต้องรู้จักใน Paper (built-in ให้แล้ว ไม่ต้องเขียนเอง)

| State | วิธีใช้ | เกิดอะไรขึ้น |
|---|---|---|
| **Loading** | `<Button loading={true}>` | โชว์วงกลมหมุนแทนข้อความ — **ไม่ทำให้กดไม่ได้อัตโนมัติ** ต้องใส่ `disabled={loading}` คู่กันเองเสมอ |
| **Disabled** | `<Button disabled={true}>` | จางลง + กดไม่ได้ (รวม `onPress` ด้วย) |
| **Error** | `<TextInput error={true}>` + `<HelperText type="error" visible={true}>` | ขอบ/label เป็นสีแดง + ข้อความใต้ช่อง (ต้องใช้คู่กัน 2 component) |
| **Focus** | ไม่ต้องทำอะไรเลย | Paper จัดการ animation ตอนแตะช่องกรอก (label ลอยขึ้น, ขอบเปลี่ยนสีตามธีม) ให้อัตโนมัติทั้งหมด |

**กฎสำคัญที่ต่างจากตอนสร้าง component เอง:** component ของ Paper **แยก prop ให้ยืดหยุ่นที่สุด** (`loading` ไม่ผูกกับ `disabled` อัตโนมัติ) ไม่เหมือนตอนที่เราออกแบบ `Button`/`TextField` เองที่รวม logic ไว้ให้เสร็จ — ข้อดีคือยืดหยุ่นกว่า (บางเคสอาจอยากให้ loading แต่ยังกดได้ก็ทำได้) ข้อเสียคือต้องจำเองว่าต้องใส่ `disabled={loading}` คู่กันเสมอเวลาต้องการบล็อกการกดซ้ำ

---

## 9. Animated Onboarding — หน้าแนะนำแอปก่อนเข้าใช้งานครั้งแรก

แรงบันดาลใจจากเทมเพลตใน [React-Native-UI-Templates](https://github.com/Aashu-Dubey/React-Native-UI-Templates) (เอาแค่ **แนวคิด** ของ layout/animation มาปรับใช้ ไม่ได้ก๊อปโค้ดมาตรงๆ — เขียนใหม่ด้วย `react-native-paper` + ธีมของเราเองเพื่อให้หน้าตาเข้ากับทั้งแอป ไม่ใช่ปนกัน 2 ระบบ)

**สิ่งที่ต้องมี:** หน้าแนะนำแอป 3 สไลด์ เลื่อนซ้าย-ขวาได้ (เหมือนเปิดแอปใหม่ครั้งแรกทั่วไป) มีจุดบอกตำแหน่ง (dots) ที่ขยาย/หดตามสไลด์ที่เลื่อนอยู่ ปุ่ม "ข้าม" และปุ่ม "ถัดไป"/"เริ่มใช้งาน" — **โชว์แค่ครั้งแรกที่เปิดแอป** ครั้งต่อไปข้ามไปหน้า Home เลย

### 9.1 เก็บสถานะ "เคยเห็น onboarding แล้วหรือยัง" (`src/lib/onboarding.ts`)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_SEEN_KEY = 'onboarding_seen';

export async function hasSeenOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
  return value === 'true';
}

export async function markOnboardingSeen() {
  await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
}
```

เหมือนกับ `lib/token.ts` ทุกประการ (ใช้ `AsyncStorage` เก็บค่าถาวร) ต่างแค่เก็บ string `'true'`/`null` แทน JWT

### 9.2 สร้าง `OnboardingScreen.tsx`

```typescript
import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { markOnboardingSeen } from '../lib/onboarding';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}[] = [
  {
    icon: 'calendar-check-outline',
    title: 'จองสนามกีฬาได้ทุกที่',
    description: 'เช็คตารางว่างและจองสนามกีฬาในมหาวิทยาลัยได้ในไม่กี่ขั้นตอน ไม่ต้องเดินไปถามเจ้าหน้าที่',
  },
  {
    icon: 'bell-ring-outline',
    title: 'ไม่พลาดทุกการแจ้งเตือน',
    description: 'รับแจ้งเตือนทันทีเมื่อการจองได้รับการอนุมัติ หรือมีการเปลี่ยนแปลงตารางเวลา',
  },
  {
    icon: 'shield-account-outline',
    title: 'ปลอดภัยด้วยระบบสมาชิก',
    description: 'ข้อมูลของคุณปลอดภัยด้วยระบบยืนยันตัวตน เข้าใช้งานได้เฉพาะนักศึกษาและบุคลากรเท่านั้น',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [pageIndex, setPageIndex] = useState(0);

  async function finishOnboarding() {
    await markOnboardingSeen();
    navigation.replace('Home');
  }

  function goToNextSlide() {
    if (pageIndex === SLIDES.length - 1) {
      finishOnboarding();
      return;
    }
    scrollRef.current?.scrollTo({ x: width * (pageIndex + 1), animated: true });
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setPageIndex(index);
  }

  const isLastSlide = pageIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <Button mode="text" onPress={finishOnboarding} style={styles.skipButton}>
        ข้าม
      </Button>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.title} style={styles.slide}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={slide.icon} size={72} color="#4F46E5" />
            </View>
            <Text variant="headlineSmall" style={styles.title}>
              {slide.title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {slide.description}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]} />;
        })}
      </View>

      <Button mode="contained" onPress={goToNextSlide} style={styles.nextButton}>
        {isLastSlide ? 'เริ่มใช้งาน' : 'ถัดไป'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  skipButton: { alignSelf: 'flex-end', marginTop: 8, marginRight: 8 },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: { textAlign: 'center', marginBottom: 12, color: '#1C1B1F' },
  description: { textAlign: 'center', color: '#6b7280', lineHeight: 22 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { height: 8, borderRadius: 4, backgroundColor: '#4F46E5' },
  nextButton: { marginHorizontal: 32, marginBottom: 32, paddingVertical: 4 },
});
```

**อธิบายทีละส่วนที่สำคัญ (เทคนิค animation ใหม่ที่ยังไม่เคยใช้ในคู่มือนี้):**

- **`Animated.Value` คืออะไร:** ตัวแปรพิเศษของ React Native ที่ออกแบบมาสำหรับทำ animation โดยเฉพาะ — ต่างจาก `useState` ธรรมดาตรงที่การเปลี่ยนค่าของ `Animated.Value` **ไม่ทำให้ component re-render ทั้งหมด** (เปลี่ยนค่าที่ native layer ตรงๆ) ทำให้ animation ลื่นไหลแม้จะอัปเดตค่าทุกเฟรมตอนเลื่อนจอ (ต่างจาก `useState` ที่ re-render ทุกครั้งที่ค่าเปลี่ยนจะกระตุกถ้าอัปเดตถี่ขนาดนั้น)
- **`Animated.event([...], { useNativeDriver: false })` ผูกกับ `onScroll`:** ทุกครั้งที่ผู้ใช้เลื่อนจอ ตำแหน่ง scroll (`contentOffset.x`) จะถูกส่งเข้า `scrollX` (ตัวแปร `Animated.Value`) โดยอัตโนมัติ **ไม่ต้องเขียน `setScrollX(...)` เอง** — `useNativeDriver: false` จำเป็นเพราะเราเอาค่านี้ไปคำนวณ `width` ของ dot (layout property ซึ่ง native driver ทำไม่ได้ ต้องใช้ false เสมอเมื่อ animate ค่าที่เกี่ยวกับ layout)
- **`scrollX.interpolate({ inputRange, outputRange, extrapolate: 'clamp' })`:** "แปลงค่าช่วงหนึ่งเป็นอีกช่วงหนึ่ง" — ตรงนี้แปลง**ตำแหน่ง scroll** เป็น**ความกว้างของ dot** เช่น dot ตัวที่ 0: ถ้า `scrollX` อยู่ที่ตำแหน่งสไลด์ 0 พอดี (`inputRange[1]`) ให้ `dotWidth = 24` (ขยายใหญ่ เพราะกำลังอยู่หน้านี้) ถ้า `scrollX` เลื่อนไปไกลจากตำแหน่งนี้ (ไปทางซ้าย/ขวาเกิน 1 หน้าจอ) ให้ `dotWidth = 8` (กลับมาเล็ก) — `extrapolate: 'clamp'` กันไม่ให้ค่าออกนอกช่วง `[8, 24]` แม้ scroll เกินขอบเขตที่กำหนด
- **`ref={scrollRef}` + `scrollRef.current?.scrollTo({ x: ..., animated: true })`:** ปุ่ม "ถัดไป" สั่งเลื่อนจอไปสไลด์ถัดไปแบบ**เขียนโปรแกรมสั่งเอง** (ไม่ใช่รอให้ผู้ใช้เลื่อนนิ้วเอง) — คำนวณตำแหน่งจาก `width * (pageIndex + 1)` (ความกว้างจอ คูณ ลำดับสไลด์ที่จะไป)
- **`Dimensions.get('window').width`:** ดึงความกว้างหน้าจอจริงของอุปกรณ์ (ไม่ hardcode ตัวเลข) ใช้กำหนดความกว้างแต่ละสไลด์ให้เท่ากับ 1 หน้าจอเป๊ะ (`pagingEnabled` อาศัยเลขนี้ในการ "สแนป" หยุดพอดีแต่ละสไลด์)
- **`isLastSlide` ควบคุมทั้งข้อความปุ่มและพฤติกรรม:** `goToNextSlide()` เช็คว่าอยู่สไลด์สุดท้ายไหม ถ้าใช่เรียก `finishOnboarding()` แทนการเลื่อนจอต่อ (ไม่มีสไลด์ที่ 4 ให้เลื่อนไป) ปุ่มก็เปลี่ยนข้อความจาก "ถัดไป" เป็น "เริ่มใช้งาน" ให้ตรงกับพฤติกรรมจริง

### 9.3 ต่อเข้า `App.tsx` — เช็คว่าเคยเห็นมาก่อนไหม ก่อนตัดสินใจว่าจะเปิดหน้าไหนก่อน

```typescript
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
// ... import เดิม
import OnboardingScreen from './src/screens/OnboardingScreen';
import { hasSeenOnboarding } from './src/lib/onboarding';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  UiKit: undefined;
};

export default function App() {
  // null = ยังเช็คไม่เสร็จ, true/false = เช็คแล้วว่าเคยเห็น onboarding มาก่อนไหม
  const [seenOnboarding, setSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    hasSeenOnboarding().then(setSeenOnboarding);
  }, []);

  if (seenOnboarding === null) {
    return (
      <PaperProvider theme={paperTheme}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={seenOnboarding ? 'Home' : 'Onboarding'}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          {/* ... Stack.Screen เดิมที่เหลือ */}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
```

**ทำไมต้องมีหน้า loading คั่นก่อน (เช็ค `seenOnboarding === null`):** การอ่านค่าจาก `AsyncStorage` เป็น async (ต้องรอ) — ตอนแอปเพิ่งเปิดมา **ยังไม่รู้คำตอบ** ว่าเคยเห็น onboarding มาก่อนไหม ถ้าปล่อยให้ `NavigationContainer` render ไปเลยโดยไม่รอ จะต้องเดา `initialRouteName` ไปก่อน (เช่น เดาว่า `'Home'`) แล้วพอรู้คำตอบจริงทีหลังค่อยสลับหน้า ซึ่งจะทำให้ผู้ใช้**เห็นหน้าสลับไปมา** (เช่น เห็น Home แวบนึง แล้วเด้งไป Onboarding) — การรอ (`seenOnboarding === null` → โชว์ `ActivityIndicator` เฉยๆ) ก่อนตัดสินใจ `initialRouteName` ทำให้เปิดมาเจอหน้าที่ถูกต้องตั้งแต่เฟรมแรกเลย ไม่มีอาการกระพริบ

**`initialRouteName` กำหนดได้แค่ตอนสร้าง `Stack.Navigator` ครั้งแรกเท่านั้น** (เปลี่ยนทีหลังจะไม่มีผล) จึงต้องรอให้รู้คำตอบก่อนแล้วค่อย render `Stack.Navigator` ครั้งเดียว (ไม่ใช่ render ไปก่อนแล้วค่อยเปลี่ยนทีหลัง)

---

## 10. เช็คลิสต์ก่อนถือว่าทำเสร็จ

- [ ] `npx expo install react-native-paper` แล้ว **ไม่มี** `react-native-vector-icons` ติดตั้งอยู่
- [ ] `App.tsx` มี `<PaperProvider theme={paperTheme}>` ครอบนอกสุด (นอก `NavigationContainer`)
- [ ] `LoginScreen`, `RegisterScreen`, `HomeScreen` ใช้ `Text`/`Button`/`TextInput` จาก `react-native-paper` ทั้งหมด ไม่เหลือ `<TextInput>`/`<Pressable>` ดิบจาก `react-native` ที่ยังเขียน style เอง
- [ ] ปุ่ม submit ทุกปุ่มมีทั้ง `loading={loading}` และ `disabled={loading}` คู่กันเสมอ (ไม่ใช่แค่ `loading` เฉยๆ)
- [ ] หน้า `UiKit` เข้าถึงได้จากปุ่ม "ดูตัวอย่าง UI Kit" ในหน้า Home
- [ ] ทุกหน้าใช้ `AppHeader`/`AppFooter` ร่วมกัน (ยกเว้น `OnboardingScreen` ที่ตั้งใจออกแบบแยก ไม่มี navbar/footer เพราะเป็นหน้าเต็มจอ)
- [ ] เปิดแอปครั้งแรกเจอ Onboarding, ปิดแอปแล้วเปิดใหม่ (หรือ reload) ต้องข้ามไป Home ตรงๆ ไม่เจอ Onboarding ซ้ำ
- [ ] กดปุ่ม "ข้าม" ที่ Onboarding ข้ามไป Home ได้ทุกสไลด์ (ไม่ใช่แค่สไลด์สุดท้าย)
- [ ] `npx tsc --noEmit` ผ่านไม่มี error
- [ ] `npm audit` ไม่มี vulnerability ระดับ **critical** หลงเหลือ (moderate/high จาก Expo tooling รับได้ตามหัวข้อ 2)

---

## 11. เชื่อมกับเอกสารอื่น

- **`MOBILE_GUIDE.md`** — คู่มือที่สร้างหน้าจอทั้ง 3 หน้าไว้ก่อน คู่มือนี้เป็นการรีแฟคเตอร์ต่อยอด
- **`FRONTEND_GUIDE.md`** / คู่มือ UX/UI ฝั่งเว็บ (ถัดไป) — concept การใช้ UI library มาจัดการ state/ธีมเหมือนกัน นำไปใช้กับ Next.js/Tailwind ได้ (เช่นไลบรารี shadcn/ui, MUI) ต่างแค่ syntax การเขียน
- **ขั้นต่อไปที่ยังไม่ทำในคู่มือนี้:** dark mode (Paper รองรับผ่าน `MD3DarkTheme` พร้อมสลับอัตโนมัติตาม system), ปุ่ม "ลืมรหัสผ่าน", accessibility เจาะลึก (screen reader label, contrast ratio ตาม WCAG)
