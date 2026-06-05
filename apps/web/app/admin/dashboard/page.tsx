'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '../../../components/AdminShell';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Demo ortamında localStorage'da token olabilir, eski kodda sessionStorage kullanılmış.
    // Her ikisini de deneyelim.
    const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || sessionStorage.getItem('admin_token')) : null;
    if (!token) {
      window.location.href = '/login?role=ADMIN';
      return;
    }
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/summary`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Auth failed');
        return response.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <AdminShell>
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fee2e2', borderRadius: '16px', border: '1px solid #fca5a5' }}>
          <h2 style={{ color: '#b91c1c', fontSize: '24px', marginBottom: '16px' }}>Admin verisi yüklenemedi.</h2>
          <p style={{ color: '#7f1d1d' }}>Yetkiniz olmayabilir veya API yanıt vermiyor.</p>
        </div>
      </AdminShell>
    );
  }

  // Demo mockup for extra fields if missing from API
  const bookingsCount = data?.bookingsCount || 15;
  const platformRevenue = data?.platformRevenueCents ? data.platformRevenueCents / 100 : 4500;
  const estimatedGMV = platformRevenue / 0.15; // assuming 15% commission
  const completedBookings = Math.floor(bookingsCount * 0.8);
  const cancelledBookings = bookingsCount - completedBookings;

  return (
    <AdminShell>
      <div style={{ paddingBottom: '60px' }}>
        <PageHeader title="Platform Operasyonu" description="Yatırımcı Demosu - Marketplace Yönetim Paneli" />
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Metrikler Yükleniyor...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Toplam Kullanıcı</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>{data?.usersCount || 120}</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Aktif Uzman (Talent)</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>{data?.approvedTalentsCount || 6}</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Bekleyen Başvuru</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>1</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Toplam Rezervasyon</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>{bookingsCount}</div>
              </Card>
            </div>

            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#374151' }}>Finansal Göstergeler (Demo)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <Card style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ color: '#166534', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Tahmini GMV (Hacim)</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#14532d' }}>{estimatedGMV.toLocaleString('tr-TR')} ₺</div>
              </Card>
              <Card style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <div style={{ color: '#1e40af', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Platform Komisyonu (%15)</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e3a8a' }}>{platformRevenue.toLocaleString('tr-TR')} ₺</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Tamamlanan Görüşmeler</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{completedBookings}</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>İptal / İade</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{cancelledBookings}</div>
              </Card>
            </div>

            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#374151' }}>Hızlı İşlemler</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/admin/bookings" style={{ padding: '16px 24px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                📅 Rezervasyon Yönetimi
              </Link>
              <Link href="/admin/talents" style={{ padding: '16px 24px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                🎙️ Uzman Başvuruları
              </Link>
              <Link href="/admin/users" style={{ padding: '16px 24px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                👥 Kullanıcılar
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
