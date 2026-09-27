import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { GuestService } from './guest.service';

@Controller('guests')
export class GuestController {
  constructor(
    private readonly guestService: GuestService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'UP',
      service: 'guest-service',
    };
  }

  @Get()
  async getGuests() {
    return await this.guestService.getGuests();
  }

  @Get(':guestId')
  async getGuestById(
    @Param('guestId')
    guestId: string,
  ) {
    return await this.guestService.getGuestById(
      guestId,
    );
  }

  @Post('registration')
  async createGuestRegistration(
    @Body() guest: any,
  ) {
    return await this.guestService.createGuestRegistration(
      guest,
    );
  }

  @Post()
  async createGuest(
    @Body() guest: any,
  ) {
    return await this.guestService.createGuest(
      guest,
    );
  }

  @Put(':guestId')
  async updateGuest(
    @Param('guestId')
    guestId: string,

    @Body()
    guestData: any,
  ) {
    return await this.guestService.updateGuest(
      guestId,
      guestData,
    );
  }

  @Delete(':guestId')
  async deleteGuest(
    @Param('guestId')
    guestId: string,
  ) {
    return await this.guestService.deleteGuest(
      guestId,
    );
  }

  @Post(':guestId/checkin')
  async checkIn(
    @Param('guestId')
    guestId: string,
  ) {
    return await this.guestService.checkIn(
      guestId,
    );
  }

  @Post(':guestId/checkout')
  async checkOut(
    @Param('guestId')
    guestId: string,
  ) {
    return await this.guestService.checkOut(
      guestId,
    );
  }

  @Post(':guestId/approve')
async approveGuest(
  @Param('guestId')
  guestId: string,
) {
  return await this.guestService.approveGuest(
    guestId,
  );
}
@Post(':guestId/reject')
async rejectGuest(
  @Param('guestId')
  guestId: string,
) {
  return await this.guestService.rejectGuest(
    guestId,
  );
}
}