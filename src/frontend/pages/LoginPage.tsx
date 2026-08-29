import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">Nova<span className="text-indigo-600">Store</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-neutral-500">Sign in to access your orders, cart, and wishlist</p>
        </div>

        {/* Demo Fast Logins */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 space-y-2 text-xs">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">Quick Demo Customer Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="demo-customer-login-btn-1"
              onClick={() => handleQuickLogin('customer@novastore.com', 'user123')}
              className="py-2 px-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl font-semibold text-neutral-800 text-left flex items-center gap-2 transition"
            >
              <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="truncate">
                <span className="block text-[11px]">Jane Customer</span>
                <span className="text-[9px] text-neutral-400">customer@...</span>
              </div>
            </button>

            <button
              type="button"
              id="demo-customer-login-btn-2"
              onClick={() => handleQuickLogin('alex@example.com', 'user123')}
              className="py-2 px-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl font-semibold text-neutral-800 text-left flex items-center gap-2 transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="block text-[11px]">Alex Johnson</span>
                <span className="text-[9px] text-neutral-400">alex@...</span>
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-neutral-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 accent-indigo-600"
              />
              <span>Remember me</span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-neutral-500 pt-2 border-t border-neutral-100">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
};
