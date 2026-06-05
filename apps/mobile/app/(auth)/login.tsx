import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@unluapp.local');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Giriş yap</Text>
      <TextInput placeholder="E-posta" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12 }} />
      <TextInput placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12 }} />
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="small" /> : null}
      <Button
        title={loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
        disabled={loading}
        onPress={async () => {
          try {
            setLoading(true);
            setError('');
            await login(email, password);
            router.replace('/(tabs)/home');
          } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : 'Giriş başarısız.');
          } finally {
            setLoading(false);
          }
        }}
      />
      <Link href="/(auth)/register">Kayıt ol</Link>
    </View>
  );
}
