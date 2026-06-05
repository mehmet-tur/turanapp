'use client';

import { AppShell } from '../../components/AppShell';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <AppShell>
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fee2e2', borderRadius: '16px', border: '1px solid #fca5a5', maxWidth: '600px', margin: '40px auto' }}>
        <h2 style={{ color: '#b91c1c', fontSize: '24px', marginBottom: '16px' }}>Bu demo ekranı yüklenemedi.</h2>
        <p style={{ color: '#7f1d1d', marginBottom: '24px' }}>
          API bağlantısını ve demo seed verisini kontrol edin.
        </p>
        <button onClick={() => reset()} style={{ padding: '10px 20px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Tekrar Dene
        </button>
      </div>
    </AppShell>
  );
}
