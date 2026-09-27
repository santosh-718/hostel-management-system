import { Injectable } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

@Injectable()
export class BookingService {
  private readonly dbFile =
    'db/bookings.json';

  async getBookings() {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          bookings: [],
        },
      );

    return db.data.bookings;
  }

  async getBookingById(
    bookingId: string,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          bookings: [],
        },
      );

    return db.data.bookings.find(
      (booking: any) =>
        booking.bookingId ===
        bookingId,
    );
  }

  async createBooking(
  booking: any,
) {
  const bookingDb =
    await JSONFilePreset(
      this.dbFile,
      {
        bookings: [],
      },
    );
     const existingBooking =
  bookingDb.data.bookings.find(
    (b: any) =>
      b.guestName ===
        booking.guestName &&
      b.status !==
        'CHECKED_OUT',
  );

if (existingBooking) {
  return {
    success: false,
    message:
      `Guest ${booking.guestName} is already allocated to Room ${existingBooking.roomNumber}`,
  };
}
  bookingDb.data.bookings.push(
    booking,
  );

  await bookingDb.write();

  // Update Room Availability

  const roomsDb =
    await JSONFilePreset(
      '../room-service/db/rooms.json',
      {
        rooms: [],
      },
    );

  const room =
    roomsDb.data.rooms.find(
      (r: any) =>
        r.roomNumber ===
        booking.roomNumber,
    );

  if (room) {
  if (
    (room.available || 0) <= 0
  ) {
    return {
      success: false,
      message:
        'Room is fully occupied',
    };
  }

  room.occupied =
  Math.min(
    room.capacity,
    (room.occupied || 0) + 1,
  );

  room.available =
Math.max(
0,
room.capacity -
room.occupied,
);

    if (
      room.available <= 0
    ) {
      room.status =
        'OCCUPIED';
    }

    await roomsDb.write();
  }

  return {
    success: true,
    message:
      'Booking Created Successfully',
    data: booking,
  };
}

  async updateBooking(
    bookingId: string,
    bookingData: any,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          bookings: [],
        },
      );

    const index =
      db.data.bookings.findIndex(
        (booking: any) =>
          booking.bookingId ===
          bookingId,
      );

    if (index === -1) {
      return {
        success: false,
        message:
          'Booking Not Found',
      };
    }

    db.data.bookings[index] = {
      ...db.data.bookings[index],
      ...bookingData,
    };

    await db.write();

    return {
      success: true,
      message:
        'Booking Updated Successfully',
    };
  }

  async deleteBooking(
    bookingId: string,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          bookings: [],
        },
      );

    db.data.bookings =
      db.data.bookings.filter(
        (booking: any) =>
          booking.bookingId !==
          bookingId,
      );

    await db.write();

    return {
      success: true,
      message:
        'Booking Deleted Successfully',
    };
  }

  async checkoutBooking(
  bookingId: string,
  checkoutData: any,
) {
  const bookingDb =
    await JSONFilePreset(
      this.dbFile,
      {
        bookings: [],
      },
    );

  const booking =
    bookingDb.data.bookings.find(
      (b: any) =>
        b.bookingId ===
        bookingId,
    );

  if (!booking) {
    return {
      success: false,
      message:
        'Booking Not Found',
    };
  }

  booking.checkOut =
    checkoutData.checkOut;

  booking.dueAmount =
    checkoutData.dueAmount;

  booking.status =
    'CHECKED_OUT';

  await bookingDb.write();

  const roomsDb =
    await JSONFilePreset(
      '../room-service/db/rooms.json',
      {
        rooms: [],
      },
    );

  const room =
    roomsDb.data.rooms.find(
      (r: any) =>
        r.roomNumber ===
        booking.roomNumber,
    );

  if (room) {
    room.occupied =
      Math.max(
        0,
        (room.occupied || 0) - 1,
      );

    room.available =
      room.capacity -
      room.occupied;

    if (
      room.available > 0
    ) {
      room.status =
        'AVAILABLE';
    }

    await roomsDb.write();
  }

  return {
    success: true,
    message:
      'Guest Checked Out Successfully',
  };
}

  async recordPayment(
    bookingId: string,
    paymentData: {
      amount: number;
      paidAt?: string;
      method?: string;
      reference?: string;
    },
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          bookings: [],
        },
      );

    const booking =
      db.data.bookings.find(
        (item: any) => item.bookingId === bookingId,
      );

    if (!booking) {
      return {
        success: false,
        message: 'Booking Not Found',
      };
    }

    const amount = Number(paymentData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        message: 'Payment amount must be greater than zero',
      };
    }

    const totalAmount = Number(booking.totalAmount ?? booking.dueAmount ?? 0);
    const existingPayments = Array.isArray(booking.payments)
      ? booking.payments
      : [];
    const paidAmount = existingPayments.reduce(
      (total: number, payment: any) => total + Number(payment.amount || 0),
      0,
    );
    const balance = Math.max(0, totalAmount - paidAmount);

    if (totalAmount <= 0) {
      return {
        success: false,
        message: 'This booking does not have a payable amount',
      };
    }

    if (amount > balance) {
      return {
        success: false,
        message: `Payment exceeds the outstanding balance of ${balance}`,
      };
    }

    const payment = {
      paymentId: `PAY${Date.now()}`,
      amount,
      paidAt: paymentData.paidAt || new Date().toISOString().slice(0, 10),
      method: paymentData.method || 'CASH',
      reference: paymentData.reference?.trim() || '',
    };

    booking.payments = [...existingPayments, payment];
    booking.paidAmount = paidAmount + amount;
    booking.dueAmount = Math.max(0, totalAmount - booking.paidAmount);

    await db.write();

    return {
      success: true,
      message: 'Payment Recorded Successfully',
      data: {
        bookingId,
        payment,
        paidAmount: booking.paidAmount,
        dueAmount: booking.dueAmount,
      },
    };
  }

  
}