// src/video/video.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoProcessor } from './video.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-queue',
    }),
  ],
  providers: [VideoService, VideoProcessor],
  controllers: [VideoController],
})

export class VideoModule {}
