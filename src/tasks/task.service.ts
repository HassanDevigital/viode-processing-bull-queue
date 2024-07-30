import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";


@Injectable()
export class TasksService {
    constructor(@InjectQueue('tasks') private readonly tasksQueue: Queue) {}

    async addJob(data:any){
        try {
            await this.tasksQueue.add(data);
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(error)
        }
       
    }
}
