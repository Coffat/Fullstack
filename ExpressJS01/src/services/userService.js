require('dotenv').config();
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const toRegisterResponse = (user) => {
  const o = user.toJSON();
  return {
    name: o.name,
    email: o.email,
    password: o.password,
    role: o.role,
    _id: o.id,
    id: o.id,
  };
};

const toPublicUser = (user) => {
  const o = user.toJSON();
  delete o.password;
  return {
    ...o,
    _id: o.id,
  };
};

const createUserService = async (name, email, password) => {
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return null;
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: 'User',
    });
    return toRegisterResponse(user);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        EC: 1,
        EM: 'Email/Password không hợp lệ',
      };
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: 'Email/Password không hợp lệ',
      };
    }
    const payload = {
      email: user.email,
      name: user.name,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return {
      EC: 0,
      access_token,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const hashResetToken = (tokenPlain) =>
  crypto.createHash('sha256').update(tokenPlain).digest('hex');

const RESET_GENERIC_MESSAGE =
  'Nếu email đã đăng ký trong hệ thống, bạn sẽ nhận hướng dẫn đặt lại mật khẩu.';

const requestPasswordResetService = async (email) => {
  const neutral = { message: RESET_GENERIC_MESSAGE };
  try {
    if (!email || typeof email !== 'string') {
      return neutral;
    }
    const user = await User.findOne({ where: { email: email.trim() } });
    if (!user) {
      return neutral;
    }
    const tokenPlain = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(tokenPlain);
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await user.update({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: expires,
    });
    if (process.env.NODE_ENV === 'development') {
      const base =
        process.env.FRONTEND_URL || 'http://localhost:5173';
      const q = new URLSearchParams({
        email: user.email,
        token: tokenPlain,
      });
      console.log(
        '[dev] Reset password URL:',
        `${base}/reset-password?${q.toString()}`
      );
    }
    return neutral;
  } catch (error) {
    console.log(error);
    return neutral;
  }
};

const resetPasswordWithTokenService = async (email, tokenPlain, newPassword) => {
  try {
    if (!email || !tokenPlain || !newPassword) {
      return { ok: false, message: 'Thiếu thông tin' };
    }
    const tokenHash = hashResetToken(tokenPlain);
    const user = await User.findOne({
      where: {
        email: email.trim(),
        resetPasswordToken: tokenHash,
      },
    });
    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return {
        ok: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      };
    }
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    await user.update({
      password: hashPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Lỗi server' };
  }
};

const getUserService = async () => {
  try {
    const rows = await User.findAll({
      attributes: {
        exclude: [
          'password',
          'resetPasswordToken',
          'resetPasswordExpires',
        ],
      },
    });
    return rows.map(toPublicUser);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  requestPasswordResetService,
  resetPasswordWithTokenService,
};
