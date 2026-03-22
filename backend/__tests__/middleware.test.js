const { validate, schemas } = require('../middleware/validate');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('Register Schema', () => {
    const middleware = validate(schemas.register);

    it('should pass with valid data', () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail without name', () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail with invalid email', () => {
      req.body = {
        name: 'Test',
        email: 'not-an-email',
        password: 'password123',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail with short password', () => {
      req.body = {
        name: 'Test',
        email: 'test@example.com',
        password: '12',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should accept optional phone', () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '9876543210',
      };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid phone', () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '123',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Login Schema', () => {
    const middleware = validate(schemas.login);

    it('should pass with valid data', () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail without email', () => {
      req.body = { password: 'password123' };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail without password', () => {
      req.body = { email: 'test@example.com' };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Create Product Schema', () => {
    const middleware = validate(schemas.createProduct);

    it('should pass with valid product data', () => {
      req.body = {
        name: 'Test Product',
        description: 'A detailed description of the product',
        price: 999,
        category: '507f1f77bcf86cd799439011',
        stock: 10,
      };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail without required fields', () => {
      req.body = { name: 'Product' };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail with negative price', () => {
      req.body = {
        name: 'Test Product',
        description: 'A detailed description',
        price: -10,
        category: '507f1f77bcf86cd799439011',
        stock: 10,
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Create Order Schema', () => {
    const middleware = validate(schemas.createOrder);

    it('should pass with valid order data', () => {
      req.body = {
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        paymentMethod: 'cod',
      };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail with invalid payment method', () => {
      req.body = {
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        paymentMethod: 'bitcoin',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail with invalid pincode', () => {
      req.body = {
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: 'abc',
        },
        paymentMethod: 'cod',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Create Review Schema', () => {
    const middleware = validate(schemas.createReview);

    it('should pass with valid review data', () => {
      req.body = {
        rating: 5,
        title: 'Great product',
        comment: 'Really liked this product',
        productId: '507f1f77bcf86cd799439011',
      };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail with rating out of range', () => {
      req.body = {
        rating: 6,
        productId: '507f1f77bcf86cd799439011',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail without rating', () => {
      req.body = {
        productId: '507f1f77bcf86cd799439011',
      };
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

describe('Error Handler Middleware', () => {
  const errorHandler = require('../middleware/errorHandler');

  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should handle generic errors with 500 status', () => {
    const err = new Error('Something went wrong');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
    });
  });

  it('should handle CastError as 404', () => {
    const err = new Error('Cast error');
    err.name = 'CastError';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should handle duplicate key error', () => {
    const err = new Error('Duplicate');
    err.code = 11000;
    err.keyValue = { email: 'test@test.com' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toContain('email');
  });

  it('should handle ValidationError', () => {
    const err = new Error('Validation');
    err.name = 'ValidationError';
    err.errors = {
      name: { message: 'Name is required' },
      email: { message: 'Email is invalid' },
    };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle JsonWebTokenError', () => {
    const err = new Error('jwt malformed');
    err.name = 'JsonWebTokenError';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should handle TokenExpiredError', () => {
    const err = new Error('jwt expired');
    err.name = 'TokenExpiredError';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
