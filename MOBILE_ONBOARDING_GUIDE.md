# คู่มือสอนสร้าง Animated Onboarding (React Native + Expo) ตั้งแต่เริ่มแอปใหม่ แบบ Step-by-Step

เอกสารนี้สอนสร้าง **หน้า Onboarding แบบมี animation ลื่นๆ** (หน้าแนะนำแอปที่เห็นตอนเปิดแอปครั้งแรก) โดย **เริ่มจากสร้างแอปใหม่เปล่าๆ** แล้วค่อยๆ เพิ่มทีละไฟล์ ทุกขั้นมีจุด **✅ Checkpoint** ให้รันดูผลจริงก่อนไปขั้นถัดไป

ดีไซน์และเทคนิค animation พอร์ตมาจากเทมเพลต **"Animated Onboarding"** ใน [React-Native-UI-Templates](https://github.com/Aashu-Dubey/React-Native-UI-Templates/tree/main/src/introduction_animation) (MIT License) — ดูวิดีโอตัวอย่างของจริงได้ที่ [YouTube](https://youtube.com/shorts/AOD9FyiSR3U)

> **โค้ดทั้งหมดในเอกสารนี้สร้างและทดสอบจริงแล้ว** ที่โฟลเดอร์ `mobile/onboarding` (type-check ผ่าน, bundle ผ่าน, รูปภาพโหลดครบ) — ถ้าทำตามแล้วติดตรงไหน เปิดไฟล์ในโฟลเดอร์นั้นเทียบได้เลย

---

## สารบัญ

0. [ผลลัพธ์ที่จะได้](#0-ผลลัพธ์ที่จะได้)
1. [แนวคิดหลักก่อนเขียนโค้ด (สำคัญที่สุด อ่านก่อน)](#1-แนวคิดหลักก่อนเขียนโค้ด-สำคัญที่สุด-อ่านก่อน)
2. [สร้างแอปใหม่](#2-สร้างแอปใหม่)
3. [ติดตั้ง package](#3-ติดตั้ง-package)
4. [ดาวน์โหลดรูปภาพประกอบ](#4-ดาวน์โหลดรูปภาพประกอบ)
5. [โครงสร้างไฟล์ที่จะสร้าง](#5-โครงสร้างไฟล์ที่จะสร้าง)
6. [`palette.ts` — รวมสีไว้ที่เดียว](#6-palettets--รวมสีไว้ที่เดียว)
7. [`App.tsx` — จุดเริ่มต้นของแอป](#7-apptsx--จุดเริ่มต้นของแอป)
8. [`OnboardingScreen.tsx` — ตัวคุม animation หลัก](#8-onboardingscreentsx--ตัวคุม-animation-หลัก)
9. [`SplashScene.tsx` — หน้าแรกสุด (✅ Checkpoint 1)](#9-splashscenetsx--หน้าแรกสุด)
10. [`RelaxScene.tsx` — ฉากที่ 1 (✅ Checkpoint 2)](#10-relaxscenetsx--ฉากที่-1)
11. [`NextButtonArrow.tsx` — ปุ่มที่ "มอร์ฟ" ได้](#11-nextbuttonarrowtsx--ปุ่มที่-มอร์ฟ-ได้)
12. [`CenterNextButton.tsx` — dot + ปุ่มถัดไป (✅ Checkpoint 3)](#12-centernextbuttontsx--dot--ปุ่มถัดไป)
13. [`CareScene` / `MoodDiaryScene` / `WelcomeScene` — ฉากที่เหลือ (✅ Checkpoint 4)](#13-carescene--moodiaryscene--welcomescene--ฉากที่เหลือ)
14. [`TopBackSkipView.tsx` — ปุ่มย้อนกลับ/ข้าม (✅ Checkpoint 5 เสร็จสมบูรณ์)](#14-topbackskipviewtsx--ปุ่มย้อนกลับข้าม)
15. [ตารางสรุป: อะไรขยับตอนไหน](#15-ตารางสรุป-อะไรขยับตอนไหน)
16. [ปัญหาที่เจอบ่อยและวิธีแก้](#16-ปัญหาที่เจอบ่อยและวิธีแก้)
17. [แบบฝึกหัด](#17-แบบฝึกหัด)
18. [เช็คลิสต์ก่อนถือว่าเสร็จ](#18-เช็คลิสต์ก่อนถือว่าเสร็จ)

---

## 0. ผลลัพธ์ที่จะได้

แอปที่เปิดมาแล้วเจอ:

1. **หน้า Splash** — รูปประกอบใหญ่ ชื่อ "Clearhead" และปุ่ม **"Let's begin"**
2. กดปุ่ม → หน้า Splash **เลื่อนขึ้นหายไป** พร้อมกับฉาก **"Relax"** เลื่อนขึ้นมาแทน
3. กดปุ่มลูกศร → เลื่อนไปฉาก **"Care"** → **"Mood Dairy"** → **"Welcome"** (เลื่อนซ้าย-ขวา) จุด (dot) ด้านล่างเปลี่ยนสีตามฉากปัจจุบัน
4. ถึงฉากสุดท้าย ปุ่มลูกศรกลมๆ **ยืดตัวกลายเป็นปุ่มยาว "Sign Up"** (จุดเด่นที่สุดของงานนี้)
5. มีปุ่ม **ย้อนกลับ** (มุมซ้ายบน) และ **Skip** (มุมขวาบน)
6. กด Sign Up → จบ Onboarding (ในแอปตัวอย่างนี้จะโชว์หน้า "จบแล้ว" พร้อมปุ่ม "ดูอีกครั้ง" ไว้ใช้สาธิตซ้ำ)

**ความรู้พื้นฐานที่ควรมีก่อน:** React component, TypeScript เบื้องต้น — ส่วน props, `useState`, `useRef`, `useEffect` มีทบทวนให้ในหัวข้อ 1.5

---

## 1. แนวคิดหลักก่อนเขียนโค้ด (สำคัญที่สุด อ่านก่อน)

ถ้าเข้าใจหัวข้อนี้ โค้ดที่เหลือทั้งหมดจะอ่านง่ายมาก เพราะทุกไฟล์ใช้หลักการเดียวกันซ้ำๆ

### 1.1 `Animated.Value` — ตัวเลขพิเศษสำหรับทำ animation

```typescript
const animationController = useRef(new Animated.Value(0));
```

`Animated.Value` คือ "ตัวเลข" ตัวหนึ่ง (เริ่มที่ `0`) ที่ React Native ออกแบบมาเพื่อทำ animation โดยเฉพาะ — ต่างจาก `useState` ตรงที่ **เปลี่ยนค่าได้ 60 ครั้งต่อวินาทีโดยไม่ทำให้ component re-render** (ถ้าใช้ `useState` เปลี่ยนค่าถี่ขนาดนั้น แอปจะกระตุก)

เราสั่งให้ตัวเลขนี้ "วิ่ง" จากค่าหนึ่งไปอีกค่าหนึ่งแบบนุ่มนวลด้วย `Animated.timing`:

```typescript
Animated.timing(animationController.current, {
  toValue: 0.2,   // วิ่งไปที่ 0.2
  duration: 1600, // ใช้เวลา 1.6 วินาที
  useNativeDriver: false,
}).start();
```

### 1.2 `interpolate` — แปลงตัวเลข 1 ตัว เป็นค่าอะไรก็ได้

`interpolate` คือการ **"แปลงช่วงตัวเลข"** เช่น อยากให้ตอน `animationController` เป็น `0` รูปอยู่ตำแหน่ง `0` และตอนเป็น `0.2` รูปเลื่อนขึ้นไป `-800` (พ้นจอด้านบน):

```typescript
const translateY = animationController.current.interpolate({
  inputRange:  [0,   0.2],   // ค่าของ animationController
  outputRange: [0, -800],    // ค่าที่ต้องการให้ออกมา
});
```

| animationController | translateY ที่ได้ |
|---|---|
| `0` | `0` (อยู่ที่เดิม) |
| `0.1` | `-400` (ครึ่งทาง — คำนวณให้อัตโนมัติ) |
| `0.2` | `-800` (หายพ้นจอ) |

แล้วเอา `translateY` ไปใส่ใน style:

```tsx
<Animated.View style={{ transform: [{ translateY }] }}>...</Animated.View>
```

พอ `animationController` วิ่งจาก 0 → 0.2 view นี้ก็เลื่อนขึ้นตามไปเองโดยไม่ต้องเขียนอะไรเพิ่ม

> **กฎ:** จะ animate อะไรต้องใช้ `Animated.View` / `Animated.Text` / `Animated.Image` เท่านั้น — `View` ธรรมดาไม่รับค่า animated

### 1.3 หัวใจของงานนี้: "ตัวเลขตัวเดียว คุมทุกอย่าง"

แทนที่จะมี animation แยกกันคนละตัวสำหรับแต่ละฉาก งานนี้ใช้ **`animationController` ตัวเดียว** ที่วิ่งจาก `0` ถึง `0.8` แบ่งเป็นช่วงละ `0.2`:

```
animationController:  0 ──────── 0.2 ──────── 0.4 ──────── 0.6 ──────── 0.8
ฉากที่เห็นอยู่:      Splash      Relax        Care      Mood Dairy    Welcome
```

ทุกชิ้นส่วนบนจอ (รูป, ข้อความ, ปุ่ม, จุด) ต่างคน **ต่าง interpolate จากตัวเลขตัวเดียวกันนี้** แต่ใช้ `inputRange` คนละช่วง — เหมือน **เข็มนาฬิกาเข็มเดียว** ที่ทุกเฟืองอ่านตำแหน่งเข็มแล้วรู้เองว่าตัวเองต้องหมุนตอนไหน

ปุ่ม "ถัดไป" ทำแค่อย่างเดียว คือสั่งให้ตัวเลขขยับไปอีก `0.2` — ที่เหลือทุกชิ้นส่วนขยับตามเองหมด

### 1.4 `translateX` / `translateY` — ย้ายตำแหน่งโดยไม่เปลี่ยน layout

- `translateX` บวก = เลื่อนไปทางขวา, ลบ = เลื่อนไปทางซ้าย
- `translateY` บวก = เลื่อนลง, ลบ = เลื่อนขึ้น
- ใช้ `window.width` / `window.height` (ขนาดจอจริงจาก `useWindowDimensions()`) เป็นระยะ "เลื่อนพ้นจอพอดี"

ตัวอย่าง: ฉากที่จะเข้ามาจากขวา → เริ่มที่ `translateX: window.width` (อยู่นอกจอขวา) แล้ววิ่งไป `0` (กลางจอ)

### 1.5 ทบทวนพื้นฐาน React ที่ใช้ในงานนี้: props, `useState`, `useRef`, `useEffect`

#### Props — "ค่าที่พ่อส่งให้ลูก"

Component ก็คือฟังก์ชัน และ **props คือพารามิเตอร์ของฟังก์ชันนั้น** — component แม่ส่งค่าลงไปให้ component ลูกใช้

```tsx
// แม่ (OnboardingScreen) ส่งค่าลงไป
<SplashScene onNextClick={onNextClick} animationController={animationController} />

// ลูก (SplashScene) รับมาใช้
interface Props {
  onNextClick: () => void;                              // ฟังก์ชันที่ไม่รับอะไร ไม่คืนอะไร
  animationController: React.RefObject<Animated.Value>;
}
export default function SplashScene({ onNextClick, animationController }: Props) { ... }
```

- `interface Props { ... }` — บอก TypeScript ว่าลูกต้องได้รับอะไรบ้าง ถ้าแม่ลืมส่งหรือส่งผิดชนิด จะขึ้น error ทันทีตอนเขียน
- `{ onNextClick, animationController }` — แกะ (destructure) ค่าออกจาก props มาใช้ตรงๆ
- **ส่งฟังก์ชันเป็น props ได้** — นี่คือวิธีที่ "ลูกบอกแม่" ว่ามีเหตุการณ์เกิดขึ้น: ลูกไม่รู้ว่ากดปุ่มแล้วต้องทำอะไร แค่เรียก `onNextClick()` ที่แม่ให้มา แม่เป็นคนตัดสินใจเอง
- props **อ่านอย่างเดียว** ลูกห้ามแก้ค่าที่ได้รับมา

ในงานนี้: `animationController` ถูกส่งจาก `OnboardingScreen` ลงไปให้ **ทุกฉาก** ทุกตัวจึงอ่านตัวเลขตัวเดียวกันได้

#### `useState` — ค่าที่เปลี่ยนแล้ว "หน้าจอต้องอัปเดตตาม"

```tsx
const [finished, setFinished] = useState(false);
//     ค่าปัจจุบัน   ฟังก์ชันเปลี่ยนค่า    ค่าเริ่มต้น
```

- อ่านค่า: ใช้ `finished` ตรงๆ
- เปลี่ยนค่า: ต้องเรียก `setFinished(true)` เท่านั้น (ห้าม `finished = true`) — React จะ **render component ใหม่** ให้หน้าจอตรงกับค่าใหม่
- ตัวอย่างในงานนี้: `App.tsx` ใช้ `finished` สลับระหว่าง Onboarding กับหน้า "จบแล้ว", `CenterNextButton` ใช้ `selectedIndex` บอกว่าจุดไหนต้องเข้ม
- เปลี่ยนค่าโดยอิงค่าเดิม ใช้แบบฟังก์ชัน: `setRunId((id) => id + 1)` — ปลอดภัยกว่า `setRunId(runId + 1)` เพราะได้ค่าล่าสุดเสมอ

#### `useRef` — "กล่องเก็บของ" ที่อยู่ข้ามการ render แต่ไม่ทำให้ render ใหม่

```tsx
const currentValue = useRef(0);
currentValue.current = 0.4;   // เปลี่ยนค่าได้ตรงๆ หน้าจอไม่ render ใหม่
console.log(currentValue.current);
```

| | `useState` | `useRef` |
|---|---|---|
| เปลี่ยนค่าแล้วหน้าจอ render ใหม่? | ✅ ใช่ | ❌ ไม่ |
| วิธีอ่าน/เขียน | `value` / `setValue(x)` | `ref.current` / `ref.current = x` |
| ใช้เมื่อ | ค่านั้นมีผลกับสิ่งที่แสดงบนจอ | แค่อยากจำค่าไว้ใช้ภายใน |

ทำไม component ปกติจำค่าไม่ได้? เพราะทุกครั้งที่ render React **เรียกฟังก์ชัน component ใหม่ทั้งหมด** ตัวแปรธรรมดา (`let x = 0`) จึงถูกรีเซ็ตทุกครั้ง — `useRef` คือวิธีเก็บค่าให้รอดข้ามรอบ

ในงานนี้ใช้ `useRef` 2 แบบ:
1. **เก็บ `Animated.Value`** — `useRef(new Animated.Value(0))` ถ้าไม่ใช้ ref จะได้ `Animated.Value` ตัวใหม่ทุกครั้งที่ render (animation จะหายกลับไปเริ่มที่ 0)
2. **จดค่าล่าสุด** — `currentValue` เก็บตำแหน่ง animation ไว้เช็คตอนกดปุ่ม ไม่ต้องใช้ `useState` เพราะค่านี้เปลี่ยน 60 ครั้ง/วินาที ถ้า render ทุกครั้งแอปจะกระตุก

#### `useEffect` — "ทำสิ่งนี้หลังแสดงผล และเก็บกวาดตอนเลิกใช้"

```tsx
useEffect(() => {
  // 1) ทำตอน component ขึ้นจอ (และทุกครั้งที่ค่าใน [ ] เปลี่ยน)
  const id = controller.addListener(...);

  return () => {
    // 2) เก็บกวาดตอน component ถูกเอาออกจากจอ
    controller.removeListener(id);
  };
}, []);   // 3) dependency array
```

| dependency array | รันเมื่อไหร่ |
|---|---|
| `[]` (ว่าง) | ครั้งเดียวตอนขึ้นจอ — ใช้ใน `OnboardingScreen` สำหรับตั้ง listener |
| `[selectedIndex]` | ตอนขึ้นจอ + ทุกครั้งที่ `selectedIndex` เปลี่ยน — ใช้ใน `DotIndicator` สั่งให้จุดเปลี่ยนสีตาม |
| ไม่ใส่เลย | ทุกครั้งที่ render (แทบไม่ได้ใช้ ระวังวนลูป) |

ใช้ `useEffect` กับงานที่ "ไม่ใช่การวาดหน้าจอ" เช่น ตั้ง listener, เรียก API, ตั้ง timer — และ **อะไรที่ตั้งไว้ต้อง return ฟังก์ชันเก็บกวาดเสมอ** ไม่งั้น listener ค้างในหน่วยความจำ (memory leak) แม้หน้านั้นจะถูกปิดไปแล้ว

#### โบนัส: `useCallback` และ `useMemo` ที่เห็นในโค้ด

- `useCallback(fn, [deps])` — จำ **ฟังก์ชัน** ไว้ ไม่สร้างใหม่ทุก render (ใช้กับ `onNextClick`, `playAnimation` ที่ส่งเป็น props ให้หลาย component)
- `useMemo(() => value, [deps])` — จำ **ค่า** ที่คำนวณแล้ว (ใช้กับ array `dots`)
- ทั้งคู่เป็นเรื่องประสิทธิภาพ ไม่ใส่ก็ทำงานได้ — มือใหม่โฟกัส 4 ตัวด้านบนก่อน

---

## 2. สร้างแอปใหม่

เปิด terminal ไปที่โฟลเดอร์ที่ต้องการเก็บโปรเจค แล้วรัน:

```bash
npx create-expo-app@latest onboarding --template blank-typescript@sdk-57
cd onboarding
```

| ส่วนของคำสั่ง | ความหมาย |
|---|---|
| `create-expo-app@latest` | เครื่องมือสร้างโปรเจค Expo เวอร์ชันล่าสุด |
| `onboarding` | ชื่อโฟลเดอร์/ชื่อแอป (เปลี่ยนได้) |
| `--template blank-typescript` | เริ่มจากแอปเปล่า + TypeScript |
| `@sdk-57` | **ล็อกเวอร์ชัน Expo SDK เป็น 57** ให้ตรงกับแอป Expo Go ในมือถือ |

> **ทำไมต้องใส่ `@sdk-57`:** แอป **Expo Go รองรับ Expo SDK ได้ทีละเวอร์ชันเดียว** ถ้าไม่ระบุ คำสั่งจะดึง SDK ล่าสุดบน npm มา ซึ่งบางช่วง (เช่นตอนเขียนเอกสารนี้ npm มี SDK 58 แล้ว) แอป Expo Go ใน App Store ยังอัปเดตตามไม่ทัน → สแกน QR แล้วขึ้น `Project is incompatible with this version of Expo Go`
> **เช็คก่อนสร้าง:** เปิดแอป Expo Go ในมือถือดูว่ารองรับ SDK เวอร์ชันไหน (หรือสร้างแล้วสแกนดู ถ้าขึ้น error ให้เปลี่ยนตัวเลขหลัง `@sdk-` ให้ตรง) — ดูเลข SDK ของโปรเจคได้ที่บรรทัด `"expo": "~57.x.x"` ใน `package.json`

ถ้าระหว่างรันถามว่า `Skip initializing a new git repository?` (เกิดเมื่อสร้างในโฟลเดอร์ที่มี git อยู่แล้ว) ตอบ **`Y`**

**ลองรันดูก่อนว่าแอปเปล่าใช้งานได้:**
```bash
npx expo start --go
```
สแกน QR ด้วยแอป **Expo Go** บนมือถือ ควรเห็นข้อความ "Open up App.tsx to start working on your app!" — กด `Ctrl+C` ปิดแล้วไปขั้นถัดไป

---

## 3. ติดตั้ง package

```bash
npx expo install react-native-safe-area-context @expo/vector-icons
```

| Package | ใช้ทำอะไรในงานนี้ |
|---|---|
| `react-native-safe-area-context` | บอกระยะ "พื้นที่ปลอดภัย" ของจอ (ใต้รอยบาก/notch ด้านบน, ขอบล่างของ iPhone) เพื่อไม่ให้ปุ่มไปทับส่วนที่กดไม่ได้ |
| `@expo/vector-icons` | ไอคอนลูกศร (`arrow-forward`, `arrow-back-ios`) |

**ถ้าอยากดูผ่านเว็บเบราว์เซอร์ได้ด้วย** (ไม่บังคับ แต่สะดวกตอนสอนบนจอโปรเจคเตอร์):
```bash
npx expo install react-dom react-native-web
```

> ใช้ `npx expo install` เสมอ ไม่ใช่ `npm install` — เพราะ `expo install` เลือกเวอร์ชันที่เข้ากับ Expo SDK ของโปรเจคให้อัตโนมัติ

---

## 4. ดาวน์โหลดรูปภาพประกอบ

ต้องใช้รูป 5 ไฟล์ จาก repo ต้นฉบับ เก็บไว้ที่ `assets/onboarding/`

**Windows (PowerShell)** — รันที่ root ของโปรเจค:
```powershell
New-Item -ItemType Directory -Force assets/onboarding
$base = "https://raw.githubusercontent.com/Aashu-Dubey/React-Native-UI-Templates/main/src/assets/introduction_animation"
foreach ($f in "introduction_image","relax_image","care_image","mood_dairy_image","welcome") {
  Invoke-WebRequest "$base/$f.png" -OutFile "assets/onboarding/$f.png"
}
```

**Mac / Linux / Git Bash:**
```bash
mkdir -p assets/onboarding
for f in introduction_image relax_image care_image mood_dairy_image welcome; do
  curl -sL -o "assets/onboarding/$f.png" \
    "https://raw.githubusercontent.com/Aashu-Dubey/React-Native-UI-Templates/main/src/assets/introduction_animation/$f.png"
done
```

ตรวจว่าได้ครบ 5 ไฟล์:

| ไฟล์ | ใช้ที่ฉาก | ขนาดจริง |
|---|---|---|
| `introduction_image.png` | Splash | 357×470 |
| `relax_image.png` | Relax | 350×221 |
| `care_image.png` | Care | 351×250 |
| `mood_dairy_image.png` | Mood Dairy | 351×276 |
| `welcome.png` | Welcome | 351×360 |

> **เรื่องลิขสิทธิ์:** repo ต้นฉบับเป็น MIT License ใช้เรียน/สาธิตได้ แต่ภาพมาจากงานออกแบบบน [Behance](https://www.behance.net/gallery/96755139/Mental-Wellness-App-(Onboarding)) ถ้าจะทำแอปจริงไปเผยแพร่ ให้เปลี่ยนเป็นภาพของตัวเอง

---

## 5. โครงสร้างไฟล์ที่จะสร้าง

```
onboarding/
├── App.tsx                      ← (แก้ของเดิม) จุดเริ่มต้นแอป
├── assets/onboarding/*.png      ← รูป 5 ไฟล์จากขั้นที่ 4
└── src/
    ├── palette.ts               ← สีทั้งหมด
    ├── OnboardingScreen.tsx     ← ตัวคุม animation หลัก
    └── scenes/
        ├── SplashScene.tsx      ← หน้าแรกสุด
        ├── RelaxScene.tsx       ← ฉากที่ 1
        ├── CareScene.tsx        ← ฉากที่ 2
        ├── MoodDiaryScene.tsx   ← ฉากที่ 3
        ├── WelcomeScene.tsx     ← ฉากสุดท้าย
        ├── NextButtonArrow.tsx  ← ปุ่มลูกศรที่มอร์ฟเป็น "Sign Up"
        ├── CenterNextButton.tsx ← dot + ปุ่มถัดไป (ด้านล่าง)
        └── TopBackSkipView.tsx  ← ปุ่มย้อนกลับ + Skip (ด้านบน)
```

> **เทคนิคสร้างไฟล์เร็ว (VS Code):** คลิกขวาที่โฟลเดอร์โปรเจค → **New File...** → พิมพ์ path เต็ม เช่น `src/scenes/SplashScene.tsx` → VS Code สร้างโฟลเดอร์ให้อัตโนมัติ (ระวังพิมพ์ `src/` ให้ครบ — ถ้าลืม ไฟล์จะไปอยู่ผิดที่แล้ว import หาไม่เจอ)

ลำดับการสร้างในเอกสารนี้ **ไม่ได้เรียงตามโฟลเดอร์** แต่เรียงตาม "เพิ่มแล้วรันดูผลได้ทันที" เพื่อให้เห็นความคืบหน้าทุกขั้น

---

## 6. `palette.ts` — รวมสีไว้ที่เดียว

สร้างไฟล์ `src/palette.ts`:

```typescript
// สีทั้งหมดของหน้า Onboarding รวมไว้ที่เดียว — ค่าตรงกับดีไซน์ต้นฉบับ
// https://github.com/Aashu-Dubey/React-Native-UI-Templates (เทมเพลต Animated Onboarding)
export const palette = {
  background: 'rgb(245, 235, 226)', // ครีม — พื้นหลัง
  button: 'rgb(21, 32, 54)', // กรมท่าเข้ม — ปุ่มหลัก
  buttonText: 'white',
  text: 'black',
  textMuted: 'grey',
  dotActive: '#132137',
  dotInactive: '#E3E4E4',
};
```

**ทำไมต้องแยกไฟล์สี:** ทุกไฟล์ที่เหลือจะ `import { palette }` ไปใช้ ถ้าอยากเปลี่ยนโทนสีทั้งหน้า (เช่นเป็นสีของแอปตัวเอง) แก้ไฟล์นี้ไฟล์เดียวจบ — ไม่ต้องไล่หา `'rgb(21, 32, 54)'` ในทุกไฟล์ (ดูแบบฝึกหัดข้อ 3)

---

## 7. `App.tsx` — จุดเริ่มต้นของแอป

แก้ไฟล์ `App.tsx` (ที่ root ของโปรเจค มีอยู่แล้วจากขั้นที่ 2) **แทนที่ทั้งไฟล์** ด้วย:

```typescript
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
```

> ตอนนี้ยังรันไม่ได้ (ยังไม่มีไฟล์ `OnboardingScreen`) — สร้างในขั้นถัดไป

**อธิบาย:**

- **`<SafeAreaProvider>` ครอบนอกสุด (ห้ามลืม!)** — ไฟล์ฉากต่างๆ จะเรียก `useSafeAreaInsets()` เพื่อถามระยะขอบจอ hook นี้ **ต้องมี `SafeAreaProvider` อยู่ชั้นนอกเสมอ** ไม่งั้นแอปพังบนมือถือจริง (บนเว็บอาจไม่พังเลยทำให้ไม่รู้ตัว)
- **`finished`** — `false` = โชว์ Onboarding, `true` = โชว์หน้า "จบแล้ว"
- **`onFinish={() => setFinished(true)}`** — ส่งฟังก์ชันให้ `OnboardingScreen` เรียกตอนผู้ใช้กด "Sign Up" ที่ฉากสุดท้าย (`OnboardingScreen` ไม่ต้องรู้ว่าจบแล้วจะไปไหน — แอปจริงอาจเปลี่ยนเป็นเปิดหน้า Login, ตัวอย่างนี้แค่โชว์หน้า "จบแล้ว")
- **เทคนิค `key={runId}` สำหรับ "ดูอีกครั้ง"** — ปกติ React เก็บ state ของ component ไว้ แต่ถ้า `key` เปลี่ยน React จะ **ทิ้งของเก่าแล้วสร้างใหม่ทั้งหมด** ทำให้ `animationController` เริ่มที่ `0` ใหม่ (เหมาะมากตอนสอน — กดดูซ้ำได้เรื่อยๆ ไม่ต้อง reload แอป)

---

## 8. `OnboardingScreen.tsx` — ตัวคุม animation หลัก

สร้างไฟล์ `src/OnboardingScreen.tsx` — **รอบแรกใส่แค่ Splash** (ฉากอื่นจะทยอยเพิ่มทีละขั้น):

```typescript
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { palette } from './palette';
import SplashScene from './scenes/SplashScene';

interface Props {
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: Props) {
  const window = useWindowDimensions();
  const animationController = useRef(new Animated.Value(0));
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    return () => controller.removeListener(id);
  }, []);

  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue,
      duration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      useNativeDriver: false, // NextButtonArrow animate width/borderRadius ซึ่ง native driver ไม่รองรับ
    }).start();
  }, []);

  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2);
    else if (value <= 0.2) playAnimation(0.4);
    else if (value <= 0.4) playAnimation(0.6);
    else if (value <= 0.6) playAnimation(0.8);
    else onFinish();
  }, [playAnimation, onFinish]);

  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0);
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2);
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4);
    else if (value >= 0.8) playAnimation(0.6);
  }, [playAnimation]);

  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        {/* ฉากเนื้อหาจะทยอยเพิ่มตรงนี้ในขั้นที่ 10 และ 13 */}
      </Animated.View>

      {/* TopBackSkipView เพิ่มในขั้นที่ 14 */}
      {/* CenterNextButton เพิ่มในขั้นที่ 12 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

**อธิบายทีละส่วน:**

| โค้ด | ทำหน้าที่อะไร |
|---|---|
| `animationController = useRef(new Animated.Value(0))` | "เข็มนาฬิกา" ตัวเดียวของทั้งหน้า ส่งต่อให้ทุกฉาก/ทุกปุ่มเป็น prop — ใช้ `useRef` เพื่อให้เป็นตัวเดิมตลอด ไม่ถูกสร้างใหม่ทุกครั้งที่ render |
| `currentValue` + `addListener` | `Animated.Value` **อ่านค่าปัจจุบันตรงๆ ไม่ได้** ต้องดักฟังทุกครั้งที่ค่าเปลี่ยนแล้วจดไว้ใน `currentValue` เอาไว้เช็คตอนกดปุ่ม |
| `return () => controller.removeListener(id)` | ถอด listener ตอนหน้านี้ถูกปิด — ถ้าไม่ถอดจะค้างในหน่วยความจำ (memory leak) |
| `scenesTranslateY` | ยกกลุ่มฉากเนื้อหาทั้งหมดขึ้นมาจากใต้จอ (`window.height` → `0`) ตอนออกจาก Splash แล้วอยู่นิ่งตลอดช่วงที่เหลือ |
| `playAnimation(toValue, duration)` | ฟังก์ชันกลาง "สั่งเข็มนาฬิกาให้วิ่งไปที่ค่าใหม่" — ทุกปุ่มเรียกตัวนี้ ไม่มีใครสั่ง animation เองตรงๆ |
| `Easing.bezier(0.4, 0.0, 0.2, 1.0)` | เส้นโค้งความเร็วมาตรฐานของ Material Design: เร่งออกตัว แล้วค่อยๆ ชะลอตอนจบ — รู้สึกเป็นธรรมชาติกว่าความเร็วคงที่ (ลองเปลี่ยนเป็น `Easing.linear` ในแบบฝึกหัดข้อ 2) |
| `useNativeDriver: false` | ต้องเป็น `false` เพราะในขั้นที่ 11 เราจะ animate `width` ซึ่ง native driver ไม่รองรับ (ถ้าตั้ง `true` จะ error) |
| `onNextClick` | ดูว่าตอนนี้อยู่ช่วงไหน แล้วสั่งไปช่วงถัดไป (+0.2) — ถ้าอยู่ฉากสุดท้ายแล้ว (`> 0.6`) เรียก `onFinish()` จบ Onboarding |
| `onBackClick` | กลับกันกับ `onNextClick` คือถอยไป −0.2 |
| `onSkipClick` | กระโดดไปฉากสุดท้าย (`0.8`) ทันที **ไม่ได้ปิด Onboarding** — ผู้ใช้ยังต้องกด "Sign Up" อีกที (เหมือนต้นฉบับ) |

> **ทำไม `onBackClick` / `onSkipClick` ยังไม่ได้ใช้?** เตรียมไว้ก่อน ขั้นที่ 14 จะเอาไปผูกกับปุ่ม — TypeScript ไม่ฟ้อง error ตัวแปรที่ประกาศแต่ยังไม่ใช้

---

## 9. `SplashScene.tsx` — หน้าแรกสุด

สร้างไฟล์ `src/scenes/SplashScene.tsx`:

```typescript
import { StyleSheet, View, Text, Image, Animated, useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../palette';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

const introImage = require('../../assets/onboarding/introduction_image.png');

// หน้าแรกสุดที่เห็นตอนเปิดแอป — เลื่อนขึ้นหายไปทั้งหน้าทันทีที่กด "Let's begin" (progress 0 -> 0.2)
// ปุ่มตรงนี้เป็นปุ่มธรรมดา (ไม่ใช่ NextButtonArrow ที่มอร์ฟได้ — ตัวนั้นอยู่ใน CenterNextButton ซึ่งซ่อนอยู่ตอนอยู่หน้านี้)
export default function SplashScene({ onNextClick, animationController }: Props) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const translateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [0, -window.height, -window.height],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: palette.background, transform: [{ translateY }] }]}>
      <ScrollView style={{ flexGrow: 0 }} alwaysBounceVertical={false}>
        <Image
          style={{ width: window.width, height: undefined, aspectRatio: 357 / 470 }}
          source={introImage}
        />
        <Text style={styles.title}>Clearhead</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet,consectetur{'\n'}adipiscing elit,sed do eiusmod tempor{'\n'}incididunt ut labore
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 8 + insets.bottom }]}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: 'powderblue' }}
          onPress={onNextClick}
        >
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
    borderRadius: 29,
    paddingVertical: 16,
    paddingHorizontal: 56,
    justifyContent: 'center',
  },
  buttonText: { fontSize: 18, color: palette.buttonText },
});
```

**อธิบาย:**

- **`animationController: React.RefObject<Animated.Value>`** — รับ "ตัว ref" มาทั้งก้อน (ไม่ใช่ค่าตัวเลข) แล้วเข้าถึงตัวเลขผ่าน `.current` ทุกฉากรับ prop นี้แบบเดียวกันหมด
- **`require('../../assets/onboarding/introduction_image.png')`** — วิธีโหลดรูปจากในโปรเจคของ React Native (path นับจากไฟล์นี้: ออกจาก `scenes/` → ออกจาก `src/` → เข้า `assets/onboarding/`) — **path ผิดแม้ตัวเดียว bundle จะ error ทันที**
- **`translateY` 3 จุด `[0, 0.2, 0.8]` → `[0, -window.height, -window.height]`** — ตอน `0` อยู่ที่เดิม, ตอน `0.2` เลื่อนขึ้นพ้นจอพอดี, จาก `0.2` ถึง `0.8` **ค้างอยู่นอกจอ** (ใส่จุด `0.8` ไว้เพื่อบอกว่า "หลังจากนี้ไม่ต้องกลับมา")
- **`aspectRatio: 357 / 470`** — รูปจริงกว้าง 357 สูง 470 กำหนดความกว้างเท่าจอ แล้วให้ React Native คำนวณความสูงตามสัดส่วนเอง รูปจะไม่บิดเบี้ยวไม่ว่าจอกว้างแค่ไหน
- **`paddingBottom: 8 + insets.bottom`** — ดันปุ่มขึ้นจากขอบล่างให้พ้นแถบ home ของ iPhone รุ่นใหม่
- **`Pressable` + `android_ripple`** — ปุ่มกดได้ พร้อมเอฟเฟกต์คลื่นตอนกดบน Android
- **`Let&apos;s begin`** — `&apos;` คือเครื่องหมาย `'` ใน JSX (เขียน `'` ตรงๆ ได้เหมือนกัน แต่ linter บางตัวเตือน)

### ✅ Checkpoint 1

```bash
npx expo start --go
```

สแกน QR ด้วย Expo Go — ควรเห็นหน้า "Clearhead" พร้อมรูปและปุ่ม "Let's begin"
**กดปุ่ม** → หน้า Splash ต้อง **เลื่อนขึ้นหายไปอย่างนุ่มนวลใน 1.6 วินาที** เหลือแต่พื้นสีครีมเปล่าๆ (ยังไม่มีฉากอื่น ถูกต้องแล้ว)

> อยากดูซ้ำ: กด `r` ใน terminal เพื่อ reload แอป

---

## 10. `RelaxScene.tsx` — ฉากที่ 1

สร้างไฟล์ `src/scenes/RelaxScene.tsx`:

```typescript
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const relaxImage = require('../../assets/onboarding/relax_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

// สไลด์ที่ 1 (progress 0.2 -> 0.4 คือช่วงที่เห็นเต็มจอ)
export default function RelaxScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const titleTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [-(26 * 2), 0, 0],
  });
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -window.width * 2, 0, 0],
  });
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -(IMAGE_WIDTH * 4), 0, 0],
  });
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
  container: { alignItems: 'center', paddingBottom: 100 },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
});
```

**อธิบาย — ทำไมมี 4 animation ในฉากเดียว:**

| ตัวแปร | ขยับอะไร | ทำไม |
|---|---|---|
| `containerTranslateX` | ทั้งฉาก | 0→0.2 อยู่ที่ 0 (กลางจอ), 0.2→0.4 เลื่อนออกซ้าย `-window.width` แล้วค้างไว้ |
| `titleTranslateY` | หัวข้อ "Relax" | ตอนยังอยู่ Splash (0) หัวข้อเลื่อนลงต่ำ `-52` ... พอถึง 0.2 ค่อยลอยมาตรงตำแหน่ง → ได้เอฟเฟกต์หัวข้อ "ไหลเข้า" ไม่ใช่โผล่มาแข็งๆ |
| `subtitleTranslateX` | คำอธิบาย | ตอนฉากเลื่อนออก (0.2→0.4) คำอธิบายเลื่อนเร็วกว่าตัวฉาก 2 เท่า (`-window.width * 2`) |
| `imageTranslateX` | รูป | รูปเลื่อนเร็วกว่าอีก (`-350 * 4`) |

**เทคนิค "Parallax" (ระยะลึก):** สังเกตว่ารูป, คำอธิบาย และตัวฉาก **เลื่อนด้วยความเร็วต่างกัน** ตอนออกจากจอ — ทำให้ดูมีมิติ มีชั้นหน้า-หลัง เหมือนกล้องแพนผ่านวิว นี่คือ "ความลับ" ที่ทำให้ animation ดูแพงกว่าการเลื่อนทั้งก้อนพร้อมกันเฉยๆ

> **สังเกต:** ฉากนี้ไม่มี `position: 'absolute'` เหมือนฉากอื่น เพราะเป็น "ตัวหลัก" ที่กำหนดตำแหน่งกลางจอ ฉากอื่น (ขั้นที่ 13) จะซ้อนทับอยู่ตำแหน่งเดียวกันด้วย `absolute`

**เพิ่มเข้า `OnboardingScreen.tsx`** — 2 จุด:

```typescript
// 1) เพิ่ม import ใต้บรรทัด import SplashScene
import RelaxScene from './scenes/RelaxScene';
```

```tsx
{/* 2) ใส่ใน Animated.View ของ scenesContainer */}
<Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
  <RelaxScene animationController={animationController} />
</Animated.View>
```

### ✅ Checkpoint 2

reload แอป (`r`) → กด "Let's begin" → Splash เลื่อนขึ้น **พร้อมกับ** ฉาก Relax เลื่อนขึ้นมาแทนจากด้านล่าง หัวข้อ "Relax" ไหลลงมาเข้าที่ — แต่ยังไปต่อไม่ได้ (ยังไม่มีปุ่มถัดไป) ถูกต้องแล้ว

---

## 11. `NextButtonArrow.tsx` — ปุ่มที่ "มอร์ฟ" ได้

ไฮไลต์ของงานนี้ — ปุ่มลูกศรวงกลม ที่ตอนถึงฉากสุดท้าย **ยืดตัวออกเป็นปุ่มยาวมีคำว่า "Sign Up"**

สร้างไฟล์ `src/scenes/NextButtonArrow.tsx`:

```typescript
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
```

**อธิบายแบบละเอียด:**

**ขั้นที่ 1 — ย่อช่วงให้คิดง่าย (`arrowAnim`)**

```typescript
arrowAnim = interpolate( [0, 0.2, 0.4, 0.6, 0.8] → [0, 0, 0, 0, 1] )
```

ปุ่มนี้สนใจแค่ช่วงสุดท้าย (0.6→0.8) เลยแปลงให้กลายเป็นตัวเลขใหม่ที่ **อยู่ที่ 0 ตลอด แล้วค่อยวิ่ง 0→1 ในช่วงสุดท้ายเท่านั้น** — interpolate ซ้อน interpolate ได้ (ผลลัพธ์ของ `.interpolate()` ก็เป็นค่า animated เหมือนกัน) ทำให้ค่าที่เหลือทั้งหมดคิดในช่วง 0→1 ง่ายๆ

**ขั้นที่ 2 — ตัวปุ่มยืดออก**

| ค่า | ตอน `arrowAnim = 0` (ปุ่มกลม) | ตอน `arrowAnim = 1` (ปุ่มยาว) |
|---|---|---|
| `width` | `58` | `258` |
| `borderRadius` | `40` (มากกว่าครึ่งความสูง → กลมสนิท) | `8` (มุมมนนิดๆ) |

**ขั้นที่ 3 — สลับเนื้อหาข้างใน (crossfade)**

| ช่วง arrowAnim | ลูกศรวงกลม (`icon`) | ข้อความ "Sign Up" (`textRow`) |
|---|---|---|
| 0 → 0.35 | เห็นชัด อยู่กลาง | มองไม่เห็น อยู่ต่ำกว่าปุ่ม 36 px |
| 0.35 → 0.7 | เริ่มลอยขึ้น + จางลง | ยังมองไม่เห็น |
| 0.7 → 0.85 | หายไปแล้ว | เริ่มโผล่ + ลอยขึ้นมา |
| 1 | หายไป (อยู่เหนือปุ่ม −36) | เห็นชัด อยู่ตรงกลาง |

`overflow: 'hidden'` ที่ container ทำให้ของที่ลอยเกินขอบปุ่มถูกตัดทิ้ง → ดูเหมือนลูกศร "ลอยออกด้านบน" และข้อความ "ลอยเข้ามาจากด้านล่าง"

> **⚠️ ห้ามทำแบบนี้ (เคยพังจริงตอนเตรียมเอกสารนี้):**
> ```typescript
> const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons); // ❌
> <AnimatedIcon style={{ opacity: iconOpacity }} ... />
> ```
> บนเว็บทำงานได้ แต่ **บน iPhone/Android จริงแอปพังทันที** ด้วย error `undefined is not a function` (`setNativeProps` ใน `createIconSet.js`) — เพราะไอคอนของ `@expo/vector-icons` ไม่รองรับการถูก animate ตรงๆ
> **วิธีที่ถูก:** ห่อไอคอนด้วย `<Animated.View>` แล้ว animate ที่ View แทน (แบบในโค้ดด้านบน) — ไอคอนข้างในเป็น component ธรรมดาที่ไม่ต้องรู้เรื่อง animation เลย

> ยังรันดูไม่ได้ — ปุ่มนี้จะไปอยู่ใน `CenterNextButton` ขั้นถัดไป

---

## 12. `CenterNextButton.tsx` — dot + ปุ่มถัดไป

สร้างไฟล์ `src/scenes/CenterNextButton.tsx`:

```typescript
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
  index: number;
  selectedIndex: number;
}

function DotIndicator({ index, selectedIndex }: DotProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: index === selectedIndex ? 1 : 0,
      duration: 480,
      useNativeDriver: false,
    }).start();
  }, [selectedIndex, index, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.dotInactive, palette.dotActive],
  });

  return <Animated.View style={[styles.dot, { backgroundColor }]} />;
}

// กลุ่มปุ่ม "ถัดไป" ตรงกลางล่างจอ: dot บอกตำแหน่งสไลด์ + ปุ่มลูกศร (ที่จะมอร์ฟเป็นปุ่ม "Sign Up" ในสไลด์สุดท้าย)
// ซ่อนตัวเองตอนอยู่หน้า Splash (ยังไม่เลื่อน) เห็นเฉพาะช่วงสไลด์เนื้อหา
export default function CenterNextButton({ onNextClick, animationController }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const currentOpacity = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { bottom } = useSafeAreaInsets();
  const dots = useMemo(() => [0, 1, 2, 3], []);

  useEffect(() => {
    const id = animationController.current.addListener(({ value }) => {
      const isVisible = value >= 0.2 && value <= 0.6;
      if ((isVisible && currentOpacity.current === 0) || (!isVisible && currentOpacity.current === 1)) {
        Animated.timing(opacity, { toValue: isVisible ? 1 : 0, duration: 480, useNativeDriver: true }).start();
        currentOpacity.current = isVisible ? 1 : 0;
      }

      if (value >= 0.7) setSelectedIndex(3);
      else if (value >= 0.5) setSelectedIndex(2);
      else if (value >= 0.3) setSelectedIndex(1);
      else if (value >= 0.1) setSelectedIndex(0);
    });
    return () => animationController.current.removeListener(id);
  }, [animationController, opacity]);

  const containerTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [96 * 5, 0, 0, 0, 0],
  });
  const loginTextTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [150, 150, 150, 150, 0],
  });

  return (
    <Animated.View
      style={[styles.container, { paddingBottom: 16 + bottom, transform: [{ translateY: containerTranslateY }] }]}
    >
      <Animated.View style={[styles.dotsRow, { opacity }]}>
        {dots.map((item) => (
          <DotIndicator key={item} index={item} selectedIndex={selectedIndex} />
        ))}
      </Animated.View>

      <NextButtonArrow onBtnPress={onNextClick} animationController={animationController} />

      <Animated.View style={[styles.loginRow, { transform: [{ translateY: loginTextTranslateY }] }]}>
        <Text style={{ color: palette.textMuted }}>Already have an account? </Text>
        <Text style={styles.loginText}>Login</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  dotsRow: { flexDirection: 'row', marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  loginRow: { flexDirection: 'row', marginTop: 8 },
  loginText: { color: palette.button, fontSize: 16, fontWeight: '700' },
});
```

**อธิบาย:**

**`DotIndicator` — จุด 1 จุด ที่เปลี่ยนสีแบบนุ่มนวล**
- แต่ละจุดมี `Animated.Value` (`progress`) **ของตัวเอง** แยกจาก `animationController`
- พอ `selectedIndex` เปลี่ยน → `useEffect` สั่งให้จุดที่ถูกเลือกวิ่งไป `1` จุดอื่นวิ่งไป `0` ใช้เวลา 0.48 วินาที
- `interpolate` สีได้ด้วย! `outputRange: ['#E3E4E4', '#132137']` → ได้สีไล่ระดับระหว่างเทาอ่อนกับกรมท่า (ต้อง `useNativeDriver: false` เพราะ native driver animate สีพื้นหลังไม่ได้)

**ทำไมใช้ `addListener` + `useState` ตรงนี้ (ไม่ใช้ interpolate ตรงๆ เหมือนที่อื่น):**
- `selectedIndex` เป็น **ตัวเลขจำนวนเต็ม** (0,1,2,3) ไม่ใช่ค่าต่อเนื่อง — ฟัง `animationController` แล้วแปลงเป็น index เอง (ตัดที่ `0.1`, `0.3`, `0.5`, `0.7` คือกึ่งกลางระหว่างแต่ละฉาก → จุดเปลี่ยนสีตอนเลื่อนไปได้ครึ่งทาง)
- แถว dot **ซ่อน** ตอนอยู่ Splash (`< 0.2`) และตอนอยู่ฉากสุดท้าย (`> 0.6` เพราะปุ่มกลายเป็น "Sign Up" แล้ว ไม่จำเป็นต้องบอกตำแหน่ง) — ใช้ `currentOpacity` จำไว้ว่าตอนนี้โชว์อยู่ไหม จะได้สั่ง fade **เฉพาะตอนสถานะเปลี่ยน** ไม่ใช่สั่งซ้ำทุกเฟรม

**`containerTranslateY` `[96*5, 0, 0, 0, 0]`** — ตอนอยู่ Splash (`0`) ทั้งกลุ่มถูกดันลงไปซ่อนใต้จอ 480 px พอเข้าฉากเนื้อหาค่อยเลื่อนขึ้นมา

**`loginTextTranslateY`** — ข้อความ "Already have an account? Login" ซ่อนอยู่ใต้จอตลอด โผล่ขึ้นมา **เฉพาะฉากสุดท้าย** (ตอนนั้นเป็นข้อความตกแต่งเฉยๆ ตามต้นฉบับ ไม่ได้กดได้)

**เพิ่มเข้า `OnboardingScreen.tsx`** — 2 จุด:

```typescript
// 1) import
import CenterNextButton from './scenes/CenterNextButton';
```

```tsx
{/* 2) ใต้ </Animated.View> ของ scenesContainer (ต้องอยู่หลังสุด จะได้ลอยทับฉากทั้งหมด) */}
<CenterNextButton onNextClick={onNextClick} animationController={animationController} />
```

### ✅ Checkpoint 3

reload → "Let's begin" → ฉาก Relax ขึ้นมา **พร้อมปุ่มลูกศรกลมและจุด 4 จุดด้านล่าง** (จุดแรกเข้ม) → กดลูกศร → ฉาก Relax เลื่อนออกซ้าย (รูปกับข้อความเลื่อนเร็วไม่เท่ากัน) จุดที่ 2 เข้มขึ้น — แต่จอว่าง เพราะยังไม่มีฉาก Care

---

## 13. `CareScene` / `MoodDiaryScene` / `WelcomeScene` — ฉากที่เหลือ

ทั้ง 3 ไฟล์ใช้ **หลักการเดียวกับ RelaxScene ทุกอย่าง** ต่างกันแค่ (1) ช่วง `inputRange` ที่ตัวเองปรากฏ (2) รูปและข้อความ — ให้นักเรียนลองสังเกตตัวเลขเทียบกับตาราง timeline ในหัวข้อ 1.3

### `src/scenes/CareScene.tsx` — ฉากที่ 2 (เด่นช่วง 0.4)

```typescript
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const careImage = require('../../assets/onboarding/care_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

// สไลด์ที่ 2 (progress 0.4 -> 0.6) — เข้าจากขวา ออกทางซ้าย
export default function CareScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width, -window.width],
  });
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0, -(26 * 2), -(26 * 2)],
  });
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
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingBottom: 100 },
  image: { maxWidth: IMAGE_WIDTH, maxHeight: IMAGE_HEIGHT },
  title: { color: palette.text, fontSize: 26, textAlign: 'center', fontWeight: '700' },
  subtitle: { color: palette.text, textAlign: 'center', paddingHorizontal: 64, paddingVertical: 16 },
});
```

อ่าน `containerTranslateX` ทีละจุด: `0`→นอกจอขวา, `0.2`→ยังนอกจอขวา (รอคิว), **`0.4`→กลางจอ (ถึงตาตัวเอง)**, `0.6`→ออกไปนอกจอซ้าย, `0.8`→ค้างนอกจอซ้าย

รูปเริ่มไกลกว่าตัวฉาก (`350*4 = 1400`) จึง **วิ่งเข้ามาเร็วกว่า** → parallax เหมือนฉาก Relax

### `src/scenes/MoodDiaryScene.tsx` — ฉากที่ 3 (เด่นช่วง 0.6)

```typescript
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const moodDiaryImage = require('../../assets/onboarding/mood_dairy_image.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

// สไลด์ที่ 3 (progress 0.6 -> 0.8) — เข้าจากขวา ออกทางซ้าย
export default function MoodDiaryScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width],
  });
  const subtitleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width * 2, window.width * 2, 0, -(window.width * 2)],
  });
  const imageTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [IMAGE_WIDTH * 4, IMAGE_WIDTH * 4, 0, -(IMAGE_WIDTH * 4)],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: containerTranslateX }] }]}>
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

สังเกตว่า `inputRange` มีแค่ 4 จุด `[0, 0.4, 0.6, 0.8]` — ไม่ต้องใส่ `0.2` เพราะช่วง 0→0.4 ฉากนี้แค่ "รอคิวนอกจอขวา" ค่าไม่เปลี่ยน

### `src/scenes/WelcomeScene.tsx` — ฉากสุดท้าย (เด่นที่ 0.8)

```typescript
import { StyleSheet, Text, Image, Animated, useWindowDimensions } from 'react-native';
import { palette } from '../palette';

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const welcomeImage = require('../../assets/onboarding/welcome.png');
const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 350;

// สไลด์สุดท้าย (progress 0.6 -> 0.8) — เข้าจากขวาแล้วหยุดอยู่กับที่
export default function WelcomeScene({ animationController }: Props) {
  const window = useWindowDimensions();

  const containerTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [window.width, window.width, 0],
  });
  const titleTranslateX = animationController.current.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [26 * 2, 26 * 2, 0],
  });
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

ฉากสุดท้ายไม่ต้องมีช่วง "ออก" เพราะไม่มีฉากถัดไปแล้ว — มาถึง `0` ที่ `0.8` แล้วจบ

**เพิ่มทั้ง 3 ฉากเข้า `OnboardingScreen.tsx`:**

```typescript
import CareScene from './scenes/CareScene';
import MoodDiaryScene from './scenes/MoodDiaryScene';
import WelcomeScene from './scenes/WelcomeScene';
```

```tsx
<Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
  <RelaxScene animationController={animationController} />
  <CareScene animationController={animationController} />
  <MoodDiaryScene animationController={animationController} />
  <WelcomeScene animationController={animationController} />
</Animated.View>
```

### ✅ Checkpoint 4

reload → ไล่กดลูกศรไปจนสุด ต้องเห็น: Relax → Care → Mood Dairy → Welcome แต่ละฉากเข้าจากขวาออกทางซ้าย, จุดด้านล่างเปลี่ยนตาม, **ที่ฉาก Welcome ปุ่มลูกศรยืดออกกลายเป็น "Sign Up →"** และจุดหายไป ข้อความ "Already have an account? Login" โผล่ขึ้นมา → กด **Sign Up** → เข้าหน้า "จบ Onboarding แล้ว 🎉" → กด **ดูอีกครั้ง** → กลับมาเริ่ม Splash ใหม่

---

## 14. `TopBackSkipView.tsx` — ปุ่มย้อนกลับ/ข้าม

สร้างไฟล์ `src/scenes/TopBackSkipView.tsx`:

```typescript
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
```

**อธิบาย:**
- **`marginTop`** — iOS ถาม `useSafeAreaInsets().top` (ความสูงรอยบาก/status bar), Android ใช้ `StatusBar.currentHeight` (`?? 0` กันกรณีเป็น `undefined`) — แถบปุ่มจะอยู่ใต้ status bar พอดีทุกเครื่อง
- **`headerTranslateY`** — ตอนอยู่ Splash ซ่อนแถบไว้เหนือจอ (ไม่มีอะไรให้ย้อนกลับ) เข้าฉากเนื้อหาแล้วเลื่อนลงมา
- **`skipTranslateX` `[..., 80]`** — ถึงฉากสุดท้ายปุ่ม Skip เลื่อนออกขวาพ้นจอ (ไม่มีอะไรให้ข้ามแล้ว)
- **`StatusBar as RNStatusBar`** — เปลี่ยนชื่อตอน import กันชนกับ `StatusBar` ของ `expo-status-bar` (คนละตัว ตัวนี้ใช้อ่าน `currentHeight`)
- ไอคอน `arrow-back-ios` ใน `Pressable` ธรรมดา **ไม่ได้ animate ตัวไอคอน** (animate ที่ View แม่) → ปลอดภัยจากปัญหาในหัวข้อ 11

**เพิ่มเข้า `OnboardingScreen.tsx`** — นี่คือ **ไฟล์สมบูรณ์สุดท้าย** (เทียบให้ตรงทุกบรรทัด):

```typescript
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
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: Props) {
  const window = useWindowDimensions();
  const animationController = useRef(new Animated.Value(0));
  const currentValue = useRef(0);

  useEffect(() => {
    const controller = animationController.current;
    const id = controller.addListener(({ value }) => {
      currentValue.current = value;
    });
    return () => controller.removeListener(id);
  }, []);

  const scenesTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  const playAnimation = useCallback((toValue: number, duration = 1600) => {
    Animated.timing(animationController.current, {
      toValue,
      duration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
      useNativeDriver: false, // NextButtonArrow animate width/borderRadius ซึ่ง native driver ไม่รองรับ
    }).start();
  }, []);

  const onNextClick = useCallback(() => {
    const value = currentValue.current;
    if (value === 0) playAnimation(0.2);
    else if (value <= 0.2) playAnimation(0.4);
    else if (value <= 0.4) playAnimation(0.6);
    else if (value <= 0.6) playAnimation(0.8);
    else onFinish();
  }, [playAnimation, onFinish]);

  const onBackClick = useCallback(() => {
    const value = currentValue.current;
    if (value >= 0.2 && value < 0.4) playAnimation(0);
    else if (value >= 0.4 && value < 0.6) playAnimation(0.2);
    else if (value >= 0.6 && value < 0.8) playAnimation(0.4);
    else if (value >= 0.8) playAnimation(0.6);
  }, [playAnimation]);

  const onSkipClick = useCallback(() => playAnimation(0.8, 1200), [playAnimation]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style="dark" />

      <SplashScene onNextClick={onNextClick} animationController={animationController} />

      <Animated.View style={[styles.scenesContainer, { transform: [{ translateY: scenesTranslateY }] }]}>
        <RelaxScene animationController={animationController} />
        <CareScene animationController={animationController} />
        <MoodDiaryScene animationController={animationController} />
        <WelcomeScene animationController={animationController} />
      </Animated.View>

      <TopBackSkipView onBackClick={onBackClick} onSkipClick={onSkipClick} animationController={animationController} />

      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scenesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center' },
});
```

> **ลำดับใน JSX สำคัญ:** component ที่เขียน **ทีหลัง** จะวาด **ทับ** ตัวที่เขียนก่อน — `TopBackSkipView` กับ `CenterNextButton` จึงต้องอยู่ล่างสุด ไม่งั้นฉากจะทับปุ่มจนกดไม่ได้

### ✅ Checkpoint 5 (เสร็จสมบูรณ์)

ทดสอบครบทุกปุ่ม:
- [ ] กด **ย้อนกลับ** (มุมซ้ายบน) ที่ฉากไหนก็ได้ → ถอยไปทีละฉาก (ที่ฉาก Relax กดแล้วกลับไป Splash)
- [ ] กด **Skip** จากฉาก Relax → กระโดดไปฉาก Welcome ทันที (เร็วกว่าปกติ 1.2 วิ) และปุ่ม Skip เลื่อนหายไป
- [ ] ที่ Welcome กด **Sign Up** → หน้า "จบแล้ว"
- [ ] กด **ดูอีกครั้ง** → เริ่มที่ Splash ใหม่

---

## 15. ตารางสรุป: อะไรขยับตอนไหน

ใช้ตารางนี้ตอนสอนอธิบายภาพรวม (ค่าคือ "อยู่ที่ไหน" ณ จุดนั้นๆ — ระหว่างจุดคือกำลังเลื่อน)

| ชิ้นส่วน | 0 | 0.2 | 0.4 | 0.6 | 0.8 |
|---|---|---|---|---|---|
| **Splash** | ✅ กลางจอ | ⬆️ พ้นจอบน | ⬆️ | ⬆️ | ⬆️ |
| **กลุ่มฉากเนื้อหา** | ⬇️ ใต้จอ | ✅ ขึ้นมาแล้ว | ✅ | ✅ | ✅ |
| **Relax** | (ตามกลุ่ม) | ✅ กลางจอ | ⬅️ ออกซ้าย | ⬅️ | ⬅️ |
| **Care** | ➡️ รอขวา | ➡️ รอขวา | ✅ กลางจอ | ⬅️ ออกซ้าย | ⬅️ |
| **Mood Dairy** | ➡️ | ➡️ | ➡️ รอขวา | ✅ กลางจอ | ⬅️ ออกซ้าย |
| **Welcome** | ➡️ | ➡️ | ➡️ | ➡️ รอขวา | ✅ กลางจอ |
| **แถบ Back/Skip** | ⬆️ ซ่อน | ✅ โผล่ | ✅ | ✅ | ✅ (Skip ➡️ หาย) |
| **ปุ่มลูกศร + dot** | ⬇️ ซ่อน | ✅ dot 1 | ✅ dot 2 | ✅ dot 3 | 🔄 มอร์ฟเป็น "Sign Up" (dot หาย) |
| **ข้อความ Login** | ⬇️ ซ่อน | ⬇️ | ⬇️ | ⬇️ | ✅ โผล่ |

---

## 16. ปัญหาที่เจอบ่อยและวิธีแก้

| อาการ | สาเหตุ | วิธีแก้ |
|---|---|---|
| มือถือขึ้นจอแดง `undefined is not a function` ที่ `setNativeProps` / `createIconSet.js` | ใช้ `Animated.createAnimatedComponent(MaterialIcons)` animate ไอคอนตรงๆ | ห่อไอคอนด้วย `<Animated.View>` แล้ว animate ที่ View (หัวข้อ 11) |
| แอปพังบนมือถือเกี่ยวกับ safe area แต่บนเว็บไม่พัง | ลืม `<SafeAreaProvider>` ใน `App.tsx` | ครอบ `<SafeAreaProvider>` นอกสุด (หัวข้อ 7) |
| `Unable to resolve module ../../assets/onboarding/...` | path รูปผิด หรือไฟล์อยู่ผิดโฟลเดอร์ (ลืม `src/`) | เช็คโครงสร้างตามหัวข้อ 5 ให้ตรงเป๊ะ / ชื่อไฟล์ `mood_dairy_image.png` สะกด `dairy` (ตามต้นฉบับ ไม่ใช่ `diary`) |
| Error `Style property 'width' is not supported by native animated module` | ตั้ง `useNativeDriver: true` ใน `playAnimation` | ต้องเป็น `false` (หัวข้อ 8) |
| ฉากซ้อนกันมั่ว ปุ่มกดไม่ได้ | ลำดับ JSX ผิด / ลืม `position: 'absolute'` ในฉาก Care/MoodDiary/Welcome | ปุ่มต้องอยู่ล่างสุดใน JSX, ฉากรองต้องมี `absolute` (หัวข้อ 13–14) |
| กดปุ่มรัวๆ แล้วข้ามฉาก | กดใหม่ขณะ animation ยังวิ่งไม่จบ (ค่าอยู่ระหว่างช่วง) | พฤติกรรมเดียวกับต้นฉบับ — ถ้าอยากกัน ดูแบบฝึกหัดข้อ 5 |
| `npm run web` error ขาด `react-dom` | ยังไม่ติดตั้ง web support | `npx expo install react-dom react-native-web` (หัวข้อ 3) |
| มือถือสแกน QR แล้วโหลดไม่ขึ้น | มือถือกับคอมคนละ Wi-Fi / firewall | ใช้ `npx expo start --tunnel` |
| `Project is incompatible with this version of Expo Go` / `requires a newer version of Expo Go` | Expo SDK ของโปรเจค (ดู `"expo"` ใน `package.json`) ใหม่กว่าที่แอป Expo Go ในมือถือรองรับ — Expo Go รองรับแค่ **SDK ตัวเดียว** และใน store มักอัปเดตช้ากว่า npm | อัปเดต Expo Go ก่อน ถ้าอัปเดตแล้ว (เป็นล่าสุดแล้ว) ยังขึ้นอยู่ → สร้างโปรเจคใหม่ด้วย `--template blank-typescript@sdk-57` (เปลี่ยนเลขให้ตรงกับที่ Expo Go รองรับ) ตามหัวข้อ 2 |
| `requires an older version of Expo Go` (กลับด้าน) | โปรเจคใช้ SDK เก่ากว่าที่ Expo Go ล่าสุดรองรับ | อัปเกรดโปรเจค: `npx expo install expo@latest --fix` |

**วิธีรันแต่ละแบบ:**
```bash
npx expo start --go      # สแกน QR ด้วย Expo Go บนมือถือ (แนะนำ เห็นผลจริงที่สุด)
npx expo start --tunnel  # ใช้เมื่อมือถือกับคอมคนละเครือข่าย
npm run web              # ดูบนเบราว์เซอร์ (สะดวกตอนสอนบนโปรเจคเตอร์)
```
กด `r` ใน terminal = reload แอป, กด `Ctrl+C` = ปิด

---

## 17. แบบฝึกหัด

เรียงจากง่ายไปยาก — ทำทีละข้อแล้วรันดูความต่าง

1. **ความเร็ว** — เปลี่ยน `duration = 1600` ใน `playAnimation` เป็น `400` และ `3000` สังเกตความรู้สึก แล้วตอบ: ค่าไหนเหมาะกับ "ดูครั้งเดียวตอนเปิดแอป" ค่าไหนเหมาะกับ "ใช้บ่อยๆ"?
2. **Easing** — เปลี่ยน `Easing.bezier(0.4, 0.0, 0.2, 1.0)` เป็น `Easing.linear` แล้วเป็น `Easing.bounce` เทียบความรู้สึกทั้ง 3 แบบ
3. **ธีมสี** — แก้แค่ไฟล์ `palette.ts` ให้เป็นโทนสีของ UniPlay (เช่น `background: '#EEF2FF'`, `button: '#4F46E5'`) แล้วดูว่าทั้งหน้าเปลี่ยนตามโดยไม่ต้องแตะไฟล์อื่นเลย
4. **เนื้อหาไทย** — เปลี่ยนหัวข้อ/คำอธิบายทุกฉากเป็นเรื่องการจองสนามกีฬา (เช่น Relax → "ค้นหาสนาม", Care → "จองง่าย")
5. **กันกดรัว (ท้าทาย)** — ใช้ `useRef<boolean>` จำว่า animation กำลังวิ่งอยู่ไหม (`.start(() => { ... })` รับ callback ตอนจบ) แล้วไม่ให้ `onNextClick`/`onBackClick` ทำงานระหว่างนั้น
6. **Parallax (ท้าทาย)** — ในฉาก Care ลองเปลี่ยน `IMAGE_WIDTH * 4` เป็น `IMAGE_WIDTH * 1` ดูว่าความรู้สึก "มีมิติ" หายไปไหม แล้วอธิบายว่าทำไม
7. **เพิ่มฉากที่ 5 (ท้าทายมาก)** — ต้องวางแผนช่วงใหม่ทั้งหมดเป็น `0 → 1.0` (ช่วงละ 0.2) แก้ `inputRange` ทุกไฟล์, เพิ่ม dot เป็น 5 จุด, แก้เงื่อนไขใน `onNextClick`/`onBackClick` — ใช้ตารางหัวข้อ 15 ช่วยวางแผนก่อนแก้โค้ด

---

## 18. เช็คลิสต์ก่อนถือว่าเสร็จ

- [ ] โครงสร้างไฟล์ตรงกับหัวข้อ 5 ทุกไฟล์ (โดยเฉพาะอยู่ใน `src/` และ `src/scenes/`)
- [ ] รูปครบ 5 ไฟล์ใน `assets/onboarding/`
- [ ] `App.tsx` มี `<SafeAreaProvider>` ครอบ
- [ ] ไม่มี `Animated.createAnimatedComponent(...)` กับไอคอนในโปรเจค
- [ ] `npx tsc --noEmit` ผ่านไม่มี error
- [ ] ผ่าน Checkpoint 1–5 ครบ **บนมือถือจริง** (ไม่ใช่แค่บนเว็บ — บางปัญหาโผล่เฉพาะบนมือถือ)
- [ ] ตอบได้ว่าทำไมทั้งหน้าใช้ `Animated.Value` ตัวเดียว และ `interpolate` ทำงานอย่างไร

---

**อ้างอิง:**
- ต้นฉบับ: [React-Native-UI-Templates / introduction_animation](https://github.com/Aashu-Dubey/React-Native-UI-Templates/tree/main/src/introduction_animation) (MIT License)
- ดีไซน์ต้นฉบับ: [Mental Wellness App (Onboarding) — Behance](https://www.behance.net/gallery/96755139/Mental-Wellness-App-(Onboarding))
- React Native Animated: [reactnative.dev/docs/animated](https://reactnative.dev/docs/animated)
- โค้ดอ้างอิงที่ทำเสร็จแล้ว: โฟลเดอร์ `mobile/onboarding` ใน repo นี้
