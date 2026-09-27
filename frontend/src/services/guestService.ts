import api from './api';

export interface GuestRegistrationPayload {
  guestId: string;
  guestName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string | null;
  aadhaarNumber: string;
  organization: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  address: string;
  stayType: string;
  status: 'PENDING_APPROVAL';
}

export const getGuests = async () => {
  const response =
    await api.get('/guests');

  return response.data;
};

export const createGuest = async (
  guest: any,
) => {
  const response =
    await api.post(
      '/guests',
      guest,
    );

  return response.data;
};

export const createGuestRegistration = async (
  guest: GuestRegistrationPayload,
) => {
  const response =
    await api.post(
      '/guests/registration',
      guest,
    );

  return response.data;
};

export const updateGuest = async (
  guestId: string,
  guest: any,
) => {
  const response =
    await api.put(
      `/guests/${guestId}`,
      guest,
    );

  return response.data;
};

export const deleteGuest = async (
  guestId: string,
) => {
  const response =
    await api.delete(
      `/guests/${guestId}`,
    );

  return response.data;
};

export const checkInGuest = async (
  guestId: string,
) => {
  const response =
    await api.post(
      `/guests/${guestId}/checkin`,
    );

  return response.data;
};

export const checkOutGuest = async (
  guestId: string,
) => {
  const response =
    await api.post(
      `/guests/${guestId}/checkout`,
    );

  return response.data;
};

export const approveGuest = async (
  guestId: string,
) => {
  const response =
    await api.post(
      `/guests/${guestId}/approve`,
    );

  return response.data;
};

export const rejectGuest = async (
  guestId: string,
) => {
  const response =
    await api.post(
      `/guests/${guestId}/reject`,
    );

  return response.data;
};