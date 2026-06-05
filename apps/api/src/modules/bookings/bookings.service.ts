import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, ConsentType, PaymentProvider, PaymentStatus } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { addMinutes, overlaps } from '../common/date.utils';
import { PermissionsService } from '../common/permissions.service';
import { PrismaService } from '../common/prisma.service';
import { MockPaymentProvider } from '../payments/payment.providers';
import { MockVideoProvider } from '../video/video.providers';
import { BookingCreateDto, BookingQuoteDto, CancelBookingDto } from './dto';

const BLOCKING_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.PAYMENT_PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.READY,
  BookingStatus.IN_PROGRESS,
  BookingStatus.COMPLETED,
  BookingStatus.SETTLEMENT_PENDING,
  BookingStatus.SETTLED,
];

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly permissions: PermissionsService,
    private readonly paymentProvider: MockPaymentProvider,
    private readonly videoProvider: MockVideoProvider,
  ) {}

  async quote(userId: string, dto: BookingQuoteDto) {
    const data = await this.validateBookingInput(userId, dto);
    const quote = this.toQuote(data);
    return {
      talentSlug: data.talent.slug,
      startsAt: quote.startsAt,
      endsAt: quote.endsAt,
      durationMinutes: data.sessionType.durationMinutes,
      priceCents: quote.priceMinor,
      currency: quote.currency,
      platformFeeCents: quote.platformFeeMinor,
      talentPayoutCents: quote.talentPayoutMinor,
      commissionBps: quote.commissionBps,
    };
  }

  async create(user: any, dto: BookingCreateDto, meta: { ipAddress?: string; userAgent?: string }) {
    if (!dto.acceptedCameraAudioConsent) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Kamera/ses işleme onayı zorunludur.' });
    }
    const data = await this.validateBookingInput(user.sub, dto);
    const quote = this.toQuote(data);
    return this.prisma.$transaction(async (tx) => {
      const conflicting = await tx.booking.findFirst({
        where: {
          talentId: data.talent.id,
          status: { in: [...BLOCKING_BOOKING_STATUSES] as BookingStatus[] },
          startsAt: { lt: data.endsAt },
          endsAt: { gt: data.startsAt },
        },
      });
      if (conflicting) {
        throw new BadRequestException({ code: 'BOOKING_SLOT_UNAVAILABLE', message: 'Seçilen saat artık müsait değil.' });
      }
      const booking = await tx.booking.create({
        data: {
          customerId: user.sub,
          talentId: data.talent.id,
          sessionTypeId: data.sessionType.id,
          status: BookingStatus.PAYMENT_PENDING,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          customerNote: dto.notes,
          priceMinor: quote.priceMinor,
          currency: quote.currency,
          platformFeeMinor: quote.platformFeeMinor,
          talentPayoutMinor: quote.talentPayoutMinor,
        },
      });
      await tx.consentLog.create({
        data: {
          userId: user.sub,
          type: ConsentType.CAMERA_AUDIO_PROCESSING,
          version: '2026-06-05',
          accepted: true,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          metadata: { bookingId: booking.id },
        },
      });
      const paymentIntent = await tx.paymentIntent.create({
        data: {
          bookingId: booking.id,
          provider: PaymentProvider.MOCK,
          amountMinor: quote.priceMinor,
          currency: quote.currency,
          platformFeeMinor: quote.platformFeeMinor,
          talentPayoutMinor: quote.talentPayoutMinor,
        },
      });
      const auth = await this.paymentProvider.authorize({
        bookingId: booking.id,
        customerId: user.sub,
        amountMinor: quote.priceMinor,
        currency: quote.currency,
        platformFeeMinor: quote.platformFeeMinor,
        talentPayoutMinor: quote.talentPayoutMinor,
      });
      await this.paymentProvider.capture({
        paymentIntentId: paymentIntent.id,
        providerReference: auth.providerReference,
        amountMinor: quote.priceMinor,
      });
      await tx.paymentIntent.update({
        where: { id: paymentIntent.id },
        data: {
          status: PaymentStatus.CAPTURED,
          providerReference: auth.providerReference,
          rawProviderResponse: auth.rawProviderResponse as any,
          authorizedAt: new Date(),
          capturedAt: new Date(),
        },
      });
      const room = await this.videoProvider.createSession({
        bookingId: booking.id,
        talentId: data.talent.id,
        userId: user.sub,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      });
      const videoRoom = await tx.videoRoom.create({
        data: {
          bookingId: booking.id,
          provider: room.provider as any,
          channelName: room.roomId,
          providerRoomId: room.roomId,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          recordingEnabled: false,
        },
      });
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          videoJoinToken: room.userJoinToken,
        },
      });
      await this.auditService.log({ actorUserId: user.sub, action: 'BOOKING_CREATED', entityType: 'Booking', entityId: booking.id });
      await this.auditService.log({ actorUserId: user.sub, action: 'PAYMENT_AUTHORIZED', entityType: 'PaymentIntent', entityId: paymentIntent.id });
      return {
        id: updated.id,
        status: updated.status,
        startsAt: updated.startsAt,
        endsAt: updated.endsAt,
        priceCents: updated.priceMinor,
        currency: updated.currency,
        platformFeeCents: updated.platformFeeMinor,
        talentPayoutCents: updated.talentPayoutMinor,
        videoRoomId: videoRoom.providerRoomId,
        videoJoinToken: room.userJoinToken,
      };
    });
  }

  async listMyBookings(user: any, status?: BookingStatus) {
    const items = await this.prisma.booking.findMany({
      where: { customerId: user.sub, ...(status ? { status } : {}) },
      include: {
        talent: true,
        sessionType: true,
      },
      orderBy: { startsAt: 'asc' },
    });
    return {
      items: items.map((item) => ({
        id: item.id,
        status: item.status,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        talent: { displayName: item.talent.publicName, slug: item.talent.slug },
        sessionType: { title: item.sessionType.title },
      })),
    };
  }

  async detail(user: any, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        talent: { include: { managers: true } },
        sessionType: true,
        payment: true,
        videoRoom: true,
      },
    });
    if (!booking) throw new NotFoundException();
    if (!this.permissions.canAccessBooking({ id: user.sub, roles: user.roles }, booking)) {
      throw new ForbiddenException();
    }
    return {
      id: booking.id,
      status: booking.status,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      notes: booking.customerNote,
      priceCents: booking.priceMinor,
      currency: booking.currency,
      platformFeeCents: booking.platformFeeMinor,
      talentPayoutCents: booking.talentPayoutMinor,
      videoRoomId: booking.videoRoom?.providerRoomId ?? booking.videoRoom?.channelName ?? null,
      videoJoinToken: booking.videoJoinToken,
      talent: { slug: booking.talent.slug, displayName: booking.talent.publicName },
    };
  }

  async cancel(user: any, bookingId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, talent: { include: { managers: true } } },
    });
    if (!booking || !booking.payment) throw new NotFoundException();
    if (!this.permissions.canAccessBooking({ id: user.sub, roles: user.roles }, booking)) {
      throw new ForbiddenException();
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Bu durumda iptal desteklenmiyor.' });
    }
    await this.paymentProvider.refund({
      paymentIntentId: booking.payment.id,
      providerReference: booking.payment.providerReference ?? undefined,
      amountMinor: booking.payment.amountMinor,
      reason: dto.reason,
    });
    await this.prisma.paymentIntent.update({
      where: { id: booking.payment.id },
      data: { status: PaymentStatus.REFUNDED, refundedAt: new Date() },
    });
    const status = booking.customerId === user.sub ? BookingStatus.CANCELLED_BY_CUSTOMER : BookingStatus.CANCELLED_BY_TALENT;
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.REFUNDED, cancelledAt: new Date(), cancellationReason: dto.reason ?? null },
    });
    await this.auditService.log({
      actorUserId: user.sub,
      action: 'BOOKING_CANCELLED',
      entityType: 'Booking',
      entityId: bookingId,
      metadata: { cancellationStatus: status },
    });
    await this.auditService.log({ actorUserId: user.sub, action: 'PAYMENT_REFUNDED', entityType: 'PaymentIntent', entityId: booking.payment.id });
    return updated;
  }

  async complete(user: any, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { talent: { include: { managers: true } } },
    });
    if (!booking) throw new NotFoundException();
    if (!this.permissions.canAccessBooking({ id: user.sub, roles: user.roles }, booking)) {
      throw new ForbiddenException();
    }
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.COMPLETED, completedAt: new Date() },
    });
  }

  async start(user: any, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { talent: { include: { managers: true } }, videoRoom: true },
    });
    if (!booking) throw new NotFoundException();
    if (!this.permissions.canAccessBooking({ id: user.sub, roles: user.roles }, booking)) {
      throw new ForbiddenException();
    }
    const updated =
      booking.status === BookingStatus.CONFIRMED
        ? await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.IN_PROGRESS },
          })
        : booking;
    return {
      bookingId: updated.id,
      status: updated.status,
      video: {
        provider: 'MOCK',
        channelName: booking.videoRoom?.channelName ?? `booking_${bookingId}`,
        token: updated.videoJoinToken ?? `mock-user-token-${bookingId}`,
        uid: user.sub,
        expiresAt: updated.endsAt,
      },
    };
  }

  private async validateBookingInput(userId: string, dto: BookingQuoteDto) {
    const talent = await this.prisma.talentProfile.findFirst({
      where: { slug: dto.talentSlug },
      include: {
        user: true,
        availabilityWindows: { where: { isActive: true } },
        bookings: { where: { status: { in: [...BLOCKING_BOOKING_STATUSES] as BookingStatus[] } } },
        sessionTypes: { where: { isActive: true, durationMinutes: dto.durationMinutes }, orderBy: { priceMinor: 'asc' }, take: 1 },
      },
    });
    if (!talent) throw new NotFoundException();
    if (talent.status !== 'APPROVED') throw new BadRequestException({ code: 'TALENT_NOT_APPROVED', message: 'Uzman henüz onaylı değil.' });
    if (talent.userId === userId) throw new BadRequestException({ code: 'FORBIDDEN', message: 'Kendi profilinize rezervasyon oluşturamazsınız.' });
    const sessionType = talent.sessionTypes[0];
    if (!sessionType) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Görüşme tipi aktif değil.' });
    const startsAt = new Date(dto.startsAt);
    if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Geçmiş tarih seçilemez.' });
    }
    const noticeLimit = new Date(Date.now() + talent.minimumNoticeHours * 60 * 60 * 1000);
    if (startsAt < noticeLimit) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Minimum bildirim süresi karşılanmıyor.' });
    }
    const endsAt = addMinutes(startsAt, dto.durationMinutes);
    const slotWindow = await this.isSlotAvailable(talent, startsAt, endsAt);
    if (!slotWindow) throw new BadRequestException({ code: 'BOOKING_SLOT_UNAVAILABLE', message: 'Seçilen saat müsait değil.' });
    return { talent, sessionType, startsAt, endsAt };
  }

  private toQuote(data: { talent: any; sessionType: any; startsAt: Date; endsAt: Date }) {
    const commissionBps = data.talent.platformCommissionBps;
    const platformFeeMinor = Math.round((data.sessionType.priceMinor * commissionBps) / 10000);
    const talentPayoutMinor = data.sessionType.priceMinor - platformFeeMinor;
    return {
      talentId: data.talent.id,
      sessionTypeId: data.sessionType.id,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      priceMinor: data.sessionType.priceMinor,
      currency: data.sessionType.currency,
      platformFeeMinor,
      talentPayoutMinor,
      commissionBps,
    };
  }

  private async isSlotAvailable(talent: any, startsAt: Date, endsAt: Date) {
    const hasWindow = talent.availabilityWindows.some((window: any) => startsAt >= window.startsAt && endsAt <= window.endsAt);
    if (!hasWindow) return false;
    if (talent.bookings.some((booking: any) => overlaps(startsAt, endsAt, booking.startsAt, booking.endsAt))) return false;
    return true;
  }
}
