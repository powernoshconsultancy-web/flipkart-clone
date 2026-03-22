# Flipkart Clone

This project is a clone of the popular e-commerce platform Flipkart, aimed at providing features and functionalities akin to the original site.

## Backend API

A full-featured REST API built with Node.js, Express, and MongoDB.

### Features

- **Authentication**: JWT-based registration, login, and password management
- **Products**: CRUD operations with filtering, sorting, pagination, and text search
- **Categories**: Hierarchical category system with subcategories
- **Cart**: Add, update, remove items with stock validation
- **Orders**: Order creation from cart, status management, cancellation
- **Reviews**: Product reviews with automatic rating aggregation
- **Users**: Profile management, addresses, wishlist
- **Security**: Helmet, CORS, rate limiting, input sanitization, mongo injection protection
- **Validation**: Request validation using Joi schemas

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Joi
- **File Upload**: Multer + Cloudinary
- **Payments**: Stripe
- **Email**: Nodemailer
- **Testing**: Jest + Supertest

### Getting Started

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Update `.env` with your configuration
4. Install dependencies:
   ```bash
   cd backend && npm install
   ```
5. Seed the database (optional):
   ```bash
   npm run seed
   ```
6. Run the server:
   ```bash
   npm start
   ```

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/password` | Update password | Yes |
| GET | `/api/products` | List products (with filters) | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Seller/Admin |
| PUT | `/api/products/:id` | Update product | Seller/Admin |
| DELETE | `/api/products/:id` | Delete product | Seller/Admin |
| GET | `/api/categories` | List categories | No |
| GET | `/api/categories/:id` | Get single category | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/cart` | Add to cart | Yes |
| PUT | `/api/cart/:productId` | Update cart item | Yes |
| DELETE | `/api/cart/:productId` | Remove from cart | Yes |
| DELETE | `/api/cart` | Clear cart | Yes |
| GET | `/api/orders` | Get user orders | Yes |
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |
| PUT | `/api/orders/:id/cancel` | Cancel order | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/orders/admin/all` | Get all orders | Admin |
| GET | `/api/reviews?productId=x` | Get product reviews | No |
| POST | `/api/reviews` | Create review | Yes |
| PUT | `/api/reviews/:id` | Update review | Yes |
| DELETE | `/api/reviews/:id` | Delete review | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/users/addresses` | Add address | Yes |
| PUT | `/api/users/addresses/:id` | Update address | Yes |
| DELETE | `/api/users/addresses/:id` | Delete address | Yes |
| GET | `/api/users/wishlist` | Get wishlist | Yes |
| POST | `/api/users/wishlist/:productId` | Add to wishlist | Yes |
| DELETE | `/api/users/wishlist/:productId` | Remove from wishlist | Yes |
| GET | `/api/users` | List all users | Admin |

### Testing

```bash
cd backend && npm test
```
