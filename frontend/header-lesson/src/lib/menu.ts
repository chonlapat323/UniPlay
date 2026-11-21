// =============================================================================
// menu.ts — รายการเมนูทั้งหมดของ Header (ข้อมูลล้วนๆ ไม่มีหน้าตา)
// -----------------------------------------------------------------------------
// แยกข้อมูลเมนูออกจากหน้าตา: อยากเพิ่ม/ลบเมนู แก้ที่ไฟล์นี้ไฟล์เดียว
// Header จะวนลูป (map) สร้างลิงก์จาก array นี้ให้เอง ทั้งเมนูมือถือและเมนู PC
// =============================================================================

// รูปร่างของเมนู 1 อัน
export type MenuItem = {
  label: string; // ข้อความที่แสดง
  href: string; // ลิงก์ไปหน้าไหน
  children?: MenuItem[]; // เมนูย่อย (มีหรือไม่มีก็ได้ — เครื่องหมาย ? = ไม่บังคับ)
};

export const menu: MenuItem[] = [
  { label: "หน้าแรก", href: "/" },
  {
    label: "ข่าว",
    href: "/news",
    // เมนูที่มี children จะกลายเป็น dropdown
    children: [
      { label: "ข่าวทั้งหมด", href: "/news" },
      { label: "ฟุตบอล", href: "/news/football" },
      { label: "บาสเกตบอล", href: "/news/basketball" },
      { label: "วอลเลย์บอล", href: "/news/volleyball" },
      { label: "แบดมินตัน", href: "/news/badminton" },
    ],
  },
  { label: "ผลการแข่งขัน", href: "/results" },
  { label: "เกี่ยวกับเรา", href: "/about" },
];

// เช็คว่าเมนูนี้คือ "หน้าที่เปิดอยู่" ไหม (ใช้ไฮไลต์เมนู)
//   exact = true  -> ต้องตรงกันเป๊ะ (ใช้กับเมนูย่อย)
//   exact = false -> หน้าลูกก็นับด้วย เช่น อยู่หน้า /news/football ก็ไฮไลต์เมนู "ข่าว" (/news)
export function isActive(pathname: string, href: string, exact = false) {
  // หน้าแรก "/" ต้องเช็คแบบเป๊ะเสมอ ไม่งั้นทุกหน้าจะนับว่าขึ้นต้นด้วย "/" หมด
  if (href === "/" || exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}
