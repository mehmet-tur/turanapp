import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '../common/auth.decorators';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AvailabilityRuleDto, TalentApplyDto } from './dto';
import { TalentsService } from './talents.service';

@ApiTags('talents')
@Controller('talents')
export class TalentsController {
  constructor(private readonly talentsService: TalentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  apply(@CurrentUser() user: any, @Body() dto: TalentApplyDto) {
    return this.talentsService.apply(user.sub, dto);
  }

  @Public()
  @Get()
  list(@Query() query: Record<string, string>) {
    return this.talentsService.listPublic(query);
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.talentsService.detail(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/availability-rules')
  createAvailabilityRule(@CurrentUser() user: any, @Body() dto: AvailabilityRuleDto) {
    return this.talentsService.createAvailabilityRule(user, dto);
  }

  @Public()
  @Get(':talentId/slots')
  getSlots(
    @Param('talentId') talentId: string,
    @Query('sessionTypeId') sessionTypeId: string,
    @Query('from') from: string,
    @Query('until') until: string,
    @Query('timezone') timezone = 'Europe/Istanbul',
  ) {
    return this.talentsService.getSlots(talentId, sessionTypeId, from, until, timezone);
  }
}
