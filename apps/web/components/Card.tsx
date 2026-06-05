import type { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        border: '1px solid #eef2f7',
      }}
    >
      {children}
    </div>
  );
}
