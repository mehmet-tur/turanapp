type RequestInit = globalThis.RequestInit;

const API_URL = process.env.SMOKE_API_URL ?? 'http://localhost:3001/api';
const checks: string[] = [];

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${text}`);
  }
  return data;
}

async function main() {
  const health = await request('/health');
  if (health.status !== 'ok') throw new Error('Health check failed');
  checks.push('✅ health');

  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@unluapp.local',
      password: 'Password123!',
    }),
  });
  checks.push('✅ admin login');

  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'demo@unluapp.local',
      password: 'Password123!',
    }),
  });
  checks.push('✅ user login');

  const talentLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'talent@unluapp.local',
      password: 'Password123!',
    }),
  });
  checks.push('✅ talent login');

  const token = login.accessToken;
  const adminToken = adminLogin.accessToken;
  const talentToken = talentLogin.accessToken;
  await request('/auth/me', { headers: { authorization: `Bearer ${token}` } });
  checks.push('✅ auth me');

  await request('/talents/featured');
  checks.push('✅ featured talents');
  const talents = await request('/talents');
  checks.push('✅ talent list');
  const talent = talents.items?.[0];
  if (!talent) throw new Error('No talents returned');
  await request(`/talents/${talent.slug}`);
  checks.push('✅ talent detail');

  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const to = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const slots = await request(`/talents/${talent.slug}/slots?from=${from}&to=${to}`);
  const slot = slots.items?.[0];
  if (!slot) throw new Error('No slot returned');
  checks.push('✅ slots');

  const booking = await request('/bookings', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify({
      talentSlug: talent.slug,
      startsAt: slot.startsAt,
      durationMinutes: slot.durationMinutes,
      notes: 'Smoke test rezervasyonu',
      acceptedCameraAudioConsent: true,
    }),
  });

  if (booking.status !== 'CONFIRMED') throw new Error('Booking was not confirmed');
  checks.push('✅ booking create');
  await request(`/bookings/${booking.id}`, { headers: { authorization: `Bearer ${token}` } });
  checks.push('✅ booking detail');
  await request(`/bookings/${booking.id}/start`, { method: 'POST', headers: { authorization: `Bearer ${token}` } });
  checks.push('✅ booking start');
  await request(`/bookings/${booking.id}/complete`, { method: 'POST', headers: { authorization: `Bearer ${token}` } });
  checks.push('✅ booking complete');
  await request('/bookings', { headers: { authorization: `Bearer ${token}` } });
  checks.push('✅ user bookings');
  await request('/talent/bookings', { headers: { authorization: `Bearer ${talentToken}` } });
  checks.push('✅ talent bookings');
  await request('/admin/summary', { headers: { authorization: `Bearer ${adminToken}` } });
  checks.push('✅ admin summary');
  const adminBookings = await request('/admin/bookings', { headers: { authorization: `Bearer ${adminToken}` } });
  checks.push('✅ admin bookings');
  if (adminBookings[0]?.id) {
    await request(`/admin/bookings/${adminBookings[0].id}/status`, {
      method: 'POST',
      headers: { authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'CONFIRMED' }),
    });
    checks.push('✅ admin booking status update');
  }
  await request('/admin/talents/pending', { headers: { authorization: `Bearer ${adminToken}` } });
  checks.push('✅ pending talents');
  console.log(checks.join('\n'));
  console.log('All smoke checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
