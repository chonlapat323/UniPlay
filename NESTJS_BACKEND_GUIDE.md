# คู่มือสร้าง Backend ด้วย NestJS แบบ Step-by-Step

เอกสารนี้สอนสร้าง Backend ตัวแรกของ UniPlay ด้วย **NestJS** เชื่อมต่อกับ PostgreSQL ที่มีอยู่แล้ว (ดู `DATABASE_SETUP.md`) แล้วทำ **CRUD อย่างง่ายของ User** เป็นตัวอย่างแรก — ทุกคำสั่งในนี้รันจริงแล้วบนโปรเจค ไม่ใช่แค่ตัวอย่างสมมติ

> อ้างอิงจากเอกสารทางการ: https://docs.nestjs.com/first-steps และ https://docs.nestjs.com/recipes/prisma (เช็คก่อนเขียนคู่มือนี้)

---

## Prerequisites

- [ ] **Node.js** v20.19+ หรือ v22.12+ (เช็คด้วย `node --version`)
- [ ] **PostgreSQL รันอยู่** ผ่าน Docker ตาม `DATABASE_SETUP.md` (host `localhost`, port `5434`)
- [ ] **NestJS CLI** — ติดตั้งแบบ global (ขั้นที่ 1 ด้านล่าง)

---

## ขั้นที่ 1 — ติดตั้ง NestJS CLI

```bash
npm i -g @nestjs/cli
```

เช็คว่าติดตั้งสำเร็จ:
```bash
nest --version
```

---

## ขั้นที่ 2 — สร้างโปรเจค NestJS

สร้างไว้ที่ `apps/api` ตามโครงสร้างที่วางแผนไว้ใน `plan.md` หัวข้อ 8:

```bash
mkdir apps
cd apps
nest new api --skip-git -p npm
```

- `--skip-git` — ไม่ต้อง init git ใหม่ซ้อน (โปรเจคหลักมี git อยู่แล้ว)
- `-p npm` — ระบุใช้ npm เป็น package manager

รอสักครู่ CLI จะสร้างโครงสร้างไฟล์ + ติดตั้ง dependencies ให้อัตโนมัติ

### โครงสร้างไฟล์ที่ได้

```
apps/api/
├── src/
│   ├── app.controller.ts   # Controller ตัวอย่าง (route: GET /)
│   ├── app.module.ts        # Root module — ทุก module อื่นต้องมาลงทะเบียนที่นี่
│   ├── app.service.ts       # Service ตัวอย่าง
│   └── main.ts              # จุดเริ่มโปรแกรม (bootstrap)
├── test/
├── package.json
└── nest-cli.json
```

**ทดสอบรันดูก่อน:**
```bash
cd api
npm run start:dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000` ควรเห็นข้อความ `Hello World!`

---

## ขั้นที่ 3 — ติดตั้งและตั้งค่า Prisma

**สำคัญ: ระบุเวอร์ชันให้ชัดเจน อย่าใช้ `npm install prisma` เฉยๆ**

ตอนเขียนคู่มือนี้ พบว่า `npm install prisma` (ไม่ระบุเวอร์ชัน) จะได้ `8.0.0-rc.12` ซึ่งเป็น **Release Candidate** (ยังไม่เสถียร, CLI เปลี่ยนพฤติกรรมไปเยอะ) และดึง dependency ที่มีช่องโหว่ความปลอดภัยระดับ high (`deepmerge-ts` เวอร์ชันเก่าผ่าน `@prisma/config`) มาด้วย — ใช้เวอร์ชันเสถียรที่ตรวจสอบแล้วว่าไม่มีช่องโหว่แทน:

```bash
npm install prisma@6.12.0 --save-dev
npm install @prisma/client@6.12.0
npm install --save-dev dotenv
npx prisma init --datasource-provider postgresql
```

เช็คว่าไม่มีช่องโหว่หลงเหลือ:
```bash
npm audit
```
ควรขึ้น `found 0 vulnerabilities`

`npx prisma init` จะสร้างไฟล์ `prisma/schema.prisma`, `prisma.config.ts`, และ `.env` ให้อัตโนมัติ

### แก้ `prisma/schema.prisma` — ใช้ generator แบบคลาสสิก

เปิดไฟล์ `prisma/schema.prisma` แล้วแก้บล็อก `generator client` ให้เป็นแบบนี้ (ของที่ generate มาให้ default เป็น generator แบบใหม่ที่ output path แปลกและ import ยากกว่า):

```prisma
generator client {
  provider = "prisma-client-js"
}
```

### แก้ `.env` ให้ชี้ไปที่ database ที่มีอยู่แล้ว

```env
DATABASE_URL="postgresql://uniplay:uniplay_dev_password@localhost:5434/uniplay?schema=public"
```

(connection info ตรงกับ `DATABASE_SETUP.md` ที่ตั้งไว้ก่อนหน้า)

### แก้ `prisma.config.ts` — ตัดส่วนที่ยังไม่เสถียรออก

ไฟล์ที่ generate มาจะมี `env("DATABASE_URL")` ที่ error ในเวอร์ชันนี้ (bug ของ Prisma CLI ตัวนี้เอง) แก้เป็นแบบง่ายๆ นี้แทน:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
```

### กันไม่ให้ `prisma.config.ts` ไปปนกับตอน build แอปจริง

`prisma.config.ts` เป็นไฟล์ที่ Prisma CLI ใช้เองเท่านั้น ไม่เกี่ยวกับตัวแอป NestJS แต่ TypeScript compiler ของ Nest จะพยายาม compile ไฟล์นี้ด้วยและ error เพราะ type ไม่ตรงกัน (`earlyAccess` field) — เปิด `tsconfig.build.json` แล้วเพิ่ม `"prisma.config.ts"` เข้าไปใน `exclude`:

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts", "prisma.config.ts"]
}
```

### ดึงโครงสร้างตารางที่มีอยู่แล้วเข้ามา (แทนที่จะพิมพ์ schema เอง)

เพราะเรามีตาราง `role`, `menu`, `role_permission`, `user`, `facility`, `booking` อยู่ใน database แล้ว (จาก `schema-draft.sql`) ใช้คำสั่งนี้ดึงมาเป็น Prisma schema อัตโนมัติ:

```bash
npx prisma db pull
```

**ข้อควรรู้:** เพราะตารางจริงตั้งชื่อคอลัมน์แบบ `snake_case` (เช่น `role_id`, `is_active`) ผลลัพธ์ที่ดึงมาจะได้ field ชื่อ `snake_case` แบบนั้นเป๊ะๆ (ไม่ใช่ `roleId`, `isActive` แบบที่นิยมเขียนใน TypeScript) และชื่อ model จะเป็นตัวพิมพ์เล็กทั้งหมด (`user` ไม่ใช่ `User`) — ต้องแก้ให้เป็น camelCase/PascalCase เองโดยใช้ `@map`/`@@map` ครอบ (ไม่กระทบตาราง SQL จริงเลย แค่เปลี่ยนวิธีที่ Prisma มองเห็นชื่อ) ตัวอย่างเช่น:

```prisma
model User {
  id       String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email    String  @unique @db.VarChar(255)
  roleId   String  @map("role_id") @db.Uuid
  isActive Boolean @default(true) @map("is_active")
  role     Role    @relation(fields: [roleId], references: [id])

  @@map("user")
}
```

> ทำแบบนี้ครบทั้ง 6 ตาราง (`Role`, `Menu`, `RolePermission`, `User`, `Facility`, `Booking`) — ดูตัวอย่างเต็มได้ในไฟล์ `apps/api/prisma/schema.prisma` ของโปรเจคจริง (ทำให้แล้ว)

เช็คว่า schema ยัง valid อยู่หลังแก้:
```bash
npx prisma validate
```

แล้ว generate Prisma Client:
```bash
npx prisma generate
```

---

## ขั้นที่ 4 — สร้าง PrismaService (ตัวกลางเชื่อม NestJS กับ Prisma)

```bash
nest g module prisma
nest g service prisma --no-spec
```

แก้ไฟล์ `src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

แก้ไฟล์ `src/prisma/prisma.module.ts` ให้ export `PrismaService` เพื่อให้ module อื่นเรียกใช้ได้:

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## ขั้นที่ 5 — Generate User Resource (CRUD ครบชุดด้วยคำสั่งเดียว)

```bash
nest g resource users
```

CLI จะถามคำถาม 2 ข้อ:
1. **"What transport layer do you use?"** → เลือก **REST API**
2. **"Would you like to generate CRUD entry points?"** → เลือก **Yes**

ได้ไฟล์มาครบชุด:
```
src/users/
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── entities/
│   └── user.entity.ts
├── users.controller.ts   # มี route GET/POST/PATCH/DELETE ให้ครบแล้ว (แค่ยังไม่ได้ต่อ DB จริง)
├── users.service.ts       # มี method ครบแต่เป็น placeholder
└── users.module.ts
```

---

## ขั้นที่ 6 — เขียน DTO ให้ตรงกับตาราง `user` จริง

**ติดตั้ง package สำหรับ validate DTO ก่อน** (`nest g resource` ไม่ได้ลงให้อัตโนมัติ):

```bash
npm install class-validator class-transformer
```

แก้ `src/users/dto/create-user.dto.ts`:

```typescript
import { IsEmail, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsUUID()
  roleId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

แก้ `src/users/dto/update-user.dto.ts` (ใช้ `PartialType` ให้ทุก field เป็น optional):

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

> **หมายเหตุ:** ตัวอย่างนี้เก็บ `password` เป็น plain text เพื่อความง่ายตอนสอน — **ห้ามทำแบบนี้ใน production จริง** ต้อง hash ด้วย `bcrypt` ก่อนบันทึกเสมอ (จะทำในขั้นตอน Auth Module ตาม Roadmap ใน `plan.md` หัวข้อ 11)

---

## ขั้นที่ 7 — เขียน Service ให้ต่อกับ Prisma จริง

แก้ `src/users/users.module.ts` ให้ import `PrismaModule`:

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

แก้ `src/users/users.service.ts` ทั้งไฟล์:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // ให้ error 404 ถ้าไม่เจอ ก่อนจะ update
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
```

แก้ `src/users/users.controller.ts` ให้พารามิเตอร์ `id` เป็น `string` (ของเดิม generate มาเป็น `number` โดย default ซึ่งไม่ตรงกับ `id` แบบ UUID ของเรา):

```typescript
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

---

## ขั้นที่ 8 — ลงทะเบียน Module ให้ครบ

แก้ `src/users/users.module.ts` ให้ import `PrismaModule` เข้ามาด้วย (ไม่งั้น `UsersService` จะ inject `PrismaService` ไม่ได้ — แต่ละ module ต้อง import provider ที่ต้องใช้เอง ไม่ได้ใช้ร่วมกันอัตโนมัติแค่เพราะอยู่ใน `AppModule` เดียวกัน):

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

แก้ `src/app.module.ts` ให้ import ทั้ง `PrismaModule` และ `UsersModule`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## ขั้นที่ 9 — เปิด Validation + โหลด `.env` ใน `main.ts`

แก้ `src/main.ts` ให้เป็นแบบนี้ (ของเดิม generate มาไม่มี 2 บรรทัดสำคัญ):

```typescript
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- `import 'dotenv/config'` — โหลดค่าจาก `.env` เข้า `process.env` (NestJS ไม่โหลดให้อัตโนมัติ ต่างจาก Prisma CLI ที่โหลดเองผ่าน `prisma.config.ts`)
- `ValidationPipe({ whitelist: true, transform: true })` — เปิดให้ decorator ใน DTO (`@IsEmail`, `@IsUUID` ฯลฯ) ทำงานจริง ถ้าไม่ใส่บรรทัดนี้ NestJS จะไม่ validate อะไรเลยแม้จะเขียน DTO ไว้ครบ

---

## ขั้นที่ 10 — รันและทดสอบ

```bash
npm run start:dev
```

### ทดสอบด้วย curl (เปิด terminal อีกอันคู่กับที่รัน server อยู่)

**1. หา roleId ที่มีอยู่จริงก่อน** (ต้องมี roleId ที่ valid ถึงจะสร้าง user ได้ เพราะเป็น FK บังคับ):
```bash
docker exec -i uniplay-postgres psql -U uniplay -d uniplay -c "SELECT id, name FROM role;"
```

**2. สร้าง User ใหม่ (POST):**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@uniplay.test","password":"123456","name":"Somchai","roleId":"<วาง roleId ของ STUDENT ที่ได้จากขั้นตอนก่อนหน้า>"}'
```

**3. ดึงรายการ User ทั้งหมด (GET):**
```bash
curl http://localhost:3000/users
```

**4. ดึง User ทีละคน (GET by id):**
```bash
curl http://localhost:3000/users/<id ที่ได้จากขั้นตอน 2>
```

**5. แก้ไข User (PATCH):**
```bash
curl -X PATCH http://localhost:3000/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Somchai Updated"}'
```

**6. ลบ User (DELETE):**
```bash
curl -X DELETE http://localhost:3000/users/<id>
```

**7. ทดสอบว่า Validation ทำงานจริง (ควรได้ 400):**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"bad-email-no-at-sign","password":"123"}'
```
ควรได้ผลลัพธ์ประมาณนี้ (บอกชัดว่า field ไหนผิดกฎอะไร):
```json
{"message":["email must be an email","name must be a string","roleId must be a UUID"],"error":"Bad Request","statusCode":400}
```

**8. ทดสอบว่า id ที่ไม่มีอยู่จริงตอบ 404 ถูกต้อง:**
```bash
curl http://localhost:3000/users/00000000-0000-0000-0000-000000000000
```
ควรได้:
```json
{"message":"User 00000000-0000-0000-0000-000000000000 not found","error":"Not Found","statusCode":404}
```

---

## สรุป Endpoint ที่ได้

| Method | Path | ทำอะไร |
|---|---|---|
| `POST` | `/users` | สร้าง User ใหม่ |
| `GET` | `/users` | ดึงรายการ User ทั้งหมด |
| `GET` | `/users/:id` | ดึง User ทีละคนตาม id |
| `PATCH` | `/users/:id` | แก้ไขข้อมูล User |
| `DELETE` | `/users/:id` | ลบ User |

---

## ขั้นตอนต่อไป (ไม่รวมในคู่มือนี้)

ตาม Roadmap ใน `plan.md` หัวข้อ 11 หลังจากนี้คือ:
- **RBAC Module** — `PermissionsGuard` เช็คสิทธิ์จาก `RolePermission`
- **Auth Module** — JWT login, hash password ด้วย `bcrypt` จริง (ตอนนี้ยังเป็น plain text อยู่ ใช้แค่ฝึก CRUD เบื้องต้น)
- **Facility / Booking Module** — ตามลำดับ
