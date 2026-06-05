import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, Switch, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [terms, setTerms] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [form, setForm] = useState({
    firstName: 'Ayşe',
    lastName: 'Yılmaz',
    email: 'ayse@example.com',
    password: 'StrongPassword123!',
    phone: '+905551112233',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Kayıt ol</Text>
      {Object.entries(form).map(([key, value]) => (
        <TextInput key={key} value={value} onChangeText={(text) => setForm((current) => ({ ...current, [key]: text }))} placeholder={key} style={{ borderWidth: 1, padding: 12 }} secureTextEntry={key === 'password'} />
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Kullanım koşullarını kabul ediyorum</Text>
        <Switch value={terms} onValueChange={setTerms} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Gizlilik politikasını kabul ediyorum</Text>
        <Switch value={privacy} onValueChange={setPrivacy} />
      </View>
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="small" /> : null}
      <Button
        title={loading ? 'Kayıt oluşturuluyor...' : 'Kayıt ol'}
        disabled={loading}
        onPress={async () => {
          try {
            setLoading(true);
            setError('');
            await register({
              ...form,
              consents: [
                { type: 'TERMS_OF_SERVICE', version: '2026-06-05', accepted: terms },
                { type: 'PRIVACY_POLICY', version: '2026-06-05', accepted: privacy },
              ],
            });
            router.replace('/(tabs)/home');
          } catch (registerError) {
            setError(registerError instanceof Error ? registerError.message : 'Kayıt oluşturulamadı.');
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
}
