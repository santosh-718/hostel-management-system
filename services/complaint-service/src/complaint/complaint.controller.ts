import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ComplaintService }
from './complaint.service';

@Controller('complaints')
export class ComplaintController {

  constructor(
    private readonly complaintService:
      ComplaintService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'UP',
      service: 'complaint-service',
    };
  }

  @Get()
  getComplaints() {
    return this.complaintService.getComplaints();
  }

  @Get(':complaintId')
  getComplaintById(
    @Param('complaintId')
    complaintId: string,
  ) {
    return this.complaintService.getComplaintById(
      complaintId,
    );
  }

  @Post()
  createComplaint(
    @Body() complaint: any,
  ) {
    return this.complaintService.createComplaint(
      complaint,
    );
  }

  @Put(':complaintId')
  updateComplaint(
    @Param('complaintId')
    complaintId: string,
    @Body()
    complaint: any,
  ) {
    return this.complaintService.updateComplaint(
      complaintId,
      complaint,
    );
  }

  @Delete(':complaintId')
  deleteComplaint(
    @Param('complaintId')
    complaintId: string,
  ) {
    return this.complaintService.deleteComplaint(
      complaintId,
    );
  }

  @Post(':complaintId/assign')
  assignComplaint(
    @Param('complaintId')
    complaintId: string,
  ) {
    return this.complaintService.assignComplaint(
      complaintId,
    );
  }

  @Post(':complaintId/resolve')
  resolveComplaint(
    @Param('complaintId')
    complaintId: string,
  ) {
    return this.complaintService.resolveComplaint(
      complaintId,
    );
  }
}
