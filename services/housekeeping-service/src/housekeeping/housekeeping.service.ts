import { Injectable } from '@nestjs/common';

@Injectable()
export class HousekeepingService {

  getTasks() {
    return [
      {
        taskId: 'HK001',
        roomNumber: '101',
        assignedTo: 'John',
        taskType: 'CLEANING',
        status: 'PENDING',
        scheduledDate: '2026-09-25',
      },
    ];
  }

  getTaskById(taskId: string) {
    return {
      taskId,
      roomNumber: '101',
      assignedTo: 'John',
      taskType: 'CLEANING',
      status: 'PENDING',
      scheduledDate: '2026-09-25',
    };
  }

  createTask(task: any) {
    return {
      message: 'Task Created Successfully',
      data: task,
    };
  }

  updateTask(taskId: string, task: any) {
    return {
      message: 'Task Updated Successfully',
      taskId,
      data: task,
    };
  }

  deleteTask(taskId: string) {
    return {
      message: 'Task Deleted Successfully',
      taskId,
    };
  }

  assignTask(taskId: string) {
    return {
      taskId,
      status: 'ASSIGNED',
    };
  }

  completeTask(taskId: string) {
    return {
      taskId,
      status: 'COMPLETED',
    };
  }
}
