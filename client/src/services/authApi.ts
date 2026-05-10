import api from './api';
import type { ILoginInput, IRegisterInput } from '../pages/auth.types'; // I'll create this types file

export const loginFn = async (data: ILoginInput) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const registerFn = async (data: IRegisterInput) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logoutFn = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
