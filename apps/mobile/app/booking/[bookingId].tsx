import { useLocalSearchParams } from 'expo-router';
import { Button, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

export default function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyon Detayı</Text>
      <Text>Rezervasyon ID: {bookingId}</Text>
      <Text>Durum rozeti, uzman bilgisi, tarih/saat, görüşme tipi ve video odası burada gösterilir.</Text>
      <Button title="Görüşmeye katıl" onPress={() => null} />
      <Button title="Web görüşme linkini aç" onPress={() => Linking.openURL(`http://localhost:3000/call/${bookingId}`)} />
      <Button title="İptal et" onPress={() => null} />
    </View>
  );
}
