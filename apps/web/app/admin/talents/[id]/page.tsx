export default async function AdminTalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main style={{ padding: 32 }}>
      <h1>Uzman Detayı</h1>
      <p>Bu ekranın detay verisi Faz 1 kapsamında liste akışı üzerinden yönetilir.</p>
      <p>Uzman ID: {id}</p>
    </main>
  );
}
