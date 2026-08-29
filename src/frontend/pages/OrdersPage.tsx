import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, Eye, ArrowRight, X } from 'lucide-react';
import { IOrder } from '../../types';
import { authFetch } from '../../utils/api';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await authFetch('/api/orders/my-orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: IOrder['orderStatus']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            Confirmed
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-500" />
            Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-neutral-500 mt-3">Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">You have no orders yet.</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6">
          When you place an order, its real-time shipping status and breakdown will appear here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">My Orders</h1>
        <p className="text-xs text-neutral-500 mt-1">Review past purchases and live shipment tracking</p>
      </div>

      {/* Orders Table / Cards */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            id={`order-card-${order.orderNumber}`}
            className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-neutral-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-black font-mono text-neutral-900">{order.orderNumber}</span>
                {getStatusBadge(order.orderStatus)}
              </div>
              <p className="text-xs text-neutral-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>

              {/* Items Thumbnails */}
              <div className="flex items-center gap-2 pt-1">
                {order.items.slice(0, 4).map((it, idx) => (
                  <img
                    key={idx}
                    src={it.image}
                    alt={it.name}
                    title={it.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-bold flex items-center justify-center border border-neutral-200">
                    +{order.items.length - 4}
                  </span>
                )}
                <span className="text-xs text-neutral-600 ml-2">
                  {order.items.reduce((sum, it) => sum + it.quantity, 0)} item(s)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
              <div className="text-left md:text-right">
                <span className="text-[11px] text-neutral-400 block">Total Amount</span>
                <span className="text-lg font-black text-neutral-900">${order.total.toFixed(2)}</span>
              </div>

              <button
                id={`view-order-btn-${order.orderNumber}`}
                onClick={() => setSelectedOrder(order)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Order</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Order Details</span>
                <h3 className="text-lg font-extrabold text-neutral-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Status Overview */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700">Status:</span>
                {getStatusBadge(selectedOrder.orderStatus)}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700">Payment:</span>
                <span className="text-neutral-900 font-medium">{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700">Date:</span>
                <span className="text-neutral-600">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Items Ordered</h4>
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

            {/* Delivery Address */}
            <div className="space-y-1.5 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Delivery Address</h4>
              <p className="text-neutral-800 font-semibold">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-600">{selectedOrder.shippingAddress.street}</p>
              <p className="text-neutral-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
              <p className="text-neutral-600">Phone: {selectedOrder.shippingAddress.phone}</p>
              {selectedOrder.notes && (
                <p className="text-neutral-500 italic pt-1 border-t border-neutral-200 mt-2">
                  Note: "{selectedOrder.notes}"
                </p>
              )}
            </div>

            {/* Financials */}
            <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery</span>
                <span>{selectedOrder.deliveryFee === 0 ? 'Free' : `$${selectedOrder.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
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
