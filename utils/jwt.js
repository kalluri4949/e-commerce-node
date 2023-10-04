const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const createToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// destructiong pulling res and user properties from incoming obj
const attachCookiesToResponse = ({ res, user }) => {
  const token = createToken({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24; // one day
  console.log('Token:', token); // Add this line for debugging
  // set to cookie
  res.cookie('tkn', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};
const clearCookiesToResponse = ({ res }) => {
  res.cookie('tkn', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
};

module.exports = {
  createToken,
  isTokenValid,
  attachCookiesToResponse,
  clearCookiesToResponse,
};
