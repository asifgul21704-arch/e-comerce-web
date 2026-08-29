import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// User Components & Layout
import { UserLayout } from './frontend/components/UserLayout';
import { ProtectedRoute } from './frontend/components/ProtectedRoute';
import { HomePage } from './frontend/pages/HomePage';
import { ProductsPage } from './frontend/pages/ProductsPage';
import { ProductDetailPage } from './frontend/pages/ProductDetailPage';
import { CartPage } from './frontend/pages/CartPage';
import { CheckoutPage } from './frontend/pages/CheckoutPage';
import { OrdersPage } from './frontend/pages/OrdersPage';
import { WishlistPage } from './frontend/pages/WishlistPage';
import { ProfilePage } from './frontend/pages/ProfilePage';
import { LoginPage } from './frontend/pages/LoginPage';
import { SignupPage } from './frontend/pages/SignupPage';
import { ForgotPasswordPage } from './frontend/pages/ForgotPasswordPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              
              {/* Storefront Customer Routes */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* User Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
