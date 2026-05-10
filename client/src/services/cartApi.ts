import api from './api';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (data: { menuItemId: string, quantity: number, size?: string, toppings?: string[], specialInstructions?: string }) => {
  const response = await api.post('/cart/add', data);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};
