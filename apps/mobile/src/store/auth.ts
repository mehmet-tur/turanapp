import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '../lib/api';

type AuthState = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
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
  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync('auth', JSON.stringify(data));
    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
  },
  async register(input) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    await SecureStore.setItemAsync('auth', JSON.stringify(data));
    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
  },
  async logout() {
    await SecureStore.deleteItemAsync('auth');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  async hydrate() {
    const raw = await SecureStore.getItemAsync('auth');
    if (!raw) return;
    const data = JSON.parse(raw);
    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
  },
}));
