import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        service: 'unluapp-api',
        db: 'ok',
        version: process.env.APP_VERSION || '0.2.0-investor-demo',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        service: 'unluapp-api',
        db: 'error',
        version: process.env.APP_VERSION || '0.2.0-investor-demo',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
