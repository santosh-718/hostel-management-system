import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSONFilePreset } from 'lowdb/node';
const twilio = require('twilio');

@Injectable()
export class NotificationService {
  private readonly dbFile =
    'db/notifications.json';

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async sendSms(
    notification: any,
  ) {
    const client = twilio(
      this.configService.get(
        'TWILIO_ACCOUNT_SID',
      ),
      this.configService.get(
        'TWILIO_AUTH_TOKEN',
      ),
    );

    await client.messages.create({
      body:
        notification.message,
      from:
        this.configService.get(
          'TWILIO_PHONE_NUMBER',
        ),
      to:
        `+91${notification.phone}`,
    });

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          notifications: [],
        },
      );

    db.data.notifications.push({
      ...notification,
      createdDate:
        new Date().toISOString(),
      status: 'SENT',
    });

    await db.write();

    return {
      success: true,
      message:
        'SMS Sent Successfully',
    };
  }

  async getNotifications() {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          notifications: [],
        },
      );

    return db.data.notifications;
  }
}