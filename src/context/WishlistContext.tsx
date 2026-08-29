import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { IProduct } from '../types';
import { useAuth } from './AuthContext';
import { authFetch } from '../utils/api';

interface WishlistContextType {
  wishlist: IProduct[];
  loading: boolean;
  toggleWishlist: (product: IProduct) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const activeUserIdRef = useRef<string | null>(null);

  // Clean up any legacy shared wishlist keys
  useEffect(() => {
    try {
      localStorage.removeItem('novastore_wishlist');
      localStorage.removeItem('wishlist');
    } catch {}
  }, []);

  // Fetch wishlist from backend whenever user changes
  useEffect(() => {
    const currentUserId = user?._id || null;
    activeUserIdRef.current = currentUserId;

    if (!user) {
      // User logged out: clear wishlist state
      setWishlist([]);
      setLoading(false);
      return;
    }

    const userWishlistKey = `wishlist_${user._id}`;
    try {
      const cached = localStorage.getItem(userWishlistKey);
      if (cached) {
        setWishlist(JSON.parse(cached));
      } else {
        setWishlist([]);
      }
    } catch {
      setWishlist([]);
    }

    let isSubscribed = true;

    const fetchUserWishlist = async () => {
      setLoading(true);
      try {
        const res = await authFetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed && activeUserIdRef.current === user._id && data.success) {
            const serverWishlist: IProduct[] = data.wishlist || [];
            setWishlist(serverWishlist);
            try {
              localStorage.setItem(userWishlistKey, JSON.stringify(serverWishlist));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Error fetching user wishlist:', err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchUserWishlist();

    return () => {
      isSubscribed = false;
    };
  }, [user?._id]);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const res = await authFetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.wishlist) {
          setWishlist(data.wishlist);
          localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(data.wishlist));
        }
      }
    } catch (e) {
      console.warn('Error refreshing wishlist:', e);
    }
  };

  const toggleWishlist = async (product: IProduct): Promise<boolean> => {
    if (!user) {
      return false;
    }

    const exists = wishlist.some(p => p._id === product._id);
    const newWishlist = exists
      ? wishlist.filter(p => p._id !== product._id)
      : [...wishlist, product];

    // Optimistic UI update
    setWishlist(newWishlist);
    try {
      localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(newWishlist));
    } catch {}

    try {
      const res = await authFetch('/api/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.wishlist) {
        setWishlist(data.wishlist);
        localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(data.wishlist));
        return data.inWishlist;
      }
    } catch (err) {
      console.warn('Error toggling wishlist:', err);
    }

    return !exists;
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p._id === productId);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      setWishlist(prev => prev.filter(p => p._id !== productId));
      return;
    }

    // Optimistic UI update
    setWishlist(prev => {
      const updated = prev.filter(p => p._id !== productId);
      try {
        localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await authFetch(`/api/wishlist/remove/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success && data.wishlist) {
        setWishlist(data.wishlist);
        localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(data.wishlist));
      }
    } catch (e) {
      console.warn('Error removing from wishlist:', e);
    }
  };

  const clearWishlist = async () => {
    setWishlist([]);
    if (user) {
      try {
        localStorage.removeItem(`wishlist_${user._id}`);
      } catch {}
      try {
        await authFetch('/api/wishlist/clear', { method: 'DELETE' });
      } catch (e) {
        console.warn('Error clearing wishlist on server:', e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        refreshWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
