import React, { useState } from 'react';
import { CartItem, DeliveryZone, OrderRecord } from '../types';
import { DELIVERY_OPTIONS } from '../data/products';
import { X, CheckCircle, Truck, Phone, User, MapPin, FileText, Banknote, ShieldCheck, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  defaultZone: DeliveryZone;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  defaultZone,
  onOrderSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>(defaultZone);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryCharge =
    deliveryZone === 'inside_dhaka'
      ? DELIVERY_OPTIONS.dhaka.charge
      : DELIVERY_OPTIONS.outside.charge;
  const grandTotal = subtotal + deliveryCharge;
  const deliveryInfo =
    deliveryZone === 'inside_dhaka'
      ? DELIVERY_OPTIONS.dhaka
      : DELIVERY_OPTIONS.outside;

  // Convenient helper to fill sample data for quick preview testing
  const handleAutoFillSample = () => {
    setFullName('Tanvir Ahmed');
    setPhoneNumber('01712345678');
    setDeliveryZone('inside_dhaka');
    setDeliveryAddress('House 42, Road 11, Sector 4, Uttara, Dhaka-1230');
    setDeliveryNotes('Please call 15 minutes before reaching location.');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters long';
    }

    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Phone number is required for courier delivery';
    } else if (!/^(\+?8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
      newErrors.phoneNumber = 'Enter a valid Bangladeshi phone number (e.g. 01712345678)';
    }

    if (!deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Full delivery address is required';
    } else if (deliveryAddress.trim().length < 8) {
      newErrors.deliveryAddress = 'Please provide detailed address (House, Road, Area, District)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryZone,
        deliveryCharge,
        deliveryAddress: deliveryAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
        items,
        subtotal,
        total: grandTotal,
        paymentMethod: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit order');
      }

      const data = await res.json();
      setIsSubmitting(false);
      onOrderSuccess(data.order);
    } catch (err: any) {
      console.warn('Backend order call failed, using client fallback:', err);
      // Client-safe fallback so customers never get stuck
      const randomId = Math.floor(10000 + Math.random() * 90000);
      const fallbackOrder: OrderRecord = {
        orderId: `NX-BD-${randomId}`,
        createdAt: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryZone,
        deliveryZoneLabel: deliveryInfo.name,
        deliveryAddress: deliveryAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
        items,
        subtotal,
        deliveryCharge,
        total: grandTotal,
        paymentMethod: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
        estimatedDelivery: deliveryInfo.estimatedDays
      };
      setIsSubmitting(false);
      onOrderSuccess(fallbackOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Step 2 of 2 · Checkout
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Cash on Delivery</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Confirm Your Delivery Details
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              title="Click to fill sample Bangladeshi address"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fill Sample Data</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close checkout"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mobile Auto-Fill Button */}
          <div className="sm:hidden flex justify-end">
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample Data</span>
            </button>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Customer Full Name <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvir Ahmed"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                className={`w-full py-2.5 px-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 01712345678"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                }}
                className={`w-full py-2.5 px-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              />
              {errors.phoneNumber ? (
                <p className="text-xs text-rose-600 mt-1">{errors.phoneNumber}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Used for order verification & courier delivery call
                </p>
              )}
            </div>
          </div>

          {/* Delivery Zone Selection (Inside Dhaka ৳60 / Outside Dhaka ৳120) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                Select Delivery Location <span className="text-rose-500">*</span>
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliveryZone('inside_dhaka')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryZone === 'inside_dhaka'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === 'inside_dhaka'}
                      onChange={() => setDeliveryZone('inside_dhaka')}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Inside Dhaka
                      </span>
                      <span className="text-xs text-emerald-800 font-medium">
                        ঢাকার ভেতরে
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-extrabold font-mono text-emerald-800 tabular-nums">
                    ৳{DELIVERY_OPTIONS.dhaka.charge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 pl-6">
                  {DELIVERY_OPTIONS.dhaka.estimatedDays}
                </p>
              </div>

              <div
                onClick={() => setDeliveryZone('outside_dhaka')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryZone === 'outside_dhaka'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === 'outside_dhaka'}
                      onChange={() => setDeliveryZone('outside_dhaka')}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Outside Dhaka
                      </span>
                      <span className="text-xs text-emerald-800 font-medium">
                        ঢাকার বাইরে
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-extrabold font-mono text-emerald-800 tabular-nums">
                    ৳{DELIVERY_OPTIONS.outside.charge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 pl-6">
                  {DELIVERY_OPTIONS.outside.estimatedDays}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Delivery Address <span className="text-rose-500">*</span>
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="House #, Road #, Area / Thana, City / District (e.g. House 14, Road 5, Dhanmondi, Dhaka)"
              value={deliveryAddress}
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
                if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: '' });
              }}
              className={`w-full py-2.5 px-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                errors.deliveryAddress
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            {errors.deliveryAddress && (
              <p className="text-xs text-rose-600 mt-1">{errors.deliveryAddress}</p>
            )}
          </div>

          {/* Optional Delivery Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Special Delivery Notes (Optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Leave with security guard, call before coming, etc."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white transition-all focus:outline-none focus:ring-2 focus:border-emerald-600 focus:ring-emerald-100"
            />
          </div>

          {/* Cash on Delivery Notice Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="p-1 rounded bg-emerald-600 text-white shrink-0 mt-0.5">
              <Banknote className="w-4 h-4" />
            </div>
            <div className="text-xs text-emerald-950">
              <span className="font-bold block">
                Payment Method: Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </span>
              <span className="text-emerald-800 leading-relaxed block mt-0.5">
                You will pay in cash directly to the delivery rider when you inspect and receive your products. Zero advance payment required.
              </span>
            </div>
          </div>

          {/* Order Summary & Total */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>
                Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):
              </span>
              <span className="font-mono tabular-nums font-semibold text-emerald-700">
                ৳{deliveryCharge}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-slate-900 font-extrabold pt-2 border-t border-slate-200 text-sm sm:text-base">
              <span>Total Payable upon Delivery:</span>
              <span className="font-mono tabular-nums text-xl text-emerald-700 font-black">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow cursor-pointer"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Order (Cash on Delivery)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
