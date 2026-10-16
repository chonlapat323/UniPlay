import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { createUser, ApiError } from '../lib/api';
import { ROLES } from '../lib/roles';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { colors, spacing, radius, fontSize } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(ROLES[0].id);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      await createUser({ email, password, name, roleId });
      navigation.replace('Login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สมัครสมาชิก</Text>

      <TextField label="ชื่อ" value={name} onChangeText={setName} placeholder="Somchai" />

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

      <Text style={styles.label}>บทบาท</Text>
      <View style={styles.roleRow}>
        {ROLES.map((role) => (
          <Pressable
            key={role.id}
            onPress={() => setRoleId(role.id)}
            style={[styles.roleChip, roleId === role.id && styles.roleChipActive]}
          >
            <Text style={[styles.roleChipText, roleId === role.id && styles.roleChipTextActive]}>
              {role.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {error && <Text style={styles.formError}>{error}</Text>}

      <Button title="สมัครสมาชิก" onPress={handleSubmit} loading={loading} style={styles.submitButton} />

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>มีบัญชีแล้ว? เข้าสู่ระบบ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontSize: fontSize.title, fontWeight: '600', marginBottom: spacing.lg, color: colors.text },
  label: { fontSize: fontSize.base, fontWeight: '500', color: colors.label, marginBottom: spacing.xs },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  roleChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.surface,
  },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleChipText: { fontSize: fontSize.sm, color: colors.label },
  roleChipTextActive: { color: colors.primaryText, fontWeight: '600' },
  formError: { color: colors.error, fontSize: fontSize.base, marginBottom: spacing.md },
  submitButton: { marginBottom: spacing.md },
  link: { color: colors.link, textAlign: 'center', fontSize: fontSize.base },
});
