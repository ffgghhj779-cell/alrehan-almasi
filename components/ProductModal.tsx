"use client";

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X, ShoppingCart, Sparkles, AlertCircle } from 'lucide-react';
import { useQuote } from './QuoteContext';
import { useAuth } from './AuthContext';
import { calculateTierPrice, getDiscountForTier } from '@/lib/supabase';
import { isProductOutOfStock, type Product } from '@/lib/products';
import { useState, useEffect } from 'react';

type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useQuote();
  const { tier, tierLabel, loading } = useAuth();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product) return null;

  const discount = getDiscountForTier(tier);
  const tierPrice = calculateTierPrice(product.basePrice, tier);
  const outOfStock = isProductOutOfStock(product);
  const isLowStock = !outOfStock && product.stockQuantity > 0 && product.stockQuantity < 10;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: tierPrice,
      unitLabel: product.unitLabel,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-blue-deep/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl luxury-shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md text-gray-500 hover:text-red-500 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-50 shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-cover ${outOfStock ? 'grayscale-[40%]' : ''}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-cairo text-white bg-blue-deep/90 backdrop-blur-md rounded-full">
                      <Sparkles size={14} />
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col bg-white">
                  <p className="text-sm font-mono text-gray-400 mb-2">{product.sku}</p>
                  <h2 className="font-cairo font-black text-2xl md:text-3xl text-blue-deep mb-4 leading-tight">
                    {product.name}
                  </h2>
                  
                  {product.descriptionAr && (
                    <p className="text-gray-600 font-tajawal text-base md:text-lg leading-relaxed mb-6">
                      {product.descriptionAr}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {product.originCountry && (
                      <div className="bg-gray-50 rounded-2xl p-4 ring-1 ring-gray-100">
                        <p className="text-xs text-gray-400 font-cairo mb-1">بلد المنشأ</p>
                        <p className="font-bold text-blue-deep text-sm">{product.originCountry}</p>
                      </div>
                    )}
                    {product.packaging && (
                      <div className="bg-gray-50 rounded-2xl p-4 ring-1 ring-gray-100">
                        <p className="text-xs text-gray-400 font-cairo mb-1">التعبئة والتغليف</p>
                        <p className="font-bold text-blue-deep text-sm">{product.packaging}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    {/* Price Block */}
                    <div className="bg-orange-accent/5 rounded-2xl p-5 mb-6 ring-1 ring-orange-accent/20">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 font-cairo mb-1">سعر الجملة ({tierLabel})</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-cairo font-black text-3xl md:text-4xl text-orange-accent">
                              {tierPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-500 font-tajawal">ر.س / {product.unitLabel}</span>
                          </div>
                        </div>
                        {discount > 0 && (
                          <div className="text-right">
                            <span className="text-sm text-gray-400 line-through block">
                              {product.basePrice.toFixed(2)} ر.س
                            </span>
                            <span className="text-xs font-bold text-green-accent bg-green-50 px-2 py-1 rounded-md">
                              توفير {Math.round(discount * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {isLowStock && (
                        <div className="flex items-center gap-2 text-orange-accent text-sm font-bold font-cairo mt-3 bg-white px-3 py-2 rounded-xl">
                          <AlertCircle size={16} />
                          الكمية المتبقية محدودة: {product.stockQuantity}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={outOfStock}
                      className={`w-full flex items-center justify-center gap-3 py-4 md:py-5 font-cairo font-bold text-lg md:text-xl rounded-2xl transition-all duration-300 touch-press active:scale-[0.98] ${
                        outOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : justAdded
                          ? 'bg-green-accent text-white shadow-xl shadow-green-accent/30'
                          : 'bg-blue-deep text-white hover:bg-blue-primary shadow-xl shadow-blue-deep/30'
                      }`}
                    >
                      {outOfStock ? (
                        'نفدت الكمية'
                      ) : justAdded ? (
                        <>تمت الإضافة بنجاح</>
                      ) : (
                        <>
                          <ShoppingCart size={24} />
                          أضف إلى السلة
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
