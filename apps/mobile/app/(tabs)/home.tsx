import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { apiFetch } from '../../src/lib/api';

type TalentListItem = {
  id: string;
  slug: string;
  displayName: string;
  title: string;
  category: string | null;
  priceCents: number;
  currency: string;
};

export default function HomeScreen() {
  const [items, setItems] = useState<TalentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTalents() {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch<{ items: TalentListItem[] }>('/talents');
      setItems(data.items ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Uzman listesi alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTalents().catch(() => null);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Kiminle görüşmek istersin?</Text>
      <TextInput placeholder="Uzman ara" style={{ borderWidth: 1, padding: 12 }} />
      {loading ? <ActivityIndicator size="large" /> : null}
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      {!loading && !items.length && !error ? <Text>Şu anda listelenecek uzman bulunamadı.</Text> : null}
      {items.map((item) => (
        <Link key={item.id} href={`/talent/${item.slug}`}>
          <View style={{ borderWidth: 1, borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.displayName}</Text>
            <Text>{item.title}</Text>
            <Text>{item.category}</Text>
            <Text>Başlangıç: {(item.priceCents / 100).toLocaleString('tr-TR')} {item.currency}</Text>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}
