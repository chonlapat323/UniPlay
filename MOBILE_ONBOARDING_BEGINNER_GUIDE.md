# สร้างหน้า Animated Onboarding สวยๆ ด้วย React Native — ฉบับคนไม่มีพื้นฐาน

> **เอกสารนี้สำหรับใคร:** คนที่ **ไม่เคยเขียนโปรแกรมมาก่อนเลย** หรือไม่เคยทำแอปมือถือ
> **เน้นอะไร:** การ **จัดหน้าจอ (UI)** และ **ทำให้สวย** — โค้ดอธิบายด้วยภาษาบ้านๆ เท่าที่จำเป็น
> **ทำจบแล้วได้อะไร:** แอปบนมือถือจริงที่มีหน้าแนะนำแอปแบบนี้ 👉 [ดูวิดีโอตัวอย่าง](https://youtube.com/shorts/AOD9FyiSR3U)
> **ถ้ามีพื้นฐานแล้ว:** ดูฉบับย่อที่ `MOBILE_ONBOARDING_GUIDE.md` แทนได้ (โค้ดชุดเดียวกัน)

ดีไซน์ต้นฉบับมาจาก [React-Native-UI-Templates](https://github.com/Aashu-Dubey/React-Native-UI-Templates/tree/main/src/introduction_animation) (MIT License) — โค้ดทุกชิ้นในเอกสารนี้ **ทดสอบแล้วว่าใช้ได้จริง** และตรงกับไฟล์ใน `mobile/onboarding` ทุกตัวอักษร

---

## สารบัญ

- **ส่วน A — เตรียมเครื่อง** (ติดตั้งโปรแกรม, รันแอปแรกบนมือถือ)
- **ส่วน B — พื้นฐานโค้ดเท่าที่ต้องรู้** (อ่านโค้ดให้ออก)
- **ส่วน C — การจัดหน้าจอ ⭐** (กล่อง, ระยะห่าง, Flexbox, ซ้อนชั้น, รูป, ตัวอักษร)
- **ส่วน D — หลักการทำให้สวย ⭐** (สี, ตัวอักษร, ระยะห่าง, ปุ่ม, การเคลื่อนไหว)
- **ส่วน E — Animation ฉบับง่าย** (ทำให้ของขยับ)
- **ส่วน F — สร้าง Onboarding ทีละไฟล์** (ลงมือจริง 5 Checkpoint)
- **ส่วน G — เมื่อเจอปัญหา / แบบฝึกหัด / คำศัพท์**

> **คำแนะนำสำหรับผู้สอน:** ส่วน A–E ใช้เวลาประมาณ 1 คาบ (มีแบบฝึกเล็กๆ 2 ชิ้นให้ลองมือ) ส่วน F อีก 1 คาบ

---

# ส่วน A — เตรียมเครื่อง

## A1. ภาพรวม: แอปมือถือที่เราจะทำ ทำงานยังไง

```
 คอมพิวเตอร์ (เขียนโค้ด)                 มือถือ (ดูผลลัพธ์)
┌──────────────────────┐   Wi-Fi    ┌──────────────────┐
│ VS Code  ← เขียนโค้ด  │ ─────────► │  แอป Expo Go      │
│ Terminal ← สั่งรันแอป  │  ส่งโค้ด   │  (แสดงแอปของเรา)   │
└──────────────────────┘            └──────────────────┘
```

- **React Native** = ภาษา/เครื่องมือสำหรับเขียนแอปมือถือ เขียนครั้งเดียวได้ทั้ง iPhone และ Android
- **Expo** = ชุดเครื่องมือที่ทำให้ React Native ใช้ง่ายขึ้นมาก
- **Expo Go** = แอปบนมือถือ ใช้ "เปิดดู" แอปที่เรากำลังเขียน โดยไม่ต้องติดตั้งจริง — แก้โค้ดในคอม มือถือเปลี่ยนตามทันที

## A2. ติดตั้งโปรแกรม 3 ตัว

| โปรแกรม | ใช้ทำอะไร | ติดตั้งที่ |
|---|---|---|
| **Node.js** (เวอร์ชัน LTS) | เครื่องยนต์ที่ใช้รันเครื่องมือทั้งหมด | [nodejs.org](https://nodejs.org) → ปุ่ม **LTS** → กด Next จนจบ |
| **VS Code** | โปรแกรมเขียนโค้ด (เหมือน Word แต่สำหรับโค้ด) | [code.visualstudio.com](https://code.visualstudio.com) |
| **Expo Go** (บนมือถือ) | ดูแอปของเราบนมือถือจริง | App Store / Play Store ค้นคำว่า "Expo Go" |

**เช็คว่าติดตั้ง Node สำเร็จ:** เปิด VS Code → กด `` Ctrl + ` `` (ปุ่มตัวหนอนใต้ Esc) จะมีกล่องดำๆ ด้านล่างโผล่ขึ้นมา เรียกว่า **Terminal** → พิมพ์แล้วกด Enter:

```bash
node -v
```

ถ้าขึ้นตัวเลขเช่น `v24.13.1` = สำเร็จ ✅

## A3. Terminal คืออะไร — ใช้แค่ 3 คำสั่ง

**Terminal** คือที่สั่งงานคอมด้วยการพิมพ์แทนการคลิก ในคอร์สนี้ใช้แค่นี้:

| คำสั่ง | ความหมาย | ตัวอย่าง |
|---|---|---|
| `cd ชื่อโฟลเดอร์` | เข้าไปในโฟลเดอร์ (เหมือนดับเบิลคลิกเปิดโฟลเดอร์) | `cd onboarding` |
| `cd ..` | ถอยออกมา 1 โฟลเดอร์ | `cd ..` |
| `Ctrl + C` | หยุดสิ่งที่กำลังรันอยู่ | กดตอนอยากปิดแอป |

> **⚠️ Windows เจอ error `running scripts is disabled on this system`** (เกิดบ่อยตอนพิมพ์ `npm`/`npx` ครั้งแรก) → พิมพ์คำสั่งนี้ 1 ครั้ง กด `Y` แล้วปิดเปิด VS Code ใหม่:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

## A4. สร้างแอปแรก

ใน Terminal ของ VS Code (ไปที่โฟลเดอร์ที่อยากเก็บงาน เช่น Desktop) พิมพ์ทีละบรรทัด:

```bash
npx create-expo-app@latest onboarding --template blank-typescript@sdk-57
cd onboarding
```

- คำสั่งแรก **สร้างโปรเจคใหม่ชื่อ `onboarding`** (รอ 1–3 นาที) ถ้าถามอะไรให้ตอบ `Y`
- `@sdk-57` = ล็อกเวอร์ชันให้ตรงกับแอป Expo Go ในมือถือ (ถ้าไม่ใส่ อาจเจอ error ว่าเวอร์ชันไม่ตรง — ดูส่วน G)
- คำสั่งที่สอง **เข้าไปในโฟลเดอร์โปรเจค** — **ทุกคำสั่งหลังจากนี้ต้องรันในโฟลเดอร์นี้**

จากนั้นใน VS Code: **File → Open Folder** → เลือกโฟลเดอร์ `onboarding` จะเห็นไฟล์ทางซ้าย

## A5. รันแอปบนมือถือ

```bash
npx expo start --go
```

จะมี **QR Code** ขึ้นใน Terminal:
- **iPhone:** เปิดแอปกล้อง สแกน QR → กดลิงก์ที่เด้งขึ้นมา
- **Android:** เปิดแอป Expo Go → กด "Scan QR code"

มือถือกับคอมต้องต่อ **Wi-Fi วงเดียวกัน** — ถ้าเปิดได้จะเห็นข้อความ `Open up App.tsx to start working on your app!` 🎉

**ลองเล่น:** เปิดไฟล์ `App.tsx` ใน VS Code แก้ข้อความในบรรทัด `Open up App.tsx...` เป็นชื่อตัวเอง แล้วกด `Ctrl + S` (บันทึก) → **มือถือเปลี่ยนตามทันที** ไม่ต้องรันใหม่ (เรียกว่า Fast Refresh)

> ทุกครั้งที่ปิดคอมแล้วกลับมาทำต่อ: เปิด Terminal → `cd` เข้าโฟลเดอร์ → `npx expo start --go` → สแกน QR ใหม่

## A6. ติดตั้งของเสริม + โหลดรูปประกอบ

หยุดแอปก่อน (`Ctrl + C`) แล้วรัน:

```bash
npx expo install react-native-safe-area-context @expo/vector-icons
```

- `react-native-safe-area-context` = ช่วยไม่ให้ปุ่มไปทับรอยบาก/ขอบจอมือถือ
- `@expo/vector-icons` = ไอคอนสำเร็จรูป (ลูกศร ฯลฯ)

**โหลดรูปประกอบ 5 รูป** (Windows — วางทั้งก้อนใน Terminal แล้วกด Enter):

```powershell
New-Item -ItemType Directory -Force assets/onboarding
$base = "https://raw.githubusercontent.com/Aashu-Dubey/React-Native-UI-Templates/main/src/assets/introduction_animation"
foreach ($f in "introduction_image","relax_image","care_image","mood_dairy_image","welcome") {
  Invoke-WebRequest "$base/$f.png" -OutFile "assets/onboarding/$f.png"
}
```

(Mac: ใช้คำสั่ง `curl` ใน `MOBILE_ONBOARDING_GUIDE.md` หัวข้อ 4)

เปิดโฟลเดอร์ `assets/onboarding` ใน VS Code ต้องเห็นรูป 5 ไฟล์ ✅

---

# ส่วน B — พื้นฐานโค้ดเท่าที่ต้องรู้

ไม่ต้องจำทั้งหมด แค่ **อ่านออก** ก็พอ — ตอนลงมือจริงเราจะ copy โค้ดที่เตรียมไว้

## B1. Component = "ชิ้นส่วนหน้าจอ" 1 ชิ้น

แอปประกอบจากชิ้นส่วนเล็กๆ เหมือนเลโก้ แต่ละชิ้นเรียกว่า **component** เขียนเป็นฟังก์ชันที่ **คืนค่าเป็นหน้าตา**:

```tsx
export default function App() {   // ชื่อ component: App
  return (                          // คืนค่า "หน้าตา" ออกไป
    <View>
      <Text>สวัสดี</Text>
    </View>
  );
}
```

ไฟล์นามสกุล **`.tsx`** = ไฟล์ที่มีทั้งโค้ดและหน้าตาอยู่ด้วยกัน

## B2. JSX = เขียนหน้าตาด้วย "แท็ก"

ส่วนที่อยู่ใน `return ( ... )` เรียกว่า **JSX** หน้าตาคล้าย HTML ของเว็บ:

| สิ่งที่เห็น | ความหมาย |
|---|---|
| `<View> ... </View>` | แท็กเปิด–ปิด ของที่อยู่ข้างในเป็น "ลูก" ของมัน |
| `<Image ... />` | แท็กที่ไม่มีลูก ปิดในตัวด้วย `/>` |
| `style={styles.title}` | ใส่การตกแต่งให้แท็กนั้น |
| `{ ... }` | ช่องสำหรับใส่ "ค่า" ที่ไม่ใช่ข้อความตรงๆ เช่นตัวแปร |
| `{/* ข้อความ */}` | **comment** = โน้ตอธิบาย โปรแกรมไม่สนใจ |
| `// ข้อความ` | comment แบบ 1 บรรทัด (ใช้นอก JSX) |

## B3. import = "หยิบของจากที่อื่นมาใช้"

```tsx
import { View, Text } from 'react-native';      // หยิบ View, Text จากชุดเครื่องมือ React Native
import { palette } from './src/palette';         // หยิบ palette จากไฟล์ของเราเอง
```

ถ้าใช้อะไรโดยไม่ได้ import ไว้ด้านบน → error ทันที

## B4. ตัวแปรและ object

```tsx
const title = 'Relax';          // ตัวแปรเก็บข้อความ
const size = 26;                // ตัวแปรเก็บตัวเลข
const palette = {               // object = กล่องที่เก็บหลายค่า มีชื่อกำกับ
  background: 'rgb(245, 235, 226)',
  button: 'rgb(21, 32, 54)',
};
palette.button                  // อ่านค่าข้างใน -> 'rgb(21, 32, 54)'
```

> อยากเข้าใจลึกขึ้นเรื่อง `useState` / `useRef` / `useEffect` / props ดู `MOBILE_ONBOARDING_GUIDE.md` หัวข้อ 1.5 — สำหรับคอร์สนี้ เดี๋ยวอธิบายตอนเจอในโค้ด

---

# ส่วน C — การจัดหน้าจอ ⭐

นี่คือหัวใจของการทำ UI — **ทุกหน้าจอในโลกประกอบจาก "กล่อง" ซ้อนกัน**

## C1. ชิ้นส่วนพื้นฐาน 4 ตัว

| Component | คืออะไร | เทียบกับ |
|---|---|---|
| `View` | กล่องเปล่า ใช้จัดกลุ่ม/จัดตำแหน่ง | กล่องกระดาษ |
| `Text` | ข้อความ — **ข้อความทุกตัวต้องอยู่ใน `<Text>` เสมอ** | ป้ายชื่อ |
| `Image` | รูปภาพ | รูปถ่าย |
| `Pressable` | พื้นที่กดได้ (ใช้ทำปุ่ม) | สวิตช์ |

## C2. Style — การตกแต่ง

```tsx
<Text style={styles.title}>Relax</Text>

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', color: 'black' },
});
```

- เขียนการตกแต่งรวมไว้ใน `StyleSheet.create({ ... })` ท้ายไฟล์ แล้วเรียกใช้ด้วย `style={styles.ชื่อ}`
- **ตัวเลขไม่มีหน่วย** (ไม่ต้องเขียน px) — React Native ปรับขนาดให้เหมาะกับความละเอียดจอให้เอง
- **สี** เขียนได้ 3 แบบ: ชื่อ `'white'`, รหัส `'#132137'`, หรือ `'rgb(245, 235, 226)'` (แดง, เขียว, น้ำเงิน 0–255)
- ใส่หลาย style พร้อมกันได้ด้วย `[ ]`: `style={[styles.title, { color: 'red' }]}` (ตัวหลังชนะ)

## C3. ขนาด, ระยะห่าง, มุมมน (Box Model)

ทุกกล่องมีชั้นแบบนี้:

```
             margin (ระยะห่าง "ข้างนอก" — ดันกล่องอื่นออกไป)
   ┌─────────────────────────────────────┐
   │  padding (ระยะห่าง "ข้างใน")          │ ← ขอบกล่อง
   │   ┌─────────────────────────────┐   │
   │   │      เนื้อหา (ข้อความ/รูป)     │   │
   │   └─────────────────────────────┘   │
   └─────────────────────────────────────┘
```

| Style | ทำอะไร | ตัวอย่างในงานนี้ |
|---|---|---|
| `width` / `height` | ความกว้าง/สูง (ใส่ `'100%'` = เต็มพื้นที่แม่) | ปุ่มสูง `58` |
| `padding` | เว้นที่ว่าง **ข้างใน** ขอบ | `paddingHorizontal: 56` ปุ่มเลยกว้างพอดีข้อความ |
| `paddingHorizontal` / `paddingVertical` | เว้นเฉพาะซ้าย-ขวา / บน-ล่าง | |
| `margin` / `marginBottom` | เว้นที่ว่าง **ข้างนอก** | `marginBottom: 16` ระหว่างจุดกับปุ่ม |
| `borderRadius` | ความมนของมุม | `borderRadius: 29` |

**เคล็ดลับวงกลม/ปุ่มแคปซูล:** `borderRadius` = **ครึ่งหนึ่งของความสูง** → ปลายโค้งพอดี
ปุ่มสูง `58` → `borderRadius: 29` ได้ปุ่มทรงแคปซูล, กล่อง `10×10` + `borderRadius: 5` ได้วงกลม (จุด dot ในงานนี้)

## C4. Flexbox — จัดของในกล่องให้อยู่ตรงไหน

นี่คือเรื่องที่สำคัญที่สุดของการจัดหน้าจอ จำ 4 ตัวนี้:

**1) `flex: 1` = ขยายเต็มพื้นที่ที่เหลือ** — กล่องนอกสุดของหน้าจอเกือบทุกหน้าจะมี `flex: 1` (ไม่งั้นกล่องจะเล็กเท่าเนื้อหาข้างใน)

**2) `flexDirection` = เรียงลูกแนวไหน**

```
flexDirection: 'column' (ค่าเริ่มต้น)      flexDirection: 'row'
┌──────────┐                              ┌──────────────────────┐
│  [ A ]   │                              │ [ A ] [ B ] [ C ]    │
│  [ B ]   │  เรียงบนลงล่าง                │ เรียงซ้ายไปขวา        │
│  [ C ]   │                              └──────────────────────┘
└──────────┘
```

> ⚠️ ต่างจากเว็บ: ในแอปมือถือ **ค่าเริ่มต้นคือแนวตั้ง (column)** เพราะจอมือถือยาวลง

**3) `justifyContent` = จัดตาม "แกนหลัก"** (แนวเดียวกับที่เรียง — ถ้า column คือแนวตั้ง)
**4) `alignItems` = จัดตาม "แกนรอง"** (แนวตั้งฉาก — ถ้า column คือแนวนอน)

```
(column)  justifyContent: 'center'     alignItems: 'center'        ทั้งสองอย่าง
┌──────────┐                     ┌──────────┐                ┌──────────┐
│          │                     │  [ A ]   │                │          │
│ [ A ]    │                     │  [ B ]   │                │  [ A ]   │
│ [ B ]    │  กลางแนวตั้ง          │          │  กลางแนวนอน     │  [ B ]   │ ← กลางจอพอดี
│          │                     │          │                │          │
└──────────┘                     └──────────┘                └──────────┘
```

| ค่าที่ใช้บ่อย | ผลลัพธ์ |
|---|---|
| `'center'` | อยู่ตรงกลาง |
| `'flex-start'` / `'flex-end'` | ชิดต้น / ชิดท้าย |
| `'space-between'` | ตัวแรกชิดซ้าย ตัวสุดท้ายชิดขวา ที่เหลือแบ่งช่องเท่าๆ กัน — ใช้ทำแถบ "ปุ่มย้อนกลับ ซ้าย ... Skip ขวา" |

**5) `gap: 16`** = เว้นระยะระหว่างลูกทุกตัวเท่ากัน (ไม่ต้องใส่ margin ทีละตัว)

## C5. ซ้อนชั้น — `position: 'absolute'`

ปกติกล่องจะเรียงต่อกันไม่ทับกัน แต่บางครั้งเราอยาก **วางทับกัน** (เช่น ปุ่มลอยอยู่บนรูป) ใช้:

```tsx
container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
```

- `position: 'absolute'` = หลุดจากการเรียงปกติ ลอยได้อิสระ
- `top` / `bottom` / `left` / `right` = ห่างจากขอบแม่เท่าไหร่ (ใส่ทั้ง 4 ตัวเป็น 0 = เต็มแม่พอดี)
- **อะไรเขียนทีหลังในโค้ด จะอยู่ชั้นบน** (เหมือนวางกระดาษทับกัน แผ่นที่วางหลังสุดอยู่บนสุด)

```
หน้า Onboarding ของเราซ้อนกัน 4 ชั้น:
  ชั้นบนสุด  ▸ ปุ่มด้านล่าง (CenterNextButton)    ← เขียนหลังสุดในโค้ด
             ▸ แถบปุ่มด้านบน (TopBackSkipView)
             ▸ ฉากเนื้อหา 4 ฉาก (วางซ้อนกันตรงกลาง)
  ชั้นล่างสุด ▸ หน้า Splash                       ← เขียนก่อนสุดในโค้ด
```

## C6. รูปภาพ

```tsx
<Image
  source={require('../../assets/onboarding/welcome.png')}
  style={{ width: '100%', height: undefined, aspectRatio: 351 / 360 }}
/>
```

- `require('path')` = บอกว่ารูปอยู่ไฟล์ไหน (path นับจากไฟล์ที่เขียน — `..` แปลว่าถอยออก 1 โฟลเดอร์)
- **`aspectRatio` = สัดส่วนกว้าง : สูง** — กำหนดแค่ความกว้าง แล้วให้คำนวณความสูงเอง **รูปจะไม่บิดเบี้ยว** ไม่ว่าจอจะใหญ่แค่ไหน (รูปบิด = ดูไม่มืออาชีพทันที)
- `maxWidth` / `maxHeight` = "ห้ามใหญ่เกินนี้" — จอใหญ่รูปก็ไม่ยืดจนแตก

## C7. ตัวอักษร

| Style | ทำอะไร |
|---|---|
| `fontSize: 26` | ขนาด |
| `fontWeight: '700'` | ความหนา (`'400'` ปกติ, `'700'` ตัวหนา) |
| `textAlign: 'center'` | จัดกลาง |
| `lineHeight: 22` | ระยะห่างระหว่างบรรทัด (อ่านสบายตาขึ้น) |
| `color: 'grey'` | สีตัวอักษร |
| `{'\n'}` ในข้อความ | ขึ้นบรรทัดใหม่ |

## C8. Safe Area — อย่าวางของทับรอยบาก

มือถือสมัยนี้มี **รอยบาก/กล้อง** ด้านบน และ **แถบ home** ด้านล่าง ถ้าวางปุ่มทับตรงนั้นจะกดไม่ได้หรือดูไม่สวย

```tsx
const insets = useSafeAreaInsets();          // ถามว่าขอบบน/ล่างต้องเว้นเท่าไหร่
style={{ paddingBottom: 8 + insets.bottom }}  // เว้น 8 + ความสูงแถบ home
```

> ต้องมี `<SafeAreaProvider>` ครอบทั้งแอปใน `App.tsx` ก่อนเสมอ (เดี๋ยวใส่ในส่วน F)

## C9. แบบฝึก — ทำ "การ์ดสวยๆ" 1 ใบ 🎨

ฝึกใช้ทุกอย่างในส่วน C ก่อนทำของจริง: **เปิด `App.tsx` ลบของเดิมทิ้งทั้งหมด แล้ววางโค้ดนี้** → บันทึก → ดูที่มือถือ

```tsx
// =============================================================================
// แบบฝึก C9 — การ์ดสวยๆ 1 ใบ (ฝึกจัด UI ก่อนเริ่มทำ Onboarding จริง)
// วางทับ App.tsx ทั้งไฟล์ เพื่อลองเล่น — ตอนทำ Onboarding จริงจะเปลี่ยน App.tsx อีกที
// =============================================================================
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

export default function App() {
  return (
    // ชั้นนอกสุด: พื้นหลังเต็มจอ จัดของข้างในไว้ตรงกลางทั้งแนวตั้งและแนวนอน
    <View style={styles.screen}>
      {/* การ์ด: กล่องสีขาวมุมมน มีเงา ลอยอยู่บนพื้นหลัง */}
      <View style={styles.card}>
        <Image source={require('./assets/onboarding/welcome.png')} style={styles.image} />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Stay organised and live stress-free with you-do app</Text>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Let&apos;s begin</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // ยืดเต็มจอ
    backgroundColor: 'rgb(245, 235, 226)', // ครีม
    justifyContent: 'center', // แกนหลัก (แนวตั้ง) -> กลางจอ
    alignItems: 'center', // แกนรอง (แนวนอน) -> กลางจอ
    padding: 24, // ระยะห่างจากขอบจอทุกด้าน
  },
  card: {
    width: '100%', // กว้างเต็มพื้นที่ที่เหลือ (จอ - padding ซ้ายขวา)
    backgroundColor: 'white',
    borderRadius: 24, // มุมมน
    padding: 24, // ระยะห่างระหว่างขอบการ์ดกับของข้างใน
    alignItems: 'center', // ของในการ์ดอยู่กลางแนวนอน
    // เงา (iOS ใช้ 4 บรรทัดนี้)
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    // เงา (Android ใช้ตัวนี้)
    elevation: 6,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 351 / 360, // สัดส่วนรูปจริง รูปจะไม่บิด
    marginBottom: 16, // ระยะห่างจากรูปลงไปหาหัวข้อ
  },
  title: { fontSize: 26, fontWeight: '700', color: 'black', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'grey', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  button: {
    backgroundColor: 'rgb(21, 32, 54)', // กรมท่า
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 29, // ปุ่มสูงประมาณ 58 -> ครึ่งหนึ่ง = ปลายโค้งสนิท
  },
  buttonText: { color: 'white', fontSize: 18 },
});
```

ผลที่ควรเห็น:

```
┌──────────────────────────────┐  ← พื้นครีม (screen)
│                              │
│  ┌────────────────────────┐  │  ← การ์ดขาว มุมมน มีเงา (card)
│  │      [  รูปภาพ  ]       │  │
│  │                        │  │
│  │        Welcome         │  │  ← หัวข้อตัวหนา
│  │   Stay organised ...   │  │  ← คำอธิบายสีเทา
│  │                        │  │
│  │   ( Let's begin )      │  │  ← ปุ่มแคปซูลกรมท่า
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

**ลองแก้แล้วดูผล (ฝึกตา):**
1. เปลี่ยน `borderRadius: 24` ของ card เป็น `0` แล้วเป็น `48` — แบบไหนดูนุ่มนวลกว่า?
2. ลบ 5 บรรทัดเงา (`shadow...` และ `elevation`) — การ์ดดู "แบน" ลงแค่ไหน?
3. เปลี่ยน `padding: 24` ของ card เป็น `4` — ทำไมดูอึดอัด?
4. เปลี่ยน `justifyContent: 'center'` เป็น `'flex-start'` — การ์ดย้ายไปไหน?

---

# ส่วน D — หลักการทำให้สวย ⭐

"สวย" ไม่ใช่โชค — มีหลักที่อธิบายได้ แกะจากดีไซน์ต้นฉบับที่เราจะทำ:

## D1. สี — ใช้น้อยสี ใช้ให้มีบทบาท

ทั้งหน้าใช้สีหลักแค่ **3 สี**:

| สี | รหัส | บทบาท | ทำไมสวย |
|---|---|---|---|
| ครีม | `rgb(245, 235, 226)` | พื้นหลัง (~70% ของจอ) | อุ่นกว่าสีขาวล้วน ดูนุ่มนวล ไม่แสบตา |
| กรมท่าเข้ม | `rgb(21, 32, 54)` | ปุ่ม + จุดที่เลือก (~10%) | เข้มตัดกับพื้นครีม **สายตาวิ่งไปหาปุ่มทันที** |
| ดำ/เทา | `black`, `grey` | ตัวอักษร | หัวข้อดำ (สำคัญ) คำอธิบายเทา (รอง) |

**หลัก:**
- **สีเด่นใช้แค่กับสิ่งที่อยากให้กด** — ถ้าทุกอย่างเข้มหมด จะไม่รู้ว่าต้องกดอะไร
- **ความต่างของสี (contrast) ต้องพอ** — ตัวอักษรขาวบนปุ่มกรมท่าอ่านง่าย, ถ้าเป็นเทาอ่อนบนครีมจะอ่านยาก
- **รวมสีไว้ไฟล์เดียว** (`palette.ts`) — เปลี่ยนโทนทั้งแอปได้ในที่เดียว และไม่เผลอใช้สีมั่ว

## D2. ตัวอักษร — มีลำดับชั้นชัดเจน

```
Relax                                  ← หัวข้อ: 26 ตัวหนา สีดำ  (อ่านก่อน)
Lorem ipsum dolor sit amet ...         ← คำอธิบาย: 14 ปกติ       (อ่านทีหลัง)
```

- **ขนาดต่างกันชัดๆ** (26 vs 14) — ต่างนิดเดียว (16 vs 14) ตาจะแยกไม่ออกว่าอะไรสำคัญ
- **หัวข้อหนา คำอธิบายบาง** — ความหนาก็เป็นตัวบอกความสำคัญ
- **จัดกลางทั้งหมด** — หน้า Onboarding เน้นทีละเรื่อง จัดกลางดูสมดุลเหมือนโปสเตอร์
- **คำอธิบายสั้นและแคบ** (`paddingHorizontal: 64`) — บรรทัดยาวเกินไปอ่านเหนื่อย

## D3. ระยะห่าง — ที่ว่างคือส่วนหนึ่งของดีไซน์

- **ใช้ตัวเลขชุดเดิมซ้ำๆ:** 8, 16, 24, 32, 56, 64 (ทวีคูณของ 8) — ทั้งหน้าเลยดู "เป็นระเบียบ" แม้ไม่ได้วัดทุกจุด ตรงข้ามกับ 13, 17, 27 ที่ดูสุ่ม
- **กล้าเว้นที่ว่าง** — หน้าที่ดูหรูมักมีที่ว่างเยอะ ของน้อย (Onboarding แต่ละฉากมีแค่ รูป + หัวข้อ + คำอธิบาย)
- **ของที่เกี่ยวกันอยู่ใกล้กัน** — หัวข้อกับคำอธิบายชิดกัน (16) แต่ห่างจากปุ่ม — ตาจะจัดกลุ่มให้เอง

## D4. ปุ่ม — ใหญ่พอ เด่นพอ ชัดว่ากดได้

- **สูงอย่างน้อย ~48** (ในงานนี้ 58) — นิ้วคนใหญ่กว่าเมาส์ ปุ่มเล็กกดพลาดบ่อย
- **ทรงแคปซูล** (`borderRadius` = ครึ่งความสูง) — ดูเป็นมิตร ชวนกด
- **มีปุ่มหลักแค่ 1 ปุ่มต่อหน้าจอ** — Skip เป็นแค่ข้อความ ไม่ใช่ปุ่มทึบ เพราะไม่อยากให้กดมากกว่าปุ่มหลัก
- **เอฟเฟกต์ตอนกด** (`android_ripple`) — ให้ผู้ใช้รู้ว่ากดติดแล้ว

## D5. รูปประกอบ — สไตล์เดียวกันทั้งชุด

รูปทั้ง 5 รูปวาดสไตล์เดียวกัน (โทนสี ลายเส้นเหมือนกัน) — ถ้าเอารูปถ่าย + การ์ตูน + ไอคอนมาปนกัน จะดูไม่เป็นชุดทันที

## D6. การเคลื่อนไหว — ทำให้ "รู้สึก" ลื่น ไม่ใช่แค่ขยับ

สิ่งที่ทำให้ Onboarding นี้ดูแพง (เดี๋ยวทำจริงในส่วน F):

| เทคนิค | ทำอย่างไร | รู้สึกอย่างไร |
|---|---|---|
| **Easing** (ความเร็วไม่คงที่) | เร่งออกตัว แล้วค่อยๆ ชะลอตอนจบ | เป็นธรรมชาติ เหมือนของจริงที่มีแรงเฉื่อย (ความเร็วคงที่จะดูแข็งเหมือนหุ่นยนต์) |
| **Parallax** (เร็วไม่เท่ากัน) | รูป > คำอธิบาย > ตัวฉาก เลื่อนเร็วต่างกัน | มีมิติ มีชั้นหน้า-หลัง เหมือนกล้องแพน |
| **ไม่ขยับพร้อมกันหมด** | หัวข้อไหลมาเข้าที่ช้ากว่านิดนึง, ปุ่มเปลี่ยนรูปหลังฉากเข้า | ตามองตามทีละอย่างได้ ไม่วุ่นวาย |
| **เปลี่ยนรูปแทนการสลับ** | ปุ่มลูกศรวงกลม "ยืด" เป็นปุ่ม Sign Up | ต่อเนื่อง ไม่กะพริบ ผู้ใช้รู้ว่าเป็นปุ่มเดิม |
| **ความเร็วพอดี** | 1.6 วินาทีต่อฉาก | ช้าพอให้รู้สึกหรู (ดูครั้งเดียว) — ถ้าเป็นปุ่มที่กดบ่อยควรเร็วกว่านี้มาก (~0.3 วิ) |

---

# ส่วน E — Animation ฉบับง่าย

## E1. ความคิดหลัก: "ตัวเลข 1 ตัว ที่ค่อยๆ เปลี่ยน"

animation ทั้งหมดในแอปนี้ มาจากไอเดียเดียว:

> มี **ตัวเลข** 1 ตัว (เริ่มที่ 0) → สั่งให้มัน **ค่อยๆ เปลี่ยน** ไปเป็นค่าใหม่ (เช่น 1) ในเวลาที่กำหนด → แล้ว **ผูกตัวเลขนั้นเข้ากับตำแหน่ง/สี/ขนาด** ของกล่อง → กล่องก็ขยับตามตัวเลขเอง

เปรียบเหมือน **หรี่ไฟ (dimmer):** หมุนปุ่ม 0 → 100% ไฟค่อยๆ สว่างขึ้น — ปุ่มคือ "ตัวเลข", ความสว่างคือ "สิ่งที่ขยับตาม"

## E2. 3 คำที่ต้องรู้

| คำ | หน้าที่ | เทียบกับ |
|---|---|---|
| `Animated.Value(0)` | ตัวเลขที่เปลี่ยนค่าได้ลื่นๆ เริ่มที่ 0 | ปุ่มหมุนหรี่ไฟ |
| `Animated.timing(...)` | สั่งให้ตัวเลขค่อยๆ วิ่งไปค่าใหม่ ใช้เวลาเท่าไหร่ | มือที่หมุนปุ่ม |
| `.interpolate(...)` | แปลงตัวเลขเป็นค่าที่ใช้จริง (ตำแหน่ง, สี) | สายไฟที่ต่อปุ่มเข้ากับหลอด |

**interpolate แบบเข้าใจง่ายที่สุด:**

```tsx
progress.interpolate({
  inputRange:  [0,    1],      // ตัวเลขเป็น 0 ...      ตัวเลขเป็น 1 ...
  outputRange: [-100, 100],    // ... ให้อยู่ที่ -100     ... ให้อยู่ที่ 100
})
```

อ่านว่า: **"ถ้าตัวเลขเป็น 0 ให้อยู่ -100, ถ้าเป็น 1 ให้อยู่ 100"** ระหว่างกลาง (เช่น 0.5) คำนวณให้เอง (= 0)

## E3. ขยับด้วย `transform`

```tsx
transform: [{ translateX: 100 }]   // เลื่อนไปทางขวา 100 (ติดลบ = ซ้าย)
transform: [{ translateY: -50 }]   // เลื่อนขึ้น 50 (บวก = ลง)
```

`translate` = เลื่อนกล่อง **โดยไม่ไปเบียดกล่องอื่น** (ต่างจาก margin)

## E4. กฎ 2 ข้อที่ห้ามลืม

1. ของที่จะขยับต้องเป็น **`Animated.View` / `Animated.Text` / `Animated.Image`** — ใช้ `View` ธรรมดาจะไม่ขยับ
2. ถ้า animate **สี หรือ ความกว้าง** ต้องตั้ง **`useNativeDriver: false`** ไม่งั้น error

## E5. แบบฝึก — กล่องเลื่อนได้ + เปลี่ยนสีได้ 🎮

**ลบ `App.tsx` ทั้งหมด แล้ววางโค้ดนี้** → กดปุ่มดู:

```tsx
// =============================================================================
// แบบฝึก E5 — กล่องเลื่อนได้ + เปลี่ยนสีได้ (ฝึก animation ก่อนทำ Onboarding จริง)
// วางทับ App.tsx ทั้งไฟล์ เพื่อลองเล่น
// =============================================================================
import { useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';

export default function App() {
  // ตัวเลข animation เริ่มที่ 0 (0 = อยู่ซ้าย, 1 = อยู่ขวา)
  const progress = useRef(new Animated.Value(0)).current;

  // สั่งให้ตัวเลขวิ่งไปที่ค่าใหม่ ใช้เวลา 0.8 วินาที
  function moveTo(toValue: number) {
    Animated.timing(progress, {
      toValue,
      duration: 800,
      useNativeDriver: false, // ต้อง false เพราะเรา animate สี
    }).start();
  }

  // แปลงตัวเลข 0..1 เป็นตำแหน่ง -100..100 (ติดลบ = ไปซ้าย)
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  // แปลงตัวเลข 0..1 เป็นสี เทาอ่อน -> กรมท่า
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E3E4E4', 'rgb(21, 32, 54)'],
  });

  return (
    <View style={styles.screen}>
      {/* กล่องที่ขยับได้ ต้องเป็น Animated.View เท่านั้น */}
      <Animated.View style={[styles.box, { backgroundColor, transform: [{ translateX }] }]} />

      <View style={styles.row}>
        <Pressable style={styles.button} onPress={() => moveTo(0)}>
          <Text style={styles.buttonText}>← ซ้าย</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => moveTo(1)}>
          <Text style={styles.buttonText}>ขวา →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'rgb(245, 235, 226)', justifyContent: 'center', alignItems: 'center', gap: 48 },
  box: { width: 80, height: 80, borderRadius: 16 },
  row: { flexDirection: 'row', gap: 16 }, // flexDirection: 'row' = วางปุ่มเรียงแนวนอน
  button: { backgroundColor: 'rgb(21, 32, 54)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 },
  buttonText: { color: 'white', fontSize: 16 },
});
```

กด "ขวา →" กล่องจะ **เลื่อนไปขวา และเปลี่ยนจากเทาเป็นกรมท่าพร้อมกัน** — เพราะทั้งตำแหน่งและสี interpolate จากตัวเลขตัวเดียวกัน (นี่คือหลักการเดียวกับ Onboarding ทั้งหน้า!)

**ลองแก้:**
1. `duration: 800` → `3000` (ช้าลง) และ `150` (เร็วมาก) — แบบไหนรู้สึกดีสุด?
2. เพิ่ม `easing: Easing.bounce,` ใต้ `duration` (และเพิ่ม `Easing` ในบรรทัด `import { ... } from 'react-native'` ด้วย ไม่งั้น error) — กล่องเด้งไหม?
3. `outputRange: [-100, 100]` → `[-150, 150]` — เลื่อนไกลขึ้นไหม?

---

# ส่วน F — สร้าง Onboarding ทีละไฟล์

ถึงเวลาทำของจริง! ทุกขั้นมี **✅ Checkpoint** ให้ดูผลบนมือถือ

> **วิธี copy:** ทุกบล็อกโค้ดในส่วนนี้คือ **ไฟล์ฉบับเต็ม** — ถ้าบอก "สร้างไฟล์" ให้สร้างไฟล์ใหม่แล้ววางทั้งหมด, ถ้าบอก "แทนที่ทั้งไฟล์" ให้ลบของเดิมทิ้งแล้ววางใหม่ — **ไม่ต้องแทรกบรรทัดเอง**
> **ทุกไฟล์มี comment ภาษาไทย** อธิบายแต่ละบรรทัดอยู่ในโค้ดแล้ว อ่านไปพร้อมกันได้เลย

## F0. แผนผังไฟล์ที่จะสร้าง

```
onboarding/
├── App.tsx                      ← ไฟล์เริ่มต้นของแอป (มีอยู่แล้ว จะแทนที่)
├── assets/onboarding/*.png      ← รูป 5 รูป (โหลดแล้วใน A6)
└── src/                         ← โฟลเดอร์ใหม่ เก็บโค้ดของเรา
    ├── palette.ts               ← สีทั้งหมด
    ├── OnboardingScreen.tsx     ← "ผู้กำกับ" คุมทุกฉาก
    └── scenes/                  ← โฟลเดอร์ใหม่ เก็บแต่ละฉาก
        ├── SplashScene.tsx      ← หน้าแรก
        ├── RelaxScene.tsx       ← ฉาก 1
        ├── CareScene.tsx        ← ฉาก 2
        ├── MoodDiaryScene.tsx   ← ฉาก 3
        ├── WelcomeScene.tsx     ← ฉาก 4 (สุดท้าย)
        ├── NextButtonArrow.tsx  ← ปุ่มลูกศรที่ยืดเป็น Sign Up
        ├── CenterNextButton.tsx ← ส่วนล่าง: จุด + ปุ่ม
        └── TopBackSkipView.tsx  ← ส่วนบน: ย้อนกลับ + Skip
```

**วิธีสร้างไฟล์ใน VS Code (ไม่พลาดตำแหน่ง):** คลิกขวาที่ชื่อโปรเจคแถบซ้าย → **New File...** → พิมพ์ path เต็มเช่น `src/scenes/SplashScene.tsx` → Enter (VS Code สร้างโฟลเดอร์ให้เอง)
⚠️ **ต้องพิมพ์ `src/` นำหน้าเสมอ** — ถ้าไฟล์ไปอยู่ผิดโฟลเดอร์ แอปจะหาไม่เจอแล้ว error

## F1. ไอเดียของทั้งหน้า (อ่านก่อนเขียน)

ใช้หลักเดียวกับแบบฝึก E5 แต่ใหญ่ขึ้น: มี **ตัวเลข 1 ตัว** ชื่อ `animationController` วิ่งจาก **0 ถึง 0.8** ทีละ 0.2 (กดปุ่ม 1 ครั้ง = 0.2):

```
ตัวเลข:  0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
หน้าจอ:  Splash    Relax       Care        Mood Dairy   Welcome
```

ทุกฉากอ่านตัวเลขตัวเดียวกันนี้ แล้ว **รู้เองว่าตัวเองต้องเข้าจอตอนไหน** — เหมือนนักแสดงหลายคนดูนาฬิกาเรือนเดียวกัน แต่ละคนรู้คิวของตัวเอง

## F2. สร้าง `src/palette.ts` — กล่องสี

ตามหลัก D1 — รวมสีไว้ที่เดียว:

```typescript
// =============================================================================
// palette.ts — รวม "สี" ทั้งหมดของหน้า Onboarding ไว้ที่เดียว
// -----------------------------------------------------------------------------
// ทุกไฟล์จะ import { palette } จากที่นี่ไปใช้ แทนการพิมพ์รหัสสีซ้ำๆ ในแต่ละไฟล์
// ข้อดี: อยากเปลี่ยนโทนสีทั้งหน้า แก้ไฟล์นี้ไฟล์เดียวจบ
// ค่าสีตรงกับดีไซน์ต้นฉบับ: https://github.com/Aashu-Dubey/React-Native-UI-Templates
// =============================================================================
export const palette = {
  background: 'rgb(245, 235, 226)', // สีครีม — พื้นหลังทั้งหน้า
  button: 'rgb(21, 32, 54)', // สีกรมท่าเข้ม — พื้นปุ่มหลัก (Let's begin, ลูกศร, Sign Up)
  buttonText: 'white', // ตัวอักษร/ไอคอนบนปุ่ม (ต้องตัดกับสีปุ่มให้อ่านง่าย)
  text: 'black', // หัวข้อและคำอธิบายทั่วไป
  textMuted: 'grey', // ข้อความรองที่ไม่ต้องเด่น เช่น "Already have an account?"
  dotActive: '#132137', // จุดบอกตำแหน่ง ของฉากที่กำลังดูอยู่ (เข้ม)
  dotInactive: '#E3E4E4', // จุดบอกตำแหน่ง ของฉากอื่น (จาง)
};
```

## F3. แทนที่ `App.tsx` ทั้งไฟล์

```tsx
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
```

**ส่วนไหนเป็น animation?** ไม่มีเลยในไฟล์นี้ — `App.tsx` แค่เลือกว่าจะโชว์ "หน้า Onboarding" หรือ "หน้าจบแล้ว" ตัวขยับจริงอยู่ใน `src/` ทั้งหมด (ตอนนี้ยังรันไม่ได้ เพราะยังไม่มี `OnboardingScreen` — สร้างขั้นถัดไป)

## F4. สร้าง `src/OnboardingScreen.tsx` (เวอร์ชันเริ่มต้น)

ไฟล์นี้คือ "ผู้กำกับ" — ไม่มีรูปหรือข้อความเอง มีแค่ตัวเลข animation กับคำสั่งของปุ่ม แล้วเอาฉากต่างๆ มาวางซ้อนกันตามหลัก C5 รอบนี้ใส่แค่หน้า Splash ก่อน:

```tsx
// =============================================================================
// OnboardingScreen.tsx — "ผู้กำกับ" ของทั้งหน้า
// -----------------------------------------------------------------------------
// ไฟล์นี้ไม่มีรูป/ข้อความเองเลย มีแค่:
//   1) animationController — ตัวเลขตัวเดียวที่คุมทุกฉาก (วิ่งจาก 0 ถึง 0.8)
//   2) ฟังก์ชันของปุ่ม next / back / skip (สั่งให้ตัวเลขวิ่งไปค่าใหม่)
//   3) เอาทุกฉากมาวางซ้อนกัน แล้วส่ง animationController ให้ทุกฉากอ่าน
//
// ไทม์ไลน์ของตัวเลข (ช่วงละ 0.2 = 1 ฉาก):
//   0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
//   Splash    Relax       Care        MoodDiary   Welcome
// =============================================================================
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';

interface Props {
  onFinish: () => void; // App.tsx ส่งมา — เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
}

export default function OnboardingScreen({ onFinish }: Props) {
  // ขนาดจอจริงของเครื่อง (กว้าง/สูง) — ใช้เป็นระยะ "เลื่อนพ้นจอพอดี"
  const window = useWindowDimensions();

  // ตัวเลขหลักของทั้งหน้า เริ่มที่ 0 (= อยู่หน้า Splash)
  // ใช้ useRef เพื่อให้เป็น "ตัวเดิม" ตลอด ถ้าสร้างใหม่ทุก render animation จะรีเซ็ตกลับ 0
  const animationController = useRef(new Animated.Value(0));

  // Animated.Value อ่านค่าปัจจุบันตรงๆ ไม่ได้ จึงต้องจดค่าล่าสุดเก็บไว้ที่นี่
  // (ใช้ useRef ไม่ใช่ useState เพราะค่าเปลี่ยน ~60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก)
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    // ทุกครั้งที่ตัวเลขขยับ ให้จดค่าใหม่ลง currentValue
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    // เก็บกวาดตอนหน้านี้ถูกปิด — ถอด listener ออก กัน memory leak
    return () => controller.removeListener(id);
  }, []); // [] = ตั้ง listener ครั้งเดียวตอนหน้าขึ้นจอ

  // ยก "กลุ่มฉากเนื้อหา" (Relax, Care, MoodDiary, Welcome) ทั้งก้อนขึ้นมาจากใต้จอ
  //   ตัวเลข 0   -> translateY = window.height  (อยู่ใต้จอพอดี มองไม่เห็น)
  //   ตัวเลข 0.2 -> translateY = 0              (ขึ้นมาอยู่กลางจอแล้ว)
  //   0.4 - 0.8  -> 0 ตลอด                      (อยู่นิ่ง การสลับฉากภายในกลุ่มแต่ละฉากจัดการเอง)
  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  // ฟังก์ชันกลาง: สั่งให้ตัวเลขวิ่งจากค่าปัจจุบันไปที่ toValue แบบนุ่มนวล
  // ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ
  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue, // ค่าปลายทาง เช่น 0.4
      duration, // ใช้เวลากี่มิลลิวินาที (1600 = 1.6 วินาที)
      // เส้นโค้งความเร็วมาตรฐานของ Material Design: ออกตัวเร็ว แล้วค่อยๆ ชะลอตอนจบ
      // (ตัวเลข 4 ตัวคือจุดควบคุมของเส้นโค้ง Bézier ไม่ต้องจำ ใช้ค่านี้ได้เลย)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      // ต้องเป็น false: NextButtonArrow animate ค่า width/borderRadius และ dot animate สี
      // ซึ่ง native driver ทำไม่ได้ (ถ้าตั้ง true จะ error)
      useNativeDriver: false,
    }).start();
  }, []);

  // ปุ่ม "ถัดไป" — ดูว่าตอนนี้อยู่ฉากไหน แล้วเลื่อนไปฉากถัดไป (+0.2)
  // ใช้ <= แทน === เพราะถ้าผู้ใช้กดตอน animation ยังวิ่งไม่จบ ค่าอาจเป็นทศนิยมระหว่างช่วง เช่น 0.13
  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2); // Splash     -> Relax
    else if (value <= 0.2) playAnimation(0.4); // Relax      -> Care
    else if (value <= 0.4) playAnimation(0.6); // Care       -> MoodDiary
    else if (value <= 0.6) playAnimation(0.8); // MoodDiary  -> Welcome
    else onFinish(); // อยู่ Welcome แล้ว (> 0.6) -> จบ Onboarding
  }, [playAnimation, onFinish]);

  // ปุ่ม "ย้อนกลับ" — กลับกันกับปุ่มถัดไป (-0.2)
  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0); // Relax      -> Splash
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2); // Care       -> Relax
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4); // MoodDiary  -> Care
    else if (value >= 0.8) playAnimation(0.6); // Welcome    -> MoodDiary
  }, [playAnimation]);

  // ปุ่ม "Skip" — กระโดดไปฉากสุดท้าย (0.8) เลย ใช้เวลาสั้นกว่า (1.2 วิ)
  // หมายเหตุ: ไม่ได้ปิด Onboarding ทันที ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ)
  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    // ลำดับใน JSX สำคัญ: ตัวที่เขียน "ทีหลัง" จะวาด "ทับ" ตัวที่เขียนก่อน
    // ปุ่ม (TopBackSkipView, CenterNextButton) จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับจนกดไม่ได้
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      {/* หน้าแรกสุด — เลื่อนขึ้นหายไปตอนกด Let's begin */}
      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      {/* กลุ่มฉากเนื้อหา — ทั้ง 4 ฉากวางซ้อนกันตำแหน่งเดียวกัน แต่ละฉากเลื่อนเข้า/ออกด้านข้างเอง */}
      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        {/* ฉากเนื้อหาจะทยอยเพิ่มตรงนี้ในขั้นที่ 10 และ 13 */}
      </Animated.View>

      {/* แถบบน: TopBackSkipView — เพิ่มในขั้นที่ 14 */}

      {/* ส่วนล่าง: CenterNextButton — เพิ่มในขั้นที่ 12 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // position absolute + top/left/right/bottom: 0 = ขยายเต็มจอ ซ้อนทับ Splash อยู่
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

> ⚠️ นี่เป็น **เวอร์ชันเริ่มต้น** — ขั้นต่อไปจะให้ **แทนที่ทั้งไฟล์** ด้วยเวอร์ชันที่มีฉากเพิ่มขึ้นเรื่อยๆ

## F5. สร้าง `src/scenes/SplashScene.tsx` — หน้าแรก

**หน้าตาที่จะได้ + style ที่ใช้:**

```
┌──────────────────────────────┐
│                              │
│      [  รูปประกอบใหญ่  ]      │  ← Image: width เต็มจอ + aspectRatio (C6) ไม่บิด
│                              │
│          Clearhead           │  ← fontSize 25 ตัวหนา จัดกลาง (D2)
│   Lorem ipsum dolor sit...   │  ← คำอธิบาย ขึ้นบรรทัดด้วย {'\n'}
│                              │
│      (   Let's begin   )     │  ← ปุ่มแคปซูล สูง 58 radius 29 (C3, D4)
│                              │  ← paddingBottom + insets.bottom (C8)
└──────────────────────────────┘
```

```tsx
// =============================================================================
// SplashScene.tsx — หน้าแรกสุด ("Clearhead" + ปุ่ม Let's begin)
// -----------------------------------------------------------------------------
// เห็นตอนตัวเลข = 0 พอกดปุ่ม ตัวเลขวิ่ง 0 -> 0.2 หน้านี้จะเลื่อนขึ้นจนหายพ้นจอด้านบน
// ปุ่มตรงนี้เป็นปุ่มธรรมดา (ไม่ใช่ NextButtonArrow ที่มอร์ฟได้ — ตัวนั้นอยู่ใน CenterNextButton
// ซึ่งซ่อนอยู่ใต้จอตอนอยู่หน้านี้)
// =============================================================================
import { StyleSheet, View, Text, Image, Animated, useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../palette';

interface Props {
  onNextClick: () => void; // ฟังก์ชันจาก OnboardingScreen — เรียกตอนกด Let's begin
  animationController: React.RefObject<Animated.Value>; // ตัวเลขหลักของทั้งหน้า (อ่านผ่าน .current)
}

// โหลดรูปจากในโปรเจค — path นับจากไฟล์นี้: ออกจาก scenes/ -> ออกจาก src/ -> เข้า assets/onboarding/
const introImage = require('../../assets/onboarding/introduction_image.png');

export default function SplashScene({ onNextClick, animationController }: Props) {
  const window = useWindowDimensions(); // ขนาดจอจริง
  const insets = useSafeAreaInsets(); // ระยะขอบที่ห้ามวางของ (รอยบากบน / แถบ home ด้านล่าง)

  // เลื่อนทั้งหน้าขึ้นในแนวตั้ง:
  //   ตัวเลข 0         -> 0               (อยู่ที่เดิม เห็นเต็มจอ)
  //   ตัวเลข 0.2       -> -window.height  (ติดลบ = เลื่อนขึ้น เท่าความสูงจอพอดี = หายพ้นขอบบน)
  //   ตัวเลข 0.2 - 0.8 -> -window.height  (ค้างอยู่นอกจอ ไม่กลับมาอีก)
  // ใส่จุด 0.8 ไว้ท้ายเพื่อ "ล็อก" ค่าไว้ตลอดช่วงที่เหลือ
  const translateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [0, -window.height, -window.height],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: palette.background, transform: [{ translateY }] }]}>
      {/* ScrollView เผื่อจอเล็กแล้วรูป+ข้อความยาวเกินจอ จะได้เลื่อนดูได้ */}
      <ScrollView style={{ flexGrow: 0 }} alwaysBounceVertical={false}>
        <Image
          // กว้างเท่าจอ ส่วนความสูงให้คำนวณจากสัดส่วนรูปจริง (357 กว้าง : 470 สูง)
          // height: undefined + aspectRatio = รูปไม่บิด ไม่ว่าจอจะกว้างแค่ไหน
          style={{ width: window.width, height: undefined, aspectRatio: 357 / 470 }}
          source={introImage}
        />
        <Text style={styles.title}>Clearhead</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet,consectetur{'\n'}adipiscing elit,sed do eiusmod tempor{'\n'}incididunt ut labore
        </Text>
      </ScrollView>

      {/* paddingBottom = 8 + ความสูงแถบ home ของ iPhone รุ่นใหม่ กันปุ่มจมใต้แถบ */}
      <View style={[styles.footer, { paddingBottom: 8 + insets.bottom }]}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: 'powderblue' }} // เอฟเฟกต์คลื่นตอนกด (เฉพาะ Android)
          onPress={onNextClick}
        >
          {/* &apos; = เครื่องหมาย ' ใน JSX */}
          <Text style={styles.buttonText}>Let&apos;s begin</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: palette.text, fontSize: 25, textAlign: 'center', fontWeight: '700', paddingVertical: 8 },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 24 },
  footer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 8 },
  button: {
    height: 58,
    backgroundColor: palette.button,
    borderRadius: 29, // ครึ่งหนึ่งของความสูง (58 / 2) = ปลายปุ่มโค้งมนสนิท
    paddingVertical: 16,
    paddingHorizontal: 56,
    justifyContent: 'center',
  },
  buttonText: { fontSize: 18, color: palette.buttonText },
});
```

**การเคลื่อนไหว:** ตอนกด "Let's begin" ทั้งหน้าเลื่อนขึ้น (`translateY` ติดลบ = ขึ้น) จนพ้นขอบบนจอ

### ✅ Checkpoint 1

```bash
npx expo start --go
```

สแกน QR → เห็นหน้า "Clearhead" → **กดปุ่ม** → หน้าเลื่อนขึ้นหายไปอย่างนุ่มนวล เหลือพื้นครีมเปล่า (ถูกต้องแล้ว ยังไม่มีฉากอื่น) — อยากดูซ้ำกด `r` ใน Terminal

## F6. สร้าง `src/scenes/RelaxScene.tsx` — ฉากที่ 1

```
┌──────────────────────────────┐
│            Relax             │  ← หัวข้อ "ไหล" ลงมาเข้าที่ตอนเข้าฉาก (D6)
│   Lorem ipsum dolor sit...   │  ← paddingHorizontal 64 ให้บรรทัดไม่ยาวเกิน (D2)
│                              │
│      [  รูปประกอบ  ]          │  ← maxWidth 350 จอใหญ่รูปก็ไม่แตก
│                              │
└──────────────────────────────┘
ตอนออก: รูปเลื่อนเร็วสุด > คำอธิบาย > ตัวฉาก = parallax (D6)
```

```tsx
// =============================================================================
// RelaxScene.tsx — ฉากที่ 1 "Relax"
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.2 : ขึ้นมาพร้อมกลุ่มฉาก (OnboardingScreen ยกขึ้นให้) + หัวข้อไหลลงมาเข้าที่
//   0.2      : อยู่กลางจอ (ฉากของตัวเอง)
//   0.2 -> 0.4 : เลื่อนออกไปทางซ้าย (รูป/ข้อความเลื่อนเร็วไม่เท่ากัน = parallax)
//   0.4 -> 0.8 : ค้างอยู่นอกจอซ้าย
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const relaxImage = require('../../assets/onboarding/relax_image.png');
const IMAGE_WIDTH = 350; // ความกว้างสูงสุดของรูป (ใช้ทั้งใน style และคำนวณระยะเลื่อน)
const IMAGE_HEIGHT = 250;

export default function RelaxScene({ animationController }: Props) {
  const window = useWindowDimensions();

  // หัวข้อ "Relax" ไหลลงมาเข้าที่ตอนเข้าฉาก
  //   26 * 2 = 52 คือ "ความสูงตัวอักษร (fontSize 26) x 2" = ระยะพอดีให้หัวข้อเริ่มจากเหนือตำแหน่งจริง
  //   ตัวเลข 0   -> -52  (ติดลบ = อยู่สูงกว่าตำแหน่งจริง 52 px)
  //   ตัวเลข 0.2 -> 0    (ลงมาตรงตำแหน่งพอดี)
  //   0.2 - 0.8  -> 0    (อยู่นิ่ง — ตอนฉากออก ทั้งฉากเลื่อนไปด้วย containerTranslateX อยู่แล้ว)
  const titleTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [-(26 * 2), 0, 0],
  });

  // คำอธิบาย: เลื่อนออกซ้าย "เร็วกว่าตัวฉาก 2 เท่า" (ไป -width*2 ในเวลาเดียวกับที่ฉากไปแค่ -width)
  //   0 -> 0.2  : 0 (ไม่ขยับ)
  //   0.2 -> 0.4: 0 -> -window.width * 2 (พุ่งออกซ้ายเร็ว)
  //   0.6, 0.8  : กลับเป็น 0 — ไม่มีผลบนจอ เพราะตอนนั้นทั้งฉากอยู่นอกจอแล้ว (แค่ต่อเส้นให้ครบ)
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -window.width * 2, 0, 0],
  });

  // รูป: เลื่อนออกเร็วที่สุด ไป -(350 * 4) = -1400 px
  // ยิ่งระยะไกล ยิ่งเลื่อนเร็ว (เพราะใช้เวลาเท่ากัน) -> รูป, คำอธิบาย, ตัวฉาก เลื่อนเร็วไม่เท่ากัน
  // = เทคนิค "parallax" ทำให้ดูมีมิติ มีชั้นหน้า-หลัง
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -(IMAGE_WIDTH * 4), 0, 0],
  });

  // ตัวฉากทั้งก้อน:
  //   0 -> 0.2   : 0 (อยู่ตรงกลาง ขึ้นมาพร้อมกลุ่ม)
  //   0.2 -> 0.4 : 0 -> -window.width (เลื่อนออกซ้ายพ้นจอพอดี)
  //   0.4 -> 0.8 : ค้างที่ -window.width (นอกจอซ้าย)
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.8],
    outputRange: [0, 0, -window.width, -window.width],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      <Animated.Text style={[styles.title, { transform: [{ translateY: titleTranslateY }] }]}>Relax</Animated.Text>
      <Animated.Text style={[styles.subtitle, { transform: [{ translateX: subtitleTranslateX }] }]}>
        Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore
      </Animated.Text>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]}
        source={relaxImage}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ฉากนี้ไม่มี position: 'absolute' เพราะเป็น "ตัวหลัก" ที่กำหนดตำแหน่งกลางจอ
  // ฉากอื่น (Care, MoodDiary, Welcome) ใช้ absolute เพื่อซ้อนทับตำแหน่งเดียวกัน
  container: { alignItems: 'center', paddingBottom: 100 },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
});
```

**แทนที่ `src/OnboardingScreen.tsx` ทั้งไฟล์** (เพิ่ม import `RelaxScene` และวางฉากไว้ในกลุ่มฉากเนื้อหา):

```tsx
// =============================================================================
// OnboardingScreen.tsx — "ผู้กำกับ" ของทั้งหน้า
// -----------------------------------------------------------------------------
// ไฟล์นี้ไม่มีรูป/ข้อความเองเลย มีแค่:
//   1) animationController — ตัวเลขตัวเดียวที่คุมทุกฉาก (วิ่งจาก 0 ถึง 0.8)
//   2) ฟังก์ชันของปุ่ม next / back / skip (สั่งให้ตัวเลขวิ่งไปค่าใหม่)
//   3) เอาทุกฉากมาวางซ้อนกัน แล้วส่ง animationController ให้ทุกฉากอ่าน
//
// ไทม์ไลน์ของตัวเลข (ช่วงละ 0.2 = 1 ฉาก):
//   0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
//   Splash    Relax       Care        MoodDiary   Welcome
// =============================================================================
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';
import RelaxScene from './scenes/RelaxScene';

interface Props {
  onFinish: () => void; // App.tsx ส่งมา — เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
}

export default function OnboardingScreen({ onFinish }: Props) {
  // ขนาดจอจริงของเครื่อง (กว้าง/สูง) — ใช้เป็นระยะ "เลื่อนพ้นจอพอดี"
  const window = useWindowDimensions();

  // ตัวเลขหลักของทั้งหน้า เริ่มที่ 0 (= อยู่หน้า Splash)
  // ใช้ useRef เพื่อให้เป็น "ตัวเดิม" ตลอด ถ้าสร้างใหม่ทุก render animation จะรีเซ็ตกลับ 0
  const animationController = useRef(new Animated.Value(0));

  // Animated.Value อ่านค่าปัจจุบันตรงๆ ไม่ได้ จึงต้องจดค่าล่าสุดเก็บไว้ที่นี่
  // (ใช้ useRef ไม่ใช่ useState เพราะค่าเปลี่ยน ~60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก)
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    // ทุกครั้งที่ตัวเลขขยับ ให้จดค่าใหม่ลง currentValue
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    // เก็บกวาดตอนหน้านี้ถูกปิด — ถอด listener ออก กัน memory leak
    return () => controller.removeListener(id);
  }, []); // [] = ตั้ง listener ครั้งเดียวตอนหน้าขึ้นจอ

  // ยก "กลุ่มฉากเนื้อหา" (Relax, Care, MoodDiary, Welcome) ทั้งก้อนขึ้นมาจากใต้จอ
  //   ตัวเลข 0   -> translateY = window.height  (อยู่ใต้จอพอดี มองไม่เห็น)
  //   ตัวเลข 0.2 -> translateY = 0              (ขึ้นมาอยู่กลางจอแล้ว)
  //   0.4 - 0.8  -> 0 ตลอด                      (อยู่นิ่ง การสลับฉากภายในกลุ่มแต่ละฉากจัดการเอง)
  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  // ฟังก์ชันกลาง: สั่งให้ตัวเลขวิ่งจากค่าปัจจุบันไปที่ toValue แบบนุ่มนวล
  // ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ
  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue, // ค่าปลายทาง เช่น 0.4
      duration, // ใช้เวลากี่มิลลิวินาที (1600 = 1.6 วินาที)
      // เส้นโค้งความเร็วมาตรฐานของ Material Design: ออกตัวเร็ว แล้วค่อยๆ ชะลอตอนจบ
      // (ตัวเลข 4 ตัวคือจุดควบคุมของเส้นโค้ง Bézier ไม่ต้องจำ ใช้ค่านี้ได้เลย)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      // ต้องเป็น false: NextButtonArrow animate ค่า width/borderRadius และ dot animate สี
      // ซึ่ง native driver ทำไม่ได้ (ถ้าตั้ง true จะ error)
      useNativeDriver: false,
    }).start();
  }, []);

  // ปุ่ม "ถัดไป" — ดูว่าตอนนี้อยู่ฉากไหน แล้วเลื่อนไปฉากถัดไป (+0.2)
  // ใช้ <= แทน === เพราะถ้าผู้ใช้กดตอน animation ยังวิ่งไม่จบ ค่าอาจเป็นทศนิยมระหว่างช่วง เช่น 0.13
  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2); // Splash     -> Relax
    else if (value <= 0.2) playAnimation(0.4); // Relax      -> Care
    else if (value <= 0.4) playAnimation(0.6); // Care       -> MoodDiary
    else if (value <= 0.6) playAnimation(0.8); // MoodDiary  -> Welcome
    else onFinish(); // อยู่ Welcome แล้ว (> 0.6) -> จบ Onboarding
  }, [playAnimation, onFinish]);

  // ปุ่ม "ย้อนกลับ" — กลับกันกับปุ่มถัดไป (-0.2)
  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0); // Relax      -> Splash
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2); // Care       -> Relax
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4); // MoodDiary  -> Care
    else if (value >= 0.8) playAnimation(0.6); // Welcome    -> MoodDiary
  }, [playAnimation]);

  // ปุ่ม "Skip" — กระโดดไปฉากสุดท้าย (0.8) เลย ใช้เวลาสั้นกว่า (1.2 วิ)
  // หมายเหตุ: ไม่ได้ปิด Onboarding ทันที ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ)
  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    // ลำดับใน JSX สำคัญ: ตัวที่เขียน "ทีหลัง" จะวาด "ทับ" ตัวที่เขียนก่อน
    // ปุ่ม (TopBackSkipView, CenterNextButton) จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับจนกดไม่ได้
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      {/* หน้าแรกสุด — เลื่อนขึ้นหายไปตอนกด Let's begin */}
      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      {/* กลุ่มฉากเนื้อหา — ทั้ง 4 ฉากวางซ้อนกันตำแหน่งเดียวกัน แต่ละฉากเลื่อนเข้า/ออกด้านข้างเอง */}
      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
      </Animated.View>

      {/* แถบบน: TopBackSkipView — เพิ่มในขั้นที่ 14 */}

      {/* ส่วนล่าง: CenterNextButton — เพิ่มในขั้นที่ 12 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // position absolute + top/left/right/bottom: 0 = ขยายเต็มจอ ซ้อนทับ Splash อยู่
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

### ✅ Checkpoint 2

reload (`r`) → กด "Let's begin" → Splash เลื่อนขึ้น **พร้อมกับ** ฉาก Relax เลื่อนตามขึ้นมา หัวข้อไหลลงเข้าที่ (ยังไปต่อไม่ได้ เพราะยังไม่มีปุ่มถัดไป)

## F7. สร้าง `src/scenes/NextButtonArrow.tsx` — ปุ่มที่ยืดได้

ไฮไลต์ความสวยของงานนี้ (D6 "เปลี่ยนรูปแทนการสลับ"):

```
ฉาก 1–3:            ฉากสุดท้าย:
   ( > )      ──►   [  Sign Up        →  ]
 วงกลม 58×58          ยาว 258, มุมมน 8
```

ทำได้โดยผูกหลายอย่างเข้ากับตัวเลขตัวเดียว: ความกว้าง 58→258, มุม 40→8, ลูกศรลอยขึ้น+จางหาย, ข้อความ Sign Up ลอยขึ้นมา+ชัดขึ้น — และ `overflow: 'hidden'` ตัดส่วนที่ล้นขอบทิ้ง เลยดูเหมือนลูกศร "ลอยหายออกด้านบน" ข้อความ "ลอยเข้ามาจากด้านล่าง"

```tsx
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
```

(ยังดูผลไม่ได้ — ปุ่มนี้จะอยู่ใน CenterNextButton ขั้นถัดไป)

## F8. สร้าง `src/scenes/CenterNextButton.tsx` — ส่วนล่างของจอ

```
│                              │
│          ● ○ ○ ○             │  ← จุด 10×10 radius 5 = วงกลม (C3)
│            ( > )             │     จุดที่เลือก: กรมท่า / อื่นๆ: เทาอ่อน (D1)
│                              │     เปลี่ยนสีแบบไล่ ไม่กะพริบ
└──────────────────────────────┘  ← position absolute bottom 0 (C5)
```

```tsx
// =============================================================================
// CenterNextButton.tsx — ส่วนล่างของจอ: จุดบอกตำแหน่ง (dot) + ปุ่มลูกศร + ข้อความ Login
// -----------------------------------------------------------------------------
//   ตอนอยู่ Splash (0)          -> ซ่อนทั้งก้อนไว้ใต้จอ (Splash มีปุ่มของตัวเองแล้ว)
//   ฉาก Relax-MoodDiary (0.2-0.6) -> เห็นจุด 4 จุด + ปุ่มลูกศร
//   ฉาก Welcome (0.8)            -> จุดหายไป, ปุ่มมอร์ฟเป็น Sign Up, ข้อความ Login โผล่
// =============================================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../palette';
import NextButtonArrow from './NextButtonArrow';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

interface DotProps {
  index: number; // จุดนี้คือจุดที่เท่าไหร่ (0-3)
  selectedIndex: number; // ตอนนี้ฉากไหนถูกเลือกอยู่ (0-3)
}

// ---- จุด 1 จุด ที่เปลี่ยนสีแบบค่อยๆ ไล่ (ไม่ใช่สลับทันที) ----
function DotIndicator({ index, selectedIndex }: DotProps) {
  // แต่ละจุดมีตัวเลข animation "ของตัวเอง" แยกจาก animationController
  //   0 = สีจาง (ไม่ได้เลือก), 1 = สีเข้ม (ถูกเลือก)
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ทุกครั้งที่ selectedIndex เปลี่ยน: จุดที่ถูกเลือกวิ่งไป 1, จุดอื่นวิ่งกลับ 0 (ใช้เวลา 0.48 วิ)
    Animated.timing(progress, {
      toValue: index === selectedIndex ? 1 : 0,
      duration: 480,
      useNativeDriver: false, // ต้อง false เพราะ animate สีพื้นหลัง (native driver ทำไม่ได้)
    }).start();
  }, [selectedIndex, index, progress]);

  // interpolate "สี" ได้ด้วย — ครึ่งทางจะได้สีกลางๆ ระหว่างเทาอ่อนกับกรมท่าให้อัตโนมัติ
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.dotInactive, palette.dotActive],
  });

  return <Animated.View style={[styles.dot, { backgroundColor }]} />;
}

export default function CenterNextButton({ onNextClick, animationController }: Props) {
  // ความโปร่งใสของแถวจุด (0 = ซ่อน, 1 = เห็น) — แยกจากตัวเลขหลัก เพื่อให้ fade นุ่มนวลของตัวเอง
  const opacity = useRef(new Animated.Value(0)).current;
  // จำไว้ว่าตอนนี้แถวจุด "โชว์อยู่ไหม" (0/1) จะได้สั่ง fade เฉพาะตอนสถานะเปลี่ยน ไม่ใช่สั่งซ้ำทุกเฟรม
  const currentOpacity = useRef(0);
  // จุดที่เท่าไหร่กำลังเข้มอยู่ (ใช้ useState เพราะต้อง render ใหม่ให้จุดเปลี่ยนสี)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { bottom } = useSafeAreaInsets(); // ความสูงแถบ home ของ iPhone
  const dots = useMemo(() => [0, 1, 2, 3], []); // 4 จุด = 4 ฉากเนื้อหา

  useEffect(() => {
    // ฟังตัวเลขหลักทุกครั้งที่ขยับ แล้วตัดสินใจ 2 เรื่อง:
    const id = animationController.current.addListener(({ value }) => {
      // (1) แถวจุดควรโชว์ไหม: โชว์เฉพาะช่วงฉากเนื้อหา 0.2 - 0.6
      //     < 0.2 = ยังอยู่ Splash, > 0.6 = เข้าฉาก Welcome (ปุ่มกลายเป็น Sign Up แล้ว ไม่ต้องบอกตำแหน่ง)
      const isVisible = value >= 0.2 && value <= 0.6;
      // สั่ง fade เฉพาะตอน "สถานะเปลี่ยน" (ซ่อน->โชว์ หรือ โชว์->ซ่อน) ไม่งั้นจะสั่งซ้ำ 60 ครั้ง/วินาที
      if ((isVisible && currentOpacity.current === 0) || (!isVisible && currentOpacity.current === 1)) {
        // opacity เป็น style ที่ native driver รองรับ จึงใช้ true ได้ (ลื่นกว่า)
        Animated.timing(opacity, { toValue: isVisible ? 1 : 0, duration: 480, useNativeDriver: true }).start();
        currentOpacity.current = isVisible ? 1 : 0;
      }

      // (2) จุดไหนควรเข้ม: แปลงตัวเลขต่อเนื่อง (0-0.8) เป็นเลขจุด (0-3)
      //     จุดตัด 0.1 / 0.3 / 0.5 / 0.7 คือ "กึ่งกลางระหว่างฉาก"
      //     เช่น เลื่อนจาก Relax (0.2) ไป Care (0.4) พอเกิน 0.3 (ครึ่งทาง) จุดที่ 2 ก็เข้มทันที
      if (value >= 0.7) setSelectedIndex(3); // Welcome
      else if (value >= 0.5) setSelectedIndex(2); // MoodDiary
      else if (value >= 0.3) setSelectedIndex(1); // Care
      else if (value >= 0.1) setSelectedIndex(0); // Relax
    });
    return () => animationController.current.removeListener(id); // เก็บกวาด listener
  }, [animationController, opacity]);

  // ซ่อนทั้งก้อนไว้ใต้จอตอนอยู่ Splash:
  //   96 = ความสูงโดยประมาณของส่วนนี้ (จุด + ปุ่ม + ระยะห่าง), x 5 = ดันลงไปไกลพอแน่ใจว่าพ้นจอ
  //   ตัวเลข 0 -> 480 (ใต้จอ), 0.2 ขึ้นไป -> 0 (อยู่ที่ตำแหน่งจริง)
  const containerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [96 * 5, 0, 0, 0, 0],
  });

  // ข้อความ "Already have an account? Login" ซ่อนใต้จอ 150 px ตลอด โผล่ขึ้นมาเฉพาะฉาก Welcome
  //   0 - 0.6 -> 150 (ซ่อน), 0.6 -> 0.8 -> 150 ลดเหลือ 0 (ลอยขึ้นมา)
  const loginTextTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [150, 150, 150, 150, 0],
  });

  return (
    // paddingBottom = 16 + แถบ home กันปุ่มจมใต้แถบ
    <Animated.View
      style={[styles.container, { paddingBottom: 16 + bottom, transform: [{ translateY: containerTranslateY }] }]}
    >
      {/* แถวจุด 4 จุด */}
      <Animated.View style={[styles.dotsRow, { opacity }]}>
        {dots.map((item) => (
          <DotIndicator key={item} index={item} selectedIndex={selectedIndex} />
        ))}
      </Animated.View>

      {/* ปุ่มลูกศร (มอร์ฟเป็น Sign Up ฉากสุดท้าย) */}
      <NextButtonArrow onBtnPress={onNextClick} animationController={animationController} />

      {/* ข้อความตกแต่ง (กดไม่ได้ ตามต้นฉบับ) */}
      <Animated.View style={[styles.loginRow, { transform: [{ translateY: loginTextTranslateY }] }]}>
        <Text style={{ color: palette.textMuted }}>Already have an account? </Text>
        <Text style={styles.loginText}>Login</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ยึดติดขอบล่างของจอ กว้างเต็มจอ
  container: { alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  dotsRow: { flexDirection: 'row', marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 }, // borderRadius 5 = ครึ่งของ 10 = วงกลม
  loginRow: { flexDirection: 'row', marginTop: 8 },
  loginText: { color: palette.button, fontSize: 16, fontWeight: '700' },
});
```

**แทนที่ `src/OnboardingScreen.tsx` ทั้งไฟล์** (เพิ่ม `CenterNextButton` ไว้ล่างสุด = ชั้นบนสุด ตามหลัก C5):

```tsx
// =============================================================================
// OnboardingScreen.tsx — "ผู้กำกับ" ของทั้งหน้า
// -----------------------------------------------------------------------------
// ไฟล์นี้ไม่มีรูป/ข้อความเองเลย มีแค่:
//   1) animationController — ตัวเลขตัวเดียวที่คุมทุกฉาก (วิ่งจาก 0 ถึง 0.8)
//   2) ฟังก์ชันของปุ่ม next / back / skip (สั่งให้ตัวเลขวิ่งไปค่าใหม่)
//   3) เอาทุกฉากมาวางซ้อนกัน แล้วส่ง animationController ให้ทุกฉากอ่าน
//
// ไทม์ไลน์ของตัวเลข (ช่วงละ 0.2 = 1 ฉาก):
//   0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
//   Splash    Relax       Care        MoodDiary   Welcome
// =============================================================================
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';
import RelaxScene from './scenes/RelaxScene';
import CenterNextButton from './scenes/CenterNextButton';

interface Props {
  onFinish: () => void; // App.tsx ส่งมา — เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
}

export default function OnboardingScreen({ onFinish }: Props) {
  // ขนาดจอจริงของเครื่อง (กว้าง/สูง) — ใช้เป็นระยะ "เลื่อนพ้นจอพอดี"
  const window = useWindowDimensions();

  // ตัวเลขหลักของทั้งหน้า เริ่มที่ 0 (= อยู่หน้า Splash)
  // ใช้ useRef เพื่อให้เป็น "ตัวเดิม" ตลอด ถ้าสร้างใหม่ทุก render animation จะรีเซ็ตกลับ 0
  const animationController = useRef(new Animated.Value(0));

  // Animated.Value อ่านค่าปัจจุบันตรงๆ ไม่ได้ จึงต้องจดค่าล่าสุดเก็บไว้ที่นี่
  // (ใช้ useRef ไม่ใช่ useState เพราะค่าเปลี่ยน ~60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก)
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    // ทุกครั้งที่ตัวเลขขยับ ให้จดค่าใหม่ลง currentValue
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    // เก็บกวาดตอนหน้านี้ถูกปิด — ถอด listener ออก กัน memory leak
    return () => controller.removeListener(id);
  }, []); // [] = ตั้ง listener ครั้งเดียวตอนหน้าขึ้นจอ

  // ยก "กลุ่มฉากเนื้อหา" (Relax, Care, MoodDiary, Welcome) ทั้งก้อนขึ้นมาจากใต้จอ
  //   ตัวเลข 0   -> translateY = window.height  (อยู่ใต้จอพอดี มองไม่เห็น)
  //   ตัวเลข 0.2 -> translateY = 0              (ขึ้นมาอยู่กลางจอแล้ว)
  //   0.4 - 0.8  -> 0 ตลอด                      (อยู่นิ่ง การสลับฉากภายในกลุ่มแต่ละฉากจัดการเอง)
  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  // ฟังก์ชันกลาง: สั่งให้ตัวเลขวิ่งจากค่าปัจจุบันไปที่ toValue แบบนุ่มนวล
  // ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ
  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue, // ค่าปลายทาง เช่น 0.4
      duration, // ใช้เวลากี่มิลลิวินาที (1600 = 1.6 วินาที)
      // เส้นโค้งความเร็วมาตรฐานของ Material Design: ออกตัวเร็ว แล้วค่อยๆ ชะลอตอนจบ
      // (ตัวเลข 4 ตัวคือจุดควบคุมของเส้นโค้ง Bézier ไม่ต้องจำ ใช้ค่านี้ได้เลย)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      // ต้องเป็น false: NextButtonArrow animate ค่า width/borderRadius และ dot animate สี
      // ซึ่ง native driver ทำไม่ได้ (ถ้าตั้ง true จะ error)
      useNativeDriver: false,
    }).start();
  }, []);

  // ปุ่ม "ถัดไป" — ดูว่าตอนนี้อยู่ฉากไหน แล้วเลื่อนไปฉากถัดไป (+0.2)
  // ใช้ <= แทน === เพราะถ้าผู้ใช้กดตอน animation ยังวิ่งไม่จบ ค่าอาจเป็นทศนิยมระหว่างช่วง เช่น 0.13
  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2); // Splash     -> Relax
    else if (value <= 0.2) playAnimation(0.4); // Relax      -> Care
    else if (value <= 0.4) playAnimation(0.6); // Care       -> MoodDiary
    else if (value <= 0.6) playAnimation(0.8); // MoodDiary  -> Welcome
    else onFinish(); // อยู่ Welcome แล้ว (> 0.6) -> จบ Onboarding
  }, [playAnimation, onFinish]);

  // ปุ่ม "ย้อนกลับ" — กลับกันกับปุ่มถัดไป (-0.2)
  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0); // Relax      -> Splash
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2); // Care       -> Relax
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4); // MoodDiary  -> Care
    else if (value >= 0.8) playAnimation(0.6); // Welcome    -> MoodDiary
  }, [playAnimation]);

  // ปุ่ม "Skip" — กระโดดไปฉากสุดท้าย (0.8) เลย ใช้เวลาสั้นกว่า (1.2 วิ)
  // หมายเหตุ: ไม่ได้ปิด Onboarding ทันที ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ)
  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    // ลำดับใน JSX สำคัญ: ตัวที่เขียน "ทีหลัง" จะวาด "ทับ" ตัวที่เขียนก่อน
    // ปุ่ม (TopBackSkipView, CenterNextButton) จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับจนกดไม่ได้
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      {/* หน้าแรกสุด — เลื่อนขึ้นหายไปตอนกด Let's begin */}
      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      {/* กลุ่มฉากเนื้อหา — ทั้ง 4 ฉากวางซ้อนกันตำแหน่งเดียวกัน แต่ละฉากเลื่อนเข้า/ออกด้านข้างเอง */}
      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
      </Animated.View>

      {/* แถบบน: TopBackSkipView — เพิ่มในขั้นที่ 14 */}

      {/* ส่วนล่าง: จุดบอกตำแหน่ง + ปุ่มลูกศร (มอร์ฟเป็น Sign Up) */}
      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // position absolute + top/left/right/bottom: 0 = ขยายเต็มจอ ซ้อนทับ Splash อยู่
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

### ✅ Checkpoint 3

reload → "Let's begin" → เห็น **จุด 4 จุด + ปุ่มลูกศรกลม** → กดลูกศร → ฉาก Relax เลื่อนออกซ้าย (สังเกตรูปกับข้อความเลื่อนเร็วไม่เท่ากัน) จุดที่ 2 เข้มขึ้น — จอว่างเพราะยังไม่มีฉาก 2

## F9. สร้างฉากที่เหลือ 3 ไฟล์

ทั้ง 3 ใช้หลักเดียวกับ Relax — ต่างแค่ "คิว" (ช่วงตัวเลข) ที่ตัวเองเข้าจอ:

| ไฟล์ | เข้าจอตอนตัวเลข | การเคลื่อนไหว |
|---|---|---|
| `CareScene.tsx` | 0.4 | เข้าจากขวา → ออกทางซ้าย |
| `MoodDiaryScene.tsx` | 0.6 | เข้าจากขวา → ออกทางซ้าย |
| `WelcomeScene.tsx` | 0.8 | เข้าจากขวา แล้วหยุด (ฉากสุดท้าย) |

**`src/scenes/CareScene.tsx`**

```tsx
// =============================================================================
// CareScene.tsx — ฉากที่ 2 "Care"
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.2   : รอคิวนอกจอขวา (ไม่ขยับ)
//   0.2 -> 0.4 : เลื่อนเข้ามาจากขวา
//   0.4        : อยู่กลางจอ (ฉากของตัวเอง)
//   0.4 -> 0.6 : เลื่อนออกไปทางซ้าย
//   0.6 -> 0.8 : ค้างนอกจอซ้าย
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const careImage = require('../../assets/onboarding/care_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

export default function CareScene({ animationController }: Props) {
  const window = useWindowDimensions();

  // ตัวฉากทั้งก้อน (บวก = ขวา, ลบ = ซ้าย):
  //   ตัวเลข: 0              0.2            0.4   0.6             0.8
  //   ค่า:    +width         +width         0     -width          -width
  //           (รอนอกจอขวา)    (ยังรอ)        (กลาง) (ออกซ้ายพ้นจอ)   (ค้างนอกจอซ้าย)
  // เทคนิค: ใส่ค่าซ้ำ 2 จุดติดกัน (+width, +width) = ช่วงนั้น "ไม่ขยับ" ใช้บอกว่ายังไม่ถึงตา
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width, -window.width],
  });

  // หัวข้อ "Care": เลื่อนตามฉากแต่เหลื่อมเล็กน้อย 52 px (= fontSize 26 x 2)
  // ทำให้ตอนเข้ามา หัวข้อดูเหมือน "ตามมาช้านิดนึง" ไม่ได้ติดกับฉากแข็งๆ
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0, -(26 * 2), -(26 * 2)],
  });

  // รูป: เริ่มไกลกว่าฉากมาก (350 * 4 = 1400 px) แต่ต้องมาถึงกลางจอ (0) พร้อมกันที่ 0.4
  // ระยะไกลกว่าแต่เวลาเท่ากัน -> รูปวิ่งเร็วกว่า = parallax เหมือนฉาก Relax
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0, -(IMAGE_WIDTH * 4), -(IMAGE_WIDTH * 4)],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      <Animated.Image style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]} source={careImage} />
      <Animated.Text style={[styles.title, { transform: [{ translateX: titleTranslateX }] }]}>Care</Animated.Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // absolute + left/right: 0 = ซ้อนทับตำแหน่งเดียวกับฉาก Relax (กว้างเต็มจอ)
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
});
```

**`src/scenes/MoodDiaryScene.tsx`**

```tsx
// =============================================================================
// MoodDiaryScene.tsx — ฉากที่ 3 "Mood Dairy" (สะกด Dairy ตามต้นฉบับ)
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.4   : รอคิวนอกจอขวา (ไม่ขยับ)
//   0.4 -> 0.6 : เลื่อนเข้ามาจากขวา
//   0.6        : อยู่กลางจอ (ฉากของตัวเอง)
//   0.6 -> 0.8 : เลื่อนออกไปทางซ้าย
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const moodDiaryImage = require('../../assets/onboarding/mood_dairy_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

export default function MoodDiaryScene({ animationController }: Props) {
  const window = useWindowDimensions();

  // inputRange มีแค่ 4 จุด ไม่ต้องใส่ 0.2 เพราะช่วง 0 -> 0.4 ฉากนี้แค่รอคิว ค่าไม่เปลี่ยนอยู่แล้ว
  //   ตัวเลข: 0        0.4      0.6   0.8
  //   ค่า:    +width   +width   0     -width
  //           (รอขวา)   (ยังรอ)  (กลาง) (ออกซ้าย)
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width],
  });

  // คำอธิบาย: วิ่งไกลเป็น 2 เท่าของฉาก (width * 2) ในเวลาเดียวกัน -> เร็วกว่าฉาก = parallax
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width * 2, window.width * 2, 0, -(window.width * 2)],
  });

  // รูป: วิ่งไกลที่สุด (350 * 4 = 1400 px) -> เร็วที่สุด
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0, -(IMAGE_WIDTH * 4)],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      {/* หัวข้อใช้ Text ธรรมดา (ไม่ animate แยก) เลื่อนไปพร้อมตัวฉาก */}
      <Text style={styles.title}>Mood Dairy</Text>
      <Animated.Text style={[styles.subtitle, { transform: [{ translateX: subtitleTranslateX }] }]}>
        Lorem ipsum dolor sit amet,consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore
      </Animated.Text>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]}
        source={moodDiaryImage}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
});
```

**`src/scenes/WelcomeScene.tsx`**

```tsx
// =============================================================================
// WelcomeScene.tsx — ฉากสุดท้าย "Welcome"
// -----------------------------------------------------------------------------
// ไทม์ไลน์ของฉากนี้:
//   0 -> 0.6   : รอคิวนอกจอขวา (ไม่ขยับ)
//   0.6 -> 0.8 : เลื่อนเข้ามาจากขวา
//   0.8        : อยู่กลางจอแล้วจบ — ไม่มีช่วง "ออก" เพราะไม่มีฉากถัดไป
// =============================================================================
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const welcomeImage = require('../../assets/onboarding/welcome.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 350; // รูปฉากนี้เกือบจัตุรัส จึงสูงกว่าฉากอื่น

export default function WelcomeScene({ animationController }: Props) {
  const window = useWindowDimensions();

  //   ตัวเลข: 0        0.6      0.8
  //   ค่า:    +width   +width   0
  //           (รอขวา)   (ยังรอ)  (กลางจอ)
  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [window.width, window.width, 0],
  });

  // หัวข้อเหลื่อมตามมา 52 px (= fontSize 26 x 2) เหมือนฉาก Care
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0],
  });

  // รูปเริ่มไกล 1400 px (350 * 4) -> วิ่งเข้ามาเร็วกว่าตัวฉาก = parallax
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageTranslateX }] }]}
        source={welcomeImage}
      />
      <Animated.Text style={[styles.title, { transform: [{ translateX: titleTranslateX }] }]}>Welcome</Animated.Text>
      <Text style={styles.subtitle}>Stay organised and live stress-free with you-do app</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
});
```

**แทนที่ `src/OnboardingScreen.tsx` ทั้งไฟล์** (เพิ่ม 3 ฉากเข้ากลุ่มฉากเนื้อหา):

```tsx
// =============================================================================
// OnboardingScreen.tsx — "ผู้กำกับ" ของทั้งหน้า
// -----------------------------------------------------------------------------
// ไฟล์นี้ไม่มีรูป/ข้อความเองเลย มีแค่:
//   1) animationController — ตัวเลขตัวเดียวที่คุมทุกฉาก (วิ่งจาก 0 ถึง 0.8)
//   2) ฟังก์ชันของปุ่ม next / back / skip (สั่งให้ตัวเลขวิ่งไปค่าใหม่)
//   3) เอาทุกฉากมาวางซ้อนกัน แล้วส่ง animationController ให้ทุกฉากอ่าน
//
// ไทม์ไลน์ของตัวเลข (ช่วงละ 0.2 = 1 ฉาก):
//   0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
//   Splash    Relax       Care        MoodDiary   Welcome
// =============================================================================
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';
import RelaxScene from './scenes/RelaxScene';
import CareScene from './scenes/CareScene';
import MoodDiaryScene from './scenes/MoodDiaryScene';
import WelcomeScene from './scenes/WelcomeScene';
import CenterNextButton from './scenes/CenterNextButton';

interface Props {
  onFinish: () => void; // App.tsx ส่งมา — เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
}

export default function OnboardingScreen({ onFinish }: Props) {
  // ขนาดจอจริงของเครื่อง (กว้าง/สูง) — ใช้เป็นระยะ "เลื่อนพ้นจอพอดี"
  const window = useWindowDimensions();

  // ตัวเลขหลักของทั้งหน้า เริ่มที่ 0 (= อยู่หน้า Splash)
  // ใช้ useRef เพื่อให้เป็น "ตัวเดิม" ตลอด ถ้าสร้างใหม่ทุก render animation จะรีเซ็ตกลับ 0
  const animationController = useRef(new Animated.Value(0));

  // Animated.Value อ่านค่าปัจจุบันตรงๆ ไม่ได้ จึงต้องจดค่าล่าสุดเก็บไว้ที่นี่
  // (ใช้ useRef ไม่ใช่ useState เพราะค่าเปลี่ยน ~60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก)
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    // ทุกครั้งที่ตัวเลขขยับ ให้จดค่าใหม่ลง currentValue
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    // เก็บกวาดตอนหน้านี้ถูกปิด — ถอด listener ออก กัน memory leak
    return () => controller.removeListener(id);
  }, []); // [] = ตั้ง listener ครั้งเดียวตอนหน้าขึ้นจอ

  // ยก "กลุ่มฉากเนื้อหา" (Relax, Care, MoodDiary, Welcome) ทั้งก้อนขึ้นมาจากใต้จอ
  //   ตัวเลข 0   -> translateY = window.height  (อยู่ใต้จอพอดี มองไม่เห็น)
  //   ตัวเลข 0.2 -> translateY = 0              (ขึ้นมาอยู่กลางจอแล้ว)
  //   0.4 - 0.8  -> 0 ตลอด                      (อยู่นิ่ง การสลับฉากภายในกลุ่มแต่ละฉากจัดการเอง)
  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  // ฟังก์ชันกลาง: สั่งให้ตัวเลขวิ่งจากค่าปัจจุบันไปที่ toValue แบบนุ่มนวล
  // ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ
  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue, // ค่าปลายทาง เช่น 0.4
      duration, // ใช้เวลากี่มิลลิวินาที (1600 = 1.6 วินาที)
      // เส้นโค้งความเร็วมาตรฐานของ Material Design: ออกตัวเร็ว แล้วค่อยๆ ชะลอตอนจบ
      // (ตัวเลข 4 ตัวคือจุดควบคุมของเส้นโค้ง Bézier ไม่ต้องจำ ใช้ค่านี้ได้เลย)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      // ต้องเป็น false: NextButtonArrow animate ค่า width/borderRadius และ dot animate สี
      // ซึ่ง native driver ทำไม่ได้ (ถ้าตั้ง true จะ error)
      useNativeDriver: false,
    }).start();
  }, []);

  // ปุ่ม "ถัดไป" — ดูว่าตอนนี้อยู่ฉากไหน แล้วเลื่อนไปฉากถัดไป (+0.2)
  // ใช้ <= แทน === เพราะถ้าผู้ใช้กดตอน animation ยังวิ่งไม่จบ ค่าอาจเป็นทศนิยมระหว่างช่วง เช่น 0.13
  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2); // Splash     -> Relax
    else if (value <= 0.2) playAnimation(0.4); // Relax      -> Care
    else if (value <= 0.4) playAnimation(0.6); // Care       -> MoodDiary
    else if (value <= 0.6) playAnimation(0.8); // MoodDiary  -> Welcome
    else onFinish(); // อยู่ Welcome แล้ว (> 0.6) -> จบ Onboarding
  }, [playAnimation, onFinish]);

  // ปุ่ม "ย้อนกลับ" — กลับกันกับปุ่มถัดไป (-0.2)
  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0); // Relax      -> Splash
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2); // Care       -> Relax
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4); // MoodDiary  -> Care
    else if (value >= 0.8) playAnimation(0.6); // Welcome    -> MoodDiary
  }, [playAnimation]);

  // ปุ่ม "Skip" — กระโดดไปฉากสุดท้าย (0.8) เลย ใช้เวลาสั้นกว่า (1.2 วิ)
  // หมายเหตุ: ไม่ได้ปิด Onboarding ทันที ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ)
  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    // ลำดับใน JSX สำคัญ: ตัวที่เขียน "ทีหลัง" จะวาด "ทับ" ตัวที่เขียนก่อน
    // ปุ่ม (TopBackSkipView, CenterNextButton) จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับจนกดไม่ได้
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      {/* หน้าแรกสุด — เลื่อนขึ้นหายไปตอนกด Let's begin */}
      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      {/* กลุ่มฉากเนื้อหา — ทั้ง 4 ฉากวางซ้อนกันตำแหน่งเดียวกัน แต่ละฉากเลื่อนเข้า/ออกด้านข้างเอง */}
      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
        <CareScene animationController={animationController} />
        <MoodDiaryScene animationController={animationController} />
        <WelcomeScene animationController={animationController} />
      </Animated.View>

      {/* แถบบน: TopBackSkipView — เพิ่มในขั้นที่ 14 */}

      {/* ส่วนล่าง: จุดบอกตำแหน่ง + ปุ่มลูกศร (มอร์ฟเป็น Sign Up) */}
      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // position absolute + top/left/right/bottom: 0 = ขยายเต็มจอ ซ้อนทับ Splash อยู่
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

### ✅ Checkpoint 4

reload → กดไล่ไปจนสุด: Relax → Care → Mood Dairy → Welcome — **ที่ฉาก Welcome ปุ่มลูกศรยืดเป็น "Sign Up →"** จุดหายไป ข้อความ "Already have an account? Login" ลอยขึ้นมา → กด Sign Up → หน้า "จบ Onboarding แล้ว 🎉" → กด "ดูอีกครั้ง" เริ่มใหม่

## F10. สร้าง `src/scenes/TopBackSkipView.tsx` — แถบด้านบน

```
┌──────────────────────────────┐
│  <                     Skip  │  ← flexDirection 'row' + justifyContent 'space-between' (C4)
│                              │     marginTop = ความสูงรอยบาก (C8)
```

Skip เป็นแค่ข้อความ ไม่ใช่ปุ่มทึบ (D4 — ไม่แย่งความเด่นจากปุ่มหลัก)

```tsx
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
```

**แทนที่ `src/OnboardingScreen.tsx` ทั้งไฟล์ — ฉบับสมบูรณ์สุดท้าย:**

```tsx
// =============================================================================
// OnboardingScreen.tsx — "ผู้กำกับ" ของทั้งหน้า
// -----------------------------------------------------------------------------
// ไฟล์นี้ไม่มีรูป/ข้อความเองเลย มีแค่:
//   1) animationController — ตัวเลขตัวเดียวที่คุมทุกฉาก (วิ่งจาก 0 ถึง 0.8)
//   2) ฟังก์ชันของปุ่ม next / back / skip (สั่งให้ตัวเลขวิ่งไปค่าใหม่)
//   3) เอาทุกฉากมาวางซ้อนกัน แล้วส่ง animationController ให้ทุกฉากอ่าน
//
// ไทม์ไลน์ของตัวเลข (ช่วงละ 0.2 = 1 ฉาก):
//   0 ─────── 0.2 ─────── 0.4 ─────── 0.6 ─────── 0.8
//   Splash    Relax       Care        MoodDiary   Welcome
// =============================================================================
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';
import RelaxScene from './scenes/RelaxScene';
import CareScene from './scenes/CareScene';
import MoodDiaryScene from './scenes/MoodDiaryScene';
import WelcomeScene from './scenes/WelcomeScene';
import TopBackSkipView from './scenes/TopBackSkipView';
import CenterNextButton from './scenes/CenterNextButton';

interface Props {
  onFinish: () => void; // App.tsx ส่งมา — เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย
}

export default function OnboardingScreen({ onFinish }: Props) {
  // ขนาดจอจริงของเครื่อง (กว้าง/สูง) — ใช้เป็นระยะ "เลื่อนพ้นจอพอดี"
  const window = useWindowDimensions();

  // ตัวเลขหลักของทั้งหน้า เริ่มที่ 0 (= อยู่หน้า Splash)
  // ใช้ useRef เพื่อให้เป็น "ตัวเดิม" ตลอด ถ้าสร้างใหม่ทุก render animation จะรีเซ็ตกลับ 0
  const animationController = useRef(new Animated.Value(0));

  // Animated.Value อ่านค่าปัจจุบันตรงๆ ไม่ได้ จึงต้องจดค่าล่าสุดเก็บไว้ที่นี่
  // (ใช้ useRef ไม่ใช่ useState เพราะค่าเปลี่ยน ~60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก)
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    // ทุกครั้งที่ตัวเลขขยับ ให้จดค่าใหม่ลง currentValue
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    // เก็บกวาดตอนหน้านี้ถูกปิด — ถอด listener ออก กัน memory leak
    return () => controller.removeListener(id);
  }, []); // [] = ตั้ง listener ครั้งเดียวตอนหน้าขึ้นจอ

  // ยก "กลุ่มฉากเนื้อหา" (Relax, Care, MoodDiary, Welcome) ทั้งก้อนขึ้นมาจากใต้จอ
  //   ตัวเลข 0   -> translateY = window.height  (อยู่ใต้จอพอดี มองไม่เห็น)
  //   ตัวเลข 0.2 -> translateY = 0              (ขึ้นมาอยู่กลางจอแล้ว)
  //   0.4 - 0.8  -> 0 ตลอด                      (อยู่นิ่ง การสลับฉากภายในกลุ่มแต่ละฉากจัดการเอง)
  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  // ฟังก์ชันกลาง: สั่งให้ตัวเลขวิ่งจากค่าปัจจุบันไปที่ toValue แบบนุ่มนวล
  // ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ
  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue, // ค่าปลายทาง เช่น 0.4
      duration, // ใช้เวลากี่มิลลิวินาที (1600 = 1.6 วินาที)
      // เส้นโค้งความเร็วมาตรฐานของ Material Design: ออกตัวเร็ว แล้วค่อยๆ ชะลอตอนจบ
      // (ตัวเลข 4 ตัวคือจุดควบคุมของเส้นโค้ง Bézier ไม่ต้องจำ ใช้ค่านี้ได้เลย)
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      // ต้องเป็น false: NextButtonArrow animate ค่า width/borderRadius และ dot animate สี
      // ซึ่ง native driver ทำไม่ได้ (ถ้าตั้ง true จะ error)
      useNativeDriver: false,
    }).start();
  }, []);

  // ปุ่ม "ถัดไป" — ดูว่าตอนนี้อยู่ฉากไหน แล้วเลื่อนไปฉากถัดไป (+0.2)
  // ใช้ <= แทน === เพราะถ้าผู้ใช้กดตอน animation ยังวิ่งไม่จบ ค่าอาจเป็นทศนิยมระหว่างช่วง เช่น 0.13
  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2); // Splash     -> Relax
    else if (value <= 0.2) playAnimation(0.4); // Relax      -> Care
    else if (value <= 0.4) playAnimation(0.6); // Care       -> MoodDiary
    else if (value <= 0.6) playAnimation(0.8); // MoodDiary  -> Welcome
    else onFinish(); // อยู่ Welcome แล้ว (> 0.6) -> จบ Onboarding
  }, [playAnimation, onFinish]);

  // ปุ่ม "ย้อนกลับ" — กลับกันกับปุ่มถัดไป (-0.2)
  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0); // Relax      -> Splash
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2); // Care       -> Relax
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4); // MoodDiary  -> Care
    else if (value >= 0.8) playAnimation(0.6); // Welcome    -> MoodDiary
  }, [playAnimation]);

  // ปุ่ม "Skip" — กระโดดไปฉากสุดท้าย (0.8) เลย ใช้เวลาสั้นกว่า (1.2 วิ)
  // หมายเหตุ: ไม่ได้ปิด Onboarding ทันที ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ)
  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    // ลำดับใน JSX สำคัญ: ตัวที่เขียน "ทีหลัง" จะวาด "ทับ" ตัวที่เขียนก่อน
    // ปุ่ม (TopBackSkipView, CenterNextButton) จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับจนกดไม่ได้
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      {/* หน้าแรกสุด — เลื่อนขึ้นหายไปตอนกด Let's begin */}
      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      {/* กลุ่มฉากเนื้อหา — ทั้ง 4 ฉากวางซ้อนกันตำแหน่งเดียวกัน แต่ละฉากเลื่อนเข้า/ออกด้านข้างเอง */}
      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
        <CareScene animationController={animationController} />
        <MoodDiaryScene animationController={animationController} />
        <WelcomeScene animationController={animationController} />
      </Animated.View>

      {/* แถบบน: ปุ่มย้อนกลับ + Skip */}
      <TopBackSkipView onBackClick={onBackClick} onSkipClick={onSkipClick} animationController={animationController} />

      {/* ส่วนล่าง: จุดบอกตำแหน่ง + ปุ่มลูกศร (มอร์ฟเป็น Sign Up) */}
      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // position absolute + top/left/right/bottom: 0 = ขยายเต็มจอ ซ้อนทับ Splash อยู่
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

### ✅ Checkpoint 5 — เสร็จสมบูรณ์ 🎉

- [ ] กด **<** (มุมซ้ายบน) ถอยทีละฉากได้
- [ ] กด **Skip** จากฉากไหนก็ได้ → กระโดดไปฉาก Welcome และ Skip เลื่อนหายไป
- [ ] กด **Sign Up** → หน้าจบ → **ดูอีกครั้ง** → เริ่มใหม่
- [ ] ลองบน **มือถือจริง** ครบทุกปุ่ม

---

# ส่วน G — เมื่อเจอปัญหา / แบบฝึกหัด / คำศัพท์

## G1. ปัญหาที่เจอบ่อย (เจอจริงทั้งหมดตอนเตรียมคอร์สนี้)

| เห็นอะไร | แปลว่า | แก้ยังไง |
|---|---|---|
| `running scripts is disabled on this system` | Windows บล็อกคำสั่ง npm | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` แล้วเปิด VS Code ใหม่ (A3) |
| `Could not read package.json` / `ENOENT` | รันคำสั่งผิดโฟลเดอร์ | `cd onboarding` ให้เข้าโฟลเดอร์โปรเจคก่อน |
| `Project is incompatible with this version of Expo Go` | เวอร์ชันโปรเจคไม่ตรงกับแอปในมือถือ | สร้างโปรเจคด้วย `@sdk-57` (A4) / อัปเดต Expo Go |
| `Unable to resolve module ./scenes/...` | ไฟล์อยู่ผิดที่ หรือชื่อสะกดผิด | เทียบกับแผนผัง F0 — ไฟล์ต้องอยู่ใน `src/scenes/` (ลืม `src/` บ่อยมาก) |
| `Unable to resolve module ../../assets/onboarding/...` | หารูปไม่เจอ | เช็คว่ามีรูปครบ 5 ไฟล์ (A6) — ชื่อ `mood_dairy_image.png` สะกด **dairy** |
| จอแดง `undefined is not a function` (`setNativeProps`) | animate ไอคอนตรงๆ | ห่อไอคอนด้วย `Animated.View` (มีคำเตือนใน comment ของ NextButtonArrow) |
| แอปพังบนมือถือแต่บนเว็บไม่พัง | ลืม `<SafeAreaProvider>` | ดู `App.tsx` ใน F3 |
| สแกน QR แล้วโหลดไม่ขึ้น | มือถือกับคอมคนละ Wi-Fi | ต่อ Wi-Fi เดียวกัน หรือใช้ `npx expo start --tunnel` |
| `Port 8081 is in use` | มีแอปเก่ารันค้างอยู่ | กด `Y` ให้ใช้พอร์ตอื่น หรือปิด Terminal เก่า |

## G2. แบบฝึกหัด — ฝึกตาเรื่องความสวย 🎨

ทำทีละข้อ แก้แล้วดูผลบนมือถือ แล้ว **ตอบว่าแบบไหนสวยกว่า เพราะอะไร** (ใช้หลักส่วน D อธิบาย)

1. **เปลี่ยนโทนสีทั้งแอป** — แก้แค่ `src/palette.ts` เช่น `background: '#EEF2FF'`, `button: '#4F46E5'` (โทนม่วงน้ำเงิน) — ทั้งหน้าเปลี่ยนตามโดยไม่แตะไฟล์อื่น (นี่คือข้อดีของการแยกสี)
2. **สีตัดกันไม่พอ** — ลองตั้ง `button: '#E3E4E4'` (เทาอ่อน) — ปุ่มยังเด่นไหม? ตัวอักษรอ่านง่ายไหม?
3. **ขนาดหัวข้อ** — ใน RelaxScene เปลี่ยน `fontSize: 26` เป็น `16` — ยังรู้ไหมว่าอะไรคือหัวข้อ?
4. **ความเร็ว** — ใน OnboardingScreen เปลี่ยน `duration = 1600` เป็น `300` และ `4000` — แบบไหนรู้สึกหรูที่สุด?
5. **Easing** — เปลี่ยน `Easing.bezier(0.4, 0.0, 0.2, 1.0)` เป็น `Easing.linear` — รู้สึกแข็งขึ้นไหม?
6. **ปิด parallax** — ใน CareScene เปลี่ยน `IMAGE_WIDTH * 4` ทุกที่เป็น `IMAGE_WIDTH * 1` — ความมีมิติหายไปไหม?
7. **ใส่เงาให้ปุ่ม** — ใน SplashScene เพิ่มใน `button`: `shadowColor: 'black', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4` — ปุ่มลอยขึ้นมาไหม?
8. **เนื้อหาของเราเอง** — เปลี่ยนข้อความทุกฉากเป็นเรื่องการจองสนามกีฬา (เช่น Relax → "ค้นหาสนาม") ภาษาไทยยาวกว่าอังกฤษ ต้องปรับ `paddingHorizontal` ไหม?

## G3. คำศัพท์

| คำ | ความหมายบ้านๆ |
|---|---|
| Component | ชิ้นส่วนหน้าจอ 1 ชิ้น (เหมือนตัวต่อเลโก้) |
| JSX | การเขียนหน้าตาด้วยแท็ก `<View>` `<Text>` |
| Style | การตกแต่ง (สี ขนาด ระยะห่าง) |
| Padding / Margin | ที่ว่างข้างใน / ข้างนอกกล่อง |
| Flexbox | ระบบจัดของในกล่อง (`flexDirection`, `justifyContent`, `alignItems`) |
| Absolute | วางลอยทับของอื่นได้ |
| Safe Area | พื้นที่ที่ไม่โดนรอยบาก/แถบ home |
| Contrast | ความต่างของสีพื้นกับสีตัวอักษร |
| Animated.Value | ตัวเลขที่เปลี่ยนค่าได้ลื่นๆ |
| interpolate | แปลงตัวเลขเป็นตำแหน่ง/สี/ขนาด |
| Easing | รูปแบบความเร็ว (เร่ง/ชะลอ) |
| Parallax | ของหลายชั้นเลื่อนเร็วไม่เท่ากัน ดูมีมิติ |
| Fast Refresh | บันทึกไฟล์แล้วมือถือเปลี่ยนตามทันที |
| Expo Go | แอปบนมือถือสำหรับเปิดดูแอปที่กำลังเขียน |

---

**อ้างอิง:** ต้นฉบับ [React-Native-UI-Templates](https://github.com/Aashu-Dubey/React-Native-UI-Templates) (MIT) · ดีไซน์ [Behance](https://www.behance.net/gallery/96755139/Mental-Wellness-App-(Onboarding)) · รูปประกอบใช้เพื่อการเรียนเท่านั้น · โค้ดเต็มที่ทำเสร็จแล้ว: `mobile/onboarding` · ฉบับย่อสำหรับคนมีพื้นฐาน: `MOBILE_ONBOARDING_GUIDE.md`
