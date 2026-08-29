import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-3xl p-10 shadow-xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your wishlist is empty.</h2>
          <p className="text-xs text-neutral-500 mt-2 mb-6">
            Tap the heart icon on any product to save items you love for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">Saved Wishlist</h1>
          <p className="text-xs text-neutral-500 mt-1">{wishlist.length} saved product{wishlist.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
        >
          Clear All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const isOutOfStock = product.stock <= 0;
          return (
            <div
              key={product._id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-300 transition flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-neutral-100">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 text-rose-600 rounded-full shadow-xs hover:bg-white transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{product.category}</span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-xs font-bold text-neutral-900 line-clamp-1 hover:text-indigo-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-black text-neutral-900 mt-1">
                    ${(product.discountPrice || product.price).toFixed(2)}
                  </p>
                </div>

                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    addToCart(product, 1);
                    removeFromWishlist(product._id);
                  }}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
