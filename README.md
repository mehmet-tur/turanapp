# Celebrity Call Platform

## Gereksinimler
- Node.js LTS
- pnpm
- Docker

## Hızlı başlangıç
```bash
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev:api
pnpm dev:web
pnpm dev:mobile
```

## Lokalde sıfırdan çalıştırma
1. `.env.example` dosyasını `.env` olarak kopyalayın.
2. PostgreSQL servisini `docker compose up -d postgres` ile başlatın.
3. Prisma client ve migration çalıştırın.
4. Seed ile demo veri yükleyin.
5. API, web ve mobile uygulamalarını ayrı terminallerde başlatın.

## Demo hesaplar
- Admin: `admin@unluapp.local` / `Password123!`
- Kullanıcı: `demo@unluapp.local` / `Password123!`
- Talent: `ayse-yildiz@unluapp.local` / `Password123!`

## Servis URL’leri
- API health: `http://localhost:3001/api/health`
- Swagger: `http://localhost:3001/docs`
- Web: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## MVP kapsamı
- Kullanıcı auth
- Talent listeleme ve detay
- Availability window ve slot üretimi
- Booking
- Mock payment
- Mock video session
- Admin dashboard
- Admin talent approval
- KVKK / camera-audio consent log

## Mobil localhost notu
- iOS Simulator için `http://localhost:3001` kullanılabilir.
- Android Emulator için gerekirse `http://10.0.2.2:3001` kullanılmalıdır.
- Fiziksel cihazda bilgisayarın LAN IP’si kullanılmalıdır.

## Teknik notlar
- Fiyat hesabı her zaman sunucuda yapılır.
- Gerçek ödeme ve video sağlayıcı entegrasyonları bu fazda mock katman üzerinden çalışır.
- Booking çakışması service katmanında engellenir; slot tekrar kullanımı için partial unique index ihtiyacı sonraki fazda ele alınır.

## Ertelenen işler
Bkz. `/Users/investintech/Developer/unluapp/docs/deferred.md`
