const baseUrl = process.env.EXPO_PUBLIC_MOBILE_API_URL ?? 'http://localhost:4000/api';

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
