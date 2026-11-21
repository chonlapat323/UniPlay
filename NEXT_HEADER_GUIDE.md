# สอนสร้าง Header แบบ Responsive ด้วย Next.js + Tailwind (มือถือ → PC)

> เว็บกีฬา "News" · เน้น **Header อย่างเดียว** — ทุกหน้ามีแค่ข้อความบรรทัดเดียว
> โค้ดเต็ม: `frontend/header-lesson` · ทุกบล็อกโค้ดตรงกับไฟล์จริง และทุก Checkpoint build ผ่านแล้ว
> เวอร์ชัน: Next.js **16.3.5** · React 19 · Tailwind CSS v4

## ผลลัพธ์

```
มือถือ (< 640)                   กด ☰
┌───────────────────────┐      ┌───────────────────────┐
│ 📰 News            ☰  │      │ 📰 News            ✕  │
└───────────────────────┘      ├───────────────────────┤
                               │ หน้าแรก                │
sm (≥ 640)                     │ ข่าว                 ⌄ │ ← กดแล้วเมนูย่อยกาง
┌──────────────────────────────┐ │ ผลการแข่งขัน            │
│ 📰 News      [เข้าสู่ระบบ] ☰ │ │ เกี่ยวกับเรา             │
└──────────────────────────────┘ │ [    เข้าสู่ระบบ     ] │
                               └───────────────────────┘
md (≥ 768) / lg (≥ 1024 มีคำว่า "ข่าวกีฬา" ข้างโลโก้)
┌───────────────────────────────────────────────────────────────────┐
│ 📰 News ข่าวกีฬา   หน้าแรก  ข่าว⌄  ผลการแข่งขัน  เกี่ยวกับเรา  [เข้าสู่ระบบ] │
└───────────────────────────────────────────────────────────────────┘
                           ┌───────────┐
                           │ข่าวทั้งหมด │ ← ชี้หรือคลิก "ข่าว"
                           │ฟุตบอล      │
                           │บาสเกตบอล   │
                           │วอลเลย์บอล   │
                           │แบดมินตัน    │
                           └───────────┘
```

กดเมนูไหน หน้าก็แสดงแค่ข้อความ เช่น `ผลการแข่งขัน` หรือ `ข่าวหมวด: football`

---

## 1. สร้างโปรเจค (CLI)

ต้องมี Node.js 20+ (`node -v`) และ VS Code

```bash
npx create-next-app@16.3.5 header-lesson --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd header-lesson
code .
npm run dev
```

เปิด http://localhost:3000 · หยุดเซิร์ฟเวอร์: `Ctrl + C`

**คำสั่งที่ใช้ในบทนี้**

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รันโหมดพัฒนา (แก้แล้วเห็นผลทันที) |
| `npm run lint` | ตรวจโค้ด |
| `npm run build` | build ฉบับจริง — ผ่าน = ไม่มี error |
| `npm run start` | รันฉบับที่ build แล้ว |
| `code <ไฟล์>` | เปิดไฟล์ใน VS Code |
| `npx next typegen` | สร้างชนิด `PageProps`/`LayoutProps` ใหม่ (เมื่อ VS Code ขีดแดง) |

> Next.js **ไม่มีคำสั่ง generate component** (แบบ `ng generate`) — สร้างหน้า = สร้างโฟลเดอร์ + ไฟล์ `page.tsx` เอง (ข้อ 4)

### ติดตั้ง Tailwind CSS

**ถ้าสร้างโปรเจคด้วยคำสั่งข้างบน — Tailwind ติดตั้งให้แล้ว ไม่ต้องทำอะไรเพิ่ม** เพราะใส่ `--tailwind` ไว้ ซึ่งทำ 3 อย่างนี้ให้:

| สิ่งที่ได้ | อยู่ที่ |
|---|---|
| package `tailwindcss` และ `@tailwindcss/postcss` (v4) | `package.json` |
| ไฟล์ตั้งค่า PostCSS (ตัวที่แปลง class ของ Tailwind เป็น CSS) | `postcss.config.mjs` |
| บรรทัดโหลด Tailwind | `src/app/globals.css` → `@import "tailwindcss";` |

> Tailwind v4 **ไม่มีไฟล์ `tailwind.config.js` แล้ว** (ตัวอย่างเก่าในเน็ตที่บอกให้สร้างไฟล์นี้ เป็นของ v3)

**เช็คว่าติดตั้งแล้ว:** `npm ls tailwindcss` → ต้องเห็น `tailwindcss@4.x.x`

**ถ้ามีโปรเจค Next อยู่แล้วแต่ยังไม่มี Tailwind** — ติดตั้งเอง 3 ขั้น:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
code postcss.config.mjs
```

วางใน `postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

แล้วใส่บรรทัดนี้ **บนสุด** ของ `src/app/globals.css` (ไฟล์นี้ถูก import ใน `layout.tsx` อยู่แล้ว):

```css
@import "tailwindcss";
```

รัน `npm run dev` ใหม่ → ลองใส่ `className="text-3xl font-bold text-indigo-600"` ที่ข้อความไหนก็ได้ ถ้าตัวใหญ่สีคราม = Tailwind ทำงาน ✅

**ทดสอบหลายขนาดจอ:** `F12` → `Ctrl + Shift + M` → ตั้งความกว้าง `375` / `700` / `900` / `1280`

---

## 2. Syntax ของ Next ที่ใช้

| เรื่อง | สรุป |
|---|---|
| **โฟลเดอร์ = URL** | `src/app/about/page.tsx` → `/about` |
| **`layout.tsx`** | กรอบครอบทุกหน้า — วาง `<Header />` ที่นี่ที่เดียว แสดงทุกหน้า |
| **`<Link href="/about">`** | ใช้แทน `<a>` สำหรับลิงก์ในเว็บ (เปลี่ยนหน้าไม่โหลดใหม่ทั้งหน้า) |
| **`"use client"`** | บรรทัดแรกของไฟล์ที่ใช้ `useState` / `onClick` / `usePathname` — Header ต้องมี, หน้าอื่นไม่ต้อง |
| **`useState(false)`** | จำค่าที่เปลี่ยนแล้วหน้าจอวาดใหม่ เช่น เมนูเปิดอยู่ไหม |
| **`usePathname()`** | อ่าน URL ปัจจุบัน ใช้ไฮไลต์เมนู |
| **`useEffect` + `useRef`** | ดักปุ่ม Esc และการคลิกนอก Header เพื่อปิดเมนู |
| **`[category]`** | โฟลเดอร์วงเล็บเหลี่ยม = ส่วนของ URL ที่เปลี่ยนได้ ไฟล์เดียวใช้ได้ทุกหมวด |
| **`await props.params`** | Next 15+ `params` เป็น Promise ต้อง `await` (ฟังก์ชันต้อง `async`) |
| **`@/lib/menu`** | `@/` = โฟลเดอร์ `src/` |

---

## 3. Tailwind: Mobile First

เขียน class ของ **มือถือก่อน** (ไม่มีคำนำหน้า) แล้วเติม `sm:` (≥640) `md:` (≥768) `lg:` (≥1024)

| class | มือถือ | จอใหญ่ | ใช้กับ |
|---|---|---|---|
| `md:hidden` | แสดง | ≥ md ซ่อน | ปุ่ม ☰, เมนูกาง |
| `hidden md:flex` | ซ่อน | ≥ md แสดง | เมนู PC |
| `hidden sm:inline-block` | ซ่อน | ≥ sm แสดง | ปุ่มเข้าสู่ระบบบนแถบ |
| `sm:hidden` | แสดง | ≥ sm ซ่อน | ปุ่มเข้าสู่ระบบในเมนูกาง |
| `hidden lg:inline` | ซ่อน | ≥ lg แสดง | คำว่า "ข่าวกีฬา" |

class อื่นของแถบ: `sticky top-0 z-50` (ติดบนสุด) · `bg-white/90 backdrop-blur` (พื้นโปร่งเบลอ) · `h-16` · `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8` · `flex items-center justify-between`

> ⚠️ ชื่อ class ต้องเขียนเต็ม เช่น `active ? "bg-indigo-50" : "text-slate-600"` — ห้ามต่อสตริง `"bg-" + color` (Tailwind หาไม่เจอ)

---

## 4. ลงมือทำ

```
src/
├── app/
│   ├── globals.css               แทนที่ (4.1)
│   ├── layout.tsx                แทนที่ (4.4, 4.5)
│   ├── page.tsx                  แทนที่ — /
│   ├── news/page.tsx             สร้าง  — /news
│   ├── news/[category]/page.tsx  สร้าง  — /news/football ...
│   ├── results/page.tsx          สร้าง  — /results
│   ├── about/page.tsx            สร้าง  — /about
│   └── login/page.tsx            สร้าง  — /login
├── components/Header.tsx         สร้าง (4.5) แล้วแทนที่ทีละขั้น
└── lib/menu.ts                   สร้าง
next.config.ts                    แทนที่ (4.1)
```

**สร้างโฟลเดอร์/ไฟล์ทั้งหมด** (รันในโฟลเดอร์ `header-lesson`):

```powershell
# Windows (PowerShell)
New-Item -ItemType Directory -Force src/app/news, "src/app/news/[category]", src/app/results, src/app/about, src/app/login, src/components, src/lib | Out-Null
New-Item -ItemType File src/lib/menu.ts, src/app/news/page.tsx, "src/app/news/[category]/page.tsx", src/app/results/page.tsx, src/app/about/page.tsx, src/app/login/page.tsx | Out-Null
```

```bash
# Mac / Linux / Git Bash
mkdir -p "src/app/news/[category]" src/app/results src/app/about src/app/login src/components src/lib
touch src/lib/menu.ts src/app/news/page.tsx "src/app/news/[category]/page.tsx" src/app/results/page.tsx src/app/about/page.tsx src/app/login/page.tsx
```

> path ที่มี `[ ]` ต้องใส่ `"..."` ครอบเสมอ · `Header.tsx` ยังไม่สร้างตอนนี้ (ถ้าเป็นไฟล์เปล่า build จะไม่ผ่าน)

### 4.1 ตั้งค่า: `next.config.ts` และ `src/app/globals.css` — แทนที่ทั้งไฟล์

`next.config.ts` — **สำคัญ:** ถ้าเปิดเว็บผ่าน IP (เช่นจากมือถือจริง `http://192.168.1.10:3000`) โดยไม่ตั้งค่านี้ Next 16 จะบล็อก JavaScript → **หน้าแสดงได้ แต่กดปุ่ม ☰ / เมนูย่อยไม่ติด** (แก้แล้วต้องหยุด `npm run dev` แล้วรันใหม่)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // อนุญาตให้เปิดเว็บโหมด dev ผ่าน IP ในวง Wi-Fi (เช่นเปิดจากมือถือจริง http://192.168.1.10:3000)
  // ถ้าไม่ใส่ Next 16 จะบล็อก JavaScript -> หน้าแสดงได้ แต่กดปุ่ม ☰ / เมนูย่อย ไม่ติด
  // * = ตัวเลข 1 ช่อง -> 192.168.*.* ครอบคลุม IP บ้าน/ห้องเรียนทั่วไป
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
```

`src/app/globals.css` — เหลือแค่ Tailwind + ฟอนต์ไทย:

```css
/* โหลด Tailwind CSS ทั้งหมด (บรรทัดเดียวจบ ไม่ต้องมีไฟล์ tailwind.config) */
@import "tailwindcss";

/* ตั้งฟอนต์หลักของทั้งเว็บ = Noto Sans Thai
   --font-noto-thai ถูกสร้างโดย next/font ใน layout.tsx
   พอตั้ง --font-sans แล้ว class "font-sans" และฟอนต์ปกติของทั้งหน้าจะเป็นฟอนต์นี้ */
@theme inline {
  --font-sans: var(--font-noto-thai);
}
```

### 4.2 เมนู: `src/lib/menu.ts`

เมนูทั้งหมดอยู่ใน array เดียว Header แค่วนลูปสร้างลิงก์ — อยากเพิ่มเมนูแก้ไฟล์นี้ไฟล์เดียว

```typescript
// =============================================================================
// menu.ts — รายการเมนูทั้งหมดของ Header (ข้อมูลล้วนๆ ไม่มีหน้าตา)
// -----------------------------------------------------------------------------
// แยกข้อมูลเมนูออกจากหน้าตา: อยากเพิ่ม/ลบเมนู แก้ที่ไฟล์นี้ไฟล์เดียว
// Header จะวนลูป (map) สร้างลิงก์จาก array นี้ให้เอง ทั้งเมนูมือถือและเมนู PC
// =============================================================================

// รูปร่างของเมนู 1 อัน
export type MenuItem = {
  label: string; // ข้อความที่แสดง
  href: string; // ลิงก์ไปหน้าไหน
  children?: MenuItem[]; // เมนูย่อย (มีหรือไม่มีก็ได้ — เครื่องหมาย ? = ไม่บังคับ)
};

export const menu: MenuItem[] = [
  { label: "หน้าแรก", href: "/" },
  {
    label: "ข่าว",
    href: "/news",
    // เมนูที่มี children จะกลายเป็น dropdown
    children: [
      { label: "ข่าวทั้งหมด", href: "/news" },
      { label: "ฟุตบอล", href: "/news/football" },
      { label: "บาสเกตบอล", href: "/news/basketball" },
      { label: "วอลเลย์บอล", href: "/news/volleyball" },
      { label: "แบดมินตัน", href: "/news/badminton" },
    ],
  },
  { label: "ผลการแข่งขัน", href: "/results" },
  { label: "เกี่ยวกับเรา", href: "/about" },
];

// เช็คว่าเมนูนี้คือ "หน้าที่เปิดอยู่" ไหม (ใช้ไฮไลต์เมนู)
//   exact = true  -> ต้องตรงกันเป๊ะ (ใช้กับเมนูย่อย)
//   exact = false -> หน้าลูกก็นับด้วย เช่น อยู่หน้า /news/football ก็ไฮไลต์เมนู "ข่าว" (/news)
export function isActive(pathname: string, href: string, exact = false) {
  // หน้าแรก "/" ต้องเช็คแบบเป๊ะเสมอ ไม่งั้นทุกหน้าจะนับว่าขึ้นต้นด้วย "/" หมด
  if (href === "/" || exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}
```

### 4.3 หน้าเว็บ — มีแค่ข้อความ

`src/app/page.tsx`
```tsx
// page.tsx = หน้าแรก  URL: /
export default function HomePage() {
  return <h1 className="text-2xl font-bold">หน้าแรก</h1>;
}
```

`src/app/news/page.tsx`
```tsx
// news/page.tsx = หน้าข่าวทั้งหมด  URL: /news
export default function NewsPage() {
  return <h1 className="text-2xl font-bold">ข่าวทั้งหมด</h1>;
}
```

`src/app/news/[category]/page.tsx`
```tsx
// news/[category]/page.tsx = หน้าข่าวแต่ละหมวด (Dynamic Route)
// โฟลเดอร์ [category] = ช่องว่างใน URL -> ไฟล์เดียวใช้ได้ทุกหมวด
//   /news/football -> category = "football"
//   /news/badminton -> category = "badminton"
// ใน Next 16 params เป็น Promise -> ต้อง await ก่อนใช้ (ฟังก์ชันจึงต้องเป็น async)
export default async function CategoryPage(props: PageProps<"/news/[category]">) {
  const { category } = await props.params;
  return <h1 className="text-2xl font-bold">ข่าวหมวด: {category}</h1>;
}
```

`src/app/results/page.tsx`
```tsx
// results/page.tsx = หน้าผลการแข่งขัน  URL: /results
export default function ResultsPage() {
  return <h1 className="text-2xl font-bold">ผลการแข่งขัน</h1>;
}
```

`src/app/about/page.tsx`
```tsx
// about/page.tsx = หน้าเกี่ยวกับเรา  URL: /about
export default function AboutPage() {
  return <h1 className="text-2xl font-bold">เกี่ยวกับเรา</h1>;
}
```

`src/app/login/page.tsx`
```tsx
// login/page.tsx = หน้าเข้าสู่ระบบ  URL: /login
export default function LoginPage() {
  return <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>;
}
```

### 4.4 `src/app/layout.tsx` (ยังไม่มี Header)

```tsx
// =============================================================================
// layout.tsx — "กรอบ" ที่ครอบทุกหน้า (เวอร์ชันเริ่มต้น: ยังไม่มี Header)
// -----------------------------------------------------------------------------
// ทุกหน้า (page.tsx) จะถูกใส่เข้ามาแทนที่ {children}
// =============================================================================
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

// โหลดฟอนต์ไทยผ่าน next/font: Next ดาวน์โหลดมาเก็บในเว็บเราเองตอน build (ไม่ต้องใส่ <link>)
// variable = ชื่อตัวแปร CSS ที่ globals.css เอาไปตั้งเป็นฟอนต์หลัก
const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
});

// ข้อมูลหน้าเว็บ (ชื่อแท็บ, คำอธิบายตอนแชร์/ค้นหา)
//   template: หน้าไหนตั้ง title เอง จะได้ "ชื่อหน้า | News"
//   default : หน้าที่ไม่ตั้ง title (เช่นหน้าแรก)
export const metadata: Metadata = {
  title: { default: "News — ข่าวกีฬา", template: "%s | News" },
  description: "เว็บข่าวกีฬา — บทเรียนสร้าง Header แบบ responsive ด้วย Next.js + Tailwind CSS",
};

// LayoutProps<"/"> = ชนิดข้อมูลสำเร็จรูปของ Next 16 (ไม่ต้อง import) มี children ให้
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-800">
        {/* เนื้อหาของแต่ละหน้า: กว้างไม่เกิน max-w-6xl อยู่กลางจอ, ระยะขอบเพิ่มตามขนาดจอ */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
```

**✅ Checkpoint 0:** `npm run dev` แล้วพิมพ์ URL เอง: `/` `/news` `/news/football` `/results` `/about` `/login` → ทุกหน้าขึ้นข้อความของหน้านั้น

### 4.5 Header ขั้นที่ 1 — มือถือ (โลโก้ + ☰ + เมนูกาง)

สร้างไฟล์: `New-Item -ItemType File src/components/Header.tsx` (Windows) หรือ `touch src/components/Header.tsx` แล้ว `code src/components/Header.tsx`

```tsx
// =============================================================================
// Header.tsx — ขั้นที่ 1: หน้าตาบนมือถือ (โลโก้ + ปุ่ม ☰ + เมนูกางลงมา)
// -----------------------------------------------------------------------------
// Mobile First: ทำให้สวยบนจอเล็กที่สุดก่อน ขั้นนี้ทุกขนาดจอจะเห็นแบบมือถือไปก่อน
// =============================================================================

// "use client" = component นี้ทำงานบนเบราว์เซอร์ด้วย
// จำเป็นเพราะมี useState (จำว่าเมนูเปิดอยู่ไหม) และ onClick
// (ถ้าไม่ใส่ Next จะ error: useState only works in Client Components)
"use client";

import Link from "next/link";
import { useState } from "react";
import { menu } from "@/lib/menu";

export default function Header() {
  // เมนูมือถือกางอยู่ไหม (true = กาง) เริ่มต้น = ปิด
  const [mobileOpen, setMobileOpen] = useState(false);

  // ปิดเมนู — เรียกตอนกดลิงก์ จะได้ไม่ค้างหลังเปลี่ยนหน้า
  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    // sticky top-0 = เลื่อนหน้าแล้ว header ติดอยู่บนสุด · z-50 = อยู่ชั้นบนกว่าเนื้อหา
    // bg-white/90 + backdrop-blur = พื้นขาวโปร่งนิดๆ เห็นเนื้อหาด้านหลังเบลอๆ
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* แถวบน: โลโก้ซ้าย | ปุ่มขวา  -> justify-between ดันให้ชิดซ้าย-ขวา */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------- โลโก้ (กดแล้วกลับหน้าแรก) ---------- */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">📰</span>
          <span className="text-lg font-bold text-slate-900">News</span>
        </Link>

        {/* ---------- ปุ่ม ☰ ---------- */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"} // ปุ่มไม่มีตัวหนังสือ -> บอกโปรแกรมอ่านหน้าจอว่าปุ่มนี้คืออะไร
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
        >
          {/* สลับไอคอน: เปิดอยู่ = ✕, ปิดอยู่ = ☰ */}
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ---------- เมนูมือถือ: แสดงเฉพาะตอน mobileOpen เป็น true ---------- */}
      {mobileOpen && (
        <nav id="mobile-menu" aria-label="เมนูหลัก" className="border-t border-slate-200 px-4 py-3">
          <ul className="space-y-1">
            {/* วนลูปสร้างลิงก์จาก menu ทีละอัน (key = ชื่อเฉพาะของแต่ละอัน React ต้องใช้) */}
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ปุ่มเข้าสู่ระบบ: เต็มความกว้าง กดง่ายบนมือถือ */}
          <Link
            href="/login"
            onClick={closeMenu}
            className="mt-3 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white"
          >
            เข้าสู่ระบบ
          </Link>
        </nav>
      )}
    </header>
  );
}
```

แทนที่ `src/app/layout.tsx` (เพิ่ม `<Header />`) — **ฉบับสุดท้าย ไม่ต้องแก้อีก:**

```tsx
// =============================================================================
// layout.tsx — "กรอบ" ที่ครอบทุกหน้า
// -----------------------------------------------------------------------------
// ทุกหน้า (page.tsx) จะถูกใส่เข้ามาแทนที่ {children}
// เราวาง <Header /> ไว้ตรงนี้ที่เดียว -> Header โผล่ทุกหน้าอัตโนมัติ
// และตอนเปลี่ยนหน้า Header ไม่ถูกสร้างใหม่ (สถานะต่างๆ ไม่หาย)
// =============================================================================
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

// โหลดฟอนต์ไทยผ่าน next/font: Next ดาวน์โหลดมาเก็บในเว็บเราเองตอน build (ไม่ต้องใส่ <link>)
// variable = ชื่อตัวแปร CSS ที่ globals.css เอาไปตั้งเป็นฟอนต์หลัก
const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
});

// ข้อมูลหน้าเว็บ (ชื่อแท็บ, คำอธิบายตอนแชร์/ค้นหา)
//   template: หน้าไหนตั้ง title เอง จะได้ "ชื่อหน้า | News"
//   default : หน้าที่ไม่ตั้ง title (เช่นหน้าแรก)
export const metadata: Metadata = {
  title: { default: "News — ข่าวกีฬา", template: "%s | News" },
  description: "เว็บข่าวกีฬา — บทเรียนสร้าง Header แบบ responsive ด้วย Next.js + Tailwind CSS",
};

// LayoutProps<"/"> = ชนิดข้อมูลสำเร็จรูปของ Next 16 (ไม่ต้อง import) มี children ให้
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-800">
        <Header />
        {/* เนื้อหาของแต่ละหน้า: กว้างไม่เกิน max-w-6xl อยู่กลางจอ, ระยะขอบเพิ่มตามขนาดจอ */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
```

**✅ Checkpoint 1 (375):** กด ☰ เมนูกาง/หุบ · กดเมนูแล้วไปหน้านั้นและเมนูหุบเอง · จอ 1280 ยังเป็นแบบมือถือ (ถูกแล้ว)

### 4.6 Header ขั้นที่ 2 — ไฮไลต์หน้าปัจจุบัน + ปุ่มเข้าสู่ระบบขึ้นแถบที่ `sm`

เพิ่ม `usePathname()` + `isActive()` และ `hidden sm:inline-block` / `sm:hidden` — แทนที่ทั้งไฟล์:

```tsx
// =============================================================================
// Header.tsx — ขั้นที่ 2: ไฮไลต์เมนูหน้าปัจจุบัน + ปุ่มเข้าสู่ระบบขึ้นแถบเมื่อจอ ≥ 640px (sm)
// =============================================================================

// "use client" = component นี้ทำงานบนเบราว์เซอร์ด้วย
// จำเป็นเพราะมี useState (จำว่าเมนูเปิดอยู่ไหม), onClick และ usePathname
// (ถ้าไม่ใส่ Next จะ error: useState only works in Client Components)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isActive, menu } from "@/lib/menu";

// class ของลิงก์ในเมนูมือถือ — เปลี่ยนสีตามว่าเป็นหน้าที่เปิดอยู่ (active) ไหม
// ⚠️ ต้องเขียนชื่อ class เต็มๆ ห้ามต่อสตริงเป็นชิ้นๆ เช่น "bg-" + color
//    เพราะ Tailwind อ่านชื่อ class จากโค้ดตรงๆ ถ้าชื่อไม่ครบจะไม่สร้าง CSS ให้
function mobileLinkClass(active: boolean) {
  return `flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
  }`;
}

export default function Header() {
  // URL ของหน้าที่เปิดอยู่ เช่น "/news/football" -> ใช้ไฮไลต์เมนู
  const pathname = usePathname();

  // เมนูมือถือกางอยู่ไหม (true = กาง) เริ่มต้น = ปิด
  const [mobileOpen, setMobileOpen] = useState(false);

  // ปิดเมนู — เรียกตอนกดลิงก์ จะได้ไม่ค้างหลังเปลี่ยนหน้า
  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    // sticky top-0 = เลื่อนหน้าแล้ว header ติดอยู่บนสุด · z-50 = อยู่ชั้นบนกว่าเนื้อหา
    // bg-white/90 + backdrop-blur = พื้นขาวโปร่งนิดๆ เห็นเนื้อหาด้านหลังเบลอๆ
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* แถวบน: โลโก้ซ้าย | ปุ่มขวา  -> justify-between ดันให้ชิดซ้าย-ขวา */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------- โลโก้ (กดแล้วกลับหน้าแรก) ---------- */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">📰</span>
          <span className="text-lg font-bold text-slate-900">News</span>
        </Link>

        {/* ---------- ด้านขวา: ปุ่มเข้าสู่ระบบ + ปุ่ม ☰ ---------- */}
        <div className="flex items-center gap-2">
          {/* hidden sm:inline-block = มือถือซ่อน (ไปอยู่ในเมนูกางแทน), จอ ≥ 640px แสดงบนแถบ */}
          <Link
            href="/login"
            onClick={closeMenu}
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:inline-block"
          >
            เข้าสู่ระบบ
          </Link>

          {/* ---------- ปุ่ม ☰ ---------- */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"} // ปุ่มไม่มีตัวหนังสือ -> บอกโปรแกรมอ่านหน้าจอว่าปุ่มนี้คืออะไร
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {/* สลับไอคอน: เปิดอยู่ = ✕, ปิดอยู่ = ☰ */}
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---------- เมนูมือถือ: แสดงเฉพาะตอน mobileOpen เป็น true ---------- */}
      {mobileOpen && (
        <nav id="mobile-menu" aria-label="เมนูหลัก" className="border-t border-slate-200 px-4 py-3">
          <ul className="space-y-1">
            {menu.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined} // บอกโปรแกรมอ่านหน้าจอว่า "นี่คือหน้าปัจจุบัน"
                    className={mobileLinkClass(active)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ปุ่มเข้าสู่ระบบในเมนูมือถือ: sm:hidden เพราะจอ ≥ 640px มีปุ่มบนแถบแล้ว */}
          <Link
            href="/login"
            onClick={closeMenu}
            className="mt-3 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white sm:hidden"
          >
            เข้าสู่ระบบ
          </Link>
        </nav>
      )}
    </header>
  );
}
```

**✅ Checkpoint 2:** หน้าที่เปิดอยู่มีพื้นครามอ่อน · ที่ 700 ปุ่มเข้าสู่ระบบอยู่บนแถบ และไม่ซ้ำในเมนูกาง

### 4.7 Header ขั้นที่ 3 — เมนู PC ที่ `md` + คำว่า "ข่าวกีฬา" ที่ `lg`

เพิ่ม `<nav className="hidden ... md:flex">`, `md:hidden` ที่ปุ่ม ☰/เมนูกาง, `hidden lg:inline` — แทนที่ทั้งไฟล์:

```tsx
// =============================================================================
// Header.tsx — ขั้นที่ 3: เมนู PC เรียงแนวนอนเมื่อจอ ≥ 768px (md) + คำอธิบายข้างโลโก้เมื่อจอ ≥ 1024px (lg)
// -----------------------------------------------------------------------------
//   มือถือ (< 640px) : โลโก้ | ปุ่ม ☰  -> กดแล้วเมนูกางลงมาด้านล่าง (มีปุ่มเข้าสู่ระบบในเมนู)
//   sm  (≥ 640px)    : ปุ่ม "เข้าสู่ระบบ" ย้ายขึ้นมาอยู่บนแถบ
//   md  (≥ 768px)    : ซ่อนปุ่ม ☰ แสดงเมนูเรียงแนวนอนแทน
//   lg  (≥ 1024px)   : แสดงคำอธิบายข้างโลโก้ และเมนูห่างกันมากขึ้น
// =============================================================================

// "use client" = component นี้ทำงานบนเบราว์เซอร์ด้วย
// จำเป็นเพราะมี useState (จำว่าเมนูเปิดอยู่ไหม), onClick และ usePathname
// (ถ้าไม่ใส่ Next จะ error: useState only works in Client Components)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isActive, menu } from "@/lib/menu";

// สร้าง class ของลิงก์เมนู PC ตามสถานะ active
// ⚠️ ต้องเขียนชื่อ class เต็มๆ ห้ามต่อสตริงเป็นชิ้นๆ เช่น "bg-" + color
//    เพราะ Tailwind อ่านชื่อ class จากโค้ดตรงๆ ถ้าชื่อไม่ครบจะไม่สร้าง CSS ให้
function desktopLinkClass(active: boolean) {
  return `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

// class ของลิงก์ในเมนูมือถือ (ตัวใหญ่กว่า กดง่ายกว่า)
function mobileLinkClass(active: boolean) {
  return `flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
  }`;
}

export default function Header() {
  // URL ของหน้าที่เปิดอยู่ เช่น "/news/football" -> ใช้ไฮไลต์เมนู
  const pathname = usePathname();

  // เมนูมือถือกางอยู่ไหม (true = กาง) เริ่มต้น = ปิด
  const [mobileOpen, setMobileOpen] = useState(false);

  // ปิดเมนู — เรียกตอนกดลิงก์ จะได้ไม่ค้างหลังเปลี่ยนหน้า
  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    // sticky top-0 = เลื่อนหน้าแล้ว header ติดอยู่บนสุด · z-50 = อยู่ชั้นบนกว่าเนื้อหา
    // bg-white/90 + backdrop-blur = พื้นขาวโปร่งนิดๆ เห็นเนื้อหาด้านหลังเบลอๆ
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* แถวบน: โลโก้ | เมนู PC | ปุ่ม  -> justify-between ดันให้ชิดซ้าย-ขวา */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------- โลโก้ (กดแล้วกลับหน้าแรก) ---------- */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">📰</span>
          <span className="text-lg font-bold text-slate-900">News</span>
          {/* hidden lg:inline = ซ่อนไว้ก่อน โผล่เมื่อจอ ≥ 1024px */}
          <span className="hidden text-sm text-slate-500 lg:inline">ข่าวกีฬา</span>
        </Link>

        {/* ---------- เมนู PC: hidden บนมือถือ, md:flex = แสดงเมื่อจอ ≥ 768px ---------- */}
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 md:flex lg:gap-2">
          {menu.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={desktopLinkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ---------- ด้านขวา: ปุ่มเข้าสู่ระบบ + ปุ่ม ☰ ---------- */}
        <div className="flex items-center gap-2">
          {/* hidden sm:inline-block = มือถือซ่อน (ไปอยู่ในเมนูกางแทน), จอ ≥ 640px แสดงบนแถบ */}
          <Link
            href="/login"
            onClick={closeMenu}
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:inline-block"
          >
            เข้าสู่ระบบ
          </Link>

          {/* ปุ่ม ☰ : md:hidden = ซ่อนเมื่อจอ ≥ 768px (เพราะมีเมนู PC แล้ว) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"} // ปุ่มไม่มีตัวหนังสือ -> บอกโปรแกรมอ่านหน้าจอว่าปุ่มนี้คืออะไร
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {/* สลับไอคอน: เปิดอยู่ = ✕, ปิดอยู่ = ☰ */}
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---------- เมนูมือถือ: แสดงเฉพาะตอน mobileOpen และซ่อนเสมอเมื่อจอ ≥ 768px ---------- */}
      {mobileOpen && (
        <nav id="mobile-menu" aria-label="เมนูหลัก" className="border-t border-slate-200 px-4 py-3 md:hidden">
          <ul className="space-y-1">
            {menu.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={mobileLinkClass(active)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ปุ่มเข้าสู่ระบบในเมนูมือถือ: sm:hidden เพราะจอ ≥ 640px มีปุ่มบนแถบแล้ว */}
          <Link
            href="/login"
            onClick={closeMenu}
            className="mt-3 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white sm:hidden"
          >
            เข้าสู่ระบบ
          </Link>
        </nav>
      )}
    </header>
  );
}
```

**✅ Checkpoint 3:** 375 / 700 เหมือนเดิม · 900 ปุ่ม ☰ หาย เมนูเรียงแนวนอน · 1280 มีคำว่า "ข่าวกีฬา"

### 4.8 Header ฉบับสมบูรณ์ — Dropdown เมนูย่อย "ข่าว"

| อุปกรณ์ | เปิดเมนูย่อย |
|---|---|
| PC + เมาส์ | ชี้ หรือคลิก "ข่าว" (เอาเมาส์ออก = ปิด) |
| แท็บเล็ต / คีย์บอร์ด | แตะ หรือ Tab + Enter (แตะซ้ำ = ปิด) |
| มือถือ | ในเมนูกาง กด "ข่าว" แล้วรายการย่อยกางลงมา |

ปิดทุกเมนู: กดลิงก์ · กด Esc · คลิกนอก Header — แทนที่ทั้งไฟล์:

```tsx
// =============================================================================
// Header.tsx — แถบหัวเว็บแบบ responsive (ฉบับสมบูรณ์)
// -----------------------------------------------------------------------------
// ออกแบบแบบ Mobile First: class ที่ไม่มีคำนำหน้า = หน้าตาบนมือถือ แล้วค่อยเติมของจอใหญ่
//
//   มือถือ (< 640px) : โลโก้ | ปุ่ม ☰  -> กดแล้วเมนูกางลงมาด้านล่าง (มีปุ่มเข้าสู่ระบบในเมนู)
//   sm  (≥ 640px)    : ปุ่ม "เข้าสู่ระบบ" ย้ายขึ้นมาอยู่บนแถบ
//   md  (≥ 768px)    : ซ่อนปุ่ม ☰ แสดงเมนูเรียงแนวนอนแทน + dropdown เมนูย่อย
//   lg  (≥ 1024px)   : แสดงคำอธิบายข้างโลโก้ และเมนูห่างกันมากขึ้น
// =============================================================================

// "use client" = component นี้ทำงานบนเบราว์เซอร์ด้วย
// จำเป็นเพราะมี useState (จำว่าเมนูเปิดอยู่ไหม), onClick และ usePathname
// (ถ้าไม่ใส่ Next จะ error: useState only works in Client Components)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isActive, menu } from "@/lib/menu";

// สร้าง class ของลิงก์เมนู PC ตามสถานะ active
// ⚠️ ต้องเขียนชื่อ class เต็มๆ ห้ามต่อสตริงเป็นชิ้นๆ เช่น "bg-" + color
//    เพราะ Tailwind อ่านชื่อ class จากโค้ดตรงๆ ถ้าชื่อไม่ครบจะไม่สร้าง CSS ให้
function desktopLinkClass(active: boolean) {
  return `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

// class ของลิงก์ในเมนูมือถือ (ตัวใหญ่กว่า กดง่ายกว่า)
function mobileLinkClass(active: boolean) {
  return `flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
  }`;
}

// ไอคอนลูกศรลง ใช้กับ dropdown (หมุน 180° ตอนเปิด)
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Header() {
  // URL ของหน้าที่เปิดอยู่ เช่น "/news/football" -> ใช้ไฮไลต์เมนู
  const pathname = usePathname();

  // เมนูมือถือกางอยู่ไหม (true = กาง)
  const [mobileOpen, setMobileOpen] = useState(false);

  // dropdown ไหนเปิดอยู่ (เก็บ label ของเมนูนั้น, null = ไม่มีอันไหนเปิด)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // ปิดเมนูทั้งหมด — เรียกตอนกดลิงก์ จะได้ไม่ค้างหลังเปลี่ยนหน้า
  function closeAll() {
    setMobileOpen(false);
    setOpenSubmenu(null);
  }

  // ref = "ป้ายชี้" ไปที่แท็ก <header> จริงบนหน้าเว็บ ใช้เช็คว่าคลิกโดนข้างใน header หรือข้างนอก
  const headerRef = useRef<HTMLElement>(null);

  // ปิดเมนูทั้งหมดเมื่อ (1) กดปุ่ม Esc หรือ (2) คลิก/แตะที่ไหนก็ได้นอก header
  // useEffect ตั้งตัวดักฟังครั้งเดียวตอน Header ขึ้นจอ และ return ฟังก์ชันถอดออกตอนเลิกใช้
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenSubmenu(null);
      }
    }
    function onPointerDown(e: PointerEvent) {
      // contains = จุดที่คลิกอยู่ข้างใน header ไหม -> ถ้าไม่ใช่ ให้ปิด
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
        setOpenSubmenu(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    // sticky top-0 = เลื่อนหน้าแล้ว header ติดอยู่บนสุด · z-50 = อยู่ชั้นบนกว่าเนื้อหา
    // bg-white/90 + backdrop-blur = พื้นขาวโปร่งนิดๆ เห็นเนื้อหาด้านหลังเบลอๆ
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* แถวบน: โลโก้ | เมนู PC | ปุ่ม  -> justify-between ดันให้ชิดซ้าย-ขวา */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------- โลโก้ (กดแล้วกลับหน้าแรก) ---------- */}
        <Link href="/" onClick={closeAll} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">📰</span>
          <span className="text-lg font-bold text-slate-900">News</span>
          {/* hidden lg:inline = ซ่อนไว้ก่อน โผล่เมื่อจอ ≥ 1024px */}
          <span className="hidden text-sm text-slate-500 lg:inline">ข่าวกีฬา</span>
        </Link>

        {/* ---------- เมนู PC: hidden บนมือถือ, md:flex = แสดงเมื่อจอ ≥ 768px ---------- */}
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 md:flex lg:gap-2">
          {menu.map((item) => {
            const active = isActive(pathname, item.href);

            // เมนูธรรมดา (ไม่มีเมนูย่อย) -> ลิงก์เดียว
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  aria-current={active ? "page" : undefined}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            }

            // เมนูที่มีเมนูย่อย -> dropdown
            const open = openSubmenu === item.label;
            return (
              <div
                key={item.href}
                className="relative" // ให้กล่อง dropdown (absolute) วางตำแหน่งเทียบกับเมนูนี้
                // ชี้เมาส์เข้า = เปิด, เอาเมาส์ออก = ปิด
                // เช็ค pointerType === "mouse" เพราะบนแท็บเล็ตการแตะจะยิง event นี้ด้วย
                // แล้วไปชนกับ onClick ด้านล่าง (เปิดแล้วปิดทันที)
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpenSubmenu(item.label)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setOpenSubmenu(null)}
              >
                {/* ใช้ <button> ไม่ใช่ลิงก์: แตะ (จอสัมผัส) หรือ Enter (คีย์บอร์ด) = เปิด-ปิด dropdown */}
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={(e) => {
                    // คลิกด้วยเมาส์: สั่ง "เปิด" อย่างเดียว (ไม่สลับ)
                    // เพราะตอนชี้ dropdown อาจเปิดไปแล้ว ถ้าสลับ คลิกแล้ว dropdown จะปิดทันที
                    if ((e.nativeEvent as PointerEvent).pointerType === "mouse") {
                      setOpenSubmenu(item.label);
                      return;
                    }
                    // แตะ (จอสัมผัส) / Enter (คีย์บอร์ด): สลับเปิด-ปิด
                    setOpenSubmenu(open ? null : item.label);
                  }}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                  <ChevronIcon open={open} />
                </button>

                {/* แสดงกล่อง dropdown เฉพาะตอน open เป็น true */}
                {open && (
                  // top-full = วางใต้ปุ่มพอดี · pt-2 = เว้นช่องแต่ยังเป็นพื้นที่เดียวกัน
                  // (ถ้าใช้ mt-2 จะมีช่องว่าง เมาส์เลื่อนผ่านช่องนั้นแล้ว dropdown ปิดเอง)
                  <div className="absolute top-full left-0 pt-2">
                    <ul className="w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {item.children.map((child) => {
                        const childActive = isActive(pathname, child.href, true);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeAll}
                              aria-current={childActive ? "page" : undefined}
                              className={`block rounded-lg px-3 py-2 text-sm ${
                                childActive
                                  ? "bg-indigo-50 font-medium text-indigo-700"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ---------- ด้านขวา: ปุ่มเข้าสู่ระบบ + ปุ่ม ☰ ---------- */}
        <div className="flex items-center gap-2">
          {/* hidden sm:inline-block = มือถือซ่อน (ไปอยู่ในเมนูกางแทน), จอ ≥ 640px แสดงบนแถบ */}
          <Link
            href="/login"
            onClick={closeAll}
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:inline-block"
          >
            เข้าสู่ระบบ
          </Link>

          {/* ปุ่ม ☰ : md:hidden = ซ่อนเมื่อจอ ≥ 768px (เพราะมีเมนู PC แล้ว) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"} // ปุ่มไม่มีตัวหนังสือ -> บอกโปรแกรมอ่านหน้าจอว่าปุ่มนี้คืออะไร
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {/* สลับไอคอน: เปิดอยู่ = ✕, ปิดอยู่ = ☰ */}
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---------- เมนูมือถือ: แสดงเฉพาะตอน mobileOpen และซ่อนเสมอเมื่อจอ ≥ 768px ---------- */}
      {mobileOpen && (
        <nav id="mobile-menu" aria-label="เมนูหลัก" className="border-t border-slate-200 px-4 py-3 md:hidden">
          <ul className="space-y-1">
            {menu.map((item) => {
              const active = isActive(pathname, item.href);

              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeAll}
                      aria-current={active ? "page" : undefined}
                      className={mobileLinkClass(active)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              // เมนูย่อยบนมือถือ = แบบพับ/กาง (accordion) กดที่หัวข้อแล้วรายการย่อยกางลงมา
              const open = openSubmenu === item.label;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenSubmenu(open ? null : item.label)}
                    className={mobileLinkClass(active)}
                  >
                    {item.label}
                    <ChevronIcon open={open} />
                  </button>
                  {open && (
                    // ml-3 + border-l = เส้นแนวตั้งด้านซ้าย บอกว่าเป็นเมนูย่อยของหัวข้อข้างบน
                    <ul className="mt-1 ml-3 space-y-1 border-l border-slate-200 pl-3">
                      {item.children.map((child) => {
                        const childActive = isActive(pathname, child.href, true);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeAll}
                              aria-current={childActive ? "page" : undefined}
                              className={`block rounded-lg px-3 py-2 ${
                                childActive ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ปุ่มเข้าสู่ระบบในเมนูมือถือ: sm:hidden เพราะจอ ≥ 640px มีปุ่มบนแถบแล้ว */}
          <Link
            href="/login"
            onClick={closeAll}
            className="mt-3 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white sm:hidden"
          >
            เข้าสู่ระบบ
          </Link>
        </nav>
      )}
    </header>
  );
}
```

**✅ Checkpoint 4:** ทำตามเช็คลิสต์ข้อ 5 แล้วรัน

```bash
npm run lint
npm run build
```

---

## 5. เช็คลิสต์

- [ ] **375:** กด ☰ → "ข่าว" → เมนูย่อยกาง → "ฟุตบอล" → หน้าแสดง `ข่าวหมวด: football` และเมนูหุบ
- [ ] **375:** เมนูของหน้าที่เปิดอยู่ไฮไลต์ · แตะนอก Header หรือกด Esc แล้วเมนูหุบ
- [ ] **700:** ปุ่มเข้าสู่ระบบอยู่บนแถบ ไม่ซ้ำในเมนูกาง
- [ ] **900:** ไม่มี ☰ · เมนูแนวนอน
- [ ] **1280:** มี "ข่าวกีฬา" · ชี้/คลิก "ข่าว" แล้ว dropdown เปิด · เลื่อนเมาส์ลงไปกดรายการได้
- [ ] เปิดผ่าน IP จากมือถือจริงแล้วกดเมนูได้ (ต้องมี `allowedDevOrigins` — ข้อ 4.1)

## 6. ปัญหาที่เจอบ่อย

| อาการ | แก้ |
|---|---|
| **หน้าขึ้นแต่กดปุ่ม ☰ / "ข่าว" ไม่ติด** และ Terminal ขึ้น `Blocked cross-origin request ... /_next/hmr` | เปิดผ่าน IP — ใส่ `allowedDevOrigins` ใน `next.config.ts` (4.1) แล้วรีสตาร์ท `npm run dev` · หรือเปิดด้วย `localhost:3000` |
| `This React Hook only works in a Client Component` | ใส่ `"use client";` บรรทัดแรกของ `Header.tsx` |
| `Can't resolve '@/components/Header'` | ไฟล์ต้องอยู่ที่ `src/components/Header.tsx` (H ตัวใหญ่) |
| VS Code ขีดแดงใต้ `PageProps` / `LayoutProps` | รัน `npm run dev` หรือ `npx next typegen` |
| ขยายจอแล้วเห็นทั้ง ☰ และเมนูแนวนอน | ลืม `md:hidden` |
| เห็นปุ่มเข้าสู่ระบบ 2 ที่ | ลืม `sm:hidden` ที่ปุ่มในเมนูกาง |
| เมนูไม่หุบหลังกดลิงก์ | ลืม `onClick={closeMenu}` / `closeAll` ที่ `<Link>` |
| dropdown ปิดเองตอนเลื่อนเมาส์ลง | ใช้ `pt-2` ไม่ใช่ `mt-2` |
| PowerShell หาโฟลเดอร์ `[category]` ไม่เจอ (`Test-Path` ได้ False) | ใช้ `-LiteralPath "src/app/news/[category]"` |
| `Another next dev server is already running` | มี `npm run dev` เปิดอยู่แล้ว ใช้ตัวเดิม หรือปิดก่อน (`Ctrl + C`) |

## 7. แบบฝึกหัด

1. เพิ่มเมนู "ติดต่อเรา" `/contact` (แก้ `menu.ts` + สร้าง `src/app/contact/page.tsx` ที่มีแค่ข้อความ)
2. เพิ่มเมนูย่อย "เทนนิส" `/news/tennis` ใต้ "ข่าว" — ไม่ต้องสร้างไฟล์ใหม่ เพราะ `[category]` รองรับอยู่แล้ว
3. เปลี่ยนสีไฮไลต์จาก indigo เป็น emerald
4. ให้เมนู PC โผล่ที่ `lg` แทน `md`
