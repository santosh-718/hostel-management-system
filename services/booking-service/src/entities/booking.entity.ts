export class Booking {
  bookingId: string;

  guestName: string;

  roomNumber: string;

  checkInDate: string;

  checkOutDate: string;

  bookingStatus: string;

  email?: string;

  guestId?: string;

  dueDate?: string;

  totalAmount?: number;

  paidAmount?: number;

  dueAmount?: number;

  payments?: {
    paymentId: string;
    amount: number;
    paidAt: string;
    method: string;
    reference?: string;
  }[];
}