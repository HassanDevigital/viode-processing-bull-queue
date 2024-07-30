// src/video/video.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class VideoService {
 
  constructor(@InjectQueue('video-queue') private readonly videoQueue: Queue) {}

  async processVideo(videoData: any) {
    await this.videoQueue.add('validate-video', videoData);

    // TODO:in case of multiple queues
    // await this.videoQueue.add('transcode-video', videoData);
    // await this.videoQueue.add('generate-thumbnails', videoData);
    // await this.videoQueue.add('create-metadata', videoData);
    // await this.videoQueue.add('store-files', videoData);
    // await this.videoQueue.add('notify-user', videoData);
  }
}
