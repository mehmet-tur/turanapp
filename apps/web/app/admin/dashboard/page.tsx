'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '../../../components/AdminShell';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/summary`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setData);
  }, []);

  const cards = data
    ? [
        ['Toplam kullanıcı', data.usersCount],
        ['Onaylı uzman', data.approvedTalentsCount],
        ['Toplam rezervasyon', data.bookingsCount],
        ['Platform geliri', `${(data.platformRevenueCents / 100).toLocaleString('tr-TR')} TRY`],
      ]
    : [];

  return (
    <AdminShell>
      <PageHeader title="Admin Dashboard" description="Platformın ana metrikleri ve yönetim kısayolları." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(([label, value]) => (
          <Card key={String(label)}>
            <div style={{ color: '#666' }}>{label}</div>
            <strong>{String(value)}</strong>
          </Card>
        ))}
      </div>
      <nav style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <a href="/admin/talents">Uzman başvuruları</a>
        <a href="/admin/bookings">Rezervasyonlar</a>
        <a href="/admin/users">Kullanıcılar</a>
      </nav>
    </AdminShell>
  );
}
