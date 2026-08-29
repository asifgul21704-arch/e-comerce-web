import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Clock, CheckCircle2, Truck, XCircle, Filter } from 'lucide-react';
import { IOrder } from '../../types';
import { authFetch } from '../../utils/api';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Error fetching admin orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: IOrder['orderStatus']) => {
    try {
      const res = await authFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

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

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Order Management</h1>
        <p className="text-xs text-neutral-500 mt-0.5">Manage customer fulfillment, payment confirmations, and tracking</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by Order # or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 italic">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-neutral-900">{order.orderNumber}</td>
                    <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
                      <p className="text-[11px] text-neutral-400">{order.shippingAddress.city}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-neutral-900">${order.total.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-neutral-700 block font-medium">{order.paymentMethod}</span>
                      <span className="text-[10px] text-neutral-400 font-semibold">{order.paymentStatus}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value as IOrder['orderStatus'])}
                        className="bg-neutral-100 border border-neutral-200 rounded-lg px-2 py-1 text-xs font-bold text-neutral-800 outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 ml-auto transition shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Fulfillment Inspector</span>
                <h3 className="text-lg font-extrabold text-neutral-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Selector in Modal */}
            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-700">Update Status:</span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value as IOrder['orderStatus'])}
                className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-900 shadow-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Shipping Info */}
            <div className="space-y-1.5 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Customer & Destination</h4>
              <p className="text-neutral-900 font-semibold">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-600">{selectedOrder.shippingAddress.street}</p>
              <p className="text-neutral-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}</p>
              <p className="text-neutral-600">Phone: {selectedOrder.shippingAddress.phone}</p>
              {selectedOrder.notes && (
                <p className="text-neutral-500 italic pt-1 border-t border-neutral-200 mt-2">
                  Customer note: "{selectedOrder.notes}"
                </p>
              )}
            </div>

            {/* Ordered Products */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Ordered Products</h4>
              <div className="space-y-2.5 divide-y divide-neutral-100">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-2 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-lg object-cover bg-neutral-100"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">{it.name}</p>
                        <p className="text-neutral-500">Qty: {it.quantity} × ${it.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-neutral-100 pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery</span>
                <span>{selectedOrder.deliveryFee === 0 ? 'Free' : `$${selectedOrder.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span className="text-indigo-600">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
