# สอน Tailwind CSS ตั้งแต่ศูนย์ — ฉบับคนไม่มีพื้นฐาน

> **เอกสารนี้คู่กับไฟล์ตัวอย่าง** `tailwind/index.html` — บทเรียนในเอกสารนี้มี 17 บท (0–16) **ตรงกับหน้าเว็บทุกบท** และ **โค้ดทุกบล็อกในเอกสารนี้ดึงมาจากไฟล์ `index.html` โดยตรง** (ไม่ได้พิมพ์แยก) จึงเหมือนกันทุกตัวอักษร
>
> | ไฟล์ | ใช้ทำอะไร |
> |---|---|
> | `tailwind/index.html` | หน้ารวมบทเรียน — เปิดบนจอโปรเจคเตอร์ แต่ละบทมี **ผลลัพธ์จริง** + ปุ่ม **ดูโค้ด / คัดลอก** |
> | `tailwind/practice.html` | ไฟล์ฝึกของนักเรียน — ตั้งค่าไว้ให้แล้ว แค่วางโค้ดแล้วเปิดดู |
> | `TAILWIND_GUIDE.md` (ไฟล์นี้) | เอกสารการสอน: อธิบายละเอียด + แบบฝึก "ลองแก้" ทุกบท |

---

## สารบัญ

| บท | เรื่อง | ได้ทำอะไร |
|---|---|---|
| [0](#บทที่-0--tailwind-คืออะไร) | แนวคิด + เริ่มใช้งาน | เข้าใจว่า class = การตกแต่ง, เปิดไฟล์ฝึกได้ |
| [1](#บทที่-1--สี) | สี | ใส่สีพื้น สีตัวอักษร ความทึบ |
| [2](#บทที่-2--ตัวอักษร) | ตัวอักษร | ขนาด ความหนา จัดกลาง ระยะบรรทัด |
| [3](#บทที่-3--ระยะห่าง) | ระยะห่าง | padding / margin |
| [4](#บทที่-4--ขนาด) | ขนาด | กว้าง สูง เต็มจอ จำกัดความกว้าง |
| [5](#บทที่-5--ขอบ-มุมมน-เงา) | ขอบ มุมมน เงา | ทำ "การ์ด" |
| [6](#บทที่-6--flexbox) | Flexbox | เรียงแถว จัดกลาง หัวเว็บ |
| [7](#บทที่-7--grid) | Grid | ตารางการ์ด |
| [8](#บทที่-8--ตำแหน่งและการซ้อนชั้น) | ตำแหน่ง/ซ้อนชั้น | ป้ายมุมการ์ด, แถบติดหัว, ซ่อน/แสดง |
| [9](#บทที่-9--รูปภาพและพื้นหลัง) | รูปภาพ/พื้นหลัง | รูปไม่บิด, ไล่สี, ตัดข้อความยาว |
| [10](#บทที่-10--ฟอร์ม) | ฟอร์ม | ฟอร์มจองสนาม |
| [11](#บทที่-11--responsive) | Responsive | สวยทั้งมือถือและคอม |
| [12](#บทที่-12--hover-และสถานะ) | Hover/สถานะ | ปุ่มที่รู้สึกว่ากดได้ |
| [13](#บทที่-13--animation) | Animation | วงโหลด, skeleton, ความเร็ว |
| [14](#บทที่-14--dark-mode) | Dark mode | สลับโหมดมืด |
| [15](#บทที่-15--ปรับแต่งเอง) | ปรับแต่งเอง | ค่าพิเศษ `[...]`, สีแบรนด์ |
| [16](#บทที่-16--โปรเจคจริง-หน้าจองสนาม-uniplay) | **โปรเจคจริง** | หน้าจองสนาม UniPlay ครบทุกบท |
| — | [ปัญหาที่เจอบ่อย](#ปัญหาที่เจอบ่อย) · [Cheat Sheet](#cheat-sheet) · [คำศัพท์](#คำศัพท์) | |

**แผนการสอนแนะนำ (2 คาบ):**
- **คาบ 1 (พื้นฐาน):** บท 0–7 — จบคาบนักเรียนทำการ์ดสนามเรียงเป็นตารางได้
- **คาบ 2 (ทำให้ใช้งานจริงได้):** บท 8–15 แล้วปิดด้วยบท 16 ให้นักเรียนประกอบหน้าเอง

**วิธีสอนแต่ละบท (ทำซ้ำทุกบท):** ① เปิด `index.html` บทนั้นให้ดูผลลัพธ์ → ② อธิบายตาราง class → ③ นักเรียนคัดลอกโค้ดไปวางใน `practice.html` → ④ ทำ "ลองแก้" แล้วรีเฟรชดูผล

---

## บทที่ 0 — Tailwind คืออะไร

### 0.1 ความคิดหลักในประโยคเดียว

> **Tailwind = ชุด class สำเร็จรูป ที่ 1 class ทำ 1 การตกแต่ง** เอามาต่อกันใน `class="..."` ได้เลย ไม่ต้องเขียนไฟล์ CSS เอง

**เทียบกับ CSS แบบเดิม:** ต้องเขียน 2 ที่ — ตั้งชื่อ class ใน HTML แล้วไปเขียนการตกแต่งในไฟล์ CSS อีกที

```html
<button class="my-btn">จอง</button>

.my-btn {
  background: #4f46e5;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
}
```

**Tailwind:** เขียนที่เดียวจบ — อ่าน class ก็รู้เลยว่าหน้าตาเป็นยังไง

| class | อ่านว่า | เท่ากับ CSS |
|---|---|---|
| `bg-indigo-600` | **b**ack**g**round สีคราม ความเข้ม 600 | `background: #4f46e5` |
| `text-white` | ตัวอักษรสีขาว | `color: white` |
| `px-4` | **p**adding แกน **x** (ซ้าย-ขวา) 4 หน่วย | `padding-left/right: 16px` |
| `py-2` | padding แกน **y** (บน-ล่าง) 2 หน่วย | `padding-top/bottom: 8px` |
| `rounded-lg` | มุมมนขนาด large | `border-radius: 8px` |

### 0.2 เริ่มใช้งาน (ไม่ต้องติดตั้งอะไร)

1. ติดตั้ง **VS Code** ([code.visualstudio.com](https://code.visualstudio.com)) และใช้เบราว์เซอร์ **Chrome** หรือ **Edge**
2. VS Code → **File → Open Folder** → เลือกโฟลเดอร์ `tailwind`
3. เปิด `practice.html` — ส่วน `<head>` ตั้งค่าไว้ให้แล้ว หัวใจคือบรรทัดนี้ (โหลด Tailwind จากอินเทอร์เน็ต):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   ```
4. ดับเบิลคลิก `practice.html` ใน File Explorer (หรือคลิกขวา → Open with → Chrome) ต้องเห็นตัวหนังสือสีม่วงตัวใหญ่ **"พร้อมเรียน Tailwind แล้ว 🎉"** ✅
5. **รอบการทำงาน:** แก้โค้ด → `Ctrl + S` (บันทึก) → กลับไปที่เบราว์เซอร์กด `F5` (รีเฟรช)

> **💡 ตัวช่วย (ไม่บังคับ):** ติดตั้งส่วนเสริม **Live Server** ใน VS Code (แถบซ้าย ไอคอนสี่เหลี่ยม 4 ช่อง → ค้น "Live Server") แล้วคลิกขวาที่ไฟล์ → **Open with Live Server** — บันทึกปุ๊บ เบราว์เซอร์รีเฟรชเองไม่ต้องกด F5
>
> **⚠️ ส่วน `<head>` ของ `practice.html` ห้ามลบ** — มีการตั้งค่าฟอนต์ไทย, สีแบรนด์ (บท 15) และ dark mode (บท 14) ที่ตรงกับ `index.html` ถ้าลบ โค้ดบางบทจะไม่ได้ผลเหมือนตัวอย่าง

### 0.3 ตัวอย่างแรก

วางแทนบรรทัด `<!-- วางโค้ดตรงนี้ -->` ใน `practice.html`:

```html
<button class="bg-indigo-600 text-white px-4 py-2 rounded-lg">จอง</button>
```

**ควรเห็น:** ปุ่มสีครามมุมมน ตัวอักษรขาว — หน้าตาเหมือนกับแบบ CSS เดิมทุกอย่าง

**ลองแก้:**
1. เปลี่ยน `bg-indigo-600` เป็น `bg-green-600` — ปุ่มเปลี่ยนสีไหม?
2. เปลี่ยน `px-4` เป็น `px-10` — ปุ่มกว้างขึ้นไหม?
3. เปลี่ยน `rounded-lg` เป็น `rounded-full` — ปุ่มเป็นทรงแคปซูลไหม?

---

## บทที่ 1 — สี

**สูตร:** `สิ่งที่จะใส่สี` - `ชื่อสี` - `ความเข้ม`

| ส่วน | ค่าที่ใช้ได้ |
|---|---|
| สิ่งที่จะใส่สี | `bg-` พื้นหลัง · `text-` ตัวอักษร · `border-` เส้นขอบ |
| ชื่อสี | `slate` `gray` `red` `orange` `amber` `yellow` `green` `emerald` `teal` `sky` `blue` `indigo` `violet` `purple` `pink` `rose` … และ `white` `black` (ไม่มีตัวเลข) |
| ความเข้ม | `50` (อ่อนสุด) `100` `200` … `900` `950` (เข้มสุด) — **`500` คือสีกลางๆ** |
| ความทึบ (เติมท้าย) | `/20` `/50` `/80` เช่น `bg-indigo-600/20` = ทึบ 20% (โปร่ง 80%) |

```html
<!-- ไล่ความเข้มของสี sky -->
<div class="flex flex-wrap gap-2">
  <div class="bg-sky-100 px-3 py-2 rounded">100</div>
  <div class="bg-sky-300 px-3 py-2 rounded">300</div>
  <div class="bg-sky-500 text-white px-3 py-2 rounded">500</div>
  <div class="bg-sky-700 text-white px-3 py-2 rounded">700</div>
  <div class="bg-sky-900 text-white px-3 py-2 rounded">900</div>
</div>
<!-- ชื่อสียอดนิยม -->
<div class="flex flex-wrap gap-2">
  <span class="bg-red-500 text-white px-3 py-1 rounded">red</span>
  <span class="bg-orange-500 text-white px-3 py-1 rounded">orange</span>
  <span class="bg-amber-400 px-3 py-1 rounded">amber</span>
  <span class="bg-green-500 text-white px-3 py-1 rounded">green</span>
  <span class="bg-teal-500 text-white px-3 py-1 rounded">teal</span>
  <span class="bg-blue-500 text-white px-3 py-1 rounded">blue</span>
  <span class="bg-indigo-500 text-white px-3 py-1 rounded">indigo</span>
  <span class="bg-pink-500 text-white px-3 py-1 rounded">pink</span>
  <span class="bg-slate-500 text-white px-3 py-1 rounded">slate</span>
</div>
<!-- สีตัวอักษร + ความทึบ -->
<p class="text-green-600">ว่าง — จองได้</p>
<p class="text-red-600">เต็มแล้ว</p>
<div class="bg-indigo-600/20 text-indigo-800 px-3 py-2 rounded">พื้นหลัง indigo ทึบแค่ 20%</div>
```

**ควรเห็น:** แถบสีฟ้าไล่จากอ่อนไปเข้ม, ป้ายสีต่างๆ 9 สี, ข้อความสีเขียว/แดง, กล่องสีครามจางๆ

**เคล็ดลับความสวย:** พื้นเข้ม (`500` ขึ้นไป) ใช้ตัวอักษร `text-white` · พื้นอ่อน (`100`–`300`) ใช้ตัวอักษรสีเข้มชื่อเดียวกัน เช่น `bg-green-100 text-green-700` (ดูป้าย "ว่าง" ในบท 5) — อ่านง่ายและดูเข้าชุด

**ลองแก้:**
1. เปลี่ยน `bg-sky-` ทั้ง 5 กล่องเป็น `bg-rose-` — ได้ชุดสีชมพูไล่ระดับ
2. ในกล่องสุดท้าย เปลี่ยน `/20` เป็น `/50` แล้วเป็น `/80` — เข้มขึ้นเรื่อยๆ ไหม?
3. ลองเอา `text-white` ออกจากกล่อง `bg-sky-900` — อ่านออกไหม? (นี่คือเหตุผลที่พื้นเข้มต้องใช้ตัวอักษรขาว)

---

## บทที่ 2 — ตัวอักษร

| อยากทำ | class | หมายเหตุ |
|---|---|---|
| ขนาด | `text-xs` `text-sm` `text-base` `text-lg` `text-xl` `text-2xl` … `text-9xl` | `text-base` = 16px คือขนาดปกติ |
| ความหนา | `font-normal` `font-medium` `font-semibold` `font-bold` | |
| จัดวาง | `text-left` `text-center` `text-right` | |
| ระยะบรรทัด | `leading-tight` `leading-normal` `leading-relaxed` | ย่อหน้ายาวใช้ `relaxed` อ่านสบาย |
| ระยะห่างตัวอักษร | `tracking-tight` `tracking-wide` `tracking-widest` | |
| ตัวพิมพ์ใหญ่ | `uppercase` | ใช้กับภาษาอังกฤษ |

> ⚠️ **ระวังสับสน:** `text-` ใช้ทั้ง **ขนาด** (`text-2xl`) และ **สี** (`text-red-600`) — Tailwind แยกออกเองจากคำที่ตามมา ใส่ทั้งสองพร้อมกันได้: `text-2xl text-red-600`

```html
<p class="text-xs">text-xs ตัวเล็กมาก (12px)</p>
<p class="text-base">text-base ขนาดปกติ (16px)</p>
<p class="text-2xl">text-2xl ใหญ่ขึ้น (24px)</p>
<p class="text-4xl font-bold">text-4xl font-bold</p>
<p class="text-lg font-semibold text-center text-indigo-600">จัดกลาง ตัวหนาปานกลาง</p>
<p class="text-sm text-slate-500 leading-relaxed">
  leading-relaxed = ระยะห่างระหว่างบรรทัดกว้างขึ้น อ่านสบายตา เหมาะกับย่อหน้ายาวๆ
  ที่มีหลายบรรทัด ลองเปลี่ยนเป็น leading-tight แล้วเทียบดู
</p>
<p class="uppercase tracking-widest text-xs font-semibold text-slate-400">uppercase + tracking-widest</p>
```

**ควรเห็น:** ตัวอักษรใหญ่ขึ้นเรื่อยๆ, บรรทัดสีครามจัดกลาง, ย่อหน้าสีเทาบรรทัดห่าง, ตัวพิมพ์ใหญ่ห่างๆ สีเทาอ่อน

**เคล็ดลับความสวย — ลำดับชั้นของข้อความ:** หัวข้อ **ใหญ่+หนา+เข้ม** (`text-2xl font-bold`) · เนื้อหา **ปกติ** · ข้อความรอง **เล็ก+เทา** (`text-sm text-slate-500`) — ต่างกันชัดๆ ตาจะรู้เองว่าอ่านอะไรก่อน

**ลองแก้:**
1. เปลี่ยน `leading-relaxed` เป็น `leading-tight` — ย่อหน้าอ่านยากขึ้นไหม?
2. เปลี่ยน `text-center` เป็น `text-right`
3. ทำหัวข้อของตัวเอง: `<h1 class="text-3xl font-bold text-slate-900">ชื่อของฉัน</h1>`

---

## บทที่ 3 — ระยะห่าง

**ตัวเลข 1 หน่วย = 4px** → `p-1` = 4px, `p-4` = 16px, `p-8` = 32px

```
            margin (m) — ระยะห่าง "ข้างนอก" ดันเพื่อนออกไป
   ┌──────────────────────────────────────┐
   │  padding (p) — ระยะห่าง "ข้างใน"      │  ← ขอบกล่อง
   │   ┌──────────────────────────────┐   │
   │   │        เนื้อหา                 │   │
   │   └──────────────────────────────┘   │
   └──────────────────────────────────────┘
```

| ตัวอักษร | ความหมาย | ตัวอย่าง |
|---|---|---|
| `p-` / `m-` | ทุกด้าน | `p-4` |
| `px-` / `mx-` | แกน x = ซ้าย+ขวา | `px-8` |
| `py-` / `my-` | แกน y = บน+ล่าง | `py-2` |
| `pt-` `pr-` `pb-` `pl-` | **t**op บน · **r**ight ขวา · **b**ottom ล่าง · **l**eft ซ้าย | `mt-6` `ml-12` |
| `mx-auto` | จัดกล่องไว้กลาง (ต้องมีความกว้างด้วย) | `mx-auto max-w-md` |
| `space-y-4` (ที่แม่) | ลูกทุกตัวห่างกันแนวตั้ง 16px | ใช้แทนการใส่ `mt-4` ทีละตัว |

```html
<!-- padding: ดันเนื้อหาออกจากขอบ "ข้างใน" กล่อง -->
<div class="flex flex-wrap items-start gap-3">
  <div class="bg-amber-200 p-1">p-1</div>
  <div class="bg-amber-200 p-4">p-4</div>
  <div class="bg-amber-200 p-8">p-8</div>
  <div class="bg-amber-200 px-8 py-2">px-8 py-2</div>
</div>
<!-- margin: ดันกล่อง "ออกจากเพื่อนข้างๆ" -->
<div class="bg-slate-100 p-2">
  <div class="bg-teal-300 p-2">กล่อง A</div>
  <div class="bg-teal-300 p-2 mt-6">กล่อง B (mt-6 ห่างจาก A 24px)</div>
  <div class="bg-teal-300 p-2 mt-2 ml-12">กล่อง C (mt-2 ml-12)</div>
</div>
```

**ควรเห็น:** กล่องเหลือง 4 กล่องที่ "พื้นที่ข้างใน" ต่างกัน (`p-8` ใหญ่สุด) · กล่องเขียว B ห่างจาก A มากกว่าปกติ · กล่อง C ถูกดันเยื้องไปทางขวา

**ลองแก้:**
1. เปลี่ยน `mt-6` ของกล่อง B เป็น `mt-0` — B ชิด A ไหม?
2. เปลี่ยน `ml-12` ของกล่อง C เป็น `ml-0` แล้วเป็น `ml-32`
3. ในกล่องเหลืองอันแรก เปลี่ยน `p-1` เป็น `p-12`

---

## บทที่ 4 — ขนาด

| อยากทำ | class | หมายเหตุ |
|---|---|---|
| กว้างตามตัวเลข | `w-16` (64px) `w-32` `w-64` | หน่วยเดียวกับระยะห่าง (×4px) |
| กว้างเป็นสัดส่วน | `w-1/2` `w-1/3` `w-2/3` `w-full` | เทียบกับกล่องแม่ |
| สูง | `h-8` `h-32` `h-screen` | `h-screen` = สูงเต็มจอ |
| ห้ามกว้างเกิน | `max-w-xs` (320px) `max-w-sm` (384) `max-w-md` (448) `max-w-xl` `max-w-4xl` | ใช้คู่ `w-full` = "เต็ม แต่ไม่เกินนี้" |
| กว้าง = สูง | `size-8` `size-12` `size-16` | สี่เหลี่ยมจัตุรัส / วงกลม |

```html
<div class="w-16 h-8 bg-pink-300">w-16</div>
<div class="w-1/2 bg-pink-300">w-1/2 (ครึ่งหนึ่งของแม่)</div>
<div class="w-full bg-pink-300">w-full (เต็มความกว้างแม่)</div>
<div class="w-full max-w-sm bg-pink-400 text-white">w-full max-w-sm (เต็ม แต่ไม่เกิน 384px)</div>
<div class="flex gap-2">
  <div class="size-8 bg-indigo-500"></div>
  <div class="size-12 bg-indigo-500"></div>
  <div class="size-16 bg-indigo-500"></div>
</div>
```

**ควรเห็น:** แถบชมพูสั้น, ครึ่งจอ, เต็มจอ, เต็มแต่หยุดที่ 384px · สี่เหลี่ยมคราม 3 ขนาด

**ทำไม `w-full max-w-sm` สำคัญ:** บนมือถือจอแคบ → กล่องเต็มจอพอดี · บนคอมจอกว้าง → กล่องไม่ยืดยาวจนน่าเกลียด — การ์ดและฟอร์มเกือบทุกอันในโลกใช้แบบนี้

**ลองแก้:**
1. เปลี่ยน `w-1/2` เป็น `w-1/3` แล้วเป็น `w-3/4`
2. ย่อหน้าต่างเบราว์เซอร์ให้แคบๆ — แถบ `max-w-sm` ยังเต็มจอไหม? ขยายกลับ — หยุดที่ 384px ไหม?
3. เพิ่ม `rounded-full` ให้ `size-16` — ได้วงกลม

---

## บทที่ 5 — ขอบ มุมมน เงา

| อยากทำ | class |
|---|---|
| เส้นขอบ | `border` (1px) `border-2` `border-4` + สี `border-slate-200` |
| ขอบด้านเดียว | `border-t` `border-b` `border-l` `border-r` |
| มุมมน | `rounded` `rounded-lg` `rounded-xl` `rounded-2xl` `rounded-3xl` `rounded-full` (วงกลม/แคปซูล) |
| เงา | `shadow-sm` `shadow` `shadow-md` `shadow-lg` `shadow-xl` `shadow-2xl` |

```html
<div class="flex flex-wrap gap-4">
  <div class="size-20 bg-sky-200 border border-sky-500"></div>
  <div class="size-20 bg-sky-200 rounded-lg"></div>
  <div class="size-20 bg-sky-200 rounded-3xl"></div>
  <div class="size-20 bg-sky-200 rounded-full"></div>
</div>
<div class="flex flex-wrap gap-6 bg-slate-50 p-6">
  <div class="w-28 rounded-xl bg-white p-4 shadow-sm">shadow-sm</div>
  <div class="w-28 rounded-xl bg-white p-4 shadow-md">shadow-md</div>
  <div class="w-28 rounded-xl bg-white p-4 shadow-xl">shadow-xl</div>
</div>
<!-- รวมทุกอย่าง = การ์ด 1 ใบ -->
<div class="max-w-xs rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
  <p class="text-lg font-bold">สนามฟุตบอล 1</p>
  <p class="text-sm text-slate-500">หญ้าเทียม · 11 คน</p>
  <span class="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">ว่าง</span>
</div>
```

**ควรเห็น:** สี่เหลี่ยมฟ้า 4 แบบ (มุมเหลี่ยม → มน → มนมาก → วงกลม) · การ์ดขาว 3 ใบเงาเข้มขึ้นเรื่อยๆ · การ์ด "สนามฟุตบอล 1" ที่มีป้าย "ว่าง" สีเขียว

**สูตรการ์ดสวย (จำไปใช้ได้ตลอด):** `rounded-2xl` + `bg-white` + `p-5` + `shadow-lg` + `border border-slate-200` (ขอบบางๆ สีอ่อน ช่วยให้การ์ดคมขึ้นบนพื้นสีอ่อน)

**ลองแก้:**
1. ลบ `shadow-lg` ออกจากการ์ดสนาม — ดูแบนลงไหม?
2. เปลี่ยน `rounded-2xl` เป็น `rounded-none` — ดูแข็งขึ้นไหม?
3. เปลี่ยนป้าย "ว่าง" เป็น "เต็ม": `bg-red-100` + `text-red-700`

---

## บทที่ 6 — Flexbox

**ใส่ `flex` ที่ "กล่องแม่"** → ลูกทุกตัวเรียงต่อกันแนวนอน แล้วใช้ class อื่นที่แม่เพื่อจัดตำแหน่งลูก

```
justify- = จัดตาม "แนวที่เรียง"          items- = จัด "แนวตั้งฉาก"
(flex ปกติ = แนวนอน)                    (flex ปกติ = แนวตั้ง)

justify-start   [A][B]·········         items-start   ┌[A][B]──┐
justify-center  ····[A][B]·····                        │        │
justify-end     ·········[A][B]                        └────────┘
justify-between [A]·········[B]         items-center  ┌────────┐
                                                      │ [A][B] │
                                                      └────────┘
```

| class (ใส่ที่แม่) | ทำอะไร |
|---|---|
| `flex` | เปิดใช้ flex — ลูกเรียงแนวนอน |
| `flex-col` | เปลี่ยนเป็นเรียงแนวตั้ง |
| `justify-start / center / end / between` | จัดตามแนวที่เรียง (`between` = ชิดสองข้าง แบ่งช่องเท่ากัน) |
| `items-start / center / end` | จัดแนวตั้งฉาก |
| `gap-2` `gap-4` | ช่องว่างระหว่างลูก |
| `flex-wrap` | ล้นแล้วขึ้นบรรทัดใหม่ |
| `flex-1` (ใส่ที่ลูก) | ลูกตัวนี้ยืดกินที่ที่เหลือ (ใช้ในบท 10, 13, 16) |

```html
<div class="flex gap-2 bg-slate-100 p-2">
  <div class="bg-violet-400 p-3 text-white">A</div><div class="bg-violet-400 p-3 text-white">B</div><div class="bg-violet-400 p-3 text-white">C</div>
  <span class="self-center text-slate-500">flex gap-2</span>
</div>
<div class="flex justify-center gap-2 bg-slate-100 p-2">
  <div class="bg-violet-400 p-3 text-white">A</div><div class="bg-violet-400 p-3 text-white">B</div>
  <span class="self-center text-slate-500">justify-center</span>
</div>
<div class="flex justify-between bg-slate-100 p-2">
  <div class="bg-violet-400 p-3 text-white">โลโก้</div>
  <span class="self-center text-slate-500">justify-between</span>
  <div class="bg-violet-400 p-3 text-white">เมนู</div>
</div>
<div class="flex h-28 items-center justify-center bg-slate-100">
  <div class="bg-violet-500 p-3 text-white">อยู่กลางกล่องพอดี (items-center justify-center)</div>
</div>
<div class="flex flex-col gap-2 bg-slate-100 p-2">
  <div class="bg-violet-400 p-2 text-white">flex-col: 1</div>
  <div class="bg-violet-400 p-2 text-white">flex-col: 2</div>
</div>
<!-- ใช้จริง: แถวหัวเว็บ -->
<div class="flex items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-white">
  <span class="font-bold">⚽ UniPlay</span>
  <div class="flex gap-4"><a href="#l6">สนาม</a><a href="#l6">การจอง</a><a href="#l6">ออกจากระบบ</a></div>
</div>
```

**ควรเห็น:** กล่องม่วงเรียงแถว → อยู่กลาง → ชิดซ้ายขวา → อยู่กลางกล่องสูงพอดี → เรียงแนวตั้ง → แถบหัวเว็บ UniPlay (โลโก้ซ้าย เมนูขวา)

**สูตรจำ:** จัดกลางกล่องพอดี = `flex items-center justify-center` · หัวเว็บ = `flex items-center justify-between`

**ลองแก้:**
1. แถวที่ 2: เปลี่ยน `justify-center` เป็น `justify-end`
2. หัวเว็บ: เปลี่ยน `gap-4` เป็น `gap-10` — เมนูห่างขึ้น
3. แถวแรก: เพิ่ม `flex-col` — เปลี่ยนเป็นแนวตั้งไหม?

---

## บทที่ 7 — Grid

**`grid grid-cols-3`** = แบ่ง 3 คอลัมน์เท่ากัน ลูกจะเรียงลงช่องเองอัตโนมัติ (เกิน 3 ขึ้นแถวใหม่เอง)

| class | ทำอะไร |
|---|---|
| `grid grid-cols-2` / `3` / `4` | แบ่งคอลัมน์ (ใส่ที่แม่) |
| `gap-3` | ช่องว่างระหว่างช่อง |
| `col-span-2` (ใส่ที่ลูก) | ลูกตัวนี้กว้าง 2 ช่อง |

**Flex vs Grid ใช้อะไรดี?** ของ **เรียง 1 แถว** (เมนู, ปุ่มคู่, หัวเว็บ) → `flex` · ของ **หลายแถวหลายคอลัมน์ขนาดเท่ากัน** (การ์ดสนาม, แกลเลอรี) → `grid`

```html
<div class="grid grid-cols-3 gap-3">
  <div class="rounded bg-emerald-300 p-4">1</div>
  <div class="rounded bg-emerald-300 p-4">2</div>
  <div class="rounded bg-emerald-300 p-4">3</div>
  <div class="rounded bg-emerald-300 p-4">4</div>
  <div class="rounded bg-emerald-300 p-4">5</div>
</div>
<div class="grid grid-cols-4 gap-3">
  <div class="col-span-3 rounded bg-emerald-500 p-4 text-white">col-span-3 (เนื้อหาหลัก)</div>
  <div class="rounded bg-emerald-300 p-4">เมนูข้าง</div>
  <div class="col-span-4 rounded bg-emerald-200 p-4">col-span-4 (เต็มแถว)</div>
</div>
```

**ควรเห็น:** กล่องเขียว 5 กล่องเรียง 3+2 · ตารางที่เนื้อหาหลักกว้าง 3 ส่วน เมนูข้าง 1 ส่วน และแถวล่างเต็มแถว

**ลองแก้:**
1. เปลี่ยน `grid-cols-3` เป็น `grid-cols-2` แล้วเป็น `grid-cols-5`
2. เปลี่ยน `col-span-3` เป็น `col-span-2` — เกิดอะไรกับเมนูข้าง?
3. เปลี่ยน `gap-3` เป็น `gap-8`

---

## บทที่ 8 — ตำแหน่งและการซ้อนชั้น

| class | ทำอะไร | ใช้ทำอะไรจริง |
|---|---|---|
| `relative` (แม่) + `absolute` (ลูก) | ลูกลอยได้อิสระ โดยวัดตำแหน่งจากขอบแม่ | ป้าย HOT มุมการ์ด, ปุ่มปิด ✕ |
| `top-3` `right-3` `bottom-0` `left-0` | ห่างจากขอบแม่เท่าไหร่ | |
| `sticky top-0` | เลื่อนผ่านแล้ว "ติด" ด้านบน | หัวตาราง, เมนู (สารบัญของ `index.html` ก็ใช้ตัวนี้) |
| `fixed` | ติดหน้าจอตลอด ไม่เลื่อนตาม | ปุ่มแชทมุมจอ, แถบเมนูล่างบนมือถือ |
| `z-10` `z-20` `z-30` | ซ้อนกัน ตัวเลขมากอยู่บน | |
| `hidden` / `block` / `inline-block` / `flex` | ซ่อน / แสดง | ใช้คู่ responsive ในบท 11 |

> ⚠️ **ลืม `relative` ที่แม่ = ลูก `absolute` จะวิ่งไปเกาะมุมของทั้งหน้า** (ผิดพลาดบ่อยที่สุดของบทนี้)

```html
<!-- ป้ายมุมการ์ด: แม่ relative, ลูก absolute -->
<div class="relative max-w-xs rounded-2xl bg-slate-100 p-6">
  <span class="absolute top-3 right-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">HOT</span>
  <p class="font-bold">สนามฟุตซอล</p>
  <p class="text-slate-500">ป้าย HOT ลอยอยู่มุมขวาบนของการ์ด</p>
</div>
<!-- ซ้อนชั้น: z ยิ่งมากยิ่งอยู่บน -->
<div class="relative h-28">
  <div class="absolute top-0 left-0 z-10 size-20 rounded-lg bg-sky-400 p-2 text-white">z-10</div>
  <div class="absolute top-6 left-10 z-30 size-20 rounded-lg bg-pink-500 p-2 text-white">z-30</div>
  <div class="absolute top-12 left-20 z-20 size-20 rounded-lg bg-amber-400 p-2">z-20</div>
</div>
<!-- sticky: เลื่อนกล่องนี้ดู หัวข้อจะติดด้านบน -->
<div class="h-40 max-w-xs overflow-y-auto rounded-lg border border-slate-200">
  <div class="sticky top-0 bg-indigo-600 px-3 py-2 text-white">หัวข้อ sticky (เลื่อนดูสิ)</div>
  <p class="p-3">รายการที่ 1</p><p class="p-3">รายการที่ 2</p><p class="p-3">รายการที่ 3</p>
  <p class="p-3">รายการที่ 4</p><p class="p-3">รายการที่ 5</p><p class="p-3">รายการที่ 6</p>
</div>
<!-- hidden / inline-block -->
<p>ข้อความนี้ <span class="hidden">ถูกซ่อน (hidden)</span><span class="inline-block rounded bg-green-100 px-2 text-green-700">แสดงเป็น inline-block</span></p>
```

**ควรเห็น:** การ์ดเทามีป้ายแดง "HOT" มุมขวาบน · สี่เหลี่ยม 3 สีซ้อนกัน **สีชมพู (z-30) อยู่บนสุด** แม้เขียนไว้ตรงกลาง · กล่องรายการที่เลื่อนแล้วแถบครามติดด้านบน · ข้อความที่มีป้ายเขียว (ส่วน "ถูกซ่อน" มองไม่เห็น)

**ลองแก้:**
1. ลบ `relative` ออกจากการ์ด HOT — ป้ายวิ่งไปไหน? (ใส่คืนด้วย!)
2. เปลี่ยน `top-3 right-3` เป็น `bottom-3 left-3`
3. เปลี่ยน `z-30` ของกล่องชมพูเป็น `z-0` — ใครขึ้นมาอยู่บนแทน?
4. ลบ `hidden` ออก — ข้อความที่ซ่อนโผล่ไหม?

---

## บทที่ 9 — รูปภาพและพื้นหลัง

| อยากทำ | class | หมายเหตุ |
|---|---|---|
| รูปเต็มกรอบ ไม่บิด | `object-cover` | ตัดส่วนเกินออก (สำคัญที่สุดของบทนี้) |
| ล็อกสัดส่วนกรอบ | `aspect-video` (16:9) `aspect-square` (1:1) | ใช้คู่ `w-full` |
| รูปโปรไฟล์วงกลม | `size-32 rounded-full object-cover` | |
| ตัดมุมรูปตามการ์ด | `overflow-hidden` ที่การ์ด | ไม่งั้นรูปทะลุมุมมน |
| ไล่สี | `bg-linear-to-r from-pink-500 to-orange-400` | ทิศ: `to-r` ขวา `to-b` ล่าง `to-br` ขวาล่าง · สีกลาง `via-white` |
| ข้อความยาวเกิน → … | `truncate` | 1 บรรทัด |

> รูปตัวอย่างมาจาก `picsum.photos` (เว็บรูปตัวอย่างฟรี) ต้องต่ออินเทอร์เน็ต — งานจริงเปลี่ยน `src` เป็นรูปของเรา เช่น `src="images/field.jpg"`

```html
<!-- เทียบรูปบิด vs object-cover (รูปจาก picsum.photos ต้องต่อเน็ต) -->
<div class="flex flex-wrap gap-4">
  <div>
    <img src="https://picsum.photos/seed/uniplay/600/400" alt="ตัวอย่างรูป" class="h-32 w-32 rounded-lg" />
    <p class="mt-1 text-red-600">ไม่มี object-cover = บิด</p>
  </div>
  <div>
    <img src="https://picsum.photos/seed/uniplay/600/400" alt="ตัวอย่างรูป" class="h-32 w-32 rounded-lg object-cover" />
    <p class="mt-1 text-green-600">object-cover = ไม่บิด</p>
  </div>
  <div>
    <img src="https://picsum.photos/seed/uniplay/600/400" alt="ตัวอย่างรูป" class="size-32 rounded-full object-cover" />
    <p class="mt-1">รูปโปรไฟล์วงกลม</p>
  </div>
</div>
<!-- การ์ดรูป: overflow-hidden ตัดมุมรูปให้มนตามการ์ด -->
<div class="max-w-xs overflow-hidden rounded-2xl bg-white shadow-md">
  <img src="https://picsum.photos/seed/stadium/800/450" alt="สนาม" class="aspect-video w-full object-cover" />
  <p class="truncate p-4 font-semibold">สนามฟุตบอลหญ้าเทียมมาตรฐาน FIFA อาคารกีฬากลางมหาวิทยาลัย</p>
</div>
<!-- ไล่สี -->
<div class="flex flex-wrap gap-3">
  <div class="h-16 w-40 rounded-lg bg-linear-to-r from-pink-500 to-orange-400"></div>
  <div class="h-16 w-40 rounded-lg bg-linear-to-br from-indigo-600 to-violet-500"></div>
  <div class="h-16 w-40 rounded-lg bg-linear-to-b from-sky-300 via-white to-green-300"></div>
</div>
```

**ควรเห็น:** รูปเดียวกัน 3 แบบ — แบบแรก **บิดเบี้ยว** (ถูกบีบ), แบบสอง **ไม่บิด**, แบบสามวงกลม · การ์ดรูปมุมมนพร้อมชื่อสนามที่ยาวเกินถูกตัดเป็น "…" · แถบไล่สี 3 แบบ

**ลองแก้:**
1. ลบ `overflow-hidden` ออกจากการ์ดรูป — มุมบนของรูปยังมนไหม?
2. เปลี่ยน `aspect-video` เป็น `aspect-square`
3. ลบ `truncate` — ชื่อสนามขึ้นบรรทัดใหม่ไหม?
4. ทำแถบไล่สีของตัวเอง: `bg-linear-to-r from-green-400 to-blue-500`

---

## บทที่ 10 — ฟอร์ม

**Tailwind ล้างหน้าตาเดิมของช่องกรอกออกหมด** (ช่องกรอกเปล่าๆ จะมองแทบไม่เห็น) เราต้องใส่เองทุกครั้ง — สูตรช่องกรอกที่ใช้ทั้งบทนี้:

```
w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
└ เต็ม ┘└ มุมมน ┘└──── เส้นขอบเทา ────┘└ ระยะข้างใน ┘└ ลบขอบน้ำเงินเดิม ┘└────── ตอนคลิก: ขอบคราม + วงแสงจางๆ ──────┘
```

| ส่วน | class |
|---|---|
| ป้ายชื่อเหนือช่อง | `<label class="block">` + `<span class="text-sm font-medium">` — คลิกที่ป้ายแล้วเคอร์เซอร์ไปที่ช่องเอง |
| ช่องผิดพลาด | เปลี่ยน `border-slate-300` → `border-red-500` + ข้อความ `text-xs text-red-600` ใต้ช่อง |
| checkbox / radio | `size-4 accent-indigo-600` (`accent-` = สีของเครื่องหมายถูก) |
| จัด 2 คอลัมน์ | `grid gap-4 md:grid-cols-2` (มือถือ 1 คอลัมน์ — อธิบายในบท 11) |
| ปุ่มส่งเต็มความกว้าง | `w-full py-3` |

```html
<form class="max-w-xl space-y-4 rounded-2xl border border-slate-200 p-6" onsubmit="event.preventDefault()">
  <h3 class="text-lg font-bold">จองสนาม</h3>
  <div class="grid gap-4 md:grid-cols-2">
    <label class="block">
      <span class="text-sm font-medium text-slate-700">ชื่อผู้จอง</span>
      <input type="text" placeholder="สมชาย ใจดี" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">อีเมล</span>
      <input type="email" value="ผิดรูปแบบ" class="mt-1 w-full rounded-lg border border-red-500 px-3 py-2 outline-none focus:ring-4 focus:ring-red-100" />
      <span class="mt-1 block text-xs text-red-600">กรุณากรอกอีเมลให้ถูกต้อง</span>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">สนาม</span>
      <select class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
        <option>ฟุตบอล 1</option>
        <option>บาสเกตบอล</option>
        <option>แบดมินตัน 2</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">วันที่</span>
      <input type="date" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
    </label>
  </div>
  <label class="block">
    <span class="text-sm font-medium text-slate-700">หมายเหตุ</span>
    <textarea rows="3" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"></textarea>
  </label>
  <div class="flex flex-wrap gap-6 text-sm">
    <label class="flex items-center gap-2"><input type="radio" name="time" class="size-4 accent-indigo-600" checked /> เช้า</label>
    <label class="flex items-center gap-2"><input type="radio" name="time" class="size-4 accent-indigo-600" /> บ่าย</label>
    <label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-indigo-600" /> ขอยืมลูกบอล</label>
  </div>
  <button type="submit" class="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]">ยืนยันการจอง</button>
</form>
```

**ควรเห็น:** ฟอร์ม "จองสนาม" มีช่องชื่อ, อีเมล **ขอบแดง + ข้อความเตือน**, เลือกสนาม, วันที่, หมายเหตุ, ตัวเลือกเช้า/บ่าย, ติ๊กยืมลูกบอล, ปุ่มยืนยันเต็มความกว้าง — **คลิกที่ช่องไหน ขอบเปลี่ยนเป็นครามและมีวงแสง** · จอกว้างเป็น 2 คอลัมน์ จอแคบเป็น 1 คอลัมน์

> `onsubmit="event.preventDefault()"` ใน `<form>` = กันไม่ให้หน้ารีเฟรชตอนกดยืนยัน (เพราะตัวอย่างนี้ยังไม่มีระบบหลังบ้าน)

**ลองแก้:**
1. ลบ `focus:ring-4 focus:ring-indigo-100` ออกจากช่องชื่อ แล้วคลิกเทียบกับช่องอื่น — ดูไม่ชัดว่ากำลังกรอกช่องไหน
2. เปลี่ยน `accent-indigo-600` เป็น `accent-green-600` ทั้ง 3 ตัว
3. ทำช่อง "เบอร์โทร" เพิ่ม โดยคัดลอก `<label>` ของช่องชื่อทั้งก้อน แล้วเปลี่ยนข้อความ

---

## บทที่ 11 — Responsive

**คำนำหน้า = "ตั้งแต่จอขนาดนี้ขึ้นไป"**

| คำนำหน้า | ใช้เมื่อจอกว้าง | อุปกรณ์ประมาณ |
|---|---|---|
| (ไม่มี) | ทุกขนาด | **มือถือ** |
| `sm:` | ≥ 640px | มือถือแนวนอน |
| `md:` | ≥ 768px | แท็บเล็ต |
| `lg:` | ≥ 1024px | โน้ตบุ๊ก/คอม |
| `xl:` | ≥ 1280px | จอใหญ่ |

**หลัก Mobile First:** เขียน class ของ **มือถือก่อน** (ไม่มีคำนำหน้า) แล้วค่อยเติมของจอใหญ่ทับ
`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` อ่านว่า "ปกติ 1 คอลัมน์ · ตั้งแต่ sm 2 คอลัมน์ · ตั้งแต่ lg 4 คอลัมน์"

> **วิธีทดสอบ:** ย่อ-ขยายหน้าต่างเบราว์เซอร์ หรือกด `F12` แล้วกดไอคอนมือถือ/แท็บเล็ต (Toggle device toolbar) มุมซ้ายบนของแผง แล้วเลือกรุ่นมือถือ

```html
<!-- มือถือ 1 คอลัมน์ → แท็บเล็ต 2 → คอม 4 -->
<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded bg-sky-300 p-4">การ์ด 1</div>
  <div class="rounded bg-sky-300 p-4">การ์ด 2</div>
  <div class="rounded bg-sky-300 p-4">การ์ด 3</div>
  <div class="rounded bg-sky-300 p-4">การ์ด 4</div>
</div>
<!-- ตัวบอกขนาดจอปัจจุบัน -->
<div class="rounded-lg p-3 text-center font-semibold text-white bg-red-500 sm:bg-orange-500 md:bg-green-600 lg:bg-indigo-600">
  <span class="sm:hidden">ตอนนี้: มือถือ (&lt; 640px)</span>
  <span class="hidden sm:inline md:hidden">ตอนนี้: sm (≥ 640px)</span>
  <span class="hidden md:inline lg:hidden">ตอนนี้: md (≥ 768px)</span>
  <span class="hidden lg:inline">ตอนนี้: lg (≥ 1024px)</span>
</div>
<!-- ขนาดตัวอักษรก็ responsive ได้ -->
<p class="text-xl font-bold md:text-4xl">หัวข้อเล็กบนมือถือ ใหญ่บนคอม</p>
```

**ควรเห็น:** จอกว้าง การ์ด 4 ใบเรียงแถวเดียว · ย่อจอ → 2 คอลัมน์ → 1 คอลัมน์ · แถบสีบอกขนาดจอปัจจุบัน **แดง (มือถือ) → ส้ม (sm) → เขียว (md) → คราม (lg)** · หัวข้อเล็กลงบนจอแคบ

**ลองแก้:**
1. เปลี่ยน `lg:grid-cols-4` เป็น `lg:grid-cols-3`
2. เปลี่ยน `md:text-4xl` เป็น `md:text-6xl`
3. กลับไปดูบท 10 — ฟอร์ม 2 คอลัมน์ใช้ `md:grid-cols-2` แบบเดียวกัน ลองย่อจอดู

---

## บทที่ 12 — Hover และสถานะ

**คำนำหน้า = "เมื่อไหร่"** — ใช้ได้กับทุก class ที่เรียนมา

| คำนำหน้า | เมื่อไหร่ | ตัวอย่าง |
|---|---|---|
| `hover:` | เอาเมาส์ชี้ | `hover:bg-indigo-700` |
| `active:` | ขณะกดค้าง | `active:scale-95` (ยุบลงนิดนึง) |
| `focus:` | คลิกที่ช่องกรอก | `focus:ring-4` |
| `disabled:` | ปุ่มที่มี attribute `disabled` | `disabled:opacity-40` |
| `group` (แม่) + `group-hover:` (ลูก) | ชี้ที่แม่ แล้วลูกเปลี่ยน | การ์ดทั้งใบ |

**`transition`** = ทำให้การเปลี่ยนแปลง **ค่อยๆ เกิด** แทนการกระตุก (ใส่คู่กับ hover เสมอ)
**`hover:-translate-y-1`** = เลื่อนขึ้น 4px (เครื่องหมาย `-` นำหน้า = ค่าติดลบ = ขึ้น)

```html
<div class="flex flex-wrap gap-3">
  <button class="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">hover เปลี่ยนสี</button>
  <button class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:-translate-y-1 hover:shadow-lg">hover ลอยขึ้น</button>
  <button class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition active:scale-95">กดแล้วยุบ</button>
  <button class="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40" disabled>disabled</button>
</div>
<input class="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="คลิกที่นี่ — ขอบเปลี่ยนสี (focus:)" />
<!-- group: ชี้ที่การ์ด แล้วลูกข้างในเปลี่ยนตาม -->
<a href="#l12" class="group block max-w-xs rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-400 hover:shadow-lg">
  <p class="font-bold group-hover:text-indigo-600">สนามบาสเกตบอล</p>
  <p class="text-sm text-slate-500">ชี้ที่การ์ดนี้ดูสิ</p>
  <p class="mt-2 text-sm text-indigo-600 opacity-0 transition group-hover:opacity-100">ดูรายละเอียด →</p>
</a>
```

**ควรเห็น:** ปุ่มที่ชี้แล้วเข้มขึ้น / ลอยขึ้นมีเงา / กดแล้วยุบ / ปุ่มจางกดไม่ได้ (เมาส์เป็นรูปห้าม) · ช่องกรอกที่คลิกแล้วมีวงแสง · การ์ดที่ชี้แล้วหัวข้อเป็นสีคราม และ "ดูรายละเอียด →" ค่อยๆ โผล่

> 📱 **บนมือถือไม่มี "ชี้"** — hover จึงเป็นแค่ของแถม ข้อมูลสำคัญห้ามซ่อนไว้ให้เห็นเฉพาะตอน hover

**ลองแก้:**
1. ลบ `transition` ออกจากปุ่ม "hover ลอยขึ้น" — การลอยกระตุกไหม?
2. เปลี่ยน `active:scale-95` เป็น `active:scale-75`
3. ลบ `disabled` (คำสุดท้ายในแท็กปุ่มที่ 4) — ปุ่มกลับมาเข้มไหม?

---

## บทที่ 13 — Animation

| class | ทำอะไร | ใช้ทำอะไรจริง |
|---|---|---|
| `animate-spin` | หมุนไม่หยุด | วงกลมกำลังโหลด |
| `animate-ping` | ขยายแล้วจางเป็นคลื่น | จุดแจ้งเตือนใหม่ |
| `animate-pulse` | จางเข้าจางออกช้าๆ | **Skeleton** — กล่องเทาแทนเนื้อหาตอนกำลังโหลด |
| `animate-bounce` | เด้งขึ้นลง | ลูกศรชวนเลื่อนลง |
| `duration-150` / `300` / `700` | ความเร็วของ `transition` (มิลลิวินาที) | ปุ่มใช้ 150–300, ของใหญ่ใช้ 300–500 |
| `hover:scale-110` `hover:rotate-3` | ขยาย / เอียง ตอนชี้ | |

**วงโหลดทำยังไง:** วงกลม (`rounded-full`) ขอบหนา (`border-4`) สีอ่อนทั้งวง (`border-indigo-200`) **ยกเว้นขอบบน** สีเข้ม (`border-t-indigo-600`) แล้วสั่งหมุน (`animate-spin`) → เห็นเป็นเส้นวิ่งวน

```html
<div class="flex flex-wrap items-center gap-8">
  <!-- วงกลมโหลด: ขอบ 3 ด้านจาง 1 ด้านเข้ม แล้วหมุน -->
  <div class="size-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
  <!-- จุดแจ้งเตือน: วงหนึ่ง ping ซ้อนอยู่หลังจุดจริง -->
  <span class="relative flex size-4">
    <span class="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
    <span class="relative inline-flex size-4 rounded-full bg-red-500"></span>
  </span>
  <div class="animate-bounce text-3xl">⚽</div>
</div>
<!-- Skeleton: กล่องเทากะพริบ แทนเนื้อหาตอนกำลังโหลด -->
<div class="flex max-w-xs animate-pulse gap-4 rounded-2xl border border-slate-200 p-4">
  <div class="size-12 rounded-full bg-slate-200"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="h-3 w-3/4 rounded bg-slate-200"></div>
    <div class="h-3 w-1/2 rounded bg-slate-200"></div>
  </div>
</div>
<!-- duration: เทียบความเร็วตอนชี้ -->
<div class="flex flex-wrap gap-3">
  <div class="rounded-lg bg-violet-500 px-4 py-3 text-white transition duration-150 hover:scale-110">duration-150</div>
  <div class="rounded-lg bg-violet-500 px-4 py-3 text-white transition duration-300 hover:scale-110">duration-300</div>
  <div class="rounded-lg bg-violet-500 px-4 py-3 text-white transition duration-700 hover:scale-110 hover:rotate-3">duration-700 + rotate</div>
</div>
```

**ควรเห็น:** วงโหลดหมุน · จุดแดงมีคลื่นกระจาย · ลูกฟุตบอลเด้ง · การ์ดเทากะพริบ (skeleton) · กล่องม่วง 3 กล่องที่ชี้แล้วขยาย **เร็ว / ปานกลาง / ช้า+เอียง**

**ลองแก้:**
1. เปลี่ยน `border-t-indigo-600` เป็น `border-t-green-500`
2. เปลี่ยน `animate-bounce` เป็น `animate-spin` ที่ลูกฟุตบอล
3. เทียบกล่อง duration — แบบไหนเหมาะกับปุ่มที่กดบ่อย? (คำตอบ: เร็ว ไม่เกิน 300 — ช้ากว่านั้นรู้สึกหน่วง)

---

## บทที่ 14 — Dark mode

**เขียนคู่ `dark:`** — class ปกติ = โหมดสว่าง, class ที่ขึ้นต้น `dark:` = โหมดมืด

```
bg-white dark:bg-slate-800       พื้น: ขาว ↔ เทาเข้ม
text-slate-900 dark:text-white   ตัวอักษร: เข้ม ↔ ขาว
text-slate-500 dark:text-slate-400   ข้อความรอง
```

**dark: ทำงานเมื่อไหร่:** ไฟล์ `index.html` และ `practice.html` ตั้งไว้ใน `<head>` ว่า

```css
@custom-variant dark (&:where(.dark, .dark *));
```

แปลว่า "**`dark:` ทำงานเมื่อมี `class="dark"` ที่ตัวเองหรือกล่องแม่**" — เราจึงสลับโหมดได้ด้วยการเพิ่ม/ลบ class `dark` (ถ้าไม่ตั้งบรรทัดนี้ Tailwind จะดูจากการตั้งค่าโหมดมืดของเครื่องแทน และกดสลับเองไม่ได้)

```html
<div id="dark-box" class="rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
  <button onclick="document.getElementById('dark-box').classList.toggle('dark')" class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white dark:bg-amber-300 dark:text-slate-900">
    🌙 สลับโหมด
  </button>
  <div class="mt-4 max-w-xs rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
    <p class="text-lg font-bold text-slate-900 dark:text-white">สนามแบดมินตัน 2</p>
    <p class="text-sm text-slate-500 dark:text-slate-400">ในร่ม · ติดแอร์</p>
  </div>
</div>
```

**ควรเห็น:** กล่องเทาอ่อนมีการ์ดขาว · กด **🌙 สลับโหมด** → พื้นเป็นกรมท่าเข้ม การ์ดเทาเข้ม ตัวอักษรขาว ปุ่มเป็นสีเหลือง · กดอีกครั้งกลับเป็นสว่าง

> `onclick="...classList.toggle('dark')"` = JavaScript บรรทัดเดียว: "ถ้ายังไม่มี class `dark` ให้เพิ่ม ถ้ามีแล้วให้ลบ"

**ลองแก้:**
1. เปลี่ยน `dark:bg-slate-900` เป็น `dark:bg-black`
2. ลบ `dark:text-white` ออกจากชื่อสนาม แล้วสลับเป็นโหมดมืด — อ่านออกไหม? (นี่คือเหตุผลที่ต้องเขียน dark ให้ **ทุก** สี)
3. ทำทั้งหน้า `practice.html` เป็นโหมดมืด: ใส่ `class="dark"` ที่แท็ก `<html>` บรรทัดบนสุด

---

## บทที่ 15 — ปรับแต่งเอง

### 15.1 ค่าเฉพาะครั้ง — วงเล็บเหลี่ยม `[...]`

เมื่อค่าที่อยากได้ **ไม่มีในชุด** เช่น ดีไซเนอร์ให้กว้าง 350px หรือสี `#132137` เป๊ะๆ

| เขียน | ได้ |
|---|---|
| `w-[350px]` | กว้าง 350px |
| `bg-[#132137]` | สีพื้นตามรหัสสี |
| `text-[22px]` | ตัวอักษร 22px |
| `rounded-[20px]` | มุมมน 20px |
| `grid-cols-[120px_1fr]` | คอลัมน์แรก 120px คอลัมน์สองกินที่ที่เหลือ (**ช่องว่างใช้ `_` แทน**) |
| `active:scale-[0.98]` | ใช้ร่วมกับคำนำหน้าได้ (ใช้ในปุ่มฟอร์มบท 10) |

> ⚠️ **อย่าใช้พร่ำเพรื่อ** — ถ้าทุกอย่างเป็น `[...]` จะได้ขนาด/สีมั่วทั้งเว็บ ใช้ชุดมาตรฐาน (`p-4`, `text-lg`) ก่อนเสมอ

### 15.2 สีแบรนด์ — ประกาศครั้งเดียว ใช้ได้ทั้งเว็บ

ใน `<head>` ของ `index.html` / `practice.html` มีส่วนนี้อยู่แล้ว:

```css
@theme {
  --color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
}
```

ชื่อ `--color-brand-600` → Tailwind สร้าง `bg-brand-600`, `text-brand-600`, `border-brand-600`, `hover:bg-brand-600` … ให้อัตโนมัติ
**ข้อดี:** วันหนึ่งอยากเปลี่ยนสีแบรนด์ แก้ 5 บรรทัดนี้ที่เดียว ทั้งเว็บเปลี่ยนตาม

```html
<!-- ค่าเฉพาะครั้ง (arbitrary values) -->
<div class="w-[350px] max-w-full rounded-[20px] bg-[#132137] p-4 text-[22px] text-white">w-[350px] bg-[#132137]</div>
<div class="grid grid-cols-[120px_1fr] gap-3">
  <div class="rounded bg-amber-300 p-3">120px</div>
  <div class="rounded bg-amber-200 p-3">ที่เหลือทั้งหมด (1fr)</div>
</div>
<!-- สีแบรนด์ที่ประกาศใน @theme -->
<div class="flex flex-wrap gap-2">
  <div class="rounded bg-brand-50 px-3 py-2">brand-50</div>
  <div class="rounded bg-brand-100 px-3 py-2">brand-100</div>
  <div class="rounded bg-brand-500 px-3 py-2 text-white">brand-500</div>
  <div class="rounded bg-brand-600 px-3 py-2 text-white">brand-600</div>
  <div class="rounded bg-brand-700 px-3 py-2 text-white">brand-700</div>
</div>
<button class="rounded-lg bg-brand-600 px-5 py-2 text-white hover:bg-brand-700">ปุ่มสีแบรนด์ — เปลี่ยนสีทั้งเว็บได้จากที่เดียว</button>
```

**ควรเห็น:** กล่องกรมท่ากว้าง 350px ตัวอักษร 22px · แถวที่คอลัมน์ซ้ายกว้าง 120px คอลัมน์ขวากินที่เหลือ · แถบสีแบรนด์ 5 ระดับ · ปุ่มสีแบรนด์

**ลองแก้:**
1. ใน `<head>` ของ `practice.html` เปลี่ยน `--color-brand-600: #4f46e5;` เป็น `--color-brand-600: #16a34a;` (เขียว) → รีเฟรช — ปุ่มเปลี่ยนเป็นเขียวโดยไม่ได้แตะโค้ดปุ่มเลย
2. เพิ่มสีของตัวเองใน `@theme`: `--color-uniplay: #f59e0b;` แล้วใช้ `bg-uniplay`
3. เปลี่ยน `grid-cols-[120px_1fr]` เป็น `grid-cols-[1fr_2fr]`

---

## บทที่ 16 — โปรเจคจริง: หน้าจองสนาม UniPlay

รวมทุกบทเป็นหน้าเว็บ 1 หน้า — **ไม่มี class ใหม่เลย** ทุกตัวเรียนมาแล้ว

```
┌───────────────────────────────────────────────┐
│ ⚽ UniPlay        สนามทั้งหมด  การจองของฉัน 🌙 │ ← บท 6 flex justify-between · บท 11 sm:inline · บท 14 dark
├───────────────────────────────────────────────┤
│      จองสนามกีฬาในมหาวิทยาลัย                  │ ← บท 9 bg-linear-to-br · บท 2 text-2xl md:text-4xl
│   [ ค้นหาสนาม เช่น ฟุตบอล     ][ ค้นหา ]       │ ← บท 10 ช่องกรอก · บท 11 flex-col sm:flex-row
├───────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐        │ ← บท 7 grid · บท 11 1→2→3 คอลัมน์
│ │🔥ยอดนิยม ⚽│ │    🏀     │ │    🏸     │        │ ← บท 8 relative + absolute
│ │ฟุตบอล ว่าง│ │บาส เหลือ2│ │แบด  เต็ม │        │ ← บท 1 ป้ายสี · บท 5 rounded-full
│ │฿300 [จอง]│ │฿200 [จอง]│ │฿150 [เต็ม]│        │ ← บท 12 hover / active / disabled
│ └──────────┘ └──────────┘ └──────────┘        │ ← บท 12 hover:-translate-y-1 hover:shadow-xl
├───────────────────────────────────────────────┤
│        © UniPlay · ระบบจองสนามกีฬามหาวิทยาลัย    │ ← บท 5 border-t
└───────────────────────────────────────────────┘
```

```html
<div id="uniplay" class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">

  <!-- หัวเว็บ: โลโก้ซ้าย เมนูขวา -->
  <header class="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-8 dark:bg-slate-900">
    <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">⚽ UniPlay</span>
    <div class="flex items-center gap-4 text-sm">
      <a href="#l16" class="hidden text-slate-600 hover:text-indigo-600 sm:inline dark:text-slate-300">สนามทั้งหมด</a>
      <a href="#l16" class="hidden text-slate-600 hover:text-indigo-600 sm:inline dark:text-slate-300">การจองของฉัน</a>
      <button onclick="document.getElementById('uniplay').classList.toggle('dark')" class="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800 dark:text-white">🌙</button>
    </div>
  </header>

  <!-- ส่วนหัวใหญ่ + ช่องค้นหา -->
  <div class="bg-linear-to-br from-indigo-600 to-violet-600 px-4 py-10 text-center text-white md:px-8 md:py-14">
    <h3 class="text-2xl font-bold md:text-4xl">จองสนามกีฬาในมหาวิทยาลัย</h3>
    <p class="mt-2 text-indigo-100">เลือกสนาม เลือกเวลา จองเสร็จใน 1 นาที</p>
    <div class="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
      <input class="flex-1 rounded-lg px-4 py-2 text-slate-800 outline-none bg-white focus:ring-4 focus:ring-white/40" placeholder="ค้นหาสนาม เช่น ฟุตบอล" />
      <button class="rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-900 transition hover:bg-amber-300 active:scale-95">ค้นหา</button>
    </div>
  </div>

  <!-- การ์ดสนาม: มือถือ 1 / แท็บเล็ต 2 / คอม 3 คอลัมน์ -->
  <div class="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:p-8 lg:grid-cols-3">

    <div class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">
      <div class="relative flex h-32 items-center justify-center bg-linear-to-br from-green-400 to-emerald-600 text-5xl">
        ⚽
        <span class="absolute top-3 left-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-emerald-700">🔥 ยอดนิยม</span>
      </div>
      <div class="p-5">
        <div class="flex items-start justify-between">
          <h4 class="font-bold text-slate-900 dark:text-white">สนามฟุตบอล 1</h4>
          <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">ว่าง</span>
        </div>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">หญ้าเทียม · 11 คน · กลางแจ้ง</p>
        <div class="mt-4 flex items-center justify-between">
          <p class="font-semibold text-indigo-600 dark:text-indigo-400">฿300 <span class="text-xs font-normal text-slate-400">/ชม.</span></p>
          <button class="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700 active:scale-95">จองเลย</button>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">
      <div class="flex h-32 items-center justify-center bg-linear-to-br from-orange-400 to-red-500 text-5xl">🏀</div>
      <div class="p-5">
        <div class="flex items-start justify-between">
          <h4 class="font-bold text-slate-900 dark:text-white">สนามบาสเกตบอล</h4>
          <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">เหลือ 2 ช่วง</span>
        </div>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">พื้นยาง · 10 คน · ในร่ม</p>
        <div class="mt-4 flex items-center justify-between">
          <p class="font-semibold text-indigo-600 dark:text-indigo-400">฿200 <span class="text-xs font-normal text-slate-400">/ชม.</span></p>
          <button class="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700 active:scale-95">จองเลย</button>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900">
      <div class="flex h-32 items-center justify-center bg-linear-to-br from-sky-400 to-indigo-500 text-5xl">🏸</div>
      <div class="p-5">
        <div class="flex items-start justify-between">
          <h4 class="font-bold text-slate-900 dark:text-white">สนามแบดมินตัน 2</h4>
          <span class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900 dark:text-red-300">เต็ม</span>
        </div>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">พื้นไม้ · 4 คน · ติดแอร์</p>
        <div class="mt-4 flex items-center justify-between">
          <p class="font-semibold text-indigo-600 dark:text-indigo-400">฿150 <span class="text-xs font-normal text-slate-400">/ชม.</span></p>
          <button class="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40" disabled>เต็มแล้ว</button>
        </div>
      </div>
    </div>

  </div>

  <!-- ท้ายเว็บ -->
  <footer class="border-t border-slate-200 px-4 py-5 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
    © UniPlay · ระบบจองสนามกีฬามหาวิทยาลัย
  </footer>
</div>
```

**ควรเห็น:** หน้าจองสนามครบ — ย่อจอแล้วการ์ดเปลี่ยน 3 → 2 → 1 คอลัมน์, เมนูหัวเว็บหายบนมือถือ, ช่องค้นหากับปุ่มเรียงแนวตั้งบนมือถือ, ชี้การ์ดแล้วลอยขึ้น, กด 🌙 แล้วทั้งหน้าเป็นโหมดมืด

### งานมอบหมาย (เลือกทำตามระดับ)

| ระดับ | งาน | ใช้บท |
|---|---|---|
| ⭐ | เพิ่มการ์ดสนามที่ 4 "สนามเทนนิส 🎾" (คัดลอกการ์ดเดิมทั้งก้อนแล้วแก้) | 7 |
| ⭐ | เปลี่ยนสีส่วนหัวจาก indigo→violet เป็นสีมหาวิทยาลัยของตัวเอง | 1, 9 |
| ⭐⭐ | เพิ่มป้าย "ใหม่" มุมขวาบนของการ์ดแบดมินตัน | 8 |
| ⭐⭐ | ทำให้คอมจอใหญ่ (`xl:`) แสดง 4 คอลัมน์ | 11 |
| ⭐⭐⭐ | ทำหน้า "การจองของฉัน" เป็นรายการแนวตั้ง แต่ละแถวมี วันที่ / สนาม / สถานะ / ปุ่มยกเลิก | 6, 10, 12 |
| ⭐⭐⭐ | ทำ skeleton (บท 13) ของการ์ดสนาม 3 ใบ สำหรับแสดงตอนกำลังโหลด | 13 |

---

## ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ไม่มีการตกแต่งอะไรเลย หน้าขาวตัวอักษรธรรมดา | ไม่ได้ต่ออินเทอร์เน็ต / ลบบรรทัด `<script src=".../@tailwindcss/browser@4">` | ต่อเน็ต และตรวจว่า `<head>` ครบเหมือน `practice.html` เดิม |
| แก้โค้ดแล้วหน้าไม่เปลี่ยน | ยังไม่ได้บันทึก หรือยังไม่รีเฟรช | `Ctrl + S` แล้ว `F5` (หรือใช้ Live Server) |
| class เดียวไม่ทำงาน | สะกดผิด เช่น `bg-indgo-600`, `text-centre`, `px4` | เทียบกับตาราง / ค้นใน [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| เขียน 2 class ที่ขัดกัน เช่น `p-2 p-8` | ไม่ได้ขึ้นกับลำดับที่เขียน ผลอาจไม่ตามที่คิด | ใส่แค่ตัวเดียว |
| ป้าย `absolute` วิ่งไปมุมหน้าเว็บ | ลืม `relative` ที่กล่องแม่ | บท 8 |
| รูปบิดเบี้ยว | ลืม `object-cover` | บท 9 |
| ช่องกรอกมองไม่เห็น | Tailwind ล้างหน้าตาเดิม | ใส่ `border border-slate-300 px-3 py-2` (บท 10) |
| `dark:` ไม่ทำงานตอนกดปุ่ม | ลบ `@custom-variant dark ...` ใน `<head>` | คืน `<head>` ตาม `practice.html` (บท 14) |
| `bg-brand-600` ไม่มีสี | ไม่ได้ประกาศใน `@theme` | บท 15 |
| สร้าง class จากตัวแปร เช่น `"bg-" + color + "-500"` แล้วไม่ทำงาน | Tailwind ต้องเห็นชื่อ class **เต็มๆ** ในโค้ด | เขียนชื่อเต็ม เช่น `bg-red-500` / `bg-green-500` แล้วเลือกใช้ |
| ทำตามเอกสารนี้ในโปรเจค Tailwind v3 แล้วบาง class ไม่มี | เอกสารนี้ใช้ **v4** — v3 เรียก `bg-linear-to-r` ว่า `bg-gradient-to-r` และไม่มี `@theme` | ใช้ CDN v4 ตาม `practice.html` |

---

## Cheat Sheet

| อยากทำ | class | บท |
|---|---|---|
| สีพื้น / สีตัวอักษร | `bg-indigo-600` · `text-white` · `/50` (ความทึบ) | 1 |
| ขนาด / ความหนาตัวอักษร | `text-2xl` · `font-bold` · `text-center` · `leading-relaxed` | 2 |
| ระยะห่างข้างใน / ข้างนอก | `p-4` · `px-4 py-2` · `mt-6` · `mx-auto` · `space-y-4` | 3 |
| กว้าง / สูง | `w-full` · `max-w-md` · `h-32` · `size-12` | 4 |
| การ์ด | `rounded-2xl` · `shadow-md` · `border border-slate-200` | 5 |
| เรียงแถว / จัดกลาง | `flex` · `items-center` · `justify-between` · `gap-4` · `flex-col` | 6 |
| ตารางการ์ด | `grid grid-cols-3 gap-4` · `col-span-2` | 7 |
| ป้ายลอยมุม / ซ้อนชั้น / ซ่อน | `relative` + `absolute top-2 right-2` · `z-10` · `sticky top-0` · `hidden` | 8 |
| รูปไม่บิด / ไล่สี / ตัดข้อความ | `object-cover` · `aspect-video` · `bg-linear-to-r from-… to-…` · `truncate` | 9 |
| ช่องกรอก | `border rounded-lg px-3 py-2 focus:ring-4` · `accent-indigo-600` | 10 |
| จอใหญ่ทำอีกแบบ | `md:grid-cols-3` · `lg:text-4xl` · `hidden sm:inline` | 11 |
| ชี้ / กด / โฟกัส | `hover:bg-indigo-700` · `active:scale-95` · `transition` · `group-hover:` | 12 |
| ของขยับเอง | `animate-spin` · `animate-pulse` · `duration-300` | 13 |
| โหมดมืด | `dark:bg-slate-900` · `dark:text-white` | 14 |
| ค่าเฉพาะ / สีแบรนด์ | `w-[350px]` · `bg-[#132137]` · `bg-brand-600` | 15 |

---

## คำศัพท์

| คำ | ความหมาย |
|---|---|
| HTML | ภาษาบอก "โครง" ของหน้าเว็บ (มีหัวข้อ ปุ่ม รูป อะไรบ้าง) |
| CSS | ภาษาบอก "หน้าตา" (สี ขนาด ตำแหน่ง) |
| Tailwind CSS | ชุด class สำเร็จรูปที่แทนการเขียน CSS เอง |
| class | ชื่อที่ใส่ในแท็ก `class="..."` — ใน Tailwind แต่ละชื่อคือ 1 การตกแต่ง |
| แท็ก (tag) | `<div>` `<p>` `<button>` `<img>` … ชิ้นส่วนของ HTML |
| `<div>` | กล่องเปล่า ใช้จัดกลุ่ม (เหมือน `View` ใน React Native) |
| CDN | การโหลดไฟล์จากอินเทอร์เน็ต (ไม่ต้องติดตั้งในเครื่อง) |
| padding / margin | ที่ว่างข้างใน / ข้างนอกกล่อง |
| Flexbox / Grid | ระบบจัดเรียงของ แถวเดียว / ตาราง |
| Responsive | หน้าเว็บที่ปรับตามขนาดจอ |
| Mobile First | เขียนแบบมือถือก่อน แล้วค่อยเติมของจอใหญ่ |
| Breakpoint | จุดเปลี่ยนขนาดจอ (`sm` `md` `lg` `xl`) |
| Variant / คำนำหน้า | `hover:` `md:` `dark:` — บอกว่า class นั้นใช้ "เมื่อไหร่" |
| Arbitrary value | ค่าเฉพาะใน `[...]` |
| Skeleton | กล่องเทากะพริบแทนเนื้อหาระหว่างโหลด |

---

**อ้างอิง:** [tailwindcss.com/docs](https://tailwindcss.com/docs) (เอกสารทางการ ค้นหา class ได้) · [Tailwind Play](https://play.tailwindcss.com) (ลองเขียนออนไลน์) · ตัวอย่างประกอบ: `tailwind/index.html` · ไฟล์ฝึก: `tailwind/practice.html`
