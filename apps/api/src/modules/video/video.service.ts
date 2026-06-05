import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PermissionsService } from '../common/permissions.service';
import { PrismaService } from '../common/prisma.service';
import { MockVideoProvider } from './video.providers';

@Injectable()
export class VideoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService,
    private readonly provider: MockVideoProvider,
  ) {}

  async getToken(bookingId: string, user: { sub: string; roles: any[] }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        videoRoom: true,
        talent: { include: { managers: true } },
      },
    });
    if (!booking || !booking.videoRoom) throw new NotFoundException();
    if (!this.permissions.canAccessBooking({ id: user.sub, roles: user.roles }, booking)) {
      throw new ForbiddenException();
    }
    const allowedStatuses: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.READY, BookingStatus.IN_PROGRESS];
    if (!allowedStatuses.includes(booking.status)) {
      throw new ForbiddenException('Video erişimi bu rezervasyon için açık değil.');
    }
    if (booking.startsAt.getTime() - Date.now() > 15 * 60 * 1000) {
      throw new ForbiddenException({
        code: 'VIDEO_TOKEN_NOT_ALLOWED_YET',
        message: 'Video token henüz alınamaz.',
      });
    }
    return this.provider.createToken({
      bookingId,
      channelName: booking.videoRoom.channelName,
      userId: user.sub,
      role: 'publisher',
      expiresAt: booking.endsAt,
    });
  }
}
