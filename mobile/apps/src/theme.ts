// รวมค่าสี/ระยะห่าง/ขนาดตัวอักษรที่ใช้ซ้ำทั้งแอปไว้ที่เดียว (design token)
// แก้ค่าตรงนี้ที่เดียว มีผลกับทุก component/screen ที่อ้างอิงมาจากไฟล์นี้

export const colors = {
  primary: '#2563eb',
  primaryText: '#ffffff',
  secondary: '#e5e7eb',
  secondaryText: '#1f2937',
  background: '#f9fafb',
  surface: '#ffffff',
  border: '#d1d5db',
  text: '#111827',
  textMuted: '#4b5563',
  label: '#374151',
  placeholder: '#9ca3af',
  error: '#dc2626',
  link: '#2563eb',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  pill: 999,
};

export const fontSize = {
  sm: 13,
  base: 14,
  title: 24,
};
