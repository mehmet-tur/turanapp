import { PrismaClient, TalentSegment, TalentStatus, UserRole, BookingStatus, PaymentProvider, PaymentStatus, VideoProvider } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
const pepper = process.env.PASSWORD_PEPPER ?? '';

async function hash(password: string) {
  return argon2.hash(`${password}${pepper}`);
}

function addDays(base: Date, days: number, hour: number, minute: number) {
  const date = new Date(base);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

async function upsertUser(input: { email: string; firstName: string; lastName: string; roles: UserRole[] }) {
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: `${input.firstName} ${input.lastName}`,
      roles: input.roles,
    },
    create: {
      email: input.email,
      passwordHash: await hash('Password123!'),
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: `${input.firstName} ${input.lastName}`,
      roles: input.roles,
    },
  });
}

async function replaceAvailabilityWindows(talentId: string, starts: Array<{ startsAt: Date; endsAt: Date }>) {
  await prisma.availabilityWindow.deleteMany({ where: { talentId } });
  for (const item of starts) {
    await prisma.availabilityWindow.create({
      data: {
        talentId,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        slotDurationMinutes: 15,
        bufferMinutes: 0,
        isActive: true,
      },
    });
  }
}

async function main() {
  const categories = [
    ['Eğlence', 'eglence'],
    ['İş ve Girişimcilik', 'is-ve-girisimcilik'],
    ['Sağlık ve Yaşam', 'saglik-ve-yasam'],
  ];

  for (const [index, [name, slug]] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug },
      update: { name, sortOrder: index },
      create: { name, slug, sortOrder: index },
    });
  }

  const admin = await upsertUser({ email: 'admin@unluapp.local', firstName: 'Admin', lastName: 'Kullanıcı', roles: [UserRole.CUSTOMER, UserRole.ADMIN] });
  const demoUser = await upsertUser({ email: 'demo@unluapp.local', firstName: 'Demo', lastName: 'User', roles: [UserRole.CUSTOMER] });
  const ayseUser = await upsertUser({ email: 'talent@unluapp.local', firstName: 'Ayşe', lastName: 'Yıldız', roles: [UserRole.CUSTOMER, UserRole.TALENT] });
  const mertUser = await upsertUser({ email: 'mert-kaya@unluapp.local', firstName: 'Mert', lastName: 'Kaya', roles: [UserRole.CUSTOMER, UserRole.TALENT] });
  const zeynepUser = await upsertUser({ email: 'zeynep-demir@unluapp.local', firstName: 'Zeynep', lastName: 'Demir', roles: [UserRole.CUSTOMER, UserRole.TALENT] });
  const burakUser = await upsertUser({ email: 'burak-can@unluapp.local', firstName: 'Burak', lastName: 'Can', roles: [UserRole.CUSTOMER, UserRole.TALENT] });
  const selinUser = await upsertUser({ email: 'selin-aran@unluapp.local', firstName: 'Selin', lastName: 'Aran', roles: [UserRole.CUSTOMER, UserRole.TALENT] });
  const ozanUser = await upsertUser({ email: 'ozan-turk@unluapp.local', firstName: 'Ozan', lastName: 'Türk', roles: [UserRole.CUSTOMER, UserRole.TALENT] });
  const pendingUser = await upsertUser({ email: 'pending@unluapp.local', firstName: 'Bekleyen', lastName: 'Uzman', roles: [UserRole.CUSTOMER] });

  const eglence = await prisma.category.findUniqueOrThrow({ where: { slug: 'eglence' } });
  const girisim = await prisma.category.findUniqueOrThrow({ where: { slug: 'is-ve-girisimcilik' } });
  const saglik = await prisma.category.findUniqueOrThrow({ where: { slug: 'saglik-ve-yasam' } });

  const talents = [
    {
      user: ayseUser,
      slug: 'ayse-yildiz',
      publicName: 'Ayşe Yıldız',
      headline: 'Oyuncu ve Yaratıcı Drama Eğitmeni',
      bio: 'Kamera önü deneyimi, oyunculuk ve yaratıcı drama üzerine bire bir görüşmeler sunar.',
      categoryId: eglence.id,
      segment: TalentSegment.ENTERTAINMENT,
      priceMinor: 250000,
      featured: true,
    },
    {
      user: mertUser,
      slug: 'mert-kaya',
      publicName: 'Mert Kaya',
      headline: 'Girişimci ve Melek Yatırımcı',
      bio: 'Erken aşama girişimler, yatırım hazırlığı ve ürün stratejisi üzerine destek verir.',
      categoryId: girisim.id,
      segment: TalentSegment.EXPERTISE,
      priceMinor: 500000,
      featured: true,
    },
    {
      user: zeynepUser,
      slug: 'zeynep-demir',
      publicName: 'Zeynep Demir',
      headline: 'Beslenme Uzmanı ve İçerik Üreticisi',
      bio: 'Sürdürülebilir beslenme alışkanlıkları ve içerik stratejisi konularında bire bir görüşme sunar.',
      categoryId: saglik.id,
      segment: TalentSegment.EXPERTISE,
      priceMinor: 150000,
      featured: false,
    },
    {
      user: burakUser,
      slug: 'burak-can',
      publicName: 'Burak Can',
      headline: 'Müzisyen ve Prodüktör',
      bio: 'Müzik üretimi, sahne disiplini ve içerik kurgusu üzerine görüşme sunar.',
      categoryId: eglence.id,
      segment: TalentSegment.ENTERTAINMENT,
      priceMinor: 320000,
      featured: false,
    },
    {
      user: selinUser,
      slug: 'selin-aran',
      publicName: 'Selin Aran',
      headline: 'E-spor Koçu',
      bio: 'Takım içi iletişim, maç analizi ve bireysel performans gelişimi odaklı görüşmeler yapar.',
      categoryId: girisim.id,
      segment: TalentSegment.ENTERTAINMENT,
      priceMinor: 280000,
      featured: false,
    },
    {
      user: ozanUser,
      slug: 'ozan-turk',
      publicName: 'Ozan Türk',
      headline: 'Marka Danışmanı',
      bio: 'Marka konumlandırma, dijital pazarlama ve büyüme stratejileri üzerine bire bir destek verir.',
      categoryId: girisim.id,
      segment: TalentSegment.EXPERTISE,
      priceMinor: 420000,
      featured: false,
    },
  ];

  const now = new Date();
  const talentProfiles = [];
  for (const item of talents) {
    const profile = await prisma.talentProfile.upsert({
      where: { userId: item.user.id },
      update: {
        slug: item.slug,
        publicName: item.publicName,
        headline: item.headline,
        bio: item.bio,
        segment: item.segment,
        status: TalentStatus.APPROVED,
        approvedAt: new Date(),
        isFeatured: item.featured,
        categories: {
          deleteMany: {},
          create: [{ categoryId: item.categoryId }],
        },
      },
      create: {
        userId: item.user.id,
        slug: item.slug,
        publicName: item.publicName,
        headline: item.headline,
        bio: item.bio,
        segment: item.segment,
        status: TalentStatus.APPROVED,
        approvedAt: new Date(),
        isFeatured: item.featured,
        categories: { create: [{ categoryId: item.categoryId }] },
      },
    });

    const existingSessionType = await prisma.sessionType.findFirst({
      where: { talentId: profile.id },
      orderBy: { createdAt: 'asc' },
    });
    if (existingSessionType) {
      await prisma.sessionType.update({
        where: { id: existingSessionType.id },
        data: {
          title: '15 Dakikalık Bire Bir Görüşme',
          durationMinutes: 15,
          priceMinor: item.priceMinor,
          currency: 'TRY',
          isActive: true,
        },
      });
    } else {
      await prisma.sessionType.create({
        data: {
          talentId: profile.id,
          title: '15 Dakikalık Bire Bir Görüşme',
          durationMinutes: 15,
          priceMinor: item.priceMinor,
          currency: 'TRY',
        },
      });
    }

    await replaceAvailabilityWindows(profile.id, [
      { startsAt: addDays(now, 1, 14, 0), endsAt: addDays(now, 1, 16, 0) },
      { startsAt: addDays(now, 3, 10, 0), endsAt: addDays(now, 3, 12, 0) },
    ]);

    talentProfiles.push(profile);
  }

  await prisma.talentProfile.upsert({
    where: { userId: pendingUser.id },
    update: {
      slug: 'bekleyen-uzman',
      publicName: 'Bekleyen Uzman',
      headline: 'Onay bekleyen demo uzman',
      bio: 'Admin onayı bekleyen demo uzman profili.',
      segment: TalentSegment.EXPERTISE,
      status: TalentStatus.PENDING_REVIEW,
      approvedAt: null,
      rejectedReason: null,
      isFeatured: false,
      categories: {
        deleteMany: {},
        create: [{ categoryId: girisim.id }],
      },
    },
    create: {
      userId: pendingUser.id,
      slug: 'bekleyen-uzman',
      publicName: 'Bekleyen Uzman',
      headline: 'Onay bekleyen demo uzman',
      bio: 'Admin onayı bekleyen demo uzman profili.',
      segment: TalentSegment.EXPERTISE,
      status: TalentStatus.PENDING_REVIEW,
      categories: { create: [{ categoryId: girisim.id }] },
    },
  });

  const ayse = talentProfiles[0];
  const sessionType = await prisma.sessionType.findFirstOrThrow({ where: { talentId: ayse.id }, orderBy: { createdAt: 'asc' } });
  const bookingStart = addDays(now, 1, 14, 0);
  const bookingEnd = addDays(now, 1, 14, 15);

  const existingBooking = await prisma.booking.findFirst({
    where: {
      customerId: demoUser.id,
      talentId: ayse.id,
      startsAt: bookingStart,
    },
  });

  if (!existingBooking) {
    const booking = await prisma.booking.create({
      data: {
        customerId: demoUser.id,
        talentId: ayse.id,
        sessionTypeId: sessionType.id,
        status: BookingStatus.CONFIRMED,
        startsAt: bookingStart,
        endsAt: bookingEnd,
        timezone: 'Europe/Istanbul',
        customerNote: 'Demo rezervasyon',
        priceMinor: sessionType.priceMinor,
        currency: sessionType.currency,
        platformFeeMinor: Math.round((sessionType.priceMinor * 1500) / 10000),
        talentPayoutMinor: sessionType.priceMinor - Math.round((sessionType.priceMinor * 1500) / 10000),
        videoJoinToken: 'mock-user-token-seed',
      },
    });

    await prisma.paymentIntent.create({
      data: {
        bookingId: booking.id,
        provider: PaymentProvider.MOCK,
        providerReference: `mock_seed_${booking.id}`,
        amountMinor: booking.priceMinor,
        currency: booking.currency,
        platformFeeMinor: booking.platformFeeMinor,
        talentPayoutMinor: booking.talentPayoutMinor,
        status: PaymentStatus.CAPTURED,
        authorizedAt: new Date(),
        capturedAt: new Date(),
      },
    });

    await prisma.videoRoom.create({
      data: {
        bookingId: booking.id,
        provider: VideoProvider.MOCK,
        channelName: `mock-room-${booking.id}`,
        providerRoomId: `mock-room-${booking.id}`,
        startsAt: booking.startsAt,
        endsAt: booking.endsAt,
      },
    });
  }

  console.log({
    admin: admin.email,
    demoUser: demoUser.email,
    talents: talentProfiles.map((item) => item.slug),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
