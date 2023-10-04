const {
  createToken,
  isTokenValid,
  attachCookiesToResponse,
  clearCookiesToResponse,
} = require('./jwt');

const createTokenUser = require('./createTokenUser');
const checkUserHasPermissions = require('./checkUserPermissions');

module.exports = {
  createToken,
  isTokenValid,
  attachCookiesToResponse,
  clearCookiesToResponse,
  createTokenUser,
  checkUserHasPermissions,
};
