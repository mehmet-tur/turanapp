'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { CallControls } from '../../../components/CallControls';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';
import { VideoTile } from '../../../components/VideoTile';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    params.then(({ bookingId: resolvedId }) => {
      setBookingId(resolvedId);
      const token = localStorage.getItem('access_token');
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => null);
      }
      setError('');
    } catch {
      setError('Kamera/mikrofon izni alınamadı. Demo placeholder ile devam edebilirsiniz.');
    }
  }

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
      {phase === 'loading' ? <div>Yükleniyor...</div> : null}
      {phase === 'lobby' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <Card>
            <h3>Pre-call Lobby</h3>
            <p>Kamera ve mikrofon izinlerini kontrol edin, ardından görüşmeye katılın.</p>
            <div style={{ display: 'grid', gap: 12 }}>
              <video ref={videoRef} muted playsInline style={{ width: '100%', borderRadius: 16, background: '#111827', minHeight: 320 }} />
              <div style={{ display: 'flex', gap: 12 }}>
                <Button variant="secondary" onClick={testMedia}>Kamera Test Et</Button>
                <Button variant="secondary" onClick={testMedia}>Mikrofon Test Et</Button>
                <Button onClick={joinCall}>Görüşmeye Katıl</Button>
              </div>
            </div>
            {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
          </Card>
          <Card>
            <h3>Bilgilendirme</h3>
            <p>KVKK gereği kamera ve ses verisi bu demo oturumunda yalnızca geçici kullanılır.</p>
            <p>Booking ID: {bookingId}</p>
            <p>Durum: <Badge>{booking?.status ?? 'CONFIRMED'}</Badge></p>
          </Card>
        </div>
      ) : null}
      {phase === 'in-call' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <strong>{booking?.talent?.displayName ?? 'Uzman'}</strong>
                  <div style={{ color: '#6b7280' }}>Booking #{bookingId}</div>
                </div>
                <Badge>{booking?.status ?? 'IN_PROGRESS'}</Badge>
              </div>
              <VideoTile title={booking?.talent?.displayName ?? 'Karşı Taraf'} subtitle="Remote participant placeholder" />
            </Card>
            <CallControls
              micEnabled={micEnabled}
              cameraEnabled={cameraEnabled}
              onToggleMic={() => setMicEnabled((current) => !current)}
              onToggleCamera={() => setCameraEnabled((current) => !current)}
              onEnd={endCall}
            />
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <VideoTile title="Sen" subtitle={cameraEnabled ? 'Local preview' : 'Kamera kapalı'} muted small />
            <Card>
              <h3>Görüşme Bilgisi</h3>
              <p>Süre: {timer}</p>
              <p>Kalan süre: demo mod</p>
              <p>Rol: {JSON.parse(localStorage.getItem('current_user') ?? '{}')?.role ?? 'USER'}</p>
              <p>Destek: Destek ihtiyacında demo operatörüyle iletişime geçin.</p>
            </Card>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
