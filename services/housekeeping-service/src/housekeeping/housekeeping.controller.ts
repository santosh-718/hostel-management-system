import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { HousekeepingService } from './housekeeping.service';

@Controller('housekeeping')
export class HousekeepingController {

  constructor(
    private readonly housekeepingService:
      HousekeepingService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'UP',
      service: 'housekeeping-service',
    };
  }

  @Get()
  getTasks() {
    return this.housekeepingService.getTasks();
  }

  @Get(':taskId')
  getTaskById(
    @Param('taskId')
    taskId: string,
  ) {
    return this.housekeepingService.getTaskById(
      taskId,
    );
  }

  @Post()
  createTask(
    @Body() task: any,
  ) {
    return this.housekeepingService.createTask(
      task,
    );
  }

  @Put(':taskId')
  updateTask(
    @Param('taskId')
    taskId: string,
    @Body()
    task: any,
  ) {
    return this.housekeepingService.updateTask(
      taskId,
      task,
    );
  }

  @Delete(':taskId')
  deleteTask(
    @Param('taskId')
    taskId: string,
  ) {
    return this.housekeepingService.deleteTask(
      taskId,
    );
  }

  @Post(':taskId/assign')
  assignTask(
    @Param('taskId')
    taskId: string,
  ) {
    return this.housekeepingService.assignTask(
      taskId,
    );
  }

  @Post(':taskId/complete')
  completeTask(
    @Param('taskId')
    taskId: string,
  ) {
    return this.housekeepingService.completeTask(
      taskId,
    );
  }
}
