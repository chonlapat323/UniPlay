# คู่มือเพิ่ม Swagger (API Documentation) แบบ Step-by-Step

เอกสารนี้สอนวิธีเพิ่ม **Swagger UI** (หน้าเว็บแสดง API ทั้งหมดของโปรเจค ทดสอบยิง request ได้จากหน้าเว็บเลย) เข้าไปใน NestJS — ทุกคำสั่ง/โค้ดในนี้ติดตั้งและทดสอบผ่านจริงแล้วใน `apps/api` ก่อนเขียนคู่มือ (เช็คเอกสารทางการ https://docs.nestjs.com/openapi ก่อนด้วย)

## โฟลเดอร์ไหนทำอะไร

| โฟลเดอร์ | สถานะ | ใช้ทำอะไร |
|---|---|---|
| **`apps/api`** | ติดตั้ง Swagger เสร็จแล้ว ทดสอบผ่านจริง | **เฉลย/ของจริงที่ใช้งาน** — เปิด `http://localhost:3000/api` ดูตัวอย่างได้เลย |
| **`ex/api`** | ยังไม่มี Swagger | **ที่ฝึกของนักเรียน** — ทำตามคู่มือนี้เพิ่มเข้าไปเอง |

---

## 0. Swagger คืออะไร ทำไมต้องมี

**Swagger (OpenAPI)** คือมาตรฐานการเขียน "เอกสาร API" แบบที่ทั้งคนอ่านและโปรแกรมอ่านได้ — พอติดตั้งเสร็จ จะได้หน้าเว็บ (`/api`) ที่แสดง:
- Endpoint ทั้งหมดที่มีในระบบ (`GET /users`, `POST /auth/login` ฯลฯ)
- แต่ละ endpoint รับ/ส่งข้อมูลรูปแบบไหน (ตรงกับ DTO ที่เขียนไว้)
- endpoint ไหนต้อง login (มีสัญลักษณ์กุญแจ 🔒) endpoint ไหนไม่ต้อง
- **ปุ่ม "Try it out"** ยิง request ทดสอบได้จากหน้าเว็บเลย ไม่ต้องเปิด Postman/curl แยก

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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('UniPlay API')
    .setDescription('เอกสาร API ของระบบจองสนามกีฬา UniPlay')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**อธิบายทีละส่วน:**

| โค้ด | ทำหน้าที่อะไร |
|---|---|
| `new DocumentBuilder()` | เริ่มสร้าง "ข้อมูลตั้งต้น" ของเอกสาร (ชื่อ, คำอธิบาย, เวอร์ชัน) |
| `.setTitle(...)` / `.setDescription(...)` / `.setVersion(...)` | ข้อความที่แสดงอยู่บนสุดของหน้า Swagger UI |
| `.addBearerAuth()` | บอกว่าโปรเจคนี้มี endpoint ที่ต้องใช้ JWT (`Authorization: Bearer <token>`) — ทำให้ Swagger UI มีปุ่ม **"Authorize"** ให้กรอก token ครั้งเดียวแล้วใช้ได้ทุก endpoint ที่ต้อง login |
| `.build()` | ปิดการตั้งค่า ได้ config object ออกมา |
| `SwaggerModule.createDocument(app, config)` | อ่านทุก Controller/DTO ในแอปจริง (ที่มี decorator ของ Swagger) มาประกอบเป็นเอกสาร OpenAPI |
| `SwaggerModule.setup('api', app, documentFactory)` | เปิดให้เข้าดูหน้าเว็บได้ที่ path `/api` (เช่น `http://localhost:3000/api`) — เปลี่ยน `'api'` เป็นชื่ออื่นได้ถ้าอยากได้ path อื่น |

> **ทำไมใช้ `documentFactory` (function) แทนที่จะเรียก `createDocument` ตรงๆ:** เอกสารทางการของ NestJS แนะนำให้ห่อด้วย function เพื่อให้ Swagger สร้างเอกสารหลังจากแอป initialize ครบถ้วนแล้วเท่านั้น (กัน route บางตัวหายไปจากเอกสารเพราะสร้างเร็วเกินไป)

---

## 3. เพิ่ม `@ApiTags` ให้ Controller (จัดกลุ่ม endpoint)

แก้ `src/users/users.controller.ts` — เพิ่ม import และ decorator บนสุดของ class:

```typescript
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
```

```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
```

ทำเหมือนกันกับ `src/auth/auth.controller.ts`:

```typescript
import { ApiTags, ApiOperation } from '@nestjs/swagger';
```

```typescript
@ApiTags('auth')
@Controller('auth')
export class AuthController {
```

**อธิบาย:** `@ApiTags('users')` ทำให้ endpoint ทั้งหมดใน controller นี้ถูกจัดกลุ่มไว้ด้วยกันในหน้า Swagger UI (เห็นเป็นหมวด "users" แยกจากหมวด "auth") — ถ้าไม่ใส่ endpoint ทั้งหมดจะไปกองรวมกันไม่มีหมวดหมู่

---

## 4. เพิ่ม `@ApiOperation` และ `@ApiBearerAuth` ให้แต่ละ method

แก้ทีละ method ใน `users.controller.ts` — ใส่ decorator ก่อนหน้า `@Get()`/`@Post()`/... เดิม:

```typescript
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
```

**อธิบาย:**
- `@ApiOperation({ summary: '...' })` — ข้อความสั้นๆ อธิบายว่า endpoint นี้ทำอะไร แสดงต่อจากชื่อ method ในหน้า Swagger UI (คนอ่านไม่ต้องเดาจากชื่อ method อย่างเดียว)
- `@ApiBearerAuth()` — ใส่เฉพาะ endpoint ที่**ต้อง login** (ตรงกับ endpoint ที่ไม่มี `@Public()`) — ทำให้เห็นสัญลักษณ์กุญแจ 🔒 ในหน้า Swagger UI และ endpoint นั้นจะถูกส่ง token ที่กรอกไว้ตอนกด "Authorize" ไปด้วยอัตโนมัติเวลากด "Try it out"
- **สังเกต:** endpoint `create()` ที่มี `@Public()` **ไม่ใส่** `@ApiBearerAuth()` เพราะไม่ต้อง login จริง — decorator ของ Swagger ควรตรงกับ logic จริงของ Guard เสมอ ไม่งั้นเอกสารจะโกหกคนอ่าน

ทำแบบเดียวกันกับ `auth.controller.ts` (ไม่ต้องมี `@ApiBearerAuth()` เพราะ login ไม่ต้องมี token อยู่แล้ว):

```typescript
@ApiOperation({ summary: 'Login ด้วย email/password รับ JWT access_token กลับมา' })
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'student1@uniplay.test' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Somchai' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'a541ccca-c9e0-4825-adfb-f71e1de40676' })
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

**อธิบาย:**
- `@ApiProperty({ example: ... })` — ใช้กับ field ที่**บังคับส่ง** (ไม่มี `@IsOptional()`) บอก Swagger ว่า field นี้มีตัวอย่างค่าเป็นอะไร (โชว์ preview ในหน้า "Try it out" ให้เลย ไม่ต้องพิมพ์เอง)
- `@ApiPropertyOptional({ example: ... })` — ใช้กับ field ที่**ไม่บังคับ** (มี `@IsOptional()` คู่กัน) ต่างจาก `@ApiProperty` แค่บอก Swagger ว่า field นี้จะไม่ส่งมาก็ได้ — **ต้องเลือกให้ตรงกับ `@IsOptional()`** ไม่งั้นเอกสารจะบอกผิดว่า field ไหนบังคับ field ไหนไม่บังคับ

แก้ `src/auth/dto/login.dto.ts` แบบเดียวกัน:

```typescript
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

### 5.1 จุดพิเศษ: `update-user.dto.ts` ต้องเปลี่ยน `PartialType` มาจากแพ็กเกจไหน

ไฟล์เดิม (`src/users/dto/update-user.dto.ts`) น่าจะมี:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**ต้องเปลี่ยน import เป็น:**

```typescript
import { PartialType } from '@nestjs/swagger';
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
- endpoint ที่ต้อง login มีสัญลักษณ์ 🔒 (จาก `@ApiBearerAuth`)
- กดเข้าไปดู `POST /users` หรือ `POST /auth/login` จะเห็นตัวอย่างข้อมูลในช่อง Request Body เติมมาให้แล้ว (จาก `@ApiProperty`)

### 6.2 ทดสอบ Login ผ่านหน้า Swagger UI จริง (ไม่ต้องพึ่ง curl เลย)

1. กด endpoint `POST /auth/login` → กด **"Try it out"** → กด **"Execute"** (ใช้ค่า example ที่เติมมาให้ หรือแก้เป็น email/password ที่มีจริงในระบบ)
2. Copy ค่า `access_token` จาก response ที่ได้กลับมา
3. เลื่อนขึ้นไปบนสุดของหน้า กดปุ่ม **"Authorize"** (มีรูปกุญแจ 🔓 มุมขวาบน)
4. วาง token ที่ copy มา (ไม่ต้องพิมพ์คำว่า `Bearer` นำหน้า Swagger ใส่ให้เอง) → กด **Authorize** → กด **Close**
5. ลองกด endpoint `GET /users` → **"Try it out"** → **"Execute"** — คราวนี้ควรได้ **200** พร้อมข้อมูล (เพราะแนบ token ที่ authorize ไว้ให้อัตโนมัติทุก request ที่ต้อง login)

### 6.3 เช็คว่า JSON spec ก็ใช้งานได้ (เผื่อเอาไป import เครื่องมืออื่น เช่น Postman)

```bash
curl http://localhost:3000/api-json
```

ควรได้ JSON ก้อนใหญ่กลับมา ขึ้นต้นด้วย `{"openapi":"3.0.0",...}`

---

## 7. เช็คลิสต์ก่อนถือว่าทำเสร็จ

- [ ] เปิด `http://localhost:3000/api` แล้วเห็นหน้า Swagger UI จริง ไม่ error
- [ ] Endpoint แบ่งเป็นหมวด `users` และ `auth` ชัดเจน
- [ ] Endpoint ที่ควรต้อง login (`GET/PATCH/DELETE /users`) มีสัญลักษณ์ 🔒 — ส่วน `POST /users` และ `POST /auth/login` **ไม่มี** 🔒 (ตรงกับ `@Public()`)
- [ ] ทดสอบ Login ผ่านปุ่ม "Authorize" ในหน้า Swagger ได้จริง แล้วยิง `GET /users` ผ่านหน้าเว็บได้ 200
- [ ] `update-user.dto.ts` เปลี่ยน import `PartialType` มาจาก `@nestjs/swagger` แล้ว (ไม่ใช่ `@nestjs/mapped-types`)
- [ ] `npm audit` ไม่มี vulnerability หลงเหลือหลังติดตั้ง

---

## 8. เชื่อมกับเอกสารอื่น

- **`NESTJS_BACKEND_GUIDE.md`** / **`USER_CRUD_METHODS_GUIDE.md`** — endpoint ที่เอกสารนี้เอามาใส่ `@ApiTags`/`@ApiOperation`/`@ApiBearerAuth` คือตัวเดียวกับที่สร้างไว้ในคู่มือเหล่านั้น
- **`AUTH_GUIDE.md`** — `.addBearerAuth()` ใน `main.ts` และปุ่ม "Authorize" ในหน้า Swagger UI คือของคู่กับระบบ JWT ที่ทำไว้ในคู่มือนี้
- **`plan.md` หัวข้อ 11 (Roadmap)** — พอทำ RBAC Module (`PermissionsGuard`) เสร็จในอนาคต ควรกลับมาเช็คว่า `@ApiOperation` ของแต่ละ endpoint ยังตรงกับสิทธิ์จริงอยู่ไหม (เช่น อาจต้องเพิ่มบอกว่า endpoint นี้ต้องเป็น Role ไหนถึงจะเรียกได้)
