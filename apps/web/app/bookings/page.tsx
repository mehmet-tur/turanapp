'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';

export default function BookingsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setItems(data.items ?? []));
  }, []);

  const groups = useMemo(
    () => ({
      upcoming: items.filter((item) => ['CONFIRMED', 'IN_PROGRESS'].includes(item.status)),
      completed: items.filter((item) => item.status === 'COMPLETED'),
      cancelled: items.filter((item) => item.status.includes('CANCELLED') || item.status === 'REFUNDED'),
    }),
    [items],
  );

  return (
    <AppShell>
      <PageHeader title="Rezervasyonlarım" description="Yaklaşan, tamamlanan ve iptal edilen görüşmeleri yönetin." />
      <div style={{ display: 'grid', gap: 20 }}>
        {[
          ['Yaklaşan Görüşmeler', groups.upcoming],
          ['Tamamlanan Görüşmeler', groups.completed],
          ['İptal Edilenler', groups.cancelled],
        ].map(([title, sectionItems]) => (
          <Card key={String(title)}>
            <h3>{String(title)}</h3>
            {Array.isArray(sectionItems) && sectionItems.length ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {sectionItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid #eef2f7', paddingTop: 12 }}>
                    <div>
                      <strong>{item.talent.displayName}</strong>
                      <div>{new Date(item.startsAt).toLocaleString('tr-TR')}</div>
                      <div>{item.sessionType.title}</div>
                    </div>
                    <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
                      <Badge>{item.status}</Badge>
                      <a href={`/bookings/${item.id}`}>Detayı Gör</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Kayıt yok" description="Bu bölümde gösterilecek rezervasyon bulunmuyor." />
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
