# Windsurf Görevi — Mobile Akışı Tamamla, Web E2E Test Ekle ve İlk Prototipi Demo-Güvenilir Hale Getir

Repo: `/Users/investintech/Developer/unluapp`

Önceki final commit: `27bb999`

Mevcut durum:
- Web/API prototip büyük ölçüde çalışıyor.
- Local PostgreSQL fallback ile migration/seed/smoke geçti.
- Web akışı manuel olarak doğrulandı.
- Admin ve talent panelleri API’ye bağlandı.
- Web call room çalışıyor.
- Kalan en önemli eksik: **Mobile booking flow runtime olarak doğrulanmadı.**
- Web/mobile tarafında gerçek test kapsamı zayıf.
- Docker bu makinede yok; Docker doğrulaması sonraya kalabilir.
- Next.js lint plugin uyarısı devam ediyor.

Bu görevde yeni büyük ürün özelliği ekleme. Amaç mevcut ilk prototipi **mobil dahil demo-güvenilir hale getirmek**.

---

## 0. Öncelik Sırası

1. Mobile uygulama runtime sorunlarını çöz.
2. Mobile login → talent list → detail → booking → booking detail → web call link akışını çalıştır.
3. Web için Playwright E2E smoke test ekle.
4. API smoke test zaten geçiyor; bozulmadığını doğrula.
5. Web/mobile için placeholder testleri gerçek minimum testlerle değiştir.
6. README’ye mobile demo talimatlarını ekle.
7. Final commit al.

---

## 1. Başlangıç Kontrolleri

Şunları çalıştır:

```bash
pwd
git status --short
git log --oneline -5
node --version
pnpm --version
pnpm install
```

Repo temiz başlamalı. Temiz değilse nedenini raporla ve gerekli dosyaları bilinçli şekilde düzelt.

---

## 2. API ve DB Durumunu Tekrar Doğrula

Local PostgreSQL fallback daha önce çalışmış. Aynı zinciri tekrar doğrula:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev:api
```

Başka terminalde:

```bash
curl http://localhost:3001/api/health
pnpm smoke:api
```

Beklenen:
- Health response `db: ok`
- Smoke test tamamen yeşil

Bu adımlar fail olursa önce API/DB’yi düzeltmeden mobile’a geçme.

---

## 3. Mobile Runtime Akışını Tamamla

Expo mobile app için hedef akış:

1. Uygulama açılır.
2. Login ekranı açılır.
3. Demo kullanıcı ile giriş yapılır:
   - `demo@unluapp.local`
   - `Password123!`
4. Home/talent list gerçek API’den gelir.
5. Bir talent detayına girilir.
6. Slotlar gerçek API’den gelir.
7. Slot seçilip booking oluşturulur.
8. Booking detail ekranı açılır.
9. Booking detail’de:
   - tarih/saat
   - status
   - talent adı
   - fiyat
   - “Web Görüşme Odasını Aç” butonu görünür.
10. Buton web call URL’sini açar:
    - `http://localhost:3000/call/{bookingId}`
    - simülatörde/cihazda çalışacak şekilde configurable olmalı.

---

## 4. Mobile API Base URL Problemini Çöz

Expo’da `localhost` problemi çıkabilir. Bunu düzgün çöz.

`.env.example` veya mobile config içinde şunları netleştir:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_WEB_URL=http://localhost:3000
```

Ancak gerçek cihaz/simülatör için README’de alternatifleri yaz:

### iOS Simulator
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_WEB_URL=http://localhost:3000
```

### Android Emulator
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001/api
EXPO_PUBLIC_WEB_URL=http://10.0.2.2:3000
```

### Fiziksel Cihaz
```env
EXPO_PUBLIC_API_URL=http://{MAC_LOCAL_IP}:3001/api
EXPO_PUBLIC_WEB_URL=http://{MAC_LOCAL_IP}:3000
```

Mobile API client bu env değerlerini kullanmalı. Hardcoded localhost bırakma.

---

## 5. Mobile Hata ve Loading Durumlarını Güçlendir

Mobile ekranlarında beyaz/kırık ekran olmasın.

Minimum:
- Login loading state
- Login error state
- Talent list loading/error/empty state
- Talent detail loading/error
- Slot yoksa empty state
- Booking create loading state
- Booking create error message
- Booking detail loading/error
- Web link açılamazsa kullanıcıya mesaj

React Native alert kullanılabilir.

---

## 6. Mobile Web Call Link

Booking detail ekranında:

```txt
Web Görüşme Odasını Aç
```

Butonu:
- `Linking.openURL(`${WEB_URL}/call/${booking.id}`)` ile çalışmalı.
- URL oluşturulmadan önce booking id kontrol edilmeli.
- Hata yakalanmalı.
- README’de not düş:
  - Web görüşme odası bu fazda web üzerinden çalışır.
  - Mobile bu fazda web call room’a yönlendirir.
  - Native video room sonraki fazdır.

---

## 7. Mobile Typecheck / Test

Mobile için minimum gerçek doğrulama ekle.

Eğer Expo/Jest kurulumu hazırsa:
- login form render testi
- API client URL test’i
- booking detail link oluşturma helper test’i

Eğer Jest kurulumu çok zaman alıyorsa en azından:

```bash
pnpm --filter mobile typecheck
```

ekle ve çalıştır.

Mobile package scriptleri:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "... gerçek lint veya typecheck fallback, echo değil ..."
  }
}
```

Placeholder `echo test skipped` istemiyorum. Gerçek bir kontrol çalışsın.

---

## 8. Web Playwright E2E Smoke Test Ekle

Web manuel akışı iyi ama otomasyon yok. Minimum Playwright kurulumu ekle.

Hedef:
- API ve web local çalışırken test geçmeli.
- Testler fazla kırılgan olmasın.
- Seed demo verisini kullansın.

Kurulum:
```bash
pnpm --filter web add -D @playwright/test
```

veya workspace standardına göre ekle.

Web test script:
```json
{
  "scripts": {
    "e2e": "playwright test"
  }
}
```

Root script:
```json
{
  "scripts": {
    "test:e2e:web": "pnpm --filter web e2e"
  }
}
```

Minimum test dosyası:

```txt
apps/web/e2e/demo-flow.spec.ts
```

Test akışı:
1. `/login` aç.
2. Demo kullanıcı ile login ol.
3. `/talents` sayfasına git.
4. İlk talent kartını aç.
5. Slot varsa booking oluştur.
6. Booking detail sayfasına ulaştığını doğrula.
7. Call room’a git.
8. Pre-call lobby başlığını doğrula.
9. Görüşmeye katıl butonunun görünür olduğunu doğrula.

Not:
- Kamera izni Playwright’ta mocklanabilir veya sadece lobby kontrol edilebilir.
- Görüşmeyi bitirme testini zorunlu yapma, kırılgan olabilir.
- Ama sayfa açılıyor ve call route çalışıyor olmalı.

---

## 9. API Testlerini Koruma

Şunlar bozulmamalı:

```bash
pnpm --filter api test
pnpm --filter api build
pnpm smoke:api
```

Smoke test geçmeye devam etmeli.

---

## 10. Next.js Lint Uyarısını Azalt

Next.js build/lint geçiyor ama `@next/next` plugin uyarısı var.

Bunu araştır ve mümkünse düzelt:
- ESLint flat config Next plugin tanımı
- `settings.next.rootDir`
- workspace root ayarı

Düzeltmek çok riskliyse:
- build ve lint geçiyorsa bırakılabilir
- README veya final risklere “non-blocking lint plugin warning” olarak yaz

Ama mümkünse temizle.

---

## 11. README Mobile Demo Bölümünü Güncelle

README’ye yeni bölüm ekle:

### Mobile Demo

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:mobile
```

Expo çalıştırma:

```bash
pnpm --filter mobile start
```

iOS:
```bash
i
```

Android:
```bash
a
```

Fiziksel cihaz:
- Mac’in local IP adresini kullan
- `.env` içindeki `EXPO_PUBLIC_API_URL` ve `EXPO_PUBLIC_WEB_URL` değerlerini değiştir

Demo akışı:
1. Demo user ile login
2. Talent seç
3. Slot seç
4. Booking oluştur
5. Booking detail aç
6. Web görüşme odasını aç

Not:
- Bu fazda mobile native video yok.
- Mobile web call room’a yönlendirir.
- Native video room sonraki fazdır.

---

## 12. Deferred Docs Güncelle

`docs/deferred.md` veya benzeri dosyaya şunları ekle/güncelle:

- Native mobile video room
- Gerçek Agora entegrasyonu
- Gerçek iyzico marketplace
- Push notifications
- Calendar integration
- Browser E2E kapsamını genişletme
- Mobile device farm / CI doğrulaması
- Docker doğrulaması, Docker Desktop yüklü ortamda tekrar test
- Production KVKK/legal metinleri
- Recording/moderation

---

## 13. Final Doğrulama Komutları

Görev sonunda aşağıdakileri çalıştır:

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
```

Web server/API server açıkken:

```bash
pnpm test:e2e:web
```

Mobile runtime için:
```bash
pnpm --filter mobile start
```

ve manuel olarak iOS/Android/fiziksel cihaz durumunu raporla.

Docker varsa:
```bash
docker compose up -d postgres
```

Yoksa:
- “Docker bu makinede yok, local PostgreSQL ile doğrulandı” yaz.

---

## 14. Kabul Kriterleri

- [ ] API/DB zinciri hâlâ geçiyor.
- [ ] `pnpm smoke:api` geçiyor.
- [ ] Web build geçiyor.
- [ ] API build geçiyor.
- [ ] Lint gerçek şekilde geçiyor.
- [ ] Mobile typecheck geçiyor.
- [ ] Mobile API URL env tabanlı.
- [ ] Mobile login runtime olarak test edildi.
- [ ] Mobile talent list runtime olarak test edildi.
- [ ] Mobile booking create runtime olarak test edildi.
- [ ] Mobile booking detail runtime olarak test edildi.
- [ ] Mobile web call link çalışıyor.
- [ ] Web Playwright E2E smoke test eklendi.
- [ ] Web E2E test geçiyor.
- [ ] README mobile demo bilgileriyle güncel.
- [ ] Deferred docs güncel.
- [ ] Git çalışma ağacı temiz.
- [ ] Final commit alındı.

---

## 15. Final Commit

Her şeyden sonra:

```bash
git add .
git commit -m "stabilize mobile flow and add web e2e smoke"
```

---

## 16. Final Rapor Formatı

Görev sonunda sadece şu formatta rapor ver:

```md
## Nereden Başladık
- Önceki commit: 27bb999
- Ana eksikler: mobile runtime, web e2e, gerçek mobile test/typecheck, README mobile docs

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

## Mobile Runtime Kontrolü
- iOS Simulator ✅/❌/Not tested
- Android Emulator ✅/❌/Not tested
- Fiziksel cihaz ✅/❌/Not tested
- Login ✅/❌
- Talent list ✅/❌
- Talent detail ✅/❌
- Booking create ✅/❌
- Booking detail ✅/❌
- Web call link ✅/❌

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

## 17. Önemli Not

Bu fazda native mobile video room zorunlu değil. Ancak mobile booking flow runtime olarak çalışmalı ve web call room’a yönlendirme sağlamalı.

Bu görev bittiğinde proje şu seviyeye gelmeli:

> API + Web + Mobile temel akışları çalışan, web call room’u olan, Playwright web smoke test’i bulunan, mobil rezervasyon akışı doğrulanmış ilk demo prototip.
