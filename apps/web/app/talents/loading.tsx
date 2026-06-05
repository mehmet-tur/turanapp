import { AppShell } from '../../components/AppShell';

export default function Loading() {
  return (
    <AppShell>
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#4b5563', fontSize: '24px' }}>Uzmanlar Yükleniyor...</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '24px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: '280px', backgroundColor: '#f3f4f6', borderRadius: '16px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
