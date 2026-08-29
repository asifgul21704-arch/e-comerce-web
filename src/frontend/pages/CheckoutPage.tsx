import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ShieldCheck, CheckCircle2, ShoppingBag, ArrowLeft, ArrowRight, CreditCard, Banknote, LogIn, UserCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { authFetch } from '../../utils/api';
import { IOrder } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping Form State (prefill if user has saved profile info)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'United States',
    notes: '',
  });

  // Sync with user details when loaded
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        postalCode: prev.postalCode || user.address?.postalCode || '',
        country: prev.country || user.address?.country || 'United States',
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Credit Card' | 'PayPal'>('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<IOrder | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!user) {
      setError('Please log in or sign up before placing your order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.street || !formData.city) {
      setError('Please fill in all required address fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const itemsPayload = cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const res = await authFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: itemsPayload,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setCompletedOrder(data.order);
        clearCart();
      } else {
        if (res.status === 401) {
          setError('Authentication required. Please sign in or create an account.');
        } else {
          setError(data.message || 'Failed to place order.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error while creating order.');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Order Placed Successfully 🎉</h1>
            <p className="text-sm font-semibold text-indigo-600">
              Order Number: <span className="underline font-mono">{completedOrder.orderNumber}</span>
            </p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Thank you for shopping with NovaStore! We have received your order and are preparing it for shipment.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment:</span>
              <span className="font-semibold text-neutral-800">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Amount:</span>
              <span className="font-bold text-neutral-900">${completedOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Deliver to:</span>
              <span className="font-semibold text-neutral-800 truncate max-w-[200px]">{completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/orders`}
              id="view-order-btn"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition text-center shadow-xs"
            >
              View Orders
            </Link>
            <Link
              to="/products"
              id="continue-shopping-success-btn"
              className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs transition text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Your cart is empty</h2>
        <p className="text-xs text-neutral-500 mt-2 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/cart" className="hover:text-neutral-800 flex items-center gap-1 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cart
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-semibold">Checkout</span>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer Information & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Information Card */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-neutral-900">1. Customer & Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Postal / Zip Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">Delivery Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for the delivery courier..."
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-neutral-900">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Option: Cash on Delivery */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="w-4 h-4 text-indigo-600 accent-indigo-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-neutral-500">Pay cash in hand when your items arrive</span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-neutral-600" />
              </label>

              {/* Option: Credit Card */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'Credit Card'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={paymentMethod === 'Credit Card'}
                    onChange={() => setPaymentMethod('Credit Card')}
                    className="w-4 h-4 text-indigo-600 accent-indigo-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Credit / Debit Card</span>
                    <span className="text-[11px] text-neutral-500">Visa, MasterCard, American Express</span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-neutral-600" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            Order Summary ({cart.length} items)
          </h2>

          {/* Item Preview */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {cart.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3 text-xs">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">{item.product.name}</p>
                  <p className="text-neutral-500">Qty: {item.quantity} × ${(item.product.discountPrice || item.product.price).toFixed(2)}</p>
                </div>
                <span className="font-bold text-neutral-900 shrink-0">
                  ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-neutral-100 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-neutral-900">
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold uppercase">Free</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-extrabold text-neutral-900">
              <span>Total to Pay</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="place-order-btn"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Processing order...</span>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-neutral-400 text-center">
            By clicking "Place Order", you agree to NovaStore's Terms and Conditions.
          </p>
        </div>

      </form>

    </div>
  );
};
