'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_WEB_API_URL ?? 'http://localhost:4000/api'}/admin/dashboard`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setData);
  }, []);

  const cards = data
    ? [
        ['Toplam kullanıcı', data.totalUsers],
        ['Onay bekleyen uzman', data.pendingTalents],
        ['Onaylı uzman', data.approvedTalents],
        ['Yaklaşan rezervasyon', data.upcomingBookings],
        ['Mock ödeme toplamı', `${(data.mockPaymentTotalMinor / 100).toLocaleString('tr-TR')} TRY`],
      ]
    : [];

  return (
    <main style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(([label, value]) => (
          <div key={String(label)} style={{ background: 'white', borderRadius: 16, padding: 20 }}>
            <div style={{ color: '#666' }}>{label}</div>
            <strong>{String(value)}</strong>
          </div>
        ))}
      </div>
      <nav style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <a href="/admin/talents">Uzman başvuruları</a>
        <a href="/admin/bookings">Rezervasyonlar</a>
        <a href="/admin/users">Kullanıcılar</a>
      </nav>
    </main>
  );
}
