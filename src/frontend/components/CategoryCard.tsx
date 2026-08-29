import React from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../../types';
import { Headphones, Shirt, Footprints, Sparkles, Home, Watch, Tag } from 'lucide-react';

interface CategoryCardProps {
  category: ICategory;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getIcon = (name?: string) => {
    switch (name) {
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'Shirt': return <Shirt className="w-5 h-5" />;
      case 'Footprints': return <Footprints className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Watch': return <Watch className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      id={`category-card-${category.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 p-4 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 bg-neutral-100 relative group-hover:scale-105 transition-transform duration-300">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="flex items-center gap-1.5 text-neutral-800 group-hover:text-indigo-600 transition">
        <span className="text-neutral-500 group-hover:text-indigo-600 transition hidden sm:inline">
          {getIcon(category.iconName)}
        </span>
        <span className="text-sm font-bold">{category.name}</span>
      </div>
    </Link>
  );
};
