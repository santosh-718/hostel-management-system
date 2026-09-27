import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller.js';
import { GuestService } from './guest.service.js';

@Module({
  controllers: [GuestController],
  providers: [GuestService]
})
export class GuestModule {}
