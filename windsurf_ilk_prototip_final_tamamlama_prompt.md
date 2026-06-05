# Windsurf Görevi — İlk Prototipi Gerçekten Tamamla ve Demo Edilebilir Hale Getir

Repo: `/Users/investintech/Developer/unluapp`

Bu görev yeni özellik icat etme görevi değildir. Mevcut prototipi **tam çalışan, demo edilebilir, doğrulanmış ilk prototip** haline getirme görevidir.

Önceki durumda web, mobile, API, mock görüşme odası ve temel paneller eklendi. Ancak bazı kritik doğrulamalar başarısız veya eksik kaldı:

- `pnpm install` ❌
- `docker compose up -d postgres` ❌
- `pnpm db:migrate` ❌
- `pnpm db:seed` ❌
- `pnpm test` ❌
- `pnpm smoke:api` ❌
- README yeni akışlara göre tam güncel değil.
- Admin görsel katmanı eksik/polish istiyor.
- Gerçek ESLint config eksik.
- Prompt dosyası untracked kalmış.
- Gerçek DB üzerinde API/Web akışı doğrulanmadı.

Bu görev bitmeden önce hedef:

> Web + Mobile destekli, PostgreSQL üzerinde çalışan, migration/seed uygulanmış, API smoke test’i geçen, web üzerinden rezervasyon oluşturup mock görüşme odasına girilebilen ilk prototip.

---

## 0. Çalışma Kuralı

Aşağıdaki doğrulama zinciri tamamlanmadan işi bitirme:

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

Eğer Docker bu makinede yoksa veya çalışmıyorsa:

1. Önce Docker Desktop var mı kontrol et.
2. Yoksa bunu açıkça raporla.
3. Alternatif olarak local PostgreSQL bağlantısı ile çalıştır:
   - macOS için Homebrew PostgreSQL kullanımı README’ye ekle.
   - Veya `.env` içinde dış PostgreSQL `DATABASE_URL` ile çalışabilecek hale getir.
4. Docker yok diye DB doğrulamasını tamamen atlama. Mümkünse local Postgres fallback ile migration/seed/smoke zincirini tamamla.
5. Hiçbir DB erişimi mümkün değilse, kodu DB geldiğinde tek komutla çalışacak hale getir ve tam hata raporunu yaz.

---

## 1. Mevcut Durumu İncele

Önce şu komutlarla repo durumunu çıkar:

```bash
pwd
git status --short
git log --oneline -5
pnpm --version
node --version
```

Sonra package ve workspace dosyalarını kontrol et:

```bash
cat package.json
cat pnpm-workspace.yaml
cat .env.example
```

Amaç:
- Script isimleri tutarlı mı?
- `pnpm install` neden fail ediyor?
- Workspace dependency veya lockfile sorunu var mı?
- Node/pnpm versiyon uyumsuzluğu var mı?
- `pnpm-lock.yaml` güncel mi?
- Untracked prompt dosyası ne yapılmalı?

---

## 2. `pnpm install` Hatasını Çöz

Önce gerçek hatayı çalıştır:

```bash
pnpm install
```

Hatanın sebebini bul ve düzelt.

Muhtemel kontroller:
- Workspace package isimleri doğru mu?
- Apps paketlerinde package.json eksik mi?
- Aynı dependency farklı incompatible versiyonlarda mı?
- Prisma/Nest/Next/Expo dependency çakışması var mı?
- `pnpm-lock.yaml` bozuk mu?
- `packageManager` alanı doğru mu?
- Node versiyonu Next/Expo/Nest için uygun mu?

Düzeltmeden sonra:

```bash
pnpm install
pnpm db:generate
```

başarılı geçmeli.

---

## 3. Gerçek ESLint Config Ekle

Önceki raporda `pnpm lint` fallback mesajlarıyla geçiyor denmiş. Bu kabul edilemez. Gerçek lint config ekle.

Root veya app bazlı uygun şekilde yapılandır:

- TypeScript
- Next.js
- NestJS
- Expo/React Native mümkünse temel lint

Minimum:
- `eslint`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- Next için `next lint` uyumlu veya flat config
- API için TS lint
- Web için React/Next lint
- Mobile için en azından TS/React lint

Root script:

```json
{
  "scripts": {
    "lint": "pnpm -r lint"
  }
}
```

Her workspace için gerçek lint script olmalı. Sadece `echo lint skipped` gibi placeholder kullanma.

Eğer Expo lint bağımlılıkları ağır sorun çıkarırsa, mobile için geçici ama gerçek `tsc --noEmit` veya Expo uyumlu lint yapılandır. Placeholder kabul edilmez.

---

## 4. Docker / PostgreSQL Zincirini Tamamla

Önce Docker kontrolü:

```bash
docker --version
docker compose version
docker compose up -d postgres
docker compose ps
```

Eğer Docker çalışıyorsa:

```bash
pnpm db:migrate
pnpm db:seed
```

çalıştır.

Eğer Docker yoksa local fallback uygula:

### macOS Local PostgreSQL Fallback

README’ye ve gerekirse scriptlere şu yolu ekle:

```bash
brew install postgresql@16
brew services start postgresql@16
createdb unluapp
```

`.env` örneği:

```env
DATABASE_URL="postgresql://localhost:5432/unluapp?schema=public"
```

Sonra:

```bash
pnpm db:migrate
pnpm db:seed
```

Not:
- Fallback için kodu bozma.
- Docker compose varsayılan yol olarak kalmalı.
- Local Postgres ikinci seçenek olarak dokümante edilmeli.

---

## 5. Prisma Migration ve Seed’i Gerçekten Doğrula

Şunlar başarılı olmalı:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Seed idempotent olmalı. Aynı komut iki kez çalıştırılınca duplicate key hatası vermemeli:

```bash
pnpm db:seed
pnpm db:seed
```

Seed sonunda şu hesaplar kesin oluşmalı:

```txt
Admin: admin@unluapp.local / Password123!
Kullanıcı: demo@unluapp.local / Password123!
Uzman: talent@unluapp.local / Password123!
```

En az:
- 6 approved talent
- 1 pending talent
- demo kullanıcı
- demo uzman
- demo confirmed booking
- availability windows
- slot üretilebilir veri

---

## 6. API’yi Gerçek DB ile Çalıştır

API’yi başlat:

```bash
pnpm dev:api
```

Başka terminalden:

```bash
curl http://localhost:3001/api/health
```

Response içinde DB durumu net görünmeli:

```json
{
  "status": "ok",
  "db": "ok"
}
```

Eğer DB bağlantısı kopuksa health bunu göstermeli:

```json
{
  "status": "degraded",
  "db": "error"
}
```

API crash etmemeli.

---

## 7. Smoke Test’i Tamamla

`pnpm smoke:api` gerçek DB ve çalışan API üzerinde geçmeli.

Smoke test şunları doğrulamalı:

1. Health
2. Admin login
3. User login
4. Talent login
5. `GET /api/auth/me`
6. Featured talents
7. Talent list
8. Talent detail by slug
9. Slots
10. Booking create
11. Booking detail
12. Booking start
13. Booking complete
14. User bookings
15. Talent bookings/dashboard endpoint’i varsa
16. Admin summary
17. Admin bookings
18. Admin booking status update
19. Pending talents
20. Talent approve/reject, mümkünse test talent üzerinde

Smoke test sonucu terminalde okunabilir olmalı:

```txt
✅ health
✅ admin login
✅ user login
...
All smoke checks passed.
```

Fail olursa hangi endpoint ve response ile fail ettiğini göster.

---

## 8. Web Akışını Gerçek API ile Doğrula

Web build zaten geçmiş ama gerçek DB/API ile manuel demo akışı yapılmalı.

Çalıştır:

```bash
pnpm dev:web
```

Aşağıdaki sayfaları tek tek aç ve çalıştığını doğrula:

```txt
http://localhost:3000
http://localhost:3000/login
http://localhost:3000/talents
http://localhost:3000/talents/{seed-slug}
http://localhost:3000/bookings
http://localhost:3000/bookings/{bookingId}
http://localhost:3000/call/{bookingId}
http://localhost:3000/talent/dashboard
http://localhost:3000/admin/dashboard
http://localhost:3000/admin/talents
http://localhost:3000/admin/bookings
```

Web tarafında şu sorunları özellikle düzelt:

- Login token localStorage/cookie akışı tutarlı mı?
- Refresh sonrası kullanıcı oturumu korunuyor mu?
- Role bazlı yönlendirme çalışıyor mu?
- API base URL doğru mu?
- Hata durumlarında boş beyaz sayfa çıkıyor mu?
- Loading/error/empty state var mı?
- Booking oluşturduktan sonra detail sayfasına gidiyor mu?
- Call room booking’i başlatıyor mu?
- Görüşme bitince booking tamamlanıyor mu?
- Admin booking status değiştirince UI güncelleniyor mu?

---

## 9. Web Görüşme Odasını Daha Demo Edilebilir Yap

`/call/[bookingId]` sayfası prototipin vitrinidir. Görsel olarak zayıf kalmasın.

Minimum UI:

- Pre-call lobby:
  - booking bilgileri
  - uzman/kullanıcı adı
  - kamera/mikrofon izin testi
  - local preview
  - izin yoksa açıklayıcı placeholder
  - “Görüşmeye Katıl” butonu

- In-call:
  - koyu video room layout
  - remote participant büyük alan
  - local preview küçük kart
  - timer
  - kalan süre
  - mikrofon aç/kapat
  - kamera aç/kapat
  - ekran paylaşımı disabled placeholder
  - görüşmeyi bitir
  - sağ bilgi paneli
  - bağlantı durumu: `Mock provider`
  - booking status badge

- Ended:
  - görüşme tamamlandı ekranı
  - booking detayına dön
  - admin panelde kontrol et linki, sadece admin ise

Kamera izni için:

```ts
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
```

Kullan. Ama izin verilmezse uygulama kırılmasın.

---

## 10. Admin Görsel Katmanı ve İşlevleri Tamamla

Admin şu an sadece var olmakla kalmasın; demo sırasında kullanılabilir olsun.

Gerekli sayfalar:

```txt
/admin/dashboard
/admin/talents
/admin/bookings
/admin/users
```

Minimum:
- Admin sidebar
- Summary cards
- Son booking’ler tablosu
- Bekleyen talent başvuruları
- Approve/reject butonları
- Booking status badge
- Booking status değiştirme:
  - CONFIRMED
  - IN_PROGRESS
  - COMPLETED
  - CANCELLED
  - REFUNDED
- User list
- Talent list

Admin actions API’ye bağlanmalı. Sadece mock UI olmasın.

---

## 11. Talent Dashboard’ı Demo Edilebilir Yap

`/talent/dashboard`:

- Talent login ile açılmalı.
- Sadece ilgili talent’ın booking’lerini göstermeli.
- Bugünkü/yaklaşan/tamamlanan booking ayrımı olmalı.
- “Görüşmeye Katıl” butonu `/call/[bookingId]` sayfasına gitmeli.
- Booking yoksa empty state göstermeli.

Gerekirse API’ye endpoint ekle:

```http
GET /api/talent/bookings
GET /api/talent/summary
```

Role guard ile korunmalı.

---

## 12. Mobile Akışı Bozma

Mobile build veya typecheck varsa çalıştır.

Mobile’da:
- Login
- Home/talent list
- Talent detail
- Booking create
- Booking detail
- Web görüşme linki açma

bozulmamalı.

Eğer mobile görüşme odası tam yapılmadıysa kabul edilebilir, ama booking detail’de web call linki net çalışmalı.

---

## 13. README’yi Tam Güncelle

README şu bölümleri içermeli:

### Proje Özeti
Kısa anlatım:
- Ünlüler/uzmanlarla zaman bazlı canlı görüşme platformu
- Web + mobile
- Mock video
- Mock payment
- Admin/talent/user rolleri

### Kurulum

Docker ile:

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

Local PostgreSQL fallback:

```bash
brew install postgresql@16
brew services start postgresql@16
createdb unluapp
cp .env.example .env
# DATABASE_URL değerini local postgres'e göre düzenle
pnpm db:migrate
pnpm db:seed
```

### Demo Hesapları

```txt
Admin: admin@unluapp.local / Password123!
Kullanıcı: demo@unluapp.local / Password123!
Uzman: talent@unluapp.local / Password123!
```

### Demo Akışı

1. Web landing aç.
2. Demo kullanıcı ile login ol.
3. Uzman seç.
4. Slot seç.
5. Booking oluştur.
6. Booking detayına git.
7. Görüşme odasına gir.
8. Pre-call lobby’de kamera/mikrofonu test et.
9. Mock görüşmeye katıl.
10. Görüşmeyi bitir.
11. Admin panelden booking status kontrol et.
12. Talent dashboard ile aynı booking’e uzman tarafından gir.

### URL’ler

```txt
Web: http://localhost:3000
API: http://localhost:3001/api
Health: http://localhost:3001/api/health
Admin: http://localhost:3000/admin/dashboard
Talent: http://localhost:3000/talent/dashboard
Bookings: http://localhost:3000/bookings
```

### Scriptler

Tüm önemli scriptleri açıkla.

### Kalanlar

Production’a kalacakları belirt:
- gerçek iyzico
- gerçek Agora
- gerçek KVKK metinleri
- recording
- moderation
- notification
- payment reconciliation
- observability

---

## 14. Untracked Dosya Temizliği

`windsurf_web_mobile_prototip_gelistirme_prompt.md` untracked kalmış.

Şunlardan birini yap:

Seçenek A — Dokümantasyona dahil et:
```txt
docs/prompts/windsurf_web_mobile_prototip_gelistirme_prompt.md
```

Seçenek B — Gereksizse sil.

Ama finalde çalışma ağacı temiz olmalı veya bilinçli olarak sadece istenen dosyalar staged/committed olmalı.

```bash
git status --short
```

temiz olmalı.

---

## 15. Final Commit

Tüm düzeltmelerden sonra commit al:

```bash
git add .
git commit -m "complete first demo prototype"
```

Final commit hash raporda yer almalı.

---

## 16. Kabul Kriterleri

Aşağıdaki checklist’in tamamı hedeflenir:

- [ ] `pnpm install` geçiyor.
- [ ] Gerçek ESLint config var.
- [ ] `pnpm lint` gerçek lint çalıştırıyor.
- [ ] `pnpm test` geçiyor.
- [ ] API build geçiyor.
- [ ] Web build geçiyor.
- [ ] Docker veya local PostgreSQL ile DB ayağa kalkıyor.
- [ ] Prisma migration uygulanıyor.
- [ ] Seed iki kez üst üste çalışıyor.
- [ ] API health `db: ok` döndürüyor.
- [ ] Smoke test geçiyor.
- [ ] Web login çalışıyor.
- [ ] User booking oluşturabiliyor.
- [ ] Booking detail çalışıyor.
- [ ] Web call room çalışıyor.
- [ ] Kamera/mikrofon izin akışı kırılmıyor.
- [ ] Görüşme başlatma API çağrısı çalışıyor.
- [ ] Görüşme bitirme API çağrısı çalışıyor.
- [ ] Talent dashboard çalışıyor.
- [ ] Admin dashboard çalışıyor.
- [ ] Admin booking status değiştirebiliyor.
- [ ] Mobile temel akış bozulmadı.
- [ ] README güncel.
- [ ] Git çalışma ağacı temiz.
- [ ] Final commit alındı.

---

## 17. Final Rapor Formatı

Görev sonunda sadece şu formatta rapor ver:

```md
## Nereden Başladık
- Önceki commit: 19df5ee
- Ana eksikler: install/db/smoke/test/readme/admin polish

## Tamamlananlar
- ...

## Doğrulama
- `pnpm install` ✅/❌
- `pnpm db:generate` ✅/❌
- `docker compose up -d postgres` ✅/❌
- `pnpm db:migrate` ✅/❌
- `pnpm db:seed` ✅/❌
- `pnpm --filter api build` ✅/❌
- `pnpm --filter web build` ✅/❌
- `pnpm --filter api test` ✅/❌
- `pnpm test` ✅/❌
- `pnpm lint` ✅/❌
- `pnpm smoke:api` ✅/❌

## Manuel Demo Kontrolü
- Landing ✅/❌
- Login ✅/❌
- Talent list ✅/❌
- Talent detail ✅/❌
- Booking create ✅/❌
- Booking detail ✅/❌
- Web call room ✅/❌
- Talent dashboard ✅/❌
- Admin dashboard ✅/❌
- Admin booking status update ✅/❌
- Mobile booking flow ✅/❌

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

## 18. Önemli Öncelik Sırası

Öncelik sırası budur:

1. `pnpm install` düzelt.
2. DB/migration/seed zincirini çalıştır.
3. API health + smoke test geçir.
4. Web call room manuel demo akışını doğrula.
5. Admin/talent panelleri demo edilebilir hale getir.
6. README güncelle.
7. Lint/test gerçek şekilde geçsin.
8. Git temizle ve commit al.

Yeni büyük özellik ekleme. Önce ilk prototipi gerçekten çalışır hale getir.
