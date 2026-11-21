import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // อนุญาตให้เปิดเว็บโหมด dev ผ่าน IP ในวง Wi-Fi (เช่นเปิดจากมือถือจริง http://192.168.1.10:3000)
  // ถ้าไม่ใส่ Next 16 จะบล็อก JavaScript -> หน้าแสดงได้ แต่กดปุ่ม ☰ / เมนูย่อย ไม่ติด
  // * = ตัวเลข 1 ช่อง -> 192.168.*.* ครอบคลุม IP บ้าน/ห้องเรียนทั่วไป
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
