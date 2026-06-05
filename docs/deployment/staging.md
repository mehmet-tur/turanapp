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
