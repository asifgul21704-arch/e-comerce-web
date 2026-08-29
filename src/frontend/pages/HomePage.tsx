import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';
import { IProduct, ICategory } from '../../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { subscribeToCatalogChange } from '../../utils/events';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [popularProducts, setPopularProducts] = useState<IProduct[]>([]);
  const [newProducts, setNewProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
      ]);

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      if (catData.success) {
        setCategories(catData.categories);
      }

      if (prodData.success) {
        const prods: IProduct[] = prodData.products;
        setPopularProducts(prods.filter(p => p.featured).slice(0, 4));
        setNewProducts(prods.filter(p => p.isNewArrival || !p.featured).slice(0, 4));
      }
    } catch (e) {
      console.error('Error fetching homepage data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to immediate real-time updates whenever admin adds/edits/deletes items
    const unsubscribe = subscribeToCatalogChange(() => {
      fetchData();
    });

    return () => unsubscribe();
  }, [fetchData]);


  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 shadow-xl">
        {/* Background Subtle Gradient & Accents */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-neutral-900 to-neutral-900 z-0"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 lg:py-28 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Season Collection 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Shop Easy. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">
                Shop Smart.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              Explore hundreds of handpicked electronics, designer shoes, lifestyle fashion, and modern home essentials with fast, reliable delivery.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                to="/products"
                id="hero-shop-now-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products?isNewArrival=true"
                id="hero-new-arrivals-btn"
                className="w-full sm:w-auto px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl border border-neutral-700 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>New Arrivals</span>
              </Link>
            </div>
          </div>

          {/* Hero Showcase Image */}
          <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/50">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
              alt="Featured Running Shoes"
              className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-neutral-950/80 backdrop-blur-md rounded-xl border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">Top Trending</p>
                <p className="text-sm font-semibold text-white">Ultra Pro Sport Shoes</p>
              </div>
              <span className="text-base font-bold text-emerald-400">$94.99</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-neutral-500 mt-1">Browse our top catalog departments</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-neutral-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Popular Products</h2>
              <p className="text-sm text-neutral-500">Most requested and highest-rated products</p>
            </div>
          </div>
          <Link
            to="/products?featured=true"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-neutral-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500 rounded-full blur-2xl opacity-60"></div>
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Limited Offer</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Enjoy Free Express Delivery</h3>
            <p className="text-indigo-100 text-sm max-w-lg">
              Place an order over $100 today and receive zero-cost doorstep delivery with live tracking.
            </p>
          </div>
          <Link
            to="/products"
            className="z-10 px-6 py-3 bg-white hover:bg-neutral-100 text-indigo-700 font-bold rounded-xl text-sm transition shadow-md shrink-0"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* New Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">New Products</h2>
              <p className="text-sm text-neutral-500">Fresh arrivals added to our store</p>
            </div>
          </div>
          <Link
            to="/products?isNewArrival=true"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-neutral-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
