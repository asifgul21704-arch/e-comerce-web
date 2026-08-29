import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, ArrowLeft, KeyRound, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  // If already logged in as admin, redirect to dashboard
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleQuickFillAndLogin = async () => {
    const adminEmail = 'admin@novastore.com';
    const adminPass = 'admin123';
    setEmail(adminEmail);
    setPassword(adminPass);
    setAutoFilled(true);
    setError('');
    setLoading(true);

    try {
      const res = await login(adminEmail, adminPass);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError('This account does not have Administrator privileges.');
        }
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError('Access Denied: This account is not authorized as an Administrator.');
        }
      } else {
        setError(res.message || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Ambient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Return Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          id="admin-login-back-to-store"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-medium text-neutral-400 hover:text-white hover:border-neutral-700 transition backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Admin Shield Icon & Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shadow-xl shadow-indigo-600/20 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Authentication
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Sign in to access NovaStore Management & Catalog Control
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {/* Quick Demo Access Box */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
            <div className="flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-200 uppercase tracking-wider text-[11px]">
                    Admin Credentials
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">
                    Ready to use
                  </span>
                </div>
                <div className="mt-2 font-mono text-[11px] text-neutral-300 space-y-0.5">
                  <p><span className="text-neutral-400">Email:</span> <strong className="text-white">admin@novastore.com</strong></p>
                  <p><span className="text-neutral-400">Password:</span> <strong className="text-white">admin123</strong></p>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="admin-quick-login-btn"
              onClick={handleQuickFillAndLogin}
              disabled={loading}
              className="mt-3.5 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/30 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Auto-Fill & Admin Sign In</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-3 text-neutral-400 font-bold text-[10px] tracking-wider">
                Or Sign In Manually
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5" htmlFor="admin-email">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@novastore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-300" htmlFor="admin-password">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/80 border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="admin-submit-login-btn"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-white/10 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-400">
              🔒 High-Privilege Gateway — Authorized personnel only.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
