import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TalentStatus, UserRole } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async dashboard() {
    const [users, pendingTalents, approvedTalents, upcomingBookings, mockPaymentTotal] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.talentProfile.count({ where: { status: TalentStatus.PENDING_REVIEW } }),
      this.prisma.talentProfile.count({ where: { status: TalentStatus.APPROVED } }),
      this.prisma.booking.count({ where: { startsAt: { gte: new Date() } } }),
      this.prisma.paymentIntent.aggregate({ _sum: { amountMinor: true } }),
    ]);
    return {
      totalUsers: users,
      pendingTalents,
      approvedTalents,
      upcomingBookings,
      mockPaymentTotalMinor: mockPaymentTotal._sum.amountMinor ?? 0,
    };
  }

  async listPendingTalents() {
    return this.prisma.talentProfile.findMany({
      where: { status: TalentStatus.PENDING_REVIEW },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewTalent(adminId: string, talentId: string, dto: { decision: 'APPROVE' | 'REJECT'; reason?: string }) {
    const talent = await this.prisma.talentProfile.findUnique({ where: { id: talentId } });
    if (!talent) throw new NotFoundException();
    if (dto.decision === 'APPROVE') {
      const updated = await this.prisma.talentProfile.update({
        where: { id: talentId },
        data: { status: TalentStatus.APPROVED, approvedAt: new Date(), rejectedReason: null },
      });
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: talent.userId } });
      await this.prisma.user.update({
        where: { id: talent.userId },
        data: { roles: Array.from(new Set([...user.roles, UserRole.TALENT])) },
      });
      await this.auditService.log({ actorUserId: adminId, action: 'TALENT_APPROVED', entityType: 'TalentProfile', entityId: talentId });
      return updated;
    }
    const updated = await this.prisma.talentProfile.update({
      where: { id: talentId },
      data: { status: TalentStatus.REJECTED, rejectedReason: dto.reason ?? 'Belirtilmedi.' },
    });
    await this.auditService.log({ actorUserId: adminId, action: 'TALENT_REJECTED', entityType: 'TalentProfile', entityId: talentId });
    return updated;
  }

  async listBookings() {
    return this.prisma.booking.findMany({
      include: { talent: true, customer: true },
      orderBy: { startsAt: 'desc' },
    });
  }

  async listUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, roles: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
