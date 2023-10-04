const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  clearCookiesToResponse,
  createTokenUser,
} = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already in use');
  }

  // first register user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  // Creating user
  const user = await User.create({ name, email, password, role });

  // creating token by sending payload
  const jwtpayLoad = createTokenUser(user);

  attachCookiesToResponse({ res: res, user: jwtpayLoad });

  res.status(StatusCodes.CREATED).json({ user: jwtpayLoad });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email or password');
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      'No user with this user id or email'
    );
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const jwtpayLoad = createTokenUser(user);
  attachCookiesToResponse({ res, user: jwtpayLoad });
  res.status(StatusCodes.CREATED).json({ user: jwtpayLoad });
};

const logout = async (req, res) => {
  clearCookiesToResponse({ res });
  res.status(StatusCodes.OK).json({ msg: 'Logout successfully' });
};

module.exports = {
  register,
  login,
  logout,
};
