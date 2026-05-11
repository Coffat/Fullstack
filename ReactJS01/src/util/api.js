import axios from './axios.customize.js';

const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register';
  return axios.post(URL_API, { name, email, password });
};

const loginApi = (email, password) => {
  const URL_API = '/v1/api/login';
  return axios.post(URL_API, { email, password });
};

const getUserApi = () => {
  const URL_API = '/v1/api/user';
  return axios.get(URL_API);
};

const forgotPasswordApi = (email) => {
  return axios.post('/v1/api/forgot-password', { email });
};

const resetPasswordApi = (email, token, newPassword) => {
  return axios.post('/v1/api/reset-password', {
    email,
    token,
    newPassword,
  });
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  forgotPasswordApi,
  resetPasswordApi,
};
