import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { apiFetch } from '../../src/lib/api';

export default function TalentDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [talent, setTalent] = useState<any>(null);

  useEffect(() => {
    apiFetch(`/talents/${slug}`).then(setTalent);
  }, [slug]);

  if (!talent) return <Text>Yükleniyor...</Text>;

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
          <Link href={`/booking/create/${talent.id}`}>Müsait saatleri gör</Link>
        </View>
      ))}
    </ScrollView>
  );
}
