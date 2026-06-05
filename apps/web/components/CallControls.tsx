'use client';

import { Button } from './Button';

export function CallControls({
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  onEnd,
}: {
  micEnabled: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEnd: () => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Button variant="secondary" onClick={onToggleMic}>
        {micEnabled ? 'Mikrofonu Kapat' : 'Mikrofonu Aç'}
      </Button>
      <Button variant="secondary" onClick={onToggleCamera}>
        {cameraEnabled ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
      </Button>
      <Button variant="secondary" disabled>
        Ekran Paylaşımı
      </Button>
      <Button variant="danger" onClick={onEnd}>
        Görüşmeyi Bitir
      </Button>
    </div>
  );
}
