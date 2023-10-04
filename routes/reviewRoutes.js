const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  checkPermissions,
} = require('../middleware/authentication');

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.post('/createReview', authenticateUser, createReview);
router.get('/', getAllReviews);
router.get('/:id', getSingleReview);
router.patch('/:id', authenticateUser, updateReview);
router.delete('/:id', authenticateUser, deleteReview);

module.exports = router;
