import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS, Product } from './data/products';
import { CartItem, DeliveryZone, OrderRecord, SystemStatus } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { DeliveryAndCODInfo } from './components/InfoSections';
import { Footer } from './components/Footer';
import { AdminOrdersDashboard } from './components/AdminOrdersDashboard';
import { SupabaseSetupGuideModal } from './components/SupabaseSetupGuideModal';
import { ShoppingBag, ArrowUpDown, Filter, Check, ArrowRight, Database, Lock } from 'lucide-react';

export default function App() {
  // Current view: 'shop' or 'admin'
  const [currentView, setCurrentView] = useState<'shop' | 'admin'>('shop');

  // System status (Supabase connectivity & mode)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState(false);

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Delivery zone state
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>(() => {
    try {
      const saved = localStorage.getItem('nexora_delivery_zone');
      return saved === 'outside_dhaka' ? 'outside_dhaka' : 'inside_dhaka';
    } catch {
      return 'inside_dhaka';
    }
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch system status on mount
  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (err) {
      console.warn('System status check skipped (offline or initial loading):', err);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexora_cart', JSON.stringify(cartItems));
    } catch {
      // storage unavailable
    }
  }, [cartItems]);

  // Sync deliveryZone to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexora_delivery_zone', deliveryZone);
    } catch {
      // storage unavailable
    }
  }, [deliveryZone]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Checkout flow handlers
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    setCartItems([]); // Clear cart upon successful order
    fetchSystemStatus(); // Refresh status
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'shop') {
      setCurrentView('shop');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Derived metrics
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Filtered & Sorted products
  const categories = useMemo(() => {
    const set = new Set(PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.bengaliName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // If in Admin Dashboard view
  if (currentView === 'admin') {
    return (
      <>
        <AdminOrdersDashboard
          onBackToShop={() => setCurrentView('shop')}
          onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
          systemStatus={systemStatus}
          onRefreshSystemStatus={fetchSystemStatus}
        />
        <SupabaseSetupGuideModal
          isOpen={isSupabaseGuideOpen}
          onClose={() => setIsSupabaseGuideOpen(false)}
          isConfigured={Boolean(systemStatus?.supabaseConfigured)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-150">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-emerald-400 hover:text-emerald-300 underline font-bold cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setCurrentView('admin')}
        supabaseConfigured={systemStatus?.supabaseConfigured}
      />

      {/* Storefront Database Info Notice for Owner (Subtle) */}
      {!systemStatus?.supabaseConfigured && (
        <div className="bg-amber-100/90 text-amber-950 border-b border-amber-200 py-1 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="font-bold">Store Admin Notice:</span>
              <span className="text-amber-800">
                Supabase credentials not configured. Customer orders run in test memory mode.
              </span>
            </div>
            <button
              onClick={() => setIsSupabaseGuideOpen(true)}
              className="text-amber-900 font-bold underline hover:text-amber-950 shrink-0 text-xs cursor-pointer"
            >
              Setup Supabase &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Hero & Search Banner */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        totalResults={filteredProducts.length}
      />

      {/* Main Product Catalog Section */}
      <main id="products-catalog" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
        {/* Section Header & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Featured Catalog
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {filteredProducts.length} Products
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cash on delivery inside Dhaka (৳60) and outside Dhaka (৳120)
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label htmlFor="sort-select" className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* 6 Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find((item) => item.product.id === product.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={qty}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onQuickView={setActiveModalProduct}
                />
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find any item matching &ldquo;{searchQuery}&rdquo;. Try another keyword like &ldquo;Earbuds&rdquo;, &ldquo;Panjabi&rdquo;, &ldquo;Saree&rdquo;, or reset the search.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Floating Mobile Cart Summary Bar */}
        {cartCount > 0 && !isCartOpen && (
          <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl border border-emerald-500 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">{cartCount} items selected</span>
                  <span className="text-[11px] text-emerald-100">Click to view cart & checkout</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm">৳{cartTotal.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Informational Sections: Delivery charges breakdown & Cash on Delivery policy */}
        <DeliveryAndCODInfo />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        supabaseConfigured={systemStatus?.supabaseConfigured}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        deliveryZone={deliveryZone}
        onSelectDeliveryZone={setDeliveryZone}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal (Cash on Delivery Form) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        defaultZone={deliveryZone}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Product Quick View Modal */}
      <ProductModal
        product={activeModalProduct}
        quantityInCart={
          activeModalProduct
            ? cartItems.find((i) => i.product.id === activeModalProduct.id)?.quantity || 0
            : 0
        }
        onClose={() => setActiveModalProduct(null)}
        onAddToCartWithQty={handleAddToCart}
        onOpenCart={() => {
          setActiveModalProduct(null);
          setIsCartOpen(true);
        }}
      />

      {/* Order Confirmation Screen */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* Supabase Setup Guide Modal */}
      <SupabaseSetupGuideModal
        isOpen={isSupabaseGuideOpen}
        onClose={() => setIsSupabaseGuideOpen(false)}
        isConfigured={Boolean(systemStatus?.supabaseConfigured)}
      />
    </div>
  );
}
