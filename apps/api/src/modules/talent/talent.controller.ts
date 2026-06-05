import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../common/auth.decorators';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { TalentService } from './talent.service';

@ApiTags('talent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TALENT')
@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get('bookings')
  bookings(@CurrentUser() user: any) {
    return this.talentService.getBookings(user);
  }

  @Get('summary')
  summary(@CurrentUser() user: any) {
    return this.talentService.getSummary(user);
  }
}
