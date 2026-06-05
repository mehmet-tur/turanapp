import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CategoriesModule } from './categories/categories.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { TalentsModule } from './talents/talents.module';
import { VideoModule } from './video/video.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    TalentsModule,
    BookingsModule,
    VideoModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
