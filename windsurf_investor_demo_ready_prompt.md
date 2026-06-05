# Windsurf Görevi — Yatırımcı Sunumu İçin Demo-Ready Staging Sürüm Hazırla

Repo: `/Users/investintech/Developer/unluapp`  
Remote: `https://github.com/mehmet-tur/turanapp.git`  
Mevcut checkpoint: `v0.1.0-prototype`  
Son commit: `015eaac` — `Stabilize mobile flow and add web e2e smoke`

Bu görev, mevcut çalışan ilk prototipi **yatırımcıya gösterilebilir demo sürümüne** dönüştürme görevidir.

Yeni büyük ürün icat etme. Ama yatırımcı karşısında ürünün:
- açılabilir,
- anlaşılır,
- şık,
- güven veren,
- uçtan uca demo edilebilir,
- teknik olarak disiplinli,
- ölçeklenebilir görünümlü

olmasını sağla.

Bu fazın hedef çıktısı:

> İnternetten erişilebilen veya en azından tek komutla lokal/staging açılabilen, yatırımcıya 7-10 dakikalık demo akışıyla gösterilebilecek web + API + mobile destekli canlı görüşme platformu.

---

## 0. Görev Felsefesi

Yatırımcı için bu prototipin amacı “tüm production özellikleri var” demek değildir.

Amaç şudur:

1. Problemi net göstermek.
2. Ürün çözümünü hızlı göstermek.
3. Web üzerinden kullanıcı rezervasyon ve mock görüşme akışını göstermek.
4. Admin ve talent panelleriyle marketplace mantığını göstermek.
5. Teknik mimarinin Agora/iyzico/KVKK gibi production entegrasyonlarına hazır olduğunu göstermek.
6. Demo sırasında hata çıkma riskini azaltmak.
7. Sunum için hazır bir demo script’i üretmek.

---

## 1. Başlangıç Kontrolleri

Önce mevcut durumu doğrula:

```bash
pwd
git status --short
git log --oneline -5
git tag --list
node --version
pnpm --version
pnpm install
```

Beklenen:
- Çalışma ağacı temiz başlamalı.
- `v0.1.0-prototype` tag’i olmalı.
- `pnpm install` geçmeli.

Ardından mevcut doğrulama zincirini tekrar çalıştır:

```bash
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

Fail olursa önce bunu düzelt.

---

## 2. Yatırımcı Demo Modu Ekle

Uygulamada yatırımcı demo’su için özel bir demo modu olsun.

`.env.example` içine ekle:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_INVESTOR_DEMO=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_WEB_URL=http://localhost:3000
```

Web tarafında demo mod aktifken:
- Kritik sayfalarda demo yardımcı metinleri görünsün.
- Demo hesapları login ekranında tek tıkla seçilebilsin.
- Booking oluşturma akışı hızlı ve hatasız ilerlesin.
- Call room için zaman kısıtı yatırımcı demosunu engellemesin.
- Demo booking yoksa seed’den oluşturulsun veya UI üzerinden hızlı oluşturulabilsin.

Yatırımcı demo modunda gizli/tehlikeli development detaylarını gösterme:
- Stack trace gösterme.
- Internal error JSON gösterme.
- Token/JWT gösterme.
- DB connection string gösterme.

---

## 3. Landing Sayfasını Yatırımcı Sunumuna Uygun Hale Getir

`/` landing sayfası artık sadece ürün sayfası değil, yatırımcıya ilk izlenim veren vitrin olmalı.

Landing’de şu bölümler olsun:

### Hero
Başlık önerisi:

```txt
Ünlüler ve uzmanlarla dakikalar içinde birebir canlı görüşme
```

Alt metin:

```txt
TuranApp, içerik üreticileri, ünlüler ve alan uzmanlarının zamanını güvenli, planlanabilir ve gelir üreten canlı görüşmelere dönüştüren yeni nesil etkileşim pazaryeridir.
```

CTA:
- `Uzmanları Keşfet`
- `Demo Akışını Başlat`
- `Admin Panelini Gör`

### Problem
Kısa ve net:
- Fanlar ve takipçiler gerçek etkileşim istiyor.
- Ünlü/uzman tarafında zaman monetizasyonu dağınık.
- DM, WhatsApp, manuel ödeme ve takvim yönetimi ölçeklenmiyor.
- Güvenli ödeme, randevu, video ve moderasyon tek yerde değil.

### Çözüm
- Zaman bazlı slotlar
- Online rezervasyon
- Güvenli ödeme mimarisi
- Web/mobile görüşme deneyimi
- Admin/talent/user panelleri
- Agora/iyzico entegrasyonuna hazır mimari

### Nasıl Çalışır?
1. Uzmanı seç.
2. Slot seç.
3. Rezervasyon oluştur.
4. Görüşme odasına gir.
5. Görüşmeyi tamamla.

### Marketplace Tarafları
- Kullanıcı
- Ünlü/Uzman/Talent
- Admin/Platform

### Demo CTA
Yatırımcı için direkt linkler:
- Demo kullanıcı akışı
- Demo talent paneli
- Demo admin paneli

### Güven Notu
- KVKK onay logları
- Mock payment şu anda demo
- Gerçek ödeme için iyzico marketplace mimarisi hazır
- Gerçek video için Agora provider abstraction hazır

Landing görsel olarak temiz, modern ve yatırımcıya güven verecek seviyede olmalı.

---

## 4. Demo Başlat Sayfası Ekle

Yeni route:

```txt
/demo
```

Bu sayfa yatırımcı sunumunun kontrol merkezi olsun.

İçerik:

### Demo Akış Kartları

1. **Kullanıcı Demo Akışı**
   - Açıklama: Uzman seç, slot ayır, görüşme odasına gir.
   - Buton: `Demo Kullanıcı Olarak Başla`
   - Login otomatik yapılabiliyorsa yap; değilse login sayfasına demo kullanıcı parametresiyle yönlendir.

2. **Uzman Paneli**
   - Açıklama: Uzman yaklaşan görüşmelerini görür ve görüşmeye katılır.
   - Buton: `Uzman Panelini Aç`

3. **Admin Paneli**
   - Açıklama: Platform booking, kullanıcı ve talent operasyonlarını yönetir.
   - Buton: `Admin Panelini Aç`

4. **Mock Görüşme Odası**
   - Açıklama: Web görüşme deneyimini gösterir.
   - Buton: `Demo Görüşme Odasını Aç`

5. **Teknik Sağlık**
   - API health durumu
   - DB durumu
   - Smoke test son durumu manuel olarak README’den veya endpoint varsa API’den gösterilebilir.

### Demo Hesapları
Gizli değil, yatırımcı demosunda açıkça gösterilebilir:

```txt
Admin: admin@unluapp.local / Password123!
Kullanıcı: demo@unluapp.local / Password123!
Uzman: talent@unluapp.local / Password123!
```

Ancak production deploy yapılacaksa bu demo hesaplarının sadece staging ortamında aktif olacağını belirt.

---

## 5. Login Deneyimini Demo İçin İyileştir

`/login` sayfasında üç tek-tık demo butonu olsun:

- `Demo Kullanıcı ile Giriş`
- `Demo Uzman ile Giriş`
- `Demo Admin ile Giriş`

Butona basınca:
- email/password otomatik doldurulsun veya direkt login isteği atılsın.
- Başarılı login sonrası role göre yönlendir:
  - USER → `/talents` veya `/bookings`
  - TALENT → `/talent/dashboard`
  - ADMIN → `/admin/dashboard`

Login başarısız olursa kullanıcı dostu hata göster:
```txt
Demo hesabıyla giriş yapılamadı. API ve seed verisinin çalıştığından emin olun.
```

---

## 6. Web Demo Akışını Kusursuzlaştır

Yatırımcı sunumunda ana akış şu olacak:

```txt
Landing → Demo → Demo kullanıcı login → Talent list → Talent detail → Slot seç → Booking oluştur → Booking detail → Web call room → Görüşmeyi bitir → Admin panelde status gör
```

Bu akışta her sayfada:
- loading state olmalı,
- error state olmalı,
- boş veri varsa demo yönlendirmesi olmalı,
- teknik hata kullanıcıya kaba şekilde gösterilmemeli.

### Talent List
- En az 6 talent güzel kartlarla görünmeli.
- Kategoriler:
  - Oyuncu
  - Müzisyen
  - Diyetisyen
  - Girişim Mentoru
  - E-spor Koçu
  - Marka Danışmanı
- Kartlarda:
  - avatar placeholder
  - kategori badge
  - başlangıç fiyatı
  - kısa açıklama
  - `Profili Gör`

### Talent Detail
- Net CTA:
  - `Bu slotu seç`
  - `Rezervasyon Oluştur`
- Slot seçimi görsel olarak belirgin olsun.
- KVKK/onay checkbox’ı görünür olsun.
- Mock ödeme bilgisi:
```txt
Bu prototipte ödeme mock olarak tamamlanır. Production aşamasında iyzico marketplace entegrasyonu kullanılacaktır.
```

### Booking Detail
- Booking status badge
- Payment status badge
- Video status
- Talent bilgisi
- Tarih/saat
- `Görüşme Odasına Git`

### Call Room
- Pre-call lobby düzgün görünmeli.
- Kamera izni verilemezse placeholder ile devam etmeli.
- In-call ekranı demo için etkileyici olmalı.
- Timer ve kontrol bar çalışmalı.
- Görüşme bitirince booking detail’e dönmeli.

---

## 7. Admin Panelini Yatırımcı İçin Güçlendir

Admin panel yatırımcıya “bu bir marketplace operasyonu” hissini vermeli.

`/admin/dashboard`:
- Summary cards:
  - Toplam kullanıcı
  - Toplam talent
  - Bekleyen talent
  - Toplam booking
  - Toplam GMV placeholder
  - Platform komisyonu placeholder
  - Tamamlanan görüşmeler
  - İptal edilen görüşmeler

GMV/komisyon gerçek hesaplanabiliyorsa booking’lerden hesapla:
- GMV = tüm non-cancelled booking price toplamı
- Platform komisyonu = GMV * 0.15

Görselde:
- TL formatı kullan.
- Badge ve kartlar profesyonel olsun.

`/admin/bookings`:
- Booking tablosu
- Status update
- Kullanıcı/talent bilgisi
- Tutar
- Tarih
- Quick action:
  - complete
  - cancel
  - refund

`/admin/talents`:
- Approved/pending ayrımı
- Approve/reject butonları
- Talent listesi

`/admin/users`:
- Kullanıcı listesi
- Rol badge
- Oluşturulma tarihi

---

## 8. Talent Panelini Demo İçin Güçlendir

`/talent/dashboard`:
- Yaklaşan görüşmeler
- Bugünkü görüşmeler
- Tamamlanan görüşmeler
- Tahmini kazanç
- Her booking için:
  - kullanıcı adı
  - tarih/saat
  - süre
  - tutar
  - status
  - `Görüşmeye Katıl`

Talent panel yatırımcıya supply-side deneyimini göstermeli:
```txt
Ünlü veya uzman kendi takvimini ve yaklaşan gelir fırsatlarını görebiliyor.
```

Basit ama iyi görünen bir ekran yeterli.

---

## 9. Mobile Demo’yu Sunum İçin Hazırla

Mobile tarafı:
- Expo’da açılabilir olmalı.
- Demo kullanıcı login çalışmalı.
- Talent list çalışmalı.
- Talent detail çalışmalı.
- Booking oluşturma çalışmalı.
- Booking detail’de web call link açılmalı.

README’de sunum için şu net yazmalı:

```txt
Mobil uygulamada native video room bu fazda yoktur. Mobil kullanıcı booking oluşturur ve web call room linkine yönlendirilir. Native video room Phase 3 kapsamındadır.
```

Mobile UI için küçük polish:
- Login ekranında demo hesap butonu
- Booking sonrası başarı mesajı
- Web call room CTA net
- Hatalar Alert ile gösterilsin

---

## 10. Staging Deploy Hazırlığı

Bu fazda mümkünse staging deploy yap. Eğer deploy bilgileri/hesapları yoksa deploy’a hazır hale getir.

### Önerilen yapı

```txt
Web: Vercel
API: Railway / Render / Fly.io
DB: Neon / Supabase / Railway PostgreSQL
Mobile: Expo
```

### Kodda yapılacaklar

- API CORS staging domainleri desteklemeli.
- API port/env configurable olmalı.
- Web API URL env’den gelmeli:
```env
NEXT_PUBLIC_API_URL=
```
- Mobile API URL env’den gelmeli:
```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_WEB_URL=
```
- Prisma migration production/staging DB’de çalışabilecek durumda olmalı.
- Seed staging demo data için güvenli olmalı.

### Deployment dokümanı oluştur

Yeni dosya:

```txt
docs/deployment/staging.md
```

İçerik:
1. Managed PostgreSQL oluşturma
2. `DATABASE_URL` alma
3. API deploy env değerleri
4. Web deploy env değerleri
5. Migration çalıştırma
6. Seed çalıştırma
7. Health check
8. Demo hesapları
9. Rollback notları

Eğer gerçekten deploy yapabilirsen:
- staging API URL
- staging web URL
- health URL
final rapora ekle.

Eğer deploy yapamazsan:
- “Deploy hesapları/secret bilgileri verilmediği için deploy yapılmadı; repo staging deploy’a hazırlandı” yaz.

---

## 11. Investor Demo Script Hazırla

Yeni dosya oluştur:

```txt
docs/investor-demo/demo-script.md
```

İçerik:

# 7 Dakikalık Demo Akışı

## 0:00 - 0:45 Problem
- İçerik üreticileri ve uzmanlar takipçilerinden gelen talepleri DM/WhatsApp ile yönetiyor.
- Ödeme, takvim, güven, görüşme ve operasyon tek yerde değil.
- Kullanıcı tarafında güvenli birebir erişim yok.

## 0:45 - 1:30 Çözüm
- TuranApp ünlü ve uzman zamanını satılabilir canlı görüşme slotlarına dönüştürür.
- Web ve mobile marketplace.
- Rezervasyon, ödeme mimarisi, video room, admin operasyonu tek sistemde.

## 1:30 - 3:00 Kullanıcı Akışı
- Landing
- Talent list
- Talent detail
- Slot seç
- Booking oluştur
- Booking detail

## 3:00 - 4:15 Görüşme Deneyimi
- Pre-call lobby
- Kamera/mikrofon izinleri
- Mock görüşme odası
- Timer
- Görüşmeyi bitir

## 4:15 - 5:15 Talent Paneli
- Yaklaşan görüşmeler
- Kazanç potansiyeli
- Görüşmeye katılma

## 5:15 - 6:15 Admin Paneli
- Marketplace operasyonu
- Booking yönetimi
- Talent approval
- GMV/komisyon göstergeleri

## 6:15 - 7:00 Teknik Yol Haritası
- Agora gerçek video
- iyzico marketplace
- KVKK/legal
- Native mobile video
- Notifications
- Staging/production scale

# Demo Sırasında Söylenecek Ana Cümle
```txt
Bu prototip, ürünün ana değer zincirini gösteriyor: keşif, rezervasyon, ödeme mimarisi, görüşme odası ve marketplace operasyonu. Gerçek ödeme/video sağlayıcıları provider abstraction ile eklenebilir durumda.
```

---

## 12. Investor One-Pager Hazırla

Yeni dosya:

```txt
docs/investor-demo/one-pager.md
```

İçerik kısa ve net olmalı:

Başlık:
```txt
TuranApp — Ünlüler ve uzmanlarla zaman bazlı canlı görüşme pazaryeri
```

Bölümler:
- Problem
- Çözüm
- Hedef kullanıcılar
- İş modeli
- MVP’de çalışanlar
- Sonraki 90 gün
- Teknik mimari
- Demo linkleri
- Ekip/iletişim placeholder

İş modeli:
- Platform komisyonu: %15 varsayım
- Uzman/talent fiyatı kendisi belirler
- B2C: fan/deneyim
- B2B/B2C: uzman danışmanlık
- Gelecek: grup workshop, kurumsal etkinlik, dijital ürün

---

## 13. Investor Readiness Checklist

Yeni dosya:

```txt
docs/investor-demo/checklist.md
```

Checklist:

- [ ] API çalışıyor
- [ ] Web çalışıyor
- [ ] DB seed hazır
- [ ] Demo kullanıcıları hazır
- [ ] Landing açılıyor
- [ ] Login çalışıyor
- [ ] Booking oluşturuluyor
- [ ] Call room açılıyor
- [ ] Admin panel açılıyor
- [ ] Talent panel açılıyor
- [ ] Mobile Expo açılıyor
- [ ] Demo script hazır
- [ ] One-pager hazır
- [ ] Staging URL varsa doğrulandı
- [ ] Fallback lokal demo hazır
- [ ] İnternet yoksa ekran görüntüsü/video yedeği hazır

---

## 14. Demo Fallback Planı

Yatırımcı görüşmesinde internet, DB veya API sorunu olabilir. Bu yüzden fallback plan hazırla.

Yeni dosya:

```txt
docs/investor-demo/fallback-plan.md
```

İçerik:
1. Lokal demo komutları
2. Staging çalışmazsa lokal çalıştırma
3. API çalışmazsa hangi ekranlar gösterilebilir?
4. Mobile çalışmazsa web üzerinden tüm akış nasıl gösterilir?
5. Kamera izni çalışmazsa mock placeholder nasıl açıklanır?
6. Önceden ekran görüntüsü/video alınması önerisi

Eğer zaman varsa `docs/investor-demo/screenshots/` için placeholder klasör ve README ekle.

---

## 15. Demo Data’yı Daha İyi Hale Getir

Seed verilerini yatırımcı sunumu için daha gerçekçi yap.

Talent örnekleri:
1. Oyuncu — “Dizi oyuncusu ve kamera önü kariyer mentorluğu”
2. Müzisyen — “Şarkı yorumlama ve sahne deneyimi”
3. Diyetisyen — “15 dakikalık hızlı beslenme danışmanlığı”
4. Girişim Mentoru — “Startup fikri validasyonu”
5. E-spor Koçu — “Performans ve strateji analizi”
6. Marka Danışmanı — “Kişisel marka ve sosyal medya stratejisi”

Her talent:
- kısa bio
- kategori
- fiyat
- avatar placeholder
- 15/30 dk slot
- önümüzdeki 2-3 gün için availability

Demo booking:
- kullanıcı ve talent arasında confirmed
- call room’a girmeye uygun
- sunum sırasında kolay bulunabilir

---

## 16. Error Boundary ve Demo Güvenliği

Web tarafında kritik route’lar için error boundary veya kullanıcı dostu hata durumları olsun.

Özellikle:
- `/demo`
- `/talents`
- `/talents/[slug]`
- `/bookings`
- `/bookings/[id]`
- `/call/[bookingId]`
- `/admin/dashboard`
- `/talent/dashboard`

Hata mesajı:
```txt
Bu demo ekranı yüklenemedi. API bağlantısını ve demo seed verisini kontrol edin.
```

Stack trace göstermeyin.

---

## 17. Observability Basitliği

Production monitoring kurmak şart değil ama demo için basit görünürlük ekle:

API health:
```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "db": "ok",
  "version": "0.2.0-investor-demo",
  "timestamp": "..."
}
```

Web footer veya `/demo` sayfasında:
- App version
- API health status
- Demo mode active badge

Package version veya env:
```env
APP_VERSION=0.2.0-investor-demo
NEXT_PUBLIC_APP_VERSION=0.2.0-investor-demo
```

---

## 18. Testleri Güncelle

Mevcut testleri bozma.

Çalışması gerekenler:

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

E2E test içine `/demo` sayfası kontrolü ekle:
- `/demo` açılıyor
- demo user button görünür
- admin/talent/user kartları görünür

Smoke test içine health version kontrolü eklenebilir.

---

## 19. Git ve Tag

Tüm işler bitince:

```bash
git status --short
git add .
git commit -m "prepare investor demo build"
git tag -a v0.2.0-investor-demo -m "Investor demo ready build"
```

Push izni varsa:
```bash
git push origin main
git push origin v0.2.0-investor-demo
```

Push yapmadan önce remote kontrol et:

```bash
git remote -v
```

---

## 20. Kabul Kriterleri

Bu görev tamamlandı demek için:

- [ ] Landing yatırımcıya gösterilebilir kalitede.
- [ ] `/demo` sayfası var.
- [ ] Demo login butonları çalışıyor.
- [ ] User demo akışı çalışıyor.
- [ ] Talent panel demo edilebilir.
- [ ] Admin panel demo edilebilir.
- [ ] Web call room demo edilebilir.
- [ ] Mobile booking flow korunmuş ve README’de anlatılmış.
- [ ] API health version ve db status gösteriyor.
- [ ] Investor demo script hazır.
- [ ] One-pager hazır.
- [ ] Investor checklist hazır.
- [ ] Fallback plan hazır.
- [ ] Staging deploy dokümanı hazır.
- [ ] Eğer deploy credentials varsa staging deploy yapılmış.
- [ ] Test/build/lint/smoke/e2e geçiyor.
- [ ] Commit alınmış.
- [ ] Tag oluşturulmuş.
- [ ] Çalışma ağacı temiz.

---

## 21. Final Rapor Formatı

Görev sonunda sadece şu formatta rapor ver:

```md
## Nereden Başladık
- Önceki tag: v0.1.0-prototype
- Önceki commit: 015eaac
- Hedef: yatırımcıya gösterilebilir demo-ready sürüm

## Tamamlananlar
- ...

## Demo Akışı
- Landing:
- Demo merkezi:
- User flow:
- Call room:
- Talent panel:
- Admin panel:
- Mobile:
- Fallback:

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

## Demo URL’leri
- Web:
- Demo:
- API Health:
- Admin:
- User Bookings:
- Talent Dashboard:
- Demo Call Room:
- Staging Web, varsa:
- Staging API, varsa:

## Demo Hesapları
- Admin: admin@unluapp.local / Password123!
- Kullanıcı: demo@unluapp.local / Password123!
- Uzman: talent@unluapp.local / Password123!

## Investor Dokümanları
- docs/investor-demo/demo-script.md
- docs/investor-demo/one-pager.md
- docs/investor-demo/checklist.md
- docs/investor-demo/fallback-plan.md
- docs/deployment/staging.md

## Commit ve Tag
- Commit:
- Tag: v0.2.0-investor-demo
- Push durumu:

## Kalan Riskler
- ...
```

---

## 22. Önemli Not

Bu görevde en kritik şey yatırımcı demosunda akışın bozulmaması.

Öncelik:
1. Demo akışı
2. Görsel güven
3. Admin/talent/user hikayesi
4. Teknik hazırlık
5. Dokümantasyon
6. Deploy hazırlığı

Gerçek Agora, gerçek iyzico, native mobile video, production KVKK ve moderasyon bu fazın kapsamı değildir. Bunlar yatırımcıya “next milestones” olarak anlatılmalıdır.
