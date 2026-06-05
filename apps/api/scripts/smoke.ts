const API_URL = process.env.SMOKE_API_URL ?? 'http://localhost:3001/api';

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

  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'demo@unluapp.local',
      password: 'Password123!',
    }),
  });

  const token = login.accessToken;
  const talents = await request('/talents');
  const talent = talents.items?.[0];
  if (!talent) throw new Error('No talents returned');

  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const to = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const slots = await request(`/talents/${talent.slug}/slots?from=${from}&to=${to}`);
  const slot = slots.items?.[0];
  if (!slot) throw new Error('No slot returned');

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
  console.log(JSON.stringify({ health, talent: talent.slug, bookingId: booking.id, status: booking.status }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
