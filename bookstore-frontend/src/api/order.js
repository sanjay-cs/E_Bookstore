import API from './axiosInstance';

export const placeOrder = async () => API.post('/order');
export const getOrders = async () => API.get('/order');
