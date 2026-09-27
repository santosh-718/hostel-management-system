import { Module } from '@nestjs/common';
import { ComplaintController } from './complaint.controller.js';
import { ComplaintService } from './complaint.service.js';

@Module({
  controllers: [ComplaintController],
  providers: [ComplaintService]
})
export class ComplaintModule {}
