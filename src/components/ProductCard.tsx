import React, { useState } from 'react';
import { Product } from '../data/products';
import { ShoppingCart, Star, Plus, Minus, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onQuickView
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Product Image Area with Zero-Broken-Image Fallback */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-emerald-50 text-emerald-800 text-center">
            <span className="font-bold text-sm">{product.name}</span>
            <span className="text-xs text-emerald-600 mt-1">{product.category}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => onQuickView(product)}
          />
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView(product)}
          aria-label={`View details for ${product.name}`}
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs shadow-md transition-all duration-200 cursor-pointer ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
            ৳{product.originalPrice - product.price} OFF ({discountPercent}%)
          </div>
        )}

        {/* In-Stock Indicator */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs border border-slate-200">
          In Stock
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <button
            onClick={() => onQuickView(product)}
            className="text-left font-bold text-slate-900 text-lg hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer w-full"
          >
            {product.name}
          </button>
          <p className="text-xs text-emerald-800/80 font-medium mb-2">{product.bengaliName}</p>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {product.tagline}
          </p>
        </div>

        {/* Price and Cart Actions */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
              <span className="ml-2 text-xs text-slate-400 line-through font-mono tabular-nums">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            </div>
            {product.unitOrWarranty && (
              <span className="text-[11px] text-slate-500 truncate max-w-[130px]" title={product.unitOrWarranty}>
                {product.unitOrWarranty}
              </span>
            )}
          </div>

          {/* Clearly Visible Add to Cart or Stepper */}
          {quantityInCart === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1.5">
              <button
                onClick={() => onUpdateQuantity(product.id, -1)}
                aria-label={`Decrease quantity of ${product.name}`}
                className="w-8 h-8 rounded-lg bg-white border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center px-2">
                <span className="text-xs text-emerald-800 font-semibold block leading-none">In Cart</span>
                <span className="text-sm font-extrabold text-emerald-950 font-mono tabular-nums">
                  {quantityInCart}
                </span>
              </div>

              <button
                onClick={() => onUpdateQuantity(product.id, 1)}
                aria-label={`Increase quantity of ${product.name}`}
                className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
