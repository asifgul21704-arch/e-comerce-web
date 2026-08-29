import express from 'express';
import { db } from '../store';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/categories
router.get('/', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching categories.' });
  }
});

// POST /api/categories (Admin only)
router.post('/', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const { name, image, iconName } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = db.createCategory({
      name: name.trim(),
      slug,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      iconName: iconName || 'Tag',
    });

    res.status(201).json({ success: true, message: 'Category created successfully.', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating category.' });
  }
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const { name, image, iconName } = req.body;
    const updates: any = {};
    if (name) {
      updates.name = name.trim();
      updates.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (image) updates.image = image;
    if (iconName) updates.iconName = iconName;

    const updated = db.updateCategory(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({ success: true, message: 'Category updated successfully.', category: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating category.' });
  }
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', authenticateAdmin, (req: AuthRequest, res) => {
  const deleted = db.deleteCategory(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }
  res.json({ success: true, message: 'Category deleted successfully.' });
});

export default router;
