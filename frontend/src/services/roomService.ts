import api from './api';

export const getRooms = async () => {
  const response = await api.get(
    '/rooms',
  );

  return response.data;
};

export const createRoom = async (
  room: any,
) => {
  const response = await api.post(
    '/rooms',
    room,
  );

  return response.data;
};

export const updateRoom = async (
  roomNumber: string,
  room: any,
) => {
  const response = await api.put(
    `/rooms/${roomNumber}`,
    room,
  );

  return response.data;
};

export const deleteRoom = async (
  roomNumber: string,
) => {
  const response = await api.delete(
    `/rooms/${roomNumber}`,
  );

  return response.data;
};