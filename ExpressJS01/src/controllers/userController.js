const {
  createUserService,
  loginService,
  getUserService,
  requestPasswordResetService,
  resetPasswordWithTokenService,
} = require('../services/userService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  if (!data) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  if (data === null) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  if (data === null) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = await requestPasswordResetService(email);
  return res.status(200).json(data);
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  const result = await resetPasswordWithTokenService(
    email,
    token,
    newPassword
  );
  if (!result.ok) {
    return res.status(400).json({ message: result.message });
  }
  return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
};
