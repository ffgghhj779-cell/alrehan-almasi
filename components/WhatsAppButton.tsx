"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ShoppingBag, X, FileDown, PackageOpen } from 'lucide-react';
import { useQuote } from './QuoteContext';
import { useAuth } from './AuthContext';
import { generateProformaInvoice } from '@/utils/generatePDF';
import { saveQuoteToDatabase } from '@/lib/quotes';
import CsvUploader from './CsvUploader';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000';

function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-primary/10 to-green-accent/10 flex items-center justify-center mb-4">
        <PackageOpen className="text-blue-primary" size={28} aria-hidden="true" />
      </div>
      <h4 className="font-cairo font-bold text-blue-deep text-base mb-2">
        قائمة التسعير فارغة
      </h4>
      <p className="text-gray-500 font-tajawal text-sm mb-5 max-w-[220px] leading-relaxed">
        أضف منتجات من الكatalog أو ارفع طلباً جاهزاً عبر ملف CSV
      </p>
      <CsvUploader label="رفع طلبات عبر CSV" />
    </div>
  );
}

export default function WhatsAppButton() {
  const { items, removeItem, clearCart } = useQuote();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setSaveError(null);
  }, []);

  useEscapeKey(closePanel, isOpen);
  useFocusTrap(panelRef, isOpen);

  const handleSendQuote = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const saved = await saveQuoteToDatabase(items, user?.id ?? null);

      let message = 'مرحباً الرهان الماسي، أود طلب عرض سعر للمنتجات التالية:\n\n';
      if (saved?.referenceCode) {
        message += `رقم المرجع: ${saved.referenceCode}\n\n`;
      }
      items.forEach((item) => {
        message += `- ${item.name} (الكمية: ${item.quantity})\n`;
      });

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        '_blank'
      );

      clearCart();
      closePanel();
    } catch {
      setSaveError('تعذّر حفظ الطلب. يمكنك إعادة المحاولة أو الإرسال مباشرة عبر واتساب.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneralContact = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً الرهان الماسي، أود الاستفسار عن خدمات التوريد.')}`,
      '_blank'
    );
  };

  const handleDownloadPDF = () => {
    generateProformaInvoice(items);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-blue-deep/20 backdrop-blur-[2px] z-40"
              onClick={closePanel}
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-dialog-title"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 md:right-8 z-50 w-auto sm:w-80 max-w-[calc(100vw-2rem)] glass-panel luxury-shadow border border-blue-primary/10 flex flex-col gpu-accelerated"
            >
              <div className="bg-blue-deep text-white p-4 flex justify-between items-center border-b-4 border-orange-accent">
                <h3
                  id="cart-dialog-title"
                  className="font-cairo font-bold text-lg flex items-center gap-2"
                >
                  <ShoppingBag size={20} aria-hidden="true" />
                  قائمة طلب التسعير
                </h3>
                <button
                  type="button"
                  onClick={closePanel}
                  className="hover:text-orange-accent transition-colors p-1"
                  aria-label="إغلاق قائمة التسعير"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto p-4 flex flex-col gap-3">
                {items.length === 0 ? (
                  <CartEmptyState />
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-secondary p-3 border border-gray-100"
                    >
                      <div>
                        <h4 className="font-bold text-blue-deep text-sm font-cairo">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 font-tajawal">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        aria-label={`حذف ${item.name} من القائمة`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {saveError && (
                <p className="px-4 py-2 text-xs text-orange-accent font-tajawal bg-orange-accent/5 border-t border-orange-accent/20" role="alert">
                  {saveError}
                </p>
              )}

              {items.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSendQuote}
                    disabled={isSaving}
                    className="w-full bg-green-bright text-white font-bold py-3 flex items-center justify-center gap-2 hover:bg-green-accent transition-colors luxury-shadow disabled:opacity-60"
                  >
                    <MessageCircle size={20} aria-hidden="true" />
                    {isSaving ? 'جاري الحفظ...' : 'إرسال الطلب عبر واتساب'}
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="flex-1 bg-blue-deep text-white font-bold py-2 flex items-center justify-center gap-2 hover:bg-blue-primary transition-colors text-sm"
                    >
                      <FileDown size={16} aria-hidden="true" />
                      تحميل PDF
                    </button>
                    <CsvUploader variant="compact" label="رفع CSV" />
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => (itemCount > 0 ? setIsOpen(!isOpen) : handleGeneralContact())}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-blue-deep text-white p-4 luxury-shadow-lg hover:bg-blue-primary transition-colors flex items-center justify-center group border border-orange-accent/30 glass-panel gpu-accelerated"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={
          itemCount > 0
            ? `عرض قائمة التسعير (${itemCount} منتج)`
            : 'تواصل معنا عبر واتساب'
        }
        aria-expanded={isOpen}
      >
        {itemCount > 0 ? (
          <ShoppingBag size={32} fill="currentColor" className="text-orange-accent" />
        ) : (
          <MessageCircle size={32} fill="currentColor" className="text-green-bright" />
        )}

        {itemCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-orange-accent text-white text-xs font-bold w-6 h-6 flex items-center justify-center luxury-shadow"
            aria-hidden="true"
          >
            {itemCount}
          </span>
        )}

        {itemCount === 0 && (
          <span className="absolute w-full h-full bg-green-bright opacity-30 animate-ping -z-10 rounded-full" aria-hidden="true" />
        )}

        <span className="absolute right-full mr-4 bg-white text-text-dark font-cairo font-bold text-sm py-2 px-4 luxury-shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-orange-accent/20 hidden md:block">
          {itemCount > 0 ? 'عرض قائمة التسعير' : 'تواصل معنا لطلب عرض سعر'}
        </span>
      </motion.button>
    </>
  );
}
