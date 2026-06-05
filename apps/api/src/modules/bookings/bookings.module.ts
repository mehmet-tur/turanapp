import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { MockPaymentProvider, IyzicoPaymentProvider } from '../payments/payment.providers';
import { MockVideoProvider, AgoraVideoProvider } from '../video/video.providers';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, MockPaymentProvider, IyzicoPaymentProvider, MockVideoProvider, AgoraVideoProvider],
})
export class BookingsModule {}
