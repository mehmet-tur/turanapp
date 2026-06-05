import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuthStore } from '../../src/store/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Profil</Text>
      <Text>Hesap bilgileri ve oturum yönetimi.</Text>
      <Text>Ad Soyad: {user ? `${user.firstName} ${user.lastName}` : '-'}</Text>
      <Text>E-posta: {user?.email ?? '-'}</Text>
      <Text>Rol: {user?.role ?? '-'}</Text>
      <Button
        title="Çıkış yap"
        onPress={async () => {
          await logout();
          router.replace('/(auth)/login');
        }}
      />
    </View>
  );
}
