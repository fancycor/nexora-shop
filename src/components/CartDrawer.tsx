import React from 'react';
import { CartItem, DeliveryZone } from '../types';
import { DELIVERY_OPTIONS } from '../data/products';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldAlert } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryZone: DeliveryZone;
  onSelectDeliveryZone: (zone: DeliveryZone) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  deliveryZone,
  onSelectDeliveryZone,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryCharge =
    deliveryZone === 'inside_dhaka'
      ? DELIVERY_OPTIONS.dhaka.charge
      : DELIVERY_OPTIONS.outside.charge;
  const grandTotal = items.length > 0 ? subtotal + deliveryCharge : 0;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Shopping Cart</h2>
              <p className="text-xs text-slate-500">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded transition-colors cursor-pointer"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover our top 6 handpicked products for Bangladesh and add your favorites to checkout.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        {product.bengaliName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
                        ৳{(product.price * quantity).toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          (৳{product.price} × {quantity})
                        </span>
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-md shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-slate-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Delivery Calculator & Totals */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            {/* Delivery Charge Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Select Delivery Location:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Automatic calculation</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDeliveryZone('inside_dhaka')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    deliveryZone === 'inside_dhaka'
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Inside Dhaka</span>
                    <span className="text-xs font-mono font-bold text-emerald-700">৳60</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">24-48 Hours delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDeliveryZone('outside_dhaka')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    deliveryZone === 'outside_dhaka'
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Outside Dhaka</span>
                    <span className="text-xs font-mono font-bold text-emerald-700">৳120</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">2-4 Days nationwide</span>
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItemCount} items):</span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  ৳{deliveryCharge}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 text-sm font-extrabold pt-2 border-t border-slate-200">
                <span>Total Amount (সবমিলিয়ে):</span>
                <span className="font-mono tabular-nums text-lg text-emerald-800">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* COD reassurance */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-100/60 text-emerald-900 text-[11px] font-medium">
              <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cash on Delivery: Pay in cash when you receive your parcel.</span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
