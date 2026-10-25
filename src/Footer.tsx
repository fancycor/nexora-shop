import React from 'react';
import { Truck, ShieldCheck, Banknote, Database, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenSupabaseGuide?: () => void;
  supabaseConfigured?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenSupabaseGuide,
  supabaseConfigured
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="text-xl font-black text-slate-900">
                Nexora<span className="text-emerald-600">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern Bangladeshi e-commerce platform committed to authentic electronics, traditional lifestyle, and dependable Cash on Delivery shopping.
            </p>
            <div className="pt-2 text-xs text-slate-500 font-medium">
              Dhaka, Bangladesh
            </div>
          </div>

          {/* Delivery & Charges */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Delivery Rates
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>Inside Dhaka: <strong className="text-emerald-700">৳60</strong> (24-48 Hours)</li>
              <li>Outside Dhaka: <strong className="text-emerald-700">৳120</strong> (2-4 Days)</li>
              <li>100% Cash on Delivery</li>
              <li>Careful Protective Packaging</li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer Support
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>Helpline: 01700-000000</li>
              <li>Support: support@nexorashop.bd</li>
              <li>Hours: Sat - Thu (9 AM - 9 PM)</li>
              <li>Easy 7-Day Return Policy</li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Shopping Guarantee
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero advance payment needed</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Original & checked before delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Express courier across all 64 districts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Nexora Shop Bangladesh. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Orders Portal</span>
              </button>
            )}
            {onOpenSupabaseGuide && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenSupabaseGuide}
                  className="hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Supabase: {supabaseConfigured ? '🟢 Connected' : '⚡ Setup Guide'}
                  </span>
                </button>
              </>
            )}
            <span>·</span>
            <span>Cash on Delivery Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
