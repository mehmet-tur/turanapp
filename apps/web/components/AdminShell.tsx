import type { PropsWithChildren } from 'react';

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'grid', gridTemplateColumns: '240px 1fr' }}>
      <aside style={{ background: '#111827', color: '#ffffff', padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Yönetim</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <a href="/admin/dashboard" style={{ color: '#ffffff' }}>Dashboard</a>
          <a href="/admin/talents" style={{ color: '#ffffff' }}>Uzmanlar</a>
          <a href="/admin/bookings" style={{ color: '#ffffff' }}>Rezervasyonlar</a>
          <a href="/admin/users" style={{ color: '#ffffff' }}>Kullanıcılar</a>
        </div>
      </aside>
      <main style={{ padding: 32 }}>{children}</main>
    </div>
  );
}
