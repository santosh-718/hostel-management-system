import { Injectable } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

@Injectable()
export class RoomService {
  private readonly dbFile =
    'db/rooms.json';

  async getRooms() {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          rooms: [],
        },
      );

    return db.data.rooms;
  }

  async getRoomByNumber(
    roomNumber: string,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          rooms: [],
        },
      );

    return db.data.rooms.find(
      (room: any) =>
        room.roomNumber ===
        roomNumber,
    );
  }

  async createRoom(room: any) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          rooms: [],
        },
      );

    db.data.rooms.push(room);

    await db.write();

    return {
      success: true,
      message:
        'Room Created Successfully',
      data: room,
    };
  }

  async updateRoom(
    roomNumber: string,
    roomData: any,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          rooms: [],
        },
      );

    const index =
      db.data.rooms.findIndex(
        (room: any) =>
          room.roomNumber ===
          roomNumber,
      );

    if (index === -1) {
      return {
        success: false,
        message:
          'Room Not Found',
      };
    }

    db.data.rooms[index] = {
      ...db.data.rooms[index],
      ...roomData,
    };

    await db.write();

    return {
      success: true,
      message:
        'Room Updated Successfully',
    };
  }

  async deleteRoom(
    roomNumber: string,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          rooms: [],
        },
      );

    db.data.rooms =
      db.data.rooms.filter(
        (room: any) =>
          room.roomNumber !==
          roomNumber,
      );

    await db.write();

    return {
      success: true,
      message:
        'Room Deleted Successfully',
    };
  }
}