import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { IProduct, IReview } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { authFetch } from '../../utils/api';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [addedNotification, setAddedNotification] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Error loading product details', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-neutral-500 mt-4">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Product Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2 mb-6">The requested product may have been removed or is unavailable.</p>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!user) {
      navigate(`/login?redirect=/products/${product._id}`);
      return;
    }
    await addToCart(product, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 2500);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate(`/login?redirect=/products/${product._id}`);
      return;
    }
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate(`/login?redirect=/products/${product._id}`);
      return;
    }
    toggleWishlist(product);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError('Please provide a comment.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await authFetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews([data.review, ...reviews]);
        if (data.product) {
          setProduct(data.product);
        }
        setReviewComment('');
        setReviewSuccess('Review submitted successfully!');
        setTimeout(() => setReviewSuccess(''), 3000);
      } else {
        setReviewError(data.message || 'Failed to submit review.');
      }
    } catch (err: any) {
      setReviewError(err.message || 'Error submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb / Back link */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/products" className="hover:text-neutral-800 flex items-center gap-1 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          Products
        </Link>
        <span>/</span>
        <span className="text-neutral-400">{product.category}</span>
        <span>/</span>
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Large Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-white border border-neutral-200 rounded-3xl overflow-hidden relative shadow-xs">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Save {discountPercent}%
              </div>
            )}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/95 text-neutral-600 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings and Reviews count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800">{product.rating} / 5.0</span>
              <span className="text-xs text-neutral-400">({reviews.length} customer reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-neutral-900">
                ${(product.discountPrice || product.price).toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-neutral-600 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100/70 p-2.5 rounded-xl">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Fast Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100/70 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery</span>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  id="qty-minus-btn"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 text-xs font-bold text-neutral-900 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="qty-plus-btn"
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                id="product-detail-add-cart-btn"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 disabled:bg-neutral-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                id="product-detail-buy-now-btn"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl disabled:bg-neutral-200 disabled:cursor-not-allowed transition text-sm text-center"
              >
                Buy Now
              </button>
            </div>

            {addedNotification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Added {quantity} item(s) to your cart successfully!</span>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="pt-8 border-t border-neutral-200">
        <div className="flex items-center gap-8 border-b border-neutral-200 pb-3">
          <button
            onClick={() => setActiveTab('desc')}
            className={`text-sm font-bold pb-3 -mb-3.5 border-b-2 transition ${
              activeTab === 'desc'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-3 -mb-3.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'desc' ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-neutral-900">About this item</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">Category:</span>
                  <span className="text-neutral-600">{product.category}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block">Stock Status:</span>
                  <span className="text-neutral-600">{product.stock} units available</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block">Delivery:</span>
                  <span className="text-neutral-600">Standard 2-4 business days</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Add Review Form */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Write a Customer Review</h3>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-neutral-700">{reviewRating} Stars</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Your Review Comment</label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others what you think about this item..."
                        className="w-full text-sm p-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {reviewError && (
                      <p className="text-xs text-rose-600 font-semibold">{reviewError}</p>
                    )}
                    {reviewSuccess && (
                      <p className="text-xs text-emerald-600 font-semibold">{reviewSuccess}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <p className="text-xs text-neutral-600 mb-3">Please sign in to write a product review.</p>
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Log in
                    </Link>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-4">No reviews yet for this product. Be the first to review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center uppercase">
                            {rev.userName.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-neutral-900">{rev.userName}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
};
