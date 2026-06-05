'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Badge } from '../../../components/Badge';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

export default function TalentDashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('current_user') ?? '{}') : {};

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/bookings`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const filtered = Array.isArray(data) ? data.filter((item) => item.talent?.userId === user.id || item.talent?.publicName) : [];
        setItems(filtered);
      });
  }, [user.id]);

  const today = useMemo(() => items.filter((item) => new Date(item.startsAt).toDateString() === new Date().toDateString()), [items]);
  const completed = useMemo(() => items.filter((item) => item.status === 'COMPLETED'), [items]);

  return (
    <AppShell>
      <PageHeader title="Talent Dashboard" description="Yaklaşan görüşmeler ve demo katılım akışı." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card><div>Yaklaşan Görüşmeler</div><strong>{items.length}</strong></Card>
        <Card><div>Bugünkü Görüşmeler</div><strong>{today.length}</strong></Card>
        <Card><div>Tamamlanan</div><strong>{completed.length}</strong></Card>
        <Card><div>Toplam Kazanç</div><strong>Demo</strong></Card>
      </div>
      <Card>
        <h3>Yaklaşan Görüşmeler</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eef2f7', paddingTop: 12 }}>
              <div>
                <strong>{item.customer?.firstName} {item.customer?.lastName}</strong>
                <div>{new Date(item.startsAt).toLocaleString('tr-TR')}</div>
                <div>{item.sessionType?.durationMinutes ?? 15} dk</div>
              </div>
              <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
                <Badge>{item.status}</Badge>
                <a href={`/call/${item.id}`}>Görüşmeye Katıl</a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
