import API from './axiosInstance';

// Get logged-in user's cart
export const getCart = async () => API.get('/cart');

// Add or update product in cart
export const addToCart = async ({ productId, quantity }) =>
  API.post('/cart', { productId, quantity });

// Remove item from cart
export const removeFromCart = async (productId) =>
  API.delete(`/cart/${productId}`);

// Update quantity for an item
export const updateCartQuantity = (productId, quantity) =>
  API.put(`/cart/${productId}`, { quantity });

export const applyCoupon = (coupon) =>
  API.post('/cart/apply-coupon', { coupon });

export const removeCoupon = () =>
  API.post('/cart/apply-coupon', { remove: true });


