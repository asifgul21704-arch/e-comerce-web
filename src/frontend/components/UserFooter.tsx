import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw, Mail, ArrowRight } from 'lucide-react';

export const UserFooter: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-20">
      {/* Value propositions banner */}
      <div className="border-b border-neutral-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Fast Shipping</h4>
              <p className="text-xs text-neutral-400 mt-0.5">On all orders over $100</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Pay safely at your doorstep</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Support</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Dedicated customer team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Nova<span className="text-indigo-400">Store</span></span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Discover quality curated products with effortless shopping, fast delivery, and dedicated customer support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-indigo-400 transition">All Products</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-indigo-400 transition">Featured Deals</Link></li>
              <li><Link to="/products?isNewArrival=true" className="hover:text-indigo-400 transition">New Arrivals</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-indigo-400 transition">Track Orders</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-3">Categories</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Electronics" className="hover:text-indigo-400 transition">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-indigo-400 transition">Fashion</Link></li>
              <li><Link to="/products?category=Shoes" className="hover:text-indigo-400 transition">Shoes</Link></li>
              <li><Link to="/products?category=Beauty" className="hover:text-indigo-400 transition">Beauty</Link></li>
              <li><Link to="/products?category=Home" className="hover:text-indigo-400 transition">Home & Decor</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-indigo-400 transition">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Care / Newsletter */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">Stay in the Loop</h3>
            <p className="text-xs text-neutral-400">
              Subscribe for exclusive flash sales, seasonal discounts, and product drops.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex gap-1.5">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-neutral-800 border border-neutral-700 text-xs px-3 py-2 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition flex items-center justify-center"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} NovaStore. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">Help & FAQs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
