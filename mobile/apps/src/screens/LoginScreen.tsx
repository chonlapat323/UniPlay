import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { login, ApiError } from '../lib/api';
import { saveToken } from '../lib/token';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { colors, spacing, fontSize } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('ui.test@uniplay.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      const { access_token } = await login({ email, password });
      await saveToken(access_token);
      navigation.replace('Home');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="student1@uniplay.test"
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="********"
      />

      {error && <Text style={styles.formError}>{error}</Text>}

      <Button title="เข้าสู่ระบบ" onPress={handleSubmit} loading={loading} style={styles.submitButton} />

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize: fontSize.title, fontWeight: '600', marginBottom: spacing.lg, color: colors.text },
  formError: { color: colors.error, fontSize: fontSize.base, marginBottom: spacing.md },
  submitButton: { marginBottom: spacing.md },
  link: { color: colors.link, textAlign: 'center', fontSize: fontSize.base },
});
