import express from 'express';
import { db } from '../store';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/admin/users
router.get('/users', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const users = db.getUsers().map(u => {
      const safe = { ...u };
      delete safe.password;
      const userOrders = db.findOrdersByUserId(u._id);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        ...safe,
        ordersCount: userOrders.length,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
      };
    });

    res.json({ success: true, count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching users.' });
  }
});

// GET /api/admin/stats
router.get('/stats', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const products = db.getProducts();
    const orders = db.getOrders();
    const users = db.getUsers().filter(u => u.role === 'user');

    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStockProducts = products.filter(p => p.stock <= 5);
    const recentOrders = orders.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: users.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        lowStockCount: lowStockProducts.length,
        pendingOrdersCount: orders.filter(o => o.orderStatus === 'Pending').length,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error calculating store statistics.' });
  }
});

export default router;
