import { useEffect, useState } from 'react';
import { Alert, Button, Linking, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { apiFetch, buildCallRoomUrl } from '../../src/lib/api';

type BookingDetail = {
  id: string;
  status: string;
  startsAt: string;
  endsAt: string;
  priceCents: number;
  currency: string;
  videoRoomId: string | null;
  talent: {
    displayName: string;
  };
};

export default function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    setError('');
    apiFetch<BookingDetail>(`/bookings/${bookingId}`)
      .then(setBooking)
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Rezervasyon detayı alınamadı.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  async function openCallRoom() {
    if (!bookingId) return;
    const url = buildCallRoomUrl(bookingId);
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Bağlantı açılamadı', url);
      return;
    }
    await Linking.openURL(url);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 24, gap: 12 }}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, padding: 24, gap: 12 }}>
        <Text style={{ color: '#b91c1c' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyon Detayı</Text>
      <Text>Rezervasyon ID: {bookingId}</Text>
      <Text>Uzman: {booking?.talent.displayName ?? '-'}</Text>
      <Text>Durum: {booking?.status ?? '-'}</Text>
      <Text>Tarih/Saat: {booking ? new Date(booking.startsAt).toLocaleString('tr-TR') : '-'}</Text>
      <Text>Tutar: {booking ? `${(booking.priceCents / 100).toLocaleString('tr-TR')} ${booking.currency}` : '-'}</Text>
      <Text>Video odası: {booking?.videoRoomId ?? 'Hazırlanıyor'}</Text>
      <Button title="Web Görüşme Odasını Aç" onPress={() => openCallRoom().catch(() => null)} />
    </View>
  );
}
