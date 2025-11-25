import API from './axiosInstance';

// User login
export const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });

  // Save token to localStorage
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }

  return res;
};

// User register (no change needed unless register also returns token)
export const register = async (username, email, password) =>
  API.post('/auth/register', { username, email, password });
