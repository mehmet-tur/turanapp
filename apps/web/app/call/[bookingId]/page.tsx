'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Button } from '../../../components/Button';
import { CallControls } from '../../../components/CallControls';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

type Phase = 'loading' | 'lobby' | 'in-call';

export default function CallRoomPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState('');
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [joinedAt, setJoinedAt] = useState<Date | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inCallVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    params.then(({ bookingId: resolvedId }) => {
      setBookingId(resolvedId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = `/login?redirect=/call/${resolvedId}`;
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings/${resolvedId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setBooking(data);
          setPhase('lobby');
        })
        .catch(() => setError('Görüşme bilgisi alınamadı.'));
    });
  }, [params]);

  useEffect(() => {
    if (!joinedAt) return;
    const interval = setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => clearInterval(interval);
  }, [joinedAt]);

  const timer = useMemo(() => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  }, [seconds]);

  async function testMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => null);
      }
      setError('');
    } catch {
      setError('Kamera/mikrofon izni alınamadı. Placeholder modunda devam edebilirsiniz.');
    }
  }

  useEffect(() => {
    if (phase === 'in-call' && mediaStream && inCallVideoRef.current && cameraEnabled) {
      inCallVideoRef.current.srcObject = mediaStream;
      inCallVideoRef.current.play().catch(() => null);
    }
  }, [phase, mediaStream, cameraEnabled]);

  async function joinCall() {
    const token = localStorage.getItem('access_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings/${bookingId}/start`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    });
    setJoinedAt(new Date());
    setPhase('in-call');
  }

  async function endCall() {
    const token = localStorage.getItem('access_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/bookings/${bookingId}/complete`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    });
    streamRef.current?.getTracks().forEach((track) => track.stop());
    window.location.href = `/bookings/${bookingId}?completed=1`;
  }

  return (
    <AppShell>
      <PageHeader title="Görüşme Odası" description="Mock video room deneyimi" />
      {phase === 'loading' ? <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Bağlantı kuruluyor...</div> : null}
      
      {phase === 'lobby' ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '24px', overflow: 'hidden', minHeight: '400px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
              {!mediaStream && (
                <div style={{ zIndex: 10, color: 'white', textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                  <p>Kamera erişimi bekleniyor</p>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', padding: '16px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Button variant="secondary" onClick={testMedia} style={{ padding: '12px 24px', flex: 1 }}>Cihazları Test Et</Button>
              <Button onClick={joinCall} style={{ padding: '12px 24px', flex: 1, backgroundColor: '#10b981' }}>Görüşmeye Katıl</Button>
            </div>
            {error ? <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px', border: '1px solid #fca5a5' }}>{error}</div> : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Ön Oda (Pre-call)</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '20px' }}>
                Görüşmeye katılmadan önce kamera ve mikrofonunuzu test edebilirsiniz. Görüşme süreniz, odaya katıldığınız an başlayacaktır.
              </p>
              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Karşı Taraf</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#111827', marginBottom: '12px' }}>{booking?.talent?.displayName ?? 'Uzman'}</div>
                
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Rezervasyon Durumu</div>
                <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                  {booking?.status ?? 'CONFIRMED'}
                </span>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#4f46e5' }}>Güvenlik Notu</h3>
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.5, margin: 0 }}>
                KVKK gereği kamera ve ses verisi bu demo oturumunda yalnızca cihazınızda geçici olarak işlenir, hiçbir sunucuya kaydedilmez.
              </p>
            </Card>
          </div>
        </div>
      ) : null}

      {phase === 'in-call' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '24px', overflow: 'hidden', height: '600px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 20, display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '99px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 2s infinite' }}></div>
                <span style={{ color: 'white', fontWeight: 600 }}>{timer}</span>
              </div>
              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '99px', color: 'white', fontWeight: 600 }}>
                {booking?.talent?.displayName ?? 'Karşı Taraf'} (Remote)
              </div>
              
              <div style={{ color: 'white', textAlign: 'center', zIndex: 10 }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold', margin: '0 auto 24px auto' }}>
                  {booking?.talent?.displayName?.charAt(0) || '?'}
                </div>
                <h3>Sesli İletişim Modu (Demo)</h3>
                <p style={{ color: '#9ca3af' }}>Agora Video Entegrasyonu (Phase 3)</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <CallControls
                micEnabled={micEnabled}
                cameraEnabled={cameraEnabled}
                onToggleMic={() => setMicEnabled((current) => !current)}
                onToggleCamera={() => setCameraEnabled((current) => !current)}
                onEnd={endCall}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden', height: '240px', position: 'relative' }}>
              {cameraEnabled && mediaStream ? (
                <video ref={inCallVideoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  Kamera Kapalı
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '99px', color: 'white', fontSize: '12px' }}>
                Siz ({JSON.parse(localStorage.getItem('current_user') ?? '{}')?.role === 'TALENT' ? 'Uzman' : 'Kullanıcı'})
              </div>
            </div>

            <Card>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Görüşme Bilgisi</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Başlangıç</span>
                  <span style={{ fontWeight: 600 }}>{joinedAt?.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Maksimum Süre</span>
                  <span style={{ fontWeight: 600 }}>{booking?.durationMinutes ?? 15} Dk</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Bağlantı</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Mükemmel</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
