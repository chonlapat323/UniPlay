// ยังไม่มี endpoint GET /roles ในฝั่ง backend จึง hardcode รายชื่อ role ไว้ที่นี่ก่อน
// (ต้อง sync มือกับ seed data ใน schema-draft.sql ถ้า role เปลี่ยน)
export const ROLES = [
  { id: 'a541ccca-c9e0-4825-adfb-f71e1de40676', name: 'STUDENT' },
  { id: '385a0cc6-2339-4f3e-b2d1-edbd8a27f41b', name: 'LECTURER' },
  { id: '8176650d-f83d-4ca2-9ec8-fcf1f1f72b46', name: 'STAFF' },
  { id: '866005f6-ccaf-4ec7-8601-d3797c99a88e', name: 'ADMIN' },
];
