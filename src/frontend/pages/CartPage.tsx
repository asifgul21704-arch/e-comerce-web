import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-3xl p-10 shadow-xs">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your cart is empty.</h2>
          <p className="text-xs text-neutral-500 mt-2 mb-6">
            Looks like you haven't added anything to your cart yet. Explore our top products and find great deals!
          </p>
          <Link
            to="/products"
            id="cart-continue-shopping-btn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <span>Continue Shopping</span>
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-neutral-500 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const unitPrice = item.product.discountPrice || item.product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product._id}
                id={`cart-item-${item.product._id}`}
                className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs hover:border-neutral-300 transition"
              >
                {/* Image */}
                <Link to={`/products/${item.product._id}`} className="w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {item.product.category}
                  </span>
                  <Link to={`/products/${item.product._id}`}>
                    <h3 className="text-sm font-bold text-neutral-900 hover:text-indigo-600 transition line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Unit Price: ${unitPrice.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden shrink-0">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="px-2.5 py-1.5 text-neutral-600 hover:bg-neutral-200 transition"
                    title="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-neutral-900 min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="px-2.5 py-1.5 text-neutral-600 hover:bg-neutral-200 disabled:opacity-40 transition"
                    title="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total & Remove */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-base font-bold text-neutral-900 w-20 text-right">
                    ${itemTotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
                Delivery Fee
              </span>
              <span className="font-semibold text-neutral-900">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                ) : (
                  `$${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>

            {subtotal < 100 && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                Add ${(100 - subtotal).toFixed(2)} more to qualify for <strong>FREE shipping</strong>!
              </p>
            )}

            <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-extrabold text-neutral-900">
              <span>Total</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            id="proceed-to-checkout-btn"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-neutral-400 text-center">
            🔒 Secure checkout with Cash on Delivery support.
          </p>
        </div>

      </div>

    </div>
  );
};
