import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiFetch, setAccessToken } from '../lib/api';

type AuthPayload = {
  user: any;
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
  async login(email, password) {
    const data = await apiFetch<AuthPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync('auth', JSON.stringify(data));
    setAccessToken(data.accessToken);
    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
  },
  async register(input) {
    const data = await apiFetch<AuthPayload>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    await SecureStore.setItemAsync('auth', JSON.stringify(data));
    setAccessToken(data.accessToken);
    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
  },
  async logout() {
    await SecureStore.deleteItemAsync('auth');
    setAccessToken(null);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isHydrated: true });
  },
  async hydrate() {
    try {
      const raw = await SecureStore.getItemAsync('auth');
      if (!raw) {
        set({ isHydrated: true });
        return;
      }
      const data = JSON.parse(raw) as AuthPayload;
      setAccessToken(data.accessToken);
      set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true, isHydrated: true });
    } catch {
      await SecureStore.deleteItemAsync('auth');
      setAccessToken(null);
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isHydrated: true });
    }
  },
}));
