export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ padding: 32, borderRadius: 20, background: '#ffffff', textAlign: 'center', border: '1px dashed #d1d5db' }}>
      <h3>{title}</h3>
      <p style={{ color: '#6b7280' }}>{description}</p>
    </div>
  );
}
