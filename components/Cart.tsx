"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  X,
  PackageOpen,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  CheckCircle2,
  MessageCircle,
  Banknote,
  Loader2,
} from 'lucide-react';
import { useQuote } from './QuoteContext';
import { useAuth } from './AuthContext';
import BottomSheet from './BottomSheet';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateOrderTotals, formatSar } from '@/lib/checkout';
import { saveOrderToDatabase, type CustomerDetails } from '@/lib/orders';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966560706018';

type CheckoutStep = 'summary' | 'checkout' | 'success';

type OrderFormState = {
  fullName: string;
  phone: string;
  address: string;
};

const EMPTY_FORM: OrderFormState = {
  fullName: '',
  phone: '',
  address: '',
};

function CartHeader({
  title,
  onClose,
  onBack,
  showBack,
}: {
  title: string;
  onClose: () => void;
  onBack?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="bg-blue-deep text-white px-4 py-3.5 flex items-center justify-between border-b-4 border-orange-accent shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="touch-target touch-press active:scale-95 shrink-0"
            aria-label="رجوع"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <h3 id="cart-dialog-title" className="font-cairo font-bold text-base sm:text-lg truncate">
          {title}
        </h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="hover:text-orange-accent transition-colors touch-target touch-press active:scale-95 shrink-0"
        aria-label="إغلاق السلة"
      >
        <X size={22} />
      </button>
    </div>
  );
}

function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-primary/10 to-green-accent/10 flex items-center justify-center mb-4">
        <PackageOpen className="text-blue-primary" size={28} aria-hidden="true" />
      </div>
      <h4 className="font-cairo font-bold text-blue-deep text-base mb-2">سلتك فارغة</h4>
      <p className="text-gray-500 font-tajawal text-sm max-w-[240px] leading-relaxed">
        أضف منتجات من الكatalog وتابع الطلب بخطوات بسيطة
      </p>
    </div>
  );
}

function OrderTotals({ subtotal, vatAmount, total }: { subtotal: number; vatAmount: number; total: number }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-sm font-tajawal">
      <div className="flex justify-between text-gray-600">
        <span>المجموع الفرعي</span>
        <span className="font-semibold text-text-dark">{formatSar(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>ضريبة القيمة المضافة (15%)</span>
        <span className="font-semibold text-text-dark">{formatSar(vatAmount)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-200 font-cairo font-bold text-blue-deep text-base">
        <span>الإجمالي</span>
        <span>{formatSar(total)}</span>
      </div>
    </div>
  );
}

function CartSummaryStep({
  onProceed,
}: {
  onProceed: () => void;
}) {
  const { items, incrementItem, decrementItem, removeItem } = useQuote();
  const totals = useMemo(() => calculateOrderTotals(items), [items]);

  if (items.length === 0) return <CartEmptyState />;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="overflow-y-auto flex-1 min-h-0 px-4 py-3 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 items-start"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-cairo font-bold text-sm text-blue-deep line-clamp-2">{item.name}</h4>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{item.sku}</p>
              <p className="text-sm font-bold text-blue-primary mt-1.5">
                {formatSar(item.unitPrice)}{' '}
                <span className="text-xs font-normal text-gray-500">/ {item.unitLabel}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-600 touch-target touch-press"
                aria-label={`حذف ${item.name}`}
              >
                <Trash2 size={16} />
              </button>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => decrementItem(item.id)}
                  className="w-9 h-9 flex items-center justify-center touch-press active:scale-95"
                  aria-label="تقليل الكمية"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-bold font-cairo">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => incrementItem(item.id)}
                  className="w-9 h-9 flex items-center justify-center touch-press active:scale-95"
                  aria-label="زيادة الكمية"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs font-bold text-text-dark">
                {formatSar(item.unitPrice * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 p-4 border-t border-gray-100 bg-white space-y-3">
        <OrderTotals {...totals} />
        <button
          type="button"
          onClick={onProceed}
          className="w-full bg-orange-accent text-white font-cairo font-bold py-3.5 rounded-xl luxury-shadow touch-press active:scale-[0.98] min-h-[48px]"
        >
          متابعة الطلب
        </button>
      </div>
    </div>
  );
}

function CheckoutFormStep({
  form,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  totals,
}: {
  form: OrderFormState;
  onChange: (field: keyof OrderFormState, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  totals: ReturnType<typeof calculateOrderTotals>;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="overflow-y-auto flex-1 min-h-0 px-4 py-4 space-y-4">
        <OrderTotals {...totals} />

        <div className="space-y-3">
          <div>
            <label htmlFor="checkout-name" className="block text-sm font-bold font-cairo text-blue-deep mb-1.5">
              الاسم بالكامل
            </label>
            <input
              id="checkout-name"
              type="text"
              value={form.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-tajawal text-sm focus:outline-none focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 min-h-[48px]"
              placeholder="مثال: محمد أحمد العتيبي"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="checkout-phone" className="block text-sm font-bold font-cairo text-blue-deep mb-1.5">
              رقم الجوال
            </label>
            <input
              id="checkout-phone"
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-tajawal text-sm focus:outline-none focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 min-h-[48px]"
              placeholder="05XXXXXXXX"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="checkout-address" className="block text-sm font-bold font-cairo text-blue-deep mb-1.5">
              عنوان التوصيل التفصيلي
            </label>
            <textarea
              id="checkout-address"
              value={form.address}
              onChange={(e) => onChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-tajawal text-sm focus:outline-none focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 resize-none"
              placeholder="الحي، الشارع، رقم المبنى، ملاحظات إضافية..."
            />
          </div>
        </div>

        <div className="bg-green-accent/5 border border-green-accent/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-accent/10 flex items-center justify-center shrink-0">
              <Banknote className="text-green-accent" size={20} />
            </div>
            <div>
              <p className="font-cairo font-bold text-sm text-blue-deep">الدفع عند الاستلام</p>
              <p className="text-xs text-gray-500 font-tajawal">كاش أو شبكة — الطريقة الوحيدة حالياً</p>
            </div>
            <CheckCircle2 className="text-green-accent mr-auto shrink-0" size={20} />
          </div>
        </div>

        {error && (
          <p className="text-xs text-orange-accent font-tajawal bg-orange-accent/5 p-3 rounded-lg" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-bright text-white font-cairo font-bold py-3.5 rounded-xl luxury-shadow touch-press active:scale-[0.98] min-h-[48px] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              جاري تأكيد الطلب...
            </>
          ) : (
            `تأكيد الطلب — ${formatSar(totals.total)}`
          )}
        </button>
      </div>
    </div>
  );
}

function OrderSuccessStep({
  orderNumber,
  onClose,
}: {
  orderNumber: string;
  onClose: () => void;
}) {
  const handleSupport = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `مرحباً الرهان الماسي، أود الاستفسار عن طلبي رقم ${orderNumber}`
      )}`,
      '_blank'
    );
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-green-accent/10 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="text-green-accent" size={48} />
      </motion.div>
      <h3 className="font-cairo font-black text-2xl text-blue-deep mb-2">تم استلام طلبك!</h3>
      <p className="text-gray-600 font-tajawal text-sm mb-6 max-w-[280px] leading-relaxed">
        شكراً لثقتك بالرهان الماسي. سيتواصل معك فريقنا قريباً لتأكيد التوصيل.
      </p>
      <div className="bg-gray-50 border border-blue-primary/10 rounded-2xl px-6 py-4 mb-8 w-full max-w-xs">
        <p className="text-xs text-gray-500 font-tajawal mb-1">رقم الطلب</p>
        <p className="font-mono font-bold text-xl text-orange-accent">#{orderNumber}</p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-blue-deep text-white font-cairo font-bold py-3.5 rounded-xl touch-press active:scale-[0.98] min-h-[48px]"
        >
          متابعة التسوق
        </button>
        <button
          type="button"
          onClick={handleSupport}
          className="w-full border border-green-bright text-green-accent font-cairo font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 touch-press active:scale-[0.98] min-h-[48px]"
        >
          <MessageCircle size={18} />
          تواصل مع الدعم
        </button>
      </div>
    </div>
  );
}

function CartPanel({
  step,
  onClose,
  onBack,
  form,
  onFormChange,
  onProceed,
  onSubmit,
  isSubmitting,
  error,
  orderNumber,
  totals,
}: {
  step: CheckoutStep;
  onClose: () => void;
  onBack: () => void;
  form: OrderFormState;
  onFormChange: (field: keyof OrderFormState, value: string) => void;
  onProceed: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  orderNumber: string | null;
  totals: ReturnType<typeof calculateOrderTotals>;
}) {
  const titles: Record<CheckoutStep, string> = {
    summary: 'سلة التسوق',
    checkout: 'إتمام الطلب',
    success: 'تأكيد الطلب',
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {step !== 'success' && (
        <CartHeader
          title={titles[step]}
          onClose={onClose}
          onBack={onBack}
          showBack={step === 'checkout'}
        />
      )}
      {step === 'summary' && <CartSummaryStep onProceed={onProceed} />}
      {step === 'checkout' && (
        <CheckoutFormStep
          form={form}
          onChange={onFormChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          error={error}
          totals={totals}
        />
      )}
      {step === 'success' && orderNumber && (
        <OrderSuccessStep orderNumber={orderNumber} onClose={onClose} />
      )}
    </div>
  );
}

export default function Cart() {
  const { items, clearCart } = useQuote();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('summary');
  const [form, setForm] = useState<OrderFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totals = useMemo(() => calculateOrderTotals(items), [items]);

  const resetCheckout = useCallback(() => {
    setStep('summary');
    setForm(EMPTY_FORM);
    setError(null);
    setOrderNumber(null);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-cart', handleOpen);
    return () => window.removeEventListener('open-cart', handleOpen);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(resetCheckout, 300);
  }, [resetCheckout]);

  useEscapeKey(closePanel, isOpen && !isMobile);
  useFocusTrap(panelRef, isOpen && !isMobile && step !== 'success');

  const handleProceed = () => {
    if (items.length === 0) return;
    setStep('checkout');
    setError(null);
  };

  const handleBack = () => {
    setStep('summary');
    setError(null);
  };

  const handleFormChange = (field: keyof OrderFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const customer: CustomerDetails = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };
      const result = await saveOrderToDatabase(items, customer, user?.id ?? null);
      setOrderNumber(result.orderNumber);
      clearCart();
      setStep('success');
    } catch {
      setError('تعذّر حفظ الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const panelContent = (
    <CartPanel
      step={step}
      onClose={closePanel}
      onBack={handleBack}
      form={form}
      onFormChange={handleFormChange}
      onProceed={handleProceed}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      orderNumber={orderNumber}
      totals={totals}
    />
  );

  return (
    <>
      {isMobile ? (
        <BottomSheet
          isOpen={isOpen}
          onClose={closePanel}
          ariaLabelledBy="cart-dialog-title"
          maxHeightClass="h-[90vh] max-h-[90vh] rounded-t-3xl"
          sheetClassName="rounded-t-3xl"
        >
          {panelContent}
        </BottomSheet>
      ) : (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-blue-deep/25 backdrop-blur-[2px] z-40 gpu-layer"
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
                className="fixed bottom-8 right-8 z-50 w-[min(420px,calc(100vw-2rem))] glass-panel luxury-shadow border border-blue-primary/10 flex flex-col gpu-layer max-h-[min(36rem,88vh)] rounded-2xl overflow-hidden"
                style={{ willChange: 'transform, opacity' }}
              >
                {panelContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed fixed-bottom-safe fixed-right-safe z-50 bg-blue-deep text-white p-4 min-w-[56px] min-h-[56px] luxury-shadow-lg hover:bg-blue-primary transition-colors flex items-center justify-center group border border-orange-accent/30 glass-panel gpu-layer touch-press rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
        whileTap={{ scale: 0.92 }}
        aria-label={itemCount > 0 ? `عرض السلة (${itemCount} منتج)` : 'عرض السلة'}
        aria-expanded={isOpen}
      >
        <ShoppingBag size={28} fill="currentColor" className="text-orange-accent" />
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-orange-accent text-white text-[11px] font-bold min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-full luxury-shadow"
            aria-hidden="true"
          >
            {itemCount}
          </span>
        )}
      </motion.button>
    </>
  );
}
