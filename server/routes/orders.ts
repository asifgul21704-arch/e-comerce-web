import express from 'express';
import { db } from '../store';
import { authenticateUser, authenticateAdmin, AuthRequest } from '../middleware/auth';
import { IOrderItem } from '../../src/types';

const router = express.Router();

// POST /api/orders (Create order - Authenticated)
router.post('/', authenticateUser, (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items are required.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
    }

    // Validate and build items with up-to-date pricing
    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const it of items) {
      const product = db.findProductById(it.product || it.productId || it._id);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${it.name || 'Unknown'}` });
      }

      if (product.stock < it.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${it.quantity}`,
        });
      }

      const unitPrice = product.discountPrice || product.price;
      subtotal += unitPrice * it.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: unitPrice,
        quantity: it.quantity,
      });
    }

    const deliveryFee = subtotal > 100 ? 0 : 9.99;
    const total = parseFloat((subtotal + deliveryFee).toFixed(2));

    const order = db.createOrder({
      user: req.user!._id,
      userName: req.user!.name,
      userEmail: req.user!.email,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode?.trim() || '',
        country: shippingAddress.country?.trim() || 'United States',
      },
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Pending',
      notes: notes?.trim() || '',
    });

    // Clear user's database cart upon order completion
    db.clearUserCart(req.user!._id);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error placing order.' });
  }
});

// GET /api/orders (Admin get all orders)
router.get('/', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching orders.' });
  }
});

// GET /api/orders/my-orders (Customer's own orders)
router.get('/my-orders', authenticateUser, (req: AuthRequest, res) => {
  try {
    const orders = db.findOrdersByUserId(req.user!._id);
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching orders.' });
  }
});

// PUT /api/orders/:id/status (Admin update order status)
router.put('/:id/status', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const status = req.body.status || req.body.orderStatus;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: `Order status updated to ${status}.`, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating order status.' });
  }
});

// GET /api/orders/:id (Customer or Admin)
router.get('/:id', authenticateUser, (req: AuthRequest, res) => {
  try {
    const order = db.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check authorization: must be the order's owner or an admin
    if (order.user !== req.user!._id && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied to this order.' });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching order.' });
  }
});

// GET /api/orders/admin/all (Admin list all orders alias)
router.get('/admin/all', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin orders.' });
  }
});

// PUT /api/orders/admin/:id/status (Admin update order status alias)
router.put('/admin/:id/status', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const status = req.body.status || req.body.orderStatus;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: `Order status updated to ${status}.`, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating order status.' });
  }
});

export default router;
