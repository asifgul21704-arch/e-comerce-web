import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, AlertTriangle, ArrowRight, Clock, CheckCircle2, Truck, XCircle, Plus } from 'lucide-react';
import { IOrder, IProduct } from '../../types';
import { authFetch } from '../../utils/api';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await authFetch('/api/admin/dashboard');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setLowStockProducts(data.lowStockProducts || []);
        }
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusBadge = (status: IOrder['orderStatus']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Confirmed</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Shipped</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-neutral-500 mt-3">Loading dashboard insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Store Overview</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Real-time e-commerce performance metrics</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Sales */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Total Sales</span>
            <span className="text-2xl font-black text-neutral-900 mt-1 block">
              ${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Verified Revenue
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-black text-neutral-900 mt-1 block">{stats.totalOrders}</span>
            <span className="text-[11px] text-neutral-400 font-semibold block mt-1">Across all channels</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Products</span>
            <span className="text-2xl font-black text-neutral-900 mt-1 block">{stats.totalProducts}</span>
            <span className="text-[11px] text-neutral-400 font-semibold block mt-1">Active in catalog</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Customers</span>
            <span className="text-2xl font-black text-neutral-900 mt-1 block">{stats.totalUsers}</span>
            <span className="text-[11px] text-neutral-400 font-semibold block mt-1">Registered accounts</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Grid: Recent Orders & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Recent Orders</h2>
              <p className="text-xs text-neutral-500">Latest customer purchases</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-neutral-400 italic">No recent orders.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-neutral-50/60 transition">
                      <td className="py-3.5 font-bold font-mono text-neutral-900">{order.orderNumber}</td>
                      <td className="py-3.5 text-neutral-700 font-medium">
                        {order.shippingAddress.fullName || 'Customer'}
                      </td>
                      <td className="py-3.5 font-black text-neutral-900">${order.total.toFixed(2)}</td>
                      <td className="py-3.5">{getStatusBadge(order.orderStatus)}</td>
                      <td className="py-3.5 text-right">
                        <Link
                          to="/admin/orders"
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-semibold transition inline-block"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-neutral-900">Low Stock Notice</h2>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-4 text-center">All inventory levels are healthy!</p>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{prod.name}</p>
                      <p className="text-[11px] text-neutral-500">${prod.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                    {prod.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
