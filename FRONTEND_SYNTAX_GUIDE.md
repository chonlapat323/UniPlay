# คู่มือ Syntax พื้นฐานของ React/TypeScript ที่ใช้ใน Frontend

เอกสารนี้อธิบาย **syntax พื้นฐาน** ของ TypeScript/React/JSX ที่ปรากฏอยู่ในโค้ดจริงของ `frontend/apps` (ทำตาม `FRONTEND_GUIDE.md`) — ไม่ได้สอนสร้างฟีเจอร์ใหม่ แต่ไล่อธิบาย**ทีละ syntax** ที่อาจดูแปลกตาสำหรับคนที่เพิ่งเจอ React/TypeScript ครั้งแรก ทุกตัวอย่างคัดมาจากไฟล์จริงในโปรเจค ไม่ใช่โค้ดสมมติ

> อ่านคู่มือนี้ควบคู่กับการเปิดไฟล์จริงดูไปด้วยจะเข้าใจง่ายที่สุด — ไฟล์ที่อ้างถึงบ่อยคือ `frontend/apps/src/lib/api.ts`, `frontend/apps/src/lib/token.ts`, `frontend/apps/src/app/login/page.tsx`, `frontend/apps/src/app/page.tsx`

---

## 1. `const` / `let` — ประกาศตัวแปร

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```
*(จาก `lib/api.ts`)*

- **`const`** — ประกาศตัวแปรที่**ห้าม reassign ค่าใหม่ทับ** (แต่ถ้าค่าเป็น object/array ยังแก้ property ข้างในได้) ใช้เป็น default เสมอในโค้ดนี้
- **`let`** — ใช้เมื่อตัวแปรต้อง reassign ค่าใหม่ได้ในอนาคต (โค้ดในคู่มือนี้เกือบไม่มี `let` เลย เพราะ React ชอบให้ค่าไม่เปลี่ยนตรงๆ แล้วใช้ `useState` จัดการค่าที่เปลี่ยนได้แทน — ดูหัวข้อ 6)
- โค้ดนี้ (และ JS/TS สมัยใหม่ทั่วไป) **ไม่ใช้ `var`** อีกแล้ว เพราะ `var` มีพฤติกรรม scope ที่สร้างบั๊กได้ง่าย (`var` มองไม่เห็น block `{ }` ในขณะที่ `const`/`let` มองเห็น)

---

## 2. Arrow Function (`=>`)

```typescript
onChange={(e) => setEmail(e.target.value)}
```
*(จาก `app/login/page.tsx`)*

`(e) => setEmail(e.target.value)` คือฟังก์ชันแบบสั้น เขียนเทียบเท่ากับ:
```typescript
function (e) {
  return setEmail(e.target.value);
}
```

**กฎการอ่าน:** `(พารามิเตอร์) => ผลลัพธ์` — ถ้ามีแค่ expression เดียว (ไม่มี `{ }`) จะ `return` ค่านั้นให้อัตโนมัติ ไม่ต้องเขียน `return` เอง ถ้าต้องมีหลายบรรทัดต้องห่อด้วย `{ }` แล้วเขียน `return` เอง (ดูตัวอย่าง `catch (err) => { setError(...); }` ในหัวข้อ 8 ที่มีหลายบรรทัด)

**ทำไมใช้บ่อยในโค้ดนี้:** เวลาส่งฟังก์ชันเป็นค่าให้ prop อื่นใช้ (เช่น `onChange`) arrow function เขียนสั้นกว่า `function` ธรรมดา และไม่มีปัญหาเรื่อง `this` (ซึ่งเป็นเรื่องปวดหัวของ `function` แบบเก่าใน class — โค้ดนี้ไม่ได้ใช้ class component เลยจึงไม่ต้องพะวงเรื่องนี้มาก แต่เป็นเหตุผลที่ arrow function ได้รับความนิยม)

---

## 3. Template Literal (Backtick String)

```typescript
const res = await fetch(`${API_URL}/auth/login`, { ... });
```
*(จาก `lib/api.ts`)*

String ที่ล้อมด้วย **backtick** (`` ` ``) แทน quote ปกติ (`'...'` หรือ `"..."`) ทำให้**ฝังตัวแปรเข้าไปในสตริงได้ตรงๆ** ด้วย `${...}` — บรรทัดข้างบนเทียบเท่ากับ (แบบ quote ปกติ):
```typescript
const res = await fetch(API_URL + '/auth/login', { ... });
```
แต่ template literal อ่านง่ายกว่าเวลามีตัวแปรผสมหลายตัว และรองรับการเขียนข้ามหลายบรรทัดได้โดยไม่ต้องต่อสตริงด้วย `+`

---

## 4. Array Destructuring — โดยเฉพาะกับ `useState`

```typescript
const [email, setEmail] = useState('ui.test@uniplay.test');
```
*(จาก `app/login/page.tsx`)*

`useState(...)` (React hook) return **array ที่มี 2 ช่อง** เสมอ: `[ค่าปัจจุบัน, ฟังก์ชันสำหรับเปลี่ยนค่า]` — การเขียน `const [email, setEmail] = ...` คือ **array destructuring** ดึงค่าช่องที่ 0 ไปตั้งชื่อว่า `email` และช่องที่ 1 ไปตั้งชื่อว่า `setEmail` ในบรรทัดเดียว เทียบเท่ากับ (แบบไม่ destructure):
```typescript
const emailState = useState('ui.test@uniplay.test');
const email = emailState[0];
const setEmail = emailState[1];
```
**ตั้งชื่อเองได้ตามใจ** — ชื่อ `email`/`setEmail` ไม่ใช่ชื่อตายตัวของ React แค่เป็น convention ที่นิยมตั้งคู่กันว่า `[ค่า, setค่า]`

---

## 5. Object Destructuring

```typescript
const { access_token } = await login({ email, password });
```
*(จาก `app/login/page.tsx`)*

ต่างจากหัวข้อ 4 ที่ destructure จาก **array** (ใช้ `[ ]` และดึงตามตำแหน่ง) อันนี้ destructure จาก **object** (ใช้ `{ }` และดึงตาม**ชื่อ key**) — `login(...)` return object รูปแบบ `{ access_token: "eyJ..." }` (ดู `LoginResponse` ใน `lib/api.ts`) บรรทัดนี้ดึงเฉพาะ key `access_token` ออกมาเป็นตัวแปรชื่อเดียวกัน เทียบเท่ากับ:
```typescript
const result = await login({ email, password });
const access_token = result.access_token;
```

**อีกจุดที่ใช้ object destructuring แบบย่อ:** `login({ email, password })` — ตรงนี้คือ**การสร้าง object แบบย่อ** (ไม่ใช่ destructure) เมื่อ key และชื่อตัวแปรเป็นชื่อเดียวกัน (`email`, `password` เป็นตัวแปรที่มีอยู่แล้วจาก `useState`) เขียนย่อได้เป็น `{ email, password }` แทนการเขียนยาวๆ ว่า `{ email: email, password: password }`

---

## 6. `async` / `await` + `try...catch...finally`

```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const { access_token } = await login({ email, password });
    saveToken(access_token);
    router.push('/');
  } catch (err) {
    setError(err instanceof ApiError ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
  } finally {
    setLoading(false);
  }
}
```
*(จาก `app/login/page.tsx`)*

- **`async function`** — ประกาศว่าฟังก์ชันนี้ทำงานแบบ**ไม่บล็อก** (asynchronous) ข้างในใช้ `await` ได้ และตัวฟังก์ชันเอง return `Promise` เสมอ (แม้จะดูเหมือน return ค่าธรรมดา)
- **`await`** — "รอ" ผลลัพธ์ของงานที่ใช้เวลา (เช่น `login(...)` ที่ต้องยิง network request ไปหา backend) ก่อนไปทำบรรทัดต่อไป — ถ้าไม่มี `await` โค้ดจะไม่รอ แล้ววิ่งไปบรรทัดถัดไปทันทีทั้งที่ยังไม่ได้ผลลัพธ์กลับมา
- **`try { ... }`** — โค้ดส่วนที่ "ลองทำ" ถ้ามีอะไรผิดพลาด (เช่น `login()` throw `ApiError` เพราะ password ผิด) จะข้ามไปที่ `catch` ทันที
- **`catch (err) { ... }`** — ดักจับ error ที่เกิดใน `try` เอามาเก็บในตัวแปร `err` แล้วจัดการ (ที่นี่คือโชว์ข้อความ error ในฟอร์ม)
- **`finally { ... }`** — โค้ดส่วนนี้ **รันเสมอ** ไม่ว่า `try` จะสำเร็จหรือ `catch` จะดักจับ error ก็ตาม — ใช้เก็บงานที่ต้องทำทุกกรณี เช่น `setLoading(false)` (ปิดสถานะ "กำลังโหลด" ไม่ว่าผลจะเป็นอย่างไร)

---

## 7. `if` ที่ return ทันที (Guard Clause) และ Optional Chaining `?.`

```typescript
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
```
*(จาก `lib/token.ts`)*

**Guard clause:** `if (เงื่อนไข) return ...;` แบบบรรทัดเดียว (ไม่มี `{ }` ครอบ) คือรูปแบบที่นิยมเขียนเช็คเงื่อนไข "ทางตัน" ก่อน แล้วให้ฟังก์ชันจบทันทีโดยไม่ต้องเขียน `if...else` ครอบทั้งฟังก์ชัน — ทำให้โค้ดด้านล่างไม่ต้อง indent ลึกๆ

```typescript
if (!body?.message) return `Request failed with status ${res.status}`;
```
*(จาก `lib/api.ts`)*

**`?.` (optional chaining):** `body?.message` แปลว่า "ถ้า `body` เป็น `null`/`undefined` ให้หยุดแล้วได้ค่า `undefined` กลับมาทันที (ไม่ error) ถ้า `body` มีค่าจริงค่อยไปอ่าน `.message` ต่อ" — ป้องกัน error แบบ `Cannot read property 'message' of null` ที่เกิดถ้าเขียน `body.message` ตรงๆ ทั้งที่ `body` อาจเป็น `null` ได้ (จากบรรทัดก่อนหน้า `res.json().catch(() => null)`)

---

## 8. Ternary Operator (`? :`) และ `&&` แบบ short-circuit

```typescript
setError(err instanceof ApiError ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
```
*(จาก `app/login/page.tsx`)*

**Ternary** คือ `if...else` แบบย่อสำหรับ**เลือกค่า**: `เงื่อนไข ? ค่าถ้าจริง : ค่าถ้าเท็จ` — บรรทัดข้างบนอ่านว่า "ถ้า `err` เป็น instance ของ `ApiError` ใช้ `err.message` ไม่งั้นใช้ข้อความ default"

```jsx
{error && <p className="mb-4 text-sm text-red-600">{error}</p>}
```
*(จาก `app/login/page.tsx`, อยู่ใน JSX — ดูหัวข้อ 10)*

**`&&` แบบ short-circuit:** ใน JavaScript `A && B` จะ return `B` ถ้า `A` เป็นค่าจริง (truthy) หรือ return `A` ทันทีถ้า `A` เป็นค่าเท็จ (falsy) โดยไม่ต้องประเมิน `B` เลย — ที่นี่ใช้เป็นลูกเล่นสำหรับ "แสดง element นี้เฉพาะเมื่อเงื่อนไขเป็นจริง": ถ้า `error` เป็น `null` (falsy) ทั้ง expression จะได้ `null` (React ไม่ render อะไรเลย) ถ้า `error` มีข้อความ (truthy) จะได้ `<p>...</p>` มาแสดง

---

## 9. TypeScript: `type` ( describe รูปแบบข้อมูล) และ `?` (optional field)

```typescript
export type LoginPayload = {
  email: string;
  password: string;
};
```
*(จาก `lib/api.ts`)*

`type ชื่อ = { ... }` คือการตั้งชื่อให้กับ "รูปแบบของ object" — พอมีตัวแปรไหนประกาศเป็น type นี้ TypeScript จะบังคับว่าต้องมี field `email` (เป็น `string`) และ `password` (เป็น `string`) ครบ ถ้าใส่ผิด type หรือขาด field จะ**ฟ้อง error ตอนเขียนโค้ด** (ก่อนรันจริงด้วยซ้ำ) ช่วยจับบั๊กได้เร็วกว่าปล่อยให้ error ตอน runtime

ในโปรเจคนี้ไม่มี field แบบ optional (`?`) ในหน้า frontend แต่จะเจอบ่อยฝั่ง backend เช่น `isActive?: boolean` (ใน `apps/api/src/users/dto/create-user.dto.ts`) — เครื่องหมาย `?` ต่อท้ายชื่อ field แปลว่า field นี้**จะไม่ส่งมาก็ได้** ไม่บังคับต้องมีเสมอไปแบบ field อื่น

---

## 10. Generic Type Argument บน Hook: `useState<T>(...)`

```typescript
const [error, setError] = useState<string | null>(null);
```
*(จาก `app/login/page.tsx`)*

ปกติ `useState('some text')` TypeScript จะ**เดา type ให้เอง** จากค่าเริ่มต้น (เดาว่าเป็น `string`) แต่บรรทัดนี้ค่าเริ่มต้นเป็น `null` ซึ่งเดาไม่ได้ว่าตัวแปรนี้ "จะเปลี่ยนเป็น string ได้ในอนาคต" — ส่วน `<string | null>` (เขียนในเครื่องหมาย `< >` ต่อท้ายชื่อฟังก์ชัน) คือการ**บอก type ให้ชัดเจนด้วยมือ** ว่า `error` มีได้ 2 แบบ: เป็น `string` (มีข้อความ error) หรือเป็น `null` (ยังไม่มี error) — `string | null` เรียกว่า **union type** (รวมหลาย type เข้าด้วยกันด้วย `|`)

---

## 11. Class + Constructor Parameter Property (`public status: number`)

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
```
*(จาก `lib/api.ts`)*

- **`class ApiError extends Error`** — สร้าง error type ของเราเอง โดย**สืบทอด** (`extends`) จาก `Error` มาตรฐานของ JavaScript (ได้ property/behavior ของ `Error` มาตรฐานมาด้วย เช่น `.message`, `.stack`)
- **`super(message)`** — เรียก constructor ของ class แม่ (`Error`) ให้ทำงานก่อน (ตั้งค่า `.message` ให้ถูกต้องตามกลไกของ `Error`) — คลาสลูกที่ `extends` ต้องเรียก `super(...)` เสมอก่อนใช้ `this`
- **`public status: number` ในพารามิเตอร์ของ constructor โดยตรง (ไม่มี `{ }` ใน constructor body ก็ประกาศ property ได้):** เป็น**ทางลัดของ TypeScript** — ปกติต้องเขียน 2 ที่ (ประกาศ property บน class + รับค่าใน constructor + assign เอง) แต่การใส่ `public` (หรือ `private`/`protected`) หน้าพารามิเตอร์ตรงๆ จะให้ TypeScript สร้าง property `status` บน class และ assign ค่าให้อัตโนมัติ เทียบเท่ากับเขียนยาวๆ:
```typescript
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
```

---

## 12. Import/Export

```typescript
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, ApiError } from '@/lib/api';
```
*(จาก `app/login/page.tsx`)*

- **`import { ชื่อ, ... } from 'แหล่งที่มา'`** — เรียกใช้สิ่งที่ **`export`** ไว้จากไฟล์/package อื่น แบบระบุชื่อ (named export) — ต้องใช้ชื่อเดียวกับที่ต้น export ไว้เป๊ะๆ (เปลี่ยนชื่อได้ด้วย `as` เช่น `import { login as doLogin }` แต่โค้ดนี้ไม่ได้ใช้)
- **`type FormEvent`** ในบรรทัดเดียวกับ `useState` — บอกว่า `FormEvent` เป็น **type-only import** (เอามาใช้แค่ตรวจสอบ type ตอนเขียนโค้ด ไม่มีค่าจริงเหลืออยู่ตอนโค้ดรัน) ช่วยให้ build tool รู้ว่าลบ import นี้ทิ้งได้ตอน compile เป็น JavaScript จริง (JavaScript ไม่มีระบบ type ไม่ต้องรู้จัก `FormEvent`)
- **`@/lib/api`** — `@/` คือ import alias ที่ตั้งไว้ตอน scaffold โปรเจค (`--import-alias "@/*"` ดู `FRONTEND_GUIDE.md` หัวข้อ 1) ชี้ไปที่ `src/` เสมอ ไม่ต้องนับ `../../` ให้งงเวลาไฟล์อยู่ลึก

```typescript
export default function LoginPage() { ... }
```
*(จาก `app/login/page.tsx`)*

**`export default`** — ต่างจาก named export (หัวข้อบน) แบบนี้ export ออกไปเป็น "ค่าเริ่มต้นของไฟล์" มีได้แค่ **1 default export ต่อไฟล์** — Next.js App Router **บังคับ**ให้ไฟล์ `page.tsx` ทุกไฟล์ต้อง `export default` component ของหน้านั้น (เป็นข้อกำหนดของ framework ไม่ใช่ทางเลือก) ตอน import กลับมาใช้ ตั้งชื่อเรียกเป็นอะไรก็ได้ (ไม่ต้องตรงกับชื่อตอน export)

---

## 13. JSX พื้นฐาน: `{ }` ฝัง JavaScript เข้าไปใน HTML

```jsx
<h1 className="mb-6 text-2xl font-semibold text-gray-900">เข้าสู่ระบบ</h1>
<input value={email} onChange={(e) => setEmail(e.target.value)} />
{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
```
*(จาก `app/login/page.tsx`)*

**JSX** คือ syntax ที่ให้เขียน HTML-like markup ปนอยู่ในโค้ด TypeScript/JavaScript ได้ตรงๆ — กฎสำคัญ: **ทุกที่ที่อยากใส่ค่า/expression ของ JavaScript ลงไปใน markup ต้องล้อมด้วย `{ }`** (ต่างจาก HTML ธรรมดาที่เป็น string ตายตัวทั้งหมด) เช่น:
- `className="..."` — สตริงตรงๆ ไม่ต้องมี `{ }` (เหมือน HTML attribute ปกติ)
- `value={email}` — ต้องมี `{ }` เพราะ `email` คือตัวแปร JavaScript ไม่ใช่สตริงตายตัว
- `{loading ? '...' : '...'}` — ต้องมี `{ }` เพราะเป็น expression (ternary จากหัวข้อ 8) ที่ต้องประเมินผลก่อนได้ข้อความมาแสดง

**ข้อสังเกต:** JSX ใช้ `className` แทน `class` (เพราะ `class` เป็นคำสงวนใน JavaScript) และใช้ `htmlFor` แทน `for` (เหตุผลเดียวกัน — `for` เป็นคำสงวนสำหรับ loop)

---

## 14. Fragment (`<>...</>`)

```jsx
{hasToken ? (
  <>
    <p className="text-sm text-gray-600">เข้าสู่ระบบแล้ว (มี access_token เก็บอยู่)</p>
    <button onClick={handleLogout} ...>ออกจากระบบ</button>
  </>
) : (
  <div className="flex gap-3">...</div>
)}
```
*(จาก `app/page.tsx`)*

กฎของ JSX: **ฟังก์ชันหนึ่งต้อง return element เดียว** (return หลาย element เรียงกันตรงๆ ไม่ได้) — ถ้าอยากกลุ่ม element หลายตัวไว้ด้วยกันโดยไม่อยากสร้าง `<div>` ครอบเพิ่ม (เพิ่ม element เข้า HTML จริงโดยไม่จำเป็น อาจทำ CSS layout เพี้ยน) ใช้ **Fragment** แทน — เขียนแบบสั้นเป็น `<>...</>` (ไม่มีชื่อ tag ข้างใน) ไม่ render อะไรลง HTML จริง แค่ "ห่อ" ให้ syntax ถูกต้อง

---

## 15. Render List ด้วย `.map()` + `key`

```jsx
{ROLES.map((role) => (
  <option key={role.id} value={role.id}>
    {role.name}
  </option>
))}
```
*(จาก `app/users/new/page.tsx`)*

`.map()` เป็น array method มาตรฐานของ JavaScript (แปลง array หนึ่งเป็น array ใหม่ โดยเรียกฟังก์ชันกับสมาชิกทุกตัว) ใน React นิยมใช้แปลง array ของข้อมูล (`ROLES`) เป็น array ของ JSX element (`<option>` หลายตัว) — **`key={role.id}` จำเป็นเสมอ** เวลา render list ด้วย `.map()`: React ใช้ `key` เป็น "ป้ายชื่อ" แยกแต่ละ element ในลิสต์ เพื่อรู้ว่าตัวไหนถูกเพิ่ม/ลบ/ย้ายตำแหน่งเวลาข้อมูลเปลี่ยน (ช่วยให้ re-render ได้ถูกต้องและเร็วขึ้น) — ควรใช้ค่าที่**ไม่ซ้ำกันในลิสต์** (เช่น `id`) ไม่ใช่ index ตำแหน่งเฉยๆ

---

## 16. `!!` (Double NOT) — แปลงเป็น boolean

```typescript
setHasToken(!!getToken());
```
*(จาก `app/page.tsx`)*

`getToken()` return ได้ 2 แบบ: `string` (มี token) หรือ `null` (ไม่มี) — `setHasToken` ต้องการ `boolean` (`true`/`false`) เท่านั้น `!` (NOT) ตัวแรกแปลงค่าใดๆ เป็น boolean ตรงข้าม (string ที่มีค่า → `false`, `null` → `true`) แล้ว `!` ตัวที่สองกลับค่าอีกที (string ที่มีค่า → `true`, `null` → `false`) รวมกันเป็น `!!x` คือ**ทางลัดสำหรับแปลงค่าอะไรก็ได้เป็น boolean ตามความจริง/เท็จของมัน** โดยไม่ต้องเขียน `x !== null && x !== ''` ยาวๆ

---

## 17. `useEffect` — รันโค้ดหลัง component render

```typescript
useEffect(() => {
  setHasToken(!!getToken());
}, []);
```
*(จาก `app/page.tsx`)*

`useEffect(ฟังก์ชัน, [dependency ...])` คือ React hook สำหรับรันโค้ดที่มี **side effect** (เช่น อ่าน `localStorage`, ยิง API, ตั้ง timer) — ให้รันหลังจาก component render เสร็จแล้วเท่านั้น (ไม่ใช่ตอน render) พารามิเตอร์ที่ 2 (`[]` — array ว่าง) คือ **dependency array**: บอก React ว่า "รันฟังก์ชันนี้แค่ครั้งเดียวตอน component ปรากฏขึ้นครั้งแรก" (ถ้าใส่ตัวแปรในนั้น เช่น `[roleId]` จะรันซ้ำทุกครั้งที่ `roleId` เปลี่ยนค่าด้วย — โค้ดนี้ไม่ได้ใช้แบบนั้น)

---

## 18. คำศัพท์สรุปท้ายเอกสาร

| คำศัพท์ | ความหมายสั้นๆ |
|---|---|
| **Destructuring** | แยกค่าจาก array/object ออกมาเป็นตัวแปรในบรรทัดเดียว |
| **Template literal** | string แบบ backtick ที่ฝังตัวแปรด้วย `${...}` ได้ |
| **Optional chaining (`?.`)** | อ่าน property ต่อได้เฉพาะเมื่อค่าก่อนหน้าไม่ใช่ null/undefined |
| **Union type (`A \| B`)** | ตัวแปร type นี้เป็นได้ทั้ง A หรือ B |
| **Generic (`<T>`)** | ระบุ type ให้ฟังก์ชัน/hook แบบเจาะจงตอนเรียกใช้ |
| **Parameter property** | ประกาศ + assign class property ในบรรทัดเดียวผ่านพารามิเตอร์ constructor |
| **Named export / default export** | export แบบระบุชื่อ (หลายอันต่อไฟล์ได้) กับ export ค่าเริ่มต้น (ได้แค่ 1 ต่อไฟล์) |
| **JSX** | syntax เขียน markup ปนโค้ด JS/TS ได้ในไฟล์เดียว |
| **Fragment (`<>...</>`)** | ห่อ element หลายตัวโดยไม่เพิ่ม tag จริงลง HTML |
| **Side effect** | งานที่ส่งผลกระทบนอกเหนือจากแค่ return ค่า (เช่น อ่าน localStorage, เรียก API) |

---

## เชื่อมกับเอกสารอื่น

- **`FRONTEND_GUIDE.md`** — คู่มือหลักที่มีโค้ดทั้งหมดที่ syntax ในเอกสารนี้ถูกดึงมาอธิบาย
- **`AUTH_GUIDE.md` หัวข้อ 2.4** — อธิบาย Decorator (`@Public()` ฯลฯ) ซึ่งเป็น syntax พิเศษที่ใช้ฝั่ง backend (NestJS) ไม่ได้ใช้ในฝั่ง frontend จึงไม่ซ้ำกับเอกสารนี้
