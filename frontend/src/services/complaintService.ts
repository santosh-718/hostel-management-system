import api from './api';

export const getComplaints =
async () => {

const response =
await api.get(
'/complaints',
);

return response.data;
};
