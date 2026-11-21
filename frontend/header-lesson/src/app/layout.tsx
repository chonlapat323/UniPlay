// =============================================================================
// layout.tsx — "กรอบ" ที่ครอบทุกหน้า
// -----------------------------------------------------------------------------
// ทุกหน้า (page.tsx) จะถูกใส่เข้ามาแทนที่ {children}
// เราวาง <Header /> ไว้ตรงนี้ที่เดียว -> Header โผล่ทุกหน้าอัตโนมัติ
// และตอนเปลี่ยนหน้า Header ไม่ถูกสร้างใหม่ (สถานะต่างๆ ไม่หาย)
// =============================================================================
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

// โหลดฟอนต์ไทยผ่าน next/font: Next ดาวน์โหลดมาเก็บในเว็บเราเองตอน build (ไม่ต้องใส่ <link>)
// variable = ชื่อตัวแปร CSS ที่ globals.css เอาไปตั้งเป็นฟอนต์หลัก
const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
});

// ข้อมูลหน้าเว็บ (ชื่อแท็บ, คำอธิบายตอนแชร์/ค้นหา)
//   template: หน้าไหนตั้ง title เอง จะได้ "ชื่อหน้า | News"
//   default : หน้าที่ไม่ตั้ง title (เช่นหน้าแรก)
export const metadata: Metadata = {
  title: { default: "News — ข่าวกีฬา", template: "%s | News" },
  description: "เว็บข่าวกีฬา — บทเรียนสร้าง Header แบบ responsive ด้วย Next.js + Tailwind CSS",
};

// LayoutProps<"/"> = ชนิดข้อมูลสำเร็จรูปของ Next 16 (ไม่ต้อง import) มี children ให้
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-800">
        <Header />
        {/* เนื้อหาของแต่ละหน้า: กว้างไม่เกิน max-w-6xl อยู่กลางจอ, ระยะขอบเพิ่มตามขนาดจอ */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
