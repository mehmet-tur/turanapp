import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../common/auth.decorators';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get('summary')
  summary() {
    return this.adminService.summary();
  }

  @Get('talents')
  talents() {
    return this.adminService.listPendingTalents();
  }

  @Get('talents/pending')
  pendingTalents() {
    return this.adminService.listOnlyPendingTalents();
  }

  @Post('talents/:id/approve')
  approve(@CurrentUser() user: any, @Param('id') id: string) {
    return this.adminService.reviewTalent(user.sub, id, { decision: 'APPROVE' });
  }

  @Post('talents/:id/reject')
  reject(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { reason?: string }) {
    return this.adminService.reviewTalent(user.sub, id, { decision: 'REJECT', reason: dto.reason });
  }

  @Post('talents/:id/review')
  review(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { decision: 'APPROVE' | 'REJECT'; reason?: string }) {
    return this.adminService.reviewTalent(user.sub, id, dto);
  }

  @Get('bookings')
  bookings() {
    return this.adminService.listBookings();
  }

  @Post('bookings/:id/status')
  setBookingStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.adminService.setBookingStatus(id, dto.status);
  }

  @Get('users')
  users() {
    return this.adminService.listUsers();
  }
}
