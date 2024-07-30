import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TasksProcessor } from './task.processor';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [TasksService, TasksProcessor],
  controllers: [TasksController]
})
export class TasksModule {}
