# คู่มือสร้าง Database (UniPlay) แบบ Step-by-Step

เอกสารนี้สอนวิธีสร้างฐานข้อมูลจริงสำหรับดู ER Diagram ผ่าน pgAdmin 4 มี **2 วิธี** เลือกทำวิธีไหนก็ได้ตามจุดประสงค์:

| วิธี | เหมาะกับ | ใช้เวลา |
|---|---|---|
| **A: Docker Compose + schema-draft.sql** | อยากได้ database พร้อมใช้เร็วที่สุด ไม่ต้องพิมพ์อะไรเอง | 5 นาที |
| **B: สร้างเองผ่าน pgAdmin ERD Tool** | อยากฝึกความเข้าใจ ลงมือสร้างตารางเองทีละตาราง | 30-60 นาที |

ทำวิธี A ก่อนเพื่อดูผลลัพธ์สุดท้ายว่าหน้าตาเป็นยังไง แล้วค่อยลองวิธี B เพื่อฝึกสร้างเองก็ได้

---

## ER Diagram คืออะไร (สรุปสั้นๆ ก่อนเริ่ม)

**ER Diagram (Entity-Relationship Diagram)** คือรูปภาพที่แสดงว่าฐานข้อมูลมี**ตารางอะไรบ้าง** แต่ละตารางมี**คอลัมน์อะไรบ้าง** และตารางไหน**เชื่อมกับ**ตารางไหนบ้าง — เช่นในโปรเจค UniPlay จะเห็นว่า "1 Facility มีได้หลาย Booking" หรือ "1 Booking มี User ที่เกี่ยวข้องถึง 3 บทบาท (คนจอง, คนอนุมัติ, คนเช็คอินให้)"

พูดง่ายๆ คือแทนที่จะต้องอ่านโค้ด `schema.prisma` หรือไฟล์ `.sql` ทีละบรรทัดเพื่อทำความเข้าใจโครงสร้างข้อมูล ก็แค่ดูภาพเดียวจบ — เอกสารนี้จะพาไปสร้าง database จริงแล้วเปิดดูภาพนั้นผ่าน pgAdmin

**อยากเข้าใจสัญลักษณ์/วิธีอ่าน ER Diagram แบบละเอียด** (Primary Key, Foreign Key, เส้นความสัมพันธ์แบบ 1-ต่อ-กลุ่ม ฯลฯ) **ก่อนลงมือ** → อ่านคู่มือเต็มที่ `DATABASE_DIAGRAM_GUIDE.md` ก่อน แล้วค่อยกลับมาทำ step-by-step ในไฟล์นี้ต่อ

---

## ชนิดข้อมูล (Data Type) ของแต่ละคอลัมน์ที่นิยมใช้

ก่อนสร้างตาราง (ทั้งวิธี A และ B) ต้องรู้ก่อนว่าแต่ละคอลัมน์ควรเก็บข้อมูล**ชนิดไหน** — นี่คือชนิดข้อมูลของ PostgreSQL ที่ใช้บ่อยที่สุด พร้อมตัวอย่างจริงจาก `schema-draft.sql`:

| Type (PostgreSQL) | เก็บอะไร | ตัวอย่างจริงในโปรเจค | หมายเหตุ |
|---|---|---|---|
| `UUID` | รหัสไม่ซ้ำกัน ใช้เป็น Primary Key | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` | นิยมมากกว่าเลข auto-increment (`SERIAL`) เพราะเดายาก ปลอดภัยกว่า |
| `VARCHAR(n)` | ข้อความสั้น จำกัดความยาวไม่เกิน n ตัวอักษร | `name VARCHAR(200)`, `email VARCHAR(255)` | ถ้าเกิน n ตัวอักษร database จะ error |
| `TEXT` | ข้อความยาวไม่จำกัดความยาว | `rejected_reason TEXT` | ใช้กับข้อความที่ไม่รู้ว่าจะยาวแค่ไหน เช่น เหตุผล/คำอธิบาย |
| `INTEGER` / `INT` | เลขจำนวนเต็ม | `capacity INTEGER` | ไม่มีทศนิยม |
| `BOOLEAN` | ค่าจริง/เท็จ (true/false) | `is_active BOOLEAN DEFAULT TRUE` | ใช้กับ flag เปิด/ปิด, ใช่/ไม่ใช่ |
| `TIMESTAMPTZ` | วันที่ + เวลา (พร้อม timezone) | `created_at TIMESTAMPTZ DEFAULT now()` | ตัว `TZ` สำคัญมาก — เก็บ timezone ด้วยกันข้อมูลเวลาเพี้ยนเวลาข้าม timezone |
| `NUMERIC(p,s)` / `DECIMAL(p,s)` | เลขทศนิยมที่ต้องแม่นยำ 100% | เช่น ราคาสินค้า `price NUMERIC(10,2)` | ใช้กับ**เงิน**เท่านั้น ห้ามใช้ float/double เพราะปัดเศษผิดพลาดได้ |
| Custom `ENUM` type | ค่าที่จำกัดตัวเลือกไว้ล่วงหน้า | `status booking_status` (`PENDING`/`CONFIRMED`/...) | สร้างด้วย `CREATE TYPE ... AS ENUM (...)` ก่อน แล้วค่อยใช้เป็น type ของคอลัมน์ |
| `JSONB` | ข้อมูลแบบ JSON ยืดหยุ่น ไม่ตายตัว | *(ยังไม่ได้ใช้ในโปรเจคนี้)* | เหมาะกับข้อมูลที่โครงสร้างเปลี่ยนบ่อย/ไม่แน่นอน |

**เทคนิคจำง่ายๆ ตอนเลือก Type:**
- เป็น**ตัวเลขนับจำนวน** (จำนวนคน, ความจุ) → `INTEGER`
- เป็น**เงิน/ราคา** → `NUMERIC(p,s)` เท่านั้น (ห้ามใช้ float)
- เป็น**ข้อความสั้นมีขอบเขต** (ชื่อ, อีเมล) → `VARCHAR(n)`
- เป็น**ข้อความยาวไม่จำกัด** (คำอธิบาย, หมายเหตุ) → `TEXT`
- เป็น**วันที่/เวลา** → `TIMESTAMPTZ` เสมอ (ไม่ใช้ `TIMESTAMP` เฉยๆ ที่ไม่มี timezone)
- เป็น**ตัวเลือกจำกัด** (สถานะ, ประเภท) → สร้าง `ENUM` เฉพาะ

### เทียบกับ Prisma Schema (ฝั่งโค้ด)

Prisma มีชื่อ type ของตัวเอง ที่แปลงไปเป็น PostgreSQL type ให้อัตโนมัติตอน migrate:

| Prisma Type | แปลงเป็น PostgreSQL Type |
|---|---|
| `String` | `VARCHAR` หรือ `TEXT` |
| `Int` | `INTEGER` |
| `Boolean` | `BOOLEAN` |
| `DateTime` | `TIMESTAMPTZ` |
| `Decimal` | `NUMERIC` |
| `enum { ... }` | Custom `ENUM` type |

ดูตัวอย่างจริงเทียบกันได้ที่ `plan.md` หัวข้อ 7 (ฝั่ง Prisma) กับ `schema-draft.sql` (ฝั่ง SQL ที่แปลงมาแล้ว) — เป็นข้อมูลเดียวกัน แค่คนละภาษา

---

## Prerequisites (ของที่ต้องมีก่อนเริ่ม)

- [ ] **Docker Desktop** ติดตั้งแล้วและเปิดอยู่ (เฉพาะวิธี A)
- [ ] **pgAdmin 4** ติดตั้งแล้ว (ทั้ง 2 วิธีต้องใช้)
- [ ] ไฟล์ `docker-compose.yml` และ `schema-draft.sql` อยู่ใน `f:\ATC_PRoject\UniPlay\` แล้ว (มีอยู่แล้วในโปรเจค)

---

## วิธี A: Docker Compose + schema-draft.sql (แนะนำ ทำก่อน)

### ขั้นที่ 1 — เข้าใจไฟล์ `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: uniplay-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: uniplay
      POSTGRES_PASSWORD: uniplay_dev_password
      POSTGRES_DB: uniplay
    ports:
      - "5434:5432"
    volumes:
      - uniplay_postgres_data:/var/lib/postgresql/data
```

อธิบายทีละบรรทัด:
- `image: postgres:16-alpine` — ใช้ PostgreSQL เวอร์ชัน 16 (ตัวเล็ก "alpine" โหลดเร็ว)
- `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` — สร้าง user, password, และ database ชื่อ `uniplay` ให้อัตโนมัติตอน container เริ่มครั้งแรก
- `ports: "5434:5432"` — เปิดพอร์ต **5434** บนเครื่องเรา ไปเชื่อมกับพอร์ต 5432 ข้างในตัว container (ใช้ 5434 เพราะ 5432/5433 มี container อื่นใช้อยู่แล้วในเครื่องนี้)
- `volumes` — เก็บข้อมูลไว้ถาวรแม้ปิด container (ไม่ต้องสร้างข้อมูลใหม่ทุกครั้งที่เปิด)

### ขั้นที่ 2 — เปิด Container

เปิด terminal ที่โฟลเดอร์โปรเจค แล้วรัน:

```bash
docker compose up -d
```

เช็คว่ารันสำเร็จ:

```bash
docker compose ps
```

ควรเห็นสถานะ `Up` และพอร์ต `0.0.0.0:5434->5432/tcp`

### ขั้นที่ 3 — เข้าใจไฟล์ `schema-draft.sql`

ไฟล์นี้มี 3 ส่วน:
1. **`CREATE TYPE`** x2 — สร้าง enum `facility_type` และ `booking_status`
2. **`CREATE TABLE`** x6 — สร้างตาราง `role`, `menu`, `role_permission`, `user`, `facility`, `booking` (แปลมาจาก Prisma schema ใน `plan.md` หัวข้อ 7 แบบ 1:1)
3. **`INSERT`** — ใส่ข้อมูลตัวอย่างเริ่มต้น (4 Role, 4 Menu)

> ไฟล์นี้เป็นแค่เครื่องมือช่วยสอน/ดู ERD เท่านั้น **ไม่ใช่** ต้นฉบับจริงของระบบ — ต้นฉบับจริงคือ `schema.prisma` ที่จะสร้างใน Phase 2 ตาม Roadmap (`plan.md` หัวข้อ 11)

### ขั้นที่ 4 — โหลด schema เข้า Database

```bash
docker exec -i uniplay-postgres psql -U uniplay -d uniplay < schema-draft.sql
```

ถ้าสำเร็จจะเห็นผลลัพธ์ `CREATE TYPE`, `CREATE TABLE` x6, `CREATE INDEX`, `INSERT 0 4` x2

**เช็คว่าตารางถูกสร้างจริง:**

```bash
docker exec -i uniplay-postgres psql -U uniplay -d uniplay -c "\dt"
```

ควรเห็นตารางครบ 6 ตาราง: `booking`, `facility`, `menu`, `role`, `role_permission`, `user`

### ขั้นที่ 5 — เชื่อมต่อ pgAdmin เข้า Database นี้

1. เปิด pgAdmin 4 → คลิกขวาที่ **Servers** → **Register** → **Server...**
2. แท็บ **General** — ตั้งชื่อ (เช่น `UniPlay Dev`)
3. แท็บ **Connection** — กรอก:

   | ช่อง | ค่าที่ใส่ |
   |---|---|
   | Host name/address | `localhost` |
   | Port | `5434` |
   | Maintenance database | `uniplay` |
   | Username | `uniplay` |
   | Password | `uniplay_dev_password` |

4. กด **Save** — ถ้าเชื่อมสำเร็จจะเห็น database `uniplay` โผล่ในแถบซ้าย

### ขั้นที่ 6 — ดู ER Diagram

1. คลิกขวาที่ database **`uniplay`** ในแถบซ้าย → เลือก **ERD Tool**
2. รอสักครู่ — pgAdmin จะดึงทั้ง 6 ตารางพร้อมเส้นความสัมพันธ์มาวาดให้อัตโนมัติ
3. สังเกต **3 เส้น** ที่ลากจาก `booking` ไปหา `user` (userId, approvedById, checkedInById) — นี่คือจุดตัวอย่างจริงที่สอนไว้ใน `DATABASE_DIAGRAM_GUIDE.md` หัวข้อ 6

### คำสั่งจัดการ Container ที่ใช้บ่อย

```bash
docker compose stop        # หยุดชั่วคราว (ข้อมูลยังอยู่)
docker compose up -d       # เปิดใหม่
docker compose down        # ลบ container (ข้อมูลยังอยู่ใน volume)
docker compose down -v     # ลบ container + ลบข้อมูลทั้งหมดด้วย (ระวัง!)
```

---

## วิธี B: สร้างเองผ่าน pgAdmin ERD Tool (ฝึกความเข้าใจ)

ใช้วิธีนี้ถ้าอยากฝึกสร้างตารางเองทีละตาราง แทนที่จะรัน SQL สำเร็จรูป

### ขั้นที่ 1 — สร้าง Database เปล่าไว้ฝึก

1. เปิด pgAdmin 4 → ต่อ Server ใดก็ได้ที่มีอยู่แล้ว (หรือใช้ server ที่สร้างจากวิธี A ก็ได้)
2. คลิกขวาที่ **Databases** → **Create** → **Database...**
3. ตั้งชื่อ เช่น `uniplay_practice` → Save

### ขั้นที่ 2 — เปิด ERD Tool แบบว่างเปล่า

1. คลิกขวาที่ database `uniplay_practice` → **ERD Tool**
2. เพราะยังไม่มีตารางอยู่เลย canvas จะว่างเปล่า

### ขั้นที่ 3 — สร้างตารางทีละตาราง

สร้างตามลำดับนี้ (อ้างอิงคอลัมน์จาก `plan.md` หัวข้อ 7):

1. คลิกขวาบน canvas → **Create Table**
2. ตั้งชื่อตาราง เช่น `role`
3. เพิ่มคอลัมน์ทีละอัน: `id` (uuid, Primary Key), `name` (varchar, unique), `is_system` (boolean, default false)
4. ทำซ้ำสำหรับ `menu`, `role_permission`, `user`, `facility`, `booking`

### ขั้นที่ 4 — สร้างความสัมพันธ์ (FK) ผ่าน Dialog (ไม่ใช่การลากเส้น)

**วิธีจริง:** คลิกเลือกตารางฝั่งที่มี FK (ฝั่ง "ลูก") ก่อน แล้วกดปุ่ม **1-M** (One-to-Many) บน toolbar → จะเปิด dialog ให้เลือก **Local Table/Column** (ฝั่งลูก) กับ **Referenced Table/Column** (ฝั่งพ่อ/แม่) แล้วกด Save

ทำซ้ำตามคู่นี้ (ทุกคู่ในโปรเจคนี้ใช้ปุ่ม **1-M** เหมือนกันหมด):

| Local Table | Local Column | Referenced Table | Referenced Column | หมายเหตุ |
|---|---|---|---|---|
| `user` | `role_id` | `role` | `id` | |
| `booking` | `user_id` | `user` | `id` | คนจอง |
| `booking` | `approved_by_id` | `user` | `id` | คนอนุมัติ |
| `booking` | `checked_in_by_id` | `user` | `id` | คนเช็คอินให้ |
| `booking` | `facility_id` | `facility` | `id` | |
| `role_permission` | `role_id` | `role` | `id` | |
| `role_permission` | `menu_id` | `menu` | `id` | |

> จุดสำคัญ: `booking → user` ต้องทำ dialog นี้แยกกัน **3 รอบ** (คนละ Local Column) เพราะเป็นคนละความสัมพันธ์กัน (ดูเหตุผลใน `DATABASE_DIAGRAM_GUIDE.md` หัวข้อ 6)

### ขั้นที่ 5 — Generate SQL แล้ว Execute จริง

1. กดปุ่ม **"Generate SQL"** บน toolbar ของ ERD Tool
2. pgAdmin จะเปิด **Query Tool** พร้อม SQL (`CREATE TABLE...`) ที่พร้อมรัน
3. กด **Execute (F5)** — จะสร้างตารางจริงใน database `uniplay_practice`
4. เทียบผลลัพธ์กับตารางที่ได้จากวิธี A (หรือกับ `schema-draft.sql`) ว่าตรงกันไหม

---

## Troubleshooting

| ปัญหา | วิธีแก้ |
|---|---|
| `port is already allocated` ตอน `docker compose up` | มี container อื่นใช้พอร์ต 5434 อยู่แล้ว — แก้ `ports` ใน `docker-compose.yml` เป็นพอร์ตอื่นที่ว่าง (เช่น `5435:5432`) |
| pgAdmin เชื่อมต่อไม่ได้ (`connection refused`) | เช็คว่า container รันอยู่จริงด้วย `docker compose ps` — ถ้าไม่รัน ให้ `docker compose up -d` ใหม่ |
| รัน `schema-draft.sql` แล้ว error `relation already exists` | ตารางถูกสร้างไปแล้วรอบก่อนหน้า — ลบ container แล้วสร้างใหม่ด้วย `docker compose down -v && docker compose up -d` (ข้อมูลเก่าจะหายหมด) |
| ERD Tool ไม่แสดงตารางที่มีอยู่ | ลองปิดแล้วเปิด ERD Tool ใหม่ หรือ refresh database node ในแถบซ้ายก่อน |

---

## สรุป Connection Info (สำหรับวิธี A)

| รายการ | ค่า |
|---|---|
| Host | `localhost` |
| Port | `5434` |
| Database | `uniplay` |
| Username | `uniplay` |
| Password | `uniplay_dev_password` |

> Password นี้เป็นแค่ค่า dev สำหรับเครื่องตัวเองเท่านั้น ห้ามใช้ค่านี้ตอน deploy จริงขึ้น production
