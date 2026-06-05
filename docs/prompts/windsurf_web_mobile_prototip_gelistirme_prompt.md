# Windsurf Görevi — İlk Prototipi Web + Mobile Görüşme Deneyimiyle Tamamla

Bu görev mevcut `/Users/investintech/Developer/unluapp` reposunda devam eder. Yeni proje oluşturma. Mevcut monorepo, NestJS API, Prisma, Next.js web ve Expo mobile yapısını koru.

Amaç: İlk prototipi sadece “mobil rezervasyon yapan demo” olmaktan çıkarıp, **web ve mobilde uçtan uca demo edilebilir canlı görüşme platformu prototipi** haline getirmek.

Bu fazda gerçek Agora/iyzico entegrasyonu zorunlu değil. Ancak mimari, ileride gerçek sağlayıcıya geçilecek şekilde provider abstraction ile hazırlanmalı. Web tarafında en azından çalışan bir **mock video room UI** olmalı: kamera/mikrofon izin ekranı, görüşmeye katılma, görüşme süresi/timer, karşı taraf kartı, mikrofon/kamera kapatma butonları, görüşmeyi bitirme, görüşme sonrası durum ekranı.

---

## 0. Kritik Kural

Bu görev “kod yazıldı” diye bitmez. Aşağıdaki zincir lokalde çalışıp doğrulanmadan görevi tamamlanmış sayma:

```bash
pnpm install
pnpm db:generate
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm --filter api build
pnpm --filter web build
pnpm --filter api test
pnpm test
pnpm lint
pnpm dev:api
pnpm smoke:api
pnpm dev:web
```

Docker yoksa veya DB ayağa kalkmıyorsa:
1. Hatanın tam sebebini raporla.
2. Kod tarafında yapılabilecek tüm işleri tamamla.
3. PostgreSQL bağlantısı çalışınca tek komutla doğrulanacak hale getir.
4. Alternatif olarak local PostgreSQL veya hosted PostgreSQL bağlantısı için README’ye net komutları ekle.

---

## 1. Ürün Hedefi

İlk prototipte şu demo akışı çalışmalı:

### Kullanıcı Web Akışı

1. Kullanıcı web landing sayfasına gelir.
2. Uzman/ünlü listesini görür.
3. Bir uzman detay sayfasına girer.
4. Uygun slotları görür.
5. Login olur veya demo kullanıcıyla giriş yapar.
6. Bir slot seçip rezervasyon oluşturur.
7. Rezervasyon detay sayfasında görüşme zamanı, fiyat, durum ve “Görüşme Odasına Git” butonunu görür.
8. Görüşme zamanı gelmişse veya demo mod aktifse web video room’a girer.
9. Pre-call lobby ekranında kamera/mikrofon izinlerini kontrol eder.
10. “Görüşmeye Katıl” butonuna basar.
11. Mock video room açılır:
    - Local video preview
    - Remote participant placeholder
    - Timer
    - Booking bilgisi
    - Kamera aç/kapat
    - Mikrofon aç/kapat
    - Görüşmeyi bitir
12. Görüşme bitince booking `COMPLETED` veya demo durumuna çekilir.
13. Kullanıcı “Görüşme tamamlandı” ekranı görür.

### Uzman/Talent Web Akışı

Bu fazda ayrı tam uzman paneli şart değil, ama en azından demo için şu olmalı:

1. Talent rolündeki kullanıcı login olabilir.
2. `/talent/dashboard` sayfasında kendi yaklaşan görüşmelerini görür.
3. Her booking için “Görüşme Odasına Katıl” butonu görür.
4. Aynı web video room UI’a expert tarafı olarak katılabilir.
5. Ekranda rol bilgisi `TALENT` olarak görünür.

### Admin Web Akışı

1. Admin login olur.
2. Dashboard’da:
   - toplam kullanıcı
   - toplam uzman
   - bekleyen uzman başvurusu
   - toplam booking
   - yaklaşan görüşmeler
   - tamamlanan görüşmeler
   - iptal edilen görüşmeler
   görür.
3. Admin booking listesini görebilir.
4. Admin bir booking’i manuel `COMPLETED`, `CANCELLED` veya `REFUNDED` yapabilir.
5. Admin talent approve/reject akışını görsel olarak kullanabilir.

### Mobile Akışı

Mobil mevcut akış korunacak:
1. Login
2. Uzman listesi
3. Uzman detay
4. Slot seçme
5. Booking oluşturma
6. Booking detay
7. Mobile mock video room veya en azından “web görüşme linkini aç” butonu

Ancak bu fazın ana farkı: **web görüşme deneyimi de olacak.**

---

## 2. Sayfa ve Route Gereksinimleri

Next.js web uygulamasında aşağıdaki route’ları oluştur veya mevcutları geliştir.

### Public

```txt
/
```

Landing sayfası:
- Hero alanı
- “Ünlüler ve uzmanlarla birebir canlı görüşme” mesajı
- Featured talents
- Nasıl çalışır?
- Güven/KVKK kısa notu
- CTA: “Uzmanları Keşfet”

```txt
/talents
```

Uzman listesi:
- Arama inputu
- Kategori filtresi
- Kartlar:
  - foto/avatar
  - ad
  - kategori
  - başlangıç fiyatı
  - rating placeholder
  - “Profili Gör”

```txt
/talents/[slug]
```

Uzman detay:
- Profil başlığı
- Bio
- Kategori
- Fiyat
- Müsait slotlar
- Slot seçme
- Rezervasyon oluşturma
- Login yoksa login’e yönlendirme
- KVKK/onay checkbox’ı
- Demo ödeme açıklaması

### Auth

```txt
/login
```

Web login sayfası:
- Email
- Şifre
- Demo kullanıcı butonları:
  - Admin ile giriş yap
  - Demo kullanıcı ile giriş yap
  - Demo uzman ile giriş yap
- Login sonrası role göre yönlendirme:
  - ADMIN → `/admin/dashboard`
  - TALENT → `/talent/dashboard`
  - USER → `/bookings`

### User

```txt
/bookings
```

Kullanıcının rezervasyonları:
- Yaklaşan görüşmeler
- Tamamlanan görüşmeler
- İptal edilenler
- Her satırda:
  - uzman adı
  - tarih/saat
  - süre
  - durum
  - görüşme odası butonu

```txt
/bookings/[id]
```

Booking detay:
- Booking status
- Uzman bilgisi
- Tarih/saat
- Süre
- Tutar
- Payment status
- Video room status
- “Görüşme Odasına Git”
- “İptal Et” butonu

```txt
/call/[bookingId]
```

Web görüşme odası. En kritik sayfa burası.

Bu sayfa 3 aşamalı olmalı:

#### 1. Loading / Access Check
- Token var mı?
- Booking var mı?
- Kullanıcının bu booking’e erişim hakkı var mı?
- Admin/Talent/User rolleri doğru mu?
- Booking `CONFIRMED`, `IN_PROGRESS` veya demo modda mı?

#### 2. Pre-call Lobby
- Kamera/mikrofon izin açıklaması
- Local preview alanı
- “Kamera test et”
- “Mikrofon test et”
- “Görüşmeye Katıl”
- KVKK/kamera-ses onayı metni
- Tarayıcı izin hatası durumunda açıklayıcı mesaj

#### 3. In-call Room
- Büyük remote participant alanı
- Küçük local preview
- Üstte booking/talent/user bilgisi
- Timer:
  - görüşme süresi
  - kalan süre
  - demo modda countdown
- Alt kontrol bar:
  - Mikrofon aç/kapat
  - Kamera aç/kapat
  - Ekran paylaşımı placeholder
  - Görüşmeyi bitir
- Sağ panel:
  - Görüşme kuralları
  - Destek notu
  - Booking ID
- Görüşme bitince:
  - `POST /api/bookings/:id/complete` çağır
  - `/bookings/[id]?completed=1` sayfasına yönlendir

### Talent

```txt
/talent/dashboard
```

Uzman paneli:
- Yaklaşan görüşmeler
- Bugünkü görüşmeler
- Tamamlanan görüşmeler
- Toplam kazanç placeholder
- Her booking için:
  - kullanıcı adı
  - tarih/saat
  - süre
  - status
  - “Görüşmeye Katıl”

```txt
/talent/availability
```

Basit müsaitlik yönetimi:
- Mevcut availability windows listesi
- Yeni availability ekleme formu:
  - gün
  - başlangıç saati
  - bitiş saati
  - slot süresi
  - fiyat
- Kaydet
- Sil
- Bu sayfa çok kusursuz olmak zorunda değil ama demo edilebilir olmalı.

### Admin

Mevcut admin sayfalarını güçlendir.

```txt
/admin/dashboard
/admin/talents
/admin/bookings
/admin/users
```

Minimum:
- Admin layout/sidebar
- Dashboard summary cards
- Talent approval list
- Booking table
- User table
- Status badge’leri
- Manual booking status actions

---

## 3. API Gereksinimleri

NestJS API’de aşağıdaki endpoint’leri mevcutsa sertleştir, yoksa ekle.

### Health

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "db": "ok",
  "timestamp": "..."
}
```

### Auth

```http
POST /api/auth/login
GET /api/auth/me
```

JWT tabanlı çalışmalı. Response user rolünü içermeli.

Demo hesaplar seed ile gelmeli:
```txt
admin@unluapp.local / Password123!
demo@unluapp.local / Password123!
talent@unluapp.local / Password123!
```

### Talents

```http
GET /api/talents
GET /api/talents/featured
GET /api/talents/:slug
GET /api/talents/:slug/slots
```

Slot response örneği:
```json
[
  {
    "id": "slot-demo-id",
    "startsAt": "2026-06-06T12:00:00.000Z",
    "endsAt": "2026-06-06T12:15:00.000Z",
    "durationMinutes": 15,
    "priceAmount": 2500,
    "currency": "TRY",
    "available": true
  }
]
```

### Bookings

```http
GET /api/bookings
GET /api/bookings/:id
POST /api/bookings
POST /api/bookings/:id/cancel
POST /api/bookings/:id/complete
POST /api/bookings/:id/start
```

`POST /api/bookings/:id/start`:
- Booking status `CONFIRMED` ise `IN_PROGRESS` yap.
- Video session/token döndür.
- Mock provider kullanılabilir.

Response:
```json
{
  "bookingId": "...",
  "status": "IN_PROGRESS",
  "video": {
    "provider": "MOCK",
    "channelName": "booking_...",
    "token": "mock-token",
    "uid": "user-or-talent-id",
    "expiresAt": "..."
  }
}
```

### Video

Provider abstraction kur:

```txt
apps/api/src/modules/video/video.provider.ts
apps/api/src/modules/video/mock-video.provider.ts
apps/api/src/modules/video/video.service.ts
apps/api/src/modules/video/video.module.ts
```

Interface:
```ts
export interface VideoProvider {
  createSession(input: CreateVideoSessionInput): Promise<CreateVideoSessionResult>;
  createParticipantToken(input: CreateParticipantTokenInput): Promise<CreateParticipantTokenResult>;
}
```

Bu fazda `MockVideoProvider` yeterli. Ancak `.env` içinde ileride:
```env
VIDEO_PROVIDER=mock
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=
```

### Admin

```http
GET /api/admin/summary
GET /api/admin/talents/pending
POST /api/admin/talents/:id/approve
POST /api/admin/talents/:id/reject
GET /api/admin/bookings
POST /api/admin/bookings/:id/status
GET /api/admin/users
```

Admin endpointleri role guard ile korunmalı.

---

## 4. Prisma / Veri Modeli

Mevcut schema’yı bozma ama eksikleri tamamla.

Gerekli entity/alanlar:

### User
- id
- email
- passwordHash
- fullName
- role: USER | TALENT | ADMIN
- createdAt
- updatedAt

### TalentProfile
- id
- userId
- slug
- displayName
- category
- bio
- avatarUrl
- basePriceAmount
- currency
- status: PENDING | APPROVED | REJECTED
- createdAt
- updatedAt

### AvailabilityWindow
- id
- talentId
- dayOfWeek veya date
- startsAt/time
- endsAt/time
- slotDurationMinutes
- priceAmount
- currency
- active

### Booking
- id
- userId
- talentId
- startsAt
- endsAt
- durationMinutes
- priceAmount
- currency
- status:
  - PENDING_PAYMENT
  - CONFIRMED
  - IN_PROGRESS
  - COMPLETED
  - CANCELLED
  - REFUNDED
  - NO_SHOW
- paymentStatus:
  - MOCK_AUTHORIZED
  - MOCK_CAPTURED
  - MOCK_REFUNDED
- videoProvider
- videoChannelName
- videoStartedAt
- videoEndedAt
- createdAt
- updatedAt

### ConsentLog
- id
- userId
- bookingId nullable
- consentType
- version
- ipAddress nullable
- userAgent nullable
- acceptedAt

### AuditLog
- id
- actorUserId
- action
- entityType
- entityId
- metadata JSON
- createdAt

Migration üret ve seed’i güncelle.

---

## 5. Seed İçeriği

Seed idempotent olmalı.

Demo kullanıcılar:
```txt
admin@unluapp.local / Password123! / ADMIN
demo@unluapp.local / Password123! / USER
talent@unluapp.local / Password123! / TALENT
```

En az 6 approved talent oluştur:
1. Oyuncu
2. Müzisyen
3. Diyetisyen
4. Girişim mentorü
5. E-spor koçu
6. Marka danışmanı

En az 1 pending talent oluştur.

Her approved talent için:
- 15 dakikalık slot üretecek availability
- en az 2 gün içinde müsaitlik
- fiyat
- kategori
- avatar placeholder

Demo booking oluştur:
- `demo@unluapp.local` kullanıcısı ile `talent@unluapp.local` uzmanı arasında
- bugün veya yarın
- `CONFIRMED`
- web call room’a girmeye uygun

---

## 6. Web UI Tasarım Kuralları

Görsel kalite önemli. “Ham form ekranları” gibi bırakma.

### Stil

Tailwind kullanılıyorsa:
- Modern marketplace görünümü
- Açık arka plan
- Kart tabanlı layout
- Rounded corners
- Soft shadow
- Status badge
- Responsive tasarım
- Mobilde de web responsive çalışmalı

### Ana Bileşenler

Şunları ortak component olarak oluştur:

```txt
apps/web/components/Button.tsx
apps/web/components/Card.tsx
apps/web/components/Badge.tsx
apps/web/components/PageHeader.tsx
apps/web/components/EmptyState.tsx
apps/web/components/LoadingState.tsx
apps/web/components/CallControls.tsx
apps/web/components/VideoTile.tsx
apps/web/components/AppShell.tsx
apps/web/components/AdminShell.tsx
```

Basit ama temiz olsun.

### Video Room Görseli

Mock bile olsa gerçek ürün hissi vermeli:
- Siyah/koyu video alanı
- Local preview küçük floating card
- Remote placeholder avatar
- Alt kontrol bar
- Kırmızı “Bitir” butonu
- Timer
- Sağdaki bilgi paneli

Kamera/mikrofon için browser API denenebilir:
```ts
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
```

İzin alınırsa local stream’i video elementinde göster. İzin alınamazsa mock placeholder göster ama uygulama kırılmasın.

---

## 7. Mobile Güncellemeleri

Expo uygulamasında:
- API client yeni endpointlerle uyumlu olsun.
- Booking detail ekranı ekle veya güçlendir.
- Booking sonrası:
  - “Web görüşme linkini aç” butonu
  - mümkünse mobile mock call screen
- Deep link şart değil.
- Mobil prototip bozulmamalı.

---

## 8. Smoke Test

`apps/api/scripts/smoke.ts` genişlet.

Şunları test etsin:
1. Health check
2. Admin login
3. User login
4. Talent login
5. Featured talents
6. Talent detail
7. Slots
8. Booking create
9. Booking detail
10. Booking start
11. Booking complete
12. Admin summary
13. Admin booking list
14. Admin status update

Root script:
```json
{
  "scripts": {
    "smoke:api": "pnpm --filter api smoke"
  }
}
```

Smoke test başarılı değilse görev tamamlanmış sayılmaz.

---

## 9. README Güncelle

README’ye şunları ekle:

### Local Kurulum
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

### Demo Hesapları
```txt
Admin: admin@unluapp.local / Password123!
Kullanıcı: demo@unluapp.local / Password123!
Uzman: talent@unluapp.local / Password123!
```

### Demo Akış
1. Web landing aç
2. Demo kullanıcı ile login ol
3. Uzman seç
4. Slot seç
5. Booking oluştur
6. Booking detail’den görüşme odasına gir
7. Pre-call lobby’den katıl
8. Mock görüşmeyi bitir
9. Admin panelde booking status kontrol et

### Portlar
```txt
API: http://localhost:3001/api
Web: http://localhost:3000
Postgres: localhost:5432
```

### Ortam Değişkenleri
`.env.example` güncel olmalı.

---

## 10. Kabul Kriterleri

Bu görevin sonunda aşağıdakiler doğru olmalı:

- [ ] Web landing profesyonel görünüyor.
- [ ] Web login çalışıyor.
- [ ] Admin, user ve talent rolleri ayrılıyor.
- [ ] Web uzman listesi ve detay sayfası gerçek API’den veri çekiyor.
- [ ] Web booking oluşturabiliyor.
- [ ] Web booking detay sayfası var.
- [ ] Web `/call/[bookingId]` sayfası var.
- [ ] Web pre-call lobby var.
- [ ] Web mock video room var.
- [ ] Browser kamera izni deneniyor.
- [ ] Kamera izni yoksa uygulama bozulmuyor.
- [ ] Görüşme başlatma API endpoint’i var.
- [ ] Görüşme bitirme API endpoint’i var.
- [ ] Talent dashboard var.
- [ ] Talent kendi booking’lerini görüyor.
- [ ] Admin booking listesini görüyor.
- [ ] Admin booking status değiştirebiliyor.
- [ ] Mobile mevcut akış bozulmadı.
- [ ] Prisma migration uygulanabiliyor.
- [ ] Seed idempotent.
- [ ] Smoke test geçiyor.
- [ ] README güncel.
- [ ] Final commit alındı.

---

## 11. Final Rapor Formatı

Görev sonunda sadece şu formatta rapor ver:

```md
## Tamamlananlar
- ...

## Doğrulama
- `pnpm install` ✅/❌
- `docker compose up -d postgres` ✅/❌
- `pnpm db:migrate` ✅/❌
- `pnpm db:seed` ✅/❌
- `pnpm --filter api build` ✅/❌
- `pnpm --filter web build` ✅/❌
- `pnpm --filter api test` ✅/❌
- `pnpm test` ✅/❌
- `pnpm lint` ✅/❌
- `pnpm smoke:api` ✅/❌

## Demo URL’leri
- Web: http://localhost:3000
- API Health: http://localhost:3001/api/health
- Admin: http://localhost:3000/admin/dashboard
- User Bookings: http://localhost:3000/bookings
- Talent Dashboard: http://localhost:3000/talent/dashboard
- Demo Call Room: http://localhost:3000/call/{bookingId}

## Demo Hesapları
- Admin: admin@unluapp.local / Password123!
- Kullanıcı: demo@unluapp.local / Password123!
- Uzman: talent@unluapp.local / Password123!

## Commit
- Hash: ...

## Kalan Riskler
- ...
```

---

## 12. Önemli Not

Bu fazda gerçek para çekimi, gerçek Agora token üretimi, gerçek recording, gerçek moderation ve production KVKK metinleri beklenmiyor. Fakat UI ve mimari bunların ileride ekleneceği şekilde temiz hazırlanmalı.

Bu görevin ana çıktısı:

> Web + Mobile destekli, DB üzerinde çalışan, rezervasyon oluşturup web görüşme odasına girebilen, admin ve talent panelleri olan ilk demo prototip.
