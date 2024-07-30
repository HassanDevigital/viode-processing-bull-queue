import { Controller, Post, Body } from '@nestjs/common';
import { TasksService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async addTask(@Body() data: any) {
    console.log('starting')
    await this.tasksService.addJob(data);
    return {
        message:'Response',
        data:data
    };
  }
}
