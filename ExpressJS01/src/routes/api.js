const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.all('*', auth);

routerAPI.get('/', (req, res) => {
  let name = '';
  const bearer = req.headers.authorization?.split(' ')?.[1];
  if (bearer) {
    try {
      const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
      name = decoded.name || '';
    } catch (e) {
      /* ignore — public hello */
    }
  }
  const msg = name
    ? `${name}! Hello world! HomePage API`
    : 'Hello world api';
  return res.status(200).json(msg);
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.post('/forgot-password', forgotPassword);
routerAPI.post('/reset-password', resetPassword);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

module.exports = routerAPI;
