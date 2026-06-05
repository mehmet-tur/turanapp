# Windsurf Görevi — Investor Demo Son Düzeltme, Dokümantasyon ve Tag Temizliği

Repo: `/Users/investintech/Developer/unluapp`  
Remote: `https://github.com/mehmet-tur/turanapp.git`  
Son commit: `7463076` — `feat: investor demo ready with UI improvements`

Bu görev, yatırımcı demosuna çıkmadan önce son düzeltme ve checkpoint temizliği görevidir.

Önceki işlemde önemli bir hata yapıldı:
- `v0.1.0-prototype` tag’i yeniden oluşturulup force-push edildi.
- Halbuki `v0.1.0-prototype`, ilk çalışan prototip checkpoint’i olarak sabit kalmalıydı.
- Yatırımcı demo sürümü için ayrı tag oluşturulmalıydı: `v0.2.0-investor-demo`.

Amaç:
1. Tag durumunu netleştirmek.
2. Investor demo dokümanlarını tamamlamak.
3. Staging/deployment dokümanını yazmak.
4. Doğrulamaları tekrar çalıştırmak.
5. Yeni doğru yatırımcı demo tag’ini oluşturmak.
6. Final raporu temiz vermek.

---

## 1. Başlangıç Kontrolü

Çalıştır:

```bash
git status --short
git log --oneline -10
git tag --list --sort=creatordate
git remote -v
```

Tag’in hangi committe olduğunu kontrol et:

```bash
git rev-list -n 1 v0.1.0-prototype
git show --stat --oneline v0.1.0-prototype
```

---

## 2. Tag Hatasını Düzelt

Eski ilk prototip commit’i `015eaac` hâlâ git tarihinde mevcut olmalı. Kontrol et:

```bash
git show --oneline --stat 015eaac
```

Eğer commit mevcutsa `v0.1.0-prototype` tag’ini tekrar doğru commite taşı:

```bash
git tag -a -f v0.1.0-prototype 015eaac -m "First working prototype"
git push origin -f v0.1.0-prototype
```

Sonra yatırımcı demo için yeni tag oluştur:

```bash
git tag -a v0.2.0-investor-demo 7463076 -m "Investor demo ready build"
git push origin v0.2.0-investor-demo
```

Eğer `015eaac` commit’i bulunamıyorsa:
- `git log --all --oneline | grep 015eaac` dene.
- Bulunamazsa final raporda açıkça yaz.
- Yine de `v0.2.0-investor-demo` tag’ini son yatırımcı demo commit’i üzerine oluştur.

Bundan sonra `v0.1.0-prototype` tag’ini yatırımcı demo için kullanma.

---

## 3. Investor Demo Dokümanlarını Tamamla

Aşağıdaki dosyalar yoksa oluştur, varsa güncelle.

### `docs/investor-demo/demo-script.md`

İçerik:

```md
# TuranApp Investor Demo Script

## Süre
7-10 dakika

## 0:00 - 0:45 Problem
İçerik üreticileri, ünlüler ve uzmanlar takipçilerinden gelen birebir görüşme taleplerini bugün DM, WhatsApp, manuel ödeme ve dağınık takvimlerle yönetiyor. Bu süreç hem güvenli değil hem de ölçeklenebilir değil.

## 0:45 - 1:30 Çözüm
TuranApp, ünlü ve uzmanların zamanını 15/30/45/60 dakikalık canlı görüşme slotlarına dönüştüren bir pazaryeridir. Kullanıcı uzmanı seçer, slot ayırır, ödeme mimarisi üzerinden rezervasyon oluşturur ve web görüşme odasına girer.

## 1:30 - 3:00 Kullanıcı Akışı
- Landing sayfasını aç.
- Demo kullanıcı ile giriş yap.
- Uzman listesini göster.
- Bir uzman profiline gir.
- Slot seç.
- Rezervasyon oluştur.
- Booking detayını göster.

## 3:00 - 4:15 Görüşme Deneyimi
- Görüşme odasına gir.
- Pre-call lobby ekranını göster.
- Kamera/mikrofon izinlerini anlat.
- Mock video room’u göster.
- Timer ve call controls’u göster.
- Görüşmeyi bitir.

## 4:15 - 5:15 Talent Panel
- Demo uzman ile giriş yap.
- Yaklaşan görüşmeleri göster.
- Talent’ın platformdan gelir fırsatlarını yönetebildiğini anlat.

## 5:15 - 6:30 Admin Panel
- Demo admin ile giriş yap.
- GMV/komisyon kartlarını göster.
- Booking yönetimini göster.
- Talent approval akışını göster.

## 6:30 - 7:30 Teknik Yol Haritası
Bu prototipte ödeme ve video mock/provider abstraction seviyesinde. Production aşamasında:
- Agora gerçek video provider
- iyzico marketplace/split payment
- KVKK/legal metinleri
- Native mobile video room
- Notification sistemi
- Moderasyon ve recording
eklenecek.

## Ana Cümle
Bu prototip, ürünün ana değer zincirini gösteriyor: keşif, rezervasyon, görüşme odası, talent deneyimi ve marketplace operasyonu. Gerçek video ve ödeme sağlayıcıları mimariye hazır şekilde eklenebilir.
```

### `docs/investor-demo/one-pager.md`

İçerik:

```md
# TuranApp — Ünlüler ve Uzmanlarla Zaman Bazlı Canlı Görüşme Pazaryeri

## Problem
Takipçiler gerçek ve birebir etkileşim istiyor. Ünlüler, içerik üreticileri ve uzmanlar ise bu talebi DM, WhatsApp, manuel ödeme ve dağınık takvimlerle yönetmeye çalışıyor.

## Çözüm
TuranApp, ünlü ve uzmanların zamanını canlı görüşme slotlarına dönüştüren web ve mobil destekli bir pazaryeridir. Kullanıcı uzmanı seçer, uygun slotu ayırır, rezervasyon oluşturur ve görüşme odasına katılır.

## Hedef Kullanıcılar
- Fanlar ve takipçiler
- Girişimciler
- İçerik üreticileri
- Ünlüler
- Alan uzmanları
- Kurumsal ekipler

## İş Modeli
- Platform komisyonu: varsayımsal %15
- Uzman kendi fiyatını belirler
- B2C: fan deneyimi, özel sohbet, motivasyon
- B2B/B2C: uzman danışmanlık, girişim mentorluğu, marka danışmanlığı
- Gelecek gelir kalemleri: grup workshop, kurumsal etkinlik, dijital ürün, üyelik

## MVP’de Çalışanlar
- Web landing
- Login
- Kullanıcı akışı
- Talent listesi ve detay
- Slot/booking
- Web mock call room
- Admin panel
- Talent dashboard
- Mobile booking flow
- API smoke test
- Web E2E smoke test

## Teknik Mimari
- Monorepo
- NestJS API
- Prisma + PostgreSQL
- Next.js web
- Expo mobile
- Mock video provider
- Mock payment provider
- Agora/iyzico entegrasyonlarına hazır yapı

## Sonraki 90 Gün
1. Staging/production deploy
2. Agora gerçek video entegrasyonu
3. iyzico marketplace sandbox
4. Native mobile call room
5. KVKK/legal metinleri
6. Notification sistemi
7. İlk 20 talent onboarding
8. Pilot kullanıcı testi

## Demo Hesapları
- Admin: admin@unluapp.local / Password123!
- Kullanıcı: demo@unluapp.local / Password123!
- Uzman: talent@unluapp.local / Password123!
```

### `docs/investor-demo/checklist.md`

İçerik:

```md
# Investor Demo Checklist

## Teknik
- [ ] API çalışıyor
- [ ] DB seed hazır
- [ ] Web çalışıyor
- [ ] Mobile Expo açılıyor
- [ ] Smoke test geçti
- [ ] E2E test geçti

## Demo Akışı
- [ ] Landing açılıyor
- [ ] Demo login çalışıyor
- [ ] Talent list açılıyor
- [ ] Talent detail açılıyor
- [ ] Booking oluşturuluyor
- [ ] Booking detail açılıyor
- [ ] Call room açılıyor
- [ ] Talent dashboard açılıyor
- [ ] Admin dashboard açılıyor

## Sunum Yedekleri
- [ ] Lokal demo hazır
- [ ] Staging URL varsa doğrulandı
- [ ] İnternet yoksa ekran görüntüleri hazır
- [ ] Kamera izni çalışmazsa mock placeholder açıklaması hazır
- [ ] Mobile çalışmazsa web üzerinden tüm akış gösterilebilir

## Anlatı
- [ ] Problem net
- [ ] Çözüm net
- [ ] İş modeli net
- [ ] Teknik yol haritası net
- [ ] Sonraki 90 gün net
```

### `docs/investor-demo/fallback-plan.md`

İçerik:

```md
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
```

### `docs/deployment/staging.md`

İçerik:

```md
# Staging Deployment Guide

## Önerilen Mimari
- Web: Vercel
- API: Railway / Render / Fly.io
- DB: Neon / Supabase / Railway PostgreSQL
- Mobile: Expo

## Ortam Değişkenleri

### API
```env
DATABASE_URL=
JWT_SECRET=
API_PORT=3001
APP_VERSION=0.2.0-investor-demo
VIDEO_PROVIDER=mock
PAYMENT_PROVIDER=mock
CORS_ORIGINS=
```

### Web
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_VERSION=0.2.0-investor-demo
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_INVESTOR_DEMO=true
```

### Mobile
```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_WEB_URL=
```

## Deployment Adımları
1. Managed PostgreSQL oluştur.
2. `DATABASE_URL` değerini API deploy ortamına ekle.
3. API servisini deploy et.
4. Migration çalıştır.
5. Seed çalıştır.
6. API health kontrol et.
7. Web’i deploy et.
8. Web env içinde API URL’i tanımla.
9. Demo login ve booking akışını doğrula.
10. Mobile env değerlerini staging URL’lere göre ayarla.

## Not
Bu staging ortamı yatırımcı demosu ve pilot kullanıcı testi içindir. Production security hardening ayrı fazdır.
```

---

## 4. Health Version Kontrolü

API health endpoint’inde version alanı yoksa ekle.

Beklenen response:

```json
{
  "status": "ok",
  "db": "ok",
  "version": "0.2.0-investor-demo",
  "timestamp": "..."
}
```

Env:
```env
APP_VERSION=0.2.0-investor-demo
NEXT_PUBLIC_APP_VERSION=0.2.0-investor-demo
```

---

## 5. `/demo` Sayfasını Kontrol Et

Eğer `/demo` sayfası hâlâ yoksa oluştur.

Minimum:
- Demo kullanıcı akışı kartı
- Talent panel kartı
- Admin panel kartı
- Call room kartı
- Demo hesapları
- API health göstergesi veya health linki
- Demo mode badge

---

## 6. Doğrulama Komutları

Hepsini tekrar çalıştır:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm --filter api build
pnpm --filter web build
pnpm --filter api test
pnpm test
pnpm lint
pnpm smoke:api
pnpm --filter mobile typecheck
pnpm test:e2e:web
```

Docker yoksa bu not olarak kalabilir, ama diğerleri geçmeli.

---

## 7. Commit ve Tag

Dokümantasyon ve son düzeltmelerden sonra:

```bash
git status --short
git add .
git commit -m "docs: finalize investor demo package"
```

Ardından doğru yatırımcı tag’i:

```bash
git tag -a v0.2.0-investor-demo -m "Investor demo ready build"
git push origin main
git push origin v0.2.0-investor-demo
```

Eğer `v0.2.0-investor-demo` tag’i zaten varsa:

```bash
git tag -a -f v0.2.0-investor-demo -m "Investor demo ready build"
git push origin -f v0.2.0-investor-demo
```

Ama `v0.1.0-prototype` tag’ine bir daha dokunma; sadece yanlış committeyse 2. bölümde düzelt.

---

## 8. Final Rapor Formatı

Görev sonunda sadece şu formatta rapor ver:

```md
## Tag Düzeltme
- v0.1.0-prototype commit:
- v0.2.0-investor-demo commit:
- Düzeltme yapıldı mı:

## Tamamlananlar
- ...

## Doğrulama
- `pnpm install` ✅/❌
- `pnpm db:generate` ✅/❌
- `pnpm db:migrate` ✅/❌
- `pnpm db:seed` ✅/❌
- `pnpm --filter api build` ✅/❌
- `pnpm --filter web build` ✅/❌
- `pnpm --filter api test` ✅/❌
- `pnpm test` ✅/❌
- `pnpm lint` ✅/❌
- `pnpm smoke:api` ✅/❌
- `pnpm --filter mobile typecheck` ✅/❌
- `pnpm test:e2e:web` ✅/❌

## Investor Dokümanları
- docs/investor-demo/demo-script.md ✅/❌
- docs/investor-demo/one-pager.md ✅/❌
- docs/investor-demo/checklist.md ✅/❌
- docs/investor-demo/fallback-plan.md ✅/❌
- docs/deployment/staging.md ✅/❌

## Demo URL’leri
- Web: http://localhost:3000
- Demo: http://localhost:3000/demo
- API Health: http://localhost:3001/api/health
- Admin: http://localhost:3000/admin/dashboard
- Talent Dashboard: http://localhost:3000/talent/dashboard

## Commit ve Push
- Commit:
- Push:
- Tag push:

## Kalan Riskler
- Docker:
- Staging deploy:
- Gerçek Agora/iyzico:
- Native mobile video:
```
