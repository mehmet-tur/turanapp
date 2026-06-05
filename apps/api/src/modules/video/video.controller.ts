import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/auth.decorators';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { VideoService } from './video.service';

@ApiTags('video')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('bookings/:bookingId/token')
  createToken(@Param('bookingId') bookingId: string, @CurrentUser() user: any) {
    return this.videoService.getToken(bookingId, user);
  }
}
