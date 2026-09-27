import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'UP',
      service:
        'notification-service',
    };
  }

  @Get()
  async getNotifications() {
    return await this.notificationService.getNotifications();
  }

  @Post('sms')
  async sendSms(
    @Body() notification: any,
  ) {
    return await this.notificationService.sendSms(
      notification,
    );
  }
}