import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { apiFetch } from '../../src/lib/api';

type TalentDetail = {
  id: string;
  slug: string;
  displayName: string;
  title: string;
  bio: string;
  category: string | null;
  sessionTypes: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    priceCents: number;
    currency: string;
  }>;
};

export default function TalentDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [talent, setTalent] = useState<TalentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    apiFetch<TalentDetail>(`/talents/${slug}`)
      .then(setTalent)
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : 'Uzman detayı alınamadı.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={{ color: '#b91c1c', padding: 24 }}>{error}</Text>;
  if (!talent) return <Text style={{ padding: 24 }}>Uzman bulunamadı.</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{talent.displayName}</Text>
      <Text>{talent.title}</Text>
      <Text>{talent.bio}</Text>
      {talent.sessionTypes.map((sessionType: any) => (
        <View key={sessionType.id} style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text>{sessionType.title}</Text>
          <Text>{sessionType.durationMinutes} dk</Text>
          <Text>{(sessionType.priceCents / 100).toLocaleString('tr-TR')} {sessionType.currency}</Text>
          <Link href={`/booking/create/${talent.slug}`}>Müsait saatleri gör</Link>
        </View>
      ))}
    </ScrollView>
  );
}
