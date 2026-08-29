import express from 'express';
import { db } from '../store';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Enforce authentication on all wishlist endpoints
router.use(authenticateUser);

// GET /api/wishlist - Return ONLY authenticated user's wishlist
router.get('/', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const wishlist = db.getUserWishlist(userId);
    res.json({
      success: true,
      wishlist,
      count: wishlist.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching wishlist.' });
  }
});

// POST /api/wishlist/toggle - Toggle item in user's wishlist
router.post('/toggle', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const result = db.toggleUserWishlist(userId, productId);
    res.json({
      success: true,
      inWishlist: result.inWishlist,
      message: result.inWishlist ? 'Product added to wishlist.' : 'Product removed from wishlist.',
      wishlist: result.wishlist,
      count: result.wishlist.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating wishlist.' });
  }
});

// POST /api/wishlist/add - Add item alias
router.post('/add', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const result = db.toggleUserWishlist(userId, productId);
    res.json({
      success: true,
      wishlist: result.wishlist,
      count: result.wishlist.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding to wishlist.' });
  }
});

// DELETE /api/wishlist/remove/:productId - Remove item from user's wishlist
router.delete('/remove/:productId', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;

    const wishlist = db.removeFromUserWishlist(userId, productId);
    res.json({
      success: true,
      message: 'Product removed from wishlist.',
      wishlist,
      count: wishlist.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing from wishlist.' });
  }
});

// DELETE /api/wishlist/:productId - Remove item alias
router.delete('/:productId', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.params;

    const wishlist = db.removeFromUserWishlist(userId, productId);
    res.json({
      success: true,
      message: 'Product removed from wishlist.',
      wishlist,
      count: wishlist.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing from wishlist.' });
  }
});

// DELETE /api/wishlist/clear - Clear user's wishlist
router.delete('/clear', (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    db.clearUserWishlist(userId);
    res.json({
      success: true,
      message: 'Wishlist cleared.',
      wishlist: [],
      count: 0,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error clearing wishlist.' });
  }
});

export default router;
