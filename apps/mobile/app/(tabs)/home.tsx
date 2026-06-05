import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { apiFetch } from '../../src/lib/api';

export default function HomeScreen() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/talents').then((data) => setItems(data.items ?? []));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Kiminle görüşmek istersin?</Text>
      <TextInput placeholder="Uzman ara" style={{ borderWidth: 1, padding: 12 }} />
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
