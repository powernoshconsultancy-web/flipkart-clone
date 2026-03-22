const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@flipkart-clone.com',
      password: 'admin123456',
      role: 'admin',
      isVerified: true,
    });

    // Create seller
    const seller = await User.create({
      name: 'Test Seller',
      email: 'seller@flipkart-clone.com',
      password: 'seller123456',
      role: 'seller',
      isVerified: true,
    });

    // Create regular user
    await User.create({
      name: 'Test User',
      email: 'user@flipkart-clone.com',
      password: 'user123456',
      role: 'user',
      isVerified: true,
    });

    // Create categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    });

    const fashion = await Category.create({
      name: 'Fashion',
      description: 'Clothing, footwear and accessories',
    });

    const homeAppliances = await Category.create({
      name: 'Home & Appliances',
      description: 'Home decor and appliances',
    });

    // Create subcategories
    const mobiles = await Category.create({
      name: 'Mobiles',
      description: 'Smartphones and mobile phones',
      parent: electronics._id,
    });

    const laptops = await Category.create({
      name: 'Laptops',
      description: 'Laptops and notebooks',
      parent: electronics._id,
    });

    await Category.create({
      name: 'Men\'s Clothing',
      description: 'Men\'s fashion and clothing',
      parent: fashion._id,
    });

    await Category.create({
      name: 'Women\'s Clothing',
      description: 'Women\'s fashion and clothing',
      parent: fashion._id,
    });

    // Create products
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max with A17 Pro chip, 256GB storage, titanium design, and advanced camera system.',
        price: 134900,
        mrp: 159900,
        category: mobiles._id,
        brand: 'Apple',
        stock: 50,
        seller: seller._id,
        images: [{ url: 'https://via.placeholder.com/400x400?text=iPhone+15' }],
        highlights: ['A17 Pro chip', '48MP camera', 'Titanium design', 'USB-C'],
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 200MP camera, S Pen, and Galaxy AI features.',
        price: 129999,
        mrp: 144999,
        category: mobiles._id,
        brand: 'Samsung',
        stock: 35,
        seller: seller._id,
        images: [{ url: 'https://via.placeholder.com/400x400?text=Galaxy+S24' }],
        highlights: ['Snapdragon 8 Gen 3', '200MP camera', 'S Pen included', 'Galaxy AI'],
      },
      {
        name: 'MacBook Air M3',
        description: 'Apple MacBook Air with M3 chip, 8GB RAM, 256GB SSD, 13.6-inch Liquid Retina display.',
        price: 114900,
        mrp: 119900,
        category: laptops._id,
        brand: 'Apple',
        stock: 20,
        seller: seller._id,
        images: [{ url: 'https://via.placeholder.com/400x400?text=MacBook+Air' }],
        highlights: ['M3 chip', '18-hour battery', 'Fanless design', 'MagSafe charging'],
      },
      {
        name: 'Dell XPS 15',
        description: 'Dell XPS 15 with Intel Core i7, 16GB RAM, 512GB SSD, 15.6-inch OLED display.',
        price: 149990,
        mrp: 169990,
        category: laptops._id,
        brand: 'Dell',
        stock: 15,
        seller: seller._id,
        images: [{ url: 'https://via.placeholder.com/400x400?text=Dell+XPS+15' }],
        highlights: ['Intel Core i7', 'OLED display', '16GB RAM', 'InfinityEdge'],
      },
    ];

    await Product.create(products);

    console.log('Database seeded successfully');
    console.log('Admin: admin@flipkart-clone.com / admin123456');
    console.log('Seller: seller@flipkart-clone.com / seller123456');
    console.log('User: user@flipkart-clone.com / user123456');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
