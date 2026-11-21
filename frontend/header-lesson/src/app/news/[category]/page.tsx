// news/[category]/page.tsx = หน้าข่าวแต่ละหมวด (Dynamic Route)
// โฟลเดอร์ [category] = ช่องว่างใน URL -> ไฟล์เดียวใช้ได้ทุกหมวด
//   /news/football -> category = "football"
//   /news/badminton -> category = "badminton"
// ใน Next 16 params เป็น Promise -> ต้อง await ก่อนใช้ (ฟังก์ชันจึงต้องเป็น async)
export default async function CategoryPage(props: PageProps<"/news/[category]">) {
  const { category } = await props.params;
  return <h1 className="text-2xl font-bold">ข่าวหมวด: {category}</h1>;
}
