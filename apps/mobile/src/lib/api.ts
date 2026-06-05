type RequestInit = globalThis.RequestInit;

const FALLBACK_API_URL = 'http://localhost:3001/api';
const FALLBACK_WEB_URL = 'http://localhost:3000';

let accessToken: string | null = null;

type ErrorPayload = {
  error?: {
    message?: string;
  };
  message?: string;
};

export function getApiBaseUrl() {
  return (process.env.EXPO_PUBLIC_API_URL ?? FALLBACK_API_URL).replace(/\/$/, '');
}

export function getWebBaseUrl() {
  return (process.env.EXPO_PUBLIC_WEB_URL ?? FALLBACK_WEB_URL).replace(/\/$/, '');
}

export function buildCallRoomUrl(bookingId: string) {
  return `${getWebBaseUrl()}/call/${bookingId}`;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function extractErrorMessage(payload: unknown, fallback = 'Bir hata oluştu.') {
  if (typeof payload === 'string' && payload.trim()) return payload;
  if (payload && typeof payload === 'object') {
    const typed = payload as ErrorPayload;
    if (typed.error?.message) return typed.error.message;
    if (typed.message) return typed.message;
  }
  return fallback;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload, `API isteği başarısız: ${response.status}`));
  }

  return payload as T;
}
