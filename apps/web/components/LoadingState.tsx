export function LoadingState({ label = 'Yükleniyor...' }: { label?: string }) {
  return <div style={{ padding: 24, color: '#6b7280' }}>{label}</div>;
}
