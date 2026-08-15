-- UniPlay — Draft schema for pgAdmin ERD Tool practice
-- ใช้สำหรับสร้างตารางจริงใน database เปล่าๆ (เช่น uniplay_practice)
-- แล้วเปิด pgAdmin ERD Tool ดูภาพ ER Diagram ที่ดึงมาจากตารางจริงเหล่านี้
--
-- ไม่ใช่ต้นฉบับจริงของระบบ — ต้นฉบับจริงคือ schema.prisma ที่จะสร้างใน Phase 2
-- (ดู plan.md หัวข้อ 7 และ 11) ไฟล์นี้แค่แปลจาก Prisma schema เป็น SQL
-- เพื่อจุดประสงค์สอน/ดู ERD เท่านั้น

-- วิธีใช้ใน pgAdmin:
-- 1. สร้าง database เปล่าใหม่ (เช่น uniplay_practice) หรือใช้ database ฝึกที่มีอยู่แล้ว
-- 2. เปิด Query Tool บน database นั้น
-- 3. Paste ไฟล์นี้ทั้งหมด แล้วกด Execute (F5)
-- 4. คลิกขวาที่ database นั้น -> ERD Tool -> จะเห็น diagram ที่ดึงมาจากตารางจริง

-- ==========================================
-- Enums
-- ==========================================

CREATE TYPE facility_type AS ENUM (
  'FOOTBALL',
  'BASKETBALL',
  'BADMINTON',
  'TENNIS',
  'VOLLEYBALL',
  'SWIMMING',
  'OTHER'
);

CREATE TYPE booking_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'REJECTED',
  'CANCELLED',
  'NO_SHOW',
  'COMPLETED'
);

-- ==========================================
-- RBAC: Role / Menu / RolePermission
-- ==========================================

CREATE TABLE "role" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  is_system   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "menu" (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key    VARCHAR(100) NOT NULL UNIQUE,
  label  VARCHAR(200) NOT NULL
);

CREATE TABLE "role_permission" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id     UUID NOT NULL REFERENCES "role"(id) ON DELETE CASCADE,
  menu_id     UUID NOT NULL REFERENCES "menu"(id) ON DELETE CASCADE,
  can_view    BOOLEAN NOT NULL DEFAULT FALSE,
  can_add     BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit    BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (role_id, menu_id)
);

-- ==========================================
-- Member Management
-- ==========================================

CREATE TABLE "user" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(200) NOT NULL,
  role_id     UUID NOT NULL REFERENCES "role"(id),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Facility
-- ==========================================

CREATE TABLE "facility" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  type        facility_type NOT NULL,
  location    VARCHAR(255),
  capacity    INTEGER,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Booking (มี FK ชี้ไป "user" ถึง 3 เส้น — จุดสอนสำคัญใน DATABASE_DIAGRAM_GUIDE.md หัวข้อ 6)
-- ==========================================

CREATE TABLE "booking" (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES "user"(id),
  facility_id      UUID NOT NULL REFERENCES "facility"(id),
  start_time       TIMESTAMPTZ NOT NULL,
  end_time         TIMESTAMPTZ NOT NULL,
  status           booking_status NOT NULL DEFAULT 'PENDING',
  qr_code          VARCHAR(255) UNIQUE,
  checked_in_at    TIMESTAMPTZ,
  checked_in_by_id UUID REFERENCES "user"(id),
  approved_by_id   UUID REFERENCES "user"(id),
  rejected_reason  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_booking_facility_time ON "booking" (facility_id, start_time, end_time);

-- ==========================================
-- Seed ข้อมูลตั้งต้น (เผื่ออยากเห็นข้อมูลตัวอย่างใน ERD/query ทดสอบ)
-- ==========================================

INSERT INTO "role" (name, is_system) VALUES
  ('STUDENT', TRUE),
  ('LECTURER', TRUE),
  ('STAFF', TRUE),
  ('ADMIN', TRUE);

INSERT INTO "menu" (key, label) VALUES
  ('facility', 'จัดการสนาม'),
  ('booking', 'จัดการการจอง'),
  ('user', 'จัดการสมาชิก'),
  ('role', 'จัดการ Role/Permission');
