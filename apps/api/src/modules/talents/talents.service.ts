import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, Prisma, TalentStatus, UserRole } from '@prisma/client';
import slugify from 'slugify';
import { BLOCKING_BOOKING_STATUSES } from '@celebrity-call/shared';
import { addMinutes, overlaps } from '../common/date.utils';
import { AuditService } from '../common/audit.service';
import { PrismaService } from '../common/prisma.service';
import { AvailabilityRuleDto, TalentApplyDto } from './dto';

@Injectable()
export class TalentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async apply(userId: string, dto: TalentApplyDto) {
    const existing = await this.prisma.talentProfile.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException({ code: 'CONFLICT', message: 'Zaten bir uzman profili mevcut.' });
    const slug = await this.makeUniqueSlug(dto.publicName);
    const talent = await this.prisma.talentProfile.create({
      data: {
        userId,
        slug,
        publicName: dto.publicName,
        headline: dto.headline,
        bio: dto.bio,
        segment: dto.segment,
        status: TalentStatus.PENDING_REVIEW,
        categories: {
          create: dto.categoryIds.map((categoryId) => ({ categoryId })),
        },
        sessionTypes: {
          create: dto.sessionTypes,
        },
      },
    });
    await this.auditService.log({ actorUserId: userId, action: 'TALENT_APPLIED', entityType: 'TalentProfile', entityId: talent.id });
    return { id: talent.id, status: talent.status, slug: talent.slug };
  }

  async listPublic(query: { segment?: string; category?: string; page?: number; pageSize?: number }) {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    const where: Prisma.TalentProfileWhereInput = {
      status: TalentStatus.APPROVED,
      ...(query.segment ? { segment: query.segment as any } : {}),
      ...(query.category
        ? {
            categories: {
              some: {
                category: {
                  slug: query.category,
                },
              },
            },
          }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.talentProfile.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          categories: { include: { category: true } },
          sessionTypes: { where: { isActive: true }, orderBy: { priceMinor: 'asc' }, take: 1 },
        },
        orderBy: [{ isFeatured: 'desc' }, { approvedAt: 'desc' }],
      }),
      this.prisma.talentProfile.count({ where }),
    ]);
    return {
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        displayName: item.publicName,
        title: item.headline,
        category: item.categories[0]?.category.name ?? null,
        segment: item.segment,
        avatarUrl: item.profileImageUrl,
        isFeatured: item.isFeatured,
        priceCents: item.sessionTypes[0]?.priceMinor ?? 0,
        currency: item.sessionTypes[0]?.currency ?? 'TRY',
        categories: item.categories.map(({ category }) => ({ name: category.name, slug: category.slug })),
      })),
      pagination: { page, pageSize, total },
    };
  }

  async featured() {
    const items = await this.prisma.talentProfile.findMany({
      where: { status: TalentStatus.APPROVED, isFeatured: true },
      include: {
        categories: { include: { category: true } },
        sessionTypes: { where: { isActive: true }, orderBy: { priceMinor: 'asc' }, take: 1 },
      },
      orderBy: [{ approvedAt: 'desc' }],
    });
    return {
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        displayName: item.publicName,
        title: item.headline,
        category: item.categories[0]?.category.name ?? null,
        priceCents: item.sessionTypes[0]?.priceMinor ?? 0,
        currency: item.sessionTypes[0]?.currency ?? 'TRY',
        avatarUrl: item.profileImageUrl,
        isFeatured: item.isFeatured,
      })),
    };
  }

  async detail(slug: string) {
    const talent = await this.prisma.talentProfile.findFirst({
      where: { slug, status: TalentStatus.APPROVED },
      include: {
        categories: { include: { category: true } },
        sessionTypes: { where: { isActive: true }, orderBy: { durationMinutes: 'asc' } },
      },
    });
    if (!talent) throw new NotFoundException();
    return {
      id: talent.id,
      slug: talent.slug,
      displayName: talent.publicName,
      title: talent.headline,
      bio: talent.bio,
      category: talent.categories[0]?.category.name ?? null,
      segment: talent.segment,
      avatarUrl: talent.profileImageUrl,
      coverUrl: talent.coverImageUrl,
      priceCents: talent.sessionTypes[0]?.priceMinor ?? 0,
      currency: talent.sessionTypes[0]?.currency ?? 'TRY',
      categories: talent.categories.map(({ category }) => ({ id: category.id, name: category.name, slug: category.slug })),
      sessionTypes: talent.sessionTypes.map((sessionType) => ({
        id: sessionType.id,
        title: sessionType.title,
        durationMinutes: sessionType.durationMinutes,
        priceCents: sessionType.priceMinor,
        currency: sessionType.currency,
      })),
    };
  }

  async createAvailabilityRule(user: { sub: string; roles: UserRole[]; talentProfile?: { id: string } | null }, dto: AvailabilityRuleDto) {
    if (!user.roles.includes(UserRole.TALENT) || !user.talentProfile?.id) {
      throw new ForbiddenException('Sadece uzman kullanıcılar müsaitlik ekleyebilir.');
    }
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Başlangıç saati bitişten önce olmalıdır.' });
    }
    const duration = this.toMinutes(dto.endTime) - this.toMinutes(dto.startTime);
    if (duration < 15) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Müsaitlik penceresi en az 15 dakika olmalıdır.' });

    const rule = await this.prisma.availabilityRule.create({
      data: {
        talentId: user.talentProfile.id,
        weekday: dto.weekday,
        startTime: dto.startTime,
        endTime: dto.endTime,
        timezone: dto.timezone,
      },
    });
    await this.auditService.log({ actorUserId: user.sub, action: 'AVAILABILITY_RULE_CREATED', entityType: 'AvailabilityRule', entityId: rule.id });
    return rule;
  }

  async getSlotsBySlug(slug: string, from?: string, to?: string) {
    const talent = await this.prisma.talentProfile.findFirst({
      where: { slug },
      include: {
        availabilityWindows: { where: { isActive: true } },
        bookings: { where: { status: { in: [...BLOCKING_BOOKING_STATUSES] as BookingStatus[] } } },
        sessionTypes: { where: { isActive: true }, orderBy: { priceMinor: 'asc' }, take: 1 },
      },
    });
    if (!talent) throw new NotFoundException();
    if (talent.status !== TalentStatus.APPROVED) throw new BadRequestException({ code: 'TALENT_NOT_APPROVED', message: 'Uzman henüz yayında değil.' });
    const sessionType = talent.sessionTypes[0];
    if (!sessionType) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Aktif görüşme tipi bulunamadı.' });
    const fromDate = from ? new Date(`${from}T00:00:00.000Z`) : new Date();
    const toDate = to ? new Date(`${to}T23:59:59.999Z`) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const slots: Array<Record<string, unknown>> = [];
    for (const window of talent.availabilityWindows) {
      if (window.endsAt < fromDate || window.startsAt > toDate) continue;
      for (let cursor = new Date(window.startsAt); addMinutes(cursor, window.slotDurationMinutes) <= window.endsAt; cursor = addMinutes(cursor, window.slotDurationMinutes + window.bufferMinutes)) {
        const slotEnd = addMinutes(cursor, window.slotDurationMinutes);
        if (cursor < new Date()) continue;
        if (talent.bookings.some((booking) => overlaps(cursor, slotEnd, booking.startsAt, booking.endsAt))) continue;
        slots.push({
          startsAt: cursor.toISOString(),
          endsAt: slotEnd.toISOString(),
          durationMinutes: window.slotDurationMinutes,
          priceCents: sessionType.priceMinor,
          currency: sessionType.currency,
        });
      }
    }
    slots.sort((a, b) => String(a.startsAt).localeCompare(String(b.startsAt)));
    return { items: slots };
  }

  private async makeUniqueSlug(input: string) {
    const baseSlug = slugify(input, { lower: true, strict: true, locale: 'tr' });
    let candidate = baseSlug;
    let counter = 1;
    while (await this.prisma.talentProfile.findUnique({ where: { slug: candidate } })) {
      candidate = `${baseSlug}-${counter++}`;
    }
    return candidate;
  }

  private toMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
