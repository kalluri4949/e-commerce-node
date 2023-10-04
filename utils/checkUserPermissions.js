const CustomError = require('../errors');

const checkUserHasPermissions = (loggedInUser, resourceUserId) => {
  console.log(loggedInUser);
  console.log(resourceUserId);
  console.log(typeof resourceUserId);
  if (loggedInUser.role === 'admin') return;
  if (loggedInUser.userId === resourceUserId.toString()) return;
  throw new CustomError.AccessForbidden(
    `You don't have access to this user route`
  );
};

module.exports = checkUserHasPermissions;
