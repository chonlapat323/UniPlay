import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText, Menu } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { createUser, ApiError } from '../lib/api';
import { ROLES } from '../lib/roles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleId, setRoleId] = useState(ROLES[0].id);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedRole = ROLES.find((role) => role.id === roleId);

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
    <View style={styles.screen}>
      <AppHeader title="สมัครสมาชิก" onBack={() => navigation.navigate('Home')} />

      <View style={styles.container}>
      <Text variant="bodyMedium" style={styles.subtitle}>
        สร้างบัญชีใหม่เพื่อเริ่มใช้งาน UniPlay
      </Text>

      <TextInput
        label="ชื่อ"
        value={name}
        onChangeText={setName}
        mode="outlined"
        left={<TextInput.Icon icon="account-outline" />}
        style={styles.field}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon icon="email-outline" />}
        style={styles.field}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onPress={() => setShowPassword((prev) => !prev)}
          />
        }
        style={styles.field}
      />

      <Menu
        visible={roleMenuOpen}
        onDismiss={() => setRoleMenuOpen(false)}
        anchor={
          <Button
            mode="outlined"
            icon="shield-account-outline"
            onPress={() => setRoleMenuOpen(true)}
            style={styles.roleButton}
          >
            บทบาท: {selectedRole?.name}
          </Button>
        }
      >
        {ROLES.map((role) => (
          <Menu.Item
            key={role.id}
            title={role.name}
            onPress={() => {
              setRoleId(role.id);
              setRoleMenuOpen(false);
            }}
          />
        ))}
      </Menu>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submitButton}>
        สมัครสมาชิก
      </Button>

      <Button mode="text" onPress={() => navigation.navigate('Login')}>
        มีบัญชีแล้ว? เข้าสู่ระบบ
      </Button>
      </View>

      <AppFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  subtitle: { marginBottom: 24, color: '#6b7280' },
  field: { marginBottom: 8 },
  roleButton: { marginTop: 8, marginBottom: 8, alignSelf: 'flex-start' },
  submitButton: { marginTop: 8, marginBottom: 8, paddingVertical: 4 },
});
