'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { apiFetch } from '../../../lib/api';

export default function TalentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('');
  const [talent, setTalent] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [accepted, setAccepted] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => {
      setSlug(resolvedSlug);
      apiFetch(`/talents/${resolvedSlug}`).then(setTalent).catch(() => null);
      const from = new Date().toISOString().slice(0, 10);
      const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      apiFetch<{ items: any[] }>(`/talents/${resolvedSlug}/slots?from=${from}&to=${to}`)
        .then((data) => {
          setSlots(data.items ?? []);
          setLoading(false);
        })
        .catch(() => {
          setSlots([]);
          setLoading(false);
        });
    });
  }, [params]);

  const bookingPayload = useMemo(() => {
    if (!selectedSlot || !talent) return null;
    return {
      talentSlug: slug,
      startsAt: selectedSlot.startsAt,
      durationMinutes: selectedSlot.durationMinutes,
      notes: 'Web prototip rezervasyonu',
      acceptedCameraAudioConsent: accepted,
    };
  }, [accepted, selectedSlot, slug, talent]);

  async function createBooking() {
    if (!bookingPayload) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      window.location.href = `/login?redirect=/talents/${slug}`;
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data?.error?.message ?? 'Rezervasyon oluşturulamadı. Demo API durumunu kontrol edin.');
      return;
    }
    window.location.href = `/bookings/${data.id}`;
  }

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          Yükleniyor...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', paddingBottom: '60px' }}>
        
        {/* Sol Kolon - Profil Bilgileri */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '36px', fontWeight: 'bold', flexShrink: 0 }}>
              {talent?.displayName?.charAt(0) || '?'}
            </div>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#111827' }}>{talent?.displayName ?? 'Uzman Detayı'}</h1>
              <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '99px', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                {talent?.category || 'Kategori'}
              </span>
              <p style={{ margin: 0, fontSize: '18px', color: '#4b5563' }}>{talent?.title ?? '...'}</p>
            </div>
          </div>
          
          <Card>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Hakkında</h2>
            <p style={{ lineHeight: 1.6, color: '#374151', fontSize: '16px' }}>{talent?.bio || 'Biyografi bulunamadı.'}</p>
          </Card>

          <Card>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Güven & Entegrasyon (Demo Notu)</h2>
            <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a', color: '#92400e', fontSize: '14px', lineHeight: 1.5 }}>
              <strong>Bu prototipte ödeme mock olarak tamamlanır.</strong><br/>
              Production aşamasında iyzico marketplace entegrasyonu kullanılacaktır. Video görüşmeleri ise Agora altyapısı ile sağlanacaktır.
            </div>
          </Card>
        </div>

        {/* Sağ Kolon - Rezervasyon */}
        <div>
          <div style={{ position: 'sticky', top: '24px' }}>
            <Card>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>Uygun Saatler</h3>
              
              {slots.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px', color: '#6b7280' }}>
                  Şu an için uygun slot bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.startsAt === slot.startsAt;
                    const dateObj = new Date(slot.startsAt);
                    const timeString = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                    const dateString = dateObj.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
                    
                    return (
                      <button
                        key={slot.startsAt}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          textAlign: 'left',
                          padding: '16px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                          background: isSelected ? '#eff6ff' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: isSelected ? 700 : 500, color: '#111827', fontSize: '16px' }}>{timeString}</div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{dateString}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600, color: '#2563eb' }}>{(slot.priceCents / 100).toLocaleString('tr-TR')} {slot.currency}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{slot.durationMinutes} dk</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', color: '#374151', lineHeight: 1.4 }}>
                  <input 
                    type="checkbox" 
                    checked={accepted} 
                    onChange={(event) => setAccepted(event.target.checked)} 
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#2563eb' }}
                  />
                  <span>
                    <strong>KVKK</strong> aydınlatma metnini ve <br/>
                    <strong>Kamera/Ses işleme</strong> koşullarını onaylıyorum.
                  </span>
                </label>

                <Button 
                  fullWidth 
                  onClick={createBooking} 
                  disabled={!selectedSlot || !accepted}
                  style={{ 
                    padding: '16px', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    backgroundColor: (!selectedSlot || !accepted) ? '#9ca3af' : '#2563eb'
                  }}
                >
                  {selectedSlot ? 'Rezervasyon Oluştur' : 'Bir slot seçin'}
                </Button>
                
                {message ? (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px', border: '1px solid #fca5a5' }}>
                    {message}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
