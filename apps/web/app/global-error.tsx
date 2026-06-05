'use client';

import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', backgroundColor: '#fee2e2', padding: '40px', borderRadius: '16px', border: '1px solid #fca5a5' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ color: '#b91c1c', fontSize: '24px', margin: '0 0 16px 0' }}>Bir Hata Oluştu</h1>
            <p style={{ color: '#7f1d1d', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Sistemde beklenmeyen bir hata meydana geldi. Bu durum demo API sunucusunun çalışmamasından veya seed verisinin eksik olmasından kaynaklanabilir.
            </p>
            <p style={{ color: '#991b1b', fontSize: '14px', marginBottom: '32px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <code>{error.message || 'Unknown error'}</code>
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.href = '/'}
                style={{ padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid #b91c1c', color: '#b91c1c', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Ana Sayfaya Dön
              </button>
              <button 
                onClick={() => reset()}
                style={{ padding: '12px 24px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
