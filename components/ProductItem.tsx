"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Check, PackageX } from 'lucide-react';
import ProductImage from './ProductImage';
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

  const discount = getDiscountForTier(tier);
  const tierPrice = calculateTierPrice(prod.basePrice, tier);
  const outOfStock = isProductOutOfStock(prod);
  const isLowStock =
    !outOfStock && prod.stockQuantity > 0 && prod.stockQuantity < LOW_STOCK_THRESHOLD;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(prod.id, prod.name);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const buttonClass = `w-full border flex items-center justify-center gap-2 py-3.5 font-bold transition-all duration-300 touch-press active:scale-[0.96] min-h-[44px] ${
    outOfStock
      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
      : justAdded
        ? 'bg-green-accent text-white border-green-accent'
        : 'bg-secondary text-blue-deep border-orange-accent/20 group-hover:bg-orange-accent group-hover:text-white'
  }`;

  const statusLabel = outOfStock ? 'نفدت الكمية' : prod.status;
  const statusClass = outOfStock
    ? 'text-red-500'
    : prod.status === 'متوفر'
      ? 'text-green-accent'
      : 'text-orange-accent';

  const buttonLabel = outOfStock ? (
    <>
      <PackageX size={20} aria-hidden="true" />
      نفدت الكمية
    </>
  ) : justAdded ? (
    <>
      <Check size={20} aria-hidden="true" />
      تمت الإضافة
    </>
  ) : (
    <>
      <MessageCircle size={20} aria-hidden="true" />
      إضافة للطلب
    </>
  );

  return (
    <motion.article
      className={`bg-primary overflow-hidden group flex flex-col h-full border border-gray-100 hover:luxury-shadow transition-colors duration-300 gpu-accelerated touch-press ${
        outOfStock ? 'opacity-90' : 'hover:border-orange-accent active:scale-[0.98]'
      }`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4 }}
      whileTap={outOfStock ? undefined : { scale: 0.98 }}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="h-56 relative overflow-hidden bg-gray-100 shrink-0">
        <ProductImage
          src={prod.image}
          sku={prod.sku}
          category={prod.category}
          alt={prod.name}
          className={`transition-transform duration-700 ease-out ${
            outOfStock ? 'grayscale-[30%]' : 'group-hover:scale-105'
          } object-cover`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-3 right-3 glass-panel text-blue-deep text-xs font-bold px-3 py-1 border border-orange-accent/30">
          {prod.category}
        </div>
        <div className="absolute top-3 left-3 bg-blue-deep/90 text-white text-[10px] font-bold px-2 py-1 font-mono">
          {prod.sku}
        </div>
        {isLowStock && (
          <div className="absolute bottom-3 right-3 bg-orange-accent text-white text-[10px] font-bold px-2 py-1 font-cairo">
            متبقي {prod.stockQuantity} {prod.unitLabel}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white">
        <h3 className="font-cairo font-bold text-lg sm:text-xl text-text-dark mb-2 line-clamp-2">
          {prod.name}
        </h3>

        {prod.descriptionAr && !isLowStock && (
          <p className="text-xs text-gray-500 font-tajawal leading-relaxed line-clamp-2 mb-3">
            {prod.descriptionAr}
          </p>
        )}

        <div className="min-h-[52px] mb-3">
          {loading ? (
            <div className="h-8 w-24 bg-gray-100 skeleton-shimmer rounded-sm" aria-hidden="true" />
          ) : (
            <>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-cairo font-black text-xl sm:text-2xl text-blue-primary">
                  {tierPrice.toFixed(2)} ر.س
                </span>
                <span className="text-sm text-gray-500 font-tajawal">/ {prod.unitLabel}</span>
                {discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    {prod.basePrice.toFixed(2)} ر.س
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-xs font-bold text-green-accent">
                  خصم {tierLabel} ({Math.round(discount * 100)}%)
                </span>
              )}
            </>
          )}
        </div>

        <span
          className={`text-sm font-semibold mb-4 inline-flex items-center gap-2 ${statusClass}`}
        >
          <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
          {statusLabel}
        </span>

        <div className="mt-auto pt-2">
          {pointerFine ? (
            <MagneticMotionButton
              onClick={handleAdd}
              disabled={outOfStock}
              aria-label={
                outOfStock
                  ? `${prod.name} — نفدت الكمية`
                  : `إضافة ${prod.name} إلى قائمة التسعير`
              }
              className={buttonClass}
            >
              {buttonLabel}
            </MagneticMotionButton>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              aria-label={
                outOfStock
                  ? `${prod.name} — نفدت الكمية`
                  : `إضافة ${prod.name} إلى قائمة التسعير`
              }
              className={buttonClass}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
