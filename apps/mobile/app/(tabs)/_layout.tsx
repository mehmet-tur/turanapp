import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="home" options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Rezervasyonlarım' }} />
      <Tabs.Screen name="search" options={{ title: 'Keşfet' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
