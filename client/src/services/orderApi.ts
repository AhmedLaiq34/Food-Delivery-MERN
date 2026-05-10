import api from './api';

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getRestaurantOrders = async (restaurantId: string) => {
  const response = await api.get(`/orders/restaurant/${restaurantId}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};
