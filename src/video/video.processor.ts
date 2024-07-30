// src/video/video.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { join } from 'path';
import { AxiosInstance, AxiosResponse } from 'axios';

@Processor('video-queue')
export class VideoProcessor {
  @Process('validate-video')
  async validateVideo(job: Job<any>) {
    const { videoPath } = job.data;
    console.log('Validating video', videoPath);

    const fileExtension = videoPath.split('.').pop();
    const validFormats = ['mp4', 'avi', 'mkv'];
    const fileSize = fs.statSync(videoPath).size;

    if (!validFormats.includes(fileExtension) || fileSize > 500 * 1024 * 1024) {
      throw new Error('Invalid video format or size');
    }
  }

  @Process('transcode-video')
  async transcodeVideo(job: Job<any>) {
    const { videoPath } = job.data;
    console.log('Transcoding video', videoPath);

    const outputPath = join(__dirname, '../../uploads', 'transcoded.mp4');

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(outputPath)
        .on('end', () => {
          console.log('Transcoding finished');
          resolve(outputPath);
        })
        .on('error', (err) => {
          reject(new Error(`Transcoding error: ${err.message}`));
        })
        .run();
    });
  }

  @Process('generate-thumbnails')
  async generateThumbnails(job: Job<any>) {
    const { videoPath } = job.data;
    console.log('Generating thumbnails', videoPath);

    const outputDir = join(__dirname, '../../uploads/thumbnails');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          count: 3,
          folder: outputDir,
          size: '320x240',
          filename: 'thumbnail-%i.png',
        })
        .on('end', () => {
          console.log('Thumbnails generated');
          resolve(outputDir);
        })
        .on('error', (err) => {
          reject(new Error(`Thumbnail generation error: ${err.message}`));
        });
    });
  }

  @Process('create-metadata')
  async createMetadata(job: Job<any>) {
    const { videoPath } = job.data;
    console.log('Creating metadata', videoPath);

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(new Error(`Metadata creation error: ${err.message}`));
        } else {
          console.log('Metadata created', metadata);
          resolve(metadata);
        }
      });
    });
  }

  @Process('store-files')
  async storeFiles(job: Job<any>) {
    const { videoPath } = job.data;
    console.log('Storing files', videoPath);

    const storagePath = join(__dirname, '../../uploads', 'stored.mp4');
    fs.copyFileSync(videoPath, storagePath);
    console.log('Files stored at', storagePath);
  }

  @Process('notify-user')
  async notifyUser(job: Job<any>) {
    const { userId } = job.data;
    console.log('Notifying user', userId);

    // Simulate user notification
    console.log(`User ${userId} notified that video processing is complete`);
  }
}
