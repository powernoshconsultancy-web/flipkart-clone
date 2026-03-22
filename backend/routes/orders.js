const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.use(protect);

router
  .route('/')
  .get(getMyOrders)
  .post(validate(schemas.createOrder), createOrder);

router.get('/admin/all', authorize('admin'), getAllOrders);

router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
