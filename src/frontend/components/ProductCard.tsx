import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { IProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product._id);
  const cartItem = cart.find(item => item.product._id === product._id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div
      id={`product-card-${product._id}`}
      className="group relative bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-200 flex flex-col"
    >
      {/* Badges & Wishlist Header */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </div>
        )}

        {/* New Arrival Tag */}
        {product.isNewArrival && !discountPercent && (
          <div className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            NEW
          </div>
        )}

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product._id}`}
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-xs transition ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-neutral-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Low Stock Pill */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
            Only {product.stock} left!
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            {product.category}
          </span>

          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 mt-1 group-hover:text-indigo-600 transition">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-neutral-800">{product.rating}</span>
            <span className="text-xs text-neutral-400">({product.numReviews})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-neutral-900">
                ${(product.discountPrice || product.price).toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            id={`add-to-cart-${product._id}`}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : cartItem
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200'
            }`}
          >
            {cartItem ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
