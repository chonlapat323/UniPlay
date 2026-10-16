import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { clearToken, getToken } from '../lib/token';
import Button from '../components/Button';
import { colors, spacing, fontSize } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [hasToken, setHasToken] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getToken().then((token) => setHasToken(!!token));
    }, []),
  );

  async function handleLogout() {
    await clearToken();
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UniPlay Admin</Text>

      {hasToken ? (
        <>
          <Text style={styles.subtitle}>เข้าสู่ระบบแล้ว (มี access_token เก็บอยู่)</Text>
          <Button title="ออกจากระบบ" variant="secondary" onPress={handleLogout} />
        </>
      ) : (
        <View style={styles.row}>
          <Button title="เข้าสู่ระบบ" onPress={() => navigation.navigate('Login')} />
          <Button
            title="สมัครสมาชิก"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  title: { fontSize: fontSize.title, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: fontSize.base, color: colors.textMuted },
  row: { flexDirection: 'row', gap: spacing.sm + 4 },
});
