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
