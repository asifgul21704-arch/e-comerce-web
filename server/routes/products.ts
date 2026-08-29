import express from 'express';
import { db } from '../store';
import { authenticateUser, authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/products (with search, category, minPrice, maxPrice, sort, featured, newArrivals)
router.get('/', (req, res) => {
  try {
    let products = db.getProducts();

    const { search, category, minPrice, maxPrice, sort, featured, isNewArrival } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'All' && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) {
        products = products.filter(p => (p.discountPrice || p.price) >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) {
        products = products.filter(p => (p.discountPrice || p.price) <= max);
      }
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    if (isNewArrival === 'true') {
      products = products.filter(p => p.isNewArrival);
    }

    if (sort) {
      if (sort === 'price-asc') {
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price-desc') {
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching products.' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const reviews = db.getReviewsByProductId(product._id);
  res.json({ success: true, product, reviews });
});

// POST /api/products (Admin only)
router.post('/', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const { name, description, price, discountPrice, category, image, images, stock, featured, isNewArrival } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price and category are required.' });
    }

    const newProduct = db.createProduct({
      name: name.trim(),
      description: description || '',
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      category: category.trim(),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      images: images && images.length ? images : [image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      stock: parseInt(stock || '10', 10),
      featured: Boolean(featured),
      isNewArrival: Boolean(isNewArrival),
    });

    res.status(201).json({ success: true, message: 'Product created successfully.', product: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating product.' });
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', authenticateAdmin, (req: AuthRequest, res) => {
  try {
    const { name, description, price, discountPrice, category, image, images, stock, featured, isNewArrival } = req.body;

    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);
    if (discountPrice !== undefined) updates.discountPrice = discountPrice ? parseFloat(discountPrice) : undefined;
    if (category !== undefined) updates.category = category.trim();
    if (image !== undefined) updates.image = image;
    if (images !== undefined) updates.images = images;
    if (stock !== undefined) updates.stock = parseInt(stock, 10);
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (isNewArrival !== undefined) updates.isNewArrival = Boolean(isNewArrival);

    const updated = db.updateProduct(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product updated successfully.', product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating product.' });
  }
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', authenticateAdmin, (req: AuthRequest, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, message: 'Product deleted successfully.' });
});

// GET /api/products/:id/reviews
router.get('/:id/reviews', (req, res) => {
  const reviews = db.getReviewsByProductId(req.params.id);
  res.json({ success: true, reviews });
});

// POST /api/products/:id/reviews (Authenticated user)
router.post('/:id/reviews', authenticateUser, (req: AuthRequest, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }

    const product = db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const review = db.addReview({
      product: product._id,
      user: req.user!._id,
      userName: req.user!.name,
      rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
      comment: comment.trim(),
    });

    const updatedProduct = db.findProductById(product._id);

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      review,
      product: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting review.' });
  }
});

export default router;
