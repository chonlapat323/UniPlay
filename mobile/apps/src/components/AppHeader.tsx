import { Appbar } from 'react-native-paper';

type AppHeaderProps = {
  title: string;
  onBack?: () => void;
};

// Navbar กลางที่ใช้ซ้ำทุกหน้า — มีปุ่ม back ให้ถ้าส่ง onBack มา (หน้า Home ไม่ต้องมีปุ่ม back จึงไม่ส่ง prop นี้)
export default function AppHeader({ title, onBack }: AppHeaderProps) {
  return (
    <Appbar.Header>
      {onBack && <Appbar.BackAction onPress={onBack} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
