import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'UP',
      service: 'booking-service',
    };
  }

  @Get()
  getBookings() {
    return this.bookingService.getBookings();
  }

  @Get(':bookingId')
  getBookingById(
    @Param('bookingId')
    bookingId: string,
  ) {
    return this.bookingService.getBookingById(
      bookingId,
    );
  }

  @Post()
  createBooking(
    @Body() booking: any,
  ) {
    return this.bookingService.createBooking(
      booking,
    );
  }

  @Put(':bookingId')
  updateBooking(
    @Param('bookingId')
    bookingId: string,
    @Body() booking: any,
  ) {
    return this.bookingService.updateBooking(
      bookingId,
      booking,
    );
  }

  @Delete(':bookingId')
  deleteBooking(
    @Param('bookingId')
    bookingId: string,
  ) {
    return this.bookingService.deleteBooking(
      bookingId,
    );
  }
  @Post(':bookingId/checkout')
checkoutBooking(
  @Param('bookingId')
  bookingId: string,

  @Body()
  checkoutData: any,
) {
  return this.bookingService.checkoutBooking(
    bookingId,
    checkoutData,
  );
}

  @Post(':bookingId/payments')
  recordPayment(
    @Param('bookingId') bookingId: string,
    @Body()
    paymentData: {
      amount: number;
      paidAt?: string;
      method?: string;
      reference?: string;
    },
  ) {
    return this.bookingService.recordPayment(
      bookingId,
      paymentData,
    );
  }
}