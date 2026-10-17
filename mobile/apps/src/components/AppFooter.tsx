import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

// Footer ง่ายๆ ใช้ซ้ำทุกหน้า — โชว์ชื่อแอป + ปีปัจจุบัน ไม่มี logic อะไรซับซ้อน
export default function AppFooter() {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
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
});
