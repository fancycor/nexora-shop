import React from 'react';
import { Truck, Banknote, ShieldCheck, Clock, MapPin, Check } from 'lucide-react';
import { DELIVERY_OPTIONS } from '../data/products';

export const DeliveryAndCODInfo: React.FC = () => {
  return (
    <div className="space-y-16 py-12">
      {/* Delivery Charges Information */}
      <section id="delivery-info" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Nationwide Delivery Rates
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Transparent & Affordable Shipping Across Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We partner with trusted express couriers (Steadfast, Pathao, RedX, Paperfly) to deliver swiftly to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Dhaka Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500/40 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    Capital Metro Express
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {DELIVERY_OPTIONS.dhaka.name} ({DELIVERY_OPTIONS.dhaka.bengaliName})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Covers all Dhaka North & South city corporation areas.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-700 font-mono tabular-nums">
                    ৳{DELIVERY_OPTIONS.dhaka.charge}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-medium">flat delivery rate</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivery timeline: <strong>{DELIVERY_OPTIONS.dhaka.estimatedDays}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery supported for all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct home & office address delivery</span>
                </div>
              </div>
            </div>

            {/* Outside Dhaka Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    Nationwide Courier
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {DELIVERY_OPTIONS.outside.name} ({DELIVERY_OPTIONS.outside.bengaliName})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Covers Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh & all districts.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                    ৳{DELIVERY_OPTIONS.outside.charge}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-medium">flat delivery rate</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivery timeline: <strong>{DELIVERY_OPTIONS.outside.estimatedDays}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery at home or local hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Safe bubble wrap & corrugated packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Cash on Delivery Works */}
      <section id="cod-policy" className="bg-slate-100/60 py-12 scroll-mt-24 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Simple & Risk-Free Shopping
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How Cash on Delivery (COD) Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              No credit card or advance bKash/Nagad required. Shop with 100% peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Select & Checkout</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add your favorite items to cart, select Inside or Outside Dhaka, and provide your name, phone number, and address.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Rider Call & Dispatch</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our logistics partner packages your order securely. The delivery rider will call your phone number before arriving.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pay Cash at Doorstep</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive and inspect your parcel. Hand over the exact cash amount (subtotal + delivery fee) to the rider. Done!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Care / Support */}
      <section id="contact-support" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-8 rounded-3xl bg-emerald-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Dedicated Customer Care
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Have Questions About an Order?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Our Dhaka-based support team is available Saturday to Thursday (9:00 AM - 9:00 PM) to assist you with order status, returns, and product guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/20 text-center">
              <span className="text-[10px] text-emerald-300 block uppercase">Phone / WhatsApp</span>
              <span className="font-mono font-bold text-sm text-white">+880 1700-000000</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/20 text-center">
              <span className="text-[10px] text-emerald-300 block uppercase">Email Support</span>
              <span className="font-mono font-bold text-sm text-white">support@nexorashop.bd</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
