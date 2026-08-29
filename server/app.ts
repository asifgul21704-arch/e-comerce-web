import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';

export function createExpressApp() {
  const app = express();

  // Global Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'NovaStore E-Commerce API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/admin', adminRoutes);

  return app;
}

export const app = createExpressApp();
export default app;
