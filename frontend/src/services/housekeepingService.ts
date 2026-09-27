import api from './api';

export const getTasks =
async () => {

const response =
await api.get(
'/housekeeping',
);

return response.data;
};
