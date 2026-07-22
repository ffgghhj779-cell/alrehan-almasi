"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Check, PackageX, Sparkles, Maximize2 } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductModal from './ProductModal';
import { useQuote } from './QuoteContext';
import { useAuth } from './AuthContext';
import { MagneticMotionButton } from './MagneticMotion';
import { usePointerFine } from '@/hooks/usePointerFine';
import { calculateTierPrice, getDiscountForTier } from '@/lib/supabase';
import { isProductOutOfStock, type Product } from '@/lib/products';

const LOW_STOCK_THRESHOLD = 10;

export function ProductItem({ prod, index }: { prod: Product; index: number }) {
  const { addItem } = useQuote();
  const { tier, tierLabel, loading } = useAuth();
  const pointerFine = usePointerFine();
  const [justAdded, setJustAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const discount = getDiscountForTier(tier);
  const tierPrice = calculateTierPrice(prod.basePrice, tier);
  const outOfStock = isProductOutOfStock(prod);
  const isLowStock =
    !outOfStock && prod.stockQuantity > 0 && prod.stockQuantity < LOW_STOCK_THRESHOLD;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      id: prod.id,
      name: prod.name,
      sku: prod.sku,
      unitPrice: tierPrice,
      unitLabel: prod.unitLabel,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const buttonClass = `w-full flex items-center justify-center gap-2 py-3 font-bold text-sm transition-all duration-300 touch-press active:scale-[0.96] min-h-[46px] rounded-xl ${
    outOfStock
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : justAdded
        ? 'bg-green-accent text-white shadow-lg shadow-green-accent/25'
        : 'bg-blue-deep text-white hover:bg-blue-primary shadow-md shadow-blue-deep/20'
  }`;

  const statusLabel = outOfStock ? 'نفدت الكمية' : prod.status;
  const statusClass = outOfStock
    ? 'bg-red-50 text-red-600 ring-red-100'
    : prod.status === 'متوفر'
      ? 'bg-green-50 text-green-accent ring-green-100'
      : 'bg-orange-50 text-orange-accent ring-orange-100';

  const buttonLabel = outOfStock ? (
    <>
      <PackageX size={18} aria-hidden="true" />
      نفدت الكمية
    </>
  ) : justAdded ? (
    <>
      <Check size={18} aria-hidden="true" />
      تمت الإضافة
    </>
  ) : (
    <>
      <ShoppingCart size={18} aria-hidden="true" />
      أضف للسلة
    </>
  );

  return (
    <>
      <article
        onClick={() => setIsModalOpen(true)}
        className={`group cursor-pointer flex flex-col h-full w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-white ring-1 ring-gray-100/90 luxury-shadow-lg transition-all duration-300 gpu-accelerated touch-press ${
          outOfStock
            ? 'opacity-90'
            : 'hover:ring-orange-accent/40 hover:luxury-shadow-lg active:scale-[0.98]'
        }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white to-gray-50 shrink-0 flex items-center justify-center p-4">
        {/* Dynamic Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {index === 0 && (
            <span className="px-2.5 py-1 bg-orange-accent text-white text-[10px] md:text-xs font-bold font-tajawal rounded-full shadow-md">
              الأكثر مبيعاً 🔥
            </span>
          )}
          {(prod.category === 'دجاج مبرد' || prod.category === 'مقطعات الدجاج') && (
            <span className="px-2.5 py-1 bg-blue-deep/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold font-tajawal rounded-full shadow-md">
              طازج يومياً ✨
            </span>
          )}
        </div>

        {/* Product Image */}
        <ProductImage
          src={prod.image}
          sku={prod.sku}
          category={prod.category}
          alt={prod.name}
          className={`transition-transform duration-700 ease-out object-contain w-full h-full drop-shadow-xl ${
            outOfStock ? 'grayscale-[40%] scale-100 opacity-80' : 'group-hover:scale-110'
          }`}
          sizes="(max-width: 640px) 100vw, 320px"
        />
        
        {/* Premium Watermark Logo Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity mix-blend-overlay">
          <span className="font-tajawal font-black text-2xl md:text-4xl tracking-widest text-black/50 transform -rotate-12 select-none border-y-2 border-black/30 px-6 py-2">
            الرهان الماسي
          </span>
        </div>

        {/* Action Button (Expand) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="absolute bottom-3 left-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white text-blue-deep pointer-events-auto"
          aria-label="تكبير الصورة"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow relative bg-white">

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-blue-deep px-4 py-2 rounded-full font-bold text-sm font-cairo flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
            <Maximize2 size={16} /> عرض التفاصيل
          </span>
        </div>

        {prod.originCountry && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 text-[9px] font-bold font-tajawal text-white/95 bg-black/50 rounded-md">
              {prod.originCountry}
            </span>
          </div>
        )}

        {isLowStock && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-orange-accent text-white text-[10px] font-bold font-cairo rounded-lg shadow-md">
            متبقي {prod.stockQuantity}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow min-w-0">
        <p className="text-[10px] font-mono text-gray-400 mb-1">{prod.sku}</p>
        <h3 className="font-cairo font-bold text-sm sm:text-base text-text-dark mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
          {prod.name}
        </h3>

        {prod.descriptionAr && (
          <p className="text-[11px] text-gray-500 font-tajawal leading-relaxed line-clamp-2 mb-3 hidden sm:block">
            {prod.descriptionAr}
          </p>
        )}

        {/* Price block */}
        <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 px-3 py-2.5 mb-3 min-h-[56px] flex flex-col justify-center">
          {loading ? (
            <div className="h-7 w-28 bg-gray-200 skeleton-shimmer rounded-md" aria-hidden="true" />
          ) : (
            <>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-cairo font-black text-xl text-blue-primary">
                  {tierPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 font-tajawal">ر.س / {prod.unitLabel}</span>
                {discount > 0 && (
                  <span className="text-xs text-gray-400 line-through mr-1">
                    {prod.basePrice.toFixed(2)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-[10px] font-bold text-green-accent mt-0.5">
                  خصم {tierLabel} {Math.round(discount * 100)}%
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold font-cairo px-2.5 py-1 rounded-full ring-1 ${statusClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
            {statusLabel}
          </span>
          {prod.packaging && (
            <span className="text-[10px] text-gray-400 font-tajawal truncate max-w-[50%]">
              {prod.packaging}
            </span>
          )}
        </div>

        <div className="mt-auto">
          {pointerFine ? (
            <MagneticMotionButton
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              disabled={outOfStock}
              aria-label={
                outOfStock ? `${prod.name} — نفدت الكمية` : `إضافة ${prod.name} إلى السلة`
              }
              className={buttonClass}
            >
              {buttonLabel}
            </MagneticMotionButton>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              disabled={outOfStock}
              aria-label={
                outOfStock ? `${prod.name} — نفدت الكمية` : `إضافة ${prod.name} إلى السلة`
              }
              className={buttonClass}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </article>
    <ProductModal 
      product={prod} 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
  </>
  );
}
