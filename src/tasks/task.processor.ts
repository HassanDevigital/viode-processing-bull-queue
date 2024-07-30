import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";

@Processor('tasks')
export class TasksProcessor {
    @Process('process')
  async handleTaks(job: Job<any>) {
        console.log('job is in processing', job.data)
    }
}