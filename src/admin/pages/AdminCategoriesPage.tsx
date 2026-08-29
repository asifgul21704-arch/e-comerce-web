import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Folder, CheckCircle2, UploadCloud } from 'lucide-react';
import { ICategory } from '../../types';
import { notifyCatalogChange } from '../../utils/events';
import { authFetch } from '../../utils/api';

const CATEGORY_IMAGE_PRESETS = [
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Footwear', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Watches', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Fashion', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80' },
  { label: 'Home Living', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80' },
  { label: 'Accessories', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80' },
];

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error('Error fetching categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setImage(CATEGORY_IMAGE_PRESETS[0].url);
    setDescription('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image);
    setDescription(cat.description || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      setFormError('Please provide category name and image.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), image, description }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchCategories();
        notifyCatalogChange('category');
        showToast(editingCategory ? 'Category updated and live!' : 'New category published to customer storefront!');
      } else {
        setFormError(data.message || 'Failed to save category.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Network error.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await authFetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(categories.filter(c => c._id !== id));
        notifyCatalogChange('category');
        showToast(`Category "${catName}" removed.`);
      } else {
        alert(data.message || 'Failed to delete category.');
      }
    } catch (e) {
      alert('Error deleting category.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Category Management</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Storefront Sync
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">Organize store departments, navigation pills, and category showcases</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-44 bg-white border border-neutral-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs hover:border-neutral-300 transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 p-5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-neutral-900 text-base">{cat.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono">slug: {cat.slug}</p>
                  <p className="text-xs text-neutral-500 line-clamp-1 mt-1">{cat.description || 'No description provided'}</p>
                </div>
              </div>

              <div className="bg-neutral-50 border-t border-neutral-100 px-5 py-3 flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Department</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-neutral-600 hover:text-indigo-600 hover:bg-neutral-200 rounded-lg transition"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-1.5 text-neutral-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-neutral-900">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <p className="text-xs text-neutral-500">Configure catalog department</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Smart Wearables"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. smart-wearables"
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-mono"
                />
              </div>

              {/* Image Input & Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">Category Cover Image *</label>
                <div className="flex gap-3 items-start">
                  {image && (
                    <img
                      src={image}
                      alt="Category Preview"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-50"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                      />
                      <ImageIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-semibold rounded-lg transition">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload from device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                          image === preset.url
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional brief description..."
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  {formLoading ? 'Publishing...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

