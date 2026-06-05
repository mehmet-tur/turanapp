import { Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Profil</Text>
      <Text>Hesap bilgileri ve oturum yönetimi.</Text>
    </View>
  );
}
