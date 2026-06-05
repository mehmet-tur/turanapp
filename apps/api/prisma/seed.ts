import { PrismaClient, TalentSegment, TalentStatus, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
const pepper = process.env.PASSWORD_PEPPER ?? '';

async function hash(password: string) {
  return argon2.hash(`${password}${pepper}`);
}

async function main() {
  const categories = [
    ['Girişimcilik', 'girisimcilik'],
    ['Oyunculuk', 'oyunculuk'],
    ['Müzik', 'muzik'],
    ['Spor', 'spor'],
    ['Fitness', 'fitness'],
    ['Beslenme', 'beslenme'],
    ['Kariyer', 'kariyer'],
    ['Marka Danışmanlığı', 'marka-danismanligi'],
    ['E-spor', 'e-spor'],
  ];

  for (const [index, [name, slug]] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug },
      update: { name, sortOrder: index },
      create: { name, slug, sortOrder: index },
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: await hash('Admin123!ChangeMe'),
      firstName: 'Sistem',
      lastName: 'Yöneticisi',
      roles: [UserRole.CUSTOMER, UserRole.ADMIN],
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: await hash('Customer123!ChangeMe'),
      firstName: 'Müşteri',
      lastName: 'Deneme',
      roles: [UserRole.CUSTOMER],
    },
  });

  const talentUser = await prisma.user.upsert({
    where: { email: 'talent@example.com' },
    update: {},
    create: {
      email: 'talent@example.com',
      passwordHash: await hash('Talent123!ChangeMe'),
      firstName: 'Mehmet',
      lastName: 'Demir',
      roles: [UserRole.CUSTOMER, UserRole.TALENT],
    },
  });

  const entertainmentUser = await prisma.user.upsert({
    where: { email: 'elif@example.com' },
    update: {},
    create: {
      email: 'elif@example.com',
      passwordHash: await hash('Talent123!ChangeMe'),
      firstName: 'Elif',
      lastName: 'Kaya',
      roles: [UserRole.CUSTOMER, UserRole.TALENT],
    },
  });

  const girisimcilik = await prisma.category.findUniqueOrThrow({ where: { slug: 'girisimcilik' } });
  const oyunculuk = await prisma.category.findUniqueOrThrow({ where: { slug: 'oyunculuk' } });

  const mehmet = await prisma.talentProfile.upsert({
    where: { userId: talentUser.id },
    update: { status: TalentStatus.APPROVED },
    create: {
      userId: talentUser.id,
      slug: 'mehmet-demir',
      publicName: 'Mehmet Demir',
      headline: 'Girişimci ve melek yatırımcı',
      bio: '20 yıldır teknoloji girişimleriyle çalışıyor, ürün, büyüme ve yatırım konularında mentorluk veriyor.',
      segment: TalentSegment.EXPERTISE,
      status: TalentStatus.APPROVED,
      approvedAt: new Date(),
      categories: { create: [{ categoryId: girisimcilik.id }] },
      sessionTypes: {
        create: [
          { title: '15 Dakikalık Fikir Doğrulama', durationMinutes: 15, priceMinor: 250000, currency: 'TRY' },
          { title: '30 Dakikalık Strateji Görüşmesi', durationMinutes: 30, priceMinor: 450000, currency: 'TRY' },
        ],
      },
      availabilityRules: {
        create: [
          { weekday: 1, startTime: '14:00', endTime: '17:00', timezone: 'Europe/Istanbul' },
          { weekday: 3, startTime: '10:00', endTime: '12:00', timezone: 'Europe/Istanbul' },
        ],
      },
    },
  });

  await prisma.talentProfile.upsert({
    where: { userId: entertainmentUser.id },
    update: { status: TalentStatus.APPROVED },
    create: {
      userId: entertainmentUser.id,
      slug: 'elif-kaya',
      publicName: 'Elif Kaya',
      headline: 'Oyuncu ve içerik üreticisi',
      bio: 'Oyunculuk, set disiplini ve dijital içerik üretimi üzerine bire bir görüşmeler sunuyor.',
      segment: TalentSegment.ENTERTAINMENT,
      status: TalentStatus.APPROVED,
      approvedAt: new Date(),
      categories: { create: [{ categoryId: oyunculuk.id }] },
      sessionTypes: {
        create: [
          { title: '15 Dakikalık Tanışma', durationMinutes: 15, priceMinor: 300000, currency: 'TRY' },
          { title: '30 Dakikalık Kariyer Sohbeti', durationMinutes: 30, priceMinor: 550000, currency: 'TRY' },
        ],
      },
      availabilityRules: {
        create: [{ weekday: 2, startTime: '18:00', endTime: '20:00', timezone: 'Europe/Istanbul' }],
      },
    },
  });

  console.log({ adminId: admin.id, talentId: mehmet.id });
}

main().finally(async () => prisma.$disconnect());
