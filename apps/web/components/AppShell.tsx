import type { PropsWithChildren, ReactNode } from 'react';

export function AppShell({ children, actions }: PropsWithChildren<{ actions?: ReactNode }>) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header
        style={{
          padding: '20px 32px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <a href="/" style={{ textDecoration: 'none', color: '#111827', fontWeight: 800 }}>
          UnluApp
        </a>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/talents">Uzmanlar</a>
          <a href="/bookings">Rezervasyonlarım</a>
          <a href="/login">Giriş</a>
          {actions}
        </nav>
      </header>
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 32 }}>{children}</main>
    </div>
  );
}
