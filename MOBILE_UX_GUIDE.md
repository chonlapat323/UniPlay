# คู่มือจัดการ UX/UI แบบเป็นระบบใน Mobile App (Component Reuse + Design Token)

เอกสารนี้สอนวิธี **รีแฟคเตอร์หน้าจอที่ทำไว้ใน `MOBILE_GUIDE.md`** ให้ใช้ **component ที่ใช้ซ้ำได้** (`Button`, `TextField`) และ **design token** (`theme.ts`) แทนการเขียนสี/ระยะห่าง/style ซ้ำๆ กระจายอยู่ทุกไฟล์ — เป้าหมายคือทำให้ UI "เป็นระบบระเบียบ" จัดการง่าย แก้ทีเดียวมีผลทั้งแอป โดย**ไม่ต้องเปลี่ยนไปใช้ class component** (ดูหัวข้อ 0 ว่าทำไม)

> คู่มือนี้ต้องทำ `MOBILE_GUIDE.md` เสร็จก่อน (มี `LoginScreen`, `RegisterScreen`, `HomeScreen` ที่ทำงานได้แล้ว) เพราะคู่มือนี้คือการ**รีแฟคเตอร์โค้ดเดิม** ไม่ใช่สร้างฟีเจอร์ใหม่

---

## 0. ทำไมไม่ใช้ Class Component

คำถามที่พบบ่อย: "จะจัดการให้เป็นระบบ ควรเปลี่ยนไปเขียนแบบ class ไหม?" — **ไม่ต้องครับ** Function component (ที่ใช้อยู่ทั้งโปรเจคนี้) คือมาตรฐานของ React/React Native ตั้งแต่ปี 2019 เป็นต้นมา เหตุผล:

- **Hook (`useState`, `useEffect`, `useFocusEffect`) ใช้ได้แค่กับ function component** — ถ้าเปลี่ยนเป็น class ต้องเขียนใหม่ทั้งหมดด้วย `this.state`/`componentDidMount` ซึ่งโค้ดยาวกว่าและมี `this` ที่สับสนง่ายกว่ามาก
- โค้ดทั้งโปรเจค (`LoginScreen`, `RegisterScreen`, `HomeScreen`) เป็น function component อยู่แล้ว — เปลี่ยนแค่บางส่วนจะกลายเป็นสไตล์ปนกัน ขัดกับเป้าหมาย "เป็นระบบ" พอดี

**"เป็นระบบ" ที่แท้จริงมาจาก 3 อย่างนี้แทน** (ไม่เกี่ยวกับ class/function เลย) ซึ่งเป็นเนื้อหาของคู่มือนี้ทั้งหมด:
1. **Design token** (หัวข้อ 1) — รวมค่าสี/ระยะห่างไว้ที่เดียว
2. **Component ที่ใช้ซ้ำได้** (หัวข้อ 2-3) — เขียน UI ซ้ำๆ (ปุ่ม, ช่องกรอกข้อมูล) แค่ครั้งเดียว
3. **TypeScript `type` กำหนด props** — บังคับว่า component แต่ละตัวรับอะไรได้บ้าง ผิดแล้ว error ทันทีตอนเขียนโค้ด

---

## 1. สร้าง `src/theme.ts` — Design Token

```typescript
// src/theme.ts
export const colors = {
  primary: '#2563eb',
  primaryText: '#ffffff',
  secondary: '#e5e7eb',
  secondaryText: '#1f2937',
  background: '#f9fafb',
  surface: '#ffffff',
  border: '#d1d5db',
  text: '#111827',
  textMuted: '#4b5563',
  label: '#374151',
  placeholder: '#9ca3af',
  error: '#dc2626',
  link: '#2563eb',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  pill: 999,
};

export const fontSize = {
  sm: 13,
  base: 14,
  title: 24,
};
```

**ทำไมต้องมีไฟล์นี้:** ก่อนรีแฟคเตอร์ แต่ละ screen เขียนค่าสีแบบ `'#2563eb'`, ระยะห่างแบบ `16`, `24` กระจายอยู่ในไฟล์ของตัวเอง — ถ้าอยากเปลี่ยนสีหลักของแอป (`primary`) ต้องไล่หาทุกไฟล์ที่พิมพ์ `'#2563eb'` ไว้แล้วแก้ทีละจุด เสี่ยงพลาด/แก้ไม่ครบ พอรวมไว้ที่ `theme.ts` ไฟล์เดียว **แก้ตรงนี้ที่เดียว มีผลกับทุก component/screen ที่ import ไปใช้ทันที**

**รูปแบบการตั้งชื่อ:** ตั้งชื่อตาม "บทบาท" ของสี (`primary`, `error`, `textMuted`) ไม่ใช่ตามหน้าตา (`blue`, `red`, `gray500`) — เพราะถ้าวันหนึ่งเปลี่ยนสีหลักจากน้ำเงินเป็นเขียว ชื่อ `primary` ยังอธิบายถูกต้องอยู่ (แต่ชื่อ `blue` จะผิดทันทีทั้งที่ค่าไม่ได้เป็นสีน้ำเงินแล้ว)

---

## 2. สร้าง `src/components/Button.tsx`

```typescript
// src/components/Button.tsx
import { Pressable, Text, StyleSheet, ActivityIndicator, type PressableProps } from 'react-native';
import { colors, radius, spacing, fontSize } from '../theme';

type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...pressableProps
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        typeof style === 'function' ? undefined : style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primaryText : colors.secondaryText} />
      ) : (
        <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  disabled: { opacity: 0.5 },
  primaryText: { color: colors.primaryText, fontWeight: '600', fontSize: fontSize.base },
  secondaryText: { color: colors.secondaryText, fontWeight: '600', fontSize: fontSize.base },
});
```

**อธิบายทีละส่วนที่สำคัญ:**

- **`ButtonProps = PressableProps & { title: string; variant?: ...; loading?: boolean }`** — ใช้ `&` (intersection type) รวม props มาตรฐานของ `Pressable` ทั้งหมด (`onPress`, `disabled`, ฯลฯ) เข้ากับ props ใหม่ที่เราเพิ่มเอง (`title`, `variant`, `loading`) — ทำให้ `<Button onPress={...} title="..." />` เรียกใช้ได้เหมือน `<Pressable>` ปกติ บวกความสามารถใหม่เพิ่มเข้ามา
- **`variant?: 'primary' | 'secondary'`** — **union type ของ string ที่ระบุค่าได้เท่านั้น** (ไม่ใช่ `string` เฉยๆ ที่รับอะไรก็ได้) พิมพ์ `variant="danger"` จะ error ทันทีตอนเขียนโค้ด เพราะไม่อยู่ใน 2 ค่านี้ — ป้องกันการพิมพ์ผิด/ใช้ variant ที่ไม่มีอยู่จริง
- **`loading` ครอบคลุม 2 สถานะในปุ่มเดียว:** ตอน `loading = true` ปุ่มจะ (1) กดไม่ได้ (`disabled={disabled || loading}`) และ (2) โชว์ `<ActivityIndicator>` แทนข้อความ — รวม logic "ระหว่างส่ง request ห้ามกดซ้ำ + ต้องมี feedback ว่ากำลังทำงานอยู่" ไว้ในที่เดียว ไม่ต้องเขียนซ้ำทุกหน้าที่มีปุ่ม submit
- **`{...pressableProps}`** (rest spread) — ส่ง props อื่นๆ ที่ไม่ได้ destructure ออกมาเป็นชื่อ (เช่น `onPress`) ต่อเข้า `<Pressable>` ตรงๆ ทำให้ `Button` ใช้งานได้ยืดหยุ่นเหมือน `Pressable` ทุกประการ

---

## 3. สร้าง `src/components/TextField.tsx`

```typescript
// src/components/TextField.tsx
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, spacing, radius, fontSize } from '../theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function TextField({ label, error, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[styles.input, !!error && styles.inputError, style]}
        {...inputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: fontSize.base, fontWeight: '500', color: colors.label, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.base,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: fontSize.sm, marginTop: spacing.xs },
});
```

**อธิบาย:**
- **รวม 3 อย่างที่ต้องเขียนคู่กันเสมอไว้ใน component เดียว:** label, ช่องกรอก, ข้อความ error ใต้ช่อง — ก่อนรีแฟคเตอร์ 3 อย่างนี้แยกเขียนเองทุกครั้งในแต่ละ screen (ดู `MOBILE_GUIDE.md` หัวข้อ 10-11) ตอนนี้เรียกแค่ `<TextField label="Email" ... />` บรรทัดเดียวจบ
- **`error?: string` เป็น optional (`?`)** — ไม่ส่ง prop นี้มาก็ได้ (ไม่มี error ก็ไม่ต้องส่ง) ถ้ามีค่า จะ (1) เปลี่ยนขอบช่องกรอกเป็นสีแดง (`styles.inputError`) และ (2) โชว์ข้อความ error ใต้ช่องนั้นให้อัตโนมัติ
- **`style={[styles.input, !!error && styles.inputError, style]}`** — array ของ style ผสมกัน 3 ชั้น: style พื้นฐานเสมอ → เพิ่ม style สีแดงถ้ามี error → เพิ่ม style ที่ผู้เรียกใช้ส่งมาเอง (ถ้ามี) ตัวหลังสุดใน array ชนะถ้า property ซ้ำกัน

---

## 4. รีแฟคเตอร์ `LoginScreen.tsx` ให้ใช้ Component ใหม่

**ก่อนรีแฟคเตอร์** (จาก `MOBILE_GUIDE.md`) แต่ละ `<TextInput>` เขียน style เองยาวๆ ซ้ำกันทั้งไฟล์ ปุ่ม submit ก็เขียน `<Pressable>` + เช็ค `loading` เองทุกจุด

**หลังรีแฟคเตอร์:**

```typescript
// src/screens/LoginScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { login, ApiError } from '../lib/api';
import { saveToken } from '../lib/token';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { colors, spacing, fontSize } from '../theme';

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
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="student1@uniplay.test"
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="********"
      />

      {error && <Text style={styles.formError}>{error}</Text>}

      <Button title="เข้าสู่ระบบ" onPress={handleSubmit} loading={loading} style={styles.submitButton} />

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize: fontSize.title, fontWeight: '600', marginBottom: spacing.lg, color: colors.text },
  formError: { color: colors.error, fontSize: fontSize.base, marginBottom: spacing.md },
  submitButton: { marginBottom: spacing.md },
  link: { color: colors.link, textAlign: 'center', fontSize: fontSize.base },
});
```

**จุดสำคัญ: error จาก login ไม่ได้ส่งผ่าน prop `error` ของ `TextField`** — แม้ `TextField` รองรับ error ต่อช่องได้ (หัวข้อ 3) แต่ error "Invalid credentials" ตอน login ผิด **ไม่รู้ว่าเกิดจาก email หรือ password ผิด** (backend จงใจตอบกลางๆ แบบนี้เพื่อความปลอดภัย — ดู `AUTH_GUIDE.md` หัวข้อ Security Checklist) ถ้าผูก error นี้เข้ากับช่อง password เฉยๆ จะทำให้ผู้ใช้เข้าใจผิดว่า email ถูกแน่นอน ทั้งที่ไม่รู้จริง — จึงแสดงเป็นข้อความแยกต่างหากใต้ทั้ง 2 ช่องแทน (`formError`)

**สไตล์ไฟล์เล็กลงชัดเจน:** `StyleSheet.create` เหลือแค่ style ของ layout ระดับ screen (`container`, `title`, `link`) ส่วน style ของปุ่ม/ช่องกรอกย้ายไปอยู่ใน component ของมันเองหมดแล้ว

ทำแบบเดียวกันกับ `RegisterScreen.tsx` และ `HomeScreen.tsx` ได้เลย (ดูโค้ดเต็มในโฟลเดอร์ `mobile/apps` — ทำเสร็จและทดสอบผ่านแล้ว)

---

## 5. States ที่ต้องมีครบในทุก component ที่รับ input/กดได้

| State | ตัวอย่างในคู่มือนี้ | ทำไมสำคัญ |
|---|---|---|
| **Default** | `<Button title="เข้าสู่ระบบ" />` ปกติ | สถานะพื้นฐานที่ผู้ใช้เห็นก่อนทำอะไร |
| **Loading** | `<Button loading={true} />` → โชว์ `ActivityIndicator` แทนข้อความ + กดซ้ำไม่ได้ | กันผู้ใช้กดซ้ำระหว่างรอ response (เช่น กด submit ซ้ำ 3 ครั้งเพราะคิดว่ากดไม่ติด) |
| **Disabled** | `<Button disabled={true} />` → จางลง (`opacity: 0.5`) + กดไม่ได้ | บอกชัดเจนด้วยสายตาว่าทำไมกดไม่ได้ ไม่ใช่ปุ่มพัง |
| **Error** | `<TextField error="..." />` → ขอบแดง + ข้อความใต้ช่อง | บอกตำแหน่งที่ผิดชัดเจน ไม่ต้องเดา |

**กฎสำคัญ:** component ที่ใช้ซ้ำ (`Button`, `TextField`) ต้องออกแบบให้ **รองรับทุก state ที่เป็นไปได้ตั้งแต่สร้างครั้งแรก** ไม่ใช่ค่อยแปะเพิ่มทีหลังทีละหน้า — เพราะถ้า `LoginScreen` ต้องการ loading state แต่ `RegisterScreen` ก็ต้องการเหมือนกัน การรองรับไว้ใน component กลางตั้งแต่แรกทำให้ทุกหน้าได้ feature นี้ไปพร้อมกันฟรีๆ โดยไม่ต้องเขียนซ้ำ

---

## 6. เช็คลิสต์ก่อนถือว่าทำเสร็จ

- [ ] `src/theme.ts` มีครบ `colors`, `spacing`, `radius`, `fontSize`
- [ ] `src/components/Button.tsx` รองรับ `variant` (primary/secondary), `loading`, `disabled`
- [ ] `src/components/TextField.tsx` รองรับ `label`, `error`
- [ ] `LoginScreen`, `RegisterScreen`, `HomeScreen` ไม่มีการเขียนค่าสี (`'#...'`) หรือตัวเลขระยะห่างตรงๆ อีกต่อไป (เรียกจาก `theme.ts` ทั้งหมด)
- [ ] `npx tsc --noEmit` ผ่านไม่มี error
- [ ] ลองกด submit ตอน loading ซ้ำๆ ปุ่มต้องกดไม่ติด (ทดสอบ state จริง ไม่ใช่แค่ดูโค้ด)

---

## 7. เชื่อมกับเอกสารอื่น

- **`MOBILE_GUIDE.md`** — คู่มือที่สร้างหน้าจอทั้ง 3 หน้าไว้ก่อน คู่มือนี้เป็นการรีแฟคเตอร์ต่อยอด
- **`FRONTEND_GUIDE.md`** / คู่มือ UX/UI ฝั่งเว็บ (ถัดไป) — concept เดียวกัน (design token + component reuse + states) นำไปใช้กับ Next.js/Tailwind ได้เหมือนกัน ต่างแค่ syntax การเขียน style
- **ขั้นต่อไปที่ยังไม่ทำในคู่มือนี้:** accessibility เจาะลึก (ขนาดพื้นที่กดขั้นต่ำสำหรับนิ้ว, contrast ratio ของสีตาม WCAG), dark mode (สลับ `theme.ts` เป็นชุดสีที่สอง), animation/transition ระหว่างเปลี่ยนหน้า
