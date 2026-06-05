import { useState } from 'react';
import { Link } from 'expo-router';
import { Button, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('Customer123!ChangeMe');
  const login = useAuthStore((state) => state.login);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Giriş yap</Text>
      <TextInput placeholder="E-posta" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12 }} />
      <TextInput placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12 }} />
      <Button title="Giriş yap" onPress={() => login(email, password)} />
      <Link href="/(auth)/register">Kayıt ol</Link>
    </View>
  );
}
