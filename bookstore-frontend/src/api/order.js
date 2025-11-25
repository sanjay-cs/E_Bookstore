import API from './axiosInstance';

export const placeOrder = async () => API.post('/order');
