import { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { clearToken, getToken } from '../lib/token';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import ConfirmDialog from '../components/ConfirmDialog';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [hasToken, setHasToken] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getToken().then((token) => setHasToken(!!token));
    }, []),
  );

  async function handleConfirmLogout() {
    setLogoutConfirmVisible(false);
    await clearToken();
    navigation.replace('Login');
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="UniPlay Admin" />

      <View style={styles.container}>
        {hasToken ? (
          <>
            <Text variant="bodyMedium" style={styles.subtitle}>
              เข้าสู่ระบบแล้ว (มี access_token เก็บอยู่)
            </Text>
            <Button mode="outlined" onPress={() => setLogoutConfirmVisible(true)}>
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <View style={styles.row}>
            <Button mode="contained" onPress={() => navigation.navigate('Login')}>
              เข้าสู่ระบบ
            </Button>
            <Button mode="outlined" onPress={() => navigation.navigate('Register')}>
              สมัครสมาชิก
            </Button>
          </View>
        )}

        <Button mode="text" onPress={() => navigation.navigate('UiKit')}>
          ดูตัวอย่าง UI Kit
        </Button>
      </View>

      <AppFooter />

      <ConfirmDialog
        visible={logoutConfirmVisible}
        title="ออกจากระบบ"
        message="ต้องการออกจากระบบใช่ไหม? ต้อง login ใหม่ถึงจะใช้งานต่อได้"
        confirmLabel="ออกจากระบบ"
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  subtitle: { color: '#4b5563' },
  row: { flexDirection: 'row', gap: 12 },
});
