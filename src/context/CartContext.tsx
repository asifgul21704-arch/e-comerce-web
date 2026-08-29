import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { IProduct, ICartItem } from '../types';
import { useAuth } from './AuthContext';
import { authFetch } from '../utils/api';

interface CartContextType {
  cart: ICartItem[];
  loading: boolean;
  addToCart: (product: IProduct, quantity?: number) => Promise<{ success: boolean; message?: string }>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const activeUserIdRef = useRef<string | null>(null);

  // Clean up any legacy shared cart keys
  useEffect(() => {
    try {
      localStorage.removeItem('novastore_cart');
      localStorage.removeItem('cart');
    } catch {}
  }, []);

  // Fetch cart from backend whenever authenticated user changes (Login/Logout/Switch user)
  useEffect(() => {
    const currentUserId = user?._id || null;
    activeUserIdRef.current = currentUserId;

    if (!user) {
      // User logged out: Completely clear cart from React state
      setCart([]);
      setLoading(false);
      return;
    }

    // New user logged in: Load user's cached cart first for immediate responsiveness, then fetch from database
    const userCartKey = `cart_${user._id}`;
    try {
      const cached = localStorage.getItem(userCartKey);
      if (cached) {
        setCart(JSON.parse(cached));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }

    let isSubscribed = true;

    const fetchUserCart = async () => {
      setLoading(true);
      try {
        const res = await authFetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed && activeUserIdRef.current === user._id && data.success) {
            const serverItems: ICartItem[] = data.items || [];
            setCart(serverItems);
            try {
              localStorage.setItem(userCartKey, JSON.stringify(serverItems));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Error fetching user cart:', err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchUserCart();

    return () => {
      isSubscribed = false;
    };
  }, [user?._id]);

  const refreshCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await authFetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.items) {
          setCart(data.items);
          localStorage.setItem(`cart_${user._id}`, JSON.stringify(data.items));
        }
      }
    } catch (e) {
      console.warn('Error refreshing cart:', e);
    }
  };

  const addToCart = async (product: IProduct, quantity = 1): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Please log in to add items to your cart.' };
    }

    const maxStock = product.stock || 1;
    const addQty = Math.max(1, Math.min(maxStock, quantity));

    // Optimistic UI update
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      let updated: ICartItem[];
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + addQty);
        updated = prev.map(item =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        updated = [...prev, { product, quantity: addQty }];
      }
      try {
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await authFetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity: addQty }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.items) {
        setCart(data.items);
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(data.items));
        return { success: true, message: 'Added to cart' };
      }
      return { success: false, message: data.message || 'Failed to add to cart' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      setCart(prev => prev.filter(item => item.product._id !== productId));
      return;
    }

    // Optimistic UI update
    setCart(prev => {
      const updated = prev.filter(item => item.product._id !== productId);
      try {
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await authFetch(`/api/cart/remove/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success && data.items) {
        setCart(data.items);
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(data.items));
      }
    } catch (e) {
      console.warn('Error removing from cart:', e);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!user) return;

    // Optimistic UI update
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.product._id === productId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      });
      try {
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await authFetch(`/api/cart/update/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.items) {
        setCart(data.items);
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(data.items));
      }
    } catch (e) {
      console.warn('Error updating cart quantity:', e);
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        localStorage.removeItem(`cart_${user._id}`);
      } catch {}
      try {
        await authFetch('/api/cart/clear', { method: 'DELETE' });
      } catch (e) {
        console.warn('Error clearing cart on server:', e);
      }
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 100 || totalItems === 0 ? 0 : 9.99;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        totalItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        deliveryFee,
        total: parseFloat(total.toFixed(2)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
