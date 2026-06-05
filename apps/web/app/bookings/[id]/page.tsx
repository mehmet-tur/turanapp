'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      const token = localStorage.getItem('access_token');
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings/${resolvedId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then(setBooking);
    });
  }, [params]);

  async function cancelBooking() {
    const token = localStorage.getItem('access_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: 'Demo iptali' }),
    });
    window.location.reload();
  }

  return (
    <AppShell>
      <PageHeader title="Rezervasyon Detayı" description="Görüşme bilgileri ve video odası erişimi." />
      <Card>
        {booking ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Badge>{booking.status}</Badge>
            <div>Uzman: {booking.talent.displayName}</div>
            <div>Tarih/Saat: {new Date(booking.startsAt).toLocaleString('tr-TR')}</div>
            <div>Süre: {Math.round((new Date(booking.endsAt).getTime() - new Date(booking.startsAt).getTime()) / 60000)} dk</div>
            <div>Tutar: {(booking.priceCents / 100).toLocaleString('tr-TR')} {booking.currency}</div>
            <div>Payment Status: demo akışında capture edildi.</div>
            <div>Video Room Status: {booking.videoRoomId ? 'Hazır' : 'Hazırlanıyor'}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button onClick={() => (window.location.href = `/call/${id}`)}>Görüşme Odasına Git</Button>
              <Button variant="secondary" onClick={cancelBooking}>İptal Et</Button>
            </div>
          </div>
        ) : (
          <div>Yükleniyor...</div>
        )}
      </Card>
    </AppShell>
  );
}
