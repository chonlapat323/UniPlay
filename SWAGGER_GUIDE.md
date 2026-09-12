# คู่มือเพิ่ม Swagger (API Documentation) แบบ Step-by-Step

เอกสารนี้สอนวิธีเพิ่ม **Swagger UI** (หน้าเว็บแสดง API ทั้งหมดของโปรเจค ทดสอบยิง request ได้จากหน้าเว็บเลย) เข้าไปใน NestJS — ทุกคำสั่ง/โค้ดในนี้ติดตั้งและทดสอบผ่านจริงแล้วใน `apps/api` ก่อนเขียนคู่มือ (เช็คเอกสารทางการ https://docs.nestjs.com/openapi ก่อนด้วย)

## โฟลเดอร์ไหนทำอะไร

| โฟลเดอร์ | สถานะ | ใช้ทำอะไร |
|---|---|---|
| **`apps/api`** | ติดตั้ง Swagger + Auth เสร็จแล้ว ทดสอบผ่านจริง | **เฉลย/ของจริงที่ใช้งาน** — เปิด `http://localhost:3000/api` ดูตัวอย่างได้เลย |
| **`ex/api`** | ยังไม่มี Swagger | **ที่ฝึกของนักเรียน** — ทำตามคู่มือนี้เพิ่มเข้าไปเอง |

> คู่มือนี้สอนคู่กับ `AUTH_GUIDE.md` — endpoint ที่ต้อง login (`GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`) มาจากการทำ `AUTH_GUIDE.md` เสร็จแล้ว ถ้ายังไม่ได้ทำ `AUTH_GUIDE.md` ให้ทำเรื่องนั้นก่อน

---

## 0. Swagger คืออะไร ทำไมต้องมี

**Swagger (OpenAPI)** คือมาตรฐานการเขียน "เอกสาร API" แบบที่ทั้งคนอ่านและโปรแกรมอ่านได้ — พอติดตั้งเสร็จ จะได้หน้าเว็บ (`/api`) ที่แสดง:
- Endpoint ทั้งหมดที่มีในระบบ (`GET /users`, `POST /auth/login` ฯลฯ)
- แต่ละ endpoint รับ/ส่งข้อมูลรูปแบบไหน (ตรงกับ DTO ที่เขียนไว้)
- **ปุ่ม "Try it out"** ยิง request ทดสอบได้จากหน้าเว็บเลย ไม่ต้องเปิด Postman/curl แยก
- endpoint ไหนต้อง login จะมีสัญลักษณ์กุญแจ 🔒 บอกไว้ด้วย พร้อมปุ่ม **"Authorize"** ให้กรอก token ครั้งเดียวใช้ได้กับทุก endpoint ที่ล็อกไว้

**ประโยชน์หลัก:** แทนที่จะเขียนเอกสารแยกต่างหากแล้วต้องคอยอัปเดตเองตลอด (พลาดบ่อย เอกสารไม่ตรงกับโค้ดจริง) Swagger **อ่านจากโค้ดจริง** (decorator ที่ใส่ในคอนโทรลเลอร์/DTO) แล้ว generate เอกสารให้อัตโนมัติ — โค้ดเปลี่ยน เอกสารเปลี่ยนตาม ไม่มีวันตกยุค

---

## 1. ติดตั้ง Package

```bash
npm install @nestjs/swagger@11.4.7
```

> **สำคัญ: ต้องระบุเวอร์ชันให้ตรงกับ NestJS ที่ใช้อยู่** — ถ้ารัน `npm install @nestjs/swagger` เฉยๆ จะได้เวอร์ชันล่าสุด (12.x) ซึ่งต้องการ `@nestjs/common@^12.0.0` แต่โปรเจคนี้ใช้ NestJS 11 (`@nestjs/common@^11.0.1`) จะ error `Could not resolve dependency` ทันที — เช็คเวอร์ชัน NestJS ที่ใช้อยู่ก่อนด้วย `cat package.json | grep @nestjs/common` แล้วเลือก `@nestjs/swagger` ให้ major version ตรงกัน (NestJS 11 → swagger 11.x)

เช็คว่าไม่มีช่องโหว่ความปลอดภัยหลงเหลือ:
```bash
npm audit
```
ควรขึ้น `found 0 vulnerabilities`

---

## 2. ตั้งค่าใน `main.ts`

แก้ `src/main.ts` เพิ่ม import และตั้งค่า Swagger ก่อน `app.listen()`:

```typescript
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
/* -------------------- Swagger: เพิ่มบรรทัดนี้ -------------------- */
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
/* ------------------------------------------------------------------ */
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  /* ------------------------- Swagger: เพิ่ม block นี้ทั้งหมด ------------------------- */
  const config = new DocumentBuilder()
    .setTitle('UniPlay API')
    .setDescription('เอกสาร API ของระบบจองสนามกีฬา UniPlay')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  /* ------------------------------------------------------------------------------------ */

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**อธิบายทีละส่วน:**

| โค้ด | ทำหน้าที่อะไร |
|---|---|
| `new DocumentBuilder()` | เริ่มสร้าง "ข้อมูลตั้งต้น" ของเอกสาร (ชื่อ, คำอธิบาย, เวอร์ชัน) |
| `.setTitle(...)` / `.setDescription(...)` / `.setVersion(...)` | ข้อความที่แสดงอยู่บนสุดของหน้า Swagger UI |
| `.addBearerAuth()` | บอก Swagger ว่าโปรเจคนี้มี endpoint ที่ต้องแนบ `Authorization: Bearer <token>` — เปิดปุ่ม **"Authorize"** ที่มุมขวาบนของหน้า Swagger UI ให้กรอก token ครั้งเดียวใช้ได้กับทุก endpoint ที่ล็อกไว้ (ไม่ต้องพิมพ์ header เองทุกครั้ง) |
| `.build()` | ปิดการตั้งค่า ได้ config object ออกมา |
| `SwaggerModule.createDocument(app, config)` | อ่านทุก Controller/DTO ในแอปจริง (ที่มี decorator ของ Swagger) มาประกอบเป็นเอกสาร OpenAPI |
| `SwaggerModule.setup('api', app, documentFactory)` | เปิดให้เข้าดูหน้าเว็บได้ที่ path `/api` (เช่น `http://localhost:3000/api`) — เปลี่ยน `'api'` เป็นชื่ออื่นได้ถ้าอยากได้ path อื่น |

> **หมายเหตุ:** `.addBearerAuth()` แค่ทำให้ Swagger UI **รู้จัก** รูปแบบ Bearer token และวาดปุ่ม "Authorize" ให้เท่านั้น — มันไม่ได้ไปเช็ค token จริงแทน `JwtAuthGuard` (จาก `AUTH_GUIDE.md`) การเช็คจริงยังเป็นหน้าที่ของ Guard เหมือนเดิม `.addBearerAuth()` แค่ทำให้**เอกสาร**ตรงกับพฤติกรรมจริงของ API

> **ทำไมใช้ `documentFactory` (function) แทนที่จะเรียก `createDocument` ตรงๆ:** เอกสารทางการของ NestJS แนะนำให้ห่อด้วย function เพื่อให้ Swagger สร้างเอกสารหลังจากแอป initialize ครบถ้วนแล้วเท่านั้น (กัน route บางตัวหายไปจากเอกสารเพราะสร้างเร็วเกินไป)

---

## 3. เพิ่ม `@ApiTags` ให้ Controller (จัดกลุ่ม endpoint)

แก้ `src/users/users.controller.ts` — เพิ่ม import และ decorator บนสุดของ class:

```typescript
/* -------------------- Swagger: เพิ่มบรรทัดนี้ -------------------- */
import { ApiTags, ApiOperation } from '@nestjs/swagger';
/* ------------------------------------------------------------------ */
```

```typescript
/* ---- Swagger: เพิ่มบรรทัดนี้ ---- */
@ApiTags('users')
/* -------------------------------- */
@Controller('users')
export class UsersController {
```

ทำเหมือนกันกับ `src/auth/auth.controller.ts`:

```typescript
/* -------------------- Swagger: เพิ่มบรรทัดนี้ -------------------- */
import { ApiTags, ApiOperation } from '@nestjs/swagger';
/* ------------------------------------------------------------------ */
```

```typescript
/* ---- Swagger: เพิ่มบรรทัดนี้ ---- */
@ApiTags('auth')
/* -------------------------------- */
@Controller('auth')
export class AuthController {
```

**อธิบาย:** `@ApiTags('users')` ทำให้ endpoint ทั้งหมดใน controller นี้ถูกจัดกลุ่มไว้ด้วยกันในหน้า Swagger UI (เห็นเป็นหมวด "users" แยกจากหมวด "auth") — ถ้าไม่ใส่ endpoint ทั้งหมดจะไปกองรวมกันไม่มีหมวดหมู่

---

## 4. เพิ่ม `@ApiOperation` ให้แต่ละ method

แก้ทีละ method ใน `users.controller.ts` — ใส่ decorator ก่อนหน้า `@Get()`/`@Post()`/... เดิม:

```typescript
// TODO: เปิด public ไว้ชั่วคราวเพื่อ bootstrap user แรกได้ก่อนมี token
// พอทำ RBAC (PermissionsGuard) เสร็จ ต้องเปลี่ยนเป็นจำกัดสิทธิ์เฉพาะ Staff/Admin เท่านั้น
@ApiOperation({ summary: 'สร้างสมาชิกใหม่ (ไม่ต้อง login)' })              /* <<< Swagger */
@Public()
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}

@ApiBearerAuth()                                                           /* <<< Swagger */
@ApiOperation({ summary: 'ดึงรายการสมาชิกทั้งหมด' })                        /* <<< Swagger */
@Get()
findAll() {
  return this.usersService.findAll();
}

@ApiBearerAuth()                                                           /* <<< Swagger */
@ApiOperation({ summary: 'ดึงสมาชิกทีละคนตาม id' })                         /* <<< Swagger */
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}

@ApiBearerAuth()                                                           /* <<< Swagger */
@ApiOperation({ summary: 'แก้ไขข้อมูลสมาชิก' })                             /* <<< Swagger */
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}

@ApiBearerAuth()                                                           /* <<< Swagger */
@ApiOperation({ summary: 'ลบสมาชิก' })                                      /* <<< Swagger */
@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

**บรรทัดที่มี `/* <<< Swagger */` ต่อท้าย คือบรรทัดที่ต้องเพิ่มเข้าไปใหม่** ส่วน `@Public()`, `@Post()`, `@Get()`, ตัว method เดิม ฯลฯ มีอยู่แล้วจาก `AUTH_GUIDE.md`/`USER_CRUD_METHODS_GUIDE.md` ไม่ต้องแก้

ต้องแก้ import ด้วย (เพิ่ม `ApiBearerAuth`):

```typescript
/* -------------------- Swagger: เพิ่ม ApiBearerAuth เข้าไปในบรรทัดเดิม -------------------- */
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
/* ------------------------------------------------------------------------------------------ */
```

**อธิบาย:**
- `@ApiOperation({ summary: '...' })` — ข้อความสั้นๆ อธิบายว่า endpoint นี้ทำอะไร แสดงต่อจากชื่อ method ในหน้า Swagger UI (คนอ่านไม่ต้องเดาจากชื่อ method อย่างเดียว)
- `@ApiBearerAuth()` — ใส่เฉพาะ 4 method ที่ **ไม่มี** `@Public()` (คือ `findAll`, `findOne`, `update`, `remove` — ต้อง login จริงตาม `JwtAuthGuard` ที่ทำใน `AUTH_GUIDE.md`) ทำให้ Swagger UI วาดรูปกุญแจ 🔒 ที่ endpoint นั้นและรู้ว่าต้องแนบ token ตอนกด "Try it out" — **decorator ของ Swagger ต้องตรงกับ logic จริงของ Guard เสมอ**: `create()` มี `@Public()` จึง**ไม่ใส่** `@ApiBearerAuth()` (ไม่งั้นจะโชว์กุญแจหลอกๆ ทั้งที่เรียกได้โดยไม่ต้อง login จริง) ส่วนอีก 4 method ไม่มี `@Public()` จึงต้องใส่คู่กันให้ตรงกับพฤติกรรมจริง

ทำแบบเดียวกันกับ `auth.controller.ts` (ไม่ต้องมี `@ApiBearerAuth()` เพราะ login ไม่ต้องมี token อยู่แล้ว):

```typescript
@ApiOperation({ summary: 'Login ด้วย email/password รับ JWT access_token กลับมา' })  /* <<< Swagger */
@Public()
@HttpCode(HttpStatus.OK)
@Post('login')
async login(@Body() loginDto: LoginDto) {
```

---

## 5. เพิ่ม `@ApiProperty` ให้ DTO (แสดงตัวอย่างข้อมูลในหน้า Swagger)

แก้ `src/users/dto/create-user.dto.ts`:

```typescript
import { IsEmail, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
/* -------------------- Swagger: เพิ่มบรรทัดนี้ -------------------- */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
/* ------------------------------------------------------------------ */

export class CreateUserDto {
  @ApiProperty({ example: 'student1@uniplay.test' })                       /* <<< Swagger */
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword123' })                               /* <<< Swagger */
  @IsString()
  password: string;

  @ApiProperty({ example: 'Somchai' })                                     /* <<< Swagger */
  @IsString()
  name: string;

  @ApiProperty({ example: 'a541ccca-c9e0-4825-adfb-f71e1de40676' })         /* <<< Swagger */
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ example: true })                                  /* <<< Swagger */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

**บรรทัดที่มี `/* <<< Swagger */` คือของใหม่** ส่วน `@IsEmail()`, `@IsString()`, `@IsUUID()`, `@IsOptional()`, `@IsBoolean()` และ import จาก `class-validator` มีอยู่แล้วจาก `NESTJS_BACKEND_GUIDE.md`

**อธิบาย:**
- `@ApiProperty({ example: ... })` — ใช้กับ field ที่**บังคับส่ง** (ไม่มี `@IsOptional()`) บอก Swagger ว่า field นี้มีตัวอย่างค่าเป็นอะไร (โชว์ preview ในหน้า "Try it out" ให้เลย ไม่ต้องพิมพ์เอง)
- `@ApiPropertyOptional({ example: ... })` — ใช้กับ field ที่**ไม่บังคับ** (มี `@IsOptional()` คู่กัน) ต่างจาก `@ApiProperty` แค่บอก Swagger ว่า field นี้จะไม่ส่งมาก็ได้ — **ต้องเลือกให้ตรงกับ `@IsOptional()`** ไม่งั้นเอกสารจะบอกผิดว่า field ไหนบังคับ field ไหนไม่บังคับ

แก้ `src/auth/dto/login.dto.ts` แบบเดียวกัน:

```typescript
import { IsEmail, IsString } from 'class-validator';
/* -------------------- Swagger: เพิ่มบรรทัดนี้ -------------------- */
import { ApiProperty } from '@nestjs/swagger';
/* ------------------------------------------------------------------ */

export class LoginDto {
  @ApiProperty({ example: 'student1@uniplay.test' })                       /* <<< Swagger */
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword123' })                               /* <<< Swagger */
  @IsString()
  password: string;
}
```

### 5.1 จุดพิเศษ: `update-user.dto.ts` ต้องเปลี่ยน `PartialType` มาจากแพ็กเกจไหน

ไฟล์เดิม (`src/users/dto/update-user.dto.ts`) น่าจะมี:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**ต้องเปลี่ยน import เป็น:**

```typescript
/* -------------------- Swagger: เปลี่ยนบรรทัดนี้ (ของเดิมมาจาก @nestjs/mapped-types) -------------------- */
import { PartialType } from '@nestjs/swagger';
/* ---------------------------------------------------------------------------------------------------------- */
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**ทำไมต้องเปลี่ยน:** `PartialType` จาก `@nestjs/mapped-types` ทำแค่ "เอา `class-validator` decorator เดิมมาทำให้เป็น optional" เท่านั้น **ไม่รู้จัก** `@ApiProperty` ของ Swagger เลย — ถ้าไม่เปลี่ยน `UpdateUserDto` จะโชว์ใน Swagger UI แบบไม่มีตัวอย่างข้อมูล/คำอธิบายอะไรเลย ทั้งที่ `CreateUserDto` มีครบ — `PartialType` จาก `@nestjs/swagger` ทำงานเหมือนกันทุกอย่าง **บวก**เอา Swagger metadata ติดมาด้วย ใช้แทนกันได้เลยไม่มีข้อเสีย (พอติดตั้ง `@nestjs/swagger` แล้ว ให้ใช้ตัวนี้แทนเสมอ)

---

## 6. รันและทดสอบ

```bash
npm run start:dev
```

### 6.1 เปิดหน้า Swagger UI

เปิดเบราว์เซอร์ไปที่ **`http://localhost:3000/api`**

ควรเห็น:
- หมวด **users** และ **auth** แยกกันชัดเจน (จาก `@ApiTags`)
- แต่ละ endpoint มีคำอธิบายสั้นๆ ต่อท้าย (จาก `@ApiOperation`)
- กดเข้าไปดู `POST /users` หรือ `POST /auth/login` จะเห็นตัวอย่างข้อมูลในช่อง Request Body เติมมาให้แล้ว (จาก `@ApiProperty`)
- `GET /users`, `GET /users/{id}`, `PATCH /users/{id}`, `DELETE /users/{id}` มีรูปกุญแจ 🔒 ต่อท้าย (จาก `@ApiBearerAuth()`) ส่วน `POST /users` และ `POST /auth/login` ไม่มีกุญแจ (เพราะมี `@Public()`)

### 6.2 ทดสอบยิง request ผ่านหน้า Swagger UI จริง (ไม่ต้องพึ่ง curl เลย)

1. ลองกด `GET /users` → **"Try it out"** → **"Execute"** **โดยยังไม่ Authorize** — ควรได้ **401 Unauthorized** (ตาม `JwtAuthGuard` ที่บล็อกไว้เพราะไม่มี token)
2. กด `POST /users` → **"Try it out"** → แก้ค่าตัวอย่างใน Request Body ให้เป็นข้อมูลจริง (ต้องมี `roleId` จริงจาก table `role`) → **"Execute"** — ควรได้ **201** (endpoint นี้มี `@Public()` จึงไม่ต้อง login)
3. กด `POST /auth/login` → **"Try it out"** → ใส่ email/password ที่เพิ่งสร้าง → **"Execute"** — ควรได้ **200** พร้อม `access_token`
4. กดปุ่ม **"Authorize"** (มุมขวาบนของหน้า Swagger UI จาก `.addBearerAuth()`) → วาง `access_token` ที่ได้ (ไม่ต้องพิมพ์คำว่า `Bearer` นำหน้า Swagger ใส่ให้อัตโนมัติ) → กด **"Authorize"** แล้ว **"Close"**
5. กลับไปกด `GET /users` → **"Try it out"** → **"Execute"** อีกครั้ง — ควรได้ **200** พร้อมรายการ user กลับมา (ครั้งนี้ Swagger แนบ token ให้อัตโนมัติทุก request ที่มีกุญแจ 🔒 จนกว่าจะกด "Logout" หรือรีเฟรชหน้า)

### 6.3 เช็คว่า JSON spec ก็ใช้งานได้ (เผื่อเอาไป import เครื่องมืออื่น เช่น Postman)

```bash
curl http://localhost:3000/api-json
```

ควรได้ JSON ก้อนใหญ่กลับมา ขึ้นต้นด้วย `{"openapi":"3.0.0",...}`

---

## 7. เช็คลิสต์ก่อนถือว่าทำเสร็จ

- [ ] เปิด `http://localhost:3000/api` แล้วเห็นหน้า Swagger UI จริง ไม่ error
- [ ] Endpoint แบ่งเป็นหมวด `users` และ `auth` ชัดเจน
- [ ] `GET /users`, `GET /users/{id}`, `PATCH /users/{id}`, `DELETE /users/{id}` มีรูปกุญแจ 🔒 (จาก `@ApiBearerAuth()`) ส่วน `POST /users` และ `POST /auth/login` ไม่มี
- [ ] กด `GET /users` โดยไม่ Authorize ก่อน ได้ `401` จริง
- [ ] กดปุ่ม "Authorize" ใส่ `access_token` แล้วยิง `GET /users` ได้ `200` จริง
- [ ] `update-user.dto.ts` เปลี่ยน import `PartialType` มาจาก `@nestjs/swagger` แล้ว (ไม่ใช่ `@nestjs/mapped-types`)
- [ ] `npm audit` ไม่มี vulnerability หลงเหลือหลังติดตั้ง

---

## 8. เชื่อมกับเอกสารอื่น

- **`NESTJS_BACKEND_GUIDE.md`** / **`USER_CRUD_METHODS_GUIDE.md`** — endpoint ที่เอกสารนี้เอามาใส่ `@ApiTags`/`@ApiOperation` คือตัวเดียวกับที่สร้างไว้ในคู่มือเหล่านั้น
- **`AUTH_GUIDE.md`** — คู่มือนี้สอนคู่กัน: `AUTH_GUIDE.md` ทำให้ `JwtAuthGuard` บล็อก 4 method (`findAll`/`findOne`/`update`/`remove`) จริง ส่วนคู่มือนี้ทำให้ **เอกสาร** (`.addBearerAuth()` + `@ApiBearerAuth()`) ตรงกับพฤติกรรมจริงนั้น
- **`plan.md` หัวข้อ 11 (Roadmap)** — พอทำ RBAC Module (`PermissionsGuard`) เสร็จในอนาคต ควรกลับมาเช็คว่า `@ApiOperation` ของแต่ละ endpoint ยังตรงกับสิทธิ์จริงอยู่ไหม (เช่น อาจต้องเพิ่มบอกว่า endpoint นี้ต้องเป็น Role ไหนถึงจะเรียกได้)
