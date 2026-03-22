const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router
  .route('/')
  .get(getReviews)
  .post(protect, validate(schemas.createReview), createReview);

router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
