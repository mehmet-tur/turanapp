import { AppShell } from '../../components/AppShell';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { apiFetch } from '../../lib/api';

async function getTalents() {
  try {
    return await apiFetch<{ items: any[] }>('/talents');
  } catch {
    return { items: [] };
  }
}

export default async function TalentsPage() {
  const data = await getTalents();
  return (
    <AppShell>
      <PageHeader title="Uzmanlar" description="Kategori, fiyat ve uygunluk durumuna göre keşfedin." />
      <input placeholder="Uzman ara" style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #d1d5db', marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {data.items.map((item) => (
          <Card key={item.id}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: '#e5e7eb' }} />
              <strong>{item.displayName}</strong>
              <span>{item.category}</span>
              <span>{item.title}</span>
              <span>Başlangıç: {(item.priceCents / 100).toLocaleString('tr-TR')} {item.currency}</span>
              <span>⭐ 4.9 (demo)</span>
              <a href={`/talents/${item.slug}`}>Profili Gör</a>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
