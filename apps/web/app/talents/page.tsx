import { AppShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

async function getTalents() {
  const data = await apiFetch<{ items: any[] }>('/talents');
  if (!data || !data.items) {
    throw new Error('Failed to load talents');
  }
  return data;
}

export default async function TalentsPage() {
  const data = await getTalents();
  
  return (
    <AppShell>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
        <PageHeader 
          title="Uzmanları Keşfet" 
          description="Kategori, fiyat ve uygunluk durumuna göre filtreleyerek size en uygun uzmanı bulun." 
        />
        
        <div style={{ marginBottom: '32px' }}>
          <input 
            placeholder="Uzman veya kategori ara..." 
            style={{ 
              width: '100%', 
              padding: '16px 24px', 
              borderRadius: '99px', 
              border: '1px solid #e5e7eb',
              fontSize: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }} 
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {data.items.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', backgroundColor: '#f9fafb', borderRadius: '16px' }}>
              <h3>Henüz kayıtlı uzman bulunmuyor.</h3>
              <p>Lütfen demo veri setinin başarıyla seed edildiğinden emin olun.</p>
            </div>
          ) : data.items.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              padding: '24px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold', flexShrink: 0 }}>
                  {item.displayName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#111827' }}>{item.displayName}</h3>
                  <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                    {item.category || 'Genel'}
                  </span>
                </div>
              </div>
              
              <p style={{ color: '#4b5563', margin: '0 0 16px 0', fontSize: '15px', lineHeight: 1.5, flexGrow: 1 }}>
                {item.title}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Başlangıç Fiyatı</div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>
                    {(item.priceCents / 100).toLocaleString('tr-TR')} {item.currency}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 'bold' }}>
                  ⭐ 4.9
                </div>
              </div>
              
              <Link href={`/talents/${item.slug}`} style={{ 
                display: 'block', 
                textAlign: 'center', 
                padding: '14px', 
                backgroundColor: '#111827', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '12px', 
                fontWeight: 600, 
                marginTop: '20px' 
              }}>
                Profili İncele
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
