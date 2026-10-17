// สีเฉพาะของหน้า Onboarding นี้เท่านั้น — ตั้งใจ "ไม่" ใช้ paperTheme.ts ของแอป
// เพราะหน้านี้จำลองดีไซน์ต้นฉบับจาก https://github.com/Aashu-Dubey/React-Native-UI-Templates
// (เทมเพลต "Animated Onboarding" ของแอป Mental Wellness บน Behance) แบบเป๊ะๆ ตามที่ขอ
// ถ้าจะเอาไปใช้เป็น onboarding จริงของ UniPlay ควรเปลี่ยนมาใช้ theme.colors ของแอปแทน (ดู MOBILE_UX_GUIDE.md หัวข้อ 9)
export const onboardingPalette = {
  background: 'rgb(245, 235, 226)', // ครีม — สีพื้นหลังต้นฉบับ
  button: 'rgb(21, 32, 54)', // กรมท่าเข้ม — สีปุ่มหลักต้นฉบับ
  buttonText: 'white',
  text: 'black',
  textMuted: 'grey',
  dotActive: '#132137',
  dotInactive: '#E3E4E4',
};
