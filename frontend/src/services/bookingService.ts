import api from './api';

export const getBookings = async () => {
  const response =
    await api.get('/bookings');

  return response.data;
};

export const createBooking = async (
  booking: Record<string, unknown>,
) => {
  const response =
    await api.post(
      '/bookings',
      booking,
    );

  return response.data;
};

export const updateBooking = async (
  bookingId: string,
  booking: Record<string, unknown>,
) => {
  const response =
    await api.put(
      `/bookings/${bookingId}`,
      booking,
    );

  return response.data;
};

export const deleteBooking = async (
  bookingId: string,
) => {
  const response =
    await api.delete(
      `/bookings/${bookingId}`,
    );

  return response.data;
};

export const checkoutBooking =
  async (
    bookingId: string,
    checkoutData: {
      checkOut: string;
      dueAmount: number;
    },
  ) => {
    const response =
      await api.post(
        `/bookings/${bookingId}/checkout`,
        checkoutData,
      );

    return response.data;
  };

export const recordBookingPayment = async (
  bookingId: string,
  payment: {
    amount: number;
    paidAt: string;
    method: string;
    reference?: string;
  },
) => {
  const response = await api.post(
    `/bookings/${bookingId}/payments`,
    payment,
  );

  return response.data;
};
