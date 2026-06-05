import { Card } from './Card';

export function VideoTile({
  title,
  subtitle,
  muted = false,
  small = false,
}: {
  title: string;
  subtitle: string;
  muted?: boolean;
  small?: boolean;
}) {
  return (
    <Card>
      <div
        style={{
          height: small ? 160 : 360,
          borderRadius: 16,
          background: muted ? '#1f2937' : '#111111',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ width: 72, height: 72, borderRadius: 999, background: '#374151' }} />
        <strong>{title}</strong>
        <span style={{ color: '#d1d5db' }}>{subtitle}</span>
      </div>
    </Card>
  );
}
