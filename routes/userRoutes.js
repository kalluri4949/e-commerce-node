const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  checkPermissions,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router.get(
  '/',
  authenticateUser,
  checkPermissions('admin', 'owner'),
  getAllUsers
);
router.get('/currentUser', authenticateUser, showCurrentUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getSingleUser);

module.exports = router;
