import type { ReactNode } from 'react';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32 }}>{title}</h1>
        {description ? <p style={{ color: '#6b7280', marginTop: 8 }}>{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
