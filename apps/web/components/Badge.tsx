import type { PropsWithChildren } from 'react';

const COLORS: Record<string, { bg: string; color: string }> = {
  CONFIRMED: { bg: '#dcfce7', color: '#166534' },
  IN_PROGRESS: { bg: '#dbeafe', color: '#1d4ed8' },
  COMPLETED: { bg: '#ede9fe', color: '#6d28d9' },
  REFUNDED: { bg: '#fee2e2', color: '#b91c1c' },
  CANCELLED_BY_CUSTOMER: { bg: '#fef3c7', color: '#92400e' },
  CANCELLED_BY_TALENT: { bg: '#fef3c7', color: '#92400e' },
  PENDING_REVIEW: { bg: '#fef3c7', color: '#92400e' },
  APPROVED: { bg: '#dcfce7', color: '#166534' },
  REJECTED: { bg: '#fee2e2', color: '#b91c1c' },
  default: { bg: '#e5e7eb', color: '#374151' },
};

export function Badge({ children }: PropsWithChildren) {
  const key = typeof children === 'string' ? children : 'default';
  const color = COLORS[key] ?? COLORS.default;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 10px',
        borderRadius: 999,
        background: color.bg,
        color: color.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}
