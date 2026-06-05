import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConsentType, Prisma, UserRole } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { AuditService } from '../common/audit.service';
import { PasswordService } from '../common/password.service';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: RegisterDto, meta: { ipAddress?: string; userAgent?: string }) {
    const email = dto.email.trim().toLowerCase();
    this.ensureMandatoryConsents(dto.consents);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException({ code: 'CONFLICT', message: 'Bu e-posta zaten kayıtlı.' });

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone,
        roles: [UserRole.CUSTOMER],
        consentLogs: {
          create: dto.consents.map((consent) => ({
            type: consent.type as ConsentType,
            version: consent.version,
            accepted: consent.accepted,
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
          })),
        },
      },
      include: {
        talentProfile: true,
      },
    });
    await this.auditService.log({ actorUserId: user.id, action: 'REGISTER', entityType: 'User', entityId: user.id });
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email }, include: { talentProfile: true } });
    if (!user) {
      await this.auditService.log({ action: 'LOGIN_FAILED', entityType: 'User', metadata: { email } });
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }
    const valid = await this.passwordService.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.auditService.log({ actorUserId: user.id, action: 'LOGIN_FAILED', entityType: 'User', entityId: user.id });
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await this.auditService.log({ actorUserId: user.id, action: 'LOGIN_SUCCESS', entityType: 'User', entityId: user.id });
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const tokenRow = await this.prisma.refreshToken.findFirst({
      where: { userId: payload.sub, revokedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { user: { include: { talentProfile: true } } },
    });
    if (!tokenRow) throw new UnauthorizedException();
    const valid = await this.passwordService.verify(tokenRow.tokenHash, refreshToken);
    if (!valid) throw new UnauthorizedException();

    await this.prisma.refreshToken.update({ where: { id: tokenRow.id }, data: { revokedAt: new Date() } });
    return this.issueTokens(tokenRow.user);
  }

  async logout(userId: string, refreshToken: string) {
    const rows = await this.prisma.refreshToken.findMany({ where: { userId, revokedAt: null } });
    for (const row of rows) {
      const valid = await this.passwordService.verify(row.tokenHash, refreshToken);
      if (valid) {
        await this.prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
      }
    }
    return { success: true };
  }

  private async issueTokens(user: { id: string; email: string; firstName: string; lastName: string; roles: UserRole[]; talentProfile?: any }) {
    const basePayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      talentProfile: user.talentProfile
        ? {
            id: user.talentProfile.id,
            slug: user.talentProfile.slug,
            publicName: user.talentProfile.publicName,
            status: user.talentProfile.status,
          }
        : null,
    };
    const accessToken = await this.jwtService.signAsync(basePayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as any,
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, nonce: randomUUID() },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as any,
      },
    );
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await this.passwordService.hash(refreshToken),
        expiresAt,
      },
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
      accessToken,
      refreshToken,
    };
  }

  private ensureMandatoryConsents(consents: { type: string; accepted: boolean }[]) {
    const consentMap = new Map(consents.map((item) => [item.type, item.accepted]));
    if (!consentMap.get(ConsentType.TERMS_OF_SERVICE) || !consentMap.get(ConsentType.PRIVACY_POLICY)) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Kullanım koşulları ve gizlilik politikası onayı zorunludur.',
      });
    }
  }

  private async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<{ sub: string }>(token, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
