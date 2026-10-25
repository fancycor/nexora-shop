import React from 'react';
import { OrderRecord } from '../types';
import { CheckCircle2, Printer, ShoppingBag, Truck, MapPin, Phone, User, Calendar, FileText } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-200">
              Order Confirmed · অর্ডার নিশ্চিত হয়েছে
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Thank You for Shopping with Nexora!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
              Your order has been received and is being prepared for Cash on Delivery dispatch.
            </p>
          </div>
        </div>

        {/* Invoice / Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Order Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Order Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{order.orderId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Order Date</span>
              <span className="font-semibold text-slate-800">{order.createdAt}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Payment</span>
              <span className="font-semibold text-emerald-800">Cash on Delivery</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Time</span>
              <span className="font-semibold text-slate-800">{order.estimatedDelivery}</span>
            </div>
          </div>

          {/* Delivery & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Customer Contact
              </span>
              <p className="text-slate-800 font-semibold">{order.customerName}</p>
              <p className="text-slate-600 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-slate-400" />
                {order.phoneNumber}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Delivery Destination
              </span>
              <div className="text-slate-700">
                <span className="font-semibold text-emerald-800 block mb-0.5">
                  {order.deliveryZoneLabel} (Fee: ৳{order.deliveryCharge})
                </span>
                <p className="text-slate-600 leading-relaxed">{order.deliveryAddress}</p>
                {order.deliveryNotes && (
                  <p className="text-slate-500 italic text-[11px] mt-1 pt-1 border-t border-slate-100">
                    Note: &ldquo;{order.deliveryNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Products Itemized */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="p-3 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{product.name}</span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {product.bengaliName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[11px] block">
                      ৳{product.price} × {quantity}
                    </span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ৳{(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                ৳{order.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge ({order.deliveryZoneLabel}):</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                ৳{order.deliveryCharge}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-emerald-200 text-emerald-950 font-extrabold text-sm sm:text-base">
              <span>Total Payable with Cash upon Delivery:</span>
              <span className="font-mono tabular-nums text-xl text-emerald-800 font-black">
                ৳{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
