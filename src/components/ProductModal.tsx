import React, { useState } from 'react';
import { Product, DELIVERY_OPTIONS } from '../data/products';
import { X, ShoppingBag, Check, ShieldCheck, Truck, Star } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  quantityInCart: number;
  onClose: () => void;
  onAddToCartWithQty: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  quantityInCart,
  onClose,
  onAddToCartWithQty,
  onOpenCart
}) => {
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const discountAmount = product.originalPrice - product.price;

  const handleAdd = () => {
    onAddToCartWithQty(product, selectedQty);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-4/3 md:aspect-auto bg-slate-100 min-h-[280px]">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {discountAmount > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                Save ৳{discountAmount}
              </span>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-slate-800 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-emerald-800 mb-3">{product.bengaliName}</p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Cash on Delivery
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Key Specs */}
              <div className="mb-6 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Highlights
                </p>
                <ul className="text-xs text-slate-700 space-y-1">
                  {product.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery info preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Delivery Charges & Speed:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Inside Dhaka: ৳{DELIVERY_OPTIONS.dhaka.charge}</span>
                    <span className="text-slate-500">{DELIVERY_OPTIONS.dhaka.estimatedDays}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Outside Dhaka: ৳{DELIVERY_OPTIONS.outside.charge}</span>
                    <span className="text-slate-500">{DELIVERY_OPTIONS.outside.estimatedDays}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Stepper & Add Action */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-600">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                    disabled={selectedQty <= 1}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm font-mono tabular-nums text-slate-900">
                    {selectedQty}
                  </span>
                  <button
                    onClick={() => setSelectedQty((prev) => Math.min(10, prev + 1))}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Item Total: <span className="font-bold text-slate-900 font-mono">৳{(product.price * selectedQty).toLocaleString()}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Added {selectedQty} item(s)!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart (৳{(product.price * selectedQty).toLocaleString()})</span>
                    </>
                  )}
                </button>

                {quantityInCart > 0 && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View Cart ({quantityInCart})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
