type RequestInit = globalThis.RequestInit;

const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  return response.json();
}
