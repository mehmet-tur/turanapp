# Celebrity Call Platform

## Proje Özeti
- Ünlüler ve uzmanlarla zaman bazlı canlı 1:1 görüşme platformu
- Web ve mobile istemciler aynı NestJS API ile konuşur
- Ödeme akışı mock provider ile, görüşme akışı mock video provider ile çalışır
- `ADMIN`, `TALENT`, `USER` rolleri desteklenir

## Kurulum

### Docker ile
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

### Local PostgreSQL fallback
```bash
brew install postgresql@16
brew services start postgresql@16
createdb unluapp
cp .env.example .env
# DATABASE_URL değerini local postgres'e göre düzenle
pnpm db:migrate
pnpm db:seed
```

Örnek local bağlantı:
```env
DATABASE_URL="postgresql://localhost:5432/unluapp?schema=public"
```

## Demo Hesapları
- Admin: `admin@unluapp.local` / `Password123!`
- Kullanıcı: `demo@unluapp.local` / `Password123!`
- Uzman: `talent@unluapp.local` / `Password123!`

## Demo Akışı
1. Web landing sayfasını açın.
2. Demo kullanıcı ile giriş yapın.
3. Uzman listesinden bir profil seçin.
4. Uygun slot seçip rezervasyon oluşturun.
5. Rezervasyon detay sayfasına gidin.
6. Görüşme odasına girin.
7. Pre-call lobby’de kamera/mikrofonu test edin.
8. Mock görüşmeyi başlatın ve bitirin.
9. Admin panelden booking durumunu kontrol edin.
10. Talent dashboard ile aynı booking’i uzman tarafından görüntüleyin.

## URL’ler
- Web: `http://localhost:3000`
- API: `http://localhost:3001/api`
- Health: `http://localhost:3001/api/health`
- Admin: `http://localhost:3000/admin/dashboard`
- Talent: `http://localhost:3000/talent/dashboard`
- Bookings: `http://localhost:3000/bookings`

## Scriptler
- `pnpm dev`: Tüm workspace süreçlerini paralel başlatır
- `pnpm dev:api`: NestJS API
- `pnpm dev:web`: Next.js web
- `pnpm dev:mobile`: Expo mobile
- `pnpm db:generate`: Prisma client üretir
- `pnpm db:migrate`: Development migration uygular
- `pnpm db:seed`: Demo veri yükler
- `pnpm smoke:api`: Çalışan API üzerinde smoke test zinciri çalıştırır
- `pnpm lint`: Tüm workspace lint komutlarını çalıştırır
- `pnpm test`: Tüm workspace test komutlarını çalıştırır
- `pnpm test:e2e:web`: Playwright ile web demo smoke akışını çalıştırır
- `pnpm --filter mobile typecheck`: Mobile TypeScript doğrulamasını çalıştırır

## Mobil Demo
- Varsayılan mobile env değişkenleri: `EXPO_PUBLIC_API_URL` ve `EXPO_PUBLIC_WEB_URL`
- Rezervasyon detay ekranındaki CTA: `Web Görüşme Odasını Aç`
- Akış: giriş → uzman listesi → uzman detayı → slot seçimi → rezervasyon detayı → web görüşme odası

## Mobil localhost notu
- iOS Simulator: `EXPO_PUBLIC_API_URL="http://localhost:3001/api"` ve `EXPO_PUBLIC_WEB_URL="http://localhost:3000"`
- Android Emulator: `EXPO_PUBLIC_API_URL="http://10.0.2.2:3001/api"` ve `EXPO_PUBLIC_WEB_URL="http://10.0.2.2:3000"`
- Fiziksel cihaz: her iki değişkende de bilgisayarın LAN IP’sini kullanın; örnek `http://192.168.1.50:3001/api`
- API CORS izinleri için web origin’ini `http://localhost:3000` olarak koruyun

## Kalanlar
- Gerçek iyzico marketplace entegrasyonu
- Gerçek Agora RTC token üretimi
- Gerçek KVKK hukuk metinleri
- Recording ve cloud recording
- Moderation ve notification
- Payment reconciliation
- Production observability
