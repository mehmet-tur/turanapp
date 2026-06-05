import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '0', margin: '0', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111827', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Navigation */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px', letterSpacing: '-0.5px' }}>TuranApp</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/talents" style={{ padding: '10px 16px', color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>Uzmanları Keşfet</Link>
          <Link href="/demo" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>Demo Akışını Başlat</Link>
          <Link href="/admin/dashboard" style={{ padding: '10px 16px', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>Admin Paneli</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '100px 40px', textAlign: 'center', backgroundColor: '#111827', color: 'white' }}>
        <h1 style={{ fontSize: '56px', fontWeight: 800, margin: '0 0 24px 0', lineHeight: 1.1, letterSpacing: '-1px' }}>
          Ünlüler ve uzmanlarla dakikalar içinde <br /> birebir canlı görüşme
        </h1>
        <p style={{ fontSize: '20px', color: '#9ca3af', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
          TuranApp, içerik üreticileri, ünlüler ve alan uzmanlarının zamanını güvenli, planlanabilir ve gelir üreten canlı görüşmelere dönüştüren yeni nesil etkileşim pazaryeridir.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link href="/talents" style={{ padding: '16px 32px', backgroundColor: 'white', color: '#111827', textDecoration: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '18px' }}>Uzmanları Keşfet</Link>
          <Link href="/demo" style={{ padding: '16px 32px', backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '18px' }}>Demo Akışını Başlat</Link>
        </div>
      </header>

      {/* Problem & Solution Section */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#ef4444' }}>Problem</h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>✖</span> Fanlar ve takipçiler gerçek etkileşim istiyor.</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>✖</span> Ünlü/uzman tarafında zaman monetizasyonu dağınık.</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>✖</span> DM, WhatsApp, manuel ödeme ve takvim yönetimi ölçeklenmiyor.</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#ef4444' }}>✖</span> Güvenli ödeme, randevu, video ve moderasyon tek yerde değil.</li>
          </ul>
        </div>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#10b981' }}>Çözüm</h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#10b981' }}>✔</span> Zaman bazlı slotlar</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#10b981' }}>✔</span> Online rezervasyon</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#10b981' }}>✔</span> Güvenli ödeme mimarisi</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#10b981' }}>✔</span> Web/mobile görüşme deneyimi</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#10b981' }}>✔</span> Admin/talent/user panelleri</li>
            <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#10b981' }}>✔</span> Agora/iyzico entegrasyonuna hazır mimari</li>
          </ul>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 40px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '48px' }}>Nasıl Çalışır?</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
            {[
              { step: 1, title: 'Uzmanı seç' },
              { step: 2, title: 'Slot seç' },
              { step: 3, title: 'Rezervasyon oluştur' },
              { step: 4, title: 'Görüşme odasına gir' },
              { step: 5, title: 'Görüşmeyi tamamla' }
            ].map((s) => (
              <div key={s.step} style={{ flex: 1, textAlign: 'center', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontWeight: 'bold', fontSize: '20px' }}>{s.step}</div>
                <div style={{ fontWeight: 600, fontSize: '18px' }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace & Trust */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Marketplace Tarafları</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>Kullanıcı</div>
              <p style={{ color: '#6b7280', margin: 0 }}>Uzmanları keşfeder, rezervasyon yapar ve görüşmelere katılır.</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>Ünlü / Uzman / Talent</div>
              <p style={{ color: '#6b7280', margin: 0 }}>Uygun saatlerini belirler, profilini yönetir ve canlı görüşmelerden gelir elde eder.</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>Admin / Platform</div>
              <p style={{ color: '#6b7280', margin: 0 }}>Kullanıcıları, uzmanları ve işlemleri yöneterek pazar yerini denetler.</p>
            </div>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Güven Notu</h2>
          <div style={{ backgroundColor: '#eff6ff', padding: '32px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '18px', color: '#1e3a8a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>🔒 <span><strong>KVKK</strong> onay logları sisteme entegredir.</span></li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>💳 <span>Mock payment şu anda demo modunda aktiftir.</span></li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>⚙️ <span>Gerçek ödeme için <strong>iyzico marketplace mimarisi</strong> hazırdır.</span></li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>🎥 <span>Gerçek video görüşmeler için <strong>Agora provider abstraction</strong> hazırdır.</span></li>
            </ul>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Yatırımcı Demo Kısayolları</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/talents" style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: 500, border: '1px solid #e5e7eb' }}>Kullanıcı Akışı</Link>
              <Link href="/talent/dashboard" style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: 500, border: '1px solid #e5e7eb' }}>Talent Paneli</Link>
              <Link href="/admin/dashboard" style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: 500, border: '1px solid #e5e7eb' }}>Admin Paneli</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '40px', textAlign: 'center', borderTop: '1px solid #374151' }}>
        <p>&copy; 2026 TuranApp Investor Demo. All rights reserved.</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>Version: {process.env.NEXT_PUBLIC_APP_VERSION || '0.2.0-investor-demo'}</p>
      </footer>
    </main>
  );
}
