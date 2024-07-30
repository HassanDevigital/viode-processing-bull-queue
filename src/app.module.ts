import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    VideoModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
