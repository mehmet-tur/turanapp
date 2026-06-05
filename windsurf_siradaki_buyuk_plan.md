# Windsurf Büyük Görev Planı — Faz 2: Uçtan Uca Çalıştırma, DB/Migration/Seed, Entegrasyon Sertleştirme ve Doğrulama

Bu görevi `/Users/investintech/Developer/unluapp` dizininde uygula. Önce mevcut kodu incele, sonra değişiklikleri küçük ve güvenli commit mantığıyla yap. Dizin Git deposu değilse **önce git deposu başlat**, mevcut dosyaları ilk checkpoint olarak kaydet. Kullanıcıdan ek onay bekleme; hataları kendin teşhis et, düzelt ve doğrulama komutları geçene kadar devam et.

## 0. Ana hedef

Mevcut monorepo zaten oluşturuldu. Bu fazın hedefi projeyi “gerçek geliştirme ortamında uçtan uca ayağa kalkabilen MVP” seviyesine getirmek:

1. Docker PostgreSQL çalışacak.
2. `.env` dosyaları netleşecek.
3. Prisma migration oluşturulup DB’ye uygulanacak.
4. Seed uçtan uca çalışacak.
5. API gerçek DB ile çalışacak.
6. Web admin API’den veri çekecek.
7. Mobile app API’ye bağlanacak.
8. Booking akışı slot üretimi, rezervasyon, mock ödeme ve mock video token ile uçtan uca test edilecek.
9. Tüm build/test/lint/format kontrolleri geçecek.
10. README’ye “lokalde sıfırdan çalıştırma” bölümü eklenecek.

Bu görev bittiğinde repo, yeni bir geliştiricinin `pnpm install`, `docker compose up`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev` komutlarıyla ayağa kaldırabileceği durumda olmalı.

---

## 1. Güvenli başlangıç ve mevcut durumu koruma

### 1.1 Çalışma dizinine gir

```bash
cd /Users/investintech/Developer/unluapp
```

### 1.2 Git deposu yoksa başlat

Dizin Git reposu değilse:

```bash
git init
```

Aşağıdakileri kontrol et:

```bash
git status --short
```

### 1.3 `.gitignore` oluştur veya düzelt

Kök dizinde `.gitignore` yoksa oluştur. Varsa eksikleri ekle.

En az şunları içermeli:

```gitignore
node_modules
.pnpm-store
.next
.expo
.turbo
dist
build
coverage
.env
.env.local
.env.*.local
*.log
.DS_Store
apps/api/prisma/dev.db
```

Önemli: `.env.example` commitlenebilir, gerçek `.env` commitlenmemeli.

### 1.4 İlk checkpoint commit’i

Git repo yeni kurulduysa veya mevcut değişiklikler izlenmiyorsa, önce mevcut hali checkpoint olarak commit et:

```bash
git add .
git commit -m "checkpoint: current generated MVP scaffold"
```

Commit mümkün değilse sebebini not al ama göreve devam et.

---

## 2. Workspace ve script standardizasyonu

Kök `package.json`, workspace paketleri ve script’leri incele. Amaç tek komutlarla DB, API, web ve mobile süreçlerini yönetmek.

### 2.1 Kök package.json script hedefleri

Kök `package.json` içinde şu script’ler bulunmalı veya eklenmeli:

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:api": "pnpm --filter api dev",
    "dev:web": "pnpm --filter web dev",
    "dev:mobile": "pnpm --filter mobile dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "format": "pnpm -r format",
    "db:generate": "pnpm --filter api prisma:generate",
    "db:migrate": "pnpm --filter api prisma:migrate",
    "db:deploy": "pnpm --filter api prisma:deploy",
    "db:seed": "pnpm --filter api prisma:seed",
    "db:studio": "pnpm --filter api prisma:studio",
    "db:reset": "pnpm --filter api prisma:reset"
  }
}
```

Mevcut script isimleri farklıysa kırmadan uyumlu alias ekle.

### 2.2 API package.json script hedefleri

`apps/api/package.json` içinde şu script’ler çalışmalı:

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "start": "nest start",
    "build": "nest build",
    "test": "jest",
    "lint": "eslint \"src/**/*.ts\" \"prisma/**/*.ts\"",
    "format": "prettier --write \"src/**/*.ts\" \"prisma/**/*.ts\"",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset --force"
  }
}
```

Eksik dependency varsa ekle:

```bash
pnpm --filter api add -D tsx
```

### 2.3 Web ve mobile script hedefleri

`apps/web/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint || eslint .",
    "test": "echo \"No web tests yet\""
  }
}
```

`apps/mobile/package.json`:

```json
{
  "scripts": {
    "dev": "expo start",
    "start": "expo start",
    "lint": "eslint .",
    "test": "echo \"No mobile tests yet\""
  }
}
```

Kırılan script olursa mevcut framework yapısına göre düzelt.

---

## 3. Docker PostgreSQL ve environment düzeni

### 3.1 docker-compose kontrolü

Kök `docker-compose.yml` içinde PostgreSQL servisi net olmalı:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: unluapp-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: unluapp
      POSTGRES_PASSWORD: unluapp_password
      POSTGRES_DB: unluapp_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U unluapp -d unluapp_dev"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

Eğer port çakışma riski varsa `.env.example` içine alternatif port notu ekle ama varsayılanı 5432 bırak.

### 3.2 .env.example standardı

Kök `.env.example` içinde en az şunlar olsun:

```bash
# Database
DATABASE_URL="postgresql://unluapp:unluapp_password@localhost:5432/unluapp_dev?schema=public"

# API
API_PORT=3001
JWT_SECRET="change-me-in-local-development"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"

# Web
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Mobile
EXPO_PUBLIC_API_URL="http://localhost:3001"

# Mock providers
PAYMENT_PROVIDER="mock"
VIDEO_PROVIDER="mock"
AGORA_APP_ID=""
AGORA_APP_CERTIFICATE=""
IYZICO_API_KEY=""
IYZICO_SECRET_KEY=""
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
```

### 3.3 Gerçek .env oluşturma

Eğer kökte `.env` yoksa `.env.example` üzerinden oluştur:

```bash
cp .env.example .env
```

API kendi env dosyasını bekliyorsa `apps/api/.env` oluştur ve aynı `DATABASE_URL`, `JWT_SECRET`, `API_PORT` değerlerini ekle. Next.js root env okuyorsa gerek yok; ama `apps/web/.env.local` bekliyorsa oluştur:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Expo için gerekirse `apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_URL="http://localhost:3001"
```

Not: Gerçek secret üretme gerekmiyor; lokal development placeholder kullanılabilir.

---

## 4. Prisma schema sertleştirme

`apps/api/prisma/schema.prisma` dosyasını incele. Aşağıdaki model mantığı eksiksiz olmalı. İsimler mevcut dosyada farklıysa gereksiz rename yapma; ama işlevsel karşılıkları garanti et.

### 4.1 Temel enumlar

Şunlara denk enumlar bulunmalı:

```prisma
enum UserRole {
  USER
  TALENT
  ADMIN
}

enum TalentStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  SUSPENDED
}

enum BookingStatus {
  PENDING_PAYMENT
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
  REFUNDED
}

enum PaymentStatus {
  INITIATED
  AUTHORIZED
  CAPTURED
  FAILED
  CANCELLED
  REFUNDED
}

enum ConsentType {
  TERMS
  PRIVACY
  KVKK
  CAMERA_AUDIO
  RECORDING
}
```

### 4.2 User

User modelinde şunlar olmalı:

- id
- email unique
- passwordHash
- fullName
- phone nullable
- role
- createdAt
- updatedAt
- talentProfile relation nullable
- bookings relation
- consentLogs relation

### 4.3 TalentProfile

Talent profile modelinde şunlar olmalı:

- id
- userId unique
- slug unique
- displayName
- title
- bio
- category
- avatarUrl nullable
- coverUrl nullable
- status
- basePriceCents veya priceCents
- currency default TRY
- commissionRateBps default 1500
- isFeatured boolean default false
- createdAt
- updatedAt
- availabilities relation
- bookings relation

### 4.4 AvailabilityWindow

Uzmanın açtığı müsaitlik pencereleri:

- id
- talentId
- startsAt
- endsAt
- slotDurationMinutes default 15
- bufferMinutes default 0
- isActive default true
- createdAt
- updatedAt

### 4.5 Booking

Booking modelinde:

- id
- userId
- talentId
- startsAt
- endsAt
- durationMinutes
- priceCents
- currency
- platformFeeCents
- talentPayoutCents
- status
- notes nullable
- videoRoomId nullable
- videoJoinToken nullable veya ayrı VideoSession
- createdAt
- updatedAt
- payment relation nullable

Önemli unique/index kuralları:

```prisma
@@index([talentId, startsAt])
@@index([userId, startsAt])
```

Aynı talent için aynı slot tekrar rezerve edilememeli. Bunun için uygun unique constraint ekle:

```prisma
@@unique([talentId, startsAt])
```

Eğer iptal edilen booking sonrası aynı slot tekrar açılacaksa unique constraint yerine service seviyesinde aktif statüler için kontrol yapılmalı. PostgreSQL partial unique index Prisma’da native desteklenmediği için ilk MVP’de `@@unique([talentId, startsAt])` yeterli olabilir. README’ye bu trade-off’u not et.

### 4.6 Payment

- id
- bookingId unique
- provider
- providerReference nullable
- amountCents
- currency
- status
- rawResponseJson nullable Json
- createdAt
- updatedAt

### 4.7 ConsentLog

- id
- userId
- type
- version
- acceptedAt
- ipAddress nullable
- userAgent nullable
- metadata nullable Json

### 4.8 Migration oluştur

Schema hazır olduktan sonra:

```bash
pnpm db:generate
pnpm db:migrate --name init_mvp
```

Kök script `--name` parametresini düzgün geçirmiyorsa API dizininden çalıştır:

```bash
cd apps/api
pnpm prisma migrate dev --name init_mvp
cd ../..
```

Migration dosyası oluşmalı.

---

## 5. Seed akışını gerçekçi hale getir

`apps/api/prisma/seed.ts` dosyasını idempotent yap. Aynı seed tekrar çalıştırıldığında duplicate hatası vermemeli.

### 5.1 Seed kullanıcıları

Aşağıdaki demo hesapları oluştur:

1. Admin
   - email: `admin@unluapp.local`
   - password: `Password123!`
   - role: `ADMIN`

2. Normal kullanıcı
   - email: `demo@unluapp.local`
   - password: `Password123!`
   - role: `USER`

3. Talent kullanıcıları
   - `ayse-yildiz@unluapp.local`
   - `mert-kaya@unluapp.local`
   - `zeynep-demir@unluapp.local`

Tüm şifreler bcrypt ile hashlenmeli.

### 5.2 Seed talent profilleri

En az 3 onaylı talent profili oluştur:

1. Ayşe Yıldız
   - slug: `ayse-yildiz`
   - title: `Oyuncu ve Yaratıcı Drama Eğitmeni`
   - category: `Eğlence`
   - base price: 250000 kuruş / 2500 TRY
   - duration slots: 15 dk

2. Mert Kaya
   - slug: `mert-kaya`
   - title: `Girişimci ve Melek Yatırımcı`
   - category: `İş ve Girişimcilik`
   - base price: 500000 kuruş / 5000 TRY

3. Zeynep Demir
   - slug: `zeynep-demir`
   - title: `Beslenme Uzmanı ve İçerik Üreticisi`
   - category: `Sağlık ve Yaşam`
   - base price: 150000 kuruş / 1500 TRY

### 5.3 Seed availability

Her talent için bugünden sonraki 7 gün içinde en az 2 farklı availability window oluştur. Saatleri lokal geliştirme için makul seç:

- yarın 14:00-16:00
- 3 gün sonra 10:00-12:00

Tarihleri dinamik üret, geçmiş tarih oluşmasın.

### 5.4 Seed booking

Demo kullanıcı için bir adet `CONFIRMED` booking oluştur. Bu booking gelecekte olmalı ve çakışma yaratmamalı.

### 5.5 Seed çalıştır

```bash
pnpm db:seed
```

Sonra Prisma Studio veya API endpoint üzerinden data geldiğini doğrula.

---

## 6. Backend API uçtan uca sertleştirme

### 6.1 Global API prefix ve health endpoint

NestJS uygulamasında global prefix kullan:

```ts
app.setGlobalPrefix('api');
```

Health endpoint:

```http
GET /api/health
```

Cevap:

```json
{
  "status": "ok",
  "service": "unluapp-api",
  "timestamp": "..."
}
```

### 6.2 ValidationPipe ve error formatı

`main.ts` içinde global validation pipe aktif olmalı:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  })
);
```

DTO validation eksikse ekle.

### 6.3 CORS

CORS `CORS_ORIGIN` env’den okunmalı. Lokal web için `http://localhost:3000`, Expo için gerekirse wildcard development modu uygulanabilir. Production mantığını README’de not et.

### 6.4 Auth endpointleri

Şu endpointler çalışmalı:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Register body:

```json
{
  "fullName": "Demo User",
  "email": "demo2@unluapp.local",
  "password": "Password123!",
  "acceptedTerms": true,
  "acceptedKvkk": true
}
```

Login body:

```json
{
  "email": "demo@unluapp.local",
  "password": "Password123!"
}
```

Login cevabı:

```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "email": "demo@unluapp.local",
    "fullName": "Demo User",
    "role": "USER"
  }
}
```

### 6.5 Talent endpointleri

Şu endpointler çalışmalı:

```http
GET /api/talents
GET /api/talents/featured
GET /api/talents/:slug
GET /api/talents/:slug/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
```

Liste cevabında booking için gereken temel alanlar olmalı:

```json
{
  "items": [
    {
      "id": "...",
      "slug": "ayse-yildiz",
      "displayName": "Ayşe Yıldız",
      "title": "Oyuncu ve Yaratıcı Drama Eğitmeni",
      "category": "Eğlence",
      "priceCents": 250000,
      "currency": "TRY",
      "avatarUrl": null,
      "isFeatured": true
    }
  ]
}
```

### 6.6 Slot üretim servisi

Slot endpoint’i availability window’lardan boş slot üretmeli.

Kurallar:

1. `from` ve `to` query parametreleri zorunlu veya default 7 gün olmalı.
2. Geçmiş saatler dönmemeli.
3. Talent’ın inactive availability window’ları kullanılmamalı.
4. Mevcut `PENDING_PAYMENT`, `CONFIRMED`, `COMPLETED` booking’lerle çakışan slotlar dönmemeli.
5. `CANCELLED`, `REFUNDED`, `NO_SHOW` booking’ler slotu bloklamasın. Eğer Prisma unique constraint nedeniyle yeniden booking imkansızsa bunu şimdilik service düzeyinde değil README’de trade-off olarak belirt.
6. Slot response formatı:

```json
{
  "items": [
    {
      "startsAt": "2026-06-06T14:00:00.000Z",
      "endsAt": "2026-06-06T14:15:00.000Z",
      "durationMinutes": 15,
      "priceCents": 250000,
      "currency": "TRY"
    }
  ]
}
```

### 6.7 Booking endpointleri

Şunlar çalışmalı:

```http
POST /api/bookings
GET /api/bookings/my
GET /api/bookings/:id
POST /api/bookings/:id/cancel
POST /api/bookings/:id/complete
```

Booking oluşturma body:

```json
{
  "talentSlug": "ayse-yildiz",
  "startsAt": "2026-06-06T14:00:00.000Z",
  "durationMinutes": 15,
  "notes": "Kariyer tavsiyesi almak istiyorum.",
  "acceptedCameraAudioConsent": true
}
```

Booking create işlemi şunları yapmalı:

1. Kullanıcı auth zorunlu.
2. Talent approved olmalı.
3. Slot gerçekten available olmalı.
4. Aynı talent/slot için aktif booking varsa hata vermeli.
5. Fiyat talent profilinden hesaplanmalı; client’tan fiyat alınmamalı.
6. Platform komisyonu BPS üzerinden hesaplanmalı.
7. Mock payment authorize/capture yapılmalı.
8. Booking `CONFIRMED` statüsüne geçmeli.
9. Mock video room id ve join token oluşmalı.
10. Camera/audio consent log kayıt edilmeli.

Başarılı response:

```json
{
  "id": "...",
  "status": "CONFIRMED",
  "startsAt": "...",
  "endsAt": "...",
  "priceCents": 250000,
  "platformFeeCents": 37500,
  "talentPayoutCents": 212500,
  "videoRoomId": "mock-room-...",
  "videoJoinToken": "mock-token-..."
}
```

### 6.8 Admin endpointleri

Admin rolüyle çalışan endpointler:

```http
GET /api/admin/summary
GET /api/admin/talents
POST /api/admin/talents/:id/approve
POST /api/admin/talents/:id/reject
GET /api/admin/bookings
```

Admin guard gerçekten `ADMIN` rolü istemeli.

`/api/admin/summary` örnek response:

```json
{
  "usersCount": 10,
  "talentsCount": 3,
  "approvedTalentsCount": 3,
  "bookingsCount": 1,
  "grossRevenueCents": 250000,
  "platformRevenueCents": 37500
}
```

### 6.9 Hata yönetimi

Aşağıdaki durumlar için anlamlı HTTP status ve mesaj ver:

- Yanlış login: 401
- Yetkisiz admin: 403
- Talent bulunamadı: 404
- Slot uygun değil: 409
- Consent eksik: 400
- Validation hatası: 400

---

## 7. Payment provider abstraction

Mock ödeme kodu ileride iyzico’ya geçişe hazır olmalı.

### 7.1 Interface oluştur

`apps/api/src/modules/payments/payment-provider.interface.ts`:

```ts
export interface AuthorizePaymentInput {
  bookingId: string;
  userId: string;
  amountCents: number;
  currency: string;
}

export interface AuthorizePaymentResult {
  provider: string;
  providerReference: string;
  status: 'AUTHORIZED' | 'CAPTURED';
  rawResponse?: Record<string, unknown>;
}

export interface PaymentProvider {
  authorize(input: AuthorizePaymentInput): Promise<AuthorizePaymentResult>;
  capture(providerReference: string): Promise<AuthorizePaymentResult>;
  cancel(providerReference: string): Promise<AuthorizePaymentResult>;
  refund(providerReference: string): Promise<AuthorizePaymentResult>;
}
```

### 7.2 Mock provider

`MockPaymentProvider` deterministic çalışmalı:

- `providerReference = mock_pay_${bookingId}_${Date.now()}`
- authorize başarılı
- capture başarılı

### 7.3 İyzico placeholder

Gerçek iyzico entegrasyonu yapılmayacak; ama dosya iskeleti ve TODO bırakılacak:

`IyzicoPaymentProvider`:

```ts
throw new Error('Iyzico provider is not implemented yet. Set PAYMENT_PROVIDER=mock for local development.');
```

README’ye gerçek entegrasyonun sonraki faz işi olduğunu yaz.

---

## 8. Video provider abstraction

Mock video token ileride Agora’ya geçişe hazır olmalı.

### 8.1 Interface oluştur

```ts
export interface CreateVideoSessionInput {
  bookingId: string;
  talentId: string;
  userId: string;
  startsAt: Date;
  endsAt: Date;
}

export interface CreateVideoSessionResult {
  roomId: string;
  userJoinToken: string;
  talentJoinToken: string;
  provider: string;
}

export interface VideoProvider {
  createSession(input: CreateVideoSessionInput): Promise<CreateVideoSessionResult>;
}
```

### 8.2 Mock provider

Mock provider room/token üretsin:

```ts
roomId = `mock-room-${bookingId}`
userJoinToken = `mock-user-token-${bookingId}`
talentJoinToken = `mock-talent-token-${bookingId}`
```

### 8.3 Agora placeholder

Gerçek Agora token üretimi sonraki faza bırakılacak. Ama env ve provider switch mimarisi hazır olacak.

---

## 9. Web entegrasyonu

Next.js web uygulaması şu an landing ve admin ekranlarına sahip. Bu fazda admin ekranları gerçek API’den veri çekmeli.

### 9.1 API client oluştur

`apps/web/lib/api.ts`:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
```

### 9.2 Landing page

Landing page statik kalabilir ama featured talents API’den çekilebiliyorsa çek. API kapalıysa build kırılmasın. Server component içinde try/catch kullan.

### 9.3 Admin login basitliği

Bu fazda full admin auth UI yapılması şart değil; ama admin endpointleri token istiyorsa admin dashboard için development token alma akışı ekle:

- Basit login formu veya
- `.env.local` içinde `NEXT_PUBLIC_DEV_ADMIN_TOKEN` kullanımı önerilmez.

Tercih edilen: `/admin/login` sayfası ekle.

Admin login:

1. email/password alır.
2. `/api/auth/login` çağırır.
3. access token’ı `localStorage` içine koyar.
4. `/admin/dashboard` ve `/admin/talents` sayfaları bu token’ı kullanır.

Eğer admin sayfaları server component ise client component’e dönüştürmek daha kolay olabilir.

### 9.4 Admin dashboard

`/admin/dashboard` şu verileri göstersin:

- Toplam kullanıcı
- Onaylı uzman
- Toplam rezervasyon
- Platform geliri

API hata verirse kullanıcıya Türkçe hata kartı göster.

### 9.5 Admin talents

`/admin/talents`:

- Talent listesi
- Status badge
- Approve/reject butonları
- İşlem sonrası liste yenilensin

---

## 10. Mobile entegrasyonu

Expo mobil uygulama auth, liste, detay ve rezervasyon ekranlarına sahip. Bu fazda gerçek API ile çalışmalı.

### 10.1 Mobile API client

`apps/mobile/lib/api.ts` oluştur:

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options?.headers ?? {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
```

Not: Kalıcı token storage için `expo-secure-store` sonraki faz olabilir. Bu fazda memory token yeterli.

### 10.2 Login ekranı

`demo@unluapp.local / Password123!` ile login çalışmalı.

Başarılı login sonrası home ekranına yönlendir.

### 10.3 Home ekranı

`GET /api/talents/featured` veya `GET /api/talents` ile talent listesi gelsin.

Kartta:

- Ad
- Ünvan
- Kategori
- Başlangıç fiyatı
- “Detaya git”

### 10.4 Talent detay

`GET /api/talents/:slug` ile detay gelsin.

`GET /api/talents/:slug/slots` ile slotlar listelensin.

Slot seçimi sonrası booking ekranına geç.

### 10.5 Booking ekranı

Booking create body’sini gönder:

```json
{
  "talentSlug": "...",
  "startsAt": "...",
  "durationMinutes": 15,
  "notes": "...",
  "acceptedCameraAudioConsent": true
}
```

Başarılı olursa:

- Rezervasyon onay ekranı göster.
- Tarih/saat, ücret ve video room id göster.

Hata olursa Türkçe hata mesajı göster.

### 10.6 iOS/Android localhost notu

README’ye şu notu ekle:

- iOS Simulator için `http://localhost:3001` çalışabilir.
- Android Emulator için gerekirse `http://10.0.2.2:3001` kullanılmalı.
- Fiziksel cihazda bilgisayarın LAN IP’si kullanılmalı.

---

## 11. Testleri genişlet

### 11.1 API unit/service testleri

Mevcut `pnpm --filter api test` zaten geçiyor. Şunları ekle veya mevcut testleri genişlet:

1. Auth service:
   - login doğru şifre ile token döner
   - yanlış şifre 401 döner

2. Slot service:
   - availability window’dan slot üretir
   - geçmiş slotları dönmez
   - booked slotları dışlar

3. Booking service:
   - uygun slotta booking oluşturur
   - çakışan booking’de 409 üretir
   - consent false ise 400 üretir
   - platform fee ve payout doğru hesaplanır

4. Admin guard:
   - USER rolü admin endpoint’e erişemez
   - ADMIN erişebilir

### 11.2 E2E smoke test script’i

Basit bir node/tsx smoke test ekle:

`apps/api/scripts/smoke.ts`

Akış:

1. Health çağır.
2. Demo kullanıcı ile login ol.
3. Talent listele.
4. İlk talent’ın slotlarını çek.
5. İlk uygun slot için booking oluştur.
6. Booking response status `CONFIRMED` mi kontrol et.

Script:

```json
"smoke": "tsx scripts/smoke.ts"
```

Kök alias:

```json
"smoke:api": "pnpm --filter api smoke"
```

Not: Smoke test API’nin çalışıyor olmasını gerektirir. README’ye önce API’yi başlatmak gerektiğini yaz.

---

## 12. Manuel doğrulama komutları

Bu görevi bitirmeden önce aşağıdaki komutları sırayla çalıştır ve hataları düzelt:

```bash
pnpm install
pnpm db:generate
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm --filter api test
pnpm --filter api build
pnpm --filter web build
```

Ardından API’yi başlatıp smoke test çalıştır:

Terminal 1:

```bash
pnpm dev:api
```

Terminal 2:

```bash
curl http://localhost:3001/api/health
pnpm smoke:api
```

Web için:

```bash
pnpm dev:web
```

Aç:

```text
http://localhost:3000
http://localhost:3000/admin/login
http://localhost:3000/admin/dashboard
```

Mobile için:

```bash
pnpm dev:mobile
```

Expo açıldığında demo login ile test et.

---

## 13. README güncellemesi

`README.md` dosyasına şu bölümleri ekle:

### 13.1 Hızlı başlangıç

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

### 13.2 Demo hesaplar

```text
Admin:
admin@unluapp.local / Password123!

Kullanıcı:
demo@unluapp.local / Password123!
```

### 13.3 Servis URL’leri

```text
API: http://localhost:3001/api/health
Web: http://localhost:3000
Admin: http://localhost:3000/admin/login
```

### 13.4 MVP kapsamı

- Kullanıcı auth
- Talent listeleme/detay
- Availability ve slot üretimi
- Booking
- Mock payment
- Mock video session
- Admin dashboard
- Admin talent approval
- KVKK/camera/audio consent log

### 13.5 Ertelenen işler

`docs/deferred.md` içeriğiyle uyumlu şekilde şunları not et:

- Gerçek iyzico marketplace split payment
- Gerçek Agora token üretimi
- Secure token storage
- Email/SMS bildirimleri
- Takvim entegrasyonu
- Gelişmiş moderasyon
- KVKK hukuk metinlerinin avukat onayı
- Production deployment

---

## 14. docs/deferred.md güncellemesi

Ertelenen işleri teknik kabul kriterleriyle güncelle:

1. İyzico gerçek entegrasyonu
   - sandbox credential
   - submerchant onboarding
   - preauth/capture/refund
   - webhook doğrulama

2. Agora gerçek entegrasyonu
   - RTC token generation
   - channel lifecycle
   - role-based token
   - call quality event logs

3. Bildirimler
   - booking confirmation email
   - reminder email
   - cancellation email
   - push notification

4. Production security
   - rate limiting
   - refresh token rotation
   - secure cookies veya native secure storage
   - audit logs

5. Compliance
   - KVKK metin versiyonlama
   - açık rıza kayıtlarının export edilebilir olması
   - data retention policy

---

## 15. Kod kalitesi ve mimari kurallar

Bu kuralları ihlal etme:

1. Client’tan gelen fiyat değerlerine güvenme.
2. Booking fiyatını daima server hesaplasın.
3. Role guard olmadan admin endpoint açma.
4. Raw password saklama.
5. `.env` commit etme.
6. API response’larında passwordHash dönme.
7. Validation DTO olmadan public POST endpoint bırakma.
8. Mock provider kodunu gerçek provider’a karıştırma.
9. Seed script’i idempotent olsun.
10. Build kırıkken görevi tamamlanmış sayma.

---

## 16. Kabul kriterleri

Görev ancak aşağıdakiler sağlanınca tamamlanmış sayılır:

- [ ] `docker compose up -d postgres` başarılı.
- [ ] `pnpm db:generate` başarılı.
- [ ] `pnpm db:migrate` başarılı.
- [ ] `pnpm db:seed` başarılı.
- [ ] `pnpm --filter api test` başarılı.
- [ ] `pnpm --filter api build` başarılı.
- [ ] `pnpm --filter web build` başarılı.
- [ ] `GET /api/health` çalışıyor.
- [ ] Demo kullanıcı login olabiliyor.
- [ ] Talent listesi API’den geliyor.
- [ ] Slot listesi API’den geliyor.
- [ ] Booking oluşturulabiliyor.
- [ ] Booking response içinde mock video room/token var.
- [ ] Admin login çalışıyor.
- [ ] Admin dashboard API’den veri gösteriyor.
- [ ] README güncel.
- [ ] `docs/deferred.md` güncel.
- [ ] Gerçek `.env` git’e eklenmemiş.

---

## 17. Final rapor formatı

İşi bitirince kullanıcıya şu formatta rapor ver:

```markdown
## Tamamlananlar

- ...

## Değiştirilen / eklenen önemli dosyalar

- `/Users/investintech/Developer/unluapp/...`

## Doğrulama

- `pnpm db:generate` ✅
- `docker compose up -d postgres` ✅
- `pnpm db:migrate` ✅
- `pnpm db:seed` ✅
- `pnpm --filter api test` ✅
- `pnpm --filter api build` ✅
- `pnpm --filter web build` ✅
- `curl http://localhost:3001/api/health` ✅
- `pnpm smoke:api` ✅

## Demo bilgiler

- Admin: `admin@unluapp.local / Password123!`
- Kullanıcı: `demo@unluapp.local / Password123!`

## Notlar

- ...

## Sıradaki önerilen faz

- ...
```

Eğer bir doğrulama geçmezse görevi bitirme. Önce düzelt. Düzeltilemiyorsa en yakın çalışan hale getirip net hata çıktısını, hangi dosyada takıldığını ve uygulanacak sonraki çözümü yaz.
