# คู่มือเรียนรู้ระบบ Login (Authentication) แบบ Step-by-Step

เอกสารนี้เป็น**เอกสารเพื่อเรียนรู้เท่านั้น ยังไม่มีการเขียนโค้ดจริง** — อธิบายแนวคิดและขั้นตอนทั้งหมดก่อน พอเข้าใจแล้วค่อยลงมือ implement จริงในโปรเจค `apps/api` ต่อไป

> อ้างอิงจากเอกสารทางการ: https://docs.nestjs.com/security/authentication (เช็คก่อนเขียนคู่มือนี้)

---

## 1. Authentication vs Authorization — 2 คำที่มักสับสน

| คำ | ความหมาย | ตัวอย่างในโปรเจคนี้ |
|---|---|---|
| **Authentication** (การพิสูจน์ตัวตน) | "คุณคือใคร" — ยืนยันว่า login เข้ามาจริงไหม | คู่มือนี้ — ระบบ Login ด้วย email/password |
| **Authorization** (การให้สิทธิ์) | "คุณทำอะไรได้บ้าง" — เช็คว่ามีสิทธิ์เข้าถึง resource นี้ไหม | **ไม่ได้อยู่ในคู่มือนี้** — คือ RBAC/`PermissionsGuard` ที่ออกแบบไว้ใน `plan.md` หัวข้อ 7 (ทำเป็นขั้นต่อไปตาม Roadmap หัวข้อ 11 ข้อ 6) |

**คู่มือนี้ครอบคลุมแค่ Authentication (Login)** — ทำให้ User login เข้าระบบได้และได้ "บัตรผ่าน" (JWT Token) มา ส่วนการเช็คว่าบัตรผ่านนั้นเปิดประตูไหนได้บ้าง (Authorization/RBAC) เป็นเรื่องของขั้นตอนถัดไป

---

## 2. Concept พื้นฐานที่ต้องเข้าใจก่อนเริ่ม

### 2.1 Password Hashing (bcrypt) — ทำไมห้ามเก็บรหัสผ่านตรงๆ

ตอนนี้ใน `apps/api` (จาก `NESTJS_BACKEND_GUIDE.md`) ยังเก็บ `password` เป็น **plain text** ใน database ตรงๆ — ถ้า database รั่วไหล คนร้ายจะเห็นรหัสผ่านทุกคนทันที (แถมหลายคนใช้รหัสผ่านเดียวกันซ้ำในหลายเว็บ ยิ่งอันตราย)

**bcrypt** คือ algorithm สำหรับ "แปลงรหัสผ่านให้เป็นค่าที่ถอดกลับไม่ได้" (one-way hash) พร้อม "เกลือ" (salt — ค่าสุ่มที่ผสมเข้าไปกันการโดน brute-force ด้วยตารางสำเร็จรูป):

```
รหัสผ่านจริง: "mypassword123"
         ↓ bcrypt.hash()
เก็บใน DB:  "$2b$10$N9qo8uLOickgx2ZMRZoMy..." (ถอดกลับเป็น "mypassword123" ไม่ได้)
```

**ตอน login** ระบบไม่ได้ "ถอดรหัส" hash กลับมาเทียบ แต่ใช้ `bcrypt.compare(รหัสผ่านที่กรอกมา, hashที่เก็บไว้)` ซึ่งจะ hash รหัสผ่านที่กรอกมาด้วยวิธีเดียวกัน แล้วเทียบผลลัพธ์ว่าตรงกันไหม

#### `SALT_ROUNDS` คืออะไร (ตัวเลขที่เห็นในโค้ดบ่อยๆ)

ในโค้ดมักเห็นค่าคงที่แบบนี้:

```typescript
const SALT_ROUNDS = 10;
// ...
const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
```

**Rounds** (เรียกอีกชื่อว่า "cost factor") คือ**จำนวนรอบที่ bcrypt จะวนคำนวณซ้ำ** ก่อนได้ hash สุดท้าย — สูตรคือ **2^rounds** รอบ ยิ่งเลขเยอะยิ่งช้าแต่ยิ่งปลอดภัย:

| Rounds | จำนวนรอบจริง | ความเร็วโดยประมาณ |
|---|---|---|
| 10 (ใช้ในโปรเจคนี้) | 2¹⁰ = 1,024 รอบ | ~50-100ms ต่อครั้ง |
| 12 | 2¹² = 4,096 รอบ | ~200-400ms ต่อครั้ง |
| 14 | 2¹⁴ = 16,384 รอบ | ~1-2 วินาทีต่อครั้ง |

**ทำไมต้องตั้งใจให้ช้า:** ยิ่ง hash ช้า ยิ่งทำให้คนร้ายที่ขโมย database ไปแล้วพยายาม "เดารหัสผ่านทีละคำ" (brute-force) ทำได้ช้าลงมหาศาล — hash แบบเร็ว (เช่น MD5) คนร้ายลองได้เป็นพันล้านครั้ง/วินาที แต่ bcrypt ที่ตั้งใจให้ช้าจะลองได้แค่หลักร้อย-หลักพันครั้ง/วินาทีเท่านั้น

**ทำไมเลือก 10:** เป็นค่ามาตรฐานที่นิยมใช้ทั่วไป สมดุลระหว่าง 2 อย่าง — ปลอดภัยพอสำหรับงานทั่วไป และเร็วพอที่ผู้ใช้ไม่ต้องรอนานตอน register/login (ถ้าตั้งสูงเกินไปเช่น 15+ ผู้ใช้ทุกคนจะรอหลายวินาทีทุกครั้งที่ login)

> Salt เองไม่ต้องส่งเอง — `bcrypt.hash()` สุ่มสร้าง salt ให้อัตโนมัติทุกครั้งที่เรียกใช้ ค่าที่ส่งเข้าไปเป็นแค่ "rounds" เท่านั้น

### 2.2 JWT (JSON Web Token) คืออะไร

JWT คือ "บัตรผ่าน" ที่ server ออกให้ User หลัง login สำเร็จ — User เก็บบัตรนี้ไว้ แล้วแนบมาทุกครั้งที่เรียก API ที่ต้อง login ก่อน แทนที่จะต้องส่ง email/password ซ้ำทุกครั้ง

**โครงสร้าง JWT** มี 3 ส่วนคั่นด้วยจุด: `header.payload.signature`

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJlbWFpbCI6ImEgYiJ9.SflKxwRJSMeKKF2QT4...
└────── header ──────┘└──────── payload ────────┘└──── signature ────┘
```

- **Header:** บอกว่าใช้ algorithm ไหน hash (เช่น HS256)
- **Payload:** ข้อมูลที่อยากแนบไปกับ token เช่น `{ sub: userId, email, roleId }` — **ใครก็อ่านได้ (แค่ base64 decode) อย่าใส่ข้อมูลลับ เช่น password ลงไปเด็ดขาด**
- **Signature:** ลายเซ็นที่ server สร้างด้วย **Secret Key** ลับที่มีแค่ server รู้ — ใช้เช็คว่า token นี้ไม่ได้ถูกปลอมแปลง/แก้ไข

**คุณสมบัติสำคัญ: Stateless** — server ไม่ต้องจำว่า User คนไหน login ค้างอยู่บ้าง (ต่างจากระบบ Session แบบเก่า) แค่เช็ค signature ของ token ที่ส่งมาว่าถูกต้องไหมก็รู้ได้เลยว่า token นี้ server เป็นคนออกให้จริง

**Token หมดอายุได้** — ตั้ง `expiresIn` ไว้ (เช่น 1 ชั่วโมง) กัน token ที่หลุดไปถูกใช้ตลอดกาล

### 2.3 Flow รวมทั้งหมด (ภาพใหญ่ก่อนลงรายละเอียด)

```mermaid
sequenceDiagram
    actor U as User
    participant API as NestJS API

    Note over U,API: ขั้นตอน Register (มีอยู่แล้วจาก NESTJS_BACKEND_GUIDE.md)
    U->>API: POST /users {email, password, name, roleId}
    API->>API: bcrypt.hash(password) ก่อนบันทึก
    API-->>U: 201 Created

    Note over U,API: ขั้นตอน Login (คู่มือนี้)
    U->>API: POST /auth/login {email, password}
    API->>API: หา user จาก email
    API->>API: bcrypt.compare(password ที่กรอก, hash ใน DB)
    API->>API: สร้าง JWT (payload: sub, email, roleId)
    API-->>U: 200 OK { access_token: "eyJ..." }

    Note over U,API: ขั้นตอนเรียก Protected Endpoint
    U->>API: GET /users (แนบ Header: Authorization: Bearer eyJ...)
    API->>API: Guard เช็ค signature ของ token
    API->>API: decode payload → req.user = { sub, email, roleId }
    API-->>U: 200 OK (ข้อมูลที่ขอ)
```

---

## 3. Package ที่ต้องติดตั้ง

| Package | ใช้ทำอะไร |
|---|---|
| `@nestjs/jwt` | สร้างและตรวจสอบ JWT (sign/verify) |
| `bcrypt` | Hash และเปรียบเทียบรหัสผ่าน |
| `@types/bcrypt` | TypeScript type definitions ของ bcrypt (dev dependency) |

```bash
npm install @nestjs/jwt bcrypt
npm install --save-dev @types/bcrypt
```

> **หมายเหตุ:** เอกสารทางการของ NestJS เวอร์ชันล่าสุดแนะนำใช้ `@nestjs/jwt` คู่กับ Guard ที่เขียนเอง (ไม่ต้องพึ่ง `@nestjs/passport` + `passport-jwt` เหมือนสมัยก่อน) — คู่มือนี้เดินตามแนวทางล่าสุดนี้เพราะเรียบง่ายกว่า

---

## 4. โครงสร้างไฟล์ที่จะสร้าง (แผนผังก่อนลงมือ)

```
src/
├── auth/
│   ├── auth.module.ts          # ประกอบร่าง JwtModule + AuthService + AuthController
│   ├── auth.service.ts         # logic การ login (validate + ออก token)
│   ├── auth.controller.ts      # route POST /auth/login
│   ├── dto/
│   │   └── login.dto.ts        # รับ { email, password }
│   ├── guards/
│   │   └── jwt-auth.guard.ts   # ตรวจ JWT ก่อนเข้า route ที่ป้องกันไว้
│   └── decorators/
│       └── public.decorator.ts # ติดป้าย route ที่ "ไม่ต้อง login ก็เข้าได้" (เช่น /auth/login เอง)
└── users/
    └── users.service.ts        # (แก้ของเดิม) เพิ่ม bcrypt.hash ตอน create
```

---

## 5. ขั้นตอนแนวคิด (Concept Steps — ยังไม่ใช่โค้ดจริง)

### ขั้นที่ 1 — ตั้งค่า JWT Secret

ต้องมี "กุญแจลับ" ที่ server ใช้เซ็นและตรวจสอบ JWT — เก็บไว้ใน `.env` (ห้าม hardcode ในโค้ด ห้าม commit ขึ้น git):

```env
JWT_SECRET="<ค่าสุ่มยาวๆ ไม่ควรเดาได้>"
JWT_EXPIRES_IN="1h"
```

**เทคนิคสร้างค่าสุ่มที่ปลอดภัย:** ใช้คำสั่ง
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
จะได้ string สุ่ม 64 ตัวอักษร เอาไปใส่ใน `JWT_SECRET`

### ขั้นที่ 2 — แก้ `UsersService` ให้ hash password ก่อนบันทึก

ตอนสร้าง User ใหม่ (`create()` ใน `users.service.ts`) ต้อง hash password ด้วย `bcrypt.hash(password, 10)` **ก่อน** ส่งให้ Prisma บันทึกลง DB — ไม่ใช่บันทึก plain text แบบตอนนี้

**จุดสำคัญ:** เวลา return ข้อมูล User กลับไปหลัง create/find ต้อง**ไม่ส่ง field `password` กลับไปด้วย** (แม้จะเป็น hash แล้วก็ไม่ควรเห็น) — ใช้เทคนิค destructuring ตัด field ออกก่อน return

### ขั้นที่ 3 — สร้าง `AuthService` พร้อม method หลัก 2 ตัว

**`validateUser(email, password)`:**
1. หา User จาก email ผ่าน Prisma
2. ถ้าไม่เจอ → return null (หรือ throw error)
3. ถ้าเจอ → `bcrypt.compare(password, user.password)` เช็คว่ารหัสผ่านตรงไหม
4. ถ้าตรง → return ข้อมูล user (ไม่รวม password)

**`login(user)`:**
1. สร้าง payload: `{ sub: user.id, email: user.email, roleId: user.roleId }`
2. ใช้ `jwtService.signAsync(payload)` สร้าง token
3. return `{ access_token: token }`

### ขั้นที่ 4 — สร้าง `AuthController` — endpoint `POST /auth/login`

รับ `LoginDto { email, password }` → เรียก `authService.validateUser()` → ถ้าไม่ผ่าน throw `UnauthorizedException` → ถ้าผ่าน เรียก `authService.login()` → return token

### ขั้นที่ 5 — สร้าง `JwtAuthGuard`

Guard ที่:
1. ดึง token จาก header `Authorization: Bearer <token>`
2. ใช้ `jwtService.verifyAsync(token)` ตรวจสอบ signature + วันหมดอายุ
3. ถ้าผ่าน → แนบ payload เข้า `request.user` ให้ controller อื่นเรียกใช้ต่อได้ (เช่น `@Req() req` แล้วอ่าน `req.user.roleId`)
4. ถ้าไม่ผ่าน → throw `UnauthorizedException`

### ขั้นที่ 6 — ตัดสินใจ: ป้องกันทุก route โดย default หรือเลือกป้องกันทีละ route?

มี 2 แนวทาง:

| แนวทาง | ข้อดี | ข้อเสีย |
|---|---|---|
| **A: Global Guard** (ป้องกันทุก route อัตโนมัติ ยกเว้นที่ติดป้าย `@Public()`) | ปลอดภัยกว่า — ลืมใส่ Guard ที่ route ใหม่ไม่ได้เพราะป้องกันอยู่แล้วโดย default | ต้องจำใส่ `@Public()` ที่ route ที่ตั้งใจเปิดให้เข้าได้โดยไม่ login |
| **B: ใส่ทีละ route** (`@UseGuards(JwtAuthGuard)` เฉพาะ route ที่ต้องการ) | ควบคุมง่าย เห็นชัดในแต่ละไฟล์ | เสี่ยงลืมใส่ที่ route ใหม่ๆ กลายเป็นเปิดโล่งโดยไม่ตั้งใจ |

**แนะนำ: แนวทาง A (Global Guard)** เพราะปลอดภัยกว่า (fail-safe — พลาดแล้วปิดไว้ก่อน ดีกว่าพลาดแล้วเปิดโล่ง) โดยเฉพาะโปรเจคนี้ที่มีข้อมูลอ่อนไหว (ข้อมูลสมาชิก, การจอง)

### ขั้นที่ 7 — สร้าง `@Public()` Decorator (ถ้าเลือกแนวทาง A)

Decorator เล็กๆ ที่แปะ metadata ไว้บน route (เช่น `POST /auth/login`, `POST /users` ตอนสมัครสมาชิกใหม่) บอก Guard ว่า "route นี้ไม่ต้องเช็ค token" — Guard จะเช็ค metadata นี้ก่อนตัดสินใจว่าจะบล็อกหรือปล่อยผ่าน

### ขั้นที่ 8 — ทดสอบ Flow เต็ม

1. สร้าง User ใหม่ผ่าน `POST /users` (password จะถูก hash แล้ว)
2. Login ผ่าน `POST /auth/login` ด้วย email/password เดิม → ได้ `access_token` กลับมา
3. เรียก `GET /users` **โดยไม่แนบ token** → ควรได้ `401 Unauthorized`
4. เรียก `GET /users` **พร้อมแนบ** `Authorization: Bearer <access_token>` → ควรได้ `200 OK`
5. ลองแนบ token ที่แก้ไข/ปลอมมาเอง → ควรได้ `401 Unauthorized` (signature ไม่ตรง)

---

## 6. Security Checklist (สำคัญมาก อย่าข้าม)

- [ ] `JWT_SECRET` ต้องเป็นค่าสุ่มยาวๆ (อย่างน้อย 32 ตัวอักษร) ไม่ใช่คำง่ายๆ เดาได้
- [ ] `JWT_SECRET` อยู่ใน `.env` เท่านั้น **ห้าม commit ขึ้น git** (เช็คว่า `.env` อยู่ใน `.gitignore` แล้ว — มีอยู่แล้วจาก `NESTJS_BACKEND_GUIDE.md`)
- [ ] `.env.example` ใส่แค่ placeholder ไม่ใช่ค่าจริง (ต่างจาก `DATABASE_URL` ที่เป็นแค่ dev password เปิดเผยได้)
- [ ] Password hash ด้วย bcrypt salt rounds 10 เป็นอย่างน้อย ไม่เก็บ plain text อีกต่อไป
- [ ] Response ที่ส่งข้อมูล User กลับไปทุกจุด **ต้องไม่มี field `password`** ติดไปด้วย (เช็คทั้ง create, findAll, findOne, update)
- [ ] Token มี `expiresIn` ตั้งไว้ ไม่ปล่อยให้ใช้ได้ตลอดกาล
- [ ] Error message ตอน login ผิดต้องเขียนกลางๆ เช่น "Invalid credentials" — **ห้ามบอกว่า "email ไม่มีในระบบ" กับ "password ผิด" แยกกัน** เพราะจะทำให้คนร้ายรู้ว่า email ไหนมีอยู่จริงในระบบ (user enumeration attack)
- [ ] Production จริงต้องใช้ HTTPS เท่านั้น (JWT ที่ส่งผ่าน HTTP ธรรมดาถูกดักจับได้ง่าย)

---

## 7. เชื่อมกับขั้นตอนถัดไป (ไม่รวมในคู่มือนี้)

หลังทำ Authentication (คู่มือนี้) เสร็จ ขั้นต่อไปตาม `plan.md` หัวข้อ 11 คือ:

- **RBAC Module (`PermissionsGuard`)** — ใช้ `roleId` ที่อยู่ใน `req.user` (จาก JWT payload ที่ `JwtAuthGuard` แนบไว้ให้แล้วในคู่มือนี้) ไป query `RolePermission` ตรวจสอบว่า role นี้มีสิทธิ์ `canView`/`canAdd`/`canEdit`/`canDelete` กับเมนูที่กำลังเรียกไหม — เห็นไหมว่า Authentication (คู่มือนี้) เป็นฐานที่ RBAC ต้องพึ่งพา (`req.user.roleId` ต้องมีอยู่ก่อน ถึงจะเอาไปเช็คสิทธิ์ต่อได้)

---

## 8. คำศัพท์สรุปท้ายเอกสาร

| คำศัพท์ | ความหมายสั้นๆ |
|---|---|
| **Authentication** | พิสูจน์ตัวตนว่าเป็นใคร (Login) |
| **Authorization** | ตรวจสอบสิทธิ์ว่าทำอะไรได้บ้าง (RBAC) |
| **Hash** | แปลงข้อมูลเป็นค่าที่ถอดกลับไม่ได้ (ทางเดียว) |
| **Salt** | ค่าสุ่มที่ผสมก่อน hash กัน brute-force |
| **Rounds / Cost Factor** | จำนวนรอบ (2^n) ที่ bcrypt วนคำนวณซ้ำ ยิ่งเยอะยิ่งช้าแต่ยิ่งปลอดภัย |
| **JWT** | บัตรผ่านแบบ token ที่ตรวจสอบตัวเองได้ ไม่ต้องเก็บ session ฝั่ง server |
| **Payload** | ข้อมูลที่ฝังอยู่ใน JWT (อ่านได้แต่แก้ไม่ได้ถ้าไม่รู้ secret) |
| **Signature** | ลายเซ็นใน JWT ที่ยืนยันว่าไม่ถูกปลอมแปลง |
| **Guard** | กลไกของ NestJS ที่เช็คก่อนอนุญาตให้เข้า route |
| **Bearer Token** | รูปแบบการแนบ token มาตรฐานใน HTTP Header (`Authorization: Bearer <token>`) |
