# Windsurf Implementation Dosyası — İlk Adım / Faz 1

> Proje: Ünlüler, uzmanlar ve dijital içerik üreticileriyle zaman bazlı canlı 1:1 görüntülü görüşme platformu  
> Amaç: Windsurf/Cascade bu dosyayı okuyup, projenin ilk teknik temelini uçtan uca kuracak.  
> Faz: **Faz 1 — MVP Temel Omurga, Kimlik, Uzman Profili, Müsaitlik, Randevu ve Entegrasyon İskeletleri**  
> Dil: Kod İngilizce, kullanıcıya görünen metinler Türkçe.  
> Öncelik: Mobil-first, güvenli, ölçeklenebilir, ödeme/video entegrasyonuna hazır mimari.

---

## 0. Windsurf İçin Net Talimat

Bu dosyadaki kapsamı **Faz 1** olarak uygula. Faz 1 sonunda gerçek ödeme alma ve gerçek video görüşme başlatma zorunlu değildir; fakat bu servislerin production entegrasyonuna hazır arayüzleri, mock implementasyonları, veri modeli, state machine ve API sözleşmeleri hazır olmalıdır.

Aşağıdaki kurallara uy:

1. Monorepo oluştur.
2. TypeScript kullan.
3. Backend, frontend, mobile ve ortak paketleri ayrıştır.
4. PostgreSQL + Prisma ile kalıcı veri modelini kur.
5. Kimlik doğrulama, rol sistemi, uzman profili, müsaitlik slotları, randevu oluşturma ve mock payment/video akışlarını tamamla.
6. Gerçek entegrasyon anahtarları isteme; `.env.example` oluştur.
7. Önce çalışan iskeleti kur, sonra domain özelliklerini ekle.
8. Her kritik domain kuralı için test yaz.
9. Kodda `TODO` bırakma; yapılmayacak şeyleri `docs/deferred.md` içinde açıkça listele.
10. Faz 1 dışında kalan özellikleri uygulama; sadece eklenti noktalarını tasarla.

---

## 1. Ürün Özeti

Platform, kullanıcıların ünlüler, uzmanlar ve dijital içerik üreticileri ile 15, 30, 45 veya 60 dakikalık canlı 1:1 görüşme satın almasını sağlar.

Faz 1’in hedefi, platformun temel pazar yeri omurgasını kurmaktır:

- Kullanıcı kaydı/girişi
- Roller: müşteri, uzman, menajer, admin
- Uzman başvurusu ve uzman profili
- Kategori sistemi
- Uzmanın müsaitlik pencereleri
- Uygun slot üretimi
- Randevu oluşturma
- Mock ödeme ön provizyonu
- Mock ödeme capture/refund akışları
- Mock Agora token üretimi
- KVKK/onay logları
- Admin denetim ekranı iskeleti
- Mobil uygulama iskeleti
- Web admin/landing iskeleti
- Test, lint, format, seed ve lokal geliştirme ortamı

---

## 2. Ürün Konumlandırması

Bu proje sadece “ünlüyle konuşma” uygulaması değildir. Platformun uzun vadeli konumu:

**Zaman bazlı uzmanlık ve deneyim pazaryeri.**

Bu nedenle veri modeli sadece oyuncu/müzisyen profillerine göre değil; yatırımcı, CEO, diyetisyen, koç, sporcu, psikolog, marka danışmanı gibi farklı tedarik segmentlerini de desteklemelidir.

Faz 1’de iki ana uzman segmenti desteklenmeli:

1. `ENTERTAINMENT`
   - Oyuncu
   - Müzisyen
   - Sporcu
   - E-sporcu
   - Influencer
   - Reality show figürü

2. `EXPERTISE`
   - Girişimci
   - Yatırımcı
   - CEO / Yönetici
   - Diyetisyen
   - Marka danışmanı
   - Fitness koçu
   - Kariyer danışmanı

---

## 3. Faz 1 Kapsamı

### 3.1 Dahil Olanlar

Faz 1’de aşağıdakiler yapılacak:

#### Backend

- NestJS API uygulaması
- PostgreSQL veritabanı
- Prisma ORM
- JWT tabanlı authentication
- Refresh token desteği
- Rol bazlı authorization
- Domain servisleri
- Booking state machine
- Mock payment provider
- Mock video provider
- Swagger/OpenAPI dokümantasyonu
- Zod veya class-validator ile request validation
- Global exception handling
- Audit log middleware/interceptor
- Seed data
- Unit ve integration testleri

#### Mobile

- Expo React Native uygulaması
- Login/register ekranları
- Ana sayfa
- Uzman listeleme
- Uzman detay
- Slot seçimi
- Randevu oluşturma akışı
- Rezervasyon detay ekranı
- Profil ekranı
- API client
- Auth token storage
- Temel tema sistemi

#### Web

- Next.js uygulaması
- Landing page
- Admin login
- Admin dashboard iskeleti
- Uzman başvuru listesi
- Randevu listesi
- Kullanıcı listesi iskeleti

#### Ortak Paketler

- Shared TypeScript types
- Shared validation schemas
- Shared constants
- Shared API client base

#### DevOps / Lokal

- Docker Compose
- PostgreSQL container
- Redis container, Faz 1’de sadece altyapı olarak
- Mailpit container, ileride e-posta testleri için
- `.env.example`
- README
- Makefile veya pnpm scripts
- GitHub Actions CI iskeleti

---

### 3.2 Dahil Olmayanlar

Aşağıdakiler Faz 1’de **gerçek implementasyon** olarak yapılmayacak:

- Gerçek iyzico tahsilatı
- Gerçek split payment
- Gerçek Agora bağlantısı
- Gerçek video görüşme ekranı
- Canlı yayın / grup webinar
- Yapay zeka moderasyon entegrasyonu
- KYC / kimlik doğrulama
- E-fatura entegrasyonu
- Push notification production kurulumu
- Abonelik sistemi
- Chat sistemi
- B2B kurumsal hesaplar
- Çoklu dil sistemi
- Tam native iOS/Android release pipeline

Ancak bu başlıklar için domain’de genişlemeye uygun interface ve veri alanları bırakılacak.

---

## 4. Önerilen Teknoloji Mimarisi

### 4.1 Monorepo Yapısı

Paket yöneticisi: `pnpm`  
Monorepo aracı: `Turborepo` veya native pnpm workspaces  
Dil: TypeScript  
Kod formatı: Prettier  
Lint: ESLint  
Test: Vitest veya Jest  
E2E/API test: Supertest

Klasör yapısı:

```txt
celebrity-call-platform/
  apps/
    api/
      src/
      prisma/
      test/
      package.json
    mobile/
      app/
      src/
      assets/
      package.json
    web/
      app/
      src/
      package.json
  packages/
    shared/
      src/
      package.json
    config/
      eslint/
      tsconfig/
      prettier/
  docker/
    postgres/
  docs/
    architecture.md
    api-contract.md
    booking-state-machine.md
    deferred.md
    security-kvkk.md
  .github/
    workflows/
      ci.yml
  docker-compose.yml
  pnpm-workspace.yaml
  turbo.json
  package.json
  README.md
  .env.example
```

---

### 4.2 Backend Stack

Kullan:

- NestJS
- Prisma
- PostgreSQL
- JWT
- Argon2 password hashing
- Passport strategy veya custom guard
- Swagger
- Config module
- Pino veya Winston logger
- Helmet
- CORS allowlist
- Rate limit middleware

Backend port:

```txt
API_PORT=4000
```

Ana URL:

```txt
http://localhost:4000/api
```

Swagger:

```txt
http://localhost:4000/docs
```

---

### 4.3 Mobile Stack

Kullan:

- Expo
- React Native
- TypeScript
- Expo Router
- React Query / TanStack Query
- Zustand veya minimal context auth store
- SecureStore veya benzeri güvenli token storage
- React Hook Form
- Zod resolver

Mobile navigasyon:

```txt
/(auth)/login
/(auth)/register
/(tabs)/home
/(tabs)/search
/(tabs)/bookings
/(tabs)/profile
/talent/[slug]
/booking/create/[talentId]
/booking/[bookingId]
```

---

### 4.4 Web Stack

Kullan:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Query
- Server actions zorunlu değil; API client kullanılabilir
- Admin panel için responsive table components

Web rotaları:

```txt
/
/admin/login
/admin/dashboard
/admin/talents
/admin/talents/[id]
/admin/bookings
/admin/users
```

---

## 5. Faz 1 Domain Modeli

### 5.1 Roller

```ts
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  TALENT = 'TALENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}
```

Kural:

- Her kullanıcı en az `CUSTOMER` rolüne sahiptir.
- Uzman başvurusu onaylanınca kullanıcıya `TALENT` rolü eklenir.
- Menajer birden fazla uzmanı yönetebilir.
- Admin tüm kayıtları görebilir.

---

### 5.2 Uzman Segmentleri

```ts
export enum TalentSegment {
  ENTERTAINMENT = 'ENTERTAINMENT',
  EXPERTISE = 'EXPERTISE',
}
```

---

### 5.3 Uzman Durumu

```ts
export enum TalentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}
```

Kural:

- `APPROVED` olmayan uzman public listede görünmez.
- `SUSPENDED` uzman için yeni randevu alınamaz.
- `PENDING_REVIEW` uzman admin panelde görünür.

---

### 5.4 Randevu Durumları

```ts
export enum BookingStatus {
  DRAFT = 'DRAFT',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CONFIRMED = 'CONFIRMED',
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_TALENT = 'CANCELLED_BY_TALENT',
  NO_SHOW_CUSTOMER = 'NO_SHOW_CUSTOMER',
  NO_SHOW_TALENT = 'NO_SHOW_TALENT',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  SETTLEMENT_PENDING = 'SETTLEMENT_PENDING',
  SETTLED = 'SETTLED',
  DISPUTED = 'DISPUTED',
}
```

Faz 1’de kullanılacak minimum durumlar:

- `PAYMENT_PENDING`
- `CONFIRMED`
- `CANCELLED_BY_CUSTOMER`
- `CANCELLED_BY_TALENT`
- `COMPLETED`
- `REFUNDED`

Diğerleri ileriki faz için veri modelinde hazır bulunabilir.

---

### 5.5 Ödeme Durumları

```ts
export enum PaymentStatus {
  INITIATED = 'INITIATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}
```

Faz 1’de gerçek ödeme yok. `MockPaymentProvider` kullanılacak.

---

### 5.6 Consent / KVKK Onay Tipleri

```ts
export enum ConsentType {
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  CAMERA_AUDIO_PROCESSING = 'CAMERA_AUDIO_PROCESSING',
  MARKETING_COMMUNICATION = 'MARKETING_COMMUNICATION',
  VIDEO_RECORDING_OPTIONAL = 'VIDEO_RECORDING_OPTIONAL',
}
```

Kural:

- Kullanıcı register olurken Terms + Privacy onayı zorunlu.
- Randevu oluştururken Camera/Audio processing onayı zorunlu.
- Recording optional, default false.
- Marketing optional, default false.
- Onaylar `ConsentLog` tablosuna immutable olarak yazılır.

---

## 6. Prisma Veri Modeli

Aşağıdaki şemayı `apps/api/prisma/schema.prisma` içine uygula. Gerekirse Prisma syntax detaylarını düzenle ama domain alanlarını koru.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CUSTOMER
  TALENT
  MANAGER
  ADMIN
}

enum TalentSegment {
  ENTERTAINMENT
  EXPERTISE
}

enum TalentStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  SUSPENDED
}

enum BookingStatus {
  DRAFT
  PAYMENT_PENDING
  CONFIRMED
  READY
  IN_PROGRESS
  COMPLETED
  CANCELLED_BY_CUSTOMER
  CANCELLED_BY_TALENT
  NO_SHOW_CUSTOMER
  NO_SHOW_TALENT
  REFUND_PENDING
  REFUNDED
  SETTLEMENT_PENDING
  SETTLED
  DISPUTED
}

enum PaymentStatus {
  INITIATED
  AUTHORIZED
  CAPTURED
  CANCELLED
  REFUNDED
  FAILED
}

enum ConsentType {
  TERMS_OF_SERVICE
  PRIVACY_POLICY
  CAMERA_AUDIO_PROCESSING
  MARKETING_COMMUNICATION
  VIDEO_RECORDING_OPTIONAL
}

enum VideoProvider {
  MOCK
  AGORA
}

enum PaymentProvider {
  MOCK
  IYZICO
}

model User {
  id                 String      @id @default(cuid())
  email              String      @unique
  phone              String?     @unique
  passwordHash       String
  firstName          String
  lastName           String
  displayName        String?
  avatarUrl          String?
  roles              UserRole[]
  isEmailVerified    Boolean     @default(false)
  isPhoneVerified    Boolean     @default(false)
  isActive           Boolean     @default(true)
  lastLoginAt        DateTime?
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  talentProfile      TalentProfile?
  managedTalents     ManagerTalent[] @relation("ManagerUser")
  bookingsAsCustomer Booking[]       @relation("CustomerBookings")
  consentLogs        ConsentLog[]
  refreshTokens      RefreshToken[]
  auditLogs          AuditLog[]

  @@index([email])
  @@index([createdAt])
}

model RefreshToken {
  id          String   @id @default(cuid())
  userId      String
  tokenHash   String
  expiresAt   DateTime
  revokedAt   DateTime?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  talents     TalentCategory[]

  @@index([slug])
  @@index([isActive, sortOrder])
}

model TalentProfile {
  id                  String        @id @default(cuid())
  userId              String        @unique
  slug                String        @unique
  publicName           String
  headline            String
  bio                 String
  segment             TalentSegment
  status              TalentStatus  @default(DRAFT)
  profileImageUrl     String?
  coverImageUrl       String?
  introVideoUrl       String?
  baseCurrency        String        @default("TRY")
  minimumNoticeHours  Int           @default(24)
  cancellationHours   Int           @default(24)
  platformCommissionBps Int         @default(1500)
  isFeatured          Boolean       @default(false)
  approvedAt          DateTime?
  rejectedReason      String?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  user                User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  categories          TalentCategory[]
  sessionTypes        SessionType[]
  availabilityRules   AvailabilityRule[]
  availabilityBlocks  AvailabilityBlock[]
  bookings            Booking[]
  managers            ManagerTalent[] @relation("TalentManaged")

  @@index([slug])
  @@index([status, isFeatured])
  @@index([segment, status])
}

model TalentCategory {
  talentId    String
  categoryId  String
  createdAt   DateTime @default(now())

  talent      TalentProfile @relation(fields: [talentId], references: [id], onDelete: Cascade)
  category    Category      @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([talentId, categoryId])
}

model ManagerTalent {
  id          String   @id @default(cuid())
  managerId   String
  talentId    String
  createdAt   DateTime @default(now())

  manager     User          @relation("ManagerUser", fields: [managerId], references: [id], onDelete: Cascade)
  talent      TalentProfile @relation("TalentManaged", fields: [talentId], references: [id], onDelete: Cascade)

  @@unique([managerId, talentId])
  @@index([managerId])
  @@index([talentId])
}

model SessionType {
  id              String   @id @default(cuid())
  talentId        String
  title           String
  description     String?
  durationMinutes Int
  priceMinor      Int
  currency        String   @default("TRY")
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  talent          TalentProfile @relation(fields: [talentId], references: [id], onDelete: Cascade)
  bookings        Booking[]

  @@index([talentId, isActive])
  @@index([durationMinutes])
}

model AvailabilityRule {
  id              String   @id @default(cuid())
  talentId        String
  weekday         Int      // 1 Monday, 7 Sunday
  startTime       String   // HH:mm
  endTime         String   // HH:mm
  timezone        String   @default("Europe/Istanbul")
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  talent          TalentProfile @relation(fields: [talentId], references: [id], onDelete: Cascade)

  @@index([talentId, weekday, isActive])
}

model AvailabilityBlock {
  id          String   @id @default(cuid())
  talentId    String
  startsAt    DateTime
  endsAt      DateTime
  reason      String?
  createdAt   DateTime @default(now())

  talent      TalentProfile @relation(fields: [talentId], references: [id], onDelete: Cascade)

  @@index([talentId, startsAt, endsAt])
}

model Booking {
  id                    String        @id @default(cuid())
  customerId            String
  talentId              String
  sessionTypeId          String
  status                BookingStatus @default(PAYMENT_PENDING)
  startsAt              DateTime
  endsAt                DateTime
  timezone              String        @default("Europe/Istanbul")
  customerNote          String?
  internalNote          String?
  priceMinor            Int
  currency              String        @default("TRY")
  platformFeeMinor      Int
  talentPayoutMinor     Int
  paymentId             String?
  videoRoomId           String?
  cancelledAt           DateTime?
  cancellationReason    String?
  completedAt           DateTime?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  customer              User          @relation("CustomerBookings", fields: [customerId], references: [id], onDelete: Restrict)
  talent                TalentProfile @relation(fields: [talentId], references: [id], onDelete: Restrict)
  sessionType           SessionType   @relation(fields: [sessionTypeId], references: [id], onDelete: Restrict)
  payment               PaymentIntent?
  videoRoom             VideoRoom?

  @@index([customerId, startsAt])
  @@index([talentId, startsAt])
  @@index([status])
  @@unique([talentId, startsAt, endsAt])
}

model PaymentIntent {
  id                  String          @id @default(cuid())
  bookingId            String          @unique
  provider             PaymentProvider @default(MOCK)
  providerReference    String?
  status               PaymentStatus   @default(INITIATED)
  amountMinor          Int
  currency             String          @default("TRY")
  platformFeeMinor     Int
  talentPayoutMinor    Int
  rawProviderResponse  Json?
  authorizedAt         DateTime?
  capturedAt           DateTime?
  refundedAt           DateTime?
  failedReason         String?
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt

  booking              Booking         @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([provider, providerReference])
}

model VideoRoom {
  id                  String        @id @default(cuid())
  bookingId            String        @unique
  provider             VideoProvider @default(MOCK)
  channelName          String        @unique
  providerRoomId       String?
  startsAt             DateTime
  endsAt               DateTime
  recordingEnabled     Boolean       @default(false)
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  booking              Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([startsAt, endsAt])
}

model ConsentLog {
  id          String      @id @default(cuid())
  userId      String
  type        ConsentType
  version     String
  accepted    Boolean
  ipAddress   String?
  userAgent   String?
  metadata    Json?
  createdAt   DateTime    @default(now())

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, type])
  @@index([createdAt])
}

model AuditLog {
  id          String   @id @default(cuid())
  actorUserId String?
  action      String
  entityType  String
  entityId    String?
  metadata    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  actor       User?    @relation(fields: [actorUserId], references: [id], onDelete: SetNull)

  @@index([actorUserId])
  @@index([entityType, entityId])
  @@index([createdAt])
}
```

---

## 7. Para Birimi ve Tutar Kuralları

Bütün parasal değerler minor unit olarak saklanacak.

Örnek:

```txt
1000 TL = 100000 kuruş
```

Alanlar:

- `priceMinor`
- `platformFeeMinor`
- `talentPayoutMinor`
- `amountMinor`

Kural:

```ts
platformFeeMinor = Math.round(priceMinor * platformCommissionBps / 10000)
talentPayoutMinor = priceMinor - platformFeeMinor
```

Varsayılan komisyon:

```txt
platformCommissionBps = 1500 // %15
```

---

## 8. Slot Üretme Kuralları

### 8.1 Input

Slot endpoint’i şu parametreleri alacak:

```txt
talentId
sessionTypeId
from
until
timezone
```

Örnek:

```http
GET /api/talents/:talentId/slots?sessionTypeId=abc&from=2026-06-05T00:00:00.000Z&until=2026-06-19T00:00:00.000Z&timezone=Europe/Istanbul
```

---

### 8.2 Slot Üretme Algoritması

1. Uzmanı bul.
2. Uzman `APPROVED` değilse hata döndür.
3. Session type aktif değilse hata döndür.
4. Tarih aralığındaki weekday’lere göre `AvailabilityRule` kayıtlarını getir.
5. Her availability rule’u gerçek datetime aralıklarına çevir.
6. Session duration’a göre slotlara böl.
7. Talent minimum notice süresinden önceki slotları çıkar.
8. Mevcut booking’lerle çakışan slotları çıkar.
9. AvailabilityBlock ile çakışan slotları çıkar.
10. Geçmiş slotları çıkar.
11. Sonuçları start time’a göre sırala.

---

### 8.3 Slot Response

```json
{
  "talentId": "talent_123",
  "sessionTypeId": "session_123",
  "timezone": "Europe/Istanbul",
  "slots": [
    {
      "startsAt": "2026-06-08T11:00:00.000Z",
      "endsAt": "2026-06-08T11:15:00.000Z",
      "durationMinutes": 15,
      "priceMinor": 250000,
      "currency": "TRY"
    }
  ]
}
```

---

### 8.4 Çakışma Kontrolü

İki zaman aralığı çakışır:

```ts
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
```

Booking oluştururken veritabanı seviyesinde de çakışmayı engelle:

```prisma
@@unique([talentId, startsAt, endsAt])
```

Not: Bu tam overlap’leri engeller; kısmi overlap için transaction içinde aktif booking sorgusu yapılmalıdır.

Aktif booking durumları:

```ts
const BLOCKING_BOOKING_STATUSES = [
  'PAYMENT_PENDING',
  'CONFIRMED',
  'READY',
  'IN_PROGRESS',
  'COMPLETED',
  'SETTLEMENT_PENDING',
  'SETTLED',
];
```

---

## 9. Booking Oluşturma Akışı

### 9.1 Özet

Kullanıcı uzman detayına girer, session type seçer, uygun slot seçer, not yazar, KVKK kamera/ses işleme onayını verir, ödeme başlatılır ve booking `CONFIRMED` olur.

Faz 1’de ödeme mock olduğu için `MockPaymentProvider.authorize()` her başarılı request için mock reference döndürür.

---

### 9.2 Booking Create Request

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "talentId": "talent_123",
  "sessionTypeId": "session_123",
  "startsAt": "2026-06-08T11:00:00.000Z",
  "timezone": "Europe/Istanbul",
  "customerNote": "Kariyer geçişim hakkında konuşmak istiyorum.",
  "consents": [
    {
      "type": "CAMERA_AUDIO_PROCESSING",
      "version": "2026-06-05",
      "accepted": true
    }
  ]
}
```

---

### 9.3 Booking Create Rules

1. Kullanıcı authenticated olmalı.
2. Kullanıcı aktif olmalı.
3. Talent var olmalı.
4. Talent `APPROVED` olmalı.
5. Session type talent’a ait olmalı ve aktif olmalı.
6. Başlangıç tarihi geçmiş olamaz.
7. Başlangıç tarihi minimum notice saatinden önce olamaz.
8. İstenen slot gerçekten müsait olmalı.
9. `CAMERA_AUDIO_PROCESSING` onayı accepted olmalı.
10. Kullanıcı kendi talent profiline booking açamamalı.
11. Tutar hesaplaması sunucu tarafında yapılmalı; client’tan gelen tutara güvenilmemeli.
12. Transaction içinde:
    - Booking `PAYMENT_PENDING` oluştur.
    - Consent log yaz.
    - Payment intent oluştur.
    - Mock authorize çağır.
    - Payment intent `AUTHORIZED` yap.
    - Video room oluştur.
    - Booking `CONFIRMED` yap.

---

### 9.4 Booking Create Response

```json
{
  "id": "booking_123",
  "status": "CONFIRMED",
  "startsAt": "2026-06-08T11:00:00.000Z",
  "endsAt": "2026-06-08T11:15:00.000Z",
  "priceMinor": 250000,
  "currency": "TRY",
  "platformFeeMinor": 37500,
  "talentPayoutMinor": 212500,
  "payment": {
    "status": "AUTHORIZED",
    "provider": "MOCK"
  },
  "videoRoom": {
    "provider": "MOCK",
    "channelName": "booking_booking_123"
  }
}
```

---

## 10. Booking State Machine

`docs/booking-state-machine.md` dosyasında şu state machine’i belgeleyin.

```txt
PAYMENT_PENDING
  -> CONFIRMED
  -> CANCELLED_BY_CUSTOMER
  -> CANCELLED_BY_TALENT
  -> READY

CONFIRMED
  -> CANCELLED_BY_CUSTOMER
  -> CANCELLED_BY_TALENT
  -> READY
  -> COMPLETED

READY
  -> IN_PROGRESS
  -> NO_SHOW_CUSTOMER
  -> NO_SHOW_TALENT

IN_PROGRESS
  -> COMPLETED
  -> DISPUTED

COMPLETED
  -> SETTLEMENT_PENDING

SETTLEMENT_PENDING
  -> SETTLED

CANCELLED_BY_CUSTOMER
  -> REFUND_PENDING
  -> REFUNDED

CANCELLED_BY_TALENT
  -> REFUND_PENDING
  -> REFUNDED
```

Faz 1’de otomatik cron şart değil. Sadece manuel/admin endpoint veya servis metodu yeterli.

---

## 11. API Modülleri

Backend `apps/api/src/modules` altında aşağıdaki modülleri oluştur.

```txt
modules/
  auth/
  users/
  talents/
  categories/
  availability/
  bookings/
  payments/
  video/
  consents/
  admin/
  audit/
  health/
```

---

## 12. API Sözleşmesi

### 12.1 Health

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-06-05T12:00:00.000Z"
}
```

---

### 12.2 Auth Register

```http
POST /api/auth/register
```

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "firstName": "Ayşe",
  "lastName": "Yılmaz",
  "phone": "+905551112233",
  "consents": [
    {
      "type": "TERMS_OF_SERVICE",
      "version": "2026-06-05",
      "accepted": true
    },
    {
      "type": "PRIVACY_POLICY",
      "version": "2026-06-05",
      "accepted": true
    }
  ]
}
```

Rules:

- Email unique.
- Password min 10 char, uppercase, lowercase, number, symbol.
- Terms ve Privacy accepted değilse 400.
- Password argon2 ile hashlenmeli.

Response:

```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "Ayşe",
    "lastName": "Yılmaz",
    "roles": ["CUSTOMER"]
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### 12.3 Auth Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

Response aynı register gibi.

---

### 12.4 Refresh Token

```http
POST /api/auth/refresh
```

Request:

```json
{
  "refreshToken": "..."
}
```

Rule:

- Refresh token hash DB’de tutulmalı.
- Eski refresh token rotate edilmeli.

---

### 12.5 Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

Request:

```json
{
  "refreshToken": "..."
}
```

Rule:

- Refresh token revoke edilir.

---

### 12.6 Current User

```http
GET /api/me
Authorization: Bearer <token>
```

Response:

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "Ayşe",
  "lastName": "Yılmaz",
  "roles": ["CUSTOMER"],
  "talentProfile": null
}
```

---

### 12.7 Category List

```http
GET /api/categories
```

Response:

```json
{
  "items": [
    {
      "id": "cat_1",
      "name": "Girişimcilik",
      "slug": "girisimcilik"
    }
  ]
}
```

---

### 12.8 Talent Application

```http
POST /api/talents/apply
Authorization: Bearer <token>
```

Request:

```json
{
  "publicName": "Mehmet Demir",
  "headline": "Girişimci ve melek yatırımcı",
  "bio": "20 yıldır teknoloji girişimleriyle çalışıyorum.",
  "segment": "EXPERTISE",
  "categoryIds": ["cat_1", "cat_2"],
  "sessionTypes": [
    {
      "title": "15 Dakikalık Fikir Doğrulama",
      "description": "Girişim fikriniz için hızlı geri bildirim.",
      "durationMinutes": 15,
      "priceMinor": 250000,
      "currency": "TRY"
    },
    {
      "title": "30 Dakikalık Strateji Görüşmesi",
      "description": "Daha detaylı ürün ve pazara giriş değerlendirmesi.",
      "durationMinutes": 30,
      "priceMinor": 450000,
      "currency": "TRY"
    }
  ]
}
```

Rules:

- Kullanıcının zaten talent profile’ı varsa ikinci başvuru engellenir.
- Slug publicName’den otomatik üretilir, çakışırsa suffix eklenir.
- Status `PENDING_REVIEW` olur.
- Kullanıcıya henüz `TALENT` rolü verilmez.

Response:

```json
{
  "id": "talent_123",
  "status": "PENDING_REVIEW",
  "slug": "mehmet-demir"
}
```

---

### 12.9 Public Talent List

```http
GET /api/talents?segment=EXPERTISE&category=girisimcilik&page=1&pageSize=20
```

Rules:

- Sadece `APPROVED` talent’lar döner.
- `SUSPENDED`, `PENDING_REVIEW`, `REJECTED` görünmez.

Response:

```json
{
  "items": [
    {
      "id": "talent_123",
      "slug": "mehmet-demir",
      "publicName": "Mehmet Demir",
      "headline": "Girişimci ve melek yatırımcı",
      "segment": "EXPERTISE",
      "profileImageUrl": null,
      "startingPriceMinor": 250000,
      "currency": "TRY",
      "categories": [
        {
          "name": "Girişimcilik",
          "slug": "girisimcilik"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

---

### 12.10 Public Talent Detail

```http
GET /api/talents/:slug
```

Response:

```json
{
  "id": "talent_123",
  "slug": "mehmet-demir",
  "publicName": "Mehmet Demir",
  "headline": "Girişimci ve melek yatırımcı",
  "bio": "...",
  "segment": "EXPERTISE",
  "profileImageUrl": null,
  "coverImageUrl": null,
  "categories": [],
  "sessionTypes": [
    {
      "id": "session_1",
      "title": "15 Dakikalık Fikir Doğrulama",
      "durationMinutes": 15,
      "priceMinor": 250000,
      "currency": "TRY"
    }
  ]
}
```

---

### 12.11 Create Availability Rule

```http
POST /api/talents/me/availability-rules
Authorization: Bearer <token>
```

Request:

```json
{
  "weekday": 1,
  "startTime": "14:00",
  "endTime": "16:00",
  "timezone": "Europe/Istanbul"
}
```

Rules:

- Kullanıcı `TALENT` olmalı.
- Kendi profile’ı için oluşturabilir.
- `weekday` 1-7.
- `startTime < endTime`.
- Faz 1’de overnight window destekleme. Örnek 22:00-02:00 reddedilir.

---

### 12.12 Get Talent Slots

```http
GET /api/talents/:talentId/slots?sessionTypeId=session_1&from=2026-06-05T00:00:00.000Z&until=2026-06-19T00:00:00.000Z&timezone=Europe/Istanbul
```

Response yukarıdaki slot formatında.

---

### 12.13 Create Booking Quote

```http
POST /api/bookings/quote
Authorization: Bearer <token>
```

Request:

```json
{
  "talentId": "talent_123",
  "sessionTypeId": "session_1",
  "startsAt": "2026-06-08T11:00:00.000Z",
  "timezone": "Europe/Istanbul"
}
```

Response:

```json
{
  "talentId": "talent_123",
  "sessionTypeId": "session_1",
  "startsAt": "2026-06-08T11:00:00.000Z",
  "endsAt": "2026-06-08T11:15:00.000Z",
  "priceMinor": 250000,
  "currency": "TRY",
  "platformFeeMinor": 37500,
  "talentPayoutMinor": 212500,
  "commissionBps": 1500
}
```

---

### 12.14 Create Booking

Endpoint ve kurallar Bölüm 9’daki gibi.

---

### 12.15 Get My Bookings

```http
GET /api/bookings/me?status=CONFIRMED
Authorization: Bearer <token>
```

Response:

```json
{
  "items": [
    {
      "id": "booking_123",
      "status": "CONFIRMED",
      "startsAt": "2026-06-08T11:00:00.000Z",
      "endsAt": "2026-06-08T11:15:00.000Z",
      "talent": {
        "publicName": "Mehmet Demir",
        "slug": "mehmet-demir"
      },
      "sessionType": {
        "title": "15 Dakikalık Fikir Doğrulama"
      }
    }
  ]
}
```

---

### 12.16 Get Booking Detail

```http
GET /api/bookings/:id
Authorization: Bearer <token>
```

Rules:

- Customer kendi booking’ini görebilir.
- Talent kendi booking’ini görebilir.
- Manager yönettiği talent booking’ini görebilir.
- Admin hepsini görebilir.

---

### 12.17 Cancel Booking

```http
POST /api/bookings/:id/cancel
Authorization: Bearer <token>
```

Request:

```json
{
  "reason": "Programım değişti."
}
```

Rules:

- Customer kendi booking’ini iptal ederse status `CANCELLED_BY_CUSTOMER`.
- Talent kendi booking’ini iptal ederse status `CANCELLED_BY_TALENT`.
- CONFIRMED dışındaki statusler için Faz 1’de iptal reddedilebilir.
- Mock refund çağrılır.
- Payment status `REFUNDED` yapılır.
- Booking status `REFUNDED` yapılabilir veya cancellation status korunup payment refunded kalabilir. Faz 1’de basitlik için booking status `REFUNDED` kullanılabilir, fakat `cancelledAt` ve `cancellationReason` set edilmeli.

---

### 12.18 Get Video Token

```http
POST /api/video/bookings/:bookingId/token
Authorization: Bearer <token>
```

Rules:

- Sadece booking customer, talent, manager veya admin token alabilir.
- Booking `CONFIRMED`, `READY` veya `IN_PROGRESS` olmalı.
- Faz 1’de görüşmeden 15 dakika önce token verilmeli. Erken isteklerde 403.
- Mock provider response döner.

Response:

```json
{
  "provider": "MOCK",
  "channelName": "booking_booking_123",
  "token": "mock-token-booking_123-user_123",
  "uid": "user_123",
  "expiresAt": "2026-06-08T11:30:00.000Z"
}
```

---

### 12.19 Admin: Review Talent

```http
POST /api/admin/talents/:id/review
Authorization: Bearer <admin_token>
```

Approve request:

```json
{
  "decision": "APPROVE"
}
```

Reject request:

```json
{
  "decision": "REJECT",
  "reason": "Profil bilgileri yetersiz."
}
```

Rules:

- Sadece ADMIN.
- Approve olunca talent status `APPROVED`, `approvedAt` set edilir.
- User roles içine `TALENT` eklenir.
- Reject olunca `REJECTED`, reason yazılır.

---

## 13. Payment Provider Interface

`apps/api/src/modules/payments/payment-provider.interface.ts`

```ts
export interface AuthorizePaymentInput {
  bookingId: string;
  customerId: string;
  amountMinor: number;
  currency: string;
  platformFeeMinor: number;
  talentPayoutMinor: number;
}

export interface AuthorizePaymentResult {
  provider: 'MOCK' | 'IYZICO';
  providerReference: string;
  status: 'AUTHORIZED';
  rawProviderResponse?: unknown;
}

export interface RefundPaymentInput {
  paymentIntentId: string;
  providerReference?: string;
  amountMinor: number;
  reason?: string;
}

export interface RefundPaymentResult {
  status: 'REFUNDED';
  rawProviderResponse?: unknown;
}

export interface CapturePaymentInput {
  paymentIntentId: string;
  providerReference?: string;
  amountMinor: number;
}

export interface CapturePaymentResult {
  status: 'CAPTURED';
  rawProviderResponse?: unknown;
}

export interface PaymentProviderPort {
  authorize(input: AuthorizePaymentInput): Promise<AuthorizePaymentResult>;
  capture(input: CapturePaymentInput): Promise<CapturePaymentResult>;
  refund(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
```

Mock provider:

```ts
@Injectable()
export class MockPaymentProvider implements PaymentProviderPort {
  async authorize(input: AuthorizePaymentInput): Promise<AuthorizePaymentResult> {
    return {
      provider: 'MOCK',
      providerReference: `mock_auth_${input.bookingId}_${Date.now()}`,
      status: 'AUTHORIZED',
      rawProviderResponse: {
        mocked: true,
        input,
      },
    };
  }

  async capture(input: CapturePaymentInput): Promise<CapturePaymentResult> {
    return {
      status: 'CAPTURED',
      rawProviderResponse: {
        mocked: true,
        input,
      },
    };
  }

  async refund(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      status: 'REFUNDED',
      rawProviderResponse: {
        mocked: true,
        input,
      },
    };
  }
}
```

Iyzico provider Faz 1’de skeleton:

```ts
@Injectable()
export class IyzicoPaymentProvider implements PaymentProviderPort {
  async authorize(): Promise<AuthorizePaymentResult> {
    throw new Error('Iyzico provider is not implemented in Phase 1');
  }

  async capture(): Promise<CapturePaymentResult> {
    throw new Error('Iyzico provider is not implemented in Phase 1');
  }

  async refund(): Promise<RefundPaymentResult> {
    throw new Error('Iyzico provider is not implemented in Phase 1');
  }
}
```

---

## 14. Video Provider Interface

`apps/api/src/modules/video/video-provider.interface.ts`

```ts
export interface CreateVideoRoomInput {
  bookingId: string;
  startsAt: Date;
  endsAt: Date;
  recordingEnabled: boolean;
}

export interface CreateVideoRoomResult {
  provider: 'MOCK' | 'AGORA';
  channelName: string;
  providerRoomId?: string;
}

export interface CreateVideoTokenInput {
  bookingId: string;
  channelName: string;
  userId: string;
  role: 'publisher' | 'subscriber';
  expiresAt: Date;
}

export interface CreateVideoTokenResult {
  provider: 'MOCK' | 'AGORA';
  channelName: string;
  token: string;
  uid: string;
  expiresAt: Date;
}

export interface VideoProviderPort {
  createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult>;
  createToken(input: CreateVideoTokenInput): Promise<CreateVideoTokenResult>;
}
```

Mock provider:

```ts
@Injectable()
export class MockVideoProvider implements VideoProviderPort {
  async createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult> {
    return {
      provider: 'MOCK',
      channelName: `booking_${input.bookingId}`,
      providerRoomId: `mock_room_${input.bookingId}`,
    };
  }

  async createToken(input: CreateVideoTokenInput): Promise<CreateVideoTokenResult> {
    return {
      provider: 'MOCK',
      channelName: input.channelName,
      token: `mock-token-${input.bookingId}-${input.userId}`,
      uid: input.userId,
      expiresAt: input.expiresAt,
    };
  }
}
```

Agora provider skeleton:

```ts
@Injectable()
export class AgoraVideoProvider implements VideoProviderPort {
  async createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult> {
    return {
      provider: 'AGORA',
      channelName: `booking_${input.bookingId}`,
    };
  }

  async createToken(): Promise<CreateVideoTokenResult> {
    throw new Error('Agora token generation is not implemented in Phase 1');
  }
}
```

---

## 15. Authorization Kuralları

### 15.1 Guard Yapısı

Backend’de şu guard/decorator’ları oluştur:

```txt
@Public()
@CurrentUser()
@Roles(UserRole.ADMIN)
JwtAuthGuard
RolesGuard
```

---

### 15.2 Resource Permission Helpers

Booking erişiminde helper yaz:

```ts
canAccessBooking(user, booking): boolean
```

Kurallar:

- Admin erişebilir.
- Booking customerId user.id ise erişebilir.
- Booking talent.userId user.id ise erişebilir.
- User manager ise ve talent’ı yönetiyorsa erişebilir.

Talent yönetiminde helper yaz:

```ts
canManageTalent(user, talent): boolean
```

Kurallar:

- Admin yönetebilir.
- Talent owner yönetebilir.
- ManagerTalent kaydı olan manager yönetebilir.

---

## 16. Validasyon Kuralları

### 16.1 Email

- Lowercase normalize et.
- Trim et.
- Geçerli format değilse reddet.

### 16.2 Telefon

- Faz 1’de opsiyonel.
- Girilirse E.164 formatı bekle.

### 16.3 Şifre

Min rules:

```txt
min 10 char
1 uppercase
1 lowercase
1 number
1 symbol
```

### 16.4 Session Type

- durationMinutes sadece `[15, 30, 45, 60]` olabilir.
- priceMinor min 1000.
- currency Faz 1’de `TRY` veya `USD` olabilir.

### 16.5 Availability

- weekday 1-7.
- startTime/endTime `HH:mm`.
- startTime < endTime.
- En küçük pencere en az 15 dakika.

### 16.6 Booking

- startsAt ISO datetime.
- Geçmiş tarih reddedilir.
- EndsAt sunucuda hesaplanır.
- customerNote max 1000 char.

---

## 17. Güvenlik ve KVKK İlkeleri

### 17.1 Genel Güvenlik

- Password loglama yasak.
- JWT secret env’den alınmalı.
- Production’da Swagger kapatılabilir olmalı.
- CORS allowlist env’den gelmeli.
- Request body limit koy.
- Rate limit auth endpointlerinde daha sıkı olmalı.
- Global exception filter internal error detayını client’a sızdırmamalı.

### 17.2 KVKK / Consent

- Onaylar mutable olmamalı.
- Her consent log’da:
  - userId
  - type
  - version
  - accepted
  - ipAddress
  - userAgent
  - metadata
  - createdAt
- Kullanıcı randevu oluşturmadan önce kamera/ses verilerinin işleneceğini onaylamalı.
- Video kaydı Faz 1’de kapalı default olmalı.
- Recording consent ayrı tutulmalı.

### 17.3 Audit Log

Aşağıdaki aksiyonlar audit log’a yazılmalı:

- REGISTER
- LOGIN_SUCCESS
- LOGIN_FAILED
- TALENT_APPLIED
- TALENT_APPROVED
- TALENT_REJECTED
- AVAILABILITY_RULE_CREATED
- BOOKING_CREATED
- BOOKING_CANCELLED
- PAYMENT_AUTHORIZED
- PAYMENT_REFUNDED
- VIDEO_TOKEN_CREATED

Audit log metadata hassas veri içermemeli.

---

## 18. Seed Data

`pnpm --filter api seed` komutu şu dataları oluşturmalı:

### 18.1 Admin

```txt
email: admin@example.com
password: Admin123!ChangeMe
role: ADMIN
```

### 18.2 Customer

```txt
email: customer@example.com
password: Customer123!ChangeMe
role: CUSTOMER
```

### 18.3 Talent User

```txt
email: talent@example.com
password: Talent123!ChangeMe
role: CUSTOMER + TALENT
```

### 18.4 Categories

- Girişimcilik
- Oyunculuk
- Müzik
- Spor
- Fitness
- Beslenme
- Kariyer
- Marka Danışmanlığı
- E-spor

### 18.5 Approved Talent

```txt
publicName: Mehmet Demir
segment: EXPERTISE
headline: Girişimci ve melek yatırımcı
slug: mehmet-demir
status: APPROVED
session types:
  15 dk - 2500 TL
  30 dk - 4500 TL
availability:
  Monday 14:00-17:00 Europe/Istanbul
  Wednesday 10:00-12:00 Europe/Istanbul
```

### 18.6 Entertainment Talent

```txt
publicName: Elif Kaya
segment: ENTERTAINMENT
headline: Oyuncu ve içerik üreticisi
slug: elif-kaya
status: APPROVED
session types:
  15 dk - 3000 TL
  30 dk - 5500 TL
availability:
  Tuesday 18:00-20:00 Europe/Istanbul
```

---

## 19. Mobile Uygulama Detayı

### 19.1 Tema

Basit mobile-first tema:

```txt
primary: black veya koyu mor
background: #FFFFFF
text: #111111
muted: #666666
success: yeşil
warning: amber
error: kırmızı
```

Not: Renkleri merkezi theme dosyasına koy.

---

### 19.2 Auth Store

Token storage:

```ts
interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login(email: string, password: string): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): Promise<void>;
  hydrate(): Promise<void>;
}
```

---

### 19.3 API Client

`apps/mobile/src/lib/api.ts`

- Base URL env’den gelsin.
- Authorization header otomatik eklensin.
- 401 gelirse refresh denenebilir.
- Refresh başarısızsa logout.

---

### 19.4 Ekranlar

#### Login Screen

Alanlar:

- Email
- Password
- Giriş yap butonu
- Kayıt ol linki

Validation:

- Email required
- Password required

#### Register Screen

Alanlar:

- Ad
- Soyad
- Email
- Telefon opsiyonel
- Password
- Terms checkbox
- Privacy checkbox
- Kayıt ol butonu

#### Home Screen

Göster:

- Başlık: “Kiminle görüşmek istersin?”
- Arama inputu, Faz 1’de frontend filter olabilir
- Featured talents horizontal list
- Categories grid
- Expertise ve Entertainment bölümleri

#### Talent Detail Screen

Göster:

- Kapak alanı
- Profil fotoğrafı
- Public name
- Headline
- Bio
- Categories
- Session type cards
- “Müsait saatleri gör” butonu

#### Booking Create Screen

Adımlar:

1. Session type seç
2. Slot seç
3. Not yaz
4. Kamera/ses KVKK onayını ver
5. Özet gör
6. Mock ödeme ile rezervasyonu tamamla

Gösterilecek özet:

- Uzman adı
- Görüşme tipi
- Tarih/saat
- Süre
- Tutar
- Para birimi

#### Bookings Screen

Tabs:

- Yaklaşan
- Geçmiş
- İptal edilen

#### Booking Detail Screen

Göster:

- Status badge
- Uzman bilgisi
- Tarih/saat
- Session type
- Tutar
- Video odası bilgisi
- Görüşmeye katıl butonu, Faz 1’de token endpoint çağırıp mock token gösterir
- İptal butonu

---

## 20. Web Admin Detayı

### 20.1 Landing Page

Basit landing:

- Hero: “Uzmanlar ve tanınmış isimlerle canlı 1:1 görüşme”
- Nasıl çalışır:
  1. Uzmanı seç
  2. Saatini ayırt
  3. Canlı görüşmeye katıl
- Uzmanlar için CTA: “Uzman olarak başvur”
- Admin login linki development ortamında görünür olabilir.

---

### 20.2 Admin Login

API auth login’i kullan.

Admin olmayan kullanıcı login olursa admin dashboard erişimi engellenir.

---

### 20.3 Admin Dashboard

Kartlar:

- Toplam kullanıcı
- Onay bekleyen uzman
- Onaylı uzman
- Yaklaşan booking
- Mock ödeme toplamı

---

### 20.4 Talent Review List

Table columns:

- Public name
- Segment
- Headline
- Status
- Created at
- Actions

Actions:

- Detay
- Approve
- Reject

---

### 20.5 Booking List

Table columns:

- Booking ID kısa
- Customer
- Talent
- Starts at
- Status
- Price
- Actions

---

## 21. Environment Variables

`.env.example` oluştur:

```env
# General
NODE_ENV=development
APP_NAME="Celebrity Call Platform"
API_PORT=4000
WEB_PORT=3000
MOBILE_API_URL=http://localhost:4000/api
WEB_API_URL=http://localhost:4000/api

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/celebrity_call?schema=public

# Auth
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
PASSWORD_PEPPER=change-me-password-pepper

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8081

# Providers
PAYMENT_PROVIDER=MOCK
VIDEO_PROVIDER=MOCK

# Iyzico - Phase 2
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Agora - Phase 2
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=

# Redis - Future use
REDIS_URL=redis://localhost:6379
```

---

## 22. Docker Compose

`docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: celebrity_call_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: celebrity_call
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: celebrity_call_redis
    ports:
      - "6379:6379"

  mailpit:
    image: axllent/mailpit:latest
    container_name: celebrity_call_mailpit
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  postgres_data:
```

---

## 23. Package Scripts

Root `package.json` scripts:

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "format": "prettier --write .",
    "db:up": "docker compose up -d postgres redis mailpit",
    "db:down": "docker compose down",
    "db:migrate": "pnpm --filter api prisma:migrate",
    "db:seed": "pnpm --filter api seed",
    "api:dev": "pnpm --filter api dev",
    "web:dev": "pnpm --filter web dev",
    "mobile:dev": "pnpm --filter mobile start"
  }
}
```

API package scripts:

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "lint": "eslint .",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 24. Error Response Format

Tüm API hataları aynı formatta dönecek.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Girilen bilgiler geçersiz.",
    "details": [
      {
        "field": "email",
        "message": "Geçerli bir email girin."
      }
    ],
    "requestId": "req_123"
  }
}
```

Error code örnekleri:

```txt
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
BOOKING_SLOT_UNAVAILABLE
TALENT_NOT_APPROVED
PAYMENT_FAILED
VIDEO_TOKEN_NOT_ALLOWED_YET
INTERNAL_ERROR
```

---

## 25. Logging

Her request için:

- requestId
- method
- path
- statusCode
- durationMs
- userId varsa

Loglanmayacak:

- password
- token
- refresh token
- payment card data
- raw provider secret

---

## 26. Test Planı

### 26.1 Auth Tests

- Register success
- Register duplicate email fails
- Register without terms fails
- Login success
- Login wrong password fails
- Refresh token success
- Logout revokes refresh token

### 26.2 Talent Tests

- Customer can apply as talent
- Duplicate application fails
- Pending talent not visible publicly
- Admin can approve talent
- Approved talent visible publicly
- Admin can reject talent

### 26.3 Availability Tests

- Talent can create availability rule
- Non-talent cannot create availability rule
- Invalid weekday fails
- startTime >= endTime fails
- Slots generated correctly
- Minimum notice filters out early slots
- Existing booking blocks slot
- Availability block removes slot

### 26.4 Booking Tests

- Customer can quote booking
- Quote calculates platform fee correctly
- Customer can create booking with consent
- Booking without camera/audio consent fails
- Booking unavailable slot fails
- Customer cannot book own talent profile
- Booking creates payment intent
- Booking creates video room
- Cancel booking refunds payment

### 26.5 Video Tests

- Booking participant can get token near start time
- Non-participant cannot get token
- Token too early fails

### 26.6 Admin Tests

- Non-admin cannot access admin endpoints
- Admin can list pending talents
- Admin can approve talent
- Admin can list bookings

---

## 27. Acceptance Criteria

Faz 1 tamamlandı sayılması için:

1. `pnpm install` çalışmalı.
2. `pnpm db:up` lokal servisleri başlatmalı.
3. `pnpm db:migrate` migration oluşturmalı/uygulamalı.
4. `pnpm db:seed` demo dataları basmalı.
5. `pnpm api:dev` API’yi `localhost:4000` üzerinde çalıştırmalı.
6. `GET /api/health` ok dönmeli.
7. Swagger `/docs` üzerinden endpoint’ler görülebilmeli.
8. Kullanıcı register/login olabilmeli.
9. Seed edilen approved talent public listede görünmeli.
10. Talent detayında session type’lar görünmeli.
11. Slot endpoint’i uygun slotları döndürmeli.
12. Booking quote tutarı doğru hesaplamalı.
13. Booking create mock payment + mock video room ile confirmed booking oluşturmalı.
14. Mobile app login/register/list/detail/booking create ekranlarında API ile konuşmalı.
15. Admin web pending talent approve/reject yapabilmeli.
16. Test suite başarılı çalışmalı.
17. README lokal kurulum adımlarını açıkça anlatmalı.
18. `docs/deferred.md` Faz 2’ye bırakılan işleri listelemeli.

---

## 28. README İçeriği

Root README şunları içermeli:

```md
# Celebrity Call Platform

## Requirements
- Node.js LTS
- pnpm
- Docker

## Setup
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm api:dev
pnpm web:dev
pnpm mobile:dev

## URLs
API: http://localhost:4000/api
Swagger: http://localhost:4000/docs
Web: http://localhost:3000
Mailpit: http://localhost:8025

## Seed Accounts
admin@example.com / Admin123!ChangeMe
customer@example.com / Customer123!ChangeMe
talent@example.com / Talent123!ChangeMe

## Project Structure
...

## Phase 1 Scope
...

## Deferred to Phase 2
...
```

---

## 29. `docs/deferred.md` İçeriği

Bu dosyada Faz 2+ işleri yaz:

```md
# Deferred Features

## Phase 2
- Real iyzico marketplace integration
- Real Agora RTC token generation
- Payment pre-authorization/capture/refund production flow
- Push notifications
- Email notifications
- Calendar integration
- Talent payout reporting
- Legal document versioning admin UI

## Phase 3
- Recording consent flow
- Cloud recording
- AI live moderation
- Group workshops
- B2B enterprise accounts
- Digital products
- Referral system
- Ratings and reviews
```

---

## 30. Uygulama Sırası

Windsurf aşağıdaki sırayla ilerlesin.

### Step 1 — Monorepo Kurulumu

- Root package oluştur.
- pnpm workspace ayarla.
- Turborepo ayarla.
- shared/config paketlerini oluştur.
- ESLint/Prettier/TSConfig ayarla.

### Step 2 — Docker ve Env

- docker-compose.yml ekle.
- .env.example ekle.
- README setup kısmını yaz.

### Step 3 — API Başlat

- NestJS app oluştur.
- `/api` global prefix.
- health endpoint.
- Swagger.
- Config.
- Logger.
- Global validation pipe.
- Exception filter.

### Step 4 — Prisma

- Prisma kur.
- Schema ekle.
- Migration çalışacak hale getir.
- PrismaService oluştur.

### Step 5 — Auth

- User model servisleri.
- Register/login/refresh/logout.
- Password hash.
- JWT guard.
- CurrentUser decorator.
- Roles guard.

### Step 6 — Categories + Seed

- Category CRUD minimum public list.
- Seed data.

### Step 7 — Talents

- Talent application.
- Public list.
- Public detail.
- Admin review.

### Step 8 — Availability

- Availability rule create/list.
- Slot generation service.
- Conflict detection.

### Step 9 — Booking

- Quote endpoint.
- Create booking endpoint.
- Transaction.
- Consent log.
- Mock payment.
- Mock video room.

### Step 10 — Cancel + Video Token

- Cancel booking.
- Mock refund.
- Video token endpoint.

### Step 11 — Mobile App

- Expo app.
- Auth screens.
- Talent list/detail.
- Booking create flow.
- Booking detail.

### Step 12 — Web App

- Landing.
- Admin login.
- Admin dashboard.
- Talent review.
- Booking list.

### Step 13 — Tests + CI

- Unit/integration tests.
- GitHub Actions.
- Final README.

---

## 31. Kod Kalitesi Kuralları

- Servisler single responsibility olmalı.
- Controller içinde business logic yazma.
- Prisma query’lerini servis/repository katmanında tut.
- Domain hesaplamalarını pure function olarak yaz ve test et.
- Tutar hesaplama client’a bırakılmamalı.
- Date/time işlemlerinde timezone açık olmalı.
- API response’larında passwordHash/tokenHash asla dönmemeli.
- Enum stringleri frontend/shared paketinden kullanılmalı.
- Magic number kullanma; constants dosyasına koy.

---

## 32. Kritik Pure Functions

`packages/shared/src/domain/money.ts`

```ts
export function calculatePlatformFee(priceMinor: number, commissionBps: number): number {
  return Math.round((priceMinor * commissionBps) / 10000);
}

export function calculateTalentPayout(priceMinor: number, commissionBps: number): number {
  return priceMinor - calculatePlatformFee(priceMinor, commissionBps);
}
```

`packages/shared/src/domain/time.ts`

```ts
export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
```

`packages/shared/src/domain/booking.ts`

```ts
export function canTransitionBookingStatus(from: BookingStatus, to: BookingStatus): boolean {
  const transitions: Record<BookingStatus, BookingStatus[]> = {
    PAYMENT_PENDING: ['CONFIRMED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_TALENT'],
    CONFIRMED: ['READY', 'COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_TALENT'],
    READY: ['IN_PROGRESS', 'NO_SHOW_CUSTOMER', 'NO_SHOW_TALENT'],
    IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
    COMPLETED: ['SETTLEMENT_PENDING'],
    SETTLEMENT_PENDING: ['SETTLED'],
    CANCELLED_BY_CUSTOMER: ['REFUND_PENDING'],
    CANCELLED_BY_TALENT: ['REFUND_PENDING'],
    REFUND_PENDING: ['REFUNDED'],
    DRAFT: ['PAYMENT_PENDING'],
    NO_SHOW_CUSTOMER: ['DISPUTED'],
    NO_SHOW_TALENT: ['REFUND_PENDING'],
    REFUNDED: [],
    SETTLED: [],
    DISPUTED: [],
  };

  return transitions[from]?.includes(to) ?? false;
}
```

---

## 33. UI Metinleri

Mobilde kullanılacak Türkçe metinler:

```txt
Kiminle görüşmek istersin?
Uzmanları keşfet
Müsait saatleri gör
Görüşme süresi
Randevu özeti
Rezervasyonu tamamla
Kamera ve ses verilerimin görüşme hizmeti için işlenmesini kabul ediyorum.
Rezervasyonunuz oluşturuldu.
Yaklaşan görüşmeler
Görüşmeye katıl
Randevuyu iptal et
```

Hata metinleri:

```txt
Bu saat artık müsait değil.
Bu uzman şu anda randevu kabul etmiyor.
Görüşme oluşturmak için kamera ve ses işleme onayını vermelisiniz.
Oturumunuz sona erdi. Lütfen tekrar giriş yapın.
Bu işlem için yetkiniz yok.
```

---

## 34. Faz 1 Sonunda Demo Senaryosu

Aşağıdaki demo akışı canlı çalışmalı:

1. Developer `pnpm db:seed` çalıştırır.
2. Mobile app açılır.
3. `customer@example.com` ile giriş yapılır.
4. Ana sayfada Mehmet Demir görünür.
5. Mehmet Demir detayına girilir.
6. 15 dakikalık görüşme seçilir.
7. Uygun slotlar listelenir.
8. Bir slot seçilir.
9. Kullanıcı not yazar.
10. Kamera/ses KVKK onayı verilir.
11. Rezervasyon tamamlanır.
12. Booking status `CONFIRMED` görünür.
13. Booking detail’de mock video room görünür.
14. Admin web’e `admin@example.com` ile girilir.
15. Booking listesinde yeni rezervasyon görünür.
16. API testleri başarılıdır.

---

## 35. Son Uyarılar

- Faz 1’de “çalışır ve genişleyebilir çekirdek” hedeflenir.
- Görsel tasarım mükemmel olmak zorunda değil; ancak akışlar temiz ve anlaşılır olmalı.
- Ödeme ve video gerçek entegrasyonları mock olmalı fakat interface tasarımı production’a uygun olmalı.
- Veri modeli ileriki fazları taşıyacak kadar sağlam olmalı.
- Güvenlik ve consent kayıtları ilk günden doğru kurulmalı.
- Randevu çakışması ve para hesaplama hatasız olmalı.

