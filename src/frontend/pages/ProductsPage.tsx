import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, PackageX } from 'lucide-react';
import { IProduct, ICategory } from '../../types';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const isFeatured = searchParams.get('featured') === 'true';
  const isNewArrival = searchParams.get('isNewArrival') === 'true';

  const [localSearch, setLocalSearch] = useState(search);
  const [priceRange, setPriceRange] = useState<number>(maxPrice ? parseInt(maxPrice) : 250);

  // Fetch Categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      })
      .catch(err => console.error('Error loading categories', err));
  }, []);

  // Fetch Products based on URL Search Params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (category && category !== 'All') query.set('category', category);
        if (sort) query.set('sort', sort);
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);
        if (isFeatured) query.set('featured', 'true');
        if (isNewArrival) query.set('isNewArrival', 'true');

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error('Error fetching products', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort, minPrice, maxPrice, isFeatured, isNewArrival]);

  const updateFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', localSearch);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setPriceRange(250);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            {category !== 'All' ? `${category} Products` : 'All Products'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Showing {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Search Bar in Page */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
          <input
            id="products-search-input"
            type="text"
            placeholder="Search within products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-none">
          <button
            id="category-pill-all"
            onClick={() => updateFilter('category', 'All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              category === 'All'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              id={`category-pill-${cat.slug}`}
              onClick={() => updateFilter('category', cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                category.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort and Price Control */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Price Cap */}
          <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-neutral-500 font-medium">Max: ${priceRange}</span>
            <input
              id="price-range-slider"
              type="range"
              min="20"
              max="250"
              step="5"
              value={priceRange}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPriceRange(val);
                updateFilter('maxPrice', val.toString());
              }}
              className="w-24 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-neutral-500 font-medium">Sort:</span>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent font-bold text-neutral-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(search || category !== 'All' || maxPrice || isFeatured || isNewArrival) && (
            <button
              id="reset-filters-btn"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-rose-50 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-neutral-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-3xl p-8 my-6 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">No products found</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-6">
            We couldn't find any products matching your current search or filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
