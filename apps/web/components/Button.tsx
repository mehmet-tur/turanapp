'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
  }
>;

export function Button({ children, variant = 'primary', fullWidth = false, style, ...props }: Props) {
  const background =
    variant === 'danger' ? '#dc2626' : variant === 'secondary' ? '#ffffff' : '#111827';
  const color = variant === 'secondary' ? '#111827' : '#ffffff';

  return (
    <button
      {...props}
      style={{
        width: fullWidth ? '100%' : undefined,
        borderRadius: 12,
        border: variant === 'secondary' ? '1px solid #d1d5db' : '1px solid transparent',
        background,
        color,
        padding: '12px 16px',
        fontWeight: 600,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
