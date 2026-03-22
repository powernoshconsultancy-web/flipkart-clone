const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    avatar: Joi.string().uri().optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),

  createProduct: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(5000).required(),
    price: Joi.number().positive().required(),
    mrp: Joi.number().positive().optional(),
    category: Joi.string().required(),
    brand: Joi.string().max(100).optional(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      public_id: Joi.string().optional(),
    })).optional(),
    specifications: Joi.object().optional(),
    highlights: Joi.array().items(Joi.string()).optional(),
  }),

  createCategory: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    image: Joi.string().uri().optional(),
    parent: Joi.string().optional(),
  }),

  addToCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1),
  }),

  createOrder: Joi.object({
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
      country: Joi.string().default('India'),
    }).required(),
    paymentMethod: Joi.string().valid('cod', 'card', 'upi').required(),
  }),

  createReview: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().max(100).optional(),
    comment: Joi.string().max(1000).optional(),
    productId: Joi.string().required(),
  }),

  addAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
    country: Joi.string().default('India'),
    isDefault: Joi.boolean().default(false),
  }),
};

module.exports = { validate, schemas };
