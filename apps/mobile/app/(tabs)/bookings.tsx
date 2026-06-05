import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { apiFetch } from '../../src/lib/api';

type BookingListItem = {
  id: string;
  status: string;
  startsAt: string;
  talent: {
    displayName: string;
  };
  sessionType: {
    title: string;
  };
};

export default function BookingsScreen() {
  const [items, setItems] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch<{ items: BookingListItem[] }>('/bookings')
      .then((data) => setItems(data.items ?? []))
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Rezervasyonlar alınamadı.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyonlarım</Text>
      {loading ? <ActivityIndicator size="large" /> : null}
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      {!loading && !items.length && !error ? <Text>Henüz rezervasyon bulunmuyor.</Text> : null}
      {items.map((item) => (
        <Link key={item.id} href={`/booking/${item.id}`}>
          <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.talent.displayName}</Text>
            <Text>{new Date(item.startsAt).toLocaleString('tr-TR')}</Text>
            <Text>{item.sessionType.title}</Text>
            <Text>Durum: {item.status}</Text>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}
