import { useLocalSearchParams } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyon Detayı</Text>
      <Text>Rezervasyon ID: {bookingId}</Text>
      <Text>Durum rozeti, uzman bilgisi, tarih/saat, görüşme tipi ve video odası burada gösterilir.</Text>
      <Button title="Görüşmeye katıl" onPress={() => null} />
      <Button title="İptal et" onPress={() => null} />
    </View>
  );
}
