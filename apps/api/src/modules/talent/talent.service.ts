import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TalentService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookings(user: any) {
    if (!user.talentProfile?.id) throw new ForbiddenException();
    return this.prisma.booking.findMany({
      where: { talentId: user.talentProfile.id },
      include: {
        customer: true,
        sessionType: true,
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  async getSummary(user: any) {
    if (!user.talentProfile?.id) throw new ForbiddenException();
    const bookings = await this.prisma.booking.findMany({
      where: { talentId: user.talentProfile.id },
    });
    return {
      upcoming: bookings.filter((item) => ['CONFIRMED', 'IN_PROGRESS'].includes(item.status)).length,
      completed: bookings.filter((item) => item.status === 'COMPLETED').length,
      today: bookings.filter((item) => new Date(item.startsAt).toDateString() === new Date().toDateString()).length,
    };
  }
}
