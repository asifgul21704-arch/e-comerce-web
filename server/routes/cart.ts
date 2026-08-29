import express from 'express';
import { db } from '../store';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Enforce authentication on all cart endpoints
router.use(authenticateUser);

// GET /api/cart - Return ONLY authenticated user's cart
router.get('/', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const items = db.getUserCart(userId);
    res.json({
      success: true,
      items,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching cart.' });
  }
});

// POST /api/cart/add - Add product to authenticated user's cart
router.post('/add', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = db.findProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock.' });
    }

    const items = db.addToUserCart(userId, productId, Number(quantity) || 1);
    res.json({
      success: true,
      message: 'Product added to cart.',
      items,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding to cart.' });
  }
});

// PUT /api/cart/update/:productId - Update item quantity
router.put('/update/:productId', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({ success: false, message: 'Numeric quantity is required.' });
    }

    const items = db.updateUserCartItem(userId, productId, quantity);
    res.json({
      success: true,
      message: 'Cart updated.',
      items,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating cart.' });
  }
});

// PUT /api/cart/:productId - Update item quantity alias
router.put('/:productId', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({ success: false, message: 'Numeric quantity is required.' });
    }

    const items = db.updateUserCartItem(userId, productId, quantity);
    res.json({
      success: true,
      message: 'Cart updated.',
      items,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating cart.' });
  }
});

// DELETE /api/cart/remove/:productId - Remove item from user's cart
router.delete('/remove/:productId', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;

    const items = db.removeFromUserCart(userId, productId);
    res.json({
      success: true,
      message: 'Item removed from cart.',
      items,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing item from cart.' });
  }
});

// DELETE /api/cart/:productId - Remove item alias
router.delete('/:productId', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;

    const items = db.removeFromUserCart(userId, productId);
    res.json({
      success: true,
      message: 'Item removed from cart.',
      items,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing item from cart.' });
  }
});

// DELETE /api/cart/clear - Clear user's cart
router.delete('/clear', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    db.clearUserCart(userId);
    res.json({
      success: true,
      message: 'Cart cleared.',
      items: [],
      count: 0,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error clearing cart.' });
  }
});

// DELETE /api/cart - Clear user's cart alias
router.delete('/', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    db.clearUserCart(userId);
    res.json({
      success: true,
      message: 'Cart cleared.',
      items: [],
      count: 0,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error clearing cart.' });
  }
});

export default router;
