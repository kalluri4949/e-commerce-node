const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  checkPermissions,
} = require('../middleware/authentication');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');

router.get('/', getAllProducts);
router.post('/', authenticateUser, checkPermissions('admin'), createProduct);
router.post(
  '/uploadImage',
  authenticateUser,
  checkPermissions('admin'),
  uploadImage
);
router.get('/:id', getSingleProduct);
router.patch(
  '/:id',
  authenticateUser,
  checkPermissions('admin'),
  updateProduct
);
router.delete(
  '/:id',
  authenticateUser,
  checkPermissions('admin'),
  deleteProduct
);

router.get('/:id/reviews', getSingleProductReviews);

module.exports = router;
