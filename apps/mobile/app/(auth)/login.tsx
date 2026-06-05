import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Button, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@unluapp.local');
  const [password, setPassword] = useState('Password123!');
  const login = useAuthStore((state) => state.login);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Giriş yap</Text>
      <TextInput placeholder="E-posta" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12 }} />
      <TextInput placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12 }} />
      <Button
        title="Giriş yap"
        onPress={async () => {
          await login(email, password);
          router.replace('/(tabs)/home');
        }}
      />
      <Link href="/(auth)/register">Kayıt ol</Link>
    </View>
  );
}
