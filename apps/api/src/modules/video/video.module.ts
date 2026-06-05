import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { AgoraVideoProvider, MockVideoProvider } from './video.providers';

@Module({
  controllers: [VideoController],
  providers: [VideoService, MockVideoProvider, AgoraVideoProvider],
  exports: [MockVideoProvider],
})
export class VideoModule {}
