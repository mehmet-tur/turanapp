'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!ChangeMe');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok || data.user?.role !== 'ADMIN') {
      setError('Admin hesabı ile giriş yapın.');
      return;
    }
    sessionStorage.setItem('admin_token', data.accessToken);
    router.push('/admin/dashboard');
  }

  return (
    <main style={{ maxWidth: 420, margin: '80px auto', background: 'white', padding: 24, borderRadius: 16 }}>
      <h1>Admin Girişi</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" type="password" />
        <button type="submit">Giriş yap</button>
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      </form>
    </main>
  );
}
