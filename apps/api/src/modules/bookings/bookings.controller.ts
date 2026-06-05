import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/auth.decorators';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { BookingCreateDto, BookingQuoteDto, CancelBookingDto } from './dto';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('quote')
  quote(@CurrentUser() user: any, @Body() dto: BookingQuoteDto) {
    return this.bookingsService.quote(user.sub, dto);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: BookingCreateDto, @Req() req: Record<string, any>) {
    return this.bookingsService.create(user, dto, { ipAddress: req.ip, userAgent: req.headers['user-agent'] });
  }

  @Get('my')
  listMyBookings(@CurrentUser() user: any, @Query('status') status?: any) {
    return this.bookingsService.listMyBookings(user, status);
  }

  @Get(':id')
  detail(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingsService.detail(user, id);
  }

  @Post(':id/cancel')
  cancel(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.bookingsService.cancel(user, id, dto);
  }

  @Post(':id/complete')
  complete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingsService.complete(user, id);
  }
}
