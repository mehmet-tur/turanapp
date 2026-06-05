'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { Card } from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

export default function TalentDashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login?role=TALENT';
      return;
    }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/talent/bookings`, {
        headers: { authorization: `Bearer ${token}` },
      }).then(res => res.ok ? res.json() : []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/talent/summary`, {
        headers: { authorization: `Bearer ${token}` },
      }).then(res => res.ok ? res.json() : null)
    ])
      .then(([bookingsData, summaryData]) => {
        setItems(Array.isArray(bookingsData) ? bookingsData : []);
        setSummary(summaryData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = useMemo(() => items.filter((item) => new Date(item.startsAt).toDateString() === new Date().toDateString()), [items]);
  const completed = useMemo(() => items.filter((item) => item.status === 'COMPLETED'), [items]);
  const upcoming = useMemo(() => items.filter((item) => item.status === 'CONFIRMED' || item.status === 'PENDING'), [items]);
  
  // Demo Mock Kazanç Hesaplama (Tamamlanan rezervasyonların %85'i uzmanındır)
  const totalEarningsCents = completed.reduce((sum, item) => sum + (item.priceCents || 0), 0) * 0.85;
  const earningsDisplay = totalEarningsCents > 0 ? (totalEarningsCents / 100).toLocaleString('tr-TR') : '12.450'; // Mock fallback

  return (
    <AppShell>
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
        <PageHeader title="Uzman Paneli" description="Görüşmelerinizi yönetin ve kazancınızı takip edin." />
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Veriler Yükleniyor...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <Card>
                <div style={{ background: 'linear-gradient(135deg, #111827 0%, #374151 100%)', color: 'white', padding: '16px', margin: '-16px', borderRadius: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Toplam Kazanç (Tahmini)</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>{earningsDisplay} ₺</div>
                </div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Bugünkü Görüşmeler</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>{summary?.today ?? today.length}</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Yaklaşan Görüşmeler</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb' }}>{summary?.upcoming ?? upcoming.length}</div>
              </Card>
              <Card>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Tamamlanan</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>{summary?.completed ?? completed.length}</div>
              </Card>
            </div>

            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', margin: 0, color: '#111827' }}>Görüşme Takvimi</h3>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Tüm aktif ve geçmiş görüşmeleriniz</span>
              </div>
              
              {items.length ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {items.map((item) => {
                    const isCompleted = item.status === 'COMPLETED';
                    const isCancelled = item.status === 'CANCELLED';
                    const isActive = !isCompleted && !isCancelled;
                    const dateObj = new Date(item.startsAt);
                    
                    return (
                      <div key={item.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '16px', 
                        backgroundColor: isActive ? '#f8fafc' : '#ffffff',
                        border: '1px solid',
                        borderColor: isActive ? '#e2e8f0' : '#f3f4f6',
                        borderRadius: '16px',
                        transition: 'all 0.2s'
                      }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px', 
                            backgroundColor: isActive ? '#eff6ff' : '#f3f4f6',
                            color: isActive ? '#2563eb' : '#6b7280',
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center',
                            lineHeight: 1
                          }}>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{dateObj.getDate()}</span>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>{dateObj.toLocaleDateString('tr-TR', { month: 'short' })}</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '16px', color: '#111827', marginBottom: '4px' }}>
                              {item.customer?.firstName} {item.customer?.lastName || 'Kullanıcı'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', gap: '12px' }}>
                              <span>🕒 {dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                              <span>⏳ {item.durationMinutes ?? 15} dk</span>
                              {item.priceCents > 0 && <span>💰 {(item.priceCents * 0.85 / 100).toLocaleString('tr-TR')} ₺ Kazanç</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: '99px', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            backgroundColor: isCompleted ? '#d1fae5' : isCancelled ? '#fee2e2' : '#dbeafe',
                            color: isCompleted ? '#065f46' : isCancelled ? '#991b1b' : '#1e40af'
                          }}>
                            {item.status}
                          </span>
                          
                          {isActive ? (
                            <Link href={`/call/${item.id}`} style={{ 
                              padding: '10px 20px', 
                              backgroundColor: '#2563eb', 
                              color: 'white', 
                              borderRadius: '8px', 
                              textDecoration: 'none', 
                              fontWeight: 600,
                              fontSize: '14px'
                            }}>
                              Odaya Git
                            </Link>
                          ) : (
                            <div style={{ width: '100px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                              {isCompleted ? 'Tamamlandı' : 'İptal'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                  <h4 style={{ fontSize: '18px', color: '#111827', margin: '0 0 8px 0' }}>Planlanmış Görüşme Yok</h4>
                  <p style={{ color: '#6b7280', margin: 0 }}>Profiliniz şu anda aktif, yeni rezervasyonlar aldığınızda burada görünecek.</p>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
