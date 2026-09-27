import api from './api';

export const login = async (
  email: string,
  password: string,
  role?: string,
) => {
  const response =
    await api.post(
      '/auth/login',
      {
        email,
        password,
        role,
      },
    );

  return response.data;
};

export const register =
  async (
    payload: any,
  ) => {
    const response =
      await api.post(
        '/auth/register',
        payload,
      );

    return response.data;
  };