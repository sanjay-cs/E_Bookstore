import API from './axiosInstance';
import axios from './axiosInstance';

export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export async function createProduct(productData) {
  const res = await axios.post('/products', productData);
  return res.data;
}
