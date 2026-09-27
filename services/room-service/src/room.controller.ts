import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'UP',
      service: 'room-service',
    };
  }

  @Get()
  getRooms() {
    return this.roomService.getRooms();
  }

  @Get(':roomNumber')
  getRoomByNumber(
    @Param('roomNumber') roomNumber: string,
  ) {
    return this.roomService.getRoomByNumber(
      roomNumber,
    );
  }

  @Post()
  createRoom(@Body() room: any) {
    return this.roomService.createRoom(room);
  }

  @Put(':roomNumber')
  updateRoom(
    @Param('roomNumber') roomNumber: string,
    @Body() room: any,
  ) {
    return this.roomService.updateRoom(
      roomNumber,
      room,
    );
  }

  @Delete(':roomNumber')
  deleteRoom(
    @Param('roomNumber') roomNumber: string,
  ) {
    return this.roomService.deleteRoom(
      roomNumber,
    );
  }
}