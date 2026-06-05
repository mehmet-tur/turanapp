'use client';

import { useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';

const DEMOS = {
  admin: { email: 'admin@unluapp.local', password: 'Password123!' },
  user: { email: 'demo@unluapp.local', password: 'Password123!' },
  talent: { email: 'talent@unluapp.local', password: 'Password123!' },
};

export default function LoginPage() {
  const [email, setEmail] = useState(DEMOS.user.email);
  const [password, setPassword] = useState(DEMOS.user.password);
  const [error, setError] = useState('');

  async function submit(loginEmail = email, loginPassword = password) {
    setError('');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError('Demo hesabıyla giriş yapılamadı. API ve seed verisinin çalıştığından emin olun. ' + (data?.error?.message ?? ''));
      return;
    }
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('current_user', JSON.stringify(data.user));
    if (data.user.role === 'ADMIN') window.location.href = '/admin/dashboard';
    else if (data.user.role === 'TALENT') window.location.href = '/talent/dashboard';
    else window.location.href = '/bookings';
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <PageHeader title="Giriş Yap" description="Demo rolleri ile hızlıca devam edin." />
        <Card>
          <div style={{ display: 'grid', gap: 12 }}>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" type="password" style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
            <Button fullWidth onClick={() => submit()}>Giriş Yap</Button>
            <div style={{ display: 'grid', gap: 8 }}>
              <Button variant="secondary" onClick={() => submit(DEMOS.admin.email, DEMOS.admin.password)}>Admin ile giriş yap</Button>
              <Button variant="secondary" onClick={() => submit(DEMOS.user.email, DEMOS.user.password)}>Demo kullanıcı ile giriş yap</Button>
              <Button variant="secondary" onClick={() => submit(DEMOS.talent.email, DEMOS.talent.password)}>Demo uzman ile giriş yap</Button>
            </div>
            {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
