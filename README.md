# Celebrity Call Platform

## Gereksinimler
- Node.js LTS
- pnpm
- Docker

## Kurulum
```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm api:dev
pnpm web:dev
pnpm mobile:dev
```

## URL'ler
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/docs
- Web: http://localhost:3000
- Mailpit: http://localhost:8025

## Seed Hesapları
- `admin@example.com` / `Admin123!ChangeMe`
- `customer@example.com` / `Customer123!ChangeMe`
- `talent@example.com` / `Talent123!ChangeMe`

## Proje Yapısı
- `apps/api`: NestJS API, Prisma, testler
- `apps/web`: Next.js landing ve admin paneli
- `apps/mobile`: Expo mobil iskeleti
- `packages/shared`: Ortak tipler, sabitler ve şemalar
- `docs`: mimari, API sözleşmesi ve ertelenen işler

## Faz 1 Kapsamı
- Kimlik doğrulama ve rol sistemi
- Uzman başvurusu, onayı ve listeleme
- Müsaitlik kuralları ve slot üretimi
- Mock ödeme ve mock video akışları
- Admin paneli ve mobil rezervasyon akışı

## Faz 2'ye Ertelenenler
Bkz. `docs/deferred.md`
