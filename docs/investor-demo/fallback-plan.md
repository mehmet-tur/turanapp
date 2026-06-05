# Investor Demo Fallback Plan

## Lokal Demo Komutları

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev:api
pnpm dev:web
pnpm --filter mobile start
```

## API Health
```txt
http://localhost:3001/api/health
```

## Web
```txt
http://localhost:3000
http://localhost:3000/demo
http://localhost:3000/login
http://localhost:3000/talents
http://localhost:3000/admin/dashboard
http://localhost:3000/talent/dashboard
```

## Staging Çalışmazsa
- Lokal PostgreSQL ile demo aç.
- Web akışını localhost üzerinden göster.
- Mobile çalışmazsa web responsive görünümü göster.
- Kamera izni verilmezse mock placeholder’ın bilinçli tasarlandığını açıkla.

## API Çalışmazsa
- Landing, ürün anlatısı ve investor docs gösterilebilir.
- Ekran görüntüsü/video yedeği kullanılmalı.
- Booking/call canlı akışı gösterilemez.

## Mobile Çalışmazsa
- Mobile bu fazda native call room içermiyor.
- Booking flow web ile gösterilebilir.
- Mobile yol haritası Phase 3 olarak anlatılır.
