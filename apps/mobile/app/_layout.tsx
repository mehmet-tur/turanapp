import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../src/store/auth';

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate().catch(() => null);
  }, [hydrate]);

  return <Stack screenOptions={{ headerShown: true }} />;
}
