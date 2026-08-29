import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown, LogOut, Package, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const UserNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const categories = [
    { name: 'All Products', path: '/products' },
    { name: 'Electronics', path: '/products?category=Electronics' },
    { name: 'Fashion', path: '/products?category=Fashion' },
    { name: 'Shoes', path: '/products?category=Shoes' },
    { name: 'Beauty', path: '/products?category=Beauty' },
    { name: 'Home', path: '/products?category=Home' },
    { name: 'Accessories', path: '/products?category=Accessories' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <Link to="/" id="site-logo-link" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">Nova<span className="text-indigo-600">Store</span></span>
              <span className="hidden sm:block text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Easy & Smart</span>
            </div>
          </Link>

          {/* Desktop Categories Dropdown */}
          <div className="relative hidden md:block">
            <button
              id="categories-dropdown-btn"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-indigo-600 rounded-lg hover:bg-neutral-100 transition"
            >
              <span>Categories</span>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </button>

            {isCategoryMenuOpen && (
              <div 
                className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md relative">
            <input
              id="desktop-search-input"
              type="text"
              placeholder="Search products, shoes, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 focus:bg-white text-sm rounded-full border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              id="desktop-search-submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full transition"
            >
              Search
            </button>
          </form>

          {/* Desktop Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Wishlist */}
            <Link
              to="/wishlist"
              id="navbar-wishlist-link"
              className="relative p-2.5 text-neutral-700 hover:text-indigo-600 hover:bg-neutral-100 rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              id="navbar-cart-link"
              className="relative p-2.5 text-neutral-700 hover:text-indigo-600 hover:bg-neutral-100 rounded-full transition"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-neutral-800 max-w-[100px] truncate hidden md:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  {isProfileMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500">Signed in as</p>
                        <p className="text-sm font-semibold text-neutral-900 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        id="menu-my-profile-link"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 transition"
                      >
                        <UserCircle className="w-4 h-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        id="menu-my-orders-link"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 transition"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      <div className="border-t border-neutral-100 my-1"></div>

                      <button
                        id="menu-logout-btn"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    id="navbar-login-btn"
                    className="px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-indigo-600 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    id="navbar-signup-btn"
                    className="hidden sm:inline-flex px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-xs shadow-indigo-200 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg md:hidden transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-18 py-2 bg-neutral-100 text-sm rounded-lg border border-transparent focus:bg-white focus:border-indigo-500 outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-3 space-y-1">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">Account & Links</p>
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
                >
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
                >
                  Wishlist ({wishlistCount})
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2 px-3 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-700"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2 px-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
