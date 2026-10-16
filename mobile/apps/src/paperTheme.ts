import { MD3LightTheme } from 'react-native-paper';

// ชุดสีเต็มรูปแบบตามระบบ Material Design 3 (ไม่ใช่แค่เปลี่ยน primary สีเดียว)
// แต่ละ role มีคู่ "on" (ตัวอักษร/ไอคอนที่วางทับสีนั้น) และ "Container" (พื้นหลังอ่อนสำหรับ state รอง)
// แก้ชุดสีนี้ที่เดียว มีผลกับทุก component ของ Paper ทั้งแอป
export const paperTheme = {
  ...MD3LightTheme,
  roundness: 14, // ขอบมนขึ้นกว่า default (4) ทำให้การ์ด/ปุ่ม/ช่องกรอกดูนุ่มนวลทันสมัยขึ้น
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0E7FF',
    onPrimaryContainer: '#312E81',

    secondary: '#7C3AED',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#EDE9FE',
    onSecondaryContainer: '#4C1D95',

    tertiary: '#059669',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#D1FAE5',
    onTertiaryContainer: '#064E3B',

    error: '#DC2626',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#7F1D1D',

    background: '#FAFAFA',
    onBackground: '#1C1B1F',
    surface: '#FFFFFF',
    onSurface: '#1C1B1F',
    surfaceVariant: '#F3F4F6',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
  },
};
