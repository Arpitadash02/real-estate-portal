import apiClient from './apiClient';

// POST /api/auth/register
export const signupUser = ({ name, email, password, role }) =>
  apiClient.post('/auth/register', { name, email, password, role })
    .then(res => ({
      user: { id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role },
      token: res.data.token,
    }));

// POST /api/auth/login
export const loginUser = ({ email, password, role }) =>
  apiClient.post('/auth/login', { email, password, role })
    .then(res => ({
      user: { id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role },
      token: res.data.token,
    }));
