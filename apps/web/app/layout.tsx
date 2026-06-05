import type { ReactNode } from 'react';

export const metadata = {
  title: 'Celebrity Call Platform',
  description: 'Uzmanlar ve tanınmış isimlerle canlı 1:1 görüşme platformu',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f7f7fb', color: '#111' }}>{children}</body>
    </html>
  );
}
