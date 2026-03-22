const express = require('express');
const router = express.Router();
const {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllUsers,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.use(protect);

router.put('/profile', validate(schemas.updateProfile), updateProfile);

router
  .route('/addresses')
  .post(validate(schemas.addAddress), addAddress);

router
  .route('/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

router.get('/', authorize('admin'), getAllUsers);

module.exports = router;
