import { useLocalSearchParams } from 'expo-router';
import { Button, ScrollView, Switch, Text, TextInput, View } from 'react-native';

export default function BookingCreateScreen() {
  const { talentId } = useLocalSearchParams<{ talentId: string }>();
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyon Oluştur</Text>
      <Text>Uzman ID: {talentId}</Text>
      <Text>1. Görüşme tipini seç</Text>
      <Text>2. Slot seç</Text>
      <TextInput placeholder="Notunuz" style={{ borderWidth: 1, padding: 12 }} multiline />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Kamera/ses işleme onayı</Text>
        <Switch value />
      </View>
      <Text>Özet: uzman adı, görüşme tipi, tarih/saat, süre, tutar</Text>
      <Button title="Mock ödeme ile tamamla" onPress={() => null} />
    </ScrollView>
  );
}
