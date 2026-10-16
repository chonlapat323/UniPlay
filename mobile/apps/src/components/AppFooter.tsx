import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

// Footer ง่ายๆ ใช้ซ้ำทุกหน้า — โชว์ชื่อแอป + ปีปัจจุบัน ไม่มี logic อะไรซับซ้อน
export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={styles.text}>
        UniPlay © {year} — University Sports Facility Booking
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    color: '#9ca3af',
  },
});
