import { Text, View } from 'react-native';

export default function BookingsScreen() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyonlarım</Text>
      <Text>Yaklaşan, geçmiş ve iptal edilen rezervasyonlar burada listelenir.</Text>
    </View>
  );
}
