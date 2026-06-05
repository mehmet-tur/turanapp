'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';
import { apiFetch } from '../../../lib/api';

export default function TalentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('');
  const [talent, setTalent] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [accepted, setAccepted] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => {
      setSlug(resolvedSlug);
      apiFetch(`/talents/${resolvedSlug}`).then(setTalent).catch(() => null);
      const from = new Date().toISOString().slice(0, 10);
      const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      apiFetch<{ items: any[] }>(`/talents/${resolvedSlug}/slots?from=${from}&to=${to}`)
        .then((data) => setSlots(data.items ?? []))
        .catch(() => setSlots([]));
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
      window.location.href = '/login';
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
      setMessage(data?.error?.message ?? 'Rezervasyon oluşturulamadı.');
      return;
    }
    window.location.href = `/bookings/${data.id}`;
  }

  return (
    <AppShell>
      <PageHeader title={talent?.displayName ?? 'Uzman Detayı'} description={talent?.title ?? 'Yükleniyor...'} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <Card>
          <p>{talent?.bio}</p>
          <p>Kategori: {talent?.category}</p>
          <p>Fiyat: {talent ? `${(talent.priceCents / 100).toLocaleString('tr-TR')} ${talent.currency}` : '-'}</p>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            KVKK ve kamera/ses işleme onayını veriyorum.
          </label>
          <p style={{ color: '#6b7280' }}>Demo ödeme açıklaması: Bu prototipte gerçek tahsilat yapılmaz.</p>
        </Card>
        <Card>
          <h3>Müsait Slotlar</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {slots.map((slot) => (
              <button
                key={slot.startsAt}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderRadius: 12,
                  border: selectedSlot?.startsAt === slot.startsAt ? '2px solid #111827' : '1px solid #d1d5db',
                  background: '#fff',
                }}
              >
                <div>{new Date(slot.startsAt).toLocaleString('tr-TR')}</div>
                <div>{slot.durationMinutes} dk · {(slot.priceCents / 100).toLocaleString('tr-TR')} {slot.currency}</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button fullWidth onClick={createBooking} disabled={!selectedSlot || !accepted}>
              Rezervasyon Oluştur
            </Button>
            {message ? <p style={{ color: '#b91c1c' }}>{message}</p> : null}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
