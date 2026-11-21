// =============================================================================
// Header.tsx — แถบหัวเว็บแบบ responsive (ฉบับสมบูรณ์)
// -----------------------------------------------------------------------------
// ออกแบบแบบ Mobile First: class ที่ไม่มีคำนำหน้า = หน้าตาบนมือถือ แล้วค่อยเติมของจอใหญ่
//
//   มือถือ (< 640px) : โลโก้ | ปุ่ม ☰  -> กดแล้วเมนูกางลงมาด้านล่าง (มีปุ่มเข้าสู่ระบบในเมนู)
//   sm  (≥ 640px)    : ปุ่ม "เข้าสู่ระบบ" ย้ายขึ้นมาอยู่บนแถบ
//   md  (≥ 768px)    : ซ่อนปุ่ม ☰ แสดงเมนูเรียงแนวนอนแทน + dropdown เมนูย่อย
//   lg  (≥ 1024px)   : แสดงคำอธิบายข้างโลโก้ และเมนูห่างกันมากขึ้น
// =============================================================================

// "use client" = component นี้ทำงานบนเบราว์เซอร์ด้วย
// จำเป็นเพราะมี useState (จำว่าเมนูเปิดอยู่ไหม), onClick และ usePathname
// (ถ้าไม่ใส่ Next จะ error: useState only works in Client Components)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isActive, menu } from "@/lib/menu";

// สร้าง class ของลิงก์เมนู PC ตามสถานะ active
// ⚠️ ต้องเขียนชื่อ class เต็มๆ ห้ามต่อสตริงเป็นชิ้นๆ เช่น "bg-" + color
//    เพราะ Tailwind อ่านชื่อ class จากโค้ดตรงๆ ถ้าชื่อไม่ครบจะไม่สร้าง CSS ให้
function desktopLinkClass(active: boolean) {
  return `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

// class ของลิงก์ในเมนูมือถือ (ตัวใหญ่กว่า กดง่ายกว่า)
function mobileLinkClass(active: boolean) {
  return `flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
  }`;
}

// ไอคอนลูกศรลง ใช้กับ dropdown (หมุน 180° ตอนเปิด)
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Header() {
  // URL ของหน้าที่เปิดอยู่ เช่น "/news/football" -> ใช้ไฮไลต์เมนู
  const pathname = usePathname();

  // เมนูมือถือกางอยู่ไหม (true = กาง)
  const [mobileOpen, setMobileOpen] = useState(false);

  // dropdown ไหนเปิดอยู่ (เก็บ label ของเมนูนั้น, null = ไม่มีอันไหนเปิด)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // ปิดเมนูทั้งหมด — เรียกตอนกดลิงก์ จะได้ไม่ค้างหลังเปลี่ยนหน้า
  function closeAll() {
    setMobileOpen(false);
    setOpenSubmenu(null);
  }

  // ref = "ป้ายชี้" ไปที่แท็ก <header> จริงบนหน้าเว็บ ใช้เช็คว่าคลิกโดนข้างใน header หรือข้างนอก
  const headerRef = useRef<HTMLElement>(null);

  // ปิดเมนูทั้งหมดเมื่อ (1) กดปุ่ม Esc หรือ (2) คลิก/แตะที่ไหนก็ได้นอก header
  // useEffect ตั้งตัวดักฟังครั้งเดียวตอน Header ขึ้นจอ และ return ฟังก์ชันถอดออกตอนเลิกใช้
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenSubmenu(null);
      }
    }
    function onPointerDown(e: PointerEvent) {
      // contains = จุดที่คลิกอยู่ข้างใน header ไหม -> ถ้าไม่ใช่ ให้ปิด
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
        setOpenSubmenu(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    // sticky top-0 = เลื่อนหน้าแล้ว header ติดอยู่บนสุด · z-50 = อยู่ชั้นบนกว่าเนื้อหา
    // bg-white/90 + backdrop-blur = พื้นขาวโปร่งนิดๆ เห็นเนื้อหาด้านหลังเบลอๆ
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* แถวบน: โลโก้ | เมนู PC | ปุ่ม  -> justify-between ดันให้ชิดซ้าย-ขวา */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------- โลโก้ (กดแล้วกลับหน้าแรก) ---------- */}
        <Link href="/" onClick={closeAll} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">📰</span>
          <span className="text-lg font-bold text-slate-900">News</span>
          {/* hidden lg:inline = ซ่อนไว้ก่อน โผล่เมื่อจอ ≥ 1024px */}
          <span className="hidden text-sm text-slate-500 lg:inline">ข่าวกีฬา</span>
        </Link>

        {/* ---------- เมนู PC: hidden บนมือถือ, md:flex = แสดงเมื่อจอ ≥ 768px ---------- */}
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 md:flex lg:gap-2">
          {menu.map((item) => {
            const active = isActive(pathname, item.href);

            // เมนูธรรมดา (ไม่มีเมนูย่อย) -> ลิงก์เดียว
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  aria-current={active ? "page" : undefined}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            }

            // เมนูที่มีเมนูย่อย -> dropdown
            const open = openSubmenu === item.label;
            return (
              <div
                key={item.href}
                className="relative" // ให้กล่อง dropdown (absolute) วางตำแหน่งเทียบกับเมนูนี้
                // ชี้เมาส์เข้า = เปิด, เอาเมาส์ออก = ปิด
                // เช็ค pointerType === "mouse" เพราะบนแท็บเล็ตการแตะจะยิง event นี้ด้วย
                // แล้วไปชนกับ onClick ด้านล่าง (เปิดแล้วปิดทันที)
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpenSubmenu(item.label)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setOpenSubmenu(null)}
              >
                {/* ใช้ <button> ไม่ใช่ลิงก์: แตะ (จอสัมผัส) หรือ Enter (คีย์บอร์ด) = เปิด-ปิด dropdown */}
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={(e) => {
                    // คลิกด้วยเมาส์: สั่ง "เปิด" อย่างเดียว (ไม่สลับ)
                    // เพราะตอนชี้ dropdown อาจเปิดไปแล้ว ถ้าสลับ คลิกแล้ว dropdown จะปิดทันที
                    if ((e.nativeEvent as PointerEvent).pointerType === "mouse") {
                      setOpenSubmenu(item.label);
                      return;
                    }
                    // แตะ (จอสัมผัส) / Enter (คีย์บอร์ด): สลับเปิด-ปิด
                    setOpenSubmenu(open ? null : item.label);
                  }}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                  <ChevronIcon open={open} />
                </button>

                {/* แสดงกล่อง dropdown เฉพาะตอน open เป็น true */}
                {open && (
                  // top-full = วางใต้ปุ่มพอดี · pt-2 = เว้นช่องแต่ยังเป็นพื้นที่เดียวกัน
                  // (ถ้าใช้ mt-2 จะมีช่องว่าง เมาส์เลื่อนผ่านช่องนั้นแล้ว dropdown ปิดเอง)
                  <div className="absolute top-full left-0 pt-2">
                    <ul className="w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {item.children.map((child) => {
                        const childActive = isActive(pathname, child.href, true);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeAll}
                              aria-current={childActive ? "page" : undefined}
                              className={`block rounded-lg px-3 py-2 text-sm ${
                                childActive
                                  ? "bg-indigo-50 font-medium text-indigo-700"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ---------- ด้านขวา: ปุ่มเข้าสู่ระบบ + ปุ่ม ☰ ---------- */}
        <div className="flex items-center gap-2">
          {/* hidden sm:inline-block = มือถือซ่อน (ไปอยู่ในเมนูกางแทน), จอ ≥ 640px แสดงบนแถบ */}
          <Link
            href="/login"
            onClick={closeAll}
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:inline-block"
          >
            เข้าสู่ระบบ
          </Link>

          {/* ปุ่ม ☰ : md:hidden = ซ่อนเมื่อจอ ≥ 768px (เพราะมีเมนู PC แล้ว) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"} // ปุ่มไม่มีตัวหนังสือ -> บอกโปรแกรมอ่านหน้าจอว่าปุ่มนี้คืออะไร
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {/* สลับไอคอน: เปิดอยู่ = ✕, ปิดอยู่ = ☰ */}
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-6">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---------- เมนูมือถือ: แสดงเฉพาะตอน mobileOpen และซ่อนเสมอเมื่อจอ ≥ 768px ---------- */}
      {mobileOpen && (
        <nav id="mobile-menu" aria-label="เมนูหลัก" className="border-t border-slate-200 px-4 py-3 md:hidden">
          <ul className="space-y-1">
            {menu.map((item) => {
              const active = isActive(pathname, item.href);

              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeAll}
                      aria-current={active ? "page" : undefined}
                      className={mobileLinkClass(active)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              // เมนูย่อยบนมือถือ = แบบพับ/กาง (accordion) กดที่หัวข้อแล้วรายการย่อยกางลงมา
              const open = openSubmenu === item.label;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenSubmenu(open ? null : item.label)}
                    className={mobileLinkClass(active)}
                  >
                    {item.label}
                    <ChevronIcon open={open} />
                  </button>
                  {open && (
                    // ml-3 + border-l = เส้นแนวตั้งด้านซ้าย บอกว่าเป็นเมนูย่อยของหัวข้อข้างบน
                    <ul className="mt-1 ml-3 space-y-1 border-l border-slate-200 pl-3">
                      {item.children.map((child) => {
                        const childActive = isActive(pathname, child.href, true);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeAll}
                              aria-current={childActive ? "page" : undefined}
                              className={`block rounded-lg px-3 py-2 ${
                                childActive ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ปุ่มเข้าสู่ระบบในเมนูมือถือ: sm:hidden เพราะจอ ≥ 640px มีปุ่มบนแถบแล้ว */}
          <Link
            href="/login"
            onClick={closeAll}
            className="mt-3 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white sm:hidden"
          >
            เข้าสู่ระบบ
          </Link>
        </nav>
      )}
    </header>
  );
}
