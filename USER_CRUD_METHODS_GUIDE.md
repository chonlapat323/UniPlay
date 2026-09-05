# คู่มือสอนสร้าง Method อื่นๆ (Get / Update / Delete) แบบ Step-by-Step

เอกสารนี้สอนวิธีเพิ่ม method **Get (ทั้งหมด/ทีละคน)**, **Update**, และ **Delete** เข้าไปใน `src/users/` ที่ **มีแค่ `create()` (Add) อยู่แล้ว** — ทุกโค้ดในนี้ทดสอบผ่านจริงแล้วบนโปรเจคก่อนเขียนคู่มือ (implement จริง รัน curl ทดสอบครบทุก method แล้วค่อยถอดออกมาเป็นขั้นตอนสอน)

## โฟลเดอร์ไหนทำอะไร (สำคัญ อ่านก่อนเริ่ม)

| โฟลเดอร์ | สถานะ | ใช้ทำอะไร |
|---|---|---|
| **`apps/api`** | มี method ครบ (Create/Get/Update/Delete + Auth) ใช้งานได้จริง | **เฉลย/ของจริงที่ใช้งาน** — ห้ามลบ method ออกจากตรงนี้ |
| **`ex/api`** | เหลือแค่ `create()` เท่านั้น | **ที่ฝึกของนักเรียน** — ให้ตามคู่มือนี้เพิ่ม Get/Update/Delete เข้าไปเอง |

**ทำตามคู่มือนี้ในโฟลเดอร์ `ex/api` เท่านั้น** (ไม่ใช่ `apps/api`) — ก่อนเริ่มต้องรัน `cd ex/api && npm install` ก่อน (ไม่ได้ copy `node_modules` มาด้วยตอน copy โฟลเดอร์) เสร็จแล้วเทียบผลลัพธ์/โค้ดกับ `apps/api` ได้เลยว่าตรงกันไหม เพราะเป็นคำตอบชุดเดียวกัน

---

## 0. สถานะปัจจุบันของ `src/users/` (จุดเริ่มต้น)

```
src/users/
├── dto/
│   ├── create-user.dto.ts     # มีอยู่แล้ว — ใช้กับ Create
│   └── update-user.dto.ts     # มีอยู่แล้ว — เตรียมไว้ให้ Update ใช้ (ยังไม่ได้ import ไปใช้จริง)
├── entities/
│   └── user.entity.ts
├── users.controller.ts        # ตอนนี้มีแค่ POST /users
├── users.module.ts
└── users.service.ts           # ตอนนี้มีแค่ create()
```

**`users.service.ts` ปัจจุบัน:**
```typescript
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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
}
```

**`users.controller.ts` ปัจจุบัน:**
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: เปิด public ไว้ชั่วคราวเพื่อ bootstrap user แรกได้ก่อนมี token
  // พอทำ RBAC (PermissionsGuard) เสร็จ ต้องเปลี่ยนเป็นจำกัดสิทธิ์เฉพาะ Staff/Admin เท่านั้น
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

> สังเกต: `POST /users` เปิด `@Public()` ไว้ (ไม่ต้อง login ก็เรียกได้) เพื่อ bootstrap user แรกได้ — ส่วน method ที่จะเพิ่มในคู่มือนี้ (Get/Update/Delete) **ไม่ใส่ `@Public()`** เพราะควรต้อง login ก่อนถึงจะเห็น/แก้ไข/ลบข้อมูล User ได้ (ใช้ `POST /auth/login` ที่ทำไว้แล้วใน `AUTH_GUIDE.md` เพื่อขอ token มาก่อน)

---

## 1. เพิ่ม GET ทั้งหมด (`findAll`) และ GET ทีละคน (`findOne`)

### 1.1 แก้ `users.service.ts` — เพิ่ม 2 method

เพิ่ม `NotFoundException` เข้า import เดิม แล้วเพิ่ม method 2 ตัวต่อท้าย `create()`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
// ... import เดิมที่เหลือไม่ต้องแก้
```

**`NotFoundException` คืออะไร:** เป็น class สำเร็จรูปที่ NestJS เตรียมไว้ให้ (import มาจาก `@nestjs/common` เหมือน `Injectable`) — พอเรา `throw` มันออกไปตรงไหนใน service, NestJS จะ**จับ error นี้ให้อัตโนมัติ** แล้วแปลงเป็น HTTP response สถานะ **404 Not Found** พร้อมข้อความที่เราใส่ไว้กลับไปหาผู้เรียก โดยที่เราไม่ต้องเขียนโค้ดเช็ค/set status code เองเลยสักบรรทัด — นี่คือเหตุผลที่ต้อง import เพิ่ม เพราะจะเอาไปใช้ใน `findOne()` ด้านล่าง (บรรทัด `if (!user) throw new NotFoundException(...)`) — ไม่ใช่ import ไว้เฉยๆ ไม่มีเหตุผล

```typescript
async findAll() {
  const users = await this.prisma.user.findMany();
  return users.map((user) => this.stripPassword(user));
}

async findOne(id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException(`User ${id} not found`);
  return this.stripPassword(user);
}
```

**อธิบาย:**
- `findAll()` ใช้ `prisma.user.findMany()` — ดึงทุกแถวในตาราง `user` แล้ว `.map()` ตัด `password` ออกทุกคนก่อน return (ใช้ `stripPassword` ที่มีอยู่แล้ว)
- `findOne(id)` ใช้ `prisma.user.findUnique({ where: { id } })` — ถ้าไม่เจอ (`null`) throw `NotFoundException` ทันที ให้ NestJS แปลงเป็น HTTP 404 อัตโนมัติ

### 1.2 แก้ `users.controller.ts` — เพิ่ม route

เพิ่ม `Get`, `Param` เข้า import จาก `@nestjs/common` แล้วเพิ่ม 2 method ต่อท้าย `create()`:

```typescript
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
```

```typescript
@Get()
findAll() {
  return this.usersService.findAll();
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

**อธิบาย:**
- `@Get()` (ไม่มี path) → `GET /users`
- `@Get(':id')` → `GET /users/:id` — `:id` เป็น **route parameter** ดึงค่าออกมาด้วย `@Param('id')`
- **ลำดับสำคัญ:** ต้องประกาศ `@Get()` (ไม่มี param) ไว้ก่อน `@Get(':id')` เสมอ ถ้าสลับกัน NestJS จะจับ path แปลกๆ ผิดพลาดได้ (เช่น เผลอตีความ `/users/abc` เป็นพยายามหา id ชื่อ `abc` ทั้งที่ตั้งใจจะให้ตรงกับ route อื่น)

### 1.3 ทดสอบ (ต้อง login ก่อน เพราะไม่ได้ใส่ `@Public()`)

```bash
# 1. สร้าง user ไว้ทดสอบ (endpoint นี้ public อยู่แล้ว)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uniplay.test","password":"mypassword123","name":"Test User","roleId":"<roleId จริงจาก SELECT id FROM role>"}'

# 2. Login เอา token มาก่อน
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uniplay.test","password":"mypassword123"}'
# ได้ { "access_token": "eyJ..." } กลับมา เอาไปแปะแทน <TOKEN> ด้านล่าง

# 3. GET ทั้งหมด
curl http://localhost:3000/users -H "Authorization: Bearer <TOKEN>"

# 4. GET ทีละคน
curl http://localhost:3000/users/<id> -H "Authorization: Bearer <TOKEN>"

# 5. ลองไม่แนบ token ดู (ต้องได้ 401)
curl http://localhost:3000/users
```

**ผลจริงที่ทดสอบผ่านแล้ว** (ตัวอย่างนี้มาจากการทดสอบจริงคนละรอบ ใช้ user คนละคนกับที่สั่งสร้างไว้ในขั้นตอนที่ 1 — ดูแค่**โครงสร้าง**ของ response ว่าหน้าตาเป็นแบบนี้ ส่วน email/name จริงในเครื่องคุณจะเป็นของ `test@uniplay.test`/`Test User` ตามที่สร้างไว้):
```json
// GET /users (มี token)
[{"id":"...","email":"student1@uniplay.test","name":"Somchai","roleId":"...","isActive":true,"createdAt":"...","updatedAt":"..."}]
// HTTP 200

// GET /users (ไม่มี token)
{"message":"No token provided","error":"Unauthorized","statusCode":401}
// HTTP 401
```

---

## 2. เพิ่ม UPDATE (`update`)

### 2.1 แก้ `users.service.ts` — เพิ่ม import + method

```typescript
import { UpdateUserDto } from './dto/update-user.dto';
```

```typescript
async update(id: string, updateUserDto: UpdateUserDto) {
  await this.findOne(id); // ให้ throw 404 ถ้าไม่เจอ ก่อนจะพยายาม update
  const data = { ...updateUserDto };
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  const user = await this.prisma.user.update({ where: { id }, data });
  return this.stripPassword(user);
}
```

**อธิบาย:**
- เรียก `this.findOne(id)` ก่อนเสมอ — เพื่อให้ error 404 ชัดเจนถ้า id ไม่มีจริง (ไม่งั้น Prisma จะโยน error แบบอื่นที่ข้อความไม่เป็นมิตรเท่า)
- **จุดสำคัญ:** ถ้า DTO มี `password` ส่งมาด้วย (คนอยากเปลี่ยนรหัสผ่าน) ต้อง `bcrypt.hash()` ใหม่ก่อนเสมอ — **ห้ามปล่อยให้ password ใหม่ที่ยังไม่ hash หลุดไปบันทึกตรงๆ** เป็นจุดที่ลืมกันบ่อยตอนเขียน Update
- `UpdateUserDto` (จาก `PartialType(CreateUserDto)`) ทำให้ทุก field เป็น optional หมด — ส่งมาแค่ field ที่อยากแก้ก็พอ ไม่ต้องส่งครบทุก field เหมือน Create

### 2.2 แก้ `users.controller.ts` — เพิ่ม import + route

```typescript
import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
```

```typescript
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

**อธิบาย:** ใช้ `@Patch` ไม่ใช่ `@Put` — เพราะ **PATCH** หมายถึง "แก้บาง field" (ส่งมาแค่ที่อยากเปลี่ยน) ส่วน **PUT** หมายถึง "แทนที่ข้อมูลทั้งอันใหม่ทั้งหมด" (ต้องส่งครบทุก field) — โปรเจคนี้เลือก PATCH เพราะ `UpdateUserDto` ออกแบบให้ทุก field optional อยู่แล้ว ตรงกับความหมายของ PATCH

### 2.3 ทดสอบ

```bash
curl -X PATCH http://localhost:3000/users/<id> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"ชื่อใหม่"}'
```

**ผลจริงที่ทดสอบผ่านแล้ว:**
```json
{"id":"...","email":"crudguide@uniplay.test","name":"CRUD Guide Test Updated","roleId":"...","isActive":true,"createdAt":"...","updatedAt":"..."}
```
HTTP 200 — สังเกตว่าส่งมาแค่ `name` แต่ field อื่น (`email`, `roleId` ฯลฯ) ยังอยู่ครบเหมือนเดิม เพราะ PATCH แก้เฉพาะที่ระบุมาเท่านั้น

---

## 3. เพิ่ม DELETE (`remove`)

### 3.1 แก้ `users.service.ts` — เพิ่ม method

```typescript
async remove(id: string) {
  await this.findOne(id); // ให้ throw 404 ถ้าไม่เจอ ก่อนจะพยายามลบ
  const user = await this.prisma.user.delete({ where: { id } });
  return this.stripPassword(user);
}
```

**อธิบาย:** เช็ค `findOne(id)` ก่อนเหมือน Update — ถ้า id ไม่มีอยู่แล้ว จะได้ 404 ที่เข้าใจง่าย แทนที่จะปล่อยให้ Prisma throw error เรื่อง "record to delete does not exist" ที่ debug ยากกว่า

### 3.2 แก้ `users.controller.ts` — เพิ่ม import + route

```typescript
import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
```

```typescript
@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

### 3.3 ทดสอบ

```bash
# ลบ
curl -X DELETE http://localhost:3000/users/<id> -H "Authorization: Bearer <TOKEN>"

# เช็คว่าลบจริง (ต้องได้ 404)
curl http://localhost:3000/users/<id> -H "Authorization: Bearer <TOKEN>"
```

**ผลจริงที่ทดสอบผ่านแล้ว:**
```json
// DELETE /users/:id
{"id":"...","email":"crudguide@uniplay.test","name":"CRUD Guide Test Updated","roleId":"...","isActive":true,"createdAt":"...","updatedAt":"..."}
// HTTP 200 (Prisma delete คืนค่าแถวที่เพิ่งลบกลับมาให้)

// GET /users/:id (หลังลบ)
{"message":"User ... not found","error":"Not Found","statusCode":404}
// HTTP 404
```

---

## 4. ไฟล์เต็มหลังทำครบทั้ง 3 ข้อ (สำหรับเทียบว่าโค้ดที่เขียนตรงกันไหม)

**`users.service.ts`:**
```typescript
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
    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
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

**`users.controller.ts`:**
```typescript
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: เปิด public ไว้ชั่วคราวเพื่อ bootstrap user แรกได้ก่อนมี token
  // พอทำ RBAC (PermissionsGuard) เสร็จ ต้องเปลี่ยนเป็นจำกัดสิทธิ์เฉพาะ Staff/Admin เท่านั้น
  @Public()
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

## 5. เช็คลิสต์ก่อนถือว่าทำเสร็จ

- [ ] `GET /users` และ `GET /users/:id` ต้อง login (มี token) ถึงจะเรียกได้ — ไม่มี token ต้องได้ 401
- [ ] `GET /users/:id` ด้วย id ที่ไม่มีจริง ต้องได้ 404 พร้อมข้อความชัดเจน
- [ ] `PATCH /users/:id` ถ้าส่ง `password` มาด้วย ต้องถูก hash ใหม่ก่อนบันทึกเสมอ (ห้ามเก็บ plain text)
- [ ] `DELETE /users/:id` กับ id ที่ไม่มีจริง ต้องได้ 404 ไม่ใช่ error แปลกๆ จาก Prisma ตรงๆ
- [ ] Response ของทุก method **ต้องไม่มี field `password`** หลุดออกมา (เช็คทั้ง 4 method ที่เพิ่มเข้ามาใหม่)
- [ ] ลองรัน `npm run start:dev` แล้วดู log ว่า route ทั้ง 4 ตัวขึ้นครบ (`Mapped {/users, GET}`, `Mapped {/users/:id, GET}`, `Mapped {/users/:id, PATCH}`, `Mapped {/users/:id, DELETE}`)

---

## 6. เชื่อมกับเอกสารอื่น

- **`NESTJS_BACKEND_GUIDE.md`** — คู่มือตั้งโปรเจคตั้งแต่ต้น (มีแค่ Create ตอนจบคู่มือ ก่อนตัด method อื่นออกเพื่อทำคู่มือนี้)
- **`AUTH_GUIDE.md`** — คู่มือระบบ Login/JWT ที่ทำให้ `GET`/`PATCH`/`DELETE` ในคู่มือนี้ต้อง login ก่อนถึงจะเรียกได้
- **`plan.md` หัวข้อ 11 (Roadmap)** — ขั้นตอนถัดไปหลังทำคู่มือนี้เสร็จคือ RBAC Module (`PermissionsGuard`) จำกัดสิทธิ์ว่า Role ไหนทำอะไรได้บ้าง (ตอนนี้ login แล้วเรียกได้หมดทุก method ไม่ว่า Role อะไร)
