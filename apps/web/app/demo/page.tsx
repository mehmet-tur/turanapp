import Link from 'next/link';

export default function DemoHubPage() {
  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111827' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Yatırımcı Demo Merkezi</h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>TuranApp uçtan uca demo akışlarını buradan başlatabilirsiniz.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Kullanıcı Demo Akışı */}
        <section style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>👤 Kullanıcı Demo Akışı</h2>
            <p style={{ color: '#4b5563', margin: 0 }}>Uzman seç, slot ayır, görüşme odasına gir.</p>
          </div>
          <Link href="/login?role=USER" style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>Demo Kullanıcı Olarak Başla</Link>
        </section>

        {/* Uzman Paneli */}
        <section style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>🎙️ Uzman Paneli</h2>
            <p style={{ color: '#4b5563', margin: 0 }}>Uzman yaklaşan görüşmelerini görür ve görüşmeye katılır.</p>
          </div>
          <Link href="/login?role=TALENT" style={{ padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>Uzman Panelini Aç</Link>
        </section>

        {/* Admin Paneli */}
        <section style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️ Admin Paneli</h2>
            <p style={{ color: '#4b5563', margin: 0 }}>Platform booking, kullanıcı ve talent operasyonlarını yönetir.</p>
          </div>
          <Link href="/login?role=ADMIN" style={{ padding: '12px 24px', backgroundColor: '#111827', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>Admin Panelini Aç</Link>
        </section>

        {/* Teknik Sağlık */}
        <section style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>🩺 Teknik Sağlık</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>App Version:</strong> {process.env.NEXT_PUBLIC_APP_VERSION || '0.2.0-investor-demo'}</li>
            <li><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</li>
            <li><strong>Demo Modu:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Aktif</span></li>
            <li><strong>Mock Providers:</strong> Payment & Video</li>
            <li><a href={`${process.env.NEXT_PUBLIC_API_URL}/health`} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>API Health Durumunu Kontrol Et</a></li>
          </ul>
        </section>

      </div>
    </main>
  );
}
