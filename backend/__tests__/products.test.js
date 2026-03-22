const request = require('supertest');

// Mock all models before requiring app
jest.mock('../models/Product', () => {
  const ProductModel = jest.fn();
  ProductModel.find = jest.fn();
  ProductModel.findById = jest.fn();
  ProductModel.findByIdAndUpdate = jest.fn();
  ProductModel.findByIdAndDelete = jest.fn();
  ProductModel.countDocuments = jest.fn();
  ProductModel.create = jest.fn();
  return ProductModel;
});

jest.mock('../models/User', () => {
  const UserModel = jest.fn();
  UserModel.findOne = jest.fn();
  UserModel.findById = jest.fn();
  UserModel.create = jest.fn();
  return UserModel;
});

jest.mock('../models/Category', () => {
  const CategoryModel = jest.fn();
  CategoryModel.find = jest.fn();
  CategoryModel.findById = jest.fn();
  CategoryModel.findByIdAndUpdate = jest.fn();
  CategoryModel.findByIdAndDelete = jest.fn();
  CategoryModel.create = jest.fn();
  return CategoryModel;
});

jest.mock('../models/Cart', () => {
  const CartModel = jest.fn();
  CartModel.findOne = jest.fn();
  CartModel.findOneAndDelete = jest.fn();
  return CartModel;
});

jest.mock('../models/Order', () => {
  const OrderModel = jest.fn();
  OrderModel.find = jest.fn();
  OrderModel.findById = jest.fn();
  OrderModel.countDocuments = jest.fn();
  OrderModel.create = jest.fn();
  return OrderModel;
});

jest.mock('../models/Review', () => {
  const ReviewModel = jest.fn();
  ReviewModel.find = jest.fn();
  ReviewModel.findById = jest.fn();
  ReviewModel.findByIdAndDelete = jest.fn();
  ReviewModel.countDocuments = jest.fn();
  ReviewModel.create = jest.fn();
  ReviewModel.calculateAverageRating = jest.fn();
  return ReviewModel;
});

const app = require('../server');
const Product = require('../models/Product');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 100 },
        { _id: '2', name: 'Product 2', price: 200 },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts),
      };

      Product.find.mockReturnValue(mockQuery);
      Product.countDocuments.mockResolvedValue(2);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Product.find.mockReturnValue(mockQuery);
      Product.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/products?page=2&limit=5');

      expect(res.statusCode).toBe(200);
      expect(res.body.currentPage).toBe(2);
    });

    it('should return empty array when no products', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Product.find.mockReturnValue(mockQuery);
      Product.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toEqual([]);
      expect(res.body.total).toBe(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const mockProduct = { _id: '1', name: 'Product 1', price: 100 };
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      mockQuery.populate.mockReturnValueOnce(mockQuery).mockResolvedValueOnce(mockProduct);

      Product.findById.mockReturnValue(mockQuery);

      const res = await request(app).get('/api/products/507f1f77bcf86cd799439011');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('Product 1');
    });

    it('should return 404 for non-existent product', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      mockQuery.populate.mockReturnValueOnce(mockQuery).mockResolvedValueOnce(null);

      Product.findById.mockReturnValue(mockQuery);

      const res = await request(app).get('/api/products/507f1f77bcf86cd799439011');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/products', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          description: 'A detailed product description for testing purposes',
          price: 999,
          category: '507f1f77bcf86cd799439011',
          stock: 10,
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
