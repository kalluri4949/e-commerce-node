const CustomError = require('../errors');

const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.tkn;
  if (!token) {
    throw new CustomError.UnauthenticatedError(
      'Authentication Failed or Invalid'
    );
  }
  try {
    //  const jwtpayLoad = { name: user.name, userId: user._id, role: user.role };
    const { name, userId, role } = isTokenValid({ token: token });
    req.user = {
      name,
      userId,
      role,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError(
      'Authentication Failed or Invalid'
    );
  }
};

// if user is admin
const checkPermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.AccessForbidden(
        'Aceess is forbidden for this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  checkPermissions,
};
