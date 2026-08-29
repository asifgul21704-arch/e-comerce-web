import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { IUser, IProduct, ICategory, IOrder, IReview, ICartItem } from '../src/types';

interface UserCartItem {
  productId: string;
  quantity: number;
}

interface DatabaseSchema {
  users: IUser[];
  products: IProduct[];
  categories: ICategory[];
  orders: IOrder[];
  reviews: IReview[];
  carts?: Record<string, UserCartItem[]>;
  wishlists?: Record<string, string[]>;
}

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

const INITIAL_CATEGORIES: ICategory[] = [
  {
    _id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    iconName: 'Headphones',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80',
    iconName: 'Shirt',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-3',
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    iconName: 'Footprints',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-4',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
    iconName: 'Sparkles',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-5',
    name: 'Home',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    iconName: 'Home',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-6',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    iconName: 'Watch',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: IProduct[] = [
  {
    _id: 'prod-1',
    name: 'Noise-Cancelling Wireless Headphones',
    description: 'Immersive sound with active noise cancellation, 30-hour battery life, ergonomic memory foam ear cushions, and crystal-clear voice calls.',
    price: 149.99,
    discountPrice: 119.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 24,
    rating: 4.8,
    numReviews: 42,
    featured: true,
    isNewArrival: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-2',
    name: 'Ultra Pro Sport Running Shoes',
    description: 'Lightweight, responsive cushioning with high-traction rubber outsole designed for marathon performance, daily jogs, and stylish street wear.',
    price: 129.99,
    discountPrice: 94.99,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    rating: 4.9,
    numReviews: 68,
    featured: true,
    isNewArrival: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-3',
    name: 'Smart Fitness Tracker Watch',
    description: 'Track heart rate, sleep quality, daily steps, SpO2, and phone notifications with a vibrant AMOLED display and 14-day battery life.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 5, // Low stock demo
    rating: 4.6,
    numReviews: 29,
    featured: true,
    isNewArrival: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-4',
    name: 'Classic Organic Cotton T-Shirt',
    description: '100% combed ring-spun organic cotton with a comfortable regular fit, pre-shrunk fabric, and premium breathable texture for all-day comfort.',
    price: 34.99,
    discountPrice: 24.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 45,
    rating: 4.7,
    numReviews: 31,
    featured: false,
    isNewArrival: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-5',
    name: 'Minimalist Ceramic Desk Lamp',
    description: 'Modern Scandinavian aesthetic with touch dimming, warm ambient lighting, and high-efficiency eye-friendly LED bulb included.',
    price: 59.99,
    discountPrice: 49.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 12,
    rating: 4.5,
    numReviews: 19,
    featured: true,
    isNewArrival: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-6',
    name: 'Hydrating Botanical Facial Serum',
    description: 'Infused with hyaluronic acid, vitamin C, and organic rosehip oil to rejuvenate skin, restore moisture, and promote a radiant glow.',
    price: 44.99,
    discountPrice: 38.00,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 3, // Low stock
    rating: 4.9,
    numReviews: 54,
    featured: true,
    isNewArrival: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-7',
    name: 'Polarized Classic Aviator Sunglasses',
    description: 'UV400 protection with lightweight titanium alloy frames, glare-reducing polarized lenses, and a premium protective leather case.',
    price: 65.00,
    discountPrice: 48.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 22,
    rating: 4.6,
    numReviews: 18,
    featured: false,
    isNewArrival: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'prod-8',
    name: 'Premium Leather Crossbody Bag',
    description: 'Handcrafted full-grain leather with multiple interior compartments, adjustable shoulder strap, and durable brass hardware.',
    price: 110.00,
    discountPrice: 89.00,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 14,
    rating: 4.8,
    numReviews: 27,
    featured: true,
    isNewArrival: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_REVIEWS: IReview[] = [
  {
    _id: 'rev-1',
    product: 'prod-1',
    user: 'user-2',
    userName: 'Jane Doe',
    rating: 5,
    comment: 'Superb sound quality and battery life lasts all week during my commute! Highly recommended.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    _id: 'rev-2',
    product: 'prod-2',
    user: 'user-2',
    userName: 'Jane Doe',
    rating: 5,
    comment: 'Extremely comfortable running shoes, feels like walking on air. Fits true to size.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  }
];

class DataStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read db.json, generating default initial dataset...', e);
    }

    // Default Seed Data
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const userPasswordHash = bcrypt.hashSync('user123', 10);

    const initialData: DatabaseSchema = {
      users: [
        {
          _id: 'user-1',
          name: 'Store Administrator',
          email: 'admin@novastore.com',
          password: adminPasswordHash,
          phone: '+1 (555) 019-2834',
          role: 'admin',
          address: {
            street: '100 Silicon Way',
            city: 'San Francisco',
            postalCode: '94105',
            country: 'United States',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'user-2',
          name: 'Jane Customer',
          email: 'customer@novastore.com',
          password: userPasswordHash,
          phone: '+1 (555) 432-8910',
          role: 'user',
          address: {
            street: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '62701',
            country: 'United States',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'user-3',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          password: userPasswordHash,
          phone: '+1 (555) 888-1234',
          role: 'user',
          address: {
            street: '456 Market St',
            city: 'Seattle',
            postalCode: '98101',
            country: 'United States',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: [
        {
          _id: 'ord-1001',
          orderNumber: 'ORD-84920',
          user: 'user-2',
          userName: 'Jane Customer',
          userEmail: 'customer@novastore.com',
          items: [
            {
              product: 'prod-2',
              name: 'Ultra Pro Sport Running Shoes',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
              price: 94.99,
              quantity: 1,
            },
            {
              product: 'prod-4',
              name: 'Classic Organic Cotton T-Shirt',
              image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
              price: 24.99,
              quantity: 2,
            }
          ],
          shippingAddress: {
            fullName: 'Jane Customer',
            phone: '+1 (555) 432-8910',
            street: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '62701',
            country: 'United States',
          },
          subtotal: 144.97,
          deliveryFee: 0,
          total: 144.97,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending',
          orderStatus: 'Shipped',
          notes: 'Please leave package near the front porch.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
        {
          _id: 'ord-1002',
          orderNumber: 'ORD-39182',
          user: 'user-2',
          userName: 'Jane Customer',
          userEmail: 'customer@novastore.com',
          items: [
            {
              product: 'prod-1',
              name: 'Noise-Cancelling Wireless Headphones',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
              price: 119.99,
              quantity: 1,
            }
          ],
          shippingAddress: {
            fullName: 'Jane Customer',
            phone: '+1 (555) 432-8910',
            street: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '62701',
            country: 'United States',
          },
          subtotal: 119.99,
          deliveryFee: 0,
          total: 119.99,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        }
      ],
      reviews: INITIAL_REVIEWS,
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write to db.json, using in-memory store:', e);
    }
  }

  // Users
  getUsers(): IUser[] {
    return this.data.users;
  }

  findUserById(id: string): IUser | undefined {
    return this.data.users.find(u => u._id === id);
  }

  findUserByEmail(email: string): IUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): IUser {
    const newUser: IUser = {
      ...user,
      _id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id: string, updates: Partial<IUser>): IUser | null {
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.users[idx];
  }

  // Products
  getProducts(): IProduct[] {
    return this.data.products;
  }

  findProductById(id: string): IProduct | undefined {
    return this.data.products.find(p => p._id === id);
  }

  createProduct(product: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt' | 'rating' | 'numReviews'>): IProduct {
    const newProduct: IProduct = {
      ...product,
      _id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      rating: 5.0,
      numReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<IProduct>): IProduct | null {
    const idx = this.data.products.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p._id !== id);
    if (this.data.products.length !== prevLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Categories
  getCategories(): ICategory[] {
    return this.data.categories;
  }

  findCategoryById(id: string): ICategory | undefined {
    return this.data.categories.find(c => c._id === id);
  }

  createCategory(category: Omit<ICategory, '_id' | 'createdAt'>): ICategory {
    const newCategory: ICategory = {
      ...category,
      _id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.categories.push(newCategory);
    this.saveData();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<ICategory>): ICategory | null {
    const idx = this.data.categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates,
    };
    this.saveData();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c._id !== id);
    if (this.data.categories.length !== prevLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): IOrder[] {
    return this.data.orders;
  }

  findOrderById(id: string): IOrder | undefined {
    return this.data.orders.find(o => o._id === id || o.orderNumber === id);
  }

  findOrdersByUserId(userId: string): IOrder[] {
    return this.data.orders
      .filter(o => o.user === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createOrder(order: Omit<IOrder, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): IOrder {
    const randDigits = Math.floor(10000 + Math.random() * 90000);
    const newOrder: IOrder = {
      ...order,
      _id: `ord-${Date.now()}`,
      orderNumber: `ORD-${randDigits}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct product stock
    for (const item of order.items) {
      const prod = this.findProductById(item.product);
      if (prod) {
        this.updateProduct(prod._id, { stock: Math.max(0, prod.stock - item.quantity) });
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }

  updateOrderStatus(id: string, status: IOrder['orderStatus']): IOrder | null {
    const idx = this.data.orders.findIndex(o => o._id === id || o.orderNumber === id);
    if (idx === -1) return null;
    this.data.orders[idx].orderStatus = status;
    if (status === 'Delivered') {
      this.data.orders[idx].paymentStatus = 'Paid';
    }
    this.data.orders[idx].updatedAt = new Date().toISOString();
    this.saveData();
    return this.data.orders[idx];
  }

  // Reviews
  getReviewsByProductId(productId: string): IReview[] {
    return this.data.reviews
      .filter(r => r.product === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addReview(review: Omit<IReview, '_id' | 'createdAt'>): IReview {
    const newReview: IReview = {
      ...review,
      _id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.unshift(newReview);

    // Update product average rating
    const allProdReviews = this.data.reviews.filter(r => r.product === review.product);
    const avg = allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length;
    this.updateProduct(review.product, {
      rating: parseFloat(avg.toFixed(1)),
      numReviews: allProdReviews.length,
    });

    this.saveData();
    return newReview;
  }

  // Carts (Isolated per User ID)
  getUserCart(userId: string): ICartItem[] {
    if (!this.data.carts) this.data.carts = {};
    const userItems = this.data.carts[userId] || [];

    const validCart: ICartItem[] = [];
    const cleanItems: UserCartItem[] = [];

    for (const item of userItems) {
      const product = this.findProductById(item.productId);
      if (product && product.stock > 0) {
        const quantity = Math.min(product.stock, Math.max(1, item.quantity));
        validCart.push({ product, quantity });
        cleanItems.push({ productId: product._id, quantity });
      }
    }

    if (cleanItems.length !== userItems.length) {
      this.data.carts[userId] = cleanItems;
      this.saveData();
    }

    return validCart;
  }

  addToUserCart(userId: string, productId: string, quantity: number = 1): ICartItem[] {
    if (!this.data.carts) this.data.carts = {};
    const userItems = this.data.carts[userId] || [];
    const product = this.findProductById(productId);
    if (!product || product.stock <= 0) {
      return this.getUserCart(userId);
    }

    const existingIdx = userItems.findIndex(i => i.productId === productId);
    if (existingIdx >= 0) {
      const currentQty = userItems[existingIdx].quantity;
      userItems[existingIdx].quantity = Math.min(product.stock, currentQty + (quantity || 1));
    } else {
      userItems.push({
        productId,
        quantity: Math.min(product.stock, Math.max(1, quantity || 1)),
      });
    }

    this.data.carts[userId] = userItems;
    this.saveData();
    return this.getUserCart(userId);
  }

  updateUserCartItem(userId: string, productId: string, quantity: number): ICartItem[] {
    if (!this.data.carts) this.data.carts = {};
    const userItems = this.data.carts[userId] || [];

    if (quantity <= 0) {
      this.data.carts[userId] = userItems.filter(i => i.productId !== productId);
    } else {
      const product = this.findProductById(productId);
      const maxStock = product ? product.stock : 99;
      const existingIdx = userItems.findIndex(i => i.productId === productId);
      if (existingIdx >= 0) {
        userItems[existingIdx].quantity = Math.min(maxStock, quantity);
        this.data.carts[userId] = userItems;
      }
    }

    this.saveData();
    return this.getUserCart(userId);
  }

  removeFromUserCart(userId: string, productId: string): ICartItem[] {
    if (!this.data.carts) this.data.carts = {};
    const userItems = this.data.carts[userId] || [];
    this.data.carts[userId] = userItems.filter(i => i.productId !== productId);
    this.saveData();
    return this.getUserCart(userId);
  }

  clearUserCart(userId: string): void {
    if (!this.data.carts) this.data.carts = {};
    this.data.carts[userId] = [];
    this.saveData();
  }

  // Wishlists (Isolated per User ID)
  getUserWishlist(userId: string): IProduct[] {
    if (!this.data.wishlists) this.data.wishlists = {};
    const ids = this.data.wishlists[userId] || [];
    const validProducts: IProduct[] = [];
    const validIds: string[] = [];

    for (const id of ids) {
      const prod = this.findProductById(id);
      if (prod) {
        validProducts.push(prod);
        validIds.push(prod._id);
      }
    }

    if (validIds.length !== ids.length) {
      this.data.wishlists[userId] = validIds;
      this.saveData();
    }

    return validProducts;
  }

  toggleUserWishlist(userId: string, productId: string): { inWishlist: boolean; wishlist: IProduct[] } {
    if (!this.data.wishlists) this.data.wishlists = {};
    let ids = this.data.wishlists[userId] || [];
    let inWishlist = false;

    if (ids.includes(productId)) {
      ids = ids.filter(id => id !== productId);
      inWishlist = false;
    } else {
      const prod = this.findProductById(productId);
      if (prod) {
        ids.push(productId);
        inWishlist = true;
      }
    }

    this.data.wishlists[userId] = ids;
    this.saveData();
    return { inWishlist, wishlist: this.getUserWishlist(userId) };
  }

  removeFromUserWishlist(userId: string, productId: string): IProduct[] {
    if (!this.data.wishlists) this.data.wishlists = {};
    let ids = this.data.wishlists[userId] || [];
    ids = ids.filter(id => id !== productId);
    this.data.wishlists[userId] = ids;
    this.saveData();
    return this.getUserWishlist(userId);
  }

  clearUserWishlist(userId: string): void {
    if (!this.data.wishlists) this.data.wishlists = {};
    this.data.wishlists[userId] = [];
    this.saveData();
  }
}

export const db = new DataStore();
