'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = `/login?redirect=/bookings/${resolvedId}`;
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings/${resolvedId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Not found');
          return response.json();
        })
        .then(setBooking)
        .catch(() => setError(true));
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

  if (error) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fee2e2', borderRadius: '16px', border: '1px solid #fca5a5', maxWidth: '600px', margin: '40px auto' }}>
          <h2 style={{ color: '#b91c1c', fontSize: '24px', marginBottom: '16px' }}>Bu rezervasyon yüklenemedi.</h2>
          <p style={{ color: '#7f1d1d', marginBottom: '24px' }}>
            API bağlantısını veya rezervasyon ID'sini kontrol edin.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
        <PageHeader title="Rezervasyon Detayı" description="Görüşme bilgileriniz ve video odasına erişim." />
        
        <Card>
          {booking ? (
            <div style={{ display: 'grid', gap: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                    {booking.talent?.displayName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Uzman</div>
                    <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#111827' }}>{booking.talent?.displayName}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '6px 16px', 
                    backgroundColor: booking.status === 'CONFIRMED' ? '#d1fae5' : '#f3f4f6', 
                    color: booking.status === 'CONFIRMED' ? '#065f46' : '#374151', 
                    borderRadius: '99px', 
                    fontSize: '14px', 
                    fontWeight: 700 
                  }}>
                    {booking.status === 'CONFIRMED' ? 'ONAYLANDI' : booking.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Tarih ve Saat</div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
                    {new Date(booking.startsAt).toLocaleString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Görüşme Süresi</div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
                    {Math.round((new Date(booking.endsAt).getTime() - new Date(booking.startsAt).getTime()) / 60000)} Dakika
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Ödeme Durumu</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#059669', fontSize: '16px' }}>
                    ✅ Demo Tahsil Edildi
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Toplam Tutar</div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
                    {(booking.priceCents / 100).toLocaleString('tr-TR')} {booking.currency}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '24px', borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center', marginTop: '10px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', color: '#1e3a8a' }}>Görüşme Odası {booking.videoRoomId ? 'Hazır' : 'Hazırlanıyor'}</h3>
                <p style={{ color: '#1e40af', marginBottom: '24px', fontSize: '15px' }}>
                  Görüşme saatinden 5 dakika önce odaya katılabilirsiniz. Lütfen mikrofon ve kamera erişimine izin verin.
                </p>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      onClick={() => (window.location.href = `/call/${id}`)}
                      style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#2563eb' }}
                    >
                      🎥 Görüşme Odasına Git
                    </Button>
                  )}
                  <Button variant="secondary" onClick={cancelBooking} style={{ padding: '14px 24px', fontSize: '16px', color: '#ef4444', borderColor: '#ef4444' }}>
                    İptal Et
                  </Button>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Rezervasyon bilgileri yükleniyor...</div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
