import React from 'react';
import { Search, X, ShieldCheck, Truck, Banknote, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  totalResults: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  totalResults
}) => {
  return (
    <section className="bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-emerald-100/60 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trusted Online Shopping in Bangladesh</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Authentic Lifestyle, Tech & Tradition at <span className="text-emerald-600">Nexora</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Order authentic electronics, traditional Dhakai sarees, cotton panjabis, and pure ghani mustard oil with reliable Cash on Delivery nationwide.
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-sm rounded-2xl bg-white border-2 border-emerald-600/30 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
              <Search className="w-5 h-5 text-emerald-600 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search products (e.g. Earbuds, Panjabi, Smartwatch, Saree, Mustard Oil)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-3.5 px-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="mr-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-slate-500 mt-2 text-left px-2">
                Showing {totalResults} {totalResults === 1 ? 'result' : 'results'} for &ldquo;
                <span className="font-semibold text-slate-800">{searchQuery}</span>&rdquo;
              </p>
            )}
          </div>

          {/* Category Filter Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Trust Strip Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200/70 max-w-4xl mx-auto">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Swift Delivery</p>
              <p className="text-xs text-slate-500">Dhaka: ৳60 · Outside Dhaka: ৳120</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
              <p className="text-xs text-slate-500">Pay cash upon receiving parcel</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">100% Quality Checked</p>
              <p className="text-xs text-slate-500">Authentic products with warranty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
