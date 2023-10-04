const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkUserHasPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }
  checkUserHasPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//Update user with user.save()

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError('Please Provide email or Password');
  }
  const updatedUser = await User.findOne({ _id: req.user.userId });
  updatedUser.name = name;
  updatedUser.email = email;

  await updatedUser.save();

  // if (!updatedUser) {
  //   throw new CustomError.NotFoundError('Email not Found');
  // }

  const createTokenPayLoad = createTokenUser(updatedUser);
  attachCookiesToResponse({ res, user: createTokenPayLoad });
  res.status(StatusCodes.OK).json({ updatedUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('please provide password');
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Incorrect Password');
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

//Update user with Find one and Update

// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new CustomError.BadRequestError('Please Provide email or Password');
//   }
//   const updatedUser = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     {
//       name,
//       email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   if (!updatedUser) {
//     throw new CustomError.NotFoundError('Email not Found');
//   }

//   const createTokenPayLoad = createTokenUser(updatedUser);
//   attachCookiesToResponse({ res, user: createTokenPayLoad });
//   res.status(StatusCodes.OK).json({ updatedUser });
// };
