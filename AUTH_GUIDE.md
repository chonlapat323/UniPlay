# คู่มือเรียนรู้ระบบ Login (Authentication) แบบ Step-by-Step

เอกสารนี้อธิบายแนวคิดก่อน แล้วตามด้วย**โค้ดจริงที่ implement และทดสอบแล้วใน `apps/api`** — ทำตามหัวข้อ 5 ทีละขั้นแล้วจะได้ระบบ Login ที่ใช้งานได้จริงเหมือนใน `apps/api`

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

### 2.4 Decorator คืออะไร ทำหน้าที่อะไร (พื้นฐานก่อนไปเจอ `@Public()`)

**Decorator** คือ syntax พิเศษของ TypeScript ที่เขียนนำหน้าด้วย `@` (เช่น `@Injectable()`, `@Controller('users')`, `@Public()`) — หน้าที่ของมันคือ **"แปะป้าย/แนบข้อมูลเพิ่มเติม" (metadata)** ให้กับ class, method, หรือ property โดยไม่ต้องไปแก้โค้ดข้างในของสิ่งนั้นเลย

**เบื้องหลังจริงๆ แล้ว decorator ก็คือฟังก์ชันธรรมดา** ที่ TypeScript เรียกให้อัตโนมัติตอน "นิยาม class" (ตอนไฟล์ถูก import/load ครั้งแรก ไม่ใช่ตอนมี request เข้ามา) เช่น:

```typescript
@Controller('users')   // เทียบเท่ากับ: Controller('users')(UsersController)
export class UsersController { ... }
```

`Controller('users')` เป็นฟังก์ชันที่ return ฟังก์ชันอีกชั้น ซึ่งรับ `UsersController` เป็น argument แล้วไปแนบ metadata `{ path: 'users' }` ติดกับ class นั้นไว้ (ใช้กลไกของ JS ชื่อ `Reflect.defineMetadata` เก็บไว้เบื้องหลัง) — เขียน `@Controller('users')` ไว้บน class แค่เป็น**ทางลัดที่อ่านง่ายกว่า** การเรียกฟังก์ชันตรงๆ แบบด้านบน

**จุดสำคัญที่มักเข้าใจผิด:** Decorator เอง**ไม่ได้ทำอะไรตอน runtime ที่มี request เข้ามาเลย** มันแค่แปะป้าย/บันทึกข้อมูลไว้ล่วงหน้าตอนแอปเริ่มทำงาน — ต้องมี**ส่วนอื่นของ NestJS มาอ่านป้ายนั้นอีกที** งานถึงจะเกิดขึ้นจริง เช่น:
- `@Controller('users')` แปะป้าย path ไว้ → ตอนแอป start, `RouterExplorer` ของ NestJS มาอ่านป้ายนี้เพื่อไปสร้าง route จริง
- `@Public()` (ที่จะสร้างในขั้นที่ 4) แปะป้าย `isPublic: true` ไว้ที่ method → ตอนมี request เข้ามาจริง `JwtAuthGuard` (ขั้นที่ 7) ใช้ `Reflector` มาอ่านป้ายนี้อีกที ถึงจะรู้ว่าควรข้ามการเช็ค token หรือไม่

พูดง่ายๆ: **decorator = ป้ายกำกับ, ส่วนที่ตัดสินใจทำงานจริงคือโค้ดที่ไปอ่านป้ายนั้น** (Guard/Reflector ในคู่มือนี้) — นี่คือเหตุผลที่ `@Public()` เพียงลำพัง (โค้ด 2 บรรทัดในขั้นที่ 4) ไม่มีผลอะไรเลยจนกว่าจะมี `JwtAuthGuard` ไปเช็ค metadata ของมันในขั้นที่ 7

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

**ใช้ NestJS CLI สร้างไฟล์พวกนี้แทนสร้างมือได้** (รันจากโฟลเดอร์ `apps/api` หรือ `ex/api`):

```bash
nest g mo auth                                        # auth.module.ts (auto-register ใน app.module.ts ให้ด้วย)
nest g s auth --no-spec                                # auth.service.ts
nest g co auth --no-spec                               # auth.controller.ts
nest g gu auth/guards/jwt-auth --no-spec               # guards/jwt-auth.guard.ts
nest g d auth/decorators/public --no-spec               # decorators/public.decorator.ts
```

| ส่วน | ความหมาย |
|---|---|
| `nest g` | ย่อมาจาก `nest generate` |
| `mo`/`s`/`co`/`gu`/`d` | ย่อของ module/service/controller/guard/decorator |
| `--no-spec` | ไม่ต้องสร้างไฟล์ `.spec.ts` (unit test) มาด้วย — คู่มือนี้ยังไม่ได้สอนเรื่อง testing |

**ข้อควรรู้:** `nest g mo auth` จะไปแก้ `app.module.ts` ให้อัตโนมัติ (เพิ่ม `AuthModule` เข้า `imports`) — เปิดไฟล์เช็คดูว่า import ถูกเพิ่มจริงหลังรัน ส่วนไฟล์ที่ generate มาจะเป็น **เปลือกเปล่าๆ** (มีแค่ `@Module`/`@Injectable`/`@Controller` ว่างๆ) ต้องเข้าไปเติมโค้ดจริงตามขั้นตอนที่ 5 เอง

**`dto/login.dto.ts` ไม่มี schematic เฉพาะ** — สร้างไฟล์ (โฟลเดอร์ `dto` ด้วย) ด้วยมือตามปกติ

---

## 5. ขั้นตอนลงมือทำจริง (พร้อมโค้ดที่ทดสอบแล้ว)

### ขั้นที่ 1 — ตั้งค่า JWT Secret ใน `.env`

ต้องมี "กุญแจลับ" ที่ server ใช้เซ็นและตรวจสอบ JWT — เก็บไว้ใน `.env` (ห้าม hardcode ในโค้ด ห้าม commit ขึ้น git):

```env
# .env
JWT_SECRET="<ค่าสุ่มยาวๆ ไม่ควรเดาได้>"
JWT_EXPIRES_IN_SECONDS="3600"
```

**เทคนิคสร้างค่าสุ่มที่ปลอดภัย:** ใช้คำสั่ง
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
จะได้ string สุ่ม 64 ตัวอักษร เอาไปใส่ใน `JWT_SECRET`

**หมายเหตุ:** ใช้ `JWT_EXPIRES_IN_SECONDS` เป็น**ตัวเลขวินาที** (ไม่ใช่ string แบบ `"1h"`) เพราะ TypeScript type ของ `signOptions.expiresIn` ในเวอร์ชันที่โปรเจคนี้ใช้ไม่รับ string แบบนั้นตรงๆ — ใน `.env.example` ตั้งไว้ที่ `3600` (1 ชั่วโมง)

### ขั้นที่ 2 — ติดตั้ง package แล้วแก้ `UsersService` ให้ hash password ก่อนบันทึก

ทำตามหัวข้อ 3 ติดตั้ง `@nestjs/jwt`, `bcrypt`, `@types/bcrypt` ก่อน จากนั้นแก้ `src/users/users.service.ts` ทั้งไฟล์เป็นแบบนี้:

```typescript
// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private stripPassword<T extends { password: string }>(user: T) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS,
    );
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
    return this.stripPassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.stripPassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.stripPassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    const user = await this.prisma.user.update({ where: { id }, data });
    return this.stripPassword(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    const user = await this.prisma.user.delete({ where: { id } });
    return this.stripPassword(user);
  }
}
```

**จุดสำคัญ:** `stripPassword()` ตัด field `password` ออกก่อน return ทุกจุด (create/findAll/findOne/update/remove) — แม้จะเป็น hash แล้วก็ไม่ควรหลุดออกไปให้ client เห็น

### ขั้นที่ 3 — สร้าง `LoginDto`

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student1@uniplay.test' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  password: string;
}
```

### ขั้นที่ 4 — สร้าง `@Public()` Decorator

ก่อนไปต่อ ต้องมี decorator นี้ก่อน เพราะ `AuthController` (ขั้นที่ 6) และ Guard (ขั้นที่ 7) ต้องใช้:

```typescript
// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Decorator เล็กๆ ที่แปะ metadata ไว้บน route (เช่น `POST /auth/login`, `POST /users` ตอนสมัครสมาชิกใหม่) บอก Guard ว่า "route นี้ไม่ต้องเช็ค token" — Guard ในขั้นที่ 7 จะเช็ค metadata นี้ก่อนตัดสินใจว่าจะบล็อกหรือปล่อยผ่าน

### ขั้นที่ 5 — สร้าง `AuthService`

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async login(user: { id: string; email: string; roleId: string }) {
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
```

**`validateUser(email, password)`:** หา User จาก email → ถ้าไม่เจอหรือถูกปิดใช้งาน (`isActive: false`) throw `UnauthorizedException` → ถ้าเจอ ใช้ `bcrypt.compare(password, user.password)` เช็คว่ารหัสผ่านตรงกับ hash ที่เก็บไว้ไหม → ถ้าตรง ตัด `password` ออกแล้ว return user

**`login(user)`:** สร้าง payload `{ sub: user.id, email: user.email, roleId: user.roleId }` แล้วใช้ `jwtService.signAsync(payload)` เซ็น token กลับไปเป็น `{ access_token }` — `sub` (subject) เป็นชื่อ field มาตรฐานของ JWT ที่หมายถึง "id ของเจ้าของ token"

**ทำไม error message เดียวกันทั้ง 2 เคส (`Invalid credentials`):** กันไม่ให้คนร้ายรู้ว่า email ไหนมีอยู่จริงในระบบ (user enumeration attack) — ดู Security Checklist หัวข้อ 6

### ขั้นที่ 6 — สร้าง `AuthController`

```typescript
// src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login ด้วย email/password รับ JWT access_token กลับมา' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }
}
```

`@HttpCode(HttpStatus.OK)` บังคับให้ตอบ `200 OK` แทน `201 Created` ที่ NestJS ใช้เป็น default ของ `@Post()` (login ไม่ได้ "สร้าง" อะไรใหม่ จึง `200` เหมาะกว่า) — `@Public()` เปิดให้เรียก route นี้ได้โดยไม่ต้องมี token อยู่แล้ว (ไม่งั้นจะ login ไม่ได้เพราะยังไม่มี token ตั้งแต่แรก)

### ขั้นที่ 7 — สร้าง `JwtAuthGuard`

```typescript
// src/auth/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      (request as any).user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

**อ่านทีละบรรทัด:**
- `reflector.getAllAndOverride(IS_PUBLIC_KEY, [handler, class])` — เช็คว่า route (หรือทั้ง controller) ติดป้าย `@Public()` ไว้ไหม ถ้าใช่ ปล่อยผ่านทันที (`return true`) โดยไม่เช็ค token เลย
- `extractTokenFromHeader()` — แกะ header `Authorization: Bearer <token>` เอาเฉพาะส่วน `<token>` ออกมา (ถ้า format ไม่ถูก หรือไม่มี header นี้เลย จะได้ `undefined`)
- ไม่มี token → throw `UnauthorizedException('No token provided')` (`401`)
- มี token → `jwtService.verifyAsync(token)` ตรวจสอบทั้ง signature (ไม่ถูกปลอมแปลง) และวันหมดอายุ พร้อมกันในคำสั่งเดียว — ถ้าไม่ผ่าน (signature ผิดหรือหมดอายุ) จะ throw exception ออกมา ซึ่งเราจับด้วย `catch` แล้วโยนเป็น `UnauthorizedException('Invalid or expired token')` ต่อ (`401`)
- ผ่านหมด → เอา payload ที่ decode ได้ (มี `sub`, `email`, `roleId`) แนบเข้า `request.user` ให้ controller อื่นเรียกใช้ต่อได้ (เช่น `@Req() req` แล้วอ่าน `req.user.roleId`) แล้ว `return true` ปล่อยให้เข้า route ได้

### ขั้นที่ 8 — ตัดสินใจ: ป้องกันทุก route โดย default หรือเลือกป้องกันทีละ route?

มี 2 แนวทาง:

| แนวทาง | ข้อดี | ข้อเสีย |
|---|---|---|
| **A: Global Guard** (ป้องกันทุก route อัตโนมัติ ยกเว้นที่ติดป้าย `@Public()`) | ปลอดภัยกว่า — ลืมใส่ Guard ที่ route ใหม่ไม่ได้เพราะป้องกันอยู่แล้วโดย default | ต้องจำใส่ `@Public()` ที่ route ที่ตั้งใจเปิดให้เข้าได้โดยไม่ login |
| **B: ใส่ทีละ route** (`@UseGuards(JwtAuthGuard)` เฉพาะ route ที่ต้องการ) | ควบคุมง่าย เห็นชัดในแต่ละไฟล์ | เสี่ยงลืมใส่ที่ route ใหม่ๆ กลายเป็นเปิดโล่งโดยไม่ตั้งใจ |

**เลือกแนวทาง A (Global Guard)** เพราะปลอดภัยกว่า (fail-safe — พลาดแล้วปิดไว้ก่อน ดีกว่าพลาดแล้วเปิดโล่ง) โดยเฉพาะโปรเจคนี้ที่มีข้อมูลอ่อนไหว (ข้อมูลสมาชิก, การจอง) — นี่คือเหตุผลที่ต้องมี `@Public()` decorator จากขั้นที่ 4

### ขั้นที่ 9 — ประกอบร่างเป็น `AuthModule`

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 3600 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
```

`JwtModule.registerAsync({ global: true, ... })` — ตั้งค่า `JwtService` แบบ async เพราะต้องอ่านค่าจาก `process.env` (`useFactory`) และตั้ง `global: true` ให้ module อื่น (เช่น `AppModule` ที่จะใช้ `JwtAuthGuard`) inject `JwtService` ได้โดยไม่ต้อง import `JwtModule` ซ้ำ — `exports: [JwtAuthGuard]` เพราะ `AppModule` (ขั้นที่ 10) ต้องเอา `JwtAuthGuard` ไปตั้งเป็น global guard

### ขั้นที่ 10 — ตั้ง `JwtAuthGuard` เป็น Global Guard ใน `AppModule`

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

Provider พิเศษ `{ provide: APP_GUARD, useClass: JwtAuthGuard }` คือวิธีมาตรฐานของ NestJS ในการติดตั้ง Guard ให้ทำงานกับ**ทุก route ในแอปทั้งหมด** โดยอัตโนมัติ (ไม่ต้องไปแปะ `@UseGuards()` ทีละ controller)

### ขั้นที่ 11 — เปิด `@Public()` เฉพาะ route ที่ควรเข้าได้โดยไม่ login

ใน `src/users/users.controller.ts` มีแค่ `create()` (`POST /users` — สมัครสมาชิกใหม่) ที่ควรเปิดให้เข้าได้โดยไม่ต้อง login (ยังไม่มี token จะเอามาจากไหนตอนสมัครครั้งแรก) ส่วน `findAll`, `findOne`, `update`, `remove` ต้อง login ก่อน:

```typescript
// src/users/users.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: เปิด public ไว้ชั่วคราวเพื่อ bootstrap user แรกได้ก่อนมี token
  // พอทำ RBAC (PermissionsGuard) เสร็จ ต้องเปลี่ยนเป็นจำกัดสิทธิ์เฉพาะ Staff/Admin เท่านั้น
  @ApiOperation({ summary: 'สร้างสมาชิกใหม่ (ไม่ต้อง login)' })
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดึงรายการสมาชิกทั้งหมด' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดึงสมาชิกทีละคนตาม id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้ไขข้อมูลสมาชิก' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบสมาชิก' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

`@ApiBearerAuth()` ไม่ได้เกี่ยวกับการเช็ค token จริง (นั้นเป็นหน้าที่ของ `JwtAuthGuard` ที่ทำงานอยู่แล้วแบบ global) — มันแค่บอก Swagger UI ให้วาดรูปกุญแจ 🔒 ที่ route นี้และรู้ว่าต้องแนบ token ตอนกด "Try it out" (รายละเอียดเต็มอยู่ใน `SWAGGER_GUIDE.md`)

### ขั้นที่ 12 — ทดสอบ Flow เต็มด้วย curl

```bash
# 1) สร้าง User ใหม่ (ต้องมี roleId จริงจาก table role ก่อน)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@uniplay.test","password":"mypassword123","name":"Somchai","roleId":"<roleId จริง>"}'

# 2) เรียก GET /users โดยไม่แนบ token → ควรได้ 401 Unauthorized
curl -i http://localhost:3000/users

# 3) Login ด้วย email/password เดิม → ได้ access_token กลับมา
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@uniplay.test","password":"mypassword123"}'

# 4) เรียก GET /users พร้อมแนบ token → ควรได้ 200 OK
curl http://localhost:3000/users \
  -H "Authorization: Bearer <access_token จากขั้นที่ 3>"
```

ผลที่ควรได้ตรงกับที่ทดสอบไว้จริงตอนเขียนคู่มือนี้: ขั้น 2 ตอบ `401 {"message":"No token provided",...}`, ขั้น 3 ตอบ `{"access_token":"eyJ..."}`, ขั้น 4 ตอบ `200` พร้อมรายการ user (ไม่มี field `password` ติดมา)

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
