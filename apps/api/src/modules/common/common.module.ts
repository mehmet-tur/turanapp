import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuditService } from './audit.service';
import { PasswordService } from './password.service';
import { PermissionsService } from './permissions.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [PrismaService, AuditService, PasswordService, PermissionsService],
  exports: [PrismaService, AuditService, PasswordService, PermissionsService, JwtModule],
})
export class CommonModule {}
