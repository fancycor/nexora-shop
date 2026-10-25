import React, { useState, useEffect } from 'react';
import { OrderRecord, OrderStatus, SystemStatus } from '../types';
import {
  Lock,
  LogOut,
  Database,
  Search,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  Package,
  Trash2,
  Printer,
  ChevronDown,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface AdminOrdersDashboardProps {
  onBackToShop: () => void;
  onOpenSupabaseGuide: () => void;
  systemStatus: SystemStatus | null;
  onRefreshSystemStatus: () => void;
}

export const AdminOrdersDashboard: React.FC<AdminOrdersDashboardProps> = ({
  onBackToShop,
  onOpenSupabaseGuide,
  systemStatus,
  onRefreshSystemStatus
}) => {
  // Auth state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('nexora_admin_token');
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders data state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Print order state
  const [selectedOrderToPrint, setSelectedOrderToPrint] = useState<OrderRecord | null>(null);

  // Load orders when authenticated
  const fetchOrders = async () => {
    if (!authToken) return;
    setIsLoadingOrders(true);
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.status === 401) {
        // Expired token
        sessionStorage.removeItem('nexora_admin_token');
        setAuthToken(null);
        setLoginError('Session expired. Please log in again.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchOrders();
    }
  }, [authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLogoutNotice(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      sessionStorage.setItem('nexora_admin_token', data.token);
      setAuthToken(data.token);
      setPassword('');
      onRefreshSystemStatus();
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }
    } catch {
      // ignore
    }
    sessionStorage.removeItem('nexora_admin_token');
    setAuthToken(null);
    setLogoutNotice('You have been securely logged out. Please sign in to access the Admin Dashboard.');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!authToken) return;
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!authToken) return;
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId && o.id !== orderId));
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || !o.status).length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || (order.status || 'Pending') === statusFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderId.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.phoneNumber.includes(q) ||
      order.deliveryAddress.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Dispatched':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Pending':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // If not authenticated, render Login Screen
  if (!authToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Admin Gateway
            </span>
          </div>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Nexora Admin Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with your admin master credentials to manage Cash on Delivery orders
            </p>
          </div>

          {logoutNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{logoutNotice}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 pl-3 pr-10 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{loginError}</p>
              )}
            </div>

            {/* Quick helper for user evaluation */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Developer / Preview Default:</span>
                <span className="text-slate-600">
                  Password is set to <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-800 border border-emerald-200">nexora2026</code>.
                  (You can customize this in <code>.env</code> with <code>ADMIN_PASSWORD</code>).
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:bg-emerald-400"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Customer personal addresses & phone numbers are protected from public access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Storefront</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                N
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-900 leading-tight">
                  Nexora Shop <span className="text-emerald-700 font-semibold">Admin</span>
                </h1>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Orders & Cash on Delivery Management
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Database Status Tag */}
            <button
              onClick={onOpenSupabaseGuide}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                systemStatus?.supabaseConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {systemStatus?.supabaseConfigured ? 'Supabase: Cloud Active' : 'Supabase: Not Configured'}
              </span>
              <span className="sm:hidden">
                {systemStatus?.supabaseConfigured ? 'Cloud' : 'Local'}
              </span>
            </button>

            {/* Clearly Visible Secure Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
              title="Securely log out and return to Admin Login"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Persistence Notice Banner if Supabase not configured */}
        {!systemStatus?.supabaseConfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs sm:text-sm">
                  Orders are currently stored in local server memory (Test Mode)
                </p>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  To save customer orders permanently across server restarts and prevent data loss, connect your free Supabase database.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSupabaseGuide}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              View Setup Steps
            </button>
          </div>
        )}

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Orders
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
                {totalOrders}
              </span>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Received from customers</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tabular-nums">
                ৳{totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600">BDT</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Cash on delivery collection</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Pending Dispatch
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tabular-nums">
                {pendingOrders}
              </span>
              <span className="text-xs font-bold text-amber-600">Orders</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Need courier booking</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Delivered
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
                {deliveredOrders}
              </span>
              <span className="text-xs font-bold text-emerald-600">Fulfilled</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Payment completed</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['All', 'Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box & Refresh */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order #, name, phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full py-1.5 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <button
              onClick={fetchOrders}
              disabled={isLoadingOrders}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Refresh orders list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No orders found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {orders.length === 0
                  ? 'No customer orders have been placed yet. Place a test order from the storefront!'
                  : 'No orders match your selected filters. Try changing or clearing filters.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId || order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Order Card Header */}
                <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900">
                      {order.orderId}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {order.createdAt}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-bold text-emerald-800">
                      {order.deliveryZoneLabel} (৳{order.deliveryCharge})
                    </span>
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) =>
                          handleUpdateStatus(order.orderId || order.id || '', e.target.value as OrderStatus)
                        }
                        disabled={updatingOrderId === order.orderId}
                        className={`text-xs font-bold py-1.5 pl-3 pr-7 rounded-xl border appearance-none cursor-pointer focus:outline-none transition-colors ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>

                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Print order slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order.orderId || order.id || '')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete order record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Order Card Body */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Information (Protected) */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Customer Details
                    </span>
                    <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                    <a
                      href={`tel:${order.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 text-emerald-700 font-mono font-bold hover:underline"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {order.phoneNumber}
                    </a>
                    <div className="flex items-start gap-1.5 text-slate-600 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{order.deliveryAddress}</span>
                    </div>
                    {order.deliveryNotes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                        <strong>Note:</strong> &ldquo;{order.deliveryNotes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Ordered Items */}
                  <div className="space-y-2 text-xs md:col-span-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                    <div className="space-y-2 divide-y divide-slate-100 max-h-40 overflow-y-auto pr-1">
                      {order.items.map(({ product, quantity }, idx) => (
                        <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="truncate">
                              <span className="font-semibold text-slate-900 block truncate text-xs">
                                {product.name}
                              </span>
                              <span className="text-[10px] text-slate-400">Qty: {quantity}</span>
                            </div>
                          </div>
                          <span className="font-mono tabular-nums text-slate-700 font-bold shrink-0 ml-2">
                            ৳{(product.price * quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between space-y-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Payment & Collection
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-mono tabular-nums font-semibold">
                          ৳{order.subtotal?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee ({order.deliveryZoneLabel}):</span>
                        <span className="font-mono tabular-nums font-semibold">
                          ৳{order.deliveryCharge}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-black text-sm pt-1.5 border-t border-slate-200">
                        <span>Collect on Delivery:</span>
                        <span className="font-mono tabular-nums text-emerald-800 text-base">
                          ৳{order.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] text-emerald-700 font-semibold bg-emerald-50 p-1.5 rounded text-center">
                      Cash on Delivery · Pay upon arrival
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Admin Bar with prominent Logout option */}
        <div className="mt-12 pt-6 pb-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium">Admin session active (24h token)</span>
            <span className="text-slate-300">·</span>
            <span>Customer addresses and phones are protected</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              Back to Storefront
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold transition-all shadow-xs hover:shadow cursor-pointer"
              title="Securely log out of admin session"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
