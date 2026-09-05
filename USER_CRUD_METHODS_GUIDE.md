# คู่มือสอนสร้าง Method อื่นๆ (Get / Update / Delete) แบบ Step-by-Step

เอกสารนี้สอนวิธีเพิ่ม method **Get (ทั้งหมด/ทีละคน)**, **Update**, และ **Delete** เข้าไปใน `src/users/` ที่ **มีแค่ `create()` (Add) อยู่แล้ว** — ทุกโค้ดในนี้ทดสอบผ่านจริงแล้วบนโปรเจคก่อนเขียนคู่มือ (implement จริง รัน curl ทดสอบครบทุก method แล้วค่อยถอดออกมาเป็นขั้นตอนสอน)

## โฟลเดอร์ไหนทำอะไร (สำคัญ อ่านก่อนเริ่ม)

| โฟลเดอร์ | สถานะ | ใช้ทำอะไร |
|---|---|---|
| **`apps/api`** | มี method ครบ (Create/Get/Update/Delete) ใช้งานได้จริง | **เฉลย/ของจริงที่ใช้งาน** — ห้ามลบ method ออกจากตรงนี้ |
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

> **เรื่อง Login/`@Public()`:** ในคู่มือนี้ทุก method (Get/Update/Delete ที่กำลังจะเพิ่ม) ให้ใส่ `@Public()` เหมือน `create()` ไปก่อน — คือ**ยังไม่ต้อง login ก็เรียกได้ทุก endpoint** เพราะยังไม่ได้เรียนเรื่อง Login/JWT (อยู่ใน `AUTH_GUIDE.md` ซึ่งเป็นบทเรียนถัดไป) พอเรียนเรื่อง Login แล้วค่อยกลับมาเอา `@Public()` ออกจาก Get/Update/Delete ทีหลัง (เก็บไว้แค่ `create()` เท่านั้นที่ควร public ต่อไป เพื่อ bootstrap user แรกได้)

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
@Public()
@Get()
findAll() {
  return this.usersService.findAll();
}

@Public()
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

**อธิบาย:**
- `@Get()` (ไม่มี path) → `GET /users`
- `@Get(':id')` → `GET /users/:id` — `:id` เป็น **route parameter** ดึงค่าออกมาด้วย `@Param('id')`
- `@Public()` — ใส่ไว้เพราะยังไม่ได้เรียนเรื่อง Login/JWT (ดู note ท้ายหัวข้อ 0 ด้านบน) ทำให้เรียก endpoint นี้ได้เลยไม่ต้องมี token
- **ลำดับสำคัญ:** ต้องประกาศ `@Get()` (ไม่มี param) ไว้ก่อน `@Get(':id')` เสมอ ถ้าสลับกัน NestJS จะจับ path แปลกๆ ผิดพลาดได้ (เช่น เผลอตีความ `/users/abc` เป็นพยายามหา id ชื่อ `abc` ทั้งที่ตั้งใจจะให้ตรงกับ route อื่น)

### 1.3 ทดสอบ (ไม่ต้อง login — ยังไม่ได้เรียนเรื่องนี้)

```bash
# 1. สร้าง user ไว้ทดสอบ
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uniplay.test","password":"mypassword123","name":"Test User","roleId":"<roleId จริงจาก SELECT id FROM role>"}'

# 2. GET ทั้งหมด
curl http://localhost:3000/users

# 3. GET ทีละคน (เอา id จาก response ตอนขั้นที่ 1 มาแทน <id>)
curl http://localhost:3000/users/<id>
```

**ผลจริงที่ทดสอบผ่านแล้ว** (ตัวอย่างนี้มาจากการทดสอบจริงคนละรอบ ใช้ user คนละคนกับที่สั่งสร้างไว้ในขั้นตอนที่ 1 — ดูแค่**โครงสร้าง**ของ response ว่าหน้าตาเป็นแบบนี้ ส่วน email/name จริงในเครื่องคุณจะเป็นของ `test@uniplay.test`/`Test User` ตามที่สร้างไว้):
```json
// GET /users
[{"id":"...","email":"student1@uniplay.test","name":"Somchai","roleId":"...","isActive":true,"createdAt":"...","updatedAt":"..."}]
// HTTP 200
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
@Public()
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

**อธิบาย:** ใส่ `@Public()` ด้วยเหตุผลเดียวกับหัวข้อ 1 (ยังไม่ได้เรียน Login) ส่วนเรื่อง method ใช้ `@Patch` ไม่ใช่ `@Put` — เพราะ **PATCH** หมายถึง "แก้บาง field" (ส่งมาแค่ที่อยากเปลี่ยน) ส่วน **PUT** หมายถึง "แทนที่ข้อมูลทั้งอันใหม่ทั้งหมด" (ต้องส่งครบทุก field) — โปรเจคนี้เลือก PATCH เพราะ `UpdateUserDto` ออกแบบให้ทุก field optional อยู่แล้ว ตรงกับความหมายของ PATCH

### 2.3 ทดสอบ

```bash
curl -X PATCH http://localhost:3000/users/<id> \
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
@Public()
@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

### 3.3 ทดสอบ

```bash
# ลบ
curl -X DELETE http://localhost:3000/users/<id>

# เช็คว่าลบจริง (ต้องได้ 404)
curl http://localhost:3000/users/<id>
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

  // TODO: เปิด public ไว้ชั่วคราวทุก method (ยังไม่ได้สอนเรื่อง Login/JWT)
  // พอถึงบทเรียน AUTH_GUIDE.md ต้องเอา @Public() ออกจาก findAll/findOne/update/remove
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

---

## 5. เช็คลิสต์ก่อนถือว่าทำเสร็จ

- [ ] `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id` เรียกได้เลยโดยไม่ต้องแนบ token (ใส่ `@Public()` ไว้ครบทุกตัว)
- [ ] `GET /users/:id` ด้วย id ที่ไม่มีจริง ต้องได้ 404 พร้อมข้อความชัดเจน
- [ ] `PATCH /users/:id` ถ้าส่ง `password` มาด้วย ต้องถูก hash ใหม่ก่อนบันทึกเสมอ (ห้ามเก็บ plain text)
- [ ] `DELETE /users/:id` กับ id ที่ไม่มีจริง ต้องได้ 404 ไม่ใช่ error แปลกๆ จาก Prisma ตรงๆ
- [ ] Response ของทุก method **ต้องไม่มี field `password`** หลุดออกมา (เช็คทั้ง 4 method ที่เพิ่มเข้ามาใหม่)
- [ ] ลองรัน `npm run start:dev` แล้วดู log ว่า route ทั้ง 4 ตัวขึ้นครบ (`Mapped {/users, GET}`, `Mapped {/users/:id, GET}`, `Mapped {/users/:id, PATCH}`, `Mapped {/users/:id, DELETE}`)

---

## 6. เชื่อมกับเอกสารอื่น

- **`NESTJS_BACKEND_GUIDE.md`** — คู่มือตั้งโปรเจคตั้งแต่ต้น (มีแค่ Create ตอนจบคู่มือ ก่อนตัด method อื่นออกเพื่อทำคู่มือนี้)
- **`AUTH_GUIDE.md`** — คู่มือระบบ Login/JWT (บทเรียนถัดไป — ยังไม่ได้สอนตอนทำคู่มือนี้ จึงใส่ `@Public()` ไว้ทุก method ไปก่อน) พอเรียนจบบทนี้ค่อยกลับมาเอา `@Public()` ออกจาก Get/Update/Delete
- **`plan.md` หัวข้อ 11 (Roadmap)** — ขั้นตอนถัดไปหลังทำคู่มือนี้เสร็จคือ RBAC Module (`PermissionsGuard`) จำกัดสิทธิ์ว่า Role ไหนทำอะไรได้บ้าง
