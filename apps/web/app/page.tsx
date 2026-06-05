async function getTalents() {
  try {
    const response = await fetch(`${process.env.WEB_API_URL ?? 'http://localhost:4000/api'}/talents`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const talents = await getTalents();
  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <section style={{ background: '#111827', color: 'white', borderRadius: 24, padding: 32 }}>
        <h1 style={{ fontSize: 42, marginBottom: 12 }}>Uzmanlar ve tanınmış isimlerle canlı 1:1 görüşme</h1>
        <p style={{ maxWidth: 720, lineHeight: 1.5 }}>
          İhtiyacına uygun uzmanı seç, saatini ayırt ve bire bir görüşmeye katıl. Faz 1 kapsamında landing, admin ve rezervasyon akışı hazırdır.
        </p>
      </section>

      <section style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['Uzmanı seç', 'Saatini ayırt', 'Canlı görüşmeye katıl'].map((step, index) => (
          <div key={step} style={{ background: 'white', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Adım {index + 1}</div>
            <h3>{step}</h3>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Öne çıkan uzmanlar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {talents.map((talent: any) => (
            <div key={talent.id} style={{ background: 'white', borderRadius: 16, padding: 20 }}>
              <h3>{talent.publicName}</h3>
              <p>{talent.headline}</p>
              <p>
                Başlangıç fiyatı: {(talent.startingPriceMinor / 100).toLocaleString('tr-TR')} {talent.currency}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Uzman olarak başvur</h2>
          <p>Uzman profilinizi oluşturup admin onayına gönderebilirsiniz.</p>
        </div>
        <a href="/admin/login">Admin girişi</a>
      </section>
    </main>
  );
}
