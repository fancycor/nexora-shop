import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, PhoneCall } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  supabaseConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onNavigateSection,
  onOpenAdmin,
  supabaseConfigured
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      {/* Top Notice Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-emerald-400">🇧🇩 Nexora Shop</span>
            <span className="text-emerald-700 hidden sm:inline">|</span>
            <span className="text-emerald-200">
              Cash on Delivery Available Nationwide · Inside Dhaka ৳60 · Outside Dhaka ৳120
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300 shrink-0">
            <button
              onClick={onOpenAdmin}
              className="text-xs font-semibold text-emerald-200 hover:text-white bg-emerald-900/90 hover:bg-emerald-800 px-2.5 py-0.5 rounded border border-emerald-700/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Admin Portal</span>
              {supabaseConfigured ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Supabase Connected" />
              ) : (
                <span className="text-[10px] text-amber-300 font-mono">(Local)</span>
              )}
            </button>
            <span className="text-emerald-800 hidden md:inline">·</span>
            <div className="hidden md:flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                Fast Dispatch
              </span>
              <span className="text-emerald-800">·</span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                01700-000000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar - 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateSection('products-catalog')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-emerald-700 transition-colors">
              N
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Nexora<span className="text-emerald-600">.</span>
              </span>
              <span className="block text-[11px] font-medium text-emerald-700 -mt-1 tracking-wider uppercase">
                Shop Bangladesh
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean single line) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onNavigateSection('products-catalog')}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            All Products
          </button>
          <button
            onClick={() => onNavigateSection('delivery-info')}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Delivery Charges (৳60/৳120)
          </button>
          <button
            onClick={() => onNavigateSection('cod-policy')}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cash on Delivery
          </button>
          <button
            onClick={onOpenAdmin}
            className="text-emerald-700 hover:text-emerald-900 font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
          >
            <span>Admin Orders</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action (Shopping Cart) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-medium">Cart</span>
            {cartTotal > 0 && (
              <span className="border-l border-emerald-400/50 pl-2 font-mono tabular-nums text-white text-xs">
                ৳{cartTotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
