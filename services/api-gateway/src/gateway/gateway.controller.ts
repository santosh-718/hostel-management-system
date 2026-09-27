import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import axios from 'axios';

@Controller('api')
export class GatewayController {
  @Get('health')
  health() {
    return {
      status: 'UP',
      service: 'api-gateway',
    };
  }

  // ROOMS

  @Get('rooms')
  async getRooms() {
    const response =
      await axios.get(
        'http://localhost:3002/rooms',
      );

    return response.data;
  }

  @Get('rooms/:roomNumber')
  async getRoom(
    @Param('roomNumber')
    roomNumber: string,
  ) {
    const response =
      await axios.get(
        `http://localhost:3002/rooms/${roomNumber}`,
      );

    return response.data;
  }

  @Post('rooms')
  async createRoom(
    @Body() room: any,
  ) {
    const response =
      await axios.post(
        'http://localhost:3002/rooms',
        room,
      );

    return response.data;
  }

  @Put('rooms/:roomNumber')
  async updateRoom(
    @Param('roomNumber')
    roomNumber: string,
    @Body() room: any,
  ) {
    const response =
      await axios.put(
        `http://localhost:3002/rooms/${roomNumber}`,
        room,
      );

    return response.data;
  }

  @Delete('rooms/:roomNumber')
  async deleteRoom(
    @Param('roomNumber')
    roomNumber: string,
  ) {
    const response =
      await axios.delete(
        `http://localhost:3002/rooms/${roomNumber}`,
      );

    return response.data;
  }

 // BOOKINGS
 
@Get('bookings')
async getBookings() {
const response =
await axios.get(
'http://localhost:3003/bookings',
);
 
return response.data;
}
 
@Get('bookings/:bookingId')
async getBookingById(
@Param('bookingId')
bookingId: string,
) {
const response =
await axios.get(
`http://localhost:3003/bookings/${bookingId}`,
);
 
return response.data;
}
 
@Post('bookings')
async createBooking(
@Body() booking: any,
) {
const response =
await axios.post(
'http://localhost:3003/bookings',
booking,
);
 
return response.data;
}
 
@Put('bookings/:bookingId')
async updateBooking(
@Param('bookingId')
bookingId: string,
@Body() booking: any,
) {
const response =
await axios.put(
`http://localhost:3003/bookings/${bookingId}`,
booking,
);
 
return response.data;
}
 
@Delete('bookings/:bookingId')
async deleteBooking(
@Param('bookingId')
bookingId: string,
) {
const response =
await axios.delete(
`http://localhost:3003/bookings/${bookingId}`,
);
 
return response.data;
}

  @Post('bookings/:bookingId/payments')
  async recordBookingPayment(
  @Param('bookingId')
  bookingId: string,
  @Body()
  payment: {
    amount: number;
    paidAt?: string;
    method?: string;
    reference?: string;
  },
  ) {
  const response =
  await axios.post(
  `http://localhost:3003/bookings/${bookingId}/payments`,
  payment,
  );

  return response.data;
  }
 
  // GUESTS
 
@Get('guests')
async getGuests() {
const response =
await axios.get(
'http://localhost:3004/guests',
);
 
return response.data;
}
 
@Get('guests/:guestId')
async getGuestById(
@Param('guestId')
guestId: string,
) {
const response =
await axios.get(
`http://localhost:3004/guests/${guestId}`,
);
 
return response.data;
}

@Post('guests/registration')
async createGuestRegistration(
@Body() guest: any,
) {
const response =
await axios.post(
'http://localhost:3004/guests/registration',
guest,
);

return response.data;
}

@Post('guests')
async createGuest(
@Body() guest: any,
) {
const response =
await axios.post(
'http://localhost:3004/guests',
guest,
);
 
return response.data;
}
 
@Put('guests/:guestId')
async updateGuest(
@Param('guestId')
guestId: string,
@Body() guest: any,
) {
const response =
await axios.put(
`http://localhost:3004/guests/${guestId}`,
guest,
);
 
return response.data;
}
 
@Delete('guests/:guestId')
async deleteGuest(
@Param('guestId')
guestId: string,
) {
const response =
await axios.delete(
`http://localhost:3004/guests/${guestId}`,
);
 
return response.data;
}
 
@Post('guests/:guestId/checkin')
async checkInGuest(
@Param('guestId')
guestId: string,
) {
const response =
await axios.post(
`http://localhost:3004/guests/${guestId}/checkin`,
);
 
return response.data;
}
 
@Post('guests/:guestId/checkout')
async checkOutGuest(
@Param('guestId')
guestId: string,
) {
const response =
await axios.post(
`http://localhost:3004/guests/${guestId}/checkout`,
);
 
return response.data;
}

@Post('guests/:guestId/approve')
async approveGuest(
  @Param('guestId')
  guestId: string,
) {
  const response =
    await axios.post(
      `http://localhost:3004/guests/${guestId}/approve`,
    );

  return response.data;
}

@Post('guests/:guestId/reject')
async rejectGuest(
  @Param('guestId')
  guestId: string,
) {
  const response =
    await axios.post(
      `http://localhost:3004/guests/${guestId}/reject`,
    );

  return response.data;
}

  // COMPLAINTS

  @Get('complaints')
  async getComplaints() {
    const response =
      await axios.get(
        'http://localhost:3005/complaints',
      );

    return response.data;
  }
  @Post(
  'bookings/:bookingId/checkout',
)
async checkoutBooking(
  @Param('bookingId')
  bookingId: string,

  @Body()
  checkoutData: any,
) {
  const response =
    await axios.post(
      `http://localhost:3003/bookings/${bookingId}/checkout`,
      checkoutData,
    );

  return response.data;
}

@Post('auth/register')
async register(
  @Body() body: any,
) {
  const response =
    await axios.post(
      'http://localhost:3006/auth/register',
      body,
    );

  return response.data;
}

@Post('auth/login')
async login(
  @Body() body: any,
) {
  const response =
    await axios.post(
      'http://localhost:3006/auth/login',
      body,
    );

  return response.data;
}
}
