const FALLBACK_APP_URL = 'http://localhost:3000';

export function normalizeBaseUrl(value?: string) {
  return (value ?? FALLBACK_APP_URL).replace(/\/$/, '');
}

export function getWebBaseUrl() {
  return normalizeBaseUrl(process.env.PLAYWRIGHT_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL);
}
